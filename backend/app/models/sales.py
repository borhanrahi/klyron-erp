from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    tax_id = Column(String(100))
    address = Column(Text)
    credit_limit = Column(Numeric(15, 2), default=0)
    balance = Column(Numeric(15, 2), default=0)
    loyalty_points = Column(Integer, default=0)
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    contracts = relationship("CustomerContract", back_populates="customer")

class CustomerContract(Base):
    __tablename__ = "customer_contracts"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    title = Column(String(255), nullable=False)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    value = Column(Numeric(15, 2), default=0)
    file_url = Column(String(500))
    status = Column(String(20), default="active")
    renewal_reminder = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    customer = relationship("Customer", back_populates="contracts")

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    source = Column(String(100))
    status = Column(String(20), default="new")
    assigned_to = Column(Integer, ForeignKey("users.id"))
    score = Column(Integer, default=0)
    notes = Column(Text)

    # Enhanced lead fields
    title = Column(String(100))  # e.g., CEO, Manager
    company_name = Column(String(255))  # Company/Organization name
    industry = Column(String(100))  # Industry vertical
    website = Column(String(500))
    lead_value = Column(Numeric(15, 2), default=0)  # Estimated deal value
    tags = Column(JSON, default=list)  # e.g., ["hot", "vip", "tech"]
    last_activity_at = Column(DateTime(timezone=True))  # Last interaction time
    converted_to_deal_id = Column(Integer, ForeignKey("deals.id"))

    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    activities = relationship("LeadActivity", back_populates="lead", cascade="all, delete-orphan",
                               foreign_keys="LeadActivity.lead_id")
    tasks = relationship("LeadTask", back_populates="lead", cascade="all, delete-orphan")


class LeadActivity(Base):
    """Timeline of all interactions on a lead."""
    __tablename__ = "lead_activities"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    activity_type = Column(String(50), nullable=False)  # note, status_change, assignment, call, email, system, task_completed
    description = Column(Text)
    old_value = Column(String(255))  # For tracking changes (e.g., old status)
    new_value = Column(String(255))  # New value (e.g., new status)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lead = relationship("Lead", back_populates="activities", foreign_keys=[lead_id])


class LeadTask(Base):
    """Tasks assigned to employees related to a lead."""
    __tablename__ = "lead_tasks"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=False)
    due_date = Column(DateTime(timezone=True))
    priority = Column(String(20), default="medium")  # low, medium, high, urgent
    status = Column(String(20), default="pending")  # pending, in_progress, completed, cancelled
    completed_at = Column(DateTime(timezone=True))
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lead = relationship("Lead", back_populates="tasks")


class LeadAssignmentRule(Base):
    """Manager-defined rules for lead distribution.

    Each rule can be restricted to a specific team (e.g., Sales, Call Center)
    and can have criteria to match inbound leads for auto-assignment.
    """
    __tablename__ = "lead_assignment_rules"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    rule_type = Column(String(50), nullable=False)  # manual, round_robin, ratio, weighted
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)  # Restrict to a team
    criteria = Column(JSON, nullable=True)  # Matching criteria: {"sources": ["website", "referral"], "industries": ["Technology"], "min_lead_value": 0, "max_lead_value": null}
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    distributions = relationship("LeadAssignmentDistribution", back_populates="rule",
                                  cascade="all, delete-orphan")


