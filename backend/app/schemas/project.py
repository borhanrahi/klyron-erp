from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ProjectBase(BaseModel):
    code: str
    name: str
    client_id: Optional[int] = None
    manager_id: Optional[int] = None
    budget: float = 0
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: str = "planning"
    priority: str = "medium"
    progress_pct: int = 0
    billing_type: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    client_id: Optional[int] = None
    manager_id: Optional[int] = None
    budget: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    progress_pct: Optional[int] = None
    billing_type: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProjectMilestoneBase(BaseModel):
    project_id: int
    name: str
    due_date: Optional[datetime] = None
    amount: float = 0
    status: str = "pending"


class ProjectMilestoneCreate(ProjectMilestoneBase):
    pass


class ProjectMilestoneUpdate(BaseModel):
    name: Optional[str] = None
    due_date: Optional[datetime] = None
    amount: Optional[float] = None
    status: Optional[str] = None
    completed_at: Optional[datetime] = None


class ProjectMilestoneResponse(ProjectMilestoneBase):
    id: int
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectTaskBase(BaseModel):
    project_id: int
    title: str
    description: Optional[str] = None
    assignee_id: Optional[int] = None
    priority: str = "medium"
    due_date: Optional[datetime] = None
    status: str = "todo"
    hours_estimated: Optional[float] = None
    hours_logged: float = 0
    parent_id: Optional[int] = None
    stage: Optional[str] = None


class ProjectTaskCreate(ProjectTaskBase):
    pass


class ProjectTaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assignee_id: Optional[int] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    hours_estimated: Optional[float] = None
    hours_logged: Optional[float] = None
    parent_id: Optional[int] = None
    stage: Optional[str] = None


class ProjectTaskResponse(ProjectTaskBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectBugBase(BaseModel):
    project_id: int
    title: str
    description: Optional[str] = None
    severity: Optional[str] = None
    status: str = "open"
    reporter_id: Optional[int] = None
    assignee_id: Optional[int] = None


class ProjectBugCreate(ProjectBugBase):
    pass


class ProjectBugUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    reporter_id: Optional[int] = None
    assignee_id: Optional[int] = None
    resolved_at: Optional[datetime] = None


class ProjectBugResponse(ProjectBugBase):
    id: int
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TimesheetBase(BaseModel):
    employee_id: Optional[int] = None
    project_id: Optional[int] = None
    task_id: Optional[int] = None
    date: datetime
    hours: float
    description: Optional[str] = None
    billable: bool = True


class TimesheetCreate(TimesheetBase):
    pass


class TimesheetUpdate(BaseModel):
    employee_id: Optional[int] = None
    project_id: Optional[int] = None
    task_id: Optional[int] = None
    date: Optional[datetime] = None
    hours: Optional[float] = None
    description: Optional[str] = None
    billable: Optional[bool] = None
    approved_by: Optional[int] = None


class TimesheetResponse(TimesheetBase):
    id: int
    company_id: Optional[int] = None
    approved_by: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectExpenseBase(BaseModel):
    project_id: int
    category: Optional[str] = None
    amount: float
    receipt_url: Optional[str] = None


class ProjectExpenseCreate(ProjectExpenseBase):
    pass


class ProjectExpenseUpdate(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = None
    receipt_url: Optional[str] = None
    approved_by: Optional[int] = None


class ProjectExpenseResponse(ProjectExpenseBase):
    id: int
    date: datetime
    approved_by: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectNoteBase(BaseModel):
    project_id: int
    user_id: Optional[int] = None
    note: Optional[str] = None


class ProjectNoteCreate(ProjectNoteBase):
    pass


class ProjectNoteUpdate(BaseModel):
    note: Optional[str] = None


class ProjectNoteResponse(ProjectNoteBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
