from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel


# ── ESS Dashboard ─────────────────────────────────────────────────────────────

class ESSDashboardData(BaseModel):
    employee_name: str = ""
    department_name: str = ""
    designation: str = ""
    today_attendance: Optional[dict] = None
    leave_balance_total: int = 0
    pending_leaves: int = 0
    upcoming_holidays: list = []
    recent_payslips: list = []
    assigned_assets_count: int = 0
    pending_trainings: int = 0
    unread_announcements: int = 0


# ── ESS Profile ───────────────────────────────────────────────────────────────

class ESSProfileUpdate(BaseModel):
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    marital_status: Optional[str] = None
    blood_group: Optional[str] = None
    nationality: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None
    present_address: Optional[str] = None
    permanent_address: Optional[str] = None


class ESSBankUpdate(BaseModel):
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_routing_number: Optional[str] = None
    tax_id: Optional[str] = None


# ── ESS Attendance ────────────────────────────────────────────────────────────

class ESSCheckInRequest(BaseModel):
    method: Optional[str] = "manual"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_id: Optional[int] = None
    notes: Optional[str] = None


class ESSCheckOutRequest(BaseModel):
    notes: Optional[str] = None


# ── ESS Leave ─────────────────────────────────────────────────────────────────

class ESSLeaveApply(BaseModel):
    leave_type_id: int
    start_date: date
    end_date: date
    days: Optional[int] = None
    reason: Optional[str] = None


class ESSLeaveRequestResponse(BaseModel):
    id: int
    leave_type_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    days: Optional[int] = None
    reason: Optional[str] = None
    status: str
    rejection_reason: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── ESS Payslip ───────────────────────────────────────────────────────────────

class ESSPayslipResponse(BaseModel):
    id: int
    month: str
    year: int
    gross_salary: Optional[float] = None
    total_deductions: Optional[float] = None
    net_pay: Optional[float] = None
    status: str
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── ESS Training ──────────────────────────────────────────────────────────────

class ESSTrainingResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    training_type: Optional[str] = None
    duration_hours: Optional[float] = None
    location: Optional[str] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True


class ESSTrainingEnrollmentResponse(BaseModel):
    id: int
    training_id: int
    status: Optional[str] = None
    completion_date: Optional[date] = None
    score: Optional[float] = None
    certificate_url: Optional[str] = None

    class Config:
        from_attributes = True


# ── ESS Performance ───────────────────────────────────────────────────────────

class ESSKPIResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    target_value: Optional[float] = None
    actual_value: Optional[float] = None
    weight: Optional[float] = None
    period: Optional[str] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True


class ESSSelfAssessment(BaseModel):
    self_rating: Optional[float] = None
    self_comments: Optional[str] = None
    achievements: Optional[str] = None
    challenges: Optional[str] = None
    goals: Optional[str] = None


# ── ESS Requests ──────────────────────────────────────────────────────────────

class ESSLoanRequest(BaseModel):
    loan_type: str
    amount: float
    reason: Optional[str] = None
    repayment_months: Optional[int] = None


class ESSAssetRequest(BaseModel):
    asset_type: str
    reason: Optional[str] = None
    required_date: Optional[date] = None


class ESSDocumentRequest(BaseModel):
    document_type: str
    purpose: Optional[str] = None
    notes: Optional[str] = None


# ── ESS Announcement ──────────────────────────────────────────────────────────

class ESSAnnouncementResponse(BaseModel):
    id: int
    title: str
    content: Optional[str] = None
    priority: Optional[str] = "normal"
    created_at: Optional[datetime] = None
    is_read: bool = False

    class Config:
        from_attributes = True


# ── ESS Support ───────────────────────────────────────────────────────────────

class ESSTicketCreate(BaseModel):
    subject: str
    description: str
    category: Optional[str] = "general"
    priority: Optional[str] = "medium"


class ESSTicketResponse(BaseModel):
    id: int
    subject: str
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
