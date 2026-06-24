from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# ── Customer ──────────────────────────────────────────────────────────────────

class CustomerBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    tax_id: Optional[str] = None
    address: Optional[str] = None
    credit_limit: float = 0
    balance: float = 0
    loyalty_points: int = 0
    status: str = "active"


class CustomerCreate(CustomerBase):
    company_id: Optional[int] = None


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    tax_id: Optional[str] = None
    address: Optional[str] = None
    credit_limit: Optional[float] = None
    balance: Optional[float] = None
    loyalty_points: Optional[int] = None
    status: Optional[str] = None


class CustomerResponse(CustomerBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Customer Contract ─────────────────────────────────────────────────────────

class CustomerContractBase(BaseModel):
    title: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    value: float = 0
    file_url: Optional[str] = None
    status: str = "active"
    renewal_reminder: bool = True


class CustomerContractCreate(CustomerContractBase):
    company_id: Optional[int] = None
    customer_id: int


class CustomerContractUpdate(BaseModel):
    title: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    value: Optional[float] = None
    file_url: Optional[str] = None
    status: Optional[str] = None
    renewal_reminder: Optional[bool] = None


class CustomerContractResponse(CustomerContractBase):
    id: int
    company_id: Optional[int] = None
    customer_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ── Lead ──────────────────────────────────────────────────────────────────────

class LeadBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    status: str = "new"
    assigned_to: Optional[int] = None
    score: int = 0
    notes: Optional[str] = None


class LeadCreate(LeadBase):
    company_id: Optional[int] = None


class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[int] = None
    score: Optional[int] = None
    notes: Optional[str] = None


class LeadResponse(LeadBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Deal ──────────────────────────────────────────────────────────────────────

class DealBase(BaseModel):
    title: str
    value: float = 0
    currency: str = "USD"
    stage: Optional[str] = None
    probability: int = 0
    expected_close: Optional[datetime] = None
    actual_close: Optional[datetime] = None
    status: str = "open"


class DealCreate(DealBase):
    company_id: Optional[int] = None
    lead_id: Optional[int] = None


class DealUpdate(BaseModel):
    lead_id: Optional[int] = None
    title: Optional[str] = None
    value: Optional[float] = None
    currency: Optional[str] = None
    stage: Optional[str] = None
    probability: Optional[int] = None
    expected_close: Optional[datetime] = None
    actual_close: Optional[datetime] = None
    status: Optional[str] = None


class DealResponse(DealBase):
    id: int
    company_id: Optional[int] = None
    lead_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Quotation Item ────────────────────────────────────────────────────────────

class QuotationItemBase(BaseModel):
    item_id: Optional[int] = None
    qty: float = 1
    price: float = 0
    tax: float = 0
    total: float = 0


class QuotationItemCreate(QuotationItemBase):
    id: Optional[int] = None


class QuotationItemUpdate(BaseModel):
    item_id: Optional[int] = None
    qty: Optional[float] = None
    price: Optional[float] = None
    tax: Optional[float] = None
    total: Optional[float] = None


class QuotationItemResponse(QuotationItemBase):
    id: int
    quotation_id: int

    class Config:
        from_attributes = True


# ── Quotation ─────────────────────────────────────────────────────────────────

class QuotationBase(BaseModel):
    quote_number: str
    customer_id: Optional[int] = None
    date: Optional[datetime] = None
    expiry: Optional[datetime] = None
    status: str = "draft"
    subtotal: float = 0
    tax: float = 0
    total: float = 0
    notes: Optional[str] = None
    converted_to_order_id: Optional[int] = None


class QuotationCreate(QuotationBase):
    company_id: Optional[int] = None
    items: list[QuotationItemCreate] = []


class QuotationUpdate(BaseModel):
    customer_id: Optional[int] = None
    quote_number: Optional[str] = None
    date: Optional[datetime] = None
    expiry: Optional[datetime] = None
    status: Optional[str] = None
    subtotal: Optional[float] = None
    tax: Optional[float] = None
    total: Optional[float] = None
    notes: Optional[str] = None
    converted_to_order_id: Optional[int] = None
    items: Optional[list[QuotationItemCreate]] = None


class QuotationResponse(QuotationBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime
    items: list[QuotationItemResponse] = []

    class Config:
        from_attributes = True


# ── Sales Order Item ──────────────────────────────────────────────────────────

class SalesOrderItemBase(BaseModel):
    item_id: Optional[int] = None
    qty: float = 1
    price: float = 0
    tax: float = 0
    total: float = 0
    delivered_qty: float = 0


class SalesOrderItemCreate(SalesOrderItemBase):
    id: Optional[int] = None


class SalesOrderItemUpdate(BaseModel):
    item_id: Optional[int] = None
    qty: Optional[float] = None
    price: Optional[float] = None
    tax: Optional[float] = None
    total: Optional[float] = None
    delivered_qty: Optional[float] = None


class SalesOrderItemResponse(SalesOrderItemBase):
    id: int
    sales_order_id: int

    class Config:
        from_attributes = True


# ── Sales Order ───────────────────────────────────────────────────────────────

class SalesOrderBase(BaseModel):
    order_number: str
    customer_id: Optional[int] = None
    quotation_id: Optional[int] = None
    date: Optional[datetime] = None
    status: str = "draft"
    subtotal: float = 0
    tax: float = 0
    total: float = 0
    delivery_date: Optional[datetime] = None
    shipping_address: Optional[str] = None


class SalesOrderCreate(SalesOrderBase):
    company_id: Optional[int] = None
    items: list[SalesOrderItemCreate] = []


class SalesOrderUpdate(BaseModel):
    order_number: Optional[str] = None
    customer_id: Optional[int] = None
    quotation_id: Optional[int] = None
    date: Optional[datetime] = None
    status: Optional[str] = None
    subtotal: Optional[float] = None
    tax: Optional[float] = None
    total: Optional[float] = None
    delivery_date: Optional[datetime] = None
    shipping_address: Optional[str] = None
    items: Optional[list[SalesOrderItemCreate]] = None


class SalesOrderResponse(SalesOrderBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime
    items: list[SalesOrderItemResponse] = []

    class Config:
        from_attributes = True


# ── Delivery Note ─────────────────────────────────────────────────────────────

class DeliveryNoteBase(BaseModel):
    dn_number: str
    sales_order_id: Optional[int] = None
    date: Optional[datetime] = None
    shipped_by: Optional[int] = None
    status: str = "pending"
    tracking_number: Optional[str] = None


class DeliveryNoteCreate(DeliveryNoteBase):
    company_id: Optional[int] = None


class DeliveryNoteUpdate(BaseModel):
    dn_number: Optional[str] = None
    sales_order_id: Optional[int] = None
    date: Optional[datetime] = None
    shipped_by: Optional[int] = None
    status: Optional[str] = None
    tracking_number: Optional[str] = None


class DeliveryNoteResponse(DeliveryNoteBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Sales Campaign ────────────────────────────────────────────────────────────

class SalesCampaignBase(BaseModel):
    name: str
    type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    target_audience: Optional[str] = None
    status: str = "draft"
    budget: float = 0


class SalesCampaignCreate(SalesCampaignBase):
    company_id: Optional[int] = None


class SalesCampaignUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    target_audience: Optional[str] = None
    status: Optional[str] = None
    budget: Optional[float] = None


class SalesCampaignResponse(SalesCampaignBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Inquiry ───────────────────────────────────────────────────────────────────

class InquiryBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = None
    status: str = "new"
    assigned_to: Optional[int] = None


class InquiryCreate(InquiryBase):
    company_id: Optional[int] = None


class InquiryUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[int] = None


class InquiryResponse(InquiryBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Inquiry Follow-Up ───────────────────────────────────────────────────────

class InquiryFollowUpCreate(BaseModel):
    title: str
    due_date: Optional[datetime] = None


class InquiryFollowUpResponse(BaseModel):
    id: int
    inquiry_id: int
    title: str
    due_date: Optional[datetime] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Inquiry Email Log ──────────────────────────────────────────────────────

class InquiryEmailSend(BaseModel):
    to_email: str
    subject: str
    body: str


class InquiryEmailLogResponse(BaseModel):
    id: int
    inquiry_id: int
    to_email: str
    subject: str
    body: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
