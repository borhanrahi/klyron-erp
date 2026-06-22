from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from datetime import datetime, timedelta

from app.database import get_db
from app.models.auth import User, AuditLog, Notification, Company
from app.models.sales import Customer, Lead, Deal, SalesOrder, Quotation
from app.models.finance import Invoice, Transaction, Expense
from app.models.inventory import Item, Stock
from app.models.project import Project, ProjectTask
from app.models.support import Ticket
from app.models.hr import Employee
from app.models.pos import POSSale
from app.schemas.common import ResponseModel
from app.dependencies.auth import require_company

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/executive", response_model=ResponseModel)
async def executive_dashboard(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    cid = current_user.company_id

    # Revenue from invoices
    total_revenue = (await db.execute(
        select(sa_func.coalesce(sa_func.sum(Invoice.total), 0))
        .where(Invoice.company_id == cid, Invoice.status.in_(["paid", "partial"]))
    )).scalar() or 0

    # Pending invoices (balance due)
    pending_revenue = (await db.execute(
        select(sa_func.coalesce(sa_func.sum(Invoice.balance_due), 0))
        .where(Invoice.company_id == cid, Invoice.status.in_(["sent", "overdue", "partial"]))
    )).scalar() or 0

    # Expenses
    total_expenses = (await db.execute(
        select(sa_func.coalesce(sa_func.sum(Expense.amount), 0))
        .where(Expense.company_id == cid)
    )).scalar() or 0

    # Customers
    total_customers = (await db.execute(
        select(sa_func.count()).select_from(Customer)
        .where(Customer.company_id == cid)
    )).scalar() or 0

    # New customers this month
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    new_customers_month = (await db.execute(
        select(sa_func.count()).select_from(Customer)
        .where(Customer.company_id == cid, Customer.created_at >= month_start)
    )).scalar() or 0

    # Orders
    total_orders = (await db.execute(
        select(sa_func.count()).select_from(SalesOrder)
        .where(SalesOrder.company_id == cid)
    )).scalar() or 0

    pending_orders = (await db.execute(
        select(sa_func.count()).select_from(SalesOrder)
        .where(SalesOrder.company_id == cid, SalesOrder.status.in_(["draft", "confirmed", "processing"]))
    )).scalar() or 0

    # Leads
    total_leads = (await db.execute(
        select(sa_func.count()).select_from(Lead)
        .where(Lead.company_id == cid)
    )).scalar() or 0

    active_leads = (await db.execute(
        select(sa_func.count()).select_from(Lead)
        .where(Lead.company_id == cid, Lead.status.in_(["new", "contacted", "qualified", "proposal"]))
    )).scalar() or 0

    # Deals
    total_deals = (await db.execute(
        select(sa_func.count()).select_from(Deal)
        .where(Deal.company_id == cid)
    )).scalar() or 0

    won_deals = (await db.execute(
        select(sa_func.count()).select_from(Deal)
        .where(Deal.company_id == cid, Deal.status == "won")
    )).scalar() or 0

    # POS sales today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    pos_today = (await db.execute(
        select(sa_func.coalesce(sa_func.sum(POSSale.total), 0))
        .where(POSSale.company_id == cid, POSSale.created_at >= today_start)
    )).scalar() or 0

    # Open tickets
    open_tickets = (await db.execute(
        select(sa_func.count()).select_from(Ticket)
        .where(Ticket.company_id == cid, Ticket.status.in_(["open", "new", "pending"]))
    )).scalar() or 0

    # Employees
    total_employees = (await db.execute(
        select(sa_func.count()).select_from(Employee)
        .where(Employee.company_id == cid, Employee.deleted_at.is_(None))
    )).scalar() or 0

    # Recent invoices (last 5)
    recent_invoices_q = await db.execute(
        select(Invoice).where(Invoice.company_id == cid).order_by(Invoice.created_at.desc()).limit(5)
    )
    recent_invoices = [
        {"id": inv.id, "invoice_number": inv.invoice_number, "total": float(inv.total or 0),
         "status": inv.status, "created_at": inv.created_at.isoformat() if inv.created_at else None}
        for inv in recent_invoices_q.scalars().all()
    ]

    # Recent orders (last 5)
    recent_orders_q = await db.execute(
        select(SalesOrder).where(SalesOrder.company_id == cid).order_by(SalesOrder.created_at.desc()).limit(5)
    )
    recent_orders = [
        {"id": o.id, "order_number": o.order_number, "total": float(o.total or 0),
         "status": o.status, "created_at": o.created_at.isoformat() if o.created_at else None}
        for o in recent_orders_q.scalars().all()
    ]

    return ResponseModel(data={
        "revenue": {
            "total": float(total_revenue),
            "pending": float(pending_revenue),
            "expenses": float(total_expenses),
            "profit": float(total_revenue) - float(total_expenses),
        },
        "customers": {"total": total_customers, "new_this_month": new_customers_month},
        "orders": {"total": total_orders, "pending": pending_orders},
        "leads": {"total": total_leads, "active": active_leads},
        "deals": {"total": total_deals, "won": won_deals},
        "pos_today": float(pos_today),
        "tickets": {"open": open_tickets},
        "employees": total_employees,
        "recent_invoices": recent_invoices,
        "recent_orders": recent_orders,
    })


