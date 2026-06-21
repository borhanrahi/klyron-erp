from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    client_id = Column(Integer, ForeignKey("customers.id"))
    manager_id = Column(Integer, ForeignKey("users.id"))
    budget = Column(Numeric(15, 2), default=0)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    status = Column(String(20), default="planning")
    priority = Column(String(20), default="medium")
    progress_pct = Column(Integer, default=0)
    billing_type = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    tasks = relationship("ProjectTask", back_populates="project")
    milestones = relationship("ProjectMilestone", back_populates="project")

class ProjectMilestone(Base):
    __tablename__ = "project_milestones"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String(255), nullable=False)
    due_date = Column(DateTime(timezone=True))
    amount = Column(Numeric(15, 2), default=0)
    status = Column(String(20), default="pending")
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="milestones")

class ProjectTask(Base):
    __tablename__ = "project_tasks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    assignee_id = Column(Integer, ForeignKey("users.id"))
    priority = Column(String(20), default="medium")
    due_date = Column(DateTime(timezone=True))
    status = Column(String(20), default="todo")
    hours_estimated = Column(Numeric(5, 2))
    hours_logged = Column(Numeric(5, 2), default=0)
    parent_id = Column(Integer, ForeignKey("project_tasks.id"))
    stage = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="tasks")

class ProjectBug(Base):
    __tablename__ = "project_bugs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    severity = Column(String(20))
    status = Column(String(20), default="open")
    reporter_id = Column(Integer, ForeignKey("users.id"))
    assignee_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True))

class Timesheet(Base):
    __tablename__ = "timesheets"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.id"))
    task_id = Column(Integer, ForeignKey("project_tasks.id"))
    date = Column(DateTime(timezone=True), nullable=False)
    hours = Column(Numeric(5, 2), nullable=False)
    description = Column(Text)
    billable = Column(Boolean, default=True)
    approved_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ProjectExpense(Base):
    __tablename__ = "project_expenses"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    category = Column(String(100))
    amount = Column(Numeric(15, 2), nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    receipt_url = Column(String(500))
    approved_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ProjectNote(Base):
    __tablename__ = "project_notes"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    note = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
