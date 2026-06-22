from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric, JSON, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


# ── Organization Setup ───────────────────────────────────────────────────────

class EmploymentType(Base):
    __tablename__ = "employment_types"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)


class WorkLocation(Base):
    __tablename__ = "work_locations"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    address = Column(Text)
    latitude = Column(Numeric(10, 7))
    longitude = Column(Numeric(10, 7))
    radius_meters = Column(Integer, default=100)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)


class Shift(Base):
    __tablename__ = "shifts"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(100), nullable=False)
    start_time = Column(String(5), nullable=False)
    end_time = Column(String(5), nullable=False)
    grace_period_minutes = Column(Integer, default=15)
    break_minutes = Column(Integer, default=60)
    overtime_allowed = Column(Boolean, default=False)
    max_overtime_hours = Column(Numeric(5, 2), default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)


# ── Employee Management ─────────────────────────────────────────────────────

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    employee_code = Column(String(50), unique=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    designation = Column(String(100))
    designation_id = Column(Integer, ForeignKey("designations.id"))
    employment_type_id = Column(Integer, ForeignKey("employment_types.id"))
    work_location_id = Column(Integer, ForeignKey("work_locations.id"))
    shift_id = Column(Integer, ForeignKey("shifts.id"))
    joining_date = Column(DateTime(timezone=True))
    resignation_date = Column(DateTime(timezone=True), nullable=True)
    salary = Column(Numeric(15, 2), default=0)
    gender = Column(String(20))
    date_of_birth = Column(DateTime(timezone=True))
    marital_status = Column(String(20))
    blood_group = Column(String(10))
    nationality = Column(String(100))
    national_id = Column(String(100))
    passport_number = Column(String(100))
    phone = Column(String(50))
    emergency_contact_name = Column(String(255))
    emergency_contact_phone = Column(String(50))
    emergency_contact_relation = Column(String(50))
    present_address = Column(Text)
    permanent_address = Column(Text)
    bank_name = Column(String(255))
    bank_account_number = Column(String(100))
    bank_routing_number = Column(String(100))
    tax_id = Column(String(100))
    photo_url = Column(String(500))
    reporting_to = Column(Integer, ForeignKey("employees.id"))
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", foreign_keys=[user_id])
    department = relationship("Department")
    reports_to_emp = relationship("Employee", remote_side=[id], foreign_keys=[reporting_to])
    shifts = relationship("Shift", foreign_keys=[shift_id])
    employment_type = relationship("EmploymentType", foreign_keys=[employment_type_id])
    work_location = relationship("WorkLocation", foreign_keys=[work_location_id])


# ── Recruitment ─────────────────────────────────────────────────────────────

class JobRequisition(Base):
    __tablename__ = "job_requisitions"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    title = Column(String(255), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    description = Column(Text)
    vacancies = Column(Integer, default=1)
    priority = Column(String(20), default="normal")
    status = Column(String(20), default="draft")
    requested_by = Column(Integer, ForeignKey("users.id"))
    approved_by = Column(Integer, ForeignKey("users.id"))
    budget = Column(Numeric(15, 2), default=0)
    opened_at = Column(DateTime(timezone=True))
    closed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    requisition_id = Column(Integer, ForeignKey("job_requisitions.id"))
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    resume_url = Column(String(500))
    source = Column(String(100))
    stage = Column(String(50), default="applied")
    rating = Column(Integer)
    notes = Column(Text)
    applied_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    requisition = relationship("JobRequisition")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    interviewer_id = Column(Integer, ForeignKey("users.id"))
    round = Column(Integer, default=1)
    type = Column(String(50))
    scheduled_at = Column(DateTime(timezone=True))
    duration_minutes = Column(Integer, default=60)
    status = Column(String(20), default="scheduled")
    feedback = Column(Text)
    rating = Column(Integer)
    result = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    candidate = relationship("Candidate")


class OfferLetter(Base):
    __tablename__ = "offer_letters"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    employee_id = Column(Integer, ForeignKey("employees.id"))
    position = Column(String(255))
    salary_offered = Column(Numeric(15, 2))
    joining_date = Column(DateTime(timezone=True))
    status = Column(String(20), default="draft")
    sent_at = Column(DateTime(timezone=True))
    accepted_at = Column(DateTime(timezone=True))
    rejected_at = Column(DateTime(timezone=True))
    file_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    candidate = relationship("Candidate")
    employee = relationship("Employee")


# ── Onboarding ──────────────────────────────────────────────────────────────

class OnboardingChecklist(Base):
    __tablename__ = "onboarding_checklists"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    status = Column(String(20), default="in_progress")
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tasks = relationship("OnboardingTask", back_populates="checklist")
    employee = relationship("Employee")


class OnboardingTask(Base):
    __tablename__ = "onboarding_tasks"

    id = Column(Integer, primary_key=True, index=True)
    checklist_id = Column(Integer, ForeignKey("onboarding_checklists.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    assigned_to = Column(Integer, ForeignKey("users.id"))
    status = Column(String(20), default="pending")
    due_date = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    checklist = relationship("OnboardingChecklist", back_populates="tasks")


# ── Attendance Management ───────────────────────────────────────────────────

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    check_in = Column(DateTime(timezone=True))
    check_out = Column(DateTime(timezone=True))
    status = Column(String(20))
    late_minutes = Column(Integer, default=0)
    early_exit_minutes = Column(Integer, default=0)
    ot_hours = Column(Numeric(5, 2), default=0)
    biometric_id = Column(String(100))
    method = Column(String(50), default="manual")
    location_id = Column(Integer, ForeignKey("work_locations.id"))
    latitude = Column(Numeric(10, 7))
    longitude = Column(Numeric(10, 7))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class OvertimeRequest(Base):
    __tablename__ = "overtime_requests"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    hours = Column(Numeric(5, 2), nullable=False)
    reason = Column(Text)
    status = Column(String(20), default="pending")
    approved_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ── Leave Management ────────────────────────────────────────────────────────

class LeaveType(Base):
    __tablename__ = "leave_types"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(100), nullable=False)
    days_per_year = Column(Integer, default=0)
    is_paid = Column(Boolean, default=True)
    is_carry_forward = Column(Boolean, default=False)
    max_carry_forward = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)


class LeavePolicy(Base):
    __tablename__ = "leave_policies"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    leave_type_id = Column(Integer, ForeignKey("leave_types.id"))
    employment_type_id = Column(Integer, ForeignKey("employment_types.id"))
    days = Column(Integer, default=0)
    carry_forward = Column(Boolean, default=False)
    max_carry_forward = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)


class Leave(Base):
    __tablename__ = "leaves"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type_id = Column(Integer, ForeignKey("leave_types.id"))
    type = Column(String(50), nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    days = Column(Integer, nullable=False)
    reason = Column(Text)
    status = Column(String(20), default="pending")
    approved_by = Column(Integer, ForeignKey("users.id"))
    rejection_reason = Column(Text)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LeaveBalance(Base):
    __tablename__ = "leave_balances"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type_id = Column(Integer, ForeignKey("leave_types.id"))
    year = Column(Integer, nullable=False)
    type = Column(String(50), nullable=False)
    entitled = Column(Integer, default=0)
    used = Column(Integer, default=0)
    remaining = Column(Integer, default=0)
    carried_forward = Column(Integer, default=0)


class Holiday(Base):
    __tablename__ = "holidays"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    description = Column(Text)
    is_recurring = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)


# ── Payroll Management ──────────────────────────────────────────────────────

class SalaryComponent(Base):
    __tablename__ = "salary_components"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(String(20), nullable=False)
    amount_type = Column(String(20), default="fixed")
    default_amount = Column(Numeric(15, 2), default=0)
    is_taxable = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)


