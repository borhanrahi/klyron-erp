from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class PortalUser(Base):
    __tablename__ = "portal_users"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class PortalSession(Base):
    __tablename__ = "portal_sessions"

    id = Column(Integer, primary_key=True, index=True)
    portal_user_id = Column(Integer, ForeignKey("portal_users.id"), nullable=False)
    token = Column(String(500), unique=True, nullable=False)
    ip = Column(String(45))
    user_agent = Column(String(500))
    expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
