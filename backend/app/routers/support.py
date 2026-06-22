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
from app.models.support import Ticket, TicketComment, Meeting
from app.schemas.support import (
    TicketCreate, TicketUpdate, TicketResponse,
    TicketCommentCreate, TicketCommentUpdate, TicketCommentResponse,
    MeetingCreate, MeetingUpdate, MeetingResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/support", tags=["Support"])


# ── Tickets ──

@router.get("/tickets", response_model=PaginatedResponse)
async def list_tickets(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assignee_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = (
        select(Ticket)
        .options(selectinload(Ticket.comments))
        .where(Ticket.company_id == current_user.company_id, Ticket.deleted_at.is_(None))
    )
    count_query = (
        select(sa_func.count())
        .select_from(Ticket)
        .where(Ticket.company_id == current_user.company_id, Ticket.deleted_at.is_(None))
    )

    if search:
        query = query.where(Ticket.subject.ilike(f"%{search}%"))
        count_query = count_query.where(Ticket.subject.ilike(f"%{search}%"))
    if status:
        query = query.where(Ticket.status == status)
        count_query = count_query.where(Ticket.status == status)
    if priority:
        query = query.where(Ticket.priority == priority)
        count_query = count_query.where(Ticket.priority == priority)
    if assignee_id:
        query = query.where(Ticket.assignee_id == assignee_id)
        count_query = count_query.where(Ticket.assignee_id == assignee_id)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Ticket.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().unique().all()

    return PaginatedResponse(
        items=[TicketResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/tickets/{ticket_id}", response_model=ResponseModel)
async def get_ticket(
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Ticket)
        .options(selectinload(Ticket.comments))
        .where(
            Ticket.id == ticket_id,
            Ticket.company_id == current_user.company_id,
            Ticket.deleted_at.is_(None),
        )
    )
    ticket = result.scalars().unique().one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ResponseModel(data=TicketResponse.model_validate(ticket))


@router.post("/tickets", response_model=ResponseModel, status_code=201)
async def create_ticket(
    data: TicketCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    ticket = Ticket(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(ticket)
    await db.flush()
    await db.refresh(ticket)
    return ResponseModel(data=TicketResponse.model_validate(ticket))


@router.put("/tickets/{ticket_id}", response_model=ResponseModel)
async def update_ticket(
    ticket_id: int,
    data: TicketUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Ticket).where(
            Ticket.id == ticket_id,
            Ticket.company_id == current_user.company_id,
            Ticket.deleted_at.is_(None),
        )
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(ticket, k, v)
    await db.flush()
    await db.refresh(ticket)
    return ResponseModel(data=TicketResponse.model_validate(ticket))


@router.delete("/tickets/{ticket_id}", response_model=ResponseModel)
async def delete_ticket(
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Ticket).where(
            Ticket.id == ticket_id,
            Ticket.company_id == current_user.company_id,
            Ticket.deleted_at.is_(None),
        )
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    ticket.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Ticket deleted")


# ── Ticket Comments ──

@router.get("/tickets/{ticket_id}/comments", response_model=PaginatedResponse)
async def list_ticket_comments(
    ticket_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    ticket_check = await db.execute(
        select(Ticket).where(
            Ticket.id == ticket_id,
            Ticket.company_id == current_user.company_id,
            Ticket.deleted_at.is_(None),
        )
    )
    if not ticket_check.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Ticket not found")

    query = select(TicketComment).where(TicketComment.ticket_id == ticket_id)
    count_query = (
        select(sa_func.count())
        .select_from(TicketComment)
        .where(TicketComment.ticket_id == ticket_id)
    )

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(TicketComment.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[TicketCommentResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.post("/tickets/{ticket_id}/comments", response_model=ResponseModel, status_code=201)
async def create_ticket_comment(
    ticket_id: int,
    data: TicketCommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    ticket_check = await db.execute(
        select(Ticket).where(
            Ticket.id == ticket_id,
            Ticket.company_id == current_user.company_id,
            Ticket.deleted_at.is_(None),
        )
    )
    if not ticket_check.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Ticket not found")

    comment = TicketComment(**data.model_dump(), ticket_id=ticket_id, user_id=current_user.id)
    db.add(comment)
    await db.flush()
    await db.refresh(comment)
    return ResponseModel(data=TicketCommentResponse.model_validate(comment))


@router.put("/comments/{comment_id}", response_model=ResponseModel)
async def update_ticket_comment(
    comment_id: int,
    data: TicketCommentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(TicketComment)
        .join(Ticket, TicketComment.ticket_id == Ticket.id)
        .where(
            TicketComment.id == comment_id,
            Ticket.company_id == current_user.company_id,
        )
    )
    comment = result.scalar_one_or_none()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(comment, k, v)
    await db.flush()
    await db.refresh(comment)
    return ResponseModel(data=TicketCommentResponse.model_validate(comment))


@router.delete("/comments/{comment_id}", response_model=ResponseModel)
async def delete_ticket_comment(
    comment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(TicketComment)
        .join(Ticket, TicketComment.ticket_id == Ticket.id)
        .where(
            TicketComment.id == comment_id,
            Ticket.company_id == current_user.company_id,
        )
    )
    comment = result.scalar_one_or_none()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    await db.delete(comment)
    await db.flush()
    return ResponseModel(message="Comment deleted")


# ── Meetings ──

@router.get("/meetings", response_model=PaginatedResponse)
async def list_meetings(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Meeting).where(Meeting.company_id == current_user.company_id)
    count_query = (
        select(sa_func.count())
        .select_from(Meeting)
        .where(Meeting.company_id == current_user.company_id)
    )

    if search:
        query = query.where(Meeting.title.ilike(f"%{search}%"))
        count_query = count_query.where(Meeting.title.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Meeting.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[MeetingResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/meetings/{meeting_id}", response_model=ResponseModel)
async def get_meeting(
    meeting_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Meeting).where(
            Meeting.id == meeting_id,
            Meeting.company_id == current_user.company_id,
        )
    )
    meeting = result.scalar_one_or_none()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return ResponseModel(data=MeetingResponse.model_validate(meeting))


@router.post("/meetings", response_model=ResponseModel, status_code=201)
async def create_meeting(
    data: MeetingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    meeting = Meeting(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(meeting)
    await db.flush()
    await db.refresh(meeting)
    return ResponseModel(data=MeetingResponse.model_validate(meeting))


@router.put("/meetings/{meeting_id}", response_model=ResponseModel)
async def update_meeting(
    meeting_id: int,
    data: MeetingUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Meeting).where(
            Meeting.id == meeting_id,
            Meeting.company_id == current_user.company_id,
        )
    )
    meeting = result.scalar_one_or_none()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(meeting, k, v)
    await db.flush()
    await db.refresh(meeting)
    return ResponseModel(data=MeetingResponse.model_validate(meeting))


@router.delete("/meetings/{meeting_id}", response_model=ResponseModel)
async def delete_meeting(
    meeting_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Meeting).where(
            Meeting.id == meeting_id,
            Meeting.company_id == current_user.company_id,
        )
    )
    meeting = result.scalar_one_or_none()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    await db.delete(meeting)
    await db.flush()
    return ResponseModel(message="Meeting deleted")
