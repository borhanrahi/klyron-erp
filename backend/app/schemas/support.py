from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TicketBase(BaseModel):
    ticket_number: str
    subject: str
    category: Optional[str] = None
    priority: str = "medium"
    status: str = "open"
    requester_id: Optional[int] = None
    assignee_id: Optional[int] = None
    sla_deadline: Optional[datetime] = None


class TicketCreate(TicketBase):
    pass


class TicketUpdate(BaseModel):
    subject: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    requester_id: Optional[int] = None
    assignee_id: Optional[int] = None
    sla_deadline: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    rating: Optional[int] = None


class TicketResponse(TicketBase):
    id: int
    company_id: Optional[int] = None
    resolved_at: Optional[datetime] = None
    rating: Optional[int] = None
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TicketCommentBase(BaseModel):
    ticket_id: int
    user_id: Optional[int] = None
    message: str
    is_internal: bool = False


class TicketCommentCreate(TicketCommentBase):
    pass


class TicketCommentUpdate(BaseModel):
    message: Optional[str] = None
    is_internal: Optional[bool] = None


class TicketCommentResponse(TicketCommentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MeetingBase(BaseModel):
    title: str
    description: Optional[str] = None
    zoom_link: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    attendees_json: list = []
    created_by: Optional[int] = None


class MeetingCreate(MeetingBase):
    pass


class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    zoom_link: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    attendees_json: Optional[list] = None


class MeetingResponse(MeetingBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
