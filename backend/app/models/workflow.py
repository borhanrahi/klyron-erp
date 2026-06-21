from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    entity_type = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    steps = relationship("WorkflowStep", back_populates="workflow")

class WorkflowStep(Base):
    __tablename__ = "workflow_steps"

    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflows.id"), nullable=False)
    step_order = Column(Integer, nullable=False)
    name = Column(String(255), nullable=False)
    approver_type = Column(String(50))
    approver_id = Column(Integer)
    min_amount = Column(Numeric(15, 2))
    max_amount = Column(Numeric(15, 2))
    action = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    workflow = relationship("Workflow", back_populates="steps")

class WorkflowInstance(Base):
    __tablename__ = "workflow_instances"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    workflow_id = Column(Integer, ForeignKey("workflows.id"))
    entity_type = Column(String(100))
    entity_id = Column(Integer)
    status = Column(String(20), default="pending")
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    created_by = Column(Integer, ForeignKey("users.id"))

    approvals = relationship("WorkflowApproval", back_populates="instance")

class WorkflowApproval(Base):
    __tablename__ = "workflow_approvals"

    id = Column(Integer, primary_key=True, index=True)
    instance_id = Column(Integer, ForeignKey("workflow_instances.id"), nullable=False)
    step_id = Column(Integer, ForeignKey("workflow_steps.id"))
    approver_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String(20), default="pending")
    comment = Column(Text)
    approved_at = Column(DateTime(timezone=True))

    instance = relationship("WorkflowInstance", back_populates="approvals")

class WorkflowHistory(Base):
    __tablename__ = "workflow_history"

    id = Column(Integer, primary_key=True, index=True)
    instance_id = Column(Integer, ForeignKey("workflow_instances.id"), nullable=False)
    action = Column(String(50))
    user_id = Column(Integer, ForeignKey("users.id"))
    comment = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