@router.get("/team", response_model=ResponseModel)
async def team_dashboard(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    cid = current_user.company_id

    # Task counts by status
    statuses = ["todo", "in_progress", "review", "done", "blocked"]
    task_counts = {}
    for status in statuses:
        count = (await db.execute(
            select(sa_func.count()).select_from(ProjectTask)
            .join(Project, ProjectTask.project_id == Project.id)
            .where(Project.company_id == cid, ProjectTask.status == status)
        )).scalar() or 0
        task_counts[status] = count

    total_tasks = sum(task_counts.values())

    # Tasks by priority
    priorities = ["high", "medium", "low"]
    priority_counts = {}
    for p in priorities:
        count = (await db.execute(
            select(sa_func.count()).select_from(ProjectTask)
            .join(Project, ProjectTask.project_id == Project.id)
            .where(Project.company_id == cid, ProjectTask.priority == p)
        )).scalar() or 0
        priority_counts[p] = count

    # Overdue tasks
    now = datetime.utcnow()
    overdue_tasks = (await db.execute(
        select(sa_func.count()).select_from(ProjectTask)
        .join(Project, ProjectTask.project_id == Project.id)
        .where(Project.company_id == cid, ProjectTask.due_date < now, ProjectTask.status != "done")
    )).scalar() or 0

    # Recent tasks with project info
    recent_tasks_q = await db.execute(
        select(ProjectTask.id, ProjectTask.title, ProjectTask.status, ProjectTask.priority,
               ProjectTask.due_date, Project.name.label("project_name"), ProjectTask.assignee_id)
        .join(Project, ProjectTask.project_id == Project.id)
        .where(Project.company_id == cid)
        .order_by(ProjectTask.created_at.desc())
        .limit(20)
    )
    recent_tasks = [
        {"id": r[0], "title": r[1], "status": r[2], "priority": r[3],
         "due_date": r[4].isoformat() if r[4] else None, "project_name": r[5], "assignee_id": r[6]}
        for r in recent_tasks_q.all()
    ]

    # Team members (employees with task counts)
    team_q = await db.execute(
        select(Employee.id, User.full_name, Employee.designation_id,
               sa_func.count(ProjectTask.id).label("task_count"))
        .outerjoin(User, Employee.user_id == User.id)
        .outerjoin(ProjectTask, ProjectTask.assignee_id == Employee.id)
        .outerjoin(Project, ProjectTask.project_id == Project.id)
        .where(Employee.company_id == cid, Employee.deleted_at.is_(None))
        .group_by(Employee.id, User.full_name, Employee.designation_id)
        .order_by(sa_func.count(ProjectTask.id).desc())
        .limit(10)
    )
    team_members = [
        {"id": r[0], "name": r[1] or "Unknown", "designation_id": r[2], "tasks": r[3]}
        for r in team_q.all()
    ]

    # Active projects
    projects_q = await db.execute(
        select(Project).where(Project.company_id == cid, Project.status.in_(["active", "in_progress"]))
        .order_by(Project.created_at.desc()).limit(5)
    )
    active_projects = [
        {"id": p.id, "name": p.name, "status": p.status, "progress_pct": p.progress_pct or 0}
        for p in projects_q.scalars().all()
    ]

    return ResponseModel(data={
        "task_counts": task_counts,
        "total_tasks": total_tasks,
        "priority_counts": priority_counts,
        "overdue_tasks": overdue_tasks,
        "recent_tasks": recent_tasks,
        "team_members": team_members,
        "active_projects": active_projects,
    })


@router.get("/activity", response_model=ResponseModel)
async def activity_feed(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    cid = current_user.company_id

    # Recent audit logs
    logs_q = await db.execute(
        select(AuditLog).where(AuditLog.company_id == cid)
        .order_by(AuditLog.timestamp.desc()).limit(50)
    )
    logs = logs_q.scalars().all()

    activities = []
    for log in logs:
        # Determine icon/color based on action
        if log.action in ("create", "created"):
            icon = "plus"
            color = "success"
        elif log.action in ("update", "updated"):
            icon = "edit"
            color = "info"
        elif log.action in ("delete", "deleted"):
            icon = "trash"
            color = "danger"
        elif log.action in ("login", "logged_in"):
            icon = "log-in"
            color = "primary"
        else:
            icon = "activity"
            color = "muted"

        activities.append({
            "id": log.id,
            "action": log.action,
            "entity": log.entity,
            "entity_id": log.entity_id,
            "user_id": log.user_id,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None,
            "icon": icon,
            "color": color,
            "details": log.new_values if log.new_values else None,
        })

    # Activity pulse
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=today_start.weekday())

    events_today = (await db.execute(
        select(sa_func.count()).select_from(AuditLog)
        .where(AuditLog.company_id == cid, AuditLog.timestamp >= today_start)
    )).scalar() or 0

    events_week = (await db.execute(
        select(sa_func.count()).select_from(AuditLog)
        .where(AuditLog.company_id == cid, AuditLog.timestamp >= week_start)
    )).scalar() or 0

    # Active users (users with recent activity)
    active_users_q = await db.execute(
        select(AuditLog.user_id, sa_func.count().label("activity_count"))
        .where(AuditLog.company_id == cid, AuditLog.timestamp >= week_start)
        .group_by(AuditLog.user_id)
        .order_by(sa_func.count().desc())
        .limit(10)
    )
    active_user_ids = [(r[0], r[1]) for r in active_users_q.all()]

    active_users = []
    for uid, count in active_user_ids:
        user_q = await db.execute(select(User).where(User.id == uid))
        user = user_q.scalar_one_or_none()
        if user:
            active_users.append({
                "id": user.id,
                "name": user.full_name or user.email,
                "activity_count": count,
            })

    return ResponseModel(data={
        "activities": activities,
        "pulse": {
            "events_today": events_today,
            "events_this_week": events_week,
        },
        "active_users": active_users,
    })
