from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from datetime import datetime, timedelta

from app.database import get_db
from app.models.auth import User, Company
from app.models.sales import Customer, Lead, Deal, SalesCampaign, Inquiry, SalesOrder
from app.models.finance import Invoice, Transaction, Expense, BankAccount
from app.models.inventory import Item, Stock, Warehouse
from app.models.procurement import Supplier, PurchaseOrder
from app.models.project import Project, ProjectTask
from app.models.support import Ticket, Meeting
from app.models.pos import POSSession, POSSale
from app.models.hr import Employee
from app.schemas.common import ResponseModel
from app.dependencies.auth import require_company

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/dashboard", response_model=ResponseModel)
async def reports_dashboard(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    cid = current_user.company_id

    # Sales
    total_customers = (await db.execute(select(sa_func.count()).select_from(Customer).where(Customer.company_id == cid, Customer.deleted_at.is_(None)))).scalar() or 0
    total_leads = (await db.execute(select(sa_func.count()).select_from(Lead).where(Lead.company_id == cid, Lead.deleted_at.is_(None)))).scalar() or 0
    total_deals = (await db.execute(select(sa_func.count()).select_from(Deal).where(Deal.company_id == cid, Deal.deleted_at.is_(None)))).scalar() or 0
    total_orders = (await db.execute(select(sa_func.count()).select_from(SalesOrder).where(SalesOrder.company_id == cid, SalesOrder.deleted_at.is_(None)))).scalar() or 0

    # Finance
    total_invoices = (await db.execute(select(sa_func.count()).select_from(Invoice).where(Invoice.company_id == cid, Invoice.deleted_at.is_(None)))).scalar() or 0
    total_revenue = (await db.execute(select(sa_func.coalesce(sa_func.sum(Invoice.total), 0)).where(Invoice.company_id == cid, Invoice.deleted_at.is_(None)))).scalar() or 0
    total_expenses = (await db.execute(select(sa_func.coalesce(sa_func.sum(Expense.amount), 0)).where(Expense.company_id == cid, Expense.deleted_at.is_(None)))).scalar() or 0

    # Inventory
    total_items = (await db.execute(select(sa_func.count()).select_from(Item).where(Item.company_id == cid, Item.deleted_at.is_(None)))).scalar() or 0
    total_warehouses = (await db.execute(select(sa_func.count()).select_from(Warehouse).where(Warehouse.company_id == cid, Warehouse.deleted_at.is_(None)))).scalar() or 0

    # Procurement
    total_suppliers = (await db.execute(select(sa_func.count()).select_from(Supplier).where(Supplier.company_id == cid, Supplier.deleted_at.is_(None)))).scalar() or 0
    total_purchase_orders = (await db.execute(select(sa_func.count()).select_from(PurchaseOrder).where(PurchaseOrder.company_id == cid))).scalar() or 0

    # Projects - tasks don't have company_id, count via project join
    total_projects = (await db.execute(select(sa_func.count()).select_from(Project).where(Project.company_id == cid, Project.deleted_at.is_(None)))).scalar() or 0
    total_tasks = (await db.execute(select(sa_func.count()).select_from(ProjectTask).join(Project, ProjectTask.project_id == Project.id).where(Project.company_id == cid))).scalar() or 0

    # Support
    total_tickets = (await db.execute(select(sa_func.count()).select_from(Ticket).where(Ticket.company_id == cid, Ticket.deleted_at.is_(None)))).scalar() or 0
    open_tickets = (await db.execute(select(sa_func.count()).select_from(Ticket).where(Ticket.company_id == cid, Ticket.deleted_at.is_(None), Ticket.status.in_(["open", "new", "pending"])))).scalar() or 0

    # HR
    total_employees = (await db.execute(select(sa_func.count()).select_from(Employee).where(Employee.company_id == cid, Employee.deleted_at.is_(None)))).scalar() or 0

    # POS
    total_pos_sales = (await db.execute(select(sa_func.count()).select_from(POSSale).where(POSSale.company_id == cid))).scalar() or 0

    return ResponseModel(data={
        "sales": {
            "customers": total_customers,
            "leads": total_leads,
            "deals": total_deals,
            "orders": total_orders,
        },
        "finance": {
            "invoices": total_invoices,
            "revenue": float(total_revenue),
            "expenses": float(total_expenses),
            "profit": float(total_revenue) - float(total_expenses),
        },
        "inventory": {
            "items": total_items,
            "warehouses": total_warehouses,
        },
        "procurement": {
            "suppliers": total_suppliers,
            "purchase_orders": total_purchase_orders,
        },
        "projects": {
            "projects": total_projects,
            "tasks": total_tasks,
        },
        "support": {
            "tickets": total_tickets,
            "open_tickets": open_tickets,
        },
        "hr": {
            "employees": total_employees,
        },
        "pos": {
            "sales": total_pos_sales,
        },
    })


@router.get("/pos-summary", response_model=ResponseModel)
async def pos_reports(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    cid = current_user.company_id

    total_sessions = (await db.execute(select(sa_func.count()).select_from(POSSession).where(POSSession.company_id == cid))).scalar() or 0
    total_sales = (await db.execute(select(sa_func.count()).select_from(POSSale).where(POSSale.company_id == cid))).scalar() or 0
    total_revenue = (await db.execute(select(sa_func.coalesce(sa_func.sum(POSSale.total), 0)).where(POSSale.company_id == cid))).scalar() or 0
    avg_sale = (await db.execute(select(sa_func.coalesce(sa_func.avg(POSSale.total), 0)).where(POSSale.company_id == cid))).scalar() or 0

    # Recent sessions
    sessions_q = await db.execute(
        select(POSSession).where(POSSession.company_id == cid).order_by(POSSession.created_at.desc()).limit(10)
    )
    sessions = sessions_q.scalars().all()

    # Recent sales
    sales_q = await db.execute(
        select(POSSale).where(POSSale.company_id == cid).order_by(POSSale.created_at.desc()).limit(10)
    )
    sales = sales_q.scalars().all()

    # Payment method breakdown
    pm_q = await db.execute(
        select(POSSale.payment_method, sa_func.count(), sa_func.coalesce(sa_func.sum(POSSale.total), 0))
        .where(POSSale.company_id == cid)
        .group_by(POSSale.payment_method)
    )
    payment_methods = [{"method": r[0] or "Unknown", "count": r[1], "total": float(r[2])} for r in pm_q.all()]

    return ResponseModel(data={
        "summary": {
            "total_sessions": total_sessions,
            "total_sales": total_sales,
            "total_revenue": float(total_revenue),
            "avg_sale": float(avg_sale),
        },
        "payment_methods": payment_methods,
        "recent_sessions": [
            {
                "id": s.id,
                "status": s.status,
                "opening_balance": float(s.opening_balance or 0),
                "closing_balance": float(s.closing_balance or 0),
                "opened_at": s.opened_at.isoformat() if s.opened_at else None,
                "closed_at": s.closed_at.isoformat() if s.closed_at else None,
            }
            for s in sessions
        ],
        "recent_sales": [
            {
                "id": s.id,
                "total_amount": float(s.total or 0),
                "payment_method": s.payment_method,
                "created_at": s.created_at.isoformat() if s.created_at else None,
            }
            for s in sales
        ],
    })