class SalaryStructure(Base):
    __tablename__ = "salary_structures"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    components = relationship("SalaryStructureComponent", back_populates="structure")


class SalaryStructureComponent(Base):
    __tablename__ = "salary_structure_components"

    id = Column(Integer, primary_key=True, index=True)
    structure_id = Column(Integer, ForeignKey("salary_structures.id"), nullable=False)
    component_id = Column(Integer, ForeignKey("salary_components.id"), nullable=False)
    amount = Column(Numeric(15, 2), default=0)
    percentage = Column(Numeric(5, 2), default=0)

    structure = relationship("SalaryStructure", back_populates="components")
    component = relationship("SalaryComponent")


class Payroll(Base):
    __tablename__ = "payroll"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    base_salary = Column(Numeric(15, 2), default=0)
    allowances = Column(Numeric(15, 2), default=0)
    deductions = Column(Numeric(15, 2), default=0)
    tax = Column(Numeric(15, 2), default=0)
    bonus = Column(Numeric(15, 2), default=0)
    loan_deduction = Column(Numeric(15, 2), default=0)
    net_pay = Column(Numeric(15, 2), default=0)
    status = Column(String(20), default="draft")
    payslip_url = Column(String(500))
    paid_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("PayrollItem", back_populates="payroll")


class PayrollItem(Base):
    __tablename__ = "payroll_items"

    id = Column(Integer, primary_key=True, index=True)
    payroll_id = Column(Integer, ForeignKey("payroll.id"), nullable=False)
    component_id = Column(Integer, ForeignKey("salary_components.id"))
    type = Column(String(50), nullable=False)
    name = Column(String(100), nullable=False)
    amount = Column(Numeric(15, 2), default=0)

    payroll = relationship("Payroll", back_populates="items")
    component = relationship("SalaryComponent")


