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
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

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
