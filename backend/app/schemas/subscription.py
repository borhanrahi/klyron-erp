from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class PlanBase(BaseModel):
    name: str
    price_monthly: int = 0
    price_yearly: int = 0
    modules_json: list = []
    max_users: int = 1
    max_branches: int = 1
    max_storage: int = 1024
    features_json: dict = {}
    is_active: bool = True


class PlanCreate(PlanBase):
    pass


class PlanUpdate(BaseModel):
    name: Optional[str] = None
    price_monthly: Optional[int] = None
    price_yearly: Optional[int] = None
    modules_json: Optional[list] = None
    max_users: Optional[int] = None
    max_branches: Optional[int] = None
    max_storage: Optional[int] = None
    features_json: Optional[dict] = None
    is_active: Optional[bool] = None


class PlanResponse(PlanBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SubscriptionBase(BaseModel):
    company_id: Optional[int] = None
    plan_id: Optional[int] = None
    status: str = "active"
    started_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    auto_renew: bool = True


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(BaseModel):
    plan_id: Optional[int] = None
    status: Optional[str] = None
    started_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    auto_renew: Optional[bool] = None


class SubscriptionResponse(SubscriptionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PaymentBase(BaseModel):
    company_id: Optional[int] = None
    subscription_id: Optional[int] = None
    gateway: Optional[str] = None
    amount: float
    currency: str = "USD"
    status: str = "pending"
    paid_at: Optional[datetime] = None
    receipt_url: Optional[str] = None


class PaymentCreate(PaymentBase):
    pass


class PaymentUpdate(BaseModel):
    subscription_id: Optional[int] = None
    gateway: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    status: Optional[str] = None
    paid_at: Optional[datetime] = None
    receipt_url: Optional[str] = None


class PaymentResponse(PaymentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class GatewayBase(BaseModel):
    name: str
    config_json: dict = {}
    is_active: bool = True


class GatewayCreate(GatewayBase):
    pass


class GatewayUpdate(BaseModel):
    name: Optional[str] = None
    config_json: Optional[dict] = None
    is_active: Optional[bool] = None


class GatewayResponse(GatewayBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
