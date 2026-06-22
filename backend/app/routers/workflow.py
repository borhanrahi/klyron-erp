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
from app.models.workflow import (
    Workflow, WorkflowStep, WorkflowInstance,
    WorkflowApproval, WorkflowHistory,
)
from app.schemas.workflow import (
    WorkflowCreate, WorkflowUpdate, WorkflowResponse,
    WorkflowStepCreate, WorkflowStepUpdate, WorkflowStepResponse,
    WorkflowInstanceCreate, WorkflowInstanceUpdate, WorkflowInstanceResponse,
    WorkflowApprovalCreate, WorkflowApprovalUpdate, WorkflowApprovalResponse,
    WorkflowHistoryCreate, WorkflowHistoryResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/workflows", tags=["Workflows"])


# ── Workflows ──

@router.get("/", response_model=PaginatedResponse)
async def list_workflows(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    entity_type: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = (
        select(Workflow)
        .options(selectinload(Workflow.steps))
        .where(Workflow.company_id == current_user.company_id, Workflow.deleted_at.is_(None))
    )
    count_query = (
        select(sa_func.count())
        .select_from(Workflow)
        .where(Workflow.company_id == current_user.company_id, Workflow.deleted_at.is_(None))
    )

    if search:
        query = query.where(Workflow.name.ilike(f"%{search}%"))
        count_query = count_query.where(Workflow.name.ilike(f"%{search}%"))
    if entity_type:
        query = query.where(Workflow.entity_type == entity_type)
        count_query = count_query.where(Workflow.entity_type == entity_type)
    if is_active is not None:
        query = query.where(Workflow.is_active == is_active)
        count_query = count_query.where(Workflow.is_active == is_active)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Workflow.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().unique().all()

    return PaginatedResponse(
        items=[WorkflowResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/{workflow_id}", response_model=ResponseModel)
async def get_workflow(
    workflow_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Workflow)
        .options(selectinload(Workflow.steps))
        .where(
            Workflow.id == workflow_id,
            Workflow.company_id == current_user.company_id,
            Workflow.deleted_at.is_(None),
        )
    )
    workflow = result.scalars().unique().one_or_none()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return ResponseModel(data=WorkflowResponse.model_validate(workflow))


@router.post("/", response_model=ResponseModel, status_code=201)
async def create_workflow(
    data: WorkflowCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    workflow = Workflow(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(workflow)
    await db.flush()
    await db.refresh(workflow)
    return ResponseModel(data=WorkflowResponse.model_validate(workflow))


@router.put("/{workflow_id}", response_model=ResponseModel)
async def update_workflow(
    workflow_id: int,
    data: WorkflowUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Workflow).where(
            Workflow.id == workflow_id,
            Workflow.company_id == current_user.company_id,
            Workflow.deleted_at.is_(None),
        )
    )
    workflow = result.scalar_one_or_none()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(workflow, k, v)
    await db.flush()
    await db.refresh(workflow)
    return ResponseModel(data=WorkflowResponse.model_validate(workflow))


@router.delete("/{workflow_id}", response_model=ResponseModel)
async def delete_workflow(
    workflow_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Workflow).where(
            Workflow.id == workflow_id,
            Workflow.company_id == current_user.company_id,
            Workflow.deleted_at.is_(None),
        )
    )
    workflow = result.scalar_one_or_none()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    workflow.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Workflow deleted")


# ── Workflow Steps ──

@router.get("/steps/list", response_model=PaginatedResponse)
async def list_workflow_steps(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    workflow_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = (
        select(WorkflowStep)
        .join(Workflow, WorkflowStep.workflow_id == Workflow.id)
        .where(Workflow.company_id == current_user.company_id)
    )
    count_query = (
        select(sa_func.count())
        .select_from(WorkflowStep)
        .join(Workflow, WorkflowStep.workflow_id == Workflow.id)
        .where(Workflow.company_id == current_user.company_id)
    )

    if workflow_id:
        query = query.where(WorkflowStep.workflow_id == workflow_id)
        count_query = count_query.where(WorkflowStep.workflow_id == workflow_id)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(WorkflowStep.step_order).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[WorkflowStepResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/steps/{step_id}", response_model=ResponseModel)
async def get_workflow_step(
    step_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(WorkflowStep)
        .join(Workflow, WorkflowStep.workflow_id == Workflow.id)
        .where(
            WorkflowStep.id == step_id,
            Workflow.company_id == current_user.company_id,
        )
    )
    step = result.scalar_one_or_none()
    if not step:
        raise HTTPException(status_code=404, detail="Workflow step not found")
    return ResponseModel(data=WorkflowStepResponse.model_validate(step))


@router.post("/steps", response_model=ResponseModel, status_code=201)
async def create_workflow_step(
    data: WorkflowStepCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    step = WorkflowStep(**data.model_dump())
    db.add(step)
    await db.flush()
    await db.refresh(step)
    return ResponseModel(data=WorkflowStepResponse.model_validate(step))


@router.put("/steps/{step_id}", response_model=ResponseModel)
async def update_workflow_step(
    step_id: int,
    data: WorkflowStepUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(WorkflowStep)
        .join(Workflow, WorkflowStep.workflow_id == Workflow.id)
        .where(
            WorkflowStep.id == step_id,
            Workflow.company_id == current_user.company_id,
        )
    )
    step = result.scalar_one_or_none()
    if not step:
        raise HTTPException(status_code=404, detail="Workflow step not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(step, k, v)
    await db.flush()
    await db.refresh(step)
    return ResponseModel(data=WorkflowStepResponse.model_validate(step))


@router.delete("/steps/{step_id}", response_model=ResponseModel)
async def delete_workflow_step(
    step_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(WorkflowStep)
        .join(Workflow, WorkflowStep.workflow_id == Workflow.id)
        .where(
            WorkflowStep.id == step_id,
            Workflow.company_id == current_user.company_id,
        )
    )
    step = result.scalar_one_or_none()
    if not step:
        raise HTTPException(status_code=404, detail="Workflow step not found")
    await db.delete(step)
    await db.flush()
    return ResponseModel(message="Workflow step deleted")


# ── Workflow Instances ──

@router.get("/instances", response_model=PaginatedResponse)
async def list_workflow_instances(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    workflow_id: Optional[int] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = (
        select(WorkflowInstance)
        .options(selectinload(WorkflowInstance.approvals))
        .where(WorkflowInstance.company_id == current_user.company_id)
    )
    count_query = (
        select(sa_func.count())
        .select_from(WorkflowInstance)
        .where(WorkflowInstance.company_id == current_user.company_id)
    )

    if workflow_id:
        query = query.where(WorkflowInstance.workflow_id == workflow_id)
        count_query = count_query.where(WorkflowInstance.workflow_id == workflow_id)
    if status:
        query = query.where(WorkflowInstance.status == status)
        count_query = count_query.where(WorkflowInstance.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(WorkflowInstance.started_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().unique().all()

    return PaginatedResponse(
        items=[WorkflowInstanceResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/instances/{instance_id}", response_model=ResponseModel)
async def get_workflow_instance(
    instance_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(WorkflowInstance)
        .options(selectinload(WorkflowInstance.approvals))
        .where(
            WorkflowInstance.id == instance_id,
            WorkflowInstance.company_id == current_user.company_id,
        )
    )
    instance = result.scalars().unique().one_or_none()
    if not instance:
        raise HTTPException(status_code=404, detail="Workflow instance not found")
    return ResponseModel(data=WorkflowInstanceResponse.model_validate(instance))


@router.post("/instances", response_model=ResponseModel, status_code=201)
async def create_workflow_instance(
    data: WorkflowInstanceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    instance = WorkflowInstance(
        **data.model_dump(),
        company_id=current_user.company_id,
        created_by=current_user.id,
    )
    db.add(instance)
    await db.flush()
    await db.refresh(instance)
    return ResponseModel(data=WorkflowInstanceResponse.model_validate(instance))


@router.put("/instances/{instance_id}", response_model=ResponseModel)
async def update_workflow_instance(
    instance_id: int,
    data: WorkflowInstanceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(WorkflowInstance).where(
            WorkflowInstance.id == instance_id,
            WorkflowInstance.company_id == current_user.company_id,
        )
    )
    instance = result.scalar_one_or_none()
    if not instance:
        raise HTTPException(status_code=404, detail="Workflow instance not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(instance, k, v)
    await db.flush()
    await db.refresh(instance)
    return ResponseModel(data=WorkflowInstanceResponse.model_validate(instance))


@router.delete("/instances/{instance_id}", response_model=ResponseModel)
async def delete_workflow_instance(
    instance_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(WorkflowInstance).where(
            WorkflowInstance.id == instance_id,
            WorkflowInstance.company_id == current_user.company_id,
        )
    )
    instance = result.scalar_one_or_none()
    if not instance:
        raise HTTPException(status_code=404, detail="Workflow instance not found")
    await db.delete(instance)
    await db.flush()
    return ResponseModel(message="Workflow instance deleted")


# ── Workflow Approvals ──

@router.get("/approvals/list", response_model=PaginatedResponse)
async def list_workflow_approvals(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    instance_id: Optional[int] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = (
        select(WorkflowApproval)
        .join(WorkflowInstance, WorkflowApproval.instance_id == WorkflowInstance.id)
        .where(WorkflowInstance.company_id == current_user.company_id)
    )
    count_query = (
        select(sa_func.count())
        .select_from(WorkflowApproval)
        .join(WorkflowInstance, WorkflowApproval.instance_id == WorkflowInstance.id)
        .where(WorkflowInstance.company_id == current_user.company_id)
    )

    if instance_id:
        query = query.where(WorkflowApproval.instance_id == instance_id)
        count_query = count_query.where(WorkflowApproval.instance_id == instance_id)
    if status:
        query = query.where(WorkflowApproval.status == status)
        count_query = count_query.where(WorkflowApproval.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(WorkflowApproval.id.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[WorkflowApprovalResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/approvals/{approval_id}", response_model=ResponseModel)
async def get_workflow_approval(
    approval_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(WorkflowApproval)
        .join(WorkflowInstance, WorkflowApproval.instance_id == WorkflowInstance.id)
        .where(
            WorkflowApproval.id == approval_id,
            WorkflowInstance.company_id == current_user.company_id,
        )
    )
    approval = result.scalar_one_or_none()
    if not approval:
        raise HTTPException(status_code=404, detail="Workflow approval not found")
    return ResponseModel(data=WorkflowApprovalResponse.model_validate(approval))


@router.post("/approvals", response_model=ResponseModel, status_code=201)
async def create_workflow_approval(
    data: WorkflowApprovalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    approval = WorkflowApproval(**data.model_dump())
    db.add(approval)
    await db.flush()
    await db.refresh(approval)
    return ResponseModel(data=WorkflowApprovalResponse.model_validate(approval))


@router.put("/approvals/{approval_id}", response_model=ResponseModel)
async def update_workflow_approval(
    approval_id: int,
    data: WorkflowApprovalUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(WorkflowApproval)
        .join(WorkflowInstance, WorkflowApproval.instance_id == WorkflowInstance.id)
        .where(
            WorkflowApproval.id == approval_id,
            WorkflowInstance.company_id == current_user.company_id,
        )
    )
    approval = result.scalar_one_or_none()
    if not approval:
        raise HTTPException(status_code=404, detail="Workflow approval not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(approval, k, v)
    await db.flush()
    await db.refresh(approval)
    return ResponseModel(data=WorkflowApprovalResponse.model_validate(approval))


@router.delete("/approvals/{approval_id}", response_model=ResponseModel)
async def delete_workflow_approval(
    approval_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(WorkflowApproval)
        .join(WorkflowInstance, WorkflowApproval.instance_id == WorkflowInstance.id)
        .where(
            WorkflowApproval.id == approval_id,
            WorkflowInstance.company_id == current_user.company_id,
        )
    )
    approval = result.scalar_one_or_none()
    if not approval:
        raise HTTPException(status_code=404, detail="Workflow approval not found")
    await db.delete(approval)
    await db.flush()
    return ResponseModel(message="Workflow approval deleted")


# ── Workflow History ──

@router.get("/history/list", response_model=PaginatedResponse)
async def list_workflow_history(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    instance_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = (
        select(WorkflowHistory)
        .join(WorkflowInstance, WorkflowHistory.instance_id == WorkflowInstance.id)
        .where(WorkflowInstance.company_id == current_user.company_id)
    )
    count_query = (
        select(sa_func.count())
        .select_from(WorkflowHistory)
        .join(WorkflowInstance, WorkflowHistory.instance_id == WorkflowInstance.id)
        .where(WorkflowInstance.company_id == current_user.company_id)
    )

    if instance_id:
        query = query.where(WorkflowHistory.instance_id == instance_id)
        count_query = count_query.where(WorkflowHistory.instance_id == instance_id)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(WorkflowHistory.timestamp.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[WorkflowHistoryResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/history/{history_id}", response_model=ResponseModel)
async def get_workflow_history(
    history_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(WorkflowHistory)
        .join(WorkflowInstance, WorkflowHistory.instance_id == WorkflowInstance.id)
        .where(
            WorkflowHistory.id == history_id,
            WorkflowInstance.company_id == current_user.company_id,
        )
    )
    entry = result.scalar_one_or_none()
    if not entry:
        raise HTTPException(status_code=404, detail="Workflow history entry not found")
    return ResponseModel(data=WorkflowHistoryResponse.model_validate(entry))


@router.post("/history", response_model=ResponseModel, status_code=201)
async def create_workflow_history(
    data: WorkflowHistoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    entry = WorkflowHistory(**data.model_dump(), user_id=current_user.id)
    db.add(entry)
    await db.flush()
    await db.refresh(entry)
    return ResponseModel(data=WorkflowHistoryResponse.model_validate(entry))
