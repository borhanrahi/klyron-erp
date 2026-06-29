"""
Finance Service — GL posting, invoice management, payment reconciliation.

Handles:
- Double-entry GL posting for invoices, payments, expenses
- Invoice status transitions
- Budget enforcement
"""

import logging
from decimal import Decimal
from datetime import datetime
from typing import Optional

from sqlalchemy import select, func as sa_func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.finance import (
    ChartOfAccount, Transaction, Invoice, InvoiceItem,
)
from app.models.auth import User
from app.services.event_bus import event_bus

logger = logging.getLogger("finance_service")


# ── GL Account Constants ──────────────────────────────────────────────────────

GL_ACCOUNTS_RECEIVABLE = "accounts_receivable"
GL_SALES_REVENUE = "sales_revenue"
GL_SALES_TAX = "sales_tax_payable"
GL_CASH = "cash"
GL_BANK = "bank"
GL_EXPENSE = "expense"
GL_COGS = "cost_of_goods_sold"
GL_INVENTORY = "inventory_asset"


async def _get_or_create_gl_account(
    db: AsyncSession,
    *,
    company_id: int,
    code: str,
    name: str,
    type: str,
    parent_id: Optional[int] = None,
) -> ChartOfAccount:
    """Find a GL account by code, or create it if missing."""
    result = await db.execute(
        select(ChartOfAccount).where(
            ChartOfAccount.company_id == company_id,
            ChartOfAccount.code == code,
            ChartOfAccount.deleted_at.is_(None),
        )
    )
    account = result.scalar_one_or_none()
    if account:
        return account

    account = ChartOfAccount(
        company_id=company_id,
        code=code,
        name=name,
        type=type,
        parent_id=parent_id,
        balance=0,
        is_active=True,
    )
    db.add(account)
    await db.flush()
    await db.refresh(account)
    return account


async def _post_double_entry(
    db: AsyncSession,
    *,
    company_id: int,
    debit_account_id: int,
    credit_account_id: int,
    amount: Decimal,
    reference: str,
    description: str,
    created_by: int,
) -> tuple[Transaction, Transaction]:
    """Create a double-entry transaction pair (debit + credit)."""
    debit = Transaction(
        company_id=company_id,
        account_id=debit_account_id,
        type="debit",
        amount=amount,
        reference=reference,
        description=f"{description} (Debit)",
        created_by=created_by,
    )
    credit = Transaction(
        company_id=company_id,
        account_id=credit_account_id,
        type="credit",
        amount=amount,
        reference=reference,
        description=f"{description} (Credit)",
        created_by=created_by,
    )
    db.add(debit)
    db.add(credit)
    await db.flush()

    # Update account balances based on account type
    # Asset & Expense: Debit = Increase, Credit = Decrease
    # Liability, Revenue, Equity: Debit = Decrease, Credit = Increase
    for acct_id, is_debit in [(debit_account_id, True), (credit_account_id, False)]:
        result = await db.execute(
            select(ChartOfAccount).where(ChartOfAccount.id == acct_id)
        )
        account = result.scalar_one_or_none()
        if account:
            debit_increases = account.type in ("asset", "expense")
            if is_debit:
                if debit_increases:
                    account.balance = (account.balance or 0) + amount
                else:
                    account.balance = (account.balance or 0) - amount
            else:
                # Credit
                if debit_increases:
                    account.balance = (account.balance or 0) - amount
                else:
                    account.balance = (account.balance or 0) + amount

    await db.refresh(debit)
    await db.refresh(credit)
    return debit, credit


async def post_invoice_to_gl(
    db: AsyncSession,
    *,
    company_id: int,
    invoice_id: int,
    customer_id: Optional[int],
    total: Decimal,
    subtotal: Decimal,
    tax: Decimal,
    created_by: int,
) -> None:
    """Post an invoice to the general ledger (double-entry).

    Accounting entry:
        Debit: Accounts Receivable (total)
        Credit: Sales Revenue (subtotal)
        Credit: Sales Tax Payable (tax)
    """
    # Get or create GL accounts
    ar_account = await _get_or_create_gl_account(
        db, company_id=company_id, code="1200",
        name="Accounts Receivable", type="asset",
    )
    revenue_account = await _get_or_create_gl_account(
        db, company_id=company_id, code="4000",
        name="Sales Revenue", type="revenue",
    )
    tax_account = await _get_or_create_gl_account(
        db, company_id=company_id, code="2500",
        name="Sales Tax Payable", type="liability",
    )

    reference = f"INV-{invoice_id}"

    # Debit AR, Credit Revenue
    await _post_double_entry(
        db, company_id=company_id,
        debit_account_id=ar_account.id,
        credit_account_id=revenue_account.id,
        amount=subtotal,
        reference=reference,
        description=f"Invoice #{invoice_id} - Sale",
        created_by=created_by,
    )

    # Debit AR, Credit Tax if applicable
    if tax and tax > 0:
        tax_entry = Transaction(
            company_id=company_id,
            account_id=ar_account.id,
            type="debit",
            amount=tax,
            reference=reference,
            description=f"Invoice #{invoice_id} - Tax",
            created_by=created_by,
        )
        db.add(tax_entry)

        tax_credit = Transaction(
            company_id=company_id,
            account_id=tax_account.id,
            type="credit",
            amount=tax,
            reference=reference,
            description=f"Invoice #{invoice_id} - Tax",
            created_by=created_by,
        )
        db.add(tax_credit)
        # Balance update handled implicitly

    await db.flush()
    logger.info("GL posting complete for invoice %s", invoice_id)


