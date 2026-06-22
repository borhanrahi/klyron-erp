from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from sqlalchemy.orm import selectinload
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.dependencies.auth import require_company
from app.models.auth import User
from app.models.finance import (
    BankAccount, BankTransfer, ChartOfAccount, Transaction,
    Invoice, InvoiceItem, CreditNote, DebitNote,
    Estimate, EstimateItem, Expense, Budget, TaxRate,
)
from app.schemas.finance import (
    BankAccountCreate, BankAccountUpdate, BankAccountResponse,
    BankTransferCreate, BankTransferUpdate, BankTransferResponse,
    ChartOfAccountCreate, ChartOfAccountUpdate, ChartOfAccountResponse,
    TransactionCreate, TransactionUpdate, TransactionResponse,
    InvoiceCreate, InvoiceUpdate, InvoiceResponse,
    CreditNoteCreate, CreditNoteUpdate, CreditNoteResponse,
    DebitNoteCreate, DebitNoteUpdate, DebitNoteResponse,
    EstimateCreate, EstimateUpdate, EstimateResponse,
    ExpenseCreate, ExpenseUpdate, ExpenseResponse,
    BudgetCreate, BudgetUpdate, BudgetResponse,
    TaxRateCreate, TaxRateUpdate, TaxRateResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/finance", tags=["Finance"])


# ── Bank Accounts ──

@router.get("/bank-accounts", response_model=PaginatedResponse)
async def list_bank_accounts(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(BankAccount).where(
        BankAccount.company_id == current_user.company_id,
        BankAccount.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(BankAccount).where(
        BankAccount.company_id == current_user.company_id,
        BankAccount.deleted_at.is_(None),
    )

    if search:
        query = query.where(BankAccount.name.ilike(f"%{search}%"))
        count_query = count_query.where(BankAccount.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[BankAccountResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/bank-accounts/{bank_account_id}", response_model=ResponseModel)
async def get_bank_account(
    bank_account_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(BankAccount).where(
        BankAccount.id == bank_account_id,
        BankAccount.company_id == current_user.company_id,
        BankAccount.deleted_at.is_(None),
    ))
    bank_account = result.scalar_one_or_none()
    if not bank_account:
        raise HTTPException(status_code=404, detail="Bank account not found")
    return ResponseModel(data=BankAccountResponse.model_validate(bank_account))


@router.post("/bank-accounts", response_model=ResponseModel, status_code=201)
async def create_bank_account(
    data: BankAccountCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    bank_account = BankAccount(**data.model_dump())
    db.add(bank_account)
    await db.flush()
    await db.refresh(bank_account)
    return ResponseModel(data=BankAccountResponse.model_validate(bank_account))


@router.put("/bank-accounts/{bank_account_id}", response_model=ResponseModel)
async def update_bank_account(
    bank_account_id: int,
    data: BankAccountUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(BankAccount).where(
        BankAccount.id == bank_account_id,
        BankAccount.company_id == current_user.company_id,
        BankAccount.deleted_at.is_(None),
    ))
    bank_account = result.scalar_one_or_none()
    if not bank_account:
        raise HTTPException(status_code=404, detail="Bank account not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(bank_account, k, v)
    await db.flush()
    await db.refresh(bank_account)
    return ResponseModel(data=BankAccountResponse.model_validate(bank_account))


@router.delete("/bank-accounts/{bank_account_id}", response_model=ResponseModel)
async def delete_bank_account(
    bank_account_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(BankAccount).where(
        BankAccount.id == bank_account_id,
        BankAccount.company_id == current_user.company_id,
        BankAccount.deleted_at.is_(None),
    ))
    bank_account = result.scalar_one_or_none()
    if not bank_account:
        raise HTTPException(status_code=404, detail="Bank account not found")
    bank_account.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Bank account deleted")


# ── Bank Transfers ──

@router.get("/bank-transfers", response_model=PaginatedResponse)
async def list_bank_transfers(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(BankTransfer)
    count_query = select(sa_func.count()).select_from(BankTransfer)

    if search:
        query = query.where(BankTransfer.reference.ilike(f"%{search}%"))
        count_query = count_query.where(BankTransfer.reference.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(BankTransfer.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[BankTransferResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/bank-transfers/{bank_transfer_id}", response_model=ResponseModel)
async def get_bank_transfer(
    bank_transfer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(BankTransfer).where(BankTransfer.id == bank_transfer_id))
    bank_transfer = result.scalar_one_or_none()
    if not bank_transfer:
        raise HTTPException(status_code=404, detail="Bank transfer not found")
    return ResponseModel(data=BankTransferResponse.model_validate(bank_transfer))


@router.post("/bank-transfers", response_model=ResponseModel, status_code=201)
async def create_bank_transfer(
    data: BankTransferCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    bank_transfer = BankTransfer(**data.model_dump(), created_by=current_user.id)
    db.add(bank_transfer)
    await db.flush()
    await db.refresh(bank_transfer)
    return ResponseModel(data=BankTransferResponse.model_validate(bank_transfer))


@router.put("/bank-transfers/{bank_transfer_id}", response_model=ResponseModel)
async def update_bank_transfer(
    bank_transfer_id: int,
    data: BankTransferUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(BankTransfer).where(BankTransfer.id == bank_transfer_id))
    bank_transfer = result.scalar_one_or_none()
    if not bank_transfer:
        raise HTTPException(status_code=404, detail="Bank transfer not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(bank_transfer, k, v)
    await db.flush()
    await db.refresh(bank_transfer)
    return ResponseModel(data=BankTransferResponse.model_validate(bank_transfer))


# ── Chart of Accounts ──

@router.get("/chart-of-accounts", response_model=PaginatedResponse)
async def list_chart_of_accounts(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(ChartOfAccount).where(
        ChartOfAccount.company_id == current_user.company_id,
        ChartOfAccount.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(ChartOfAccount).where(
        ChartOfAccount.company_id == current_user.company_id,
        ChartOfAccount.deleted_at.is_(None),
    )

    if search:
        query = query.where(ChartOfAccount.name.ilike(f"%{search}%"))
        count_query = count_query.where(ChartOfAccount.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[ChartOfAccountResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/chart-of-accounts/{chart_of_account_id}", response_model=ResponseModel)
async def get_chart_of_account(
    chart_of_account_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(ChartOfAccount).where(
        ChartOfAccount.id == chart_of_account_id,
        ChartOfAccount.company_id == current_user.company_id,
        ChartOfAccount.deleted_at.is_(None),
    ))
    coa = result.scalar_one_or_none()
    if not coa:
        raise HTTPException(status_code=404, detail="Chart of account not found")
    return ResponseModel(data=ChartOfAccountResponse.model_validate(coa))


@router.post("/chart-of-accounts", response_model=ResponseModel, status_code=201)
async def create_chart_of_account(
    data: ChartOfAccountCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    coa = ChartOfAccount(**data.model_dump())
    db.add(coa)
    await db.flush()
    await db.refresh(coa)
    return ResponseModel(data=ChartOfAccountResponse.model_validate(coa))


@router.put("/chart-of-accounts/{chart_of_account_id}", response_model=ResponseModel)
async def update_chart_of_account(
    chart_of_account_id: int,
    data: ChartOfAccountUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(ChartOfAccount).where(
        ChartOfAccount.id == chart_of_account_id,
        ChartOfAccount.company_id == current_user.company_id,
        ChartOfAccount.deleted_at.is_(None),
    ))
    coa = result.scalar_one_or_none()
    if not coa:
        raise HTTPException(status_code=404, detail="Chart of account not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(coa, k, v)
    await db.flush()
    await db.refresh(coa)
    return ResponseModel(data=ChartOfAccountResponse.model_validate(coa))


@router.delete("/chart-of-accounts/{chart_of_account_id}", response_model=ResponseModel)
async def delete_chart_of_account(
    chart_of_account_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(ChartOfAccount).where(
        ChartOfAccount.id == chart_of_account_id,
        ChartOfAccount.company_id == current_user.company_id,
        ChartOfAccount.deleted_at.is_(None),
    ))
    coa = result.scalar_one_or_none()
    if not coa:
        raise HTTPException(status_code=404, detail="Chart of account not found")
    coa.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Chart of account deleted")


# ── Transactions ──

@router.get("/transactions", response_model=PaginatedResponse)
async def list_transactions(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Transaction).where(Transaction.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(Transaction).where(Transaction.company_id == current_user.company_id)

    if search:
        query = query.where(Transaction.reference.ilike(f"%{search}%"))
        count_query = count_query.where(Transaction.reference.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Transaction.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[TransactionResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/transactions/{transaction_id}", response_model=ResponseModel)
async def get_transaction(
    transaction_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Transaction).where(
        Transaction.id == transaction_id,
        Transaction.company_id == current_user.company_id,
    ))
    transaction = result.scalar_one_or_none()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return ResponseModel(data=TransactionResponse.model_validate(transaction))


@router.post("/transactions", response_model=ResponseModel, status_code=201)
async def create_transaction(
    data: TransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    transaction = Transaction(**data.model_dump(), created_by=current_user.id)
    db.add(transaction)
    await db.flush()
    await db.refresh(transaction)
    return ResponseModel(data=TransactionResponse.model_validate(transaction))


@router.put("/transactions/{transaction_id}", response_model=ResponseModel)
async def update_transaction(
    transaction_id: int,
    data: TransactionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Transaction).where(
        Transaction.id == transaction_id,
        Transaction.company_id == current_user.company_id,
    ))
    transaction = result.scalar_one_or_none()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(transaction, k, v)
    await db.flush()
    await db.refresh(transaction)
    return ResponseModel(data=TransactionResponse.model_validate(transaction))


# ── Invoices ──

@router.get("/invoices", response_model=PaginatedResponse)
async def list_invoices(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Invoice).options(selectinload(Invoice.items)).where(
        Invoice.company_id == current_user.company_id,
        Invoice.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Invoice).where(
        Invoice.company_id == current_user.company_id,
        Invoice.deleted_at.is_(None),
    )

    if search:
        query = query.where(Invoice.invoice_number.ilike(f"%{search}%"))
        count_query = count_query.where(Invoice.invoice_number.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[InvoiceResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/invoices/{invoice_id}", response_model=ResponseModel)
async def get_invoice(
    invoice_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Invoice).options(selectinload(Invoice.items)).where(
            Invoice.id == invoice_id,
            Invoice.company_id == current_user.company_id,
            Invoice.deleted_at.is_(None),
        )
    )
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return ResponseModel(data=InvoiceResponse.model_validate(invoice))


@router.post("/invoices", response_model=ResponseModel, status_code=201)
async def create_invoice(
    data: InvoiceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    items_data = data.model_dump().pop("items", [])
    invoice = Invoice(**data.model_dump(exclude={"items"}))
    db.add(invoice)
    await db.flush()

    for item_data in items_data:
        item = InvoiceItem(invoice_id=invoice.id, **item_data)
        db.add(item)
    await db.flush()

    result = await db.execute(
        select(Invoice).options(selectinload(Invoice.items)).where(Invoice.id == invoice.id)
    )
    invoice = result.scalar_one()
    return ResponseModel(data=InvoiceResponse.model_validate(invoice))


@router.put("/invoices/{invoice_id}", response_model=ResponseModel)
async def update_invoice(
    invoice_id: int,
    data: InvoiceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Invoice).options(selectinload(Invoice.items)).where(
            Invoice.id == invoice_id,
            Invoice.company_id == current_user.company_id,
            Invoice.deleted_at.is_(None),
        )
    )
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    update_data = data.model_dump(exclude_unset=True)
    items_data = update_data.pop("items", None)

    for k, v in update_data.items():
        setattr(invoice, k, v)

    if items_data is not None:
        for existing_item in invoice.items:
            await db.delete(existing_item)
        for item_data in items_data:
            item = InvoiceItem(invoice_id=invoice.id, **item_data)
            db.add(item)

    await db.flush()
    result = await db.execute(
        select(Invoice).options(selectinload(Invoice.items)).where(Invoice.id == invoice.id)
    )
    invoice = result.scalar_one()
    return ResponseModel(data=InvoiceResponse.model_validate(invoice))


@router.delete("/invoices/{invoice_id}", response_model=ResponseModel)
async def delete_invoice(
    invoice_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Invoice).where(
        Invoice.id == invoice_id,
        Invoice.company_id == current_user.company_id,
        Invoice.deleted_at.is_(None),
    ))
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    invoice.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Invoice deleted")


# ── Credit Notes ──

@router.get("/credit-notes", response_model=PaginatedResponse)
async def list_credit_notes(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(CreditNote).where(
        CreditNote.company_id == current_user.company_id,
        CreditNote.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(CreditNote).where(
        CreditNote.company_id == current_user.company_id,
        CreditNote.deleted_at.is_(None),
    )

    if search:
        query = query.where(CreditNote.credit_number.ilike(f"%{search}%"))
        count_query = count_query.where(CreditNote.credit_number.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[CreditNoteResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/credit-notes/{credit_note_id}", response_model=ResponseModel)
async def get_credit_note(
    credit_note_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(CreditNote).where(
        CreditNote.id == credit_note_id,
        CreditNote.company_id == current_user.company_id,
        CreditNote.deleted_at.is_(None),
    ))
    credit_note = result.scalar_one_or_none()
    if not credit_note:
        raise HTTPException(status_code=404, detail="Credit note not found")
    return ResponseModel(data=CreditNoteResponse.model_validate(credit_note))


@router.post("/credit-notes", response_model=ResponseModel, status_code=201)
async def create_credit_note(
    data: CreditNoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    credit_note = CreditNote(**data.model_dump())
    db.add(credit_note)
    await db.flush()
    await db.refresh(credit_note)
    return ResponseModel(data=CreditNoteResponse.model_validate(credit_note))


@router.put("/credit-notes/{credit_note_id}", response_model=ResponseModel)
async def update_credit_note(
    credit_note_id: int,
    data: CreditNoteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(CreditNote).where(
        CreditNote.id == credit_note_id,
        CreditNote.company_id == current_user.company_id,
        CreditNote.deleted_at.is_(None),
    ))
    credit_note = result.scalar_one_or_none()
    if not credit_note:
        raise HTTPException(status_code=404, detail="Credit note not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(credit_note, k, v)
    await db.flush()
    await db.refresh(credit_note)
    return ResponseModel(data=CreditNoteResponse.model_validate(credit_note))


@router.delete("/credit-notes/{credit_note_id}", response_model=ResponseModel)
async def delete_credit_note(
    credit_note_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(CreditNote).where(
        CreditNote.id == credit_note_id,
        CreditNote.company_id == current_user.company_id,
        CreditNote.deleted_at.is_(None),
    ))
    credit_note = result.scalar_one_or_none()
    if not credit_note:
        raise HTTPException(status_code=404, detail="Credit note not found")
    credit_note.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Credit note deleted")


# ── Debit Notes ──

@router.get("/debit-notes", response_model=PaginatedResponse)
async def list_debit_notes(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(DebitNote).where(
        DebitNote.company_id == current_user.company_id,
        DebitNote.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(DebitNote).where(
        DebitNote.company_id == current_user.company_id,
        DebitNote.deleted_at.is_(None),
    )

    if search:
        query = query.where(DebitNote.debit_number.ilike(f"%{search}%"))
        count_query = count_query.where(DebitNote.debit_number.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[DebitNoteResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/debit-notes/{debit_note_id}", response_model=ResponseModel)
async def get_debit_note(
    debit_note_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(DebitNote).where(
        DebitNote.id == debit_note_id,
        DebitNote.company_id == current_user.company_id,
        DebitNote.deleted_at.is_(None),
    ))
    debit_note = result.scalar_one_or_none()
    if not debit_note:
        raise HTTPException(status_code=404, detail="Debit note not found")
    return ResponseModel(data=DebitNoteResponse.model_validate(debit_note))


@router.post("/debit-notes", response_model=ResponseModel, status_code=201)
async def create_debit_note(
    data: DebitNoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    debit_note = DebitNote(**data.model_dump())
    db.add(debit_note)
    await db.flush()
    await db.refresh(debit_note)
    return ResponseModel(data=DebitNoteResponse.model_validate(debit_note))


@router.put("/debit-notes/{debit_note_id}", response_model=ResponseModel)
async def update_debit_note(
    debit_note_id: int,
    data: DebitNoteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(DebitNote).where(
        DebitNote.id == debit_note_id,
        DebitNote.company_id == current_user.company_id,
        DebitNote.deleted_at.is_(None),
    ))
    debit_note = result.scalar_one_or_none()
    if not debit_note:
        raise HTTPException(status_code=404, detail="Debit note not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(debit_note, k, v)
    await db.flush()
    await db.refresh(debit_note)
    return ResponseModel(data=DebitNoteResponse.model_validate(debit_note))


@router.delete("/debit-notes/{debit_note_id}", response_model=ResponseModel)
async def delete_debit_note(
    debit_note_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(DebitNote).where(
        DebitNote.id == debit_note_id,
        DebitNote.company_id == current_user.company_id,
        DebitNote.deleted_at.is_(None),
    ))
    debit_note = result.scalar_one_or_none()
    if not debit_note:
        raise HTTPException(status_code=404, detail="Debit note not found")
    debit_note.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Debit note deleted")


# ── Estimates ──

@router.get("/estimates", response_model=PaginatedResponse)
async def list_estimates(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Estimate).options(selectinload(Estimate.items)).where(
        Estimate.company_id == current_user.company_id,
        Estimate.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Estimate).where(
        Estimate.company_id == current_user.company_id,
        Estimate.deleted_at.is_(None),
    )

    if search:
        query = query.where(Estimate.estimate_number.ilike(f"%{search}%"))
        count_query = count_query.where(Estimate.estimate_number.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[EstimateResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/estimates/{estimate_id}", response_model=ResponseModel)
async def get_estimate(
    estimate_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Estimate).options(selectinload(Estimate.items)).where(
            Estimate.id == estimate_id,
            Estimate.company_id == current_user.company_id,
            Estimate.deleted_at.is_(None),
        )
    )
    estimate = result.scalar_one_or_none()
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")
    return ResponseModel(data=EstimateResponse.model_validate(estimate))


@router.post("/estimates", response_model=ResponseModel, status_code=201)
async def create_estimate(
    data: EstimateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    items_data = data.model_dump().pop("items", [])
    estimate = Estimate(**data.model_dump(exclude={"items"}))
    db.add(estimate)
    await db.flush()

    for item_data in items_data:
        item = EstimateItem(estimate_id=estimate.id, **item_data)
        db.add(item)
    await db.flush()

    result = await db.execute(
        select(Estimate).options(selectinload(Estimate.items)).where(Estimate.id == estimate.id)
    )
    estimate = result.scalar_one()
    return ResponseModel(data=EstimateResponse.model_validate(estimate))


@router.put("/estimates/{estimate_id}", response_model=ResponseModel)
async def update_estimate(
    estimate_id: int,
    data: EstimateUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Estimate).options(selectinload(Estimate.items)).where(
            Estimate.id == estimate_id,
            Estimate.company_id == current_user.company_id,
            Estimate.deleted_at.is_(None),
        )
    )
    estimate = result.scalar_one_or_none()
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")

    update_data = data.model_dump(exclude_unset=True)
    items_data = update_data.pop("items", None)

    for k, v in update_data.items():
        setattr(estimate, k, v)

    if items_data is not None:
        for existing_item in estimate.items:
            await db.delete(existing_item)
        for item_data in items_data:
            item = EstimateItem(estimate_id=estimate.id, **item_data)
            db.add(item)

    await db.flush()
    result = await db.execute(
        select(Estimate).options(selectinload(Estimate.items)).where(Estimate.id == estimate.id)
    )
    estimate = result.scalar_one()
    return ResponseModel(data=EstimateResponse.model_validate(estimate))


@router.delete("/estimates/{estimate_id}", response_model=ResponseModel)
async def delete_estimate(
    estimate_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Estimate).where(
        Estimate.id == estimate_id,
        Estimate.company_id == current_user.company_id,
        Estimate.deleted_at.is_(None),
    ))
    estimate = result.scalar_one_or_none()
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")
    estimate.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Estimate deleted")


# ── Expenses ──

@router.get("/expenses", response_model=PaginatedResponse)
async def list_expenses(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Expense).where(
        Expense.company_id == current_user.company_id,
        Expense.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Expense).where(
        Expense.company_id == current_user.company_id,
        Expense.deleted_at.is_(None),
    )

    if search:
        query = query.where(Expense.vendor.ilike(f"%{search}%"))
        count_query = count_query.where(Expense.vendor.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[ExpenseResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/expenses/{expense_id}", response_model=ResponseModel)
async def get_expense(
    expense_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Expense).where(
        Expense.id == expense_id,
        Expense.company_id == current_user.company_id,
        Expense.deleted_at.is_(None),
    ))
    expense = result.scalar_one_or_none()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return ResponseModel(data=ExpenseResponse.model_validate(expense))


@router.post("/expenses", response_model=ResponseModel, status_code=201)
async def create_expense(
    data: ExpenseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    expense = Expense(**data.model_dump())
    db.add(expense)
    await db.flush()
    await db.refresh(expense)
    return ResponseModel(data=ExpenseResponse.model_validate(expense))


@router.put("/expenses/{expense_id}", response_model=ResponseModel)
async def update_expense(
    expense_id: int,
    data: ExpenseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Expense).where(
        Expense.id == expense_id,
        Expense.company_id == current_user.company_id,
        Expense.deleted_at.is_(None),
    ))
    expense = result.scalar_one_or_none()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(expense, k, v)
    await db.flush()
    await db.refresh(expense)
    return ResponseModel(data=ExpenseResponse.model_validate(expense))


@router.delete("/expenses/{expense_id}", response_model=ResponseModel)
async def delete_expense(
    expense_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Expense).where(
        Expense.id == expense_id,
        Expense.company_id == current_user.company_id,
        Expense.deleted_at.is_(None),
    ))
    expense = result.scalar_one_or_none()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    expense.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Expense deleted")


# ── Budgets ──

@router.get("/budgets", response_model=PaginatedResponse)
async def list_budgets(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Budget).where(Budget.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(Budget).where(Budget.company_id == current_user.company_id)

    if search:
        query = query.where(Budget.fiscal_year == int(search))  # type: ignore
        count_query = count_query.where(Budget.fiscal_year == int(search))  # type: ignore

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[BudgetResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/budgets/{budget_id}", response_model=ResponseModel)
async def get_budget(
    budget_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Budget).where(
        Budget.id == budget_id,
        Budget.company_id == current_user.company_id,
    ))
    budget = result.scalar_one_or_none()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return ResponseModel(data=BudgetResponse.model_validate(budget))


@router.post("/budgets", response_model=ResponseModel, status_code=201)
async def create_budget(
    data: BudgetCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    budget = Budget(**data.model_dump())
    db.add(budget)
    await db.flush()
    await db.refresh(budget)
    return ResponseModel(data=BudgetResponse.model_validate(budget))


@router.put("/budgets/{budget_id}", response_model=ResponseModel)
async def update_budget(
    budget_id: int,
    data: BudgetUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Budget).where(
        Budget.id == budget_id,
        Budget.company_id == current_user.company_id,
    ))
    budget = result.scalar_one_or_none()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(budget, k, v)
    await db.flush()
    await db.refresh(budget)
    return ResponseModel(data=BudgetResponse.model_validate(budget))


# ── Tax Rates ──

@router.get("/tax-rates", response_model=PaginatedResponse)
async def list_tax_rates(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(TaxRate).where(
        TaxRate.company_id == current_user.company_id,
        TaxRate.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(TaxRate).where(
        TaxRate.company_id == current_user.company_id,
        TaxRate.deleted_at.is_(None),
    )

    if search:
        query = query.where(TaxRate.name.ilike(f"%{search}%"))
        count_query = count_query.where(TaxRate.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[TaxRateResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/tax-rates/{tax_rate_id}", response_model=ResponseModel)
async def get_tax_rate(
    tax_rate_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(TaxRate).where(
        TaxRate.id == tax_rate_id,
        TaxRate.company_id == current_user.company_id,
        TaxRate.deleted_at.is_(None),
    ))
    tax_rate = result.scalar_one_or_none()
    if not tax_rate:
        raise HTTPException(status_code=404, detail="Tax rate not found")
    return ResponseModel(data=TaxRateResponse.model_validate(tax_rate))


@router.post("/tax-rates", response_model=ResponseModel, status_code=201)
async def create_tax_rate(
    data: TaxRateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    tax_rate = TaxRate(**data.model_dump())
    db.add(tax_rate)
    await db.flush()
    await db.refresh(tax_rate)
    return ResponseModel(data=TaxRateResponse.model_validate(tax_rate))


@router.put("/tax-rates/{tax_rate_id}", response_model=ResponseModel)
async def update_tax_rate(
    tax_rate_id: int,
    data: TaxRateUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(TaxRate).where(
        TaxRate.id == tax_rate_id,
        TaxRate.company_id == current_user.company_id,
        TaxRate.deleted_at.is_(None),
    ))
    tax_rate = result.scalar_one_or_none()
    if not tax_rate:
        raise HTTPException(status_code=404, detail="Tax rate not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(tax_rate, k, v)
    await db.flush()
    await db.refresh(tax_rate)
    return ResponseModel(data=TaxRateResponse.model_validate(tax_rate))


@router.delete("/tax-rates/{tax_rate_id}", response_model=ResponseModel)
async def delete_tax_rate(
    tax_rate_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(TaxRate).where(
        TaxRate.id == tax_rate_id,
        TaxRate.company_id == current_user.company_id,
        TaxRate.deleted_at.is_(None),
    ))
    tax_rate = result.scalar_one_or_none()
    if not tax_rate:
        raise HTTPException(status_code=404, detail="Tax rate not found")
    tax_rate.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Tax rate deleted")