class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    type = Column(String(50), nullable=False)
    amount = Column(Numeric(15, 2), nullable=False)
    remaining = Column(Numeric(15, 2), nullable=False)
    installment_amount = Column(Numeric(15, 2), default=0)
    monthly_deduction = Column(Numeric(15, 2), default=0)
    status = Column(String(20), default="active")
    reason = Column(Text)
    approved_by = Column(Integer, ForeignKey("users.id"))
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LoanInstallment(Base):
    __tablename__ = "loan_installments"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("loans.id"), nullable=False)
    installment_number = Column(Integer, nullable=False)
    amount = Column(Numeric(15, 2), nullable=False)
    paid_amount = Column(Numeric(15, 2), default=0)
    due_date = Column(DateTime(timezone=True))
    paid_at = Column(DateTime(timezone=True))
    status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    loan = relationship("Loan")


# ── Benefits Management ─────────────────────────────────────────────────────

class BenefitPlan(Base):
    __tablename__ = "benefit_plans"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    description = Column(Text)
    provider = Column(String(255))
    monthly_cost = Column(Numeric(15, 2), default=0)
    employee_contribution = Column(Numeric(15, 2), default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)


class EmployeeBenefit(Base):
    __tablename__ = "employee_benefits"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("benefit_plans.id"), nullable=False)
    status = Column(String(20), default="active")
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    terminated_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    plan = relationship("BenefitPlan")
    employee = relationship("Employee")


# ── Performance Management ──────────────────────────────────────────────────

class KPI(Base):
    __tablename__ = "kpis"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(50), default="individual")
    target_value = Column(Numeric(15, 2))
    actual_value = Column(Numeric(15, 2), default=0)
    unit = Column(String(50))
    weight = Column(Integer, default=0)
    period = Column(String(50))
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)


class PerformanceReview(Base):
    __tablename__ = "performance_reviews"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    period = Column(String(50))
    review_type = Column(String(50), default="monthly")
    goals_json = Column(JSON, default={})
    rating = Column(Numeric(3, 2))
    feedback = Column(Text)
    self_assessment = Column(Text)
    status = Column(String(20), default="draft")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Appraisal(Base):
    __tablename__ = "appraisals"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    review_id = Column(Integer, ForeignKey("performance_reviews.id"))
    type = Column(String(50))
    current_salary = Column(Numeric(15, 2))
    proposed_salary = Column(Numeric(15, 2))
    increment_percentage = Column(Numeric(5, 2))
    promotion = Column(Boolean, default=False)
    new_designation = Column(String(100))
    remarks = Column(Text)
    status = Column(String(20), default="draft")
    approved_by = Column(Integer, ForeignKey("users.id"))
    effective_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ── Training Management ─────────────────────────────────────────────────────

class Training(Base):
    __tablename__ = "trainings"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    trainer = Column(String(255))
    training_type = Column(String(50), default="internal")
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    duration_hours = Column(Numeric(5, 2))
    location = Column(String(255))
    mode = Column(String(50))
    max_participants = Column(Integer)
    cost = Column(Numeric(15, 2), default=0)
    status = Column(String(20), default="upcoming")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    enrollments = relationship("TrainingEnrollment", back_populates="training")