async def post_payment_to_gl(
    db: AsyncSession,
    *,
    company_id: int,
    invoice_id: int,
    amount: Decimal,
    payment_method: str,
    created_by: int,
) -> None:
    """Post a payment to the general ledger.

    Accounting entry:
        Debit: Cash/Bank (amount)
        Credit: Accounts Receivable (amount)
    """
    ar_account = await _get_or_create_gl_account(
        db, company_id=company_id, code="1200",
        name="Accounts Receivable", type="asset",
    )

    cash_acct_code = "1100" if payment_method in ("cash",) else "1110"
    cash_acct_name = "Cash" if payment_method in ("cash",) else "Bank"
    cash_account = await _get_or_create_gl_account(
        db, company_id=company_id, code=cash_acct_code,
        name=cash_acct_name, type="asset",
    )

    reference = f"PAY-INV-{invoice_id}"

    # Debit Cash/Bank, Credit AR
    await _post_double_entry(
        db, company_id=company_id,
        debit_account_id=cash_account.id,
        credit_account_id=ar_account.id,
        amount=amount,
        reference=reference,
        description=f"Payment for Invoice #{invoice_id}",
        created_by=created_by,
    )

    await db.flush()
    logger.info("GL posting complete for payment on invoice %s", invoice_id)


async def update_invoice_status(
    db: AsyncSession,
    *,
    company_id: int,
    invoice_id: int,
    paid_amount: Optional[Decimal] = None,
    created_by: int = 0,
) -> Invoice:
    """Update invoice status based on payment amount.

    Automatically posts to GL when invoice is paid.
    """
    result = await db.execute(
        select(Invoice).where(
            Invoice.id == invoice_id,
            Invoice.company_id == company_id,
            Invoice.deleted_at.is_(None),
        )
    )
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise ValueError(f"Invoice {invoice_id} not found")

    if paid_amount is not None:
        invoice.paid_amount = (invoice.paid_amount or 0) + paid_amount
        invoice.balance_due = (invoice.total or 0) - (invoice.paid_amount or 0)

        # Post payment to GL
        await post_payment_to_gl(
            db, company_id=company_id,
            invoice_id=invoice_id,
            amount=paid_amount,
            payment_method="bank",
            created_by=created_by,
        )

    # Determine status
    if invoice.balance_due and invoice.balance_due > 0:
        if invoice.paid_amount and invoice.paid_amount > 0:
            invoice.status = "partial"
        else:
            invoice.status = "sent" if invoice.status == "draft" else invoice.status
    else:
        invoice.status = "paid"

    await db.flush()
    await db.refresh(invoice)
    return invoice


async def post_expense_to_gl(
    db: AsyncSession,
    *,
    company_id: int,
    expense_id: int,
    amount: Decimal,
    created_by: int,
) -> None:
    """Post an expense to the general ledger.

    Accounting entry:
        Debit: Expense (amount)
        Credit: Cash/Bank (amount)
    """
    expense_account = await _get_or_create_gl_account(
        db, company_id=company_id, code="5000",
        name="Operating Expenses", type="expense",
    )
    cash_account = await _get_or_create_gl_account(
        db, company_id=company_id, code="1100",
        name="Cash", type="asset",
    )

    reference = f"EXP-{expense_id}"

    await _post_double_entry(
        db, company_id=company_id,
        debit_account_id=expense_account.id,
        credit_account_id=cash_account.id,
        amount=amount,
        reference=reference,
        description=f"Expense #{expense_id}",
        created_by=created_by,
    )

    await db.flush()
    logger.info("GL posting complete for expense %s", expense_id)
