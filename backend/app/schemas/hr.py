from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


# ── Organization Setup ────────────────────────────────────────────────────────


# ── EmploymentType ────────────────────────────────────────────────────────────

class EmploymentTypeBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    is_active: bool = True


class EmploymentTypeCreate(EmploymentTypeBase):
    pass


class EmploymentTypeUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None


class EmploymentTypeResponse(EmploymentTypeBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── WorkLocation ──────────────────────────────────────────────────────────────

class WorkLocationBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius_meters: int = 100
    is_active: bool = True


class WorkLocationCreate(WorkLocationBase):
    pass


class WorkLocationUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius_meters: Optional[int] = None
    is_active: Optional[bool] = None


class WorkLocationResponse(WorkLocationBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Shift ─────────────────────────────────────────────────────────────────────

class ShiftBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    start_time: str
    end_time: str
    grace_period_minutes: int = 15
    break_minutes: int = 60
    overtime_allowed: bool = False
    max_overtime_hours: float = 0
    is_active: bool = True


class ShiftCreate(ShiftBase):
    pass


class ShiftUpdate(BaseModel):
    name: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    grace_period_minutes: Optional[int] = None
    break_minutes: Optional[int] = None
    overtime_allowed: Optional[bool] = None
    max_overtime_hours: Optional[float] = None
    is_active: Optional[bool] = None


class ShiftResponse(ShiftBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Employee Management ───────────────────────────────────────────────────────


class EmployeeBase(BaseModel):
    company_id: Optional[int] = None
    user_id: Optional[int] = None
    employee_code: str
    department_id: Optional[int] = None
    designation: Optional[str] = None
    designation_id: Optional[int] = None
    employment_type_id: Optional[int] = None
    work_location_id: Optional[int] = None
    shift_id: Optional[int] = None
    joining_date: Optional[datetime] = None
    resignation_date: Optional[datetime] = None
    salary: float = 0
    gender: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    marital_status: Optional[str] = None
    blood_group: Optional[str] = None
    nationality: Optional[str] = None
    national_id: Optional[str] = None
    passport_number: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None
    present_address: Optional[str] = None
    permanent_address: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_routing_number: Optional[str] = None
    tax_id: Optional[str] = None
    photo_url: Optional[str] = None
    signature_url: Optional[str] = None
    reporting_to: Optional[int] = None
    secondary_supervisor_id: Optional[int] = None
    skip_level_manager_id: Optional[int] = None
    status: str = "active"


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    user_id: Optional[int] = None
    employee_code: Optional[str] = None
    department_id: Optional[int] = None
    designation: Optional[str] = None
    designation_id: Optional[int] = None
    employment_type_id: Optional[int] = None
    work_location_id: Optional[int] = None
    shift_id: Optional[int] = None
    joining_date: Optional[datetime] = None
    resignation_date: Optional[datetime] = None
    salary: Optional[float] = None
    gender: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    marital_status: Optional[str] = None
    blood_group: Optional[str] = None
    nationality: Optional[str] = None
    national_id: Optional[str] = None
    passport_number: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None
    present_address: Optional[str] = None
    permanent_address: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_routing_number: Optional[str] = None
    tax_id: Optional[str] = None
    photo_url: Optional[str] = None
    signature_url: Optional[str] = None
    reporting_to: Optional[int] = None
    secondary_supervisor_id: Optional[int] = None
    skip_level_manager_id: Optional[int] = None
    status: Optional[str] = None


class EmployeeResponse(EmployeeBase):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    department_name: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Teams ───────────────────────────────────────────────────────────────────


class TeamMemberResponse(BaseModel):
    employee_id: int
    employee_name: Optional[str] = None
    employee_code: Optional[str] = None
    designation: Optional[str] = None
    role: str = "member"
    joined_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TeamBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    description: Optional[str] = None
    lead_id: Optional[int] = None
    department_id: Optional[int] = None
    is_active: bool = True


class TeamCreate(TeamBase):
    member_ids: Optional[List[int]] = None
    member_roles: Optional[List[str]] = None


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    lead_id: Optional[int] = None
    department_id: Optional[int] = None
    is_active: Optional[bool] = None
    member_ids: Optional[List[int]] = None
    member_roles: Optional[List[str]] = None


class TeamResponse(TeamBase):
    id: int
    lead_name: Optional[str] = None
    department_name: Optional[str] = None
    member_count: Optional[int] = 0
    members: Optional[List[TeamMemberResponse]] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TeamMemberAdd(BaseModel):
    employee_id: int
    role: str = "member"


# ── Employee Dependents ──────────────────────────────────────────────────────


class EmployeeDependentBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    name: str
    relationship_type: str
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    national_id: Optional[str] = None
    is_beneficiary: bool = False
    is_emergency_contact: bool = False
    phone: Optional[str] = None
    address: Optional[str] = None
    occupation: Optional[str] = None
    notes: Optional[str] = None


class EmployeeDependentCreate(EmployeeDependentBase):
    pass


class EmployeeDependentUpdate(BaseModel):
    name: Optional[str] = None
    relationship_type: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    national_id: Optional[str] = None
    is_beneficiary: Optional[bool] = None
    is_emergency_contact: Optional[bool] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    occupation: Optional[str] = None
    notes: Optional[str] = None


class EmployeeDependentResponse(EmployeeDependentBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Employee Lifecycle (status history) ──────────────────────────────────────


class EmployeeLifecycleBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    from_status: Optional[str] = None
    to_status: str
    reason: Optional[str] = None
    effective_date: Optional[datetime] = None
    changed_by: Optional[int] = None


class EmployeeLifecycleCreate(EmployeeLifecycleBase):
    pass


class EmployeeLifecycleUpdate(BaseModel):
    from_status: Optional[str] = None
    to_status: Optional[str] = None
    reason: Optional[str] = None
    effective_date: Optional[datetime] = None
    changed_by: Optional[int] = None


class EmployeeLifecycleResponse(EmployeeLifecycleBase):
    id: int
    changed_by_name: Optional[str] = None
    employee_name: Optional[str] = None
    employee_code: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Org Chart ───────────────────────────────────────────────────────────────


class OrgChartNode(BaseModel):
    id: int
    employee_id: int
    employee_name: Optional[str] = None
    employee_code: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    photo_url: Optional[str] = None
    reports_to: Optional[int] = None
    children: List["OrgChartNode"] = []

    class Config:
        from_attributes = True


# ── Recruitment ───────────────────────────────────────────────────────────────


class JobRequisitionBase(BaseModel):
    company_id: Optional[int] = None
    title: str
    department_id: Optional[int] = None
    description: Optional[str] = None
    vacancies: int = 1
    priority: str = "normal"
    status: str = "draft"
    requested_by: Optional[int] = None
    approved_by: Optional[int] = None
    budget: float = 0
    opened_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None


class JobRequisitionCreate(JobRequisitionBase):
    pass


class JobRequisitionUpdate(BaseModel):
    title: Optional[str] = None
    department_id: Optional[int] = None
    description: Optional[str] = None
    vacancies: Optional[int] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    requested_by: Optional[int] = None
    approved_by: Optional[int] = None
    budget: Optional[float] = None
    opened_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None


class JobRequisitionResponse(JobRequisitionBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CandidateBase(BaseModel):
    company_id: Optional[int] = None
    requisition_id: Optional[int] = None
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    resume_url: Optional[str] = None
    source: Optional[str] = None
    stage: str = "applied"
    rating: Optional[int] = None
    notes: Optional[str] = None
    applied_date: Optional[datetime] = None


class CandidateCreate(CandidateBase):
    pass


class CandidateUpdate(BaseModel):
    requisition_id: Optional[int] = None
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    resume_url: Optional[str] = None
    source: Optional[str] = None
    stage: Optional[str] = None
    rating: Optional[int] = None
    notes: Optional[str] = None
    applied_date: Optional[datetime] = None


class CandidateResponse(CandidateBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InterviewBase(BaseModel):
    company_id: Optional[int] = None
    candidate_id: int
    interviewer_id: Optional[int] = None
    round: int = 1
    type: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = 60
    status: str = "scheduled"
    feedback: Optional[str] = None
    rating: Optional[int] = None
    result: Optional[str] = None


class InterviewCreate(InterviewBase):
    pass


class InterviewUpdate(BaseModel):
    interviewer_id: Optional[int] = None
    round: Optional[int] = None
    type: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    status: Optional[str] = None
    feedback: Optional[str] = None
    rating: Optional[int] = None
    result: Optional[str] = None


class InterviewResponse(InterviewBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OfferLetterBase(BaseModel):
    company_id: Optional[int] = None
    candidate_id: Optional[int] = None
    employee_id: Optional[int] = None
    position: Optional[str] = None
    salary_offered: Optional[float] = None
    joining_date: Optional[datetime] = None
    status: str = "draft"
    sent_at: Optional[datetime] = None
    accepted_at: Optional[datetime] = None
    rejected_at: Optional[datetime] = None
    file_url: Optional[str] = None


class OfferLetterCreate(OfferLetterBase):
    pass


class OfferLetterUpdate(BaseModel):
    candidate_id: Optional[int] = None
    employee_id: Optional[int] = None
    position: Optional[str] = None
    salary_offered: Optional[float] = None
    joining_date: Optional[datetime] = None
    status: Optional[str] = None
    sent_at: Optional[datetime] = None
    accepted_at: Optional[datetime] = None
    rejected_at: Optional[datetime] = None
    file_url: Optional[str] = None


class OfferLetterResponse(OfferLetterBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Onboarding ────────────────────────────────────────────────────────────────


class OnboardingTaskBase(BaseModel):
    checklist_id: int
    title: str
    description: Optional[str] = None
    assigned_to: Optional[int] = None
    status: str = "pending"
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class OnboardingTaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: Optional[int] = None
    status: str = "pending"
    due_date: Optional[datetime] = None


class OnboardingTaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[int] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class OnboardingTaskResponse(OnboardingTaskBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OnboardingChecklistBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    status: str = "in_progress"
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class OnboardingChecklistCreate(OnboardingChecklistBase):
    tasks: Optional[List[OnboardingTaskCreate]] = None


class OnboardingChecklistUpdate(BaseModel):
    employee_id: Optional[int] = None
    status: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    tasks: Optional[List[OnboardingTaskCreate]] = None


class OnboardingChecklistResponse(OnboardingChecklistBase):
    id: int
    created_at: Optional[datetime] = None
    tasks: List[OnboardingTaskResponse] = []

    class Config:
        from_attributes = True


# ── Attendance Management ─────────────────────────────────────────────────────


class AttendanceBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    date: datetime
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    status: Optional[str] = None
    late_minutes: int = 0
    early_exit_minutes: int = 0
    ot_hours: float = 0
    biometric_id: Optional[str] = None
    method: str = "manual"
    location_id: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    notes: Optional[str] = None


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceUpdate(BaseModel):
    employee_id: Optional[int] = None
    date: Optional[datetime] = None
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    status: Optional[str] = None
    late_minutes: Optional[int] = None
    early_exit_minutes: Optional[int] = None
    ot_hours: Optional[float] = None
    biometric_id: Optional[str] = None
    method: Optional[str] = None
    location_id: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    notes: Optional[str] = None


class AttendanceResponse(AttendanceBase):
    id: int
    employee_name: Optional[str] = None
    employee_code: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OvertimeRequestBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    date: datetime
    hours: float
    reason: Optional[str] = None
    status: str = "pending"
    approved_by: Optional[int] = None


class OvertimeRequestCreate(OvertimeRequestBase):
    pass


class OvertimeRequestUpdate(BaseModel):
    employee_id: Optional[int] = None
    date: Optional[datetime] = None
    hours: Optional[float] = None
    reason: Optional[str] = None
    status: Optional[str] = None
    approved_by: Optional[int] = None


class OvertimeRequestResponse(OvertimeRequestBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Leave Management ──────────────────────────────────────────────────────────


class LeaveTypeBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    days_per_year: int = 0
    is_paid: bool = True
    is_carry_forward: bool = False
    max_carry_forward: int = 0
    is_active: bool = True


class LeaveTypeCreate(LeaveTypeBase):
    pass


class LeaveTypeUpdate(BaseModel):
    name: Optional[str] = None
    days_per_year: Optional[int] = None
    is_paid: Optional[bool] = None
    is_carry_forward: Optional[bool] = None
    max_carry_forward: Optional[int] = None
    is_active: Optional[bool] = None


class LeaveTypeResponse(LeaveTypeBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LeavePolicyBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    description: Optional[str] = None
    leave_type_id: Optional[int] = None
    employment_type_id: Optional[int] = None
    days: int = 0
    carry_forward: bool = False
    max_carry_forward: int = 0
    is_active: bool = True


class LeavePolicyCreate(LeavePolicyBase):
    pass


class LeavePolicyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    leave_type_id: Optional[int] = None
    employment_type_id: Optional[int] = None
    days: Optional[int] = None
    carry_forward: Optional[bool] = None
    max_carry_forward: Optional[int] = None
    is_active: Optional[bool] = None


class LeavePolicyResponse(LeavePolicyBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LeaveBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    leave_type_id: Optional[int] = None
    type: Optional[str] = None
    start_date: datetime
    end_date: datetime
    days: int
    reason: Optional[str] = None
    status: str = "pending"
    approved_by: Optional[int] = None
    rejection_reason: Optional[str] = None


class LeaveCreate(LeaveBase):
    pass


class LeaveUpdate(BaseModel):
    employee_id: Optional[int] = None
    leave_type_id: Optional[int] = None
    type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    days: Optional[int] = None
    reason: Optional[str] = None
    status: Optional[str] = None
    approved_by: Optional[int] = None
    rejection_reason: Optional[str] = None
    applied_at: Optional[datetime] = None


class LeaveResponse(LeaveBase):
    id: int
    employee_name: Optional[str] = None
    employee_code: Optional[str] = None
    applied_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LeaveBalanceBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    leave_type_id: Optional[int] = None
    year: int
    type: str
    entitled: int = 0
    used: int = 0
    remaining: int = 0
    carried_forward: int = 0


class LeaveBalanceCreate(LeaveBalanceBase):
    pass


class LeaveBalanceUpdate(BaseModel):
    employee_id: Optional[int] = None
    leave_type_id: Optional[int] = None
    year: Optional[int] = None
    type: Optional[str] = None
    entitled: Optional[int] = None
    used: Optional[int] = None
    remaining: Optional[int] = None
    carried_forward: Optional[int] = None


class LeaveBalanceResponse(LeaveBalanceBase):
    id: int

    class Config:
        from_attributes = True


class HolidayBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    date: datetime
    description: Optional[str] = None
    is_recurring: bool = True


class HolidayCreate(HolidayBase):
    pass


class HolidayUpdate(BaseModel):
    name: Optional[str] = None
    date: Optional[datetime] = None
    description: Optional[str] = None
    is_recurring: Optional[bool] = None


class HolidayResponse(HolidayBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Payroll Management ────────────────────────────────────────────────────────


class SalaryComponentBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    type: str
    amount_type: str = "fixed"
    default_amount: float = 0
    is_taxable: bool = True
    is_active: bool = True


class SalaryComponentCreate(SalaryComponentBase):
    pass


class SalaryComponentUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    amount_type: Optional[str] = None
    default_amount: Optional[float] = None
    is_taxable: Optional[bool] = None
    is_active: Optional[bool] = None


class SalaryComponentResponse(SalaryComponentBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SalaryStructureComponentBase(BaseModel):
    structure_id: int
    component_id: int
    amount: float = 0
    percentage: float = 0


class SalaryStructureComponentCreate(BaseModel):
    component_id: int
    amount: float = 0
    percentage: float = 0


class SalaryStructureComponentUpdate(BaseModel):
    component_id: Optional[int] = None
    amount: Optional[float] = None
    percentage: Optional[float] = None


class SalaryStructureComponentResponse(SalaryStructureComponentBase):
    id: int

    class Config:
        from_attributes = True


class SalaryStructureBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    description: Optional[str] = None
    is_default: bool = False
    is_active: bool = True


class SalaryStructureCreate(SalaryStructureBase):
    components: Optional[List[SalaryStructureComponentCreate]] = None


class SalaryStructureUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_default: Optional[bool] = None
    is_active: Optional[bool] = None
    components: Optional[List[SalaryStructureComponentCreate]] = None


class SalaryStructureResponse(SalaryStructureBase):
    id: int
    created_at: Optional[datetime] = None
    components: List[SalaryStructureComponentResponse] = []

    class Config:
        from_attributes = True


class PayrollItemBase(BaseModel):
    payroll_id: int
    component_id: Optional[int] = None
    type: str
    name: str
    amount: float = 0


class PayrollItemCreate(BaseModel):
    component_id: Optional[int] = None
    type: str
    name: str
    amount: float = 0


class PayrollItemUpdate(BaseModel):
    component_id: Optional[int] = None
    type: Optional[str] = None
    name: Optional[str] = None
    amount: Optional[float] = None


class PayrollItemResponse(PayrollItemBase):
    id: int

    class Config:
        from_attributes = True


class PayrollBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    month: int
    year: int
    base_salary: float = 0
    allowances: float = 0
    deductions: float = 0
    tax: float = 0
    bonus: float = 0
    loan_deduction: Optional[float] = 0
    net_pay: float = 0
    status: str = "draft"
    payslip_url: Optional[str] = None
    paid_at: Optional[datetime] = None


class PayrollCreate(PayrollBase):
    items: Optional[List[PayrollItemCreate]] = None


class PayrollUpdate(BaseModel):
    employee_id: Optional[int] = None
    month: Optional[int] = None
    year: Optional[int] = None
    base_salary: Optional[float] = None
    allowances: Optional[float] = None
    deductions: Optional[float] = None
    tax: Optional[float] = None
    bonus: Optional[float] = None
    loan_deduction: Optional[float] = None
    net_pay: Optional[float] = None
    status: Optional[str] = None
    payslip_url: Optional[str] = None
    paid_at: Optional[datetime] = None
    items: Optional[List[PayrollItemCreate]] = None


class PayrollResponse(PayrollBase):
    id: int
    employee_name: Optional[str] = None
    employee_code: Optional[str] = None
    created_at: Optional[datetime] = None
    items: List[PayrollItemResponse] = []

    class Config:
        from_attributes = True


class LoanInstallmentBase(BaseModel):
    loan_id: int
    installment_number: int
    amount: float
    paid_amount: float = 0
    due_date: Optional[datetime] = None
    paid_at: Optional[datetime] = None
    status: str = "pending"


class LoanInstallmentCreate(BaseModel):
    installment_number: int
    amount: float
    paid_amount: float = 0
    due_date: Optional[datetime] = None


class LoanInstallmentUpdate(BaseModel):
    installment_number: Optional[int] = None
    amount: Optional[float] = None
    paid_amount: Optional[float] = None
    due_date: Optional[datetime] = None
    paid_at: Optional[datetime] = None
    status: Optional[str] = None


class LoanInstallmentResponse(LoanInstallmentBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LoanBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    type: str
    amount: float
    remaining: float
    installment_amount: float = 0
    monthly_deduction: float = 0
    status: str = "active"
    reason: Optional[str] = None
    approved_by: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class LoanCreate(LoanBase):
    installments: Optional[List[LoanInstallmentCreate]] = None


class LoanUpdate(BaseModel):
    employee_id: Optional[int] = None
    type: Optional[str] = None
    amount: Optional[float] = None
    remaining: Optional[float] = None
    installment_amount: Optional[float] = None
    monthly_deduction: Optional[float] = None
    status: Optional[str] = None
    reason: Optional[str] = None
    approved_by: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    installments: Optional[List[LoanInstallmentCreate]] = None


class LoanResponse(LoanBase):
    id: int
    created_at: Optional[datetime] = None
    installments: List[LoanInstallmentResponse] = []

    class Config:
        from_attributes = True


# ── Benefits Management ───────────────────────────────────────────────────────


class BenefitPlanBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    type: str
    description: Optional[str] = None
    provider: Optional[str] = None
    monthly_cost: float = 0
    employee_contribution: float = 0
    is_active: bool = True


class BenefitPlanCreate(BenefitPlanBase):
    pass


class BenefitPlanUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    provider: Optional[str] = None
    monthly_cost: Optional[float] = None
    employee_contribution: Optional[float] = None
    is_active: Optional[bool] = None


class BenefitPlanResponse(BenefitPlanBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EmployeeBenefitBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    plan_id: int
    status: str = "active"
    enrolled_at: Optional[datetime] = None
    terminated_at: Optional[datetime] = None


class EmployeeBenefitCreate(EmployeeBenefitBase):
    pass


class EmployeeBenefitUpdate(BaseModel):
    employee_id: Optional[int] = None
    plan_id: Optional[int] = None
    status: Optional[str] = None
    enrolled_at: Optional[datetime] = None
    terminated_at: Optional[datetime] = None


class EmployeeBenefitResponse(EmployeeBenefitBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Performance Management ────────────────────────────────────────────────────


class KPIBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: Optional[int] = None
    department_id: Optional[int] = None
    name: str
    description: Optional[str] = None
    type: str = "individual"
    target_value: Optional[float] = None
    actual_value: float = 0
    unit: Optional[str] = None
    weight: int = 0
    period: Optional[str] = None
    status: str = "active"


class KPICreate(KPIBase):
    pass


class KPIUpdate(BaseModel):
    employee_id: Optional[int] = None
    department_id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    target_value: Optional[float] = None
    actual_value: Optional[float] = None
    unit: Optional[str] = None
    weight: Optional[int] = None
    period: Optional[str] = None
    status: Optional[str] = None


class KPIResponse(KPIBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PerformanceReviewBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    reviewer_id: Optional[int] = None
    period: Optional[str] = None
    review_type: str = "monthly"
    goals_json: Optional[dict] = None
    rating: Optional[float] = None
    feedback: Optional[str] = None
    self_assessment: Optional[str] = None
    status: str = "draft"


class PerformanceReviewCreate(PerformanceReviewBase):
    pass


class PerformanceReviewUpdate(BaseModel):
    employee_id: Optional[int] = None
    reviewer_id: Optional[int] = None
    period: Optional[str] = None
    review_type: Optional[str] = None
    goals_json: Optional[dict] = None
    rating: Optional[float] = None
    feedback: Optional[str] = None
    self_assessment: Optional[str] = None
    status: Optional[str] = None


class PerformanceReviewResponse(PerformanceReviewBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AppraisalBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    review_id: Optional[int] = None
    type: Optional[str] = None
    current_salary: Optional[float] = None
    proposed_salary: Optional[float] = None
    increment_percentage: Optional[float] = None
    promotion: bool = False
    new_designation: Optional[str] = None
    remarks: Optional[str] = None
    status: str = "draft"
    approved_by: Optional[int] = None
    effective_date: Optional[datetime] = None


class AppraisalCreate(AppraisalBase):
    pass


class AppraisalUpdate(BaseModel):
    employee_id: Optional[int] = None
    review_id: Optional[int] = None
    type: Optional[str] = None
    current_salary: Optional[float] = None
    proposed_salary: Optional[float] = None
    increment_percentage: Optional[float] = None
    promotion: Optional[bool] = None
    new_designation: Optional[str] = None
    remarks: Optional[str] = None
    status: Optional[str] = None
    approved_by: Optional[int] = None
    effective_date: Optional[datetime] = None


class AppraisalResponse(AppraisalBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Training Management ───────────────────────────────────────────────────────


class TrainingBase(BaseModel):
    company_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    trainer: Optional[str] = None
    training_type: str = "internal"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_hours: Optional[float] = None
    location: Optional[str] = None
    mode: Optional[str] = None
    max_participants: Optional[int] = None
    cost: float = 0
    status: str = "upcoming"


class TrainingCreate(TrainingBase):
    enrollments: Optional[List["TrainingEnrollmentCreate"]] = None


class TrainingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    trainer: Optional[str] = None
    training_type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_hours: Optional[float] = None
    location: Optional[str] = None
    mode: Optional[str] = None
    max_participants: Optional[int] = None
    cost: Optional[float] = None
    status: Optional[str] = None
    enrollments: Optional[List["TrainingEnrollmentCreate"]] = None


class TrainingResponse(TrainingBase):
    id: int
    created_at: Optional[datetime] = None
    enrollments: List["TrainingEnrollmentResponse"] = []

    class Config:
        from_attributes = True


class TrainingEnrollmentBase(BaseModel):
    training_id: int
    employee_id: int
    status: str = "enrolled"
    completion_date: Optional[datetime] = None
    score: Optional[float] = None
    certificate_url: Optional[str] = None
    completed_at: Optional[datetime] = None


class TrainingEnrollmentCreate(BaseModel):
    employee_id: int
    status: str = "enrolled"


class TrainingEnrollmentUpdate(BaseModel):
    employee_id: Optional[int] = None
    status: Optional[str] = None
    completion_date: Optional[datetime] = None
    score: Optional[float] = None
    certificate_url: Optional[str] = None
    completed_at: Optional[datetime] = None


class TrainingEnrollmentResponse(TrainingEnrollmentBase):
    id: int

    class Config:
        from_attributes = True


class CertificationBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    name: str
    issuing_organization: Optional[str] = None
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    credential_id: Optional[str] = None
    file_url: Optional[str] = None
    status: str = "active"


class CertificationCreate(CertificationBase):
    pass


class CertificationUpdate(BaseModel):
    employee_id: Optional[int] = None
    name: Optional[str] = None
    issuing_organization: Optional[str] = None
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    credential_id: Optional[str] = None
    file_url: Optional[str] = None
    status: Optional[str] = None


class CertificationResponse(CertificationBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Disciplinary Management ───────────────────────────────────────────────────


class DisciplinaryActionBase(BaseModel):
    incident_id: int
    action_type: str
    description: Optional[str] = None
    effective_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    issued_by: Optional[int] = None
    status: str = "active"


class DisciplinaryActionCreate(BaseModel):
    action_type: str
    description: Optional[str] = None
    effective_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    issued_by: Optional[int] = None


class DisciplinaryActionUpdate(BaseModel):
    action_type: Optional[str] = None
    description: Optional[str] = None
    effective_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    issued_by: Optional[int] = None
    status: Optional[str] = None


class DisciplinaryActionResponse(DisciplinaryActionBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DisciplinaryIncidentBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    type: str
    title: str
    description: Optional[str] = None
    incident_date: Optional[datetime] = None
    severity: Optional[str] = None
    status: str = "open"
    reported_by: Optional[int] = None
    witness: Optional[str] = None


class DisciplinaryIncidentCreate(DisciplinaryIncidentBase):
    actions: Optional[List[DisciplinaryActionCreate]] = None


class DisciplinaryIncidentUpdate(BaseModel):
    employee_id: Optional[int] = None
    type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    incident_date: Optional[datetime] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    reported_by: Optional[int] = None
    witness: Optional[str] = None
    actions: Optional[List[DisciplinaryActionCreate]] = None


class DisciplinaryIncidentResponse(DisciplinaryIncidentBase):
    id: int
    created_at: Optional[datetime] = None
    actions: List[DisciplinaryActionResponse] = []

    class Config:
        from_attributes = True


# ── Employee Documents & Assets ───────────────────────────────────────────────


class EmployeeDocumentBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    category: Optional[str] = None
    doc_type: Optional[str] = None
    title: Optional[str] = None
    file_url: Optional[str] = None
    version: int = 1
    uploaded_by: Optional[int] = None
    uploaded_at: Optional[datetime] = None
    expiry_date: Optional[datetime] = None


class EmployeeDocumentCreate(EmployeeDocumentBase):
    pass


class EmployeeDocumentUpdate(BaseModel):
    employee_id: Optional[int] = None
    category: Optional[str] = None
    doc_type: Optional[str] = None
    title: Optional[str] = None
    file_url: Optional[str] = None
    version: Optional[int] = None
    uploaded_by: Optional[int] = None
    uploaded_at: Optional[datetime] = None
    expiry_date: Optional[datetime] = None


class EmployeeDocumentResponse(EmployeeDocumentBase):
    id: int

    class Config:
        from_attributes = True


class EmployeeAssetBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    asset_type: Optional[str] = None
    name: Optional[str] = None
    serial: Optional[str] = None
    condition_at_assignment: Optional[str] = None
    assigned_at: Optional[datetime] = None
    returned_at: Optional[datetime] = None
    condition_at_return: Optional[str] = None
    status: str = "assigned"
    notes: Optional[str] = None


class EmployeeAssetCreate(EmployeeAssetBase):
    pass


class EmployeeAssetUpdate(BaseModel):
    employee_id: Optional[int] = None
    asset_type: Optional[str] = None
    name: Optional[str] = None
    serial: Optional[str] = None
    condition_at_assignment: Optional[str] = None
    assigned_at: Optional[datetime] = None
    returned_at: Optional[datetime] = None
    condition_at_return: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class EmployeeAssetResponse(EmployeeAssetBase):
    id: int

    class Config:
        from_attributes = True


# ── Offboarding ───────────────────────────────────────────────────────────────


class ResignationBase(BaseModel):
    company_id: Optional[int] = None
    employee_id: int
    reason: Optional[str] = None
    last_working_date: Optional[datetime] = None
    notice_period_days: int = 30
    status: str = "pending"
    approved_by: Optional[int] = None


class ResignationCreate(ResignationBase):
    pass


class ResignationUpdate(BaseModel):
    employee_id: Optional[int] = None
    reason: Optional[str] = None
    last_working_date: Optional[datetime] = None
    notice_period_days: Optional[int] = None
    status: Optional[str] = None
    approved_by: Optional[int] = None


class ResignationResponse(ResignationBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ClearanceChecklistBase(BaseModel):
    resignation_id: int
    department: Optional[str] = None
    item: Optional[str] = None
    status: str = "pending"
    cleared_by: Optional[int] = None
    cleared_at: Optional[datetime] = None
    notes: Optional[str] = None


class ClearanceChecklistCreate(ClearanceChecklistBase):
    pass


class ClearanceChecklistUpdate(BaseModel):
    department: Optional[str] = None
    item: Optional[str] = None
    status: Optional[str] = None
    cleared_by: Optional[int] = None
    cleared_at: Optional[datetime] = None
    notes: Optional[str] = None


class ClearanceChecklistResponse(ClearanceChecklistBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── HR Settings ───────────────────────────────────────────────────────────────


class AttendancePolicyBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    work_days: str = "Mon,Tue,Wed,Thu,Fri"
    work_hours_per_day: float = 8
    grace_period_minutes: int = 15
    overtime_threshold_minutes: int = 30
    max_overtime_hours: float = 4
    late_deduction_enabled: bool = False
    auto_checkout_enabled: bool = False
    auto_checkout_time: Optional[str] = None
    is_active: bool = True


class AttendancePolicyCreate(AttendancePolicyBase):
    pass


class AttendancePolicyUpdate(BaseModel):
    name: Optional[str] = None
    work_days: Optional[str] = None
    work_hours_per_day: Optional[float] = None
    grace_period_minutes: Optional[int] = None
    overtime_threshold_minutes: Optional[int] = None
    max_overtime_hours: Optional[float] = None
    late_deduction_enabled: Optional[bool] = None
    auto_checkout_enabled: Optional[bool] = None
    auto_checkout_time: Optional[str] = None
    is_active: Optional[bool] = None


class AttendancePolicyResponse(AttendancePolicyBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PayrollPolicyBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    pay_frequency: str = "monthly"
    pay_day: int = 1
    tax_calculation: str = "auto"
    overtime_rate_multiplier: float = 1.5
    pf_enabled: bool = False
    pf_percentage: float = 0
    is_active: bool = True


class PayrollPolicyCreate(PayrollPolicyBase):
    pass


class PayrollPolicyUpdate(BaseModel):
    name: Optional[str] = None
    pay_frequency: Optional[str] = None
    pay_day: Optional[int] = None
    tax_calculation: Optional[str] = None
    overtime_rate_multiplier: Optional[float] = None
    pf_enabled: Optional[bool] = None
    pf_percentage: Optional[float] = None
    is_active: Optional[bool] = None


class PayrollPolicyResponse(PayrollPolicyBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