class TrainingEnrollment(Base):
    __tablename__ = "training_enrollments"

    id = Column(Integer, primary_key=True, index=True)
    training_id = Column(Integer, ForeignKey("trainings.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    status = Column(String(20), default="enrolled")
    completion_date = Column(DateTime(timezone=True))
    score = Column(Numeric(5, 2))
    certificate_url = Column(String(500))
    completed_at = Column(DateTime(timezone=True))

    training = relationship("Training", back_populates="enrollments")


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    name = Column(String(255), nullable=False)
    issuing_organization = Column(String(255))
    issue_date = Column(DateTime(timezone=True))
    expiry_date = Column(DateTime(timezone=True))
    credential_id = Column(String(255))
    file_url = Column(String(500))
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ── Disciplinary Management ─────────────────────────────────────────────────

class DisciplinaryIncident(Base):
    __tablename__ = "disciplinary_incidents"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    incident_date = Column(DateTime(timezone=True))
    severity = Column(String(20))
    status = Column(String(20), default="open")
    reported_by = Column(Integer, ForeignKey("users.id"))
    witness = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)


class DisciplinaryAction(Base):
    __tablename__ = "disciplinary_actions"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("disciplinary_incidents.id"), nullable=False)
    action_type = Column(String(50), nullable=False)
    description = Column(Text)
    effective_date = Column(DateTime(timezone=True))
    expiry_date = Column(DateTime(timezone=True))
    issued_by = Column(Integer, ForeignKey("users.id"))
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    incident = relationship("DisciplinaryIncident")


# ── Employee Documents & Assets ─────────────────────────────────────────────

class EmployeeDocument(Base):
    __tablename__ = "employee_documents"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    category = Column(String(100))
    doc_type = Column(String(100))
    title = Column(String(255))
    file_url = Column(String(500))
    version = Column(Integer, default=1)
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    expiry_date = Column(DateTime(timezone=True))


class EmployeeAsset(Base):
    __tablename__ = "employee_assets"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    asset_type = Column(String(100))
    name = Column(String(255))
    serial = Column(String(100))
    condition_at_assignment = Column(String(50))
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    returned_at = Column(DateTime(timezone=True))
    condition_at_return = Column(String(50))
    status = Column(String(20), default="assigned")
    notes = Column(Text)


# ── Offboarding ─────────────────────────────────────────────────────────────

class Resignation(Base):
    __tablename__ = "resignations"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    reason = Column(Text)
    last_working_date = Column(DateTime(timezone=True))
    notice_period_days = Column(Integer, default=30)
    status = Column(String(20), default="pending")
    approved_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    employee = relationship("Employee")


class ClearanceChecklist(Base):
    __tablename__ = "clearance_checklists"

    id = Column(Integer, primary_key=True, index=True)
    resignation_id = Column(Integer, ForeignKey("resignations.id"), nullable=False)
    department = Column(String(100))
    item = Column(String(255))
    status = Column(String(20), default="pending")
    cleared_by = Column(Integer, ForeignKey("users.id"))
    cleared_at = Column(DateTime(timezone=True))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    resignation = relationship("Resignation")


# ── HR Settings ─────────────────────────────────────────────────────────────

class AttendancePolicy(Base):
    __tablename__ = "attendance_policies"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    work_days = Column(String(100), default="Mon,Tue,Wed,Thu,Fri")
    work_hours_per_day = Column(Numeric(4, 2), default=8)
    grace_period_minutes = Column(Integer, default=15)
    overtime_threshold_minutes = Column(Integer, default=30)
    max_overtime_hours = Column(Numeric(5, 2), default=4)
    late_deduction_enabled = Column(Boolean, default=False)
    auto_checkout_enabled = Column(Boolean, default=False)
    auto_checkout_time = Column(String(5))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PayrollPolicy(Base):
    __tablename__ = "payroll_policies"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    pay_frequency = Column(String(50), default="monthly")
    pay_day = Column(Integer, default=1)
    tax_calculation = Column(String(50), default="auto")
    overtime_rate_multiplier = Column(Numeric(5, 2), default=1.5)
    pf_enabled = Column(Boolean, default=False)
    pf_percentage = Column(Numeric(5, 2), default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
