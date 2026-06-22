from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.dependencies.auth import require_company
from app.models.auth import User, Role, Company, Department, AuditLog, Notification, Branch
from app.schemas.admin import (
    RoleCreate, RoleUpdate, RoleResponse,
    CompanyUpdate, CompanyResponse,
    DepartmentCreate, DepartmentUpdate, DepartmentResponse,
    AuditLogResponse,
    NotificationResponse,
)
from app.schemas.auth import UserResponse
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/admin", tags=["Administration"])


# ── Roles ────────────────────────────────────────────────────────

@router.get("/roles", response_model=PaginatedResponse)
async def list_roles(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Role).where(
        Role.company_id == current_user.company_id,
        Role.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Role).where(
        Role.company_id == current_user.company_id,
        Role.deleted_at.is_(None),
    )

    if search:
        query = query.where(Role.name.ilike(f"%{search}%"))
        count_query = count_query.where(Role.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[RoleResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/roles/{role_id}", response_model=ResponseModel)
async def get_role(
    role_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Role).where(
        Role.id == role_id,
        Role.company_id == current_user.company_id,
        Role.deleted_at.is_(None),
    ))
    role = result.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return ResponseModel(data=RoleResponse.model_validate(role))


@router.post("/roles", response_model=ResponseModel, status_code=201)
async def create_role(
    data: RoleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    role = Role(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(role)
    await db.flush()
    await db.refresh(role)
    return ResponseModel(data=RoleResponse.model_validate(role))


@router.put("/roles/{role_id}", response_model=ResponseModel)
async def update_role(
    role_id: int,
    data: RoleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Role).where(
        Role.id == role_id,
        Role.company_id == current_user.company_id,
        Role.deleted_at.is_(None),
    ))
    role = result.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(role, k, v)
    await db.flush()
    await db.refresh(role)
    return ResponseModel(data=RoleResponse.model_validate(role))


@router.delete("/roles/{role_id}", response_model=ResponseModel)
async def delete_role(
    role_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Role).where(
        Role.id == role_id,
        Role.company_id == current_user.company_id,
        Role.deleted_at.is_(None),
    ))
    role = result.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    role.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Role deleted")


# ── Company ──────────────────────────────────────────────────────

@router.get("/companies/{company_id}", response_model=ResponseModel)
async def get_company(
    company_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Company).where(
        Company.id == company_id,
        Company.id == current_user.company_id,
    ))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return ResponseModel(data=CompanyResponse.model_validate(company))


@router.put("/companies/{company_id}", response_model=ResponseModel)
async def update_company(
    company_id: int,
    data: CompanyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    if company_id != current_user.company_id:
        raise HTTPException(status_code=403, detail="Cannot modify another company")
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(company, k, v)
    await db.flush()
    await db.refresh(company)
    return ResponseModel(data=CompanyResponse.model_validate(company))


# ── Departments ──────────────────────────────────────────────────

@router.get("/departments", response_model=PaginatedResponse)
async def list_departments(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Department).join(Branch, Department.branch_id == Branch.id).where(
        Branch.company_id == current_user.company_id,
        Department.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Department).join(
        Branch, Department.branch_id == Branch.id
    ).where(
        Branch.company_id == current_user.company_id,
        Department.deleted_at.is_(None),
    )

    if search:
        query = query.where(Department.name.ilike(f"%{search}%"))
        count_query = count_query.where(Department.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[DepartmentResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/departments/{department_id}", response_model=ResponseModel)
async def get_department(
    department_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Department).join(
        Branch, Department.branch_id == Branch.id
    ).where(
        Department.id == department_id,
        Branch.company_id == current_user.company_id,
        Department.deleted_at.is_(None),
    ))
    dept = result.scalar_one_or_none()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    return ResponseModel(data=DepartmentResponse.model_validate(dept))


@router.post("/departments", response_model=ResponseModel, status_code=201)
async def create_department(
    data: DepartmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    dept = Department(**data.model_dump())
    db.add(dept)
    await db.flush()
    await db.refresh(dept)
    return ResponseModel(data=DepartmentResponse.model_validate(dept))


@router.put("/departments/{department_id}", response_model=ResponseModel)
async def update_department(
    department_id: int,
    data: DepartmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Department).join(
        Branch, Department.branch_id == Branch.id
    ).where(
        Department.id == department_id,
        Branch.company_id == current_user.company_id,
        Department.deleted_at.is_(None),
    ))
    dept = result.scalar_one_or_none()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(dept, k, v)
    await db.flush()
    await db.refresh(dept)
    return ResponseModel(data=DepartmentResponse.model_validate(dept))


@router.delete("/departments/{department_id}", response_model=ResponseModel)
async def delete_department(
    department_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Department).join(
        Branch, Department.branch_id == Branch.id
    ).where(
        Department.id == department_id,
        Branch.company_id == current_user.company_id,
        Department.deleted_at.is_(None),
    ))
    dept = result.scalar_one_or_none()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    dept.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Department deleted")


# ── Audit Logs ───────────────────────────────────────────────────

@router.get("/audit-logs", response_model=PaginatedResponse)
async def list_audit_logs(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(AuditLog).where(AuditLog.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(AuditLog).where(
        AuditLog.company_id == current_user.company_id
    )

    if search:
        query = query.where(AuditLog.entity.ilike(f"%{search}%"))
        count_query = count_query.where(AuditLog.entity.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(AuditLog.timestamp.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[AuditLogResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/audit-logs/{log_id}", response_model=ResponseModel)
async def get_audit_log(
    log_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(AuditLog).where(
        AuditLog.id == log_id,
        AuditLog.company_id == current_user.company_id,
    ))
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(status_code=404, detail="Audit log not found")
    return ResponseModel(data=AuditLogResponse.model_validate(log))


# ── Notifications ────────────────────────────────────────────────

@router.get("/notifications", response_model=PaginatedResponse)
async def list_notifications(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Notification).where(Notification.user_id == current_user.id)
    count_query = select(sa_func.count()).select_from(Notification).where(
        Notification.user_id == current_user.id
    )

    if search:
        query = query.where(Notification.title.ilike(f"%{search}%"))
        count_query = count_query.where(Notification.title.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Notification.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[NotificationResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.put("/notifications/{notification_id}/read", response_model=ResponseModel)
async def mark_notification_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Notification).where(
        Notification.id == notification_id,
        Notification.user_id == current_user.id,
    ))
    notif = result.scalar_one_or_none()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    await db.flush()
    await db.refresh(notif)
    return ResponseModel(data=NotificationResponse.model_validate(notif))


# ── Users ────────────────────────────────────────────────────────

@router.get("/users", response_model=PaginatedResponse)
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(User).where(
        User.company_id == current_user.company_id,
        User.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(User).where(
        User.company_id == current_user.company_id,
        User.deleted_at.is_(None),
    )

    if search:
        query = query.where(User.full_name.ilike(f"%{search}%"))
        count_query = count_query.where(User.full_name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[UserResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )
