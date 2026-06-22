from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# ─── PortalUser ──────────────────────────────────────────────────

class PortalUserBase(BaseModel):
    company_id: Optional[int] = None
    customer_id: int
    user_id: int
    is_primary: bool = False


class PortalUserCreate(PortalUserBase):
    pass


class PortalUserUpdate(BaseModel):
    company_id: Optional[int] = None
    customer_id: Optional[int] = None
    user_id: Optional[int] = None
    is_primary: Optional[bool] = None


class PortalUserResponse(PortalUserBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── PortalSession ───────────────────────────────────────────────

class PortalSessionBase(BaseModel):
    portal_user_id: int
    token: str
    ip: Optional[str] = None
    user_agent: Optional[str] = None
    expires_at: datetime


class PortalSessionCreate(PortalSessionBase):
    pass


class PortalSessionUpdate(BaseModel):
    token: Optional[str] = None
    ip: Optional[str] = None
    user_agent: Optional[str] = None
    expires_at: Optional[datetime] = None


class PortalSessionResponse(PortalSessionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
