"""Seed audit logs and notifications for realistic dashboard data."""
import asyncio
import random
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timedelta
from sqlalchemy import text, select
from app.database import engine, async_session
from app.models import Base
from app.models.auth import AuditLog, Notification, User

AUDIT_ACTIONS = [
    ("create", "Customer"),
    ("create", "Lead"),
    ("create", "Deal"),
    ("create", "Invoice"),
    ("create", "SalesOrder"),
    ("create", "Quotation"),
    ("create", "PurchaseOrder"),
    ("create", "PurchaseRequisition"),
    ("create", "Employee"),
    ("create", "Project"),
    ("create", "ProjectTask"),
    ("create", "Ticket"),
    ("create", "POSSale"),
    ("create", "Item"),
    ("create", "Expense"),
    ("create", "StockAdjustment"),
    ("update", "Customer"),
    ("update", "Lead"),
    ("update", "Deal"),
    ("update", "Invoice"),
    ("update", "SalesOrder"),
    ("update", "Quotation"),
    ("update", "PurchaseOrder"),
    ("update", "Employee"),
    ("update", "Project"),
    ("update", "ProjectTask"),
    ("update", "Ticket"),
    ("update", "Item"),
    ("update", "Stock"),
    ("login", "User"),
    ("login", "User"),
    ("login", "User"),
]

NOTIFICATION_TYPES = [
    ("info", "New Order Received", "sales", "A new sales order has been created"),
    ("info", "Invoice Created", "finance", "A new invoice has been generated"),
    ("warning", "Low Stock Alert", "inventory", "Item stock is below minimum threshold"),
    ("info", "New Customer Added", "sales", "A new customer has been registered"),
    ("info", "Lead Converted", "sales", "A lead has been converted to a customer"),
    ("warning", "Payment Overdue", "finance", "An invoice payment is overdue"),
    ("info", "Project Task Completed", "projects", "A project task has been marked as done"),
    ("info", "New Ticket Created", "support", "A new support ticket has been opened"),
    ("info", "Employee Joined", "hr", "A new employee has been added"),
    ("info", "Purchase Order Approved", "procurement", "A purchase order has been approved"),
    ("warning", "Leave Request Pending", "hr", "A leave request is awaiting approval"),
    ("info", "Meeting Scheduled", "support", "A new meeting has been scheduled"),
    ("info", "Deal Won", "sales", "A deal has been marked as won"),
    ("info", "Payment Received", "finance", "Payment has been received for an invoice"),
    ("info", "Stock Transfer Completed", "inventory", "Stock transfer has been completed"),
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # Get company_id=1 and user IDs
        users_q = await db.execute(select(User).where(User.company_id == 1))
        users = users_q.scalars().all()
        if not users:
            print("No users found. Run seed_data.py first.")
            return

        user_ids = [u.id for u in users]
        cid = 1
        now = datetime.utcnow()

        # Check existing count
        existing = (await db.execute(
            text("SELECT COUNT(*) FROM audit_logs WHERE company_id = 1")
        )).scalar()
        if existing and existing >= 50:
            print(f"Already have {existing} audit logs. Skipping.")
            return

        # Generate 200 audit logs spread over last 30 days
        logs = []
        for i in range(200):
            action, entity = random.choice(AUDIT_ACTIONS)
            days_ago = random.randint(0, 30)
            hours_ago = random.randint(0, 23)
            mins_ago = random.randint(0, 59)
            ts = now - timedelta(days=days_ago, hours=hours_ago, minutes=mins_ago)

            logs.append(AuditLog(
                user_id=random.choice(user_ids),
                company_id=cid,
                action=action,
                entity=entity,
                entity_id=random.randint(1, 30),
                new_values={"seeded": True},
                timestamp=ts,
            ))

        db.add_all(logs)
        await db.flush()

        # Generate notifications
        notifications = []
        for i in range(60):
            days_ago = random.randint(0, 14)
            hours_ago = random.randint(0, 23)
            ts = now - timedelta(days=days_ago, hours=hours_ago)
            ntype, title, etype, msg = random.choice(NOTIFICATION_TYPES)

            notifications.append(Notification(
                company_id=cid,
                user_id=random.choice(user_ids),
                type=ntype,
                title=title,
                message=msg,
                entity_type=etype,
                entity_id=random.randint(1, 20),
                is_read=random.choice([True, False]),
                created_at=ts,
            ))

        db.add_all(notifications)
        await db.commit()

        print(f"Seeded {len(logs)} audit logs and {len(notifications)} notifications")

asyncio.run(seed())
