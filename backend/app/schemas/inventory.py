from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# ── ItemCategory ──────────────────────────────────────────────

class ItemCategoryBase(BaseModel):
    name: str
    parent_id: Optional[int] = None
    code: Optional[str] = None

class ItemCategoryCreate(ItemCategoryBase):
    pass

class ItemCategoryUpdate(BaseModel):
    name: Optional[str] = None
    parent_id: Optional[int] = None
    code: Optional[str] = None

class ItemCategoryResponse(ItemCategoryBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Item ──────────────────────────────────────────────────────

class ItemBase(BaseModel):
    sku: str
    name: str
    category_id: Optional[int] = None
    unit: Optional[str] = None
    cost_price: float = 0
    sell_price: float = 0
    tax_rate: float = 0
    barcode: Optional[str] = None
    weight: Optional[float] = None
    description: Optional[str] = None
    is_service: bool = False

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    category_id: Optional[int] = None
    unit: Optional[str] = None
    cost_price: Optional[float] = None
    sell_price: Optional[float] = None
    tax_rate: Optional[float] = None
    barcode: Optional[str] = None
    weight: Optional[float] = None
    description: Optional[str] = None
    is_service: Optional[bool] = None

class ItemResponse(ItemBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Warehouse ─────────────────────────────────────────────────

class WarehouseBase(BaseModel):
    code: str
    name: str
    address: Optional[str] = None
    manager_id: Optional[int] = None
    is_active: bool = True

class WarehouseCreate(WarehouseBase):
    pass

class WarehouseUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    address: Optional[str] = None
    manager_id: Optional[int] = None
    is_active: Optional[bool] = None

class WarehouseResponse(WarehouseBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Stock ─────────────────────────────────────────────────────

class StockBase(BaseModel):
    item_id: int
    warehouse_id: int
    quantity: int = 0
    reserved_qty: int = 0
    reorder_level: int = 0
    reorder_qty: int = 0

class StockCreate(StockBase):
    pass

class StockUpdate(BaseModel):
    item_id: Optional[int] = None
    warehouse_id: Optional[int] = None
    quantity: Optional[int] = None
    reserved_qty: Optional[int] = None
    reorder_level: Optional[int] = None
    reorder_qty: Optional[int] = None

class StockResponse(StockBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── StockAdjustment ───────────────────────────────────────────

class StockAdjustmentBase(BaseModel):
    item_id: int
    warehouse_id: int
    type: Optional[str] = None
    qty_change: int
    reason: Optional[str] = None
    date: Optional[datetime] = None
    created_by: Optional[int] = None

class StockAdjustmentCreate(StockAdjustmentBase):
    pass

class StockAdjustmentUpdate(BaseModel):
    item_id: Optional[int] = None
    warehouse_id: Optional[int] = None
    type: Optional[str] = None
    qty_change: Optional[int] = None
    reason: Optional[str] = None
    date: Optional[datetime] = None

class StockAdjustmentResponse(StockAdjustmentBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── StockTransfer ─────────────────────────────────────────────

class StockTransferBase(BaseModel):
    from_warehouse_id: int
    to_warehouse_id: int
    item_id: int
    qty: int
    status: str = "pending"
    date: Optional[datetime] = None
    approved_by: Optional[int] = None

class StockTransferCreate(StockTransferBase):
    pass

class StockTransferUpdate(BaseModel):
    from_warehouse_id: Optional[int] = None
    to_warehouse_id: Optional[int] = None
    item_id: Optional[int] = None
    qty: Optional[int] = None
    status: Optional[str] = None
    date: Optional[datetime] = None
    approved_by: Optional[int] = None

class StockTransferResponse(StockTransferBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── StockTakeItem ─────────────────────────────────────────────

class StockTakeItemBase(BaseModel):
    stock_take_id: int
    item_id: int
    system_qty: int = 0
    counted_qty: int = 0
    difference: int = 0

class StockTakeItemCreate(BaseModel):
    item_id: int
    system_qty: int = 0
    counted_qty: int = 0
    difference: int = 0

class StockTakeItemUpdate(BaseModel):
    item_id: Optional[int] = None
    system_qty: Optional[int] = None
    counted_qty: Optional[int] = None
    difference: Optional[int] = None

class StockTakeItemResponse(StockTakeItemBase):
    id: int

    class Config:
        from_attributes = True


# ── StockTake ─────────────────────────────────────────────────

class StockTakeBase(BaseModel):
    warehouse_id: int
    date: Optional[datetime] = None
    status: str = "draft"
    counted_by: Optional[int] = None
    approved_by: Optional[int] = None

class StockTakeCreate(StockTakeBase):
    items: list[StockTakeItemCreate] = []

class StockTakeUpdate(BaseModel):
    warehouse_id: Optional[int] = None
    date: Optional[datetime] = None
    status: Optional[str] = None
    counted_by: Optional[int] = None
    approved_by: Optional[int] = None
    items: Optional[list[StockTakeItemCreate]] = None

class StockTakeResponse(StockTakeBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime
    items: list[StockTakeItemResponse] = []

    class Config:
        from_attributes = True
