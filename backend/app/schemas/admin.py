from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


# ─── Role ────────────────────────────────────────────────────────

class RoleBase(BaseModel):
    name: str
    permissions_json: List[str] = []


class RoleCreate(RoleBase):
    pass


class RoleUpdate(BaseModel):
    name: Optional[str] = None
    permissions_json: Optional[List[str]] = None


class RoleResponse(RoleBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Company ─────────────────────────────────────────────────────

class CompanyBase(BaseModel):
    name: str
    slug: str
    plan_id: Optional[int] = None
    logo_url: Optional[str] = None
    settings_json: dict = {}
    is_active: bool = True


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    plan_id: Optional[int] = None
    logo_url: Optional[str] = None
    settings_json: Optional[dict] = None
    is_active: Optional[bool] = None


class CompanyResponse(CompanyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Department ──────────────────────────────────────────────────

class DepartmentBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    head_id: Optional[int] = None
    parent_id: Optional[int] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    head_id: Optional[int] = None
    parent_id: Optional[int] = None


class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── AuditLog ────────────────────────────────────────────────────

class AuditLogBase(BaseModel):
    company_id: Optional[int] = None
    user_id: int
    action: str
    entity_type: str
    entity_id: Optional[int] = None
    old_json: Optional[dict] = None
    new_json: Optional[dict] = None
    ip: Optional[str] = None


class AuditLogCreate(AuditLogBase):
    pass


class AuditLogUpdate(BaseModel):
    action: Optional[str] = None
    entity_type: Optional[str] = None
    entity_id: Optional[int] = None
    old_json: Optional[dict] = None
    new_json: Optional[dict] = None
    ip: Optional[str] = None


class AuditLogResponse(AuditLogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Notification ────────────────────────────────────────────────

class NotificationBase(BaseModel):
    user_id: int
    title: str
    message: str
    is_read: bool = False
    link: Optional[str] = None


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
    is_read: Optional[bool] = None
    link: Optional[str] = None


class NotificationResponse(NotificationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
