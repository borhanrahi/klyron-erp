from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from sqlalchemy.orm import selectinload
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.dependencies.auth import require_company
from app.models.auth import User
from app.models.hr import Team, Employee, employee_teams_table
from app.models.inventory import Warehouse
from app.models.sales import (
    Customer, CustomerContract, Lead, Deal,
    Quotation, QuotationItem, SalesOrder, SalesOrderItem,
    DeliveryNote, SalesCampaign, Inquiry,
)
from app.schemas.sales import (
    CustomerCreate, CustomerUpdate, CustomerResponse,
    CustomerContractCreate, CustomerContractUpdate, CustomerContractResponse,
    LeadCreate, LeadUpdate, LeadResponse,
    DealCreate, DealUpdate, DealResponse,
    QuotationCreate, QuotationUpdate, QuotationResponse,
    QuotationItemCreate, QuotationItemResponse,
    SalesOrderCreate, SalesOrderUpdate, SalesOrderResponse,
    SalesOrderItemCreate, SalesOrderItemResponse,
    DeliveryNoteCreate, DeliveryNoteUpdate, DeliveryNoteResponse,
    SalesCampaignCreate, SalesCampaignUpdate, SalesCampaignResponse,
    InquiryCreate, InquiryUpdate, InquiryResponse,
    InquiryFollowUpCreate, InquiryFollowUpResponse,
    InquiryEmailSend, InquiryEmailLogResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel
from app.schemas.sales import (
    LeadActivityCreate, LeadActivityResponse,
    LeadTaskCreate, LeadTaskUpdate, LeadTaskResponse,
    LeadAssignRequest, LeadBatchAssignRequest,
    AssignmentRuleCreate, AssignmentRuleUpdate, AssignmentRuleResponse,
    AssignmentDistributionResponse,
)
from app.services.sales_service import convert_quotation_to_order, convert_estimate_to_invoice
from app.services.inventory_service import decrement_stock
from app.services.lead_service import (
    log_activity, assign_lead_auto, assign_lead_manual, reassign_batch,
    create_lead_task, complete_lead_task, calculate_lead_score,
    get_lead_team_stats, get_team_performance,
    lead_matches_criteria, get_team_member_user_ids,
)
from app.services.event_bus import event_bus
from app.models.sales import (
    LeadActivity, LeadTask,
    LeadAssignmentRule, LeadAssignmentDistribution, LeadAssignmentLog,
)

router = APIRouter(prefix="/sales", tags=["Sales"])


# ── Customers ──

@router.get("/customers", response_model=PaginatedResponse)
async def list_customers(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Customer).where(
        Customer.company_id == current_user.company_id,
        Customer.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Customer).where(
        Customer.company_id == current_user.company_id,
        Customer.deleted_at.is_(None),
    )

    if search:
        query = query.where(Customer.name.ilike(f"%{search}%"))
        count_query = count_query.where(Customer.name.ilike(f"%{search}%"))

    if status:
        query = query.where(Customer.status == status)
        count_query = count_query.where(Customer.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[CustomerResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/customers/{customer_id}", response_model=ResponseModel)
async def get_customer(
    customer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Customer).where(
        Customer.id == customer_id,
        Customer.company_id == current_user.company_id,
        Customer.deleted_at.is_(None),
    ))
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return ResponseModel(data=CustomerResponse.model_validate(customer))


@router.post("/customers", response_model=ResponseModel, status_code=201)
async def create_customer(
    data: CustomerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    customer = Customer(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(customer)
    await db.flush()
    await db.refresh(customer)
    return ResponseModel(data=CustomerResponse.model_validate(customer))


@router.put("/customers/{customer_id}", response_model=ResponseModel)
async def update_customer(
    customer_id: int,
    data: CustomerUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Customer).where(
        Customer.id == customer_id,
        Customer.company_id == current_user.company_id,
        Customer.deleted_at.is_(None),
    ))
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(customer, k, v)
    await db.flush()
    await db.refresh(customer)
    return ResponseModel(data=CustomerResponse.model_validate(customer))


@router.delete("/customers/{customer_id}", response_model=ResponseModel)
async def delete_customer(
    customer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Customer).where(
        Customer.id == customer_id,
        Customer.company_id == current_user.company_id,
        Customer.deleted_at.is_(None),
    ))
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Customer deleted")


# ── Customer Contracts ──

@router.get("/contracts", response_model=PaginatedResponse)
async def list_contracts(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(CustomerContract).where(
        CustomerContract.company_id == current_user.company_id,
        CustomerContract.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(CustomerContract).where(
        CustomerContract.company_id == current_user.company_id,
        CustomerContract.deleted_at.is_(None),
    )

    if search:
        query = query.where(CustomerContract.title.ilike(f"%{search}%"))
        count_query = count_query.where(CustomerContract.title.ilike(f"%{search}%"))

    if status:
        query = query.where(CustomerContract.status == status)
        count_query = count_query.where(CustomerContract.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[CustomerContractResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/contracts/{contract_id}", response_model=ResponseModel)
async def get_contract(
    contract_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(CustomerContract).where(
        CustomerContract.id == contract_id,
        CustomerContract.company_id == current_user.company_id,
        CustomerContract.deleted_at.is_(None),
    ))
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return ResponseModel(data=CustomerContractResponse.model_validate(contract))


@router.post("/contracts", response_model=ResponseModel, status_code=201)
async def create_contract(
    data: CustomerContractCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    contract = CustomerContract(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(contract)
    await db.flush()
    await db.refresh(contract)
    return ResponseModel(data=CustomerContractResponse.model_validate(contract))


@router.put("/contracts/{contract_id}", response_model=ResponseModel)
async def update_contract(
    contract_id: int,
    data: CustomerContractUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(CustomerContract).where(
        CustomerContract.id == contract_id,
        CustomerContract.company_id == current_user.company_id,
        CustomerContract.deleted_at.is_(None),
    ))
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(contract, k, v)
    await db.flush()
    await db.refresh(contract)
    return ResponseModel(data=CustomerContractResponse.model_validate(contract))


@router.delete("/contracts/{contract_id}", response_model=ResponseModel)
async def delete_contract(
    contract_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(CustomerContract).where(
        CustomerContract.id == contract_id,
        CustomerContract.company_id == current_user.company_id,
        CustomerContract.deleted_at.is_(None),
    ))
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    contract.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Contract deleted")


# ── Leads ──

@router.get("/leads", response_model=PaginatedResponse)
async def list_leads(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    assigned_to: Optional[int] = Query(None, alias="assigned_to"),
    source: Optional[str] = None,
    sort_by: Optional[str] = Query("created_at", alias="sort_by"),
    sort_order: Optional[str] = Query("desc", alias="sort_order"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    from sqlalchemy import or_, desc as sa_desc, asc as sa_asc

    base_filter = [
        Lead.company_id == current_user.company_id,
        Lead.deleted_at.is_(None),
    ]
    query = select(Lead).where(*base_filter)
    count_query = select(sa_func.count()).select_from(Lead).where(*base_filter)

    if search:
        search_filter = or_(
            Lead.name.ilike(f"%{search}%"),
            Lead.email.ilike(f"%{search}%"),
            Lead.phone.ilike(f"%{search}%"),
            Lead.company_name.ilike(f"%{search}%"),
        )
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    if status:
        query = query.where(Lead.status == status)
        count_query = count_query.where(Lead.status == status)

    if assigned_to:
        query = query.where(Lead.assigned_to == assigned_to)
        count_query = count_query.where(Lead.assigned_to == assigned_to)

    if source:
        query = query.where(Lead.source == source)
        count_query = count_query.where(Lead.source == source)

    # Sorting
    sort_col = getattr(Lead, sort_by, Lead.created_at)
    order_fn = sa_desc if sort_order == "desc" else sa_asc
    query = query.order_by(order_fn(sort_col))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[LeadResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/leads/{lead_id}", response_model=ResponseModel)
async def get_lead(
    lead_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Lead).where(
        Lead.id == lead_id,
        Lead.company_id == current_user.company_id,
        Lead.deleted_at.is_(None),
    ))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return ResponseModel(data=LeadResponse.model_validate(lead))


@router.post("/leads", response_model=ResponseModel, status_code=201)
async def create_lead(
    data: LeadCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    lead_data = data.model_dump(exclude={"company_id"})
    # Auto-calculate score if not explicitly provided
    if not lead_data.get("score"):
        lead_data["score"] = calculate_lead_score(
            source=lead_data.get("source"),
            email=lead_data.get("email"),
            phone=lead_data.get("phone"),
            company_name=lead_data.get("company_name"),
            lead_value=lead_data.get("lead_value", 0),
            tags=lead_data.get("tags"),
        )
    lead = Lead(**lead_data, company_id=current_user.company_id, created_by=current_user.id)
    db.add(lead)
    await db.flush()
    await db.refresh(lead)

    # Log creation activity
    await log_activity(
        db, lead_id=lead.id, company_id=current_user.company_id,
        activity_type="system",
        description=f"Lead created from source: {lead.source or 'direct'}",
        created_by=current_user.id,
    )

    await db.flush()
    return ResponseModel(data=LeadResponse.model_validate(lead))


@router.put("/leads/{lead_id}", response_model=ResponseModel)
async def update_lead(
    lead_id: int,
    data: LeadUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Lead).where(
        Lead.id == lead_id,
        Lead.company_id == current_user.company_id,
        Lead.deleted_at.is_(None),
    ))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    update_data = data.model_dump(exclude_unset=True)

    # Auto-recalculate score when scoring-relevant fields change (unless score is explicitly provided)
    score_explicitly_set = "score" in update_data
    if not score_explicitly_set:
        score_fields = ["source", "email", "phone", "company_name", "lead_value", "tags"]
        if any(k in update_data for k in score_fields):
            merged = {k: getattr(lead, k, None) for k in score_fields}
            merged.update({k: v for k, v in update_data.items() if k in score_fields})
            update_data["score"] = calculate_lead_score(
                source=merged.get("source"),
                email=merged.get("email"),
                phone=merged.get("phone"),
                company_name=merged.get("company_name"),
                lead_value=merged.get("lead_value", 0),
                tags=merged.get("tags"),
            )

    # Track changes for activity log
    tracked_fields = ["status", "score", "assigned_to", "notes"]
    for k, v in update_data.items():
        old_val = getattr(lead, k, None)
        if k in tracked_fields and old_val != v:
            if k == "status":
                await log_activity(
                    db, lead_id=lead.id, company_id=current_user.company_id,
                    activity_type="status_change",
                    description=f"Status changed from {old_val or 'none'} to {v}",
                    created_by=current_user.id,
                    old_value=str(old_val) if old_val else None,
                    new_value=str(v),
                )
            elif k == "notes":
                await log_activity(
                    db, lead_id=lead.id, company_id=current_user.company_id,
                    activity_type="note",
                    description=f"Notes updated",
                    created_by=current_user.id,
                )
            elif k == "score":
                await log_activity(
                    db, lead_id=lead.id, company_id=current_user.company_id,
                    activity_type="system",
                    description=f"Score changed from {old_val or 0} to {v}",
                    created_by=current_user.id,
                    old_value=str(old_val) if old_val else "0",
                    new_value=str(v),
                )
        setattr(lead, k, v)

    await db.flush()
    await db.refresh(lead)
    return ResponseModel(data=LeadResponse.model_validate(lead))


@router.delete("/leads/{lead_id}", response_model=ResponseModel)
async def delete_lead(
    lead_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Lead).where(
        Lead.id == lead_id,
        Lead.company_id == current_user.company_id,
        Lead.deleted_at.is_(None),
    ))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Lead deleted")


# ── Lead Activities (Timeline) ──────────────────────────────────────────────

@router.get("/leads/{lead_id}/activities", response_model=ResponseModel)
async def list_lead_activities(
    lead_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Get the full activity timeline for a lead."""
    result = await db.execute(
        select(LeadActivity)
        .where(
            LeadActivity.lead_id == lead_id,
            LeadActivity.company_id == current_user.company_id,
        )
        .order_by(LeadActivity.created_at.desc())
        .limit(100)
    )
    activities = result.scalars().all()
    return ResponseModel(data=[LeadActivityResponse.model_validate(a) for a in activities])


@router.post("/leads/{lead_id}/activities", response_model=ResponseModel, status_code=201)
async def create_lead_activity(
    lead_id: int,
    data: LeadActivityCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Manually log an activity on a lead (e.g., a call, email, or note)."""
    # Verify lead exists
    lead_result = await db.execute(select(Lead).where(
        Lead.id == lead_id,
        Lead.company_id == current_user.company_id,
        Lead.deleted_at.is_(None),
    ))
    lead = lead_result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    activity = await log_activity(
        db, lead_id=lead_id, company_id=current_user.company_id,
        activity_type=data.activity_type,
        description=data.description,
        created_by=current_user.id,
        old_value=data.old_value,
        new_value=data.new_value,
    )
    await db.flush()
    return ResponseModel(data=LeadActivityResponse.model_validate(activity))


# ── Lead Tasks ───────────────────────────────────────────────────────────────

@router.get("/leads/{lead_id}/tasks", response_model=ResponseModel)
async def list_lead_tasks(
    lead_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """List all tasks for a lead."""
    result = await db.execute(
        select(LeadTask)
        .where(
            LeadTask.lead_id == lead_id,
            LeadTask.company_id == current_user.company_id,
        )
        .order_by(LeadTask.created_at.desc())
    )
    tasks = result.scalars().all()
    return ResponseModel(data=[LeadTaskResponse.model_validate(t) for t in tasks])


@router.post("/leads/{lead_id}/tasks", response_model=ResponseModel, status_code=201)
async def create_lead_task_endpoint(
    lead_id: int,
    data: LeadTaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Create a task for a lead and assign it to a team member."""
    # Verify lead exists
    lead_result = await db.execute(select(Lead).where(
        Lead.id == lead_id,
        Lead.company_id == current_user.company_id,
        Lead.deleted_at.is_(None),
    ))
    lead = lead_result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    task = await create_lead_task(
        db, lead_id=lead_id, company_id=current_user.company_id,
        title=data.title, assigned_to=data.assigned_to,
        created_by=current_user.id,
        description=data.description, due_date=data.due_date,
        priority=data.priority,
    )
    await db.flush()
    return ResponseModel(data=LeadTaskResponse.model_validate(task))


@router.put("/leads/{lead_id}/tasks/{task_id}", response_model=ResponseModel)
async def update_lead_task(
    lead_id: int,
    task_id: int,
    data: LeadTaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Update a lead task (status, title, etc.)."""
    result = await db.execute(
        select(LeadTask).where(
            LeadTask.id == task_id,
            LeadTask.lead_id == lead_id,
            LeadTask.company_id == current_user.company_id,
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(task, k, v)

    # If marking as completed
    if data.status == "completed" and not task.completed_at:
        task.completed_at = datetime.utcnow()
        await log_activity(
            db, lead_id=lead_id, company_id=current_user.company_id,
            activity_type="task_completed",
            description=f"Task completed: {task.title}",
            created_by=current_user.id,
        )

    await db.flush()
    await db.refresh(task)
    return ResponseModel(data=LeadTaskResponse.model_validate(task))


@router.post("/leads/{lead_id}/tasks/{task_id}/complete", response_model=ResponseModel)
async def complete_lead_task_endpoint(
    lead_id: int,
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Mark a task as completed. This updates the lead's activity timeline."""
    # Verify lead ownership
    lead_result = await db.execute(select(Lead).where(
        Lead.id == lead_id,
        Lead.company_id == current_user.company_id,
        Lead.deleted_at.is_(None),
    ))
    if not lead_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Lead not found")

    try:
        task = await complete_lead_task(
            db, task_id=task_id, company_id=current_user.company_id,
            completed_by=current_user.id,
        )
        await db.flush()
        return ResponseModel(data=LeadTaskResponse.model_validate(task))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ── Lead Assignment ──────────────────────────────────────────────────────────

@router.post("/leads/{lead_id}/assign", response_model=ResponseModel)
async def assign_lead(
    lead_id: int,
    data: LeadAssignRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Assign a lead to a team member (manual or auto).

    - Manual: Provide assigned_to directly
    - Auto (round_robin/ratio): Leave assigned_to empty or provide rule_id
    """
    if data.assignment_type == "manual" and data.assigned_to:
        try:
            lead = await assign_lead_manual(
                db, company_id=current_user.company_id,
                lead_id=lead_id, assigned_to=data.assigned_to,
                assigned_by=current_user.id,
            )
            await db.flush()
            return ResponseModel(data=LeadResponse.model_validate(lead), message="Lead assigned manually")
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    else:
        # Auto-assign (round-robin or ratio)
        try:
            lead = await assign_lead_auto(
                db, company_id=current_user.company_id,
                lead_id=lead_id, assigned_by=current_user.id,
                rule_id=data.rule_id,
            )
            await db.flush()
            return ResponseModel(data=LeadResponse.model_validate(lead), message="Lead auto-assigned")
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))


@router.post("/leads/batch-assign", response_model=ResponseModel)
async def batch_assign_leads(
    data: LeadBatchAssignRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Batch reassign multiple leads to a specific user."""
    count = await reassign_batch(
        db, company_id=current_user.company_id,
        lead_ids=data.lead_ids, assigned_to=data.assigned_to,
        assigned_by=current_user.id,
    )
    await db.flush()
    return ResponseModel(data={"assigned_count": count}, message=f"{count} leads reassigned")


# ── Teams for Lead Assignment ───────────────────────────────────────────────

@router.get("/teams", response_model=ResponseModel)
async def list_sales_teams(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """List all teams with their members for lead assignment configuration."""
    result = await db.execute(
        select(Team)
        .where(
            Team.company_id == current_user.company_id,
            Team.deleted_at.is_(None),
            Team.is_active == True,
        )
        .order_by(Team.name)
    )
    teams = result.scalars().all()

    if not teams:
        return ResponseModel(data=[])

    team_ids = [t.id for t in teams]

    # Single query for all team members
    member_rows = await db.execute(
        select(
            employee_teams_table.c.team_id,
            Employee.id.label("employee_id"),
            Employee.user_id,
            Employee.employee_code,
        )
        .join(Employee, Employee.id == employee_teams_table.c.employee_id)
        .where(
            employee_teams_table.c.team_id.in_(team_ids),
            Employee.company_id == current_user.company_id,
            Employee.deleted_at.is_(None),
            Employee.status == "active",
            Employee.user_id.isnot(None),
        )
    )
    members_by_team: dict[int, list[dict]] = {tid: [] for tid in team_ids}
    for row in member_rows.all():
        members_by_team.setdefault(row.team_id, []).append({
            "employee_id": row.employee_id,
            "user_id": row.user_id,
            "employee_code": row.employee_code,
        })

    team_data = [
        {
            "id": t.id,
            "name": t.name,
            "description": t.description,
            "lead_id": t.lead_id,
            "member_count": len(members_by_team.get(t.id, [])),
            "members": members_by_team.get(t.id, []),
        }
        for t in teams
    ]

    return ResponseModel(data=team_data)


# ── Lead Assignment Rules (Manager Configuration) ────────────────────────────

@router.get("/lead-assignment-rules", response_model=ResponseModel)
async def list_assignment_rules(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """List all lead assignment rules for the company."""
    result = await db.execute(
        select(LeadAssignmentRule)
        .options(selectinload(LeadAssignmentRule.distributions))
        .where(LeadAssignmentRule.company_id == current_user.company_id)
        .order_by(LeadAssignmentRule.created_at.desc())
    )
    rules = result.scalars().unique().all()
    return ResponseModel(data=[AssignmentRuleResponse.model_validate(r) for r in rules])


@router.post("/lead-assignment-rules", response_model=ResponseModel, status_code=201)
async def create_assignment_rule(
    data: AssignmentRuleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Create a lead assignment rule with team member distribution."""
    rule = LeadAssignmentRule(
        company_id=current_user.company_id,
        name=data.name,
        rule_type=data.rule_type,
        team_id=data.team_id,
        criteria=data.criteria,
        is_active=data.is_active,
        created_by=current_user.id,
    )
    db.add(rule)
    await db.flush()
    await db.refresh(rule)

    for dist in data.distributions:
        d = LeadAssignmentDistribution(
            rule_id=rule.id,
            user_id=dist.user_id,
            weight=dist.weight,
        )
        db.add(d)

    await db.flush()

    # Reload with distributions
    result = await db.execute(
        select(LeadAssignmentRule)
        .options(selectinload(LeadAssignmentRule.distributions))
        .where(LeadAssignmentRule.id == rule.id)
    )
    rule = result.scalar_one()
    return ResponseModel(data=AssignmentRuleResponse.model_validate(rule))


@router.put("/lead-assignment-rules/{rule_id}", response_model=ResponseModel)
async def update_assignment_rule(
    rule_id: int,
    data: AssignmentRuleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Update an assignment rule and its distributions."""
    result = await db.execute(
        select(LeadAssignmentRule).where(
            LeadAssignmentRule.id == rule_id,
            LeadAssignmentRule.company_id == current_user.company_id,
        )
    )
    rule = result.scalar_one_or_none()
    if not rule:
        raise HTTPException(status_code=404, detail="Assignment rule not found")

    for k, v in data.model_dump(exclude_unset=True, exclude={"distributions"}).items():
        setattr(rule, k, v)

    # Replace distributions if provided
    if data.distributions is not None:
        from sqlalchemy import delete as sa_delete
        await db.execute(
            sa_delete(LeadAssignmentDistribution).where(
                LeadAssignmentDistribution.rule_id == rule.id
            )
        )
        for dist in data.distributions:
            d = LeadAssignmentDistribution(
                rule_id=rule.id,
                user_id=dist.user_id,
                weight=dist.weight,
            )
            db.add(d)

    await db.flush()

    result = await db.execute(
        select(LeadAssignmentRule)
        .options(selectinload(LeadAssignmentRule.distributions))
        .where(LeadAssignmentRule.id == rule.id)
    )
    rule = result.scalar_one()
    return ResponseModel(data=AssignmentRuleResponse.model_validate(rule))


@router.delete("/lead-assignment-rules/{rule_id}", response_model=ResponseModel)
async def delete_assignment_rule(
    rule_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Delete an assignment rule."""
    result = await db.execute(
        select(LeadAssignmentRule).where(
            LeadAssignmentRule.id == rule_id,
            LeadAssignmentRule.company_id == current_user.company_id,
        )
    )
    rule = result.scalar_one_or_none()
    if not rule:
        raise HTTPException(status_code=404, detail="Assignment rule not found")
    await db.delete(rule)
    await db.flush()
    return ResponseModel(message="Assignment rule deleted")


# ── Lead Dashboard / Team Performance ───────────────────────────────────────

@router.get("/leads/dashboard/stats", response_model=ResponseModel)
async def lead_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Get lead management dashboard stats for managers."""
    stats = await get_lead_team_stats(db, company_id=current_user.company_id)
    return ResponseModel(data=stats)


@router.get("/leads/dashboard/team-performance", response_model=ResponseModel)
async def lead_team_performance(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Get per-team-member performance stats."""
    performance = await get_team_performance(db, company_id=current_user.company_id)
    return ResponseModel(data=performance)


# ── Lead → Deal Conversion ──────────────────────────────────────────────────

@router.post("/leads/{lead_id}/convert-to-deal", response_model=ResponseModel)
async def convert_lead_to_deal(
    lead_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Convert a qualified lead into a deal."""
    result = await db.execute(select(Lead).where(
        Lead.id == lead_id,
        Lead.company_id == current_user.company_id,
        Lead.deleted_at.is_(None),
    ))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if lead.converted_to_deal_id:
        raise HTTPException(status_code=400, detail="Lead already converted to a deal")

    # Create deal from lead info
    deal = Deal(
        company_id=current_user.company_id,
        lead_id=lead.id,
        title=f"Deal - {lead.name}",
        value=lead.lead_value or 0,
        status="open",
        stage="qualification",
        probability=lead.score if lead.score else 20,
    )
    db.add(deal)
    await db.flush()
    await db.refresh(deal)

    # Update lead
    lead.converted_to_deal_id = deal.id
    lead.status = "qualified"

    # Log activity
    await log_activity(
        db, lead_id=lead.id, company_id=current_user.company_id,
        activity_type="system",
        description=f"Lead converted to deal: {deal.title}",
        created_by=current_user.id,
        new_value=str(deal.id),
    )

    await db.flush()
    return ResponseModel(data=DealResponse.model_validate(deal), message="Lead converted to deal")


# ── Deals ──

@router.get("/deals", response_model=PaginatedResponse)
async def list_deals(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Deal).where(
        Deal.company_id == current_user.company_id,
        Deal.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Deal).where(
        Deal.company_id == current_user.company_id,
        Deal.deleted_at.is_(None),
    )

    if search:
        query = query.where(Deal.title.ilike(f"%{search}%"))
        count_query = count_query.where(Deal.title.ilike(f"%{search}%"))

    if status:
        query = query.where(Deal.status == status)
        count_query = count_query.where(Deal.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[DealResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/deals/{deal_id}", response_model=ResponseModel)
async def get_deal(
    deal_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Deal).where(
        Deal.id == deal_id,
        Deal.company_id == current_user.company_id,
        Deal.deleted_at.is_(None),
    ))
    deal = result.scalar_one_or_none()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    return ResponseModel(data=DealResponse.model_validate(deal))


@router.post("/deals", response_model=ResponseModel, status_code=201)
async def create_deal(
    data: DealCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    deal = Deal(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(deal)
    await db.flush()
    await db.refresh(deal)
    return ResponseModel(data=DealResponse.model_validate(deal))


@router.put("/deals/{deal_id}", response_model=ResponseModel)
async def update_deal(
    deal_id: int,
    data: DealUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Deal).where(
        Deal.id == deal_id,
        Deal.company_id == current_user.company_id,
        Deal.deleted_at.is_(None),
    ))
    deal = result.scalar_one_or_none()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(deal, k, v)
    await db.flush()
    await db.refresh(deal)
    return ResponseModel(data=DealResponse.model_validate(deal))


@router.delete("/deals/{deal_id}", response_model=ResponseModel)
async def delete_deal(
    deal_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Deal).where(
        Deal.id == deal_id,
        Deal.company_id == current_user.company_id,
        Deal.deleted_at.is_(None),
    ))
    deal = result.scalar_one_or_none()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    deal.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Deal deleted")


# ── Quotations (with items) ──

@router.get("/quotations/check-quote-number")
async def check_quote_number(
    quote_number: str = Query(...),
    exclude_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Quotation).where(
        Quotation.quote_number == quote_number,
        Quotation.company_id == current_user.company_id,
        Quotation.deleted_at.is_(None),
    )
    if exclude_id:
        query = query.where(Quotation.id != exclude_id)
    exists = (await db.execute(query)).scalar_one_or_none() is not None
    return {"available": not exists}


@router.get("/quotations", response_model=PaginatedResponse)
async def list_quotations(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Quotation).options(selectinload(Quotation.items)).where(
        Quotation.company_id == current_user.company_id,
        Quotation.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Quotation).where(
        Quotation.company_id == current_user.company_id,
        Quotation.deleted_at.is_(None),
    )

    if search:
        query = query.where(Quotation.quote_number.ilike(f"%{search}%"))
        count_query = count_query.where(Quotation.quote_number.ilike(f"%{search}%"))

    if status:
        query = query.where(Quotation.status == status)
        count_query = count_query.where(Quotation.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[QuotationResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/quotations/{quotation_id}", response_model=ResponseModel)
async def get_quotation(
    quotation_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Quotation).where(
            Quotation.id == quotation_id,
            Quotation.company_id == current_user.company_id,
            Quotation.deleted_at.is_(None),
        )
    )
    quotation = result.scalar_one_or_none()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")

    items_result = await db.execute(
        select(QuotationItem).where(QuotationItem.quotation_id == quotation.id)
    )
    quotation.items = items_result.scalars().all()

    return ResponseModel(data=QuotationResponse.model_validate(quotation))


@router.post("/quotations", response_model=ResponseModel, status_code=201)
async def create_quotation(
    data: QuotationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    items_data = data.items
    quote_data = data.model_dump(exclude={"items"}, exclude_unset=True, exclude_none=True)
    quotation = Quotation(**quote_data, company_id=current_user.company_id)
    db.add(quotation)
    await db.flush()
    await db.refresh(quotation)

    created_items = []
    for item_data in items_data:
        item = QuotationItem(**item_data.model_dump(exclude={"id"}, exclude_none=True), quotation_id=quotation.id)
        db.add(item)
        await db.flush()
        await db.refresh(item)
        created_items.append(item)

    resp = QuotationResponse(
        id=quotation.id,
        quote_number=quotation.quote_number,
        customer_id=quotation.customer_id,
        date=quotation.date,
        expiry=quotation.expiry,
        status=quotation.status,
        subtotal=float(quotation.subtotal or 0),
        tax=float(quotation.tax or 0),
        total=float(quotation.total or 0),
        notes=quotation.notes,
        converted_to_order_id=quotation.converted_to_order_id,
        company_id=quotation.company_id,
        created_at=quotation.created_at,
        items=[QuotationItemResponse.model_validate(i) for i in created_items],
    )
    return ResponseModel(data=resp)


@router.put("/quotations/{quotation_id}", response_model=ResponseModel)
async def update_quotation(
    quotation_id: int,
    data: QuotationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Quotation).where(
            Quotation.id == quotation_id,
            Quotation.company_id == current_user.company_id,
            Quotation.deleted_at.is_(None),
        )
    )
    quotation = result.scalar_one_or_none()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")

    update_data = data.model_dump(exclude_unset=True, exclude={"items"})
    for k, v in update_data.items():
        setattr(quotation, k, v)

    created_items = []
    if data.items is not None:
        from sqlalchemy import delete as sa_delete
        await db.execute(sa_delete(QuotationItem).where(QuotationItem.quotation_id == quotation.id))
        for item_data in data.items:
            item = QuotationItem(**item_data.model_dump(exclude={"id"}, exclude_none=True), quotation_id=quotation.id)
            db.add(item)
            await db.flush()
            await db.refresh(item)
            created_items.append(item)

    await db.flush()
    await db.refresh(quotation)

    resp = QuotationResponse(
        id=quotation.id,
        quote_number=quotation.quote_number,
        customer_id=quotation.customer_id,
        date=quotation.date,
        expiry=quotation.expiry,
        status=quotation.status,
        subtotal=float(quotation.subtotal or 0),
        tax=float(quotation.tax or 0),
        total=float(quotation.total or 0),
        converted_to_order_id=quotation.converted_to_order_id,
        company_id=quotation.company_id,
        created_at=quotation.created_at,
        items=[QuotationItemResponse.model_validate(i) for i in created_items],
    )
    return ResponseModel(data=resp)


@router.delete("/quotations/{quotation_id}", response_model=ResponseModel)
async def delete_quotation(
    quotation_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Quotation).where(
            Quotation.id == quotation_id,
            Quotation.company_id == current_user.company_id,
            Quotation.deleted_at.is_(None),
        )
    )
    quotation = result.scalar_one_or_none()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    quotation.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Quotation deleted")


# ── Sales Orders (with items) ──

@router.get("/orders", response_model=PaginatedResponse)
async def list_sales_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(SalesOrder).options(selectinload(SalesOrder.items)).where(
        SalesOrder.company_id == current_user.company_id,
        SalesOrder.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(SalesOrder).where(
        SalesOrder.company_id == current_user.company_id,
        SalesOrder.deleted_at.is_(None),
    )

    if search:
        query = query.where(SalesOrder.order_number.ilike(f"%{search}%"))
        count_query = count_query.where(SalesOrder.order_number.ilike(f"%{search}%"))

    if status:
        query = query.where(SalesOrder.status == status)
        count_query = count_query.where(SalesOrder.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[SalesOrderResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/orders/{order_id}", response_model=ResponseModel)
async def get_sales_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(SalesOrder).where(
            SalesOrder.id == order_id,
            SalesOrder.company_id == current_user.company_id,
            SalesOrder.deleted_at.is_(None),
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Sales order not found")

    items_result = await db.execute(
        select(SalesOrderItem).where(SalesOrderItem.sales_order_id == order.id)
    )
    order.items = items_result.scalars().all()

    return ResponseModel(data=SalesOrderResponse.model_validate(order))


@router.post("/orders", response_model=ResponseModel, status_code=201)
async def create_sales_order(
    data: SalesOrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    items_data = data.items
    order_data = data.model_dump(exclude={"items"}, exclude_unset=True, exclude_none=True)
    order = SalesOrder(**order_data, company_id=current_user.company_id)
    db.add(order)
    await db.flush()
    await db.refresh(order)

    created_items = []
    for item_data in items_data:
        item = SalesOrderItem(**item_data.model_dump(exclude={"id"}, exclude_none=True), sales_order_id=order.id)
        db.add(item)
        await db.flush()
        await db.refresh(item)
        created_items.append(item)

    resp = SalesOrderResponse(
        id=order.id,
        order_number=order.order_number,
        customer_id=order.customer_id,
        quotation_id=order.quotation_id,
        date=order.date,
        status=order.status,
        subtotal=float(order.subtotal or 0),
        tax=float(order.tax or 0),
        total=float(order.total or 0),
        delivery_date=order.delivery_date,
        shipping_address=order.shipping_address,
        company_id=order.company_id,
        created_at=order.created_at,
        items=[SalesOrderItemResponse.model_validate(i) for i in created_items],
    )
    return ResponseModel(data=resp)


@router.put("/orders/{order_id}", response_model=ResponseModel)
async def update_sales_order(
    order_id: int,
    data: SalesOrderUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(SalesOrder).where(
            SalesOrder.id == order_id,
            SalesOrder.company_id == current_user.company_id,
            SalesOrder.deleted_at.is_(None),
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Sales order not found")

    update_data = data.model_dump(exclude_unset=True, exclude={"items"})
    for k, v in update_data.items():
        setattr(order, k, v)

    created_items = []
    if data.items is not None:
        from sqlalchemy import delete as sa_delete
        await db.execute(sa_delete(SalesOrderItem).where(SalesOrderItem.sales_order_id == order.id))
        for item_data in data.items:
            item = SalesOrderItem(**item_data.model_dump(exclude={"id"}, exclude_none=True), sales_order_id=order.id)
            db.add(item)
            await db.flush()
            await db.refresh(item)
            created_items.append(item)

    await db.flush()
    await db.refresh(order)

    resp = SalesOrderResponse(
        id=order.id,
        order_number=order.order_number,
        customer_id=order.customer_id,
        quotation_id=order.quotation_id,
        date=order.date,
        status=order.status,
        subtotal=float(order.subtotal or 0),
        tax=float(order.tax or 0),
        total=float(order.total or 0),
        delivery_date=order.delivery_date,
        shipping_address=order.shipping_address,
        company_id=order.company_id,
        created_at=order.created_at,
        items=[SalesOrderItemResponse.model_validate(i) for i in created_items],
    )
    return ResponseModel(data=resp)


@router.delete("/orders/{order_id}", response_model=ResponseModel)
async def delete_sales_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(SalesOrder).where(
            SalesOrder.id == order_id,
            SalesOrder.company_id == current_user.company_id,
            SalesOrder.deleted_at.is_(None),
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Sales order not found")
    order.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Sales order deleted")


# ── Quotation → Sales Order Conversion ──

@router.post("/quotations/{quotation_id}/convert-to-order", response_model=ResponseModel)
async def handle_convert_quotation_to_order(
    quotation_id: int,
    order_number: str = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Convert an approved quotation into a sales order."""
    try:
        order = await convert_quotation_to_order(
            db, company_id=current_user.company_id,
            quotation_id=quotation_id,
            order_number=order_number,
            created_by=current_user.id,
        )
        return ResponseModel(data=SalesOrderResponse.model_validate(order), message="Quotation converted to order")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Estimate → Invoice Conversion ──

@router.post("/estimates/{estimate_id}/convert-to-invoice", response_model=ResponseModel)
async def handle_convert_estimate_to_invoice(
    estimate_id: int,
    invoice_number: str = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Convert an approved estimate into an invoice with automatic GL posting."""
    try:
        invoice = await convert_estimate_to_invoice(
            db, company_id=current_user.company_id,
            estimate_id=estimate_id,
            invoice_number=invoice_number,
            created_by=current_user.id,
        )
        from app.schemas.finance import InvoiceResponse
        return ResponseModel(data=InvoiceResponse.model_validate(invoice), message="Estimate converted to invoice")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Delivery Notes ──

@router.get("/delivery-notes", response_model=PaginatedResponse)
async def list_delivery_notes(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(DeliveryNote).where(
        DeliveryNote.company_id == current_user.company_id,
    )
    count_query = select(sa_func.count()).select_from(DeliveryNote).where(
        DeliveryNote.company_id == current_user.company_id,
    )

    if search:
        query = query.where(DeliveryNote.dn_number.ilike(f"%{search}%"))
        count_query = count_query.where(DeliveryNote.dn_number.ilike(f"%{search}%"))

    if status:
        query = query.where(DeliveryNote.status == status)
        count_query = count_query.where(DeliveryNote.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[DeliveryNoteResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/delivery-notes/{dn_id}", response_model=ResponseModel)
async def get_delivery_note(
    dn_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(DeliveryNote).where(
        DeliveryNote.id == dn_id,
        DeliveryNote.company_id == current_user.company_id,
    ))
    dn = result.scalar_one_or_none()
    if not dn:
        raise HTTPException(status_code=404, detail="Delivery note not found")
    return ResponseModel(data=DeliveryNoteResponse.model_validate(dn))


@router.post("/delivery-notes", response_model=ResponseModel, status_code=201)
async def create_delivery_note(
    data: DeliveryNoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    dn = DeliveryNote(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(dn)
    await db.flush()
    await db.refresh(dn)

    # ── Auto-decrement stock on delivery ──
    # Get items from the associated sales order
    if dn.sales_order_id:
        so_result = await db.execute(
            select(SalesOrder).options(selectinload(SalesOrder.items)).where(
                SalesOrder.id == dn.sales_order_id,
                SalesOrder.company_id == current_user.company_id,
            )
        )
        sales_order = so_result.scalars().unique().one_or_none()
        if sales_order and sales_order.items:
            wh_result = await db.execute(
                select(Warehouse).where(
                    Warehouse.company_id == current_user.company_id,
                    Warehouse.is_active == True,
                ).limit(1)
            )
            warehouse = wh_result.scalar_one_or_none()
            if warehouse:
                for so_item in sales_order.items:
                    qty = int(so_item.qty or 1)
                    await decrement_stock(
                        db, company_id=current_user.company_id,
                        item_id=so_item.item_id, warehouse_id=warehouse.id,
                        quantity=qty, reference=f"delivery_{dn.id}",
                    )

                # Update sales order status
                sales_order.status = "delivered"

        await event_bus.emit("delivery_note.created",
                             company_id=current_user.company_id,
                             delivery_note_id=dn.id,
                             sales_order_id=dn.sales_order_id)

    await db.flush()
    return ResponseModel(data=DeliveryNoteResponse.model_validate(dn))


@router.put("/delivery-notes/{dn_id}", response_model=ResponseModel)
async def update_delivery_note(
    dn_id: int,
    data: DeliveryNoteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(DeliveryNote).where(
        DeliveryNote.id == dn_id,
        DeliveryNote.company_id == current_user.company_id,
    ))
    dn = result.scalar_one_or_none()
    if not dn:
        raise HTTPException(status_code=404, detail="Delivery note not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(dn, k, v)
    await db.flush()
    await db.refresh(dn)
    return ResponseModel(data=DeliveryNoteResponse.model_validate(dn))


@router.delete("/delivery-notes/{dn_id}", response_model=ResponseModel)
async def delete_delivery_note(
    dn_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(DeliveryNote).where(
        DeliveryNote.id == dn_id,
        DeliveryNote.company_id == current_user.company_id,
    ))
    dn = result.scalar_one_or_none()
    if not dn:
        raise HTTPException(status_code=404, detail="Delivery note not found")
    dn.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Delivery note deleted")


# ── Sales Campaigns ──

@router.get("/campaigns", response_model=PaginatedResponse)
async def list_campaigns(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(SalesCampaign).where(
        SalesCampaign.company_id == current_user.company_id,
        SalesCampaign.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(SalesCampaign).where(
        SalesCampaign.company_id == current_user.company_id,
        SalesCampaign.deleted_at.is_(None),
    )

    if search:
        query = query.where(SalesCampaign.name.ilike(f"%{search}%"))
        count_query = count_query.where(SalesCampaign.name.ilike(f"%{search}%"))

    if status:
        query = query.where(SalesCampaign.status == status)
        count_query = count_query.where(SalesCampaign.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[SalesCampaignResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/campaigns/{campaign_id}", response_model=ResponseModel)
async def get_campaign(
    campaign_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(SalesCampaign).where(
        SalesCampaign.id == campaign_id,
        SalesCampaign.company_id == current_user.company_id,
        SalesCampaign.deleted_at.is_(None),
    ))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return ResponseModel(data=SalesCampaignResponse.model_validate(campaign))


@router.post("/campaigns", response_model=ResponseModel, status_code=201)
async def create_campaign(
    data: SalesCampaignCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    campaign = SalesCampaign(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(campaign)
    await db.flush()
    await db.refresh(campaign)
    return ResponseModel(data=SalesCampaignResponse.model_validate(campaign))


@router.put("/campaigns/{campaign_id}", response_model=ResponseModel)
async def update_campaign(
    campaign_id: int,
    data: SalesCampaignUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(SalesCampaign).where(
        SalesCampaign.id == campaign_id,
        SalesCampaign.company_id == current_user.company_id,
        SalesCampaign.deleted_at.is_(None),
    ))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(campaign, k, v)
    await db.flush()
    await db.refresh(campaign)
    return ResponseModel(data=SalesCampaignResponse.model_validate(campaign))


@router.delete("/campaigns/{campaign_id}", response_model=ResponseModel)
async def delete_campaign(
    campaign_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(SalesCampaign).where(
        SalesCampaign.id == campaign_id,
        SalesCampaign.company_id == current_user.company_id,
        SalesCampaign.deleted_at.is_(None),
    ))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    campaign.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Campaign deleted")


# ── Inquiries ──

@router.get("/inquiries", response_model=PaginatedResponse)
async def list_inquiries(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Inquiry).where(Inquiry.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(Inquiry).where(
        Inquiry.company_id == current_user.company_id,
    )

    if search:
        query = query.where(Inquiry.name.ilike(f"%{search}%"))
        count_query = count_query.where(Inquiry.name.ilike(f"%{search}%"))

    if status:
        query = query.where(Inquiry.status == status)
        count_query = count_query.where(Inquiry.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[InquiryResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/inquiries/{inquiry_id}", response_model=ResponseModel)
async def get_inquiry(
    inquiry_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Inquiry).where(
        Inquiry.id == inquiry_id,
        Inquiry.company_id == current_user.company_id,
    ))
    inquiry = result.scalar_one_or_none()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return ResponseModel(data=InquiryResponse.model_validate(inquiry))


@router.post("/inquiries", response_model=ResponseModel, status_code=201)
async def create_inquiry(
    data: InquiryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    inquiry = Inquiry(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(inquiry)
    await db.flush()
    await db.refresh(inquiry)
    return ResponseModel(data=InquiryResponse.model_validate(inquiry))


@router.put("/inquiries/{inquiry_id}", response_model=ResponseModel)
async def update_inquiry(
    inquiry_id: int,
    data: InquiryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Inquiry).where(
        Inquiry.id == inquiry_id,
        Inquiry.company_id == current_user.company_id,
    ))
    inquiry = result.scalar_one_or_none()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(inquiry, k, v)
    await db.flush()
    await db.refresh(inquiry)
    return ResponseModel(data=InquiryResponse.model_validate(inquiry))


@router.delete("/inquiries/{inquiry_id}", response_model=ResponseModel)
async def delete_inquiry(
    inquiry_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Inquiry).where(
        Inquiry.id == inquiry_id,
        Inquiry.company_id == current_user.company_id,
    ))
    inquiry = result.scalar_one_or_none()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inquiry.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Inquiry deleted")


# ── Inquiry Follow-Ups ─────────────────────────────────────────────────────

@router.get("/inquiries/{inquiry_id}/follow-ups", response_model=ResponseModel)
async def list_follow_ups(
    inquiry_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    from app.models.sales import InquiryFollowUp
    result = await db.execute(
        select(InquiryFollowUp).where(
            InquiryFollowUp.inquiry_id == inquiry_id,
            InquiryFollowUp.company_id == current_user.company_id,
        ).order_by(InquiryFollowUp.created_at.desc())
    )
    items = result.scalars().all()
    return ResponseModel(data=[InquiryFollowUpResponse.model_validate(i) for i in items])


@router.post("/inquiries/{inquiry_id}/follow-ups", response_model=ResponseModel, status_code=201)
async def create_follow_up(
    inquiry_id: int,
    data: InquiryFollowUpCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    from app.models.sales import InquiryFollowUp
    inquiry = await db.get(Inquiry, inquiry_id)
    if not inquiry or inquiry.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    fu = InquiryFollowUp(
        inquiry_id=inquiry_id,
        company_id=current_user.company_id,
        title=data.title,
        due_date=data.due_date,
    )
    db.add(fu)
    await db.flush()
    await db.refresh(fu)
    return ResponseModel(data=InquiryFollowUpResponse.model_validate(fu))


@router.put("/inquiries/{inquiry_id}/follow-ups/{follow_up_id}", response_model=ResponseModel)
async def update_follow_up(
    inquiry_id: int,
    follow_up_id: int,
    data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    from app.models.sales import InquiryFollowUp
    result = await db.execute(
        select(InquiryFollowUp).where(
            InquiryFollowUp.id == follow_up_id,
            InquiryFollowUp.inquiry_id == inquiry_id,
            InquiryFollowUp.company_id == current_user.company_id,
        )
    )
    fu = result.scalar_one_or_none()
    if not fu:
        raise HTTPException(status_code=404, detail="Follow-up not found")
    for k, v in data.items():
        if hasattr(fu, k):
            setattr(fu, k, v)
    await db.flush()
    await db.refresh(fu)
    return ResponseModel(data=InquiryFollowUpResponse.model_validate(fu))


# ── Inquiry Email Send ─────────────────────────────────────────────────────

@router.post("/inquiries/{inquiry_id}/send-email", response_model=ResponseModel, status_code=201)
async def send_inquiry_email(
    inquiry_id: int,
    data: InquiryEmailSend,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    from app.models.sales import InquiryEmailLog
    from app.config import settings

    inquiry = await db.get(Inquiry, inquiry_id)
    if not inquiry or inquiry.company_id != current_user.company_id:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    email_status = "sent"
    if not settings.SMTP_HOST:
        email_status = "queued"

    log = InquiryEmailLog(
        inquiry_id=inquiry_id,
        company_id=current_user.company_id,
        to_email=data.to_email,
        subject=data.subject,
        body=data.body,
        status=email_status,
    )
    db.add(log)
    await db.flush()
    await db.refresh(log)

    if settings.SMTP_HOST:
        try:
            import smtplib
            from email.mime.text import MIMEText
            msg = MIMEText(data.body)
            msg["Subject"] = data.subject
            msg["From"] = settings.SMTP_FROM
            msg["To"] = data.to_email
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                if settings.SMTP_USER:
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(settings.SMTP_FROM, data.to_email, msg.as_string())
            log.status = "sent"
            await db.flush()
        except Exception:
            log.status = "failed"
            await db.flush()

    return ResponseModel(data=InquiryEmailLogResponse.model_validate(log), message="Email sent" if email_status == "sent" else "Email queued (no SMTP configured)")


@router.get("/inquiries/{inquiry_id}/emails", response_model=ResponseModel)
async def list_inquiry_emails(
    inquiry_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    from app.models.sales import InquiryEmailLog
    result = await db.execute(
        select(InquiryEmailLog).where(
            InquiryEmailLog.inquiry_id == inquiry_id,
            InquiryEmailLog.company_id == current_user.company_id,
        ).order_by(InquiryEmailLog.created_at.desc())
    )
    items = result.scalars().all()
    return ResponseModel(data=[InquiryEmailLogResponse.model_validate(i) for i in items])
