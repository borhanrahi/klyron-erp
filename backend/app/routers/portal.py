from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.dependencies.auth import require_company
from app.models.auth import User
from app.models.portal import PortalUser, PortalSession
from app.schemas.portal import (
    PortalUserCreate, PortalUserUpdate, PortalUserResponse,
    PortalSessionCreate, PortalSessionUpdate, PortalSessionResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/portal", tags=["Customer Portal"])


# ── Portal Users ─────────────────────────────────────────────────

@router.get("/users", response_model=PaginatedResponse)
async def list_portal_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(PortalUser).where(
        PortalUser.company_id == current_user.company_id,
        PortalUser.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(PortalUser).where(
        PortalUser.company_id == current_user.company_id,
        PortalUser.deleted_at.is_(None),
    )

    if search:
        query = query.where(PortalUser.customer_id.ilike(f"%{search}%"))
        count_query = count_query.where(PortalUser.customer_id.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[PortalUserResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/users/{portal_user_id}", response_model=ResponseModel)
async def get_portal_user(
    portal_user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(PortalUser).where(
        PortalUser.id == portal_user_id,
        PortalUser.company_id == current_user.company_id,
        PortalUser.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Portal user not found")
    return ResponseModel(data=PortalUserResponse.model_validate(item))


@router.post("/users", response_model=ResponseModel, status_code=201)
async def create_portal_user(
    data: PortalUserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    item = PortalUser(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=PortalUserResponse.model_validate(item))


@router.put("/users/{portal_user_id}", response_model=ResponseModel)
async def update_portal_user(
    portal_user_id: int,
    data: PortalUserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(PortalUser).where(
        PortalUser.id == portal_user_id,
        PortalUser.company_id == current_user.company_id,
        PortalUser.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Portal user not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=PortalUserResponse.model_validate(item))


@router.delete("/users/{portal_user_id}", response_model=ResponseModel)
async def delete_portal_user(
    portal_user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(PortalUser).where(
        PortalUser.id == portal_user_id,
        PortalUser.company_id == current_user.company_id,
        PortalUser.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Portal user not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Portal user deleted")


# ── Portal Sessions ──────────────────────────────────────────────

@router.get("/sessions", response_model=PaginatedResponse)
async def list_portal_sessions(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    portal_user_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(PortalSession)
    count_query = select(sa_func.count()).select_from(PortalSession)

    if portal_user_id:
        query = query.where(PortalSession.portal_user_id == portal_user_id)
        count_query = count_query.where(PortalSession.portal_user_id == portal_user_id)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(PortalSession.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[PortalSessionResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/sessions/{session_id}", response_model=ResponseModel)
async def get_portal_session(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(PortalSession).where(PortalSession.id == session_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Portal session not found")
    return ResponseModel(data=PortalSessionResponse.model_validate(item))


@router.post("/sessions", response_model=ResponseModel, status_code=201)
async def create_portal_session(
    data: PortalSessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    item = PortalSession(**data.model_dump())
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=PortalSessionResponse.model_validate(item))


@router.put("/sessions/{session_id}", response_model=ResponseModel)
async def update_portal_session(
    session_id: int,
    data: PortalSessionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(PortalSession).where(PortalSession.id == session_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Portal session not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=PortalSessionResponse.model_validate(item))


@router.delete("/sessions/{session_id}", response_model=ResponseModel)
async def delete_portal_session(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(PortalSession).where(PortalSession.id == session_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Portal session not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Portal session deleted")
