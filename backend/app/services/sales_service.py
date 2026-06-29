"""
Sales Service — pipeline conversions, customer management, deal progression.

Handles:
- Convert Quotation → Sales Order
- Convert Estimate → Invoice
- Convert Lead → Deal
- Deal stage progression
"""

import logging
from datetime import datetime
from typing import Optional
from decimal import Decimal

from sqlalchemy import select, delete as sa_delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.sales import (
    Lead, Deal, Quotation, QuotationItem,
    SalesOrder, SalesOrderItem, Customer,
)
from app.models.finance import Invoice, InvoiceItem, Estimate, EstimateItem
from app.services.event_bus import event_bus

logger = logging.getLogger("sales_service")


async def convert_quotation_to_order(
    db: AsyncSession,
    *,
    company_id: int,
    quotation_id: int,
    order_number: str,
    created_by: int,
) -> SalesOrder:
    """Convert an approved quotation into a sales order.

    Copies items from the quotation to the new sales order,
    marks the quotation as 'converted', and links them.
    """
    result = await db.execute(
        select(Quotation)
        .options(selectinload(Quotation.items))
        .where(
            Quotation.id == quotation_id,
            Quotation.company_id == company_id,
            Quotation.deleted_at.is_(None),
        )
    )
    quotation = result.scalar_one_or_none()
    if not quotation:
        raise ValueError(f"Quotation {quotation_id} not found")

    if quotation.converted_to_order_id:
        raise ValueError(f"Quotation {quotation_id} already converted to order")

    # Create the sales order
    order = SalesOrder(
        company_id=company_id,
        order_number=order_number,
        customer_id=quotation.customer_id,
        quotation_id=quotation_id,
        status="confirmed",
        subtotal=quotation.subtotal,
        tax=quotation.tax,
        total=quotation.total,
    )
    db.add(order)
    await db.flush()
    await db.refresh(order)

    # Copy items
    for qi in quotation.items:
        item = SalesOrderItem(
            sales_order_id=order.id,
            item_id=qi.item_id,
            qty=qi.qty,
            price=qi.price,
            tax=qi.tax,
            total=qi.total,
        )
        db.add(item)

    # Mark quotation as converted
    quotation.status = "converted"
    quotation.converted_to_order_id = order.id

    await db.flush()

    # Emit event
    await event_bus.emit("quotation.converted_to_order",
                         company_id=company_id,
                         quotation_id=quotation_id,
                         order_id=order.id)

    # Reload with items
    result = await db.execute(
        select(SalesOrder)
        .options(selectinload(SalesOrder.items))
        .where(SalesOrder.id == order.id)
    )
    order = result.scalars().unique().one()

    logger.info("Quotation %s converted to Sales Order %s", quotation_id, order.id)
    return order


async def convert_estimate_to_invoice(
    db: AsyncSession,
    *,
    company_id: int,
    estimate_id: int,
    invoice_number: str,
    created_by: int,
) -> Invoice:
    """Convert an approved estimate into an invoice.

    Copies items from the estimate to the new invoice,
    marks the estimate as 'converted', and links them.
    """
    result = await db.execute(
        select(Estimate)
        .options(selectinload(Estimate.items))
        .where(
            Estimate.id == estimate_id,
            Estimate.company_id == company_id,
            Estimate.deleted_at.is_(None),
        )
    )
    estimate = result.scalar_one_or_none()
    if not estimate:
        raise ValueError(f"Estimate {estimate_id} not found")

    if estimate.converted_to_invoice_id:
        raise ValueError(f"Estimate {estimate_id} already converted to invoice")

    # Create the invoice
    invoice = Invoice(
        company_id=company_id,
        customer_id=estimate.customer_id,
        invoice_number=invoice_number,
        subtotal=estimate.subtotal,
        tax=estimate.tax,
        total=estimate.total,
        status="sent",
        paid_amount=0,
        balance_due=estimate.total,
    )
    db.add(invoice)
    await db.flush()
    await db.refresh(invoice)

    # Copy items
    for ei in estimate.items:
        item = InvoiceItem(
            invoice_id=invoice.id,
            item_id=ei.item_id,
            description=f"From Estimate #{estimate_id}",
            quantity=ei.qty,
            unit_price=ei.price,
            tax=0,
            total=ei.total,
        )
        db.add(item)

    # Mark estimate as converted
    estimate.status = "converted"
    estimate.converted_to_invoice_id = invoice.id

    await db.flush()

    # Post to GL
    from app.services.finance_service import post_invoice_to_gl
    await post_invoice_to_gl(
        db, company_id=company_id,
        invoice_id=invoice.id,
        customer_id=estimate.customer_id,
        total=estimate.total or 0,
        subtotal=estimate.subtotal or 0,
        tax=estimate.tax or 0,
        created_by=created_by,
    )

    # Emit event
    await event_bus.emit("estimate.converted_to_invoice",
                         company_id=company_id,
                         estimate_id=estimate_id,
                         invoice_id=invoice.id)

    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.items))
        .where(Invoice.id == invoice.id)
    )
    invoice = result.scalars().unique().one()

    logger.info("Estimate %s converted to Invoice %s", estimate_id, invoice.id)
    return invoice


async def convert_lead_to_customer(
    db: AsyncSession,
    *,
    company_id: int,
    lead_id: int,
    convert_to_deal: bool = True,
) -> tuple[Optional[Customer], Optional[Deal]]:
    """Convert a qualified lead into a customer (and optionally a deal)."""
    result = await db.execute(
        select(Lead).where(
            Lead.id == lead_id,
            Lead.company_id == company_id,
            Lead.deleted_at.is_(None),
        )
    )
    lead = result.scalar_one_or_none()
    if not lead:
        raise ValueError(f"Lead {lead_id} not found")

    # Create customer from lead data
    customer = Customer(
        company_id=company_id,
        name=lead.name,
        email=lead.email,
        phone=lead.phone,
        status="active",
    )
    db.add(customer)
    await db.flush()
    await db.refresh(customer)

    # Mark lead as converted
    lead.status = "converted"

    deal = None
    if convert_to_deal:
        deal = Deal(
            company_id=company_id,
            lead_id=lead_id,
            title=f"Deal - {lead.name}",
            stage="qualification",
            status="open",
        )
        db.add(deal)
        await db.flush()
        await db.refresh(deal)

    await db.flush()

    await event_bus.emit("lead.converted",
                         company_id=company_id,
                         lead_id=lead_id,
                         customer_id=customer.id)

    logger.info("Lead %s converted to Customer %s", lead_id, customer.id)
    return customer, deal
