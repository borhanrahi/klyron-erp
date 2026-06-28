from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# ── Supplier ──────────────────────────────────────────────────────────────────

class SupplierBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    tax_id: Optional[str] = None
    status: str = "active"
    rating: Optional[int] = 0
    credit_limit: float = 0
    balance: float = 0


class SupplierCreate(SupplierBase):
    company_id: Optional[int] = None


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    tax_id: Optional[str] = None
    status: Optional[str] = None
    rating: Optional[int] = None
    credit_limit: Optional[float] = None
    balance: Optional[float] = None


class SupplierResponse(SupplierBase):
    id: int
    company_id: Optional[int] = None
    created_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── PRItem ────────────────────────────────────────────────────────────────────

class PRItemBase(BaseModel):
    item_id: Optional[int] = None
    qty: int
    estimated_price: float = 0
    notes: Optional[str] = None


class PRItemCreate(PRItemBase):
    pass


class PRItemUpdate(BaseModel):
    item_id: Optional[int] = None
    qty: Optional[int] = None
    estimated_price: Optional[float] = None
    notes: Optional[str] = None


class PRItemResponse(PRItemBase):
    id: int
    pr_id: int

    class Config:
        from_attributes = True


# ── PurchaseRequisition ───────────────────────────────────────────────────────

class PurchaseRequisitionBase(BaseModel):
    pr_number: str
    department_id: Optional[int] = None
    requester_id: Optional[int] = None
    status: str = "draft"
    priority: str = "normal"
    total_estimated: float = 0
    notes: Optional[str] = None


class PurchaseRequisitionCreate(PurchaseRequisitionBase):
    company_id: Optional[int] = None
    items: list[PRItemCreate] = []


class PurchaseRequisitionUpdate(BaseModel):
    pr_number: Optional[str] = None
    department_id: Optional[int] = None
    requester_id: Optional[int] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    total_estimated: Optional[float] = None
    notes: Optional[str] = None
    items: Optional[list[PRItemCreate]] = None


class PurchaseRequisitionResponse(PurchaseRequisitionBase):
    id: int
    company_id: Optional[int] = None
    created_at: Optional[datetime] = None
    items: list[PRItemResponse] = []

    class Config:
        from_attributes = True


# ── POItem ────────────────────────────────────────────────────────────────────

class POItemBase(BaseModel):
    item_id: Optional[int] = None
    qty: int
    unit_price: float = 0
    tax: float = 0
    total: float = 0
    received_qty: int = 0


class POItemCreate(POItemBase):
    pass


class POItemUpdate(BaseModel):
    item_id: Optional[int] = None
    qty: Optional[int] = None
    unit_price: Optional[float] = None
    tax: Optional[float] = None
    total: Optional[float] = None
    received_qty: Optional[int] = None


class POItemResponse(POItemBase):
    id: int
    po_id: int

    class Config:
        from_attributes = True


# ── PurchaseOrder ─────────────────────────────────────────────────────────────

class PurchaseOrderBase(BaseModel):
    po_number: str
    supplier_id: Optional[int] = None
    pr_id: Optional[int] = None
    status: str = "draft"
    subtotal: float = 0
    tax: float = 0
    total: float = 0
    delivery_date: Optional[datetime] = None
    terms: Optional[str] = None


class PurchaseOrderCreate(PurchaseOrderBase):
    company_id: Optional[int] = None
    items: list[POItemCreate] = []


class PurchaseOrderUpdate(BaseModel):
    po_number: Optional[str] = None
    supplier_id: Optional[int] = None
    pr_id: Optional[int] = None
    status: Optional[str] = None
    subtotal: Optional[float] = None
    tax: Optional[float] = None
    total: Optional[float] = None
    delivery_date: Optional[datetime] = None
    terms: Optional[str] = None
    items: Optional[list[POItemCreate]] = None


class PurchaseOrderResponse(PurchaseOrderBase):
    id: int
    company_id: Optional[int] = None
    created_at: Optional[datetime] = None
    items: list[POItemResponse] = []

    class Config:
        from_attributes = True


# ── GRNItem ───────────────────────────────────────────────────────────────────

class GRNItemBase(BaseModel):
    po_item_id: Optional[int] = None
    received_qty: int = 0
    accepted_qty: int = 0
    rejected_qty: int = 0
    reason: Optional[str] = None


class GRNItemCreate(GRNItemBase):
    pass


class GRNItemUpdate(BaseModel):
    po_item_id: Optional[int] = None
    received_qty: Optional[int] = None
    accepted_qty: Optional[int] = None
    rejected_qty: Optional[int] = None
    reason: Optional[str] = None


class GRNItemResponse(GRNItemBase):
    id: int
    grn_id: int

    class Config:
        from_attributes = True


# ── GRN ───────────────────────────────────────────────────────────────────────

class GRNBase(BaseModel):
    grn_number: str
    po_id: Optional[int] = None
    received_by: Optional[int] = None
    status: str = "draft"
    warehouse_id: Optional[int] = None
    notes: Optional[str] = None


class GRNCreate(GRNBase):
    company_id: Optional[int] = None
    items: list[GRNItemCreate] = []


class GRNUpdate(BaseModel):
    grn_number: Optional[str] = None
    po_id: Optional[int] = None
    received_by: Optional[int] = None
    status: Optional[str] = None
    warehouse_id: Optional[int] = None
    notes: Optional[str] = None
    items: Optional[list[GRNItemCreate]] = None


class GRNResponse(GRNBase):
    id: int
    company_id: Optional[int] = None
    created_at: Optional[datetime] = None
    items: list[GRNItemResponse] = []

    class Config:
        from_attributes = True


# ── SupplierPayment ───────────────────────────────────────────────────────────

class SupplierPaymentBase(BaseModel):
    supplier_id: Optional[int] = None
    po_id: Optional[int] = None
    amount: float
    method: Optional[str] = None
    reference: Optional[str] = None
    notes: Optional[str] = None


class SupplierPaymentCreate(SupplierPaymentBase):
    company_id: Optional[int] = None


class SupplierPaymentUpdate(BaseModel):
    supplier_id: Optional[int] = None
    po_id: Optional[int] = None
    amount: Optional[float] = None
    method: Optional[str] = None
    reference: Optional[str] = None
    notes: Optional[str] = None


class SupplierPaymentResponse(SupplierPaymentBase):
    id: int
    company_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── RequestForQuotation ─────────────────────────────────────────────────────

class RFQBase(BaseModel):
    rfq_number: str
    title: str
    description: Optional[str] = None
    supplier_id: Optional[int] = None
    status: str = "draft"
    issue_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    total_amount: float = 0


class RFQCreate(RFQBase):
    company_id: Optional[int] = None


class RFQUpdate(BaseModel):
    rfq_number: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    supplier_id: Optional[int] = None
    status: Optional[str] = None
    issue_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    total_amount: Optional[float] = None


class RFQResponse(RFQBase):
    id: int
    company_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
