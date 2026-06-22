from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.dependencies.auth import require_company
from app.models.auth import User
from app.models.subscription import Subscription, Payment, Gateway
from app.models.auth import Plan
from app.schemas.subscription import (
    PlanCreate, PlanUpdate, PlanResponse,
    SubscriptionCreate, SubscriptionUpdate, SubscriptionResponse,
    PaymentCreate, PaymentUpdate, PaymentResponse,
    GatewayCreate, GatewayUpdate, GatewayResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


# ── Plans ──

@router.get("/plans", response_model=PaginatedResponse)
async def list_plans(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Plan).where(Plan.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(Plan).where(Plan.deleted_at.is_(None))

    if search:
        query = query.where(Plan.name.ilike(f"%{search}%"))
        count_query = count_query.where(Plan.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[PlanResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/plans/{plan_id}", response_model=ResponseModel)
async def get_plan(
    plan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Plan).where(Plan.id == plan_id, Plan.deleted_at.is_(None)))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return ResponseModel(data=PlanResponse.model_validate(plan))


@router.post("/plans", response_model=ResponseModel, status_code=201)
async def create_plan(
    data: PlanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    plan = Plan(**data.model_dump())
    db.add(plan)
    await db.flush()
    await db.refresh(plan)
    return ResponseModel(data=PlanResponse.model_validate(plan))


@router.put("/plans/{plan_id}", response_model=ResponseModel)
async def update_plan(
    plan_id: int,
    data: PlanUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Plan).where(Plan.id == plan_id, Plan.deleted_at.is_(None)))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(plan, k, v)
    await db.flush()
    await db.refresh(plan)
    return ResponseModel(data=PlanResponse.model_validate(plan))


@router.delete("/plans/{plan_id}", response_model=ResponseModel)
async def delete_plan(
    plan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Plan).where(Plan.id == plan_id, Plan.deleted_at.is_(None)))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    plan.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Plan deleted")


# ── Subscriptions ──

@router.get("/", response_model=PaginatedResponse)
async def list_subscriptions(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Subscription).where(
        Subscription.company_id == current_user.company_id,
        Subscription.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Subscription).where(
        Subscription.company_id == current_user.company_id,
        Subscription.deleted_at.is_(None),
    )

    if search:
        query = query.where(Subscription.status.ilike(f"%{search}%"))
        count_query = count_query.where(Subscription.status.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[SubscriptionResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/{subscription_id}", response_model=ResponseModel)
async def get_subscription(
    subscription_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Subscription).where(
        Subscription.id == subscription_id,
        Subscription.company_id == current_user.company_id,
        Subscription.deleted_at.is_(None),
    ))
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return ResponseModel(data=SubscriptionResponse.model_validate(sub))


@router.post("/", response_model=ResponseModel, status_code=201)
async def create_subscription(
    data: SubscriptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    sub = Subscription(**data.model_dump())
    db.add(sub)
    await db.flush()
    await db.refresh(sub)
    return ResponseModel(data=SubscriptionResponse.model_validate(sub))


@router.put("/{subscription_id}", response_model=ResponseModel)
async def update_subscription(
    subscription_id: int,
    data: SubscriptionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Subscription).where(
        Subscription.id == subscription_id,
        Subscription.company_id == current_user.company_id,
        Subscription.deleted_at.is_(None),
    ))
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(sub, k, v)
    await db.flush()
    await db.refresh(sub)
    return ResponseModel(data=SubscriptionResponse.model_validate(sub))


@router.delete("/{subscription_id}", response_model=ResponseModel)
async def delete_subscription(
    subscription_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Subscription).where(
        Subscription.id == subscription_id,
        Subscription.company_id == current_user.company_id,
        Subscription.deleted_at.is_(None),
    ))
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    sub.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Subscription deleted")


# ── Payments ──

@router.get("/payments/list", response_model=PaginatedResponse)
async def list_payments(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Payment).where(Payment.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(Payment).where(Payment.company_id == current_user.company_id)

    if search:
        query = query.where(Payment.status.ilike(f"%{search}%"))
        count_query = count_query.where(Payment.status.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Payment.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[PaymentResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/payments/{payment_id}", response_model=ResponseModel)
async def get_payment(
    payment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Payment).where(
        Payment.id == payment_id,
        Payment.company_id == current_user.company_id,
    ))
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return ResponseModel(data=PaymentResponse.model_validate(payment))


@router.post("/payments", response_model=ResponseModel, status_code=201)
async def create_payment(
    data: PaymentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    payment = Payment(**data.model_dump())
    db.add(payment)
    await db.flush()
    await db.refresh(payment)
    return ResponseModel(data=PaymentResponse.model_validate(payment))


@router.put("/payments/{payment_id}", response_model=ResponseModel)
async def update_payment(
    payment_id: int,
    data: PaymentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Payment).where(
        Payment.id == payment_id,
        Payment.company_id == current_user.company_id,
    ))
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(payment, k, v)
    await db.flush()
    await db.refresh(payment)
    return ResponseModel(data=PaymentResponse.model_validate(payment))


# ── Gateways ──

@router.get("/gateways/list", response_model=PaginatedResponse)
async def list_gateways(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Gateway)
    count_query = select(sa_func.count()).select_from(Gateway)

    if search:
        query = query.where(Gateway.name.ilike(f"%{search}%"))
        count_query = count_query.where(Gateway.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[GatewayResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.post("/gateways", response_model=ResponseModel, status_code=201)
async def create_gateway(
    data: GatewayCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    gw = Gateway(**data.model_dump())
    db.add(gw)
    await db.flush()
    await db.refresh(gw)
    return ResponseModel(data=GatewayResponse.model_validate(gw))


@router.put("/gateways/{gateway_id}", response_model=ResponseModel)
async def update_gateway(
    gateway_id: int,
    data: GatewayUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Gateway).where(Gateway.id == gateway_id))
    gw = result.scalar_one_or_none()
    if not gw:
        raise HTTPException(status_code=404, detail="Gateway not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(gw, k, v)
    await db.flush()
    await db.refresh(gw)
    return ResponseModel(data=GatewayResponse.model_validate(gw))
