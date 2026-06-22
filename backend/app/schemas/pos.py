from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class POSSessionBase(BaseModel):
    branch_id: Optional[int] = None
    cashier_id: Optional[int] = None
    opening_balance: float = 0
    closing_balance: Optional[float] = None
    status: str = "open"


class POSSessionCreate(POSSessionBase):
    pass


class POSSessionUpdate(BaseModel):
    branch_id: Optional[int] = None
    cashier_id: Optional[int] = None
    opening_balance: Optional[float] = None
    closing_balance: Optional[float] = None
    status: Optional[str] = None
    closed_at: Optional[datetime] = None


class POSSessionResponse(POSSessionBase):
    id: int
    company_id: Optional[int] = None
    opened_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class POSSaleItemBase(BaseModel):
    item_id: Optional[int] = None
    qty: float = 1
    unit_price: float = 0
    tax: float = 0
    discount: float = 0
    total: float = 0


class POSSaleItemCreate(POSSaleItemBase):
    pass


class POSSaleItemUpdate(BaseModel):
    item_id: Optional[int] = None
    qty: Optional[float] = None
    unit_price: Optional[float] = None
    tax: Optional[float] = None
    discount: Optional[float] = None
    total: Optional[float] = None


class POSSaleItemResponse(POSSaleItemBase):
    id: int
    pos_sale_id: int

    class Config:
        from_attributes = True


class POSSaleBase(BaseModel):
    session_id: Optional[int] = None
    sale_number: str
    customer_id: Optional[int] = None
    subtotal: float = 0
    tax: float = 0
    discount: float = 0
    total: float = 0
    paid: float = 0
    change: float = 0
    payment_method: Optional[str] = None
    status: str = "completed"


class POSSaleCreate(POSSaleBase):
    items: list[POSSaleItemCreate] = []


class POSSaleUpdate(BaseModel):
    session_id: Optional[int] = None
    customer_id: Optional[int] = None
    subtotal: Optional[float] = None
    tax: Optional[float] = None
    discount: Optional[float] = None
    total: Optional[float] = None
    paid: Optional[float] = None
    change: Optional[float] = None
    payment_method: Optional[str] = None
    status: Optional[str] = None


class POSSaleResponse(POSSaleBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime
    items: list[POSSaleItemResponse] = []

    class Config:
        from_attributes = True


class CashRegisterBase(BaseModel):
    branch_id: Optional[int] = None
    name: str
    current_balance: float = 0
    status: str = "active"


class CashRegisterCreate(CashRegisterBase):
    pass


class CashRegisterUpdate(BaseModel):
    branch_id: Optional[int] = None
    name: Optional[str] = None
    current_balance: Optional[float] = None
    status: Optional[str] = None


class CashRegisterResponse(CashRegisterBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class POSReceiptBase(BaseModel):
    pos_sale_id: int
    receipt_number: str
    printer_type: Optional[str] = None
    receipt_data: Optional[str] = None


class POSReceiptCreate(POSReceiptBase):
    pass


class POSReceiptUpdate(BaseModel):
    printer_type: Optional[str] = None
    receipt_data: Optional[str] = None


class POSReceiptResponse(POSReceiptBase):
    id: int
    printed_at: datetime

    class Config:
        from_attributes = True
