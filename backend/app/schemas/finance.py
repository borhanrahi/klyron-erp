from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


# ─── BankAccount ────────────────────────────────────────────────

class BankAccountBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    branch_id: Optional[int] = None
    account_number: Optional[str] = None
    bank_name: Optional[str] = None
    balance: float = 0
    currency: str = "USD"
    is_default: bool = False


class BankAccountCreate(BankAccountBase):
    pass


class BankAccountUpdate(BaseModel):
    name: Optional[str] = None
    branch_id: Optional[int] = None
    account_number: Optional[str] = None
    bank_name: Optional[str] = None
    balance: Optional[float] = None
    currency: Optional[str] = None
    is_default: Optional[bool] = None


class BankAccountResponse(BankAccountBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── BankTransfer ───────────────────────────────────────────────

class BankTransferBase(BaseModel):
    from_account_id: int
    to_account_id: int
    amount: float
    reference: Optional[str] = None
    status: str = "pending"


class BankTransferCreate(BankTransferBase):
    pass


class BankTransferUpdate(BaseModel):
    from_account_id: Optional[int] = None
    to_account_id: Optional[int] = None
    amount: Optional[float] = None
    reference: Optional[str] = None
    status: Optional[str] = None


class BankTransferResponse(BankTransferBase):
    id: int
    date: datetime
    created_by: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ─── ChartOfAccount ─────────────────────────────────────────────

class ChartOfAccountBase(BaseModel):
    company_id: Optional[int] = None
    code: str
    name: str
    type: str
    parent_id: Optional[int] = None
    balance: float = 0
    is_active: bool = True


class ChartOfAccountCreate(ChartOfAccountBase):
    pass


class ChartOfAccountUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    type: Optional[str] = None
    parent_id: Optional[int] = None
    balance: Optional[float] = None
    is_active: Optional[bool] = None


class ChartOfAccountResponse(ChartOfAccountBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Transaction ────────────────────────────────────────────────

class TransactionBase(BaseModel):
    company_id: Optional[int] = None
    account_id: int
    type: str
    amount: float
    reference: Optional[str] = None
    description: Optional[str] = None


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    account_id: Optional[int] = None
    type: Optional[str] = None
    amount: Optional[float] = None
    reference: Optional[str] = None
    description: Optional[str] = None


class TransactionResponse(TransactionBase):
    id: int
    date: datetime
    created_by: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ─── InvoiceItem ────────────────────────────────────────────────

class InvoiceItemBase(BaseModel):
    item_id: Optional[int] = None
    description: Optional[str] = None
    quantity: Optional[float] = 1
    unit_price: Optional[float] = 0
    tax: Optional[float] = 0
    total: Optional[float] = 0


class InvoiceItemCreate(InvoiceItemBase):
    pass


class InvoiceItemResponse(InvoiceItemBase):
    id: int
    invoice_id: int

    class Config:
        from_attributes = True


# ─── Invoice ────────────────────────────────────────────────────

class InvoiceBase(BaseModel):
    company_id: Optional[int] = None
    customer_id: Optional[int] = None
    branch_id: Optional[int] = None
    invoice_number: str
    due_date: Optional[datetime] = None
    subtotal: float = 0
    tax: float = 0
    total: float = 0
    status: str = "draft"
    paid_amount: float = 0
    balance_due: float = 0
    notes: Optional[str] = None


class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate] = []


class InvoiceUpdate(BaseModel):
    customer_id: Optional[int] = None
    branch_id: Optional[int] = None
    invoice_number: Optional[str] = None
    due_date: Optional[datetime] = None
    subtotal: Optional[float] = None
    tax: Optional[float] = None
    total: Optional[float] = None
    status: Optional[str] = None
    paid_amount: Optional[float] = None
    balance_due: Optional[float] = None
    notes: Optional[str] = None
    items: Optional[List[InvoiceItemCreate]] = None


class InvoiceResponse(InvoiceBase):
    id: int
    date: datetime
    created_at: datetime
    deleted_at: Optional[datetime] = None
    items: List[InvoiceItemResponse] = []

    class Config:
        from_attributes = True


# ─── CreditNote ─────────────────────────────────────────────────

class CreditNoteBase(BaseModel):
    company_id: Optional[int] = None
    customer_id: Optional[int] = None
    credit_number: str
    invoice_id: Optional[int] = None
    amount: float = 0
    status: str = "draft"
    reason: Optional[str] = None


class CreditNoteCreate(CreditNoteBase):
    pass


class CreditNoteUpdate(BaseModel):
    customer_id: Optional[int] = None
    credit_number: Optional[str] = None
    invoice_id: Optional[int] = None
    amount: Optional[float] = None
    status: Optional[str] = None
    reason: Optional[str] = None


class CreditNoteResponse(CreditNoteBase):
    id: int
    date: datetime
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── DebitNote ──────────────────────────────────────────────────

class DebitNoteBase(BaseModel):
    company_id: Optional[int] = None
    supplier_id: Optional[int] = None
    debit_number: str
    invoice_id: Optional[int] = None
    amount: float = 0
    status: str = "draft"
    reason: Optional[str] = None


class DebitNoteCreate(DebitNoteBase):
    pass


class DebitNoteUpdate(BaseModel):
    supplier_id: Optional[int] = None
    debit_number: Optional[str] = None
    invoice_id: Optional[int] = None
    amount: Optional[float] = None
    status: Optional[str] = None
    reason: Optional[str] = None


class DebitNoteResponse(DebitNoteBase):
    id: int
    date: datetime
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── EstimateItem ───────────────────────────────────────────────

class EstimateItemBase(BaseModel):
    item_id: Optional[int] = None
    qty: float = 1
    price: float = 0
    total: float = 0


class EstimateItemCreate(EstimateItemBase):
    pass


class EstimateItemResponse(EstimateItemBase):
    id: int
    estimate_id: int

    class Config:
        from_attributes = True


# ─── Estimate ───────────────────────────────────────────────────

class EstimateBase(BaseModel):
    company_id: Optional[int] = None
    customer_id: Optional[int] = None
    estimate_number: str
    expiry_date: Optional[datetime] = None
    status: str = "draft"
    subtotal: float = 0
    tax: float = 0
    total: float = 0
    converted_to_invoice_id: Optional[int] = None


class EstimateCreate(EstimateBase):
    items: List[EstimateItemCreate] = []


class EstimateUpdate(BaseModel):
    customer_id: Optional[int] = None
    estimate_number: Optional[str] = None
    expiry_date: Optional[datetime] = None
    status: Optional[str] = None
    subtotal: Optional[float] = None
    tax: Optional[float] = None
    total: Optional[float] = None
    converted_to_invoice_id: Optional[int] = None
    items: Optional[List[EstimateItemCreate]] = None


class EstimateResponse(EstimateBase):
    id: int
    date: datetime
    created_at: datetime
    deleted_at: Optional[datetime] = None
    items: List[EstimateItemResponse] = []

    class Config:
        from_attributes = True


# ─── Expense ────────────────────────────────────────────────────

class ExpenseBase(BaseModel):
    company_id: Optional[int] = None
    category_id: Optional[int] = None
    amount: float
    vendor: Optional[str] = None
    receipt_url: Optional[str] = None
    description: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    category_id: Optional[int] = None
    amount: Optional[float] = None
    vendor: Optional[str] = None
    receipt_url: Optional[str] = None
    description: Optional[str] = None
    approved_by: Optional[int] = None


class ExpenseResponse(ExpenseBase):
    id: int
    date: datetime
    approved_by: Optional[int] = None
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Budget ─────────────────────────────────────────────────────

class BudgetBase(BaseModel):
    company_id: Optional[int] = None
    department_id: Optional[int] = None
    fiscal_year: int
    allocated: float = 0
    spent: float = 0
    remaining: float = 0


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    department_id: Optional[int] = None
    fiscal_year: Optional[int] = None
    allocated: Optional[float] = None
    spent: Optional[float] = None
    remaining: Optional[float] = None


class BudgetResponse(BudgetBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── TaxRate ────────────────────────────────────────────────────

class TaxRateBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    rate: float
    type: Optional[str] = None
    is_default: bool = False


class TaxRateCreate(TaxRateBase):
    pass


class TaxRateUpdate(BaseModel):
    name: Optional[str] = None
    rate: Optional[float] = None
    type: Optional[str] = None
    is_default: Optional[bool] = None


class TaxRateResponse(TaxRateBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True
