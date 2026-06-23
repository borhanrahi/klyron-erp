from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    address = Column(Text)
    tax_id = Column(String(100))
    status = Column(String(20), default="active")
    rating = Column(Integer, default=0)
    credit_limit = Column(Numeric(15, 2), default=0)
    balance = Column(Numeric(15, 2), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class PurchaseRequisition(Base):
    __tablename__ = "purchase_requisitions"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    pr_number = Column(String(50), unique=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    requester_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(20), default="draft")
    priority = Column(String(20), default="normal")
    total_estimated = Column(Numeric(15, 2), default=0)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("PRItem", back_populates="requisition")

class PRItem(Base):
    __tablename__ = "pr_items"

    id = Column(Integer, primary_key=True, index=True)
    pr_id = Column(Integer, ForeignKey("purchase_requisitions.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"))
    qty = Column(Integer, nullable=False)
    estimated_price = Column(Numeric(15, 2), default=0)
    notes = Column(Text)

    requisition = relationship("PurchaseRequisition", back_populates="items")

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    po_number = Column(String(50), unique=True, nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    pr_id = Column(Integer, ForeignKey("purchase_requisitions.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(20), default="draft")
    subtotal = Column(Numeric(15, 2), default=0)
    tax = Column(Numeric(15, 2), default=0)
    total = Column(Numeric(15, 2), default=0)
    delivery_date = Column(DateTime(timezone=True))
    terms = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("POItem", back_populates="purchase_order")

class POItem(Base):
    __tablename__ = "po_items"

    id = Column(Integer, primary_key=True, index=True)
    po_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"))
    qty = Column(Integer, nullable=False)
    unit_price = Column(Numeric(15, 2), default=0)
    tax = Column(Numeric(15, 2), default=0)
    total = Column(Numeric(15, 2), default=0)
    received_qty = Column(Integer, default=0)

    purchase_order = relationship("PurchaseOrder", back_populates="items")

class GRN(Base):
    __tablename__ = "grn"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    grn_number = Column(String(50), unique=True, nullable=False)
    po_id = Column(Integer, ForeignKey("purchase_orders.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    received_by = Column(Integer, ForeignKey("users.id"))
    status = Column(String(20), default="draft")
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("GRNItem", back_populates="grn")

class GRNItem(Base):
    __tablename__ = "grn_items"

    id = Column(Integer, primary_key=True, index=True)
    grn_id = Column(Integer, ForeignKey("grn.id"), nullable=False)
    po_item_id = Column(Integer, ForeignKey("po_items.id"))
    received_qty = Column(Integer, default=0)
    accepted_qty = Column(Integer, default=0)
    rejected_qty = Column(Integer, default=0)
    reason = Column(Text)

    grn = relationship("GRN", back_populates="items")

class SupplierPayment(Base):
    __tablename__ = "supplier_payments"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    po_id = Column(Integer, ForeignKey("purchase_orders.id"))
    amount = Column(Numeric(15, 2), nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    method = Column(String(50))
    reference = Column(String(255))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RequestForQuotation(Base):
    __tablename__ = "requests_for_quotation"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    rfq_number = Column(String(50), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    status = Column(String(20), default="draft")
    issue_date = Column(DateTime(timezone=True), server_default=func.now())
    due_date = Column(DateTime(timezone=True))
    total_amount = Column(Numeric(15, 2), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)
