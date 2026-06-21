from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    employee_code = Column(String(50), unique=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    designation = Column(String(100))
    joining_date = Column(DateTime(timezone=True))
    resignation_date = Column(DateTime(timezone=True), nullable=True)
    salary = Column(Numeric(15, 2), default=0)
    status = Column(String(20), default="active")
    shift_id = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User")
    department = relationship("Department")

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
    ot_hours = Column(Numeric(5, 2), default=0)
    biometric_id = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Leave(Base):
    __tablename__ = "leaves"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    type = Column(String(50), nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    days = Column(Integer, nullable=False)
    reason = Column(Text)
    status = Column(String(20), default="pending")
    approved_by = Column(Integer, ForeignKey("users.id"))
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class LeaveBalance(Base):
    __tablename__ = "leave_balances"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    year = Column(Integer, nullable=False)
    type = Column(String(50), nullable=False)
    entitled = Column(Integer, default=0)
    used = Column(Integer, default=0)
    remaining = Column(Integer, default=0)

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
    net_pay = Column(Numeric(15, 2), default=0)
    status = Column(String(20), default="draft")
    payslip_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("PayrollItem", back_populates="payroll")

class PayrollItem(Base):
    __tablename__ = "payroll_items"

    id = Column(Integer, primary_key=True, index=True)
    payroll_id = Column(Integer, ForeignKey("payroll.id"), nullable=False)
    type = Column(String(50), nullable=False)
    name = Column(String(100), nullable=False)
    amount = Column(Numeric(15, 2), default=0)

    payroll = relationship("Payroll", back_populates="items")

class Recruitment(Base):
    __tablename__ = "recruitments"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    position = Column(String(255), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    job_type = Column(String(50))
    description = Column(Text)
    candidate_name = Column(String(255))
    stage = Column(String(50), default="applied")
    source = Column(String(100))
    applied_date = Column(DateTime(timezone=True), server_default=func.now())
    hired_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class Training(Base):
    __tablename__ = "trainings"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    trainer = Column(String(255))
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    mode = Column(String(50))
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
    completed_at = Column(DateTime(timezone=True))

    training = relationship("Training", back_populates="enrollments")

class PerformanceReview(Base):
    __tablename__ = "performance_reviews"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    period = Column(String(50))
    goals_json = Column(JSON, default={})
    rating = Column(Numeric(3, 2))
    feedback = Column(Text)
    status = Column(String(20), default="draft")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class EmployeeAsset(Base):
    __tablename__ = "employee_assets"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    asset_type = Column(String(100))
    name = Column(String(255))
    serial = Column(String(100))
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    returned_at = Column(DateTime(timezone=True))
    condition = Column(String(50))

class EmployeeDocument(Base):
    __tablename__ = "employee_documents"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    doc_type = Column(String(100))
    file_url = Column(String(500))
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    expiry_date = Column(DateTime(timezone=True))
