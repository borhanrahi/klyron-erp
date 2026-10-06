from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class POSSession(Base):
    __tablename__ = "pos_sessions"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("branches.id"))
    cashier_id = Column(Integer, ForeignKey("users.id"))
    opened_at = Column(DateTime(timezone=True), server_default=func.now())
    closed_at = Column(DateTime(timezone=True))
    opening_balance = Column(Numeric(15, 2), default=0)
    closing_balance = Column(Numeric(15, 2))
    status = Column(String(20), default="open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sales = relationship("POSSale", back_populates="session")

class POSSale(Base):
    __tablename__ = "pos_sales"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    session_id = Column(Integer, ForeignKey("pos_sessions.id"))
    sale_number = Column(String(50), unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    subtotal = Column(Numeric(15, 2), default=0)
    tax = Column(Numeric(15, 2), default=0)
    discount = Column(Numeric(15, 2), default=0)
    total = Column(Numeric(15, 2), default=0)
    paid = Column(Numeric(15, 2), default=0)
    change = Column(Numeric(15, 2), default=0)
    payment_method = Column(String(50))
    status = Column(String(20), default="completed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("POSSession", back_populates="sales")
    items = relationship("POSSaleItem", back_populates="sale", lazy="selectin")

class POSSaleItem(Base):
    __tablename__ = "pos_sale_items"

    id = Column(Integer, primary_key=True, index=True)
    pos_sale_id = Column(Integer, ForeignKey("pos_sales.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"))
    qty = Column(Numeric(10, 2), default=1)
    unit_price = Column(Numeric(15, 2), default=0)
    tax = Column(Numeric(15, 2), default=0)
    discount = Column(Numeric(15, 2), default=0)
    total = Column(Numeric(15, 2), default=0)

    sale = relationship("POSSale", back_populates="items")

class CashRegister(Base):
    __tablename__ = "cash_registers"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("branches.id"))
    name = Column(String(255), nullable=False)
    current_balance = Column(Numeric(15, 2), default=0)
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class POSReceipt(Base):
    __tablename__ = "pos_receipts"

    id = Column(Integer, primary_key=True, index=True)
    pos_sale_id = Column(Integer, ForeignKey("pos_sales.id"), nullable=False)
    receipt_number = Column(String(50), unique=True, nullable=False)
    printer_type = Column(String(50))
    printed_at = Column(DateTime(timezone=True), server_default=func.now())
    receipt_data = Column(Text)