class LeadAssignmentDistribution(Base):
    """Team members included in a distribution rule with their ratio/weight."""
    __tablename__ = "lead_assignment_distributions"

    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(Integer, ForeignKey("lead_assignment_rules.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    weight = Column(Integer, default=1)  # Ratio/weight for distribution
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    rule = relationship("LeadAssignmentRule", back_populates="distributions")


class LeadAssignmentLog(Base):
    """Log of every lead assignment for audit trailing."""
    __tablename__ = "lead_assignment_logs"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    rule_id = Column(Integer, ForeignKey("lead_assignment_rules.id"))
    assigned_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=False)
    assignment_type = Column(String(50), default="manual")  # manual, round_robin, ratio, auto
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    title = Column(String(255), nullable=False)
    value = Column(Numeric(15, 2), default=0)
    currency = Column(String(10), default="USD")
    stage = Column(String(50))
    probability = Column(Integer, default=0)
    expected_close = Column(DateTime(timezone=True))
    actual_close = Column(DateTime(timezone=True))
    status = Column(String(20), default="open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    quote_number = Column(String(50), unique=True, nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    expiry = Column(DateTime(timezone=True))
    status = Column(String(20), default="draft")
    subtotal = Column(Numeric(15, 2), default=0)
    tax = Column(Numeric(15, 2), default=0)
    total = Column(Numeric(15, 2), default=0)
    notes = Column(Text, nullable=True)
    converted_to_order_id = Column(Integer, ForeignKey("sales_orders.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    items = relationship("QuotationItem", back_populates="quotation")

class QuotationItem(Base):
    __tablename__ = "quotation_items"

    id = Column(Integer, primary_key=True, index=True)
    quotation_id = Column(Integer, ForeignKey("quotations.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"))
    qty = Column(Numeric(10, 2), default=1)
    price = Column(Numeric(15, 2), default=0)
    tax = Column(Numeric(15, 2), default=0)
    total = Column(Numeric(15, 2), default=0)

    quotation = relationship("Quotation", back_populates="items")

class SalesOrder(Base):
    __tablename__ = "sales_orders"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    order_number = Column(String(50), unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    quotation_id = Column(Integer, ForeignKey("quotations.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(20), default="draft")
    subtotal = Column(Numeric(15, 2), default=0)
    tax = Column(Numeric(15, 2), default=0)
    total = Column(Numeric(15, 2), default=0)
    delivery_date = Column(DateTime(timezone=True))
    shipping_address = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    items = relationship("SalesOrderItem", back_populates="sales_order")

class SalesOrderItem(Base):
    __tablename__ = "sales_order_items"

    id = Column(Integer, primary_key=True, index=True)
    sales_order_id = Column(Integer, ForeignKey("sales_orders.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"))
    qty = Column(Numeric(10, 2), default=1)
    price = Column(Numeric(15, 2), default=0)
    tax = Column(Numeric(15, 2), default=0)
    total = Column(Numeric(15, 2), default=0)
    delivered_qty = Column(Numeric(10, 2), default=0)

    sales_order = relationship("SalesOrder", back_populates="items")

class DeliveryNote(Base):
    __tablename__ = "delivery_notes"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    dn_number = Column(String(50), unique=True, nullable=False)
    sales_order_id = Column(Integer, ForeignKey("sales_orders.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    shipped_by = Column(Integer, ForeignKey("users.id"))
    status = Column(String(20), default="pending")
    tracking_number = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SalesCampaign(Base):
    __tablename__ = "sales_campaigns"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(50))
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    target_audience = Column(Text)
    status = Column(String(20), default="draft")
    budget = Column(Numeric(15, 2), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    message = Column(Text)
    source = Column(String(100))
    status = Column(String(20), default="new")
    assigned_to = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    follow_ups = relationship("InquiryFollowUp", back_populates="inquiry")
    emails = relationship("InquiryEmailLog", back_populates="inquiry")


class InquiryFollowUp(Base):
    __tablename__ = "inquiry_follow_ups"

    id = Column(Integer, primary_key=True, index=True)
    inquiry_id = Column(Integer, ForeignKey("inquiries.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    title = Column(String(255), nullable=False)
    due_date = Column(DateTime(timezone=True))
    status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    inquiry = relationship("Inquiry", back_populates="follow_ups")


class InquiryEmailLog(Base):
    __tablename__ = "inquiry_email_logs"

    id = Column(Integer, primary_key=True, index=True)
    inquiry_id = Column(Integer, ForeignKey("inquiries.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    to_email = Column(String(255), nullable=False)
    subject = Column(String(500), nullable=False)
    body = Column(Text)
    status = Column(String(20), default="sent")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    inquiry = relationship("Inquiry", back_populates="emails")
