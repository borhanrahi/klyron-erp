from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class WorkflowStepBase(BaseModel):
    workflow_id: int
    step_order: int
    name: str
    approver_type: Optional[str] = None
    approver_id: Optional[int] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    action: Optional[str] = None


class WorkflowStepCreate(WorkflowStepBase):
    pass


class WorkflowStepUpdate(BaseModel):
    step_order: Optional[int] = None
    name: Optional[str] = None
    approver_type: Optional[str] = None
    approver_id: Optional[int] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    action: Optional[str] = None


class WorkflowStepResponse(WorkflowStepBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class WorkflowBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    entity_type: str
    is_active: bool = True


class WorkflowCreate(WorkflowBase):
    pass


class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    entity_type: Optional[str] = None
    is_active: Optional[bool] = None


class WorkflowResponse(WorkflowBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class WorkflowInstanceBase(BaseModel):
    company_id: Optional[int] = None
    workflow_id: Optional[int] = None
    entity_type: Optional[str] = None
    entity_id: Optional[int] = None
    status: str = "pending"
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_by: Optional[int] = None


class WorkflowInstanceCreate(WorkflowInstanceBase):
    pass


class WorkflowInstanceUpdate(BaseModel):
    workflow_id: Optional[int] = None
    entity_type: Optional[str] = None
    entity_id: Optional[int] = None
    status: Optional[str] = None
    completed_at: Optional[datetime] = None


class WorkflowInstanceResponse(WorkflowInstanceBase):
    id: int

    class Config:
        from_attributes = True


class WorkflowApprovalBase(BaseModel):
    instance_id: int
    step_id: Optional[int] = None
    approver_id: Optional[int] = None
    status: str = "pending"
    comment: Optional[str] = None
    approved_at: Optional[datetime] = None


class WorkflowApprovalCreate(WorkflowApprovalBase):
    pass


class WorkflowApprovalUpdate(BaseModel):
    status: Optional[str] = None
    comment: Optional[str] = None
    approved_at: Optional[datetime] = None


class WorkflowApprovalResponse(WorkflowApprovalBase):
    id: int

    class Config:
        from_attributes = True


class WorkflowHistoryBase(BaseModel):
    instance_id: int
    action: Optional[str] = None
    user_id: Optional[int] = None
    comment: Optional[str] = None
    timestamp: Optional[datetime] = None


class WorkflowHistoryCreate(WorkflowHistoryBase):
    pass


class WorkflowHistoryResponse(WorkflowHistoryBase):
    id: int

    class Config:
        from_attributes = True
