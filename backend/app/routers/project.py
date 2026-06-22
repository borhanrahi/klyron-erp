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
from app.models.project import (
    Project, ProjectMilestone, ProjectTask, ProjectBug,
    Timesheet, ProjectExpense, ProjectNote,
)
from app.schemas.project import (
    ProjectCreate, ProjectUpdate, ProjectResponse,
    ProjectMilestoneCreate, ProjectMilestoneUpdate, ProjectMilestoneResponse,
    ProjectTaskCreate, ProjectTaskUpdate, ProjectTaskResponse,
    ProjectBugCreate, ProjectBugUpdate, ProjectBugResponse,
    TimesheetCreate, TimesheetUpdate, TimesheetResponse,
    ProjectExpenseCreate, ProjectExpenseUpdate, ProjectExpenseResponse,
    ProjectNoteCreate, ProjectNoteUpdate, ProjectNoteResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/projects", tags=["Projects"])


# ── Projects ──

@router.get("/", response_model=PaginatedResponse)
async def list_projects(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = (
        select(Project)
        .options(selectinload(Project.tasks), selectinload(Project.milestones))
        .where(Project.company_id == current_user.company_id, Project.deleted_at.is_(None))
    )
    count_query = (
        select(sa_func.count())
        .select_from(Project)
        .where(Project.company_id == current_user.company_id, Project.deleted_at.is_(None))
    )

    if search:
        query = query.where(Project.name.ilike(f"%{search}%"))
        count_query = count_query.where(Project.name.ilike(f"%{search}%"))
    if status:
        query = query.where(Project.status == status)
        count_query = count_query.where(Project.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Project.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().unique().all()

    return PaginatedResponse(
        items=[ProjectResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/{project_id}", response_model=ResponseModel)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.tasks), selectinload(Project.milestones))
        .where(
            Project.id == project_id,
            Project.company_id == current_user.company_id,
            Project.deleted_at.is_(None),
        )
    )
    project = result.scalars().unique().one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ResponseModel(data=ProjectResponse.model_validate(project))


@router.post("/", response_model=ResponseModel, status_code=201)
async def create_project(
    data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    project = Project(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(project)
    await db.flush()
    await db.refresh(project)
    return ResponseModel(data=ProjectResponse.model_validate(project))


@router.put("/{project_id}", response_model=ResponseModel)
async def update_project(
    project_id: int,
    data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.company_id == current_user.company_id,
            Project.deleted_at.is_(None),
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(project, k, v)
    await db.flush()
    await db.refresh(project)
    return ResponseModel(data=ProjectResponse.model_validate(project))


@router.delete("/{project_id}", response_model=ResponseModel)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.company_id == current_user.company_id,
            Project.deleted_at.is_(None),
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Project deleted")


# ── Tasks ──

@router.get("/tasks/list", response_model=PaginatedResponse)
async def list_tasks(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    project_id: Optional[int] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = (
        select(ProjectTask)
        .join(Project, ProjectTask.project_id == Project.id)
        .where(Project.company_id == current_user.company_id)
    )
    count_query = (
        select(sa_func.count())
        .select_from(ProjectTask)
        .join(Project, ProjectTask.project_id == Project.id)
        .where(Project.company_id == current_user.company_id)
    )

    if search:
        query = query.where(ProjectTask.title.ilike(f"%{search}%"))
        count_query = count_query.where(ProjectTask.title.ilike(f"%{search}%"))
    if project_id:
        query = query.where(ProjectTask.project_id == project_id)
        count_query = count_query.where(ProjectTask.project_id == project_id)
    if status:
        query = query.where(ProjectTask.status == status)
        count_query = count_query.where(ProjectTask.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(ProjectTask.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[ProjectTaskResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/tasks/{task_id}", response_model=ResponseModel)
async def get_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectTask)
        .join(Project, ProjectTask.project_id == Project.id)
        .where(
            ProjectTask.id == task_id,
            Project.company_id == current_user.company_id,
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return ResponseModel(data=ProjectTaskResponse.model_validate(task))


@router.post("/tasks", response_model=ResponseModel, status_code=201)
async def create_task(
    data: ProjectTaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    task = ProjectTask(**data.model_dump())
    db.add(task)
    await db.flush()
    await db.refresh(task)
    return ResponseModel(data=ProjectTaskResponse.model_validate(task))


@router.put("/tasks/{task_id}", response_model=ResponseModel)
async def update_task(
    task_id: int,
    data: ProjectTaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectTask)
        .join(Project, ProjectTask.project_id == Project.id)
        .where(
            ProjectTask.id == task_id,
            Project.company_id == current_user.company_id,
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(task, k, v)
    await db.flush()
    await db.refresh(task)
    return ResponseModel(data=ProjectTaskResponse.model_validate(task))


@router.delete("/tasks/{task_id}", response_model=ResponseModel)
async def delete_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectTask)
        .join(Project, ProjectTask.project_id == Project.id)
        .where(
            ProjectTask.id == task_id,
            Project.company_id == current_user.company_id,
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    await db.delete(task)
    await db.flush()
    return ResponseModel(message="Task deleted")


# ── Milestones ──

@router.get("/milestones/list", response_model=PaginatedResponse)
async def list_milestones(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    project_id: Optional[int] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = (
        select(ProjectMilestone)
        .join(Project, ProjectMilestone.project_id == Project.id)
        .where(Project.company_id == current_user.company_id)
    )
    count_query = (
        select(sa_func.count())
        .select_from(ProjectMilestone)
        .join(Project, ProjectMilestone.project_id == Project.id)
        .where(Project.company_id == current_user.company_id)
    )

    if project_id:
        query = query.where(ProjectMilestone.project_id == project_id)
        count_query = count_query.where(ProjectMilestone.project_id == project_id)
    if status:
        query = query.where(ProjectMilestone.status == status)
        count_query = count_query.where(ProjectMilestone.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(ProjectMilestone.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[ProjectMilestoneResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/milestones/{milestone_id}", response_model=ResponseModel)
async def get_milestone(
    milestone_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectMilestone)
        .join(Project, ProjectMilestone.project_id == Project.id)
        .where(
            ProjectMilestone.id == milestone_id,
            Project.company_id == current_user.company_id,
        )
    )
    milestone = result.scalar_one_or_none()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return ResponseModel(data=ProjectMilestoneResponse.model_validate(milestone))


@router.post("/milestones", response_model=ResponseModel, status_code=201)
async def create_milestone(
    data: ProjectMilestoneCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    milestone = ProjectMilestone(**data.model_dump())
    db.add(milestone)
    await db.flush()
    await db.refresh(milestone)
    return ResponseModel(data=ProjectMilestoneResponse.model_validate(milestone))


@router.put("/milestones/{milestone_id}", response_model=ResponseModel)
async def update_milestone(
    milestone_id: int,
    data: ProjectMilestoneUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectMilestone)
        .join(Project, ProjectMilestone.project_id == Project.id)
        .where(
            ProjectMilestone.id == milestone_id,
            Project.company_id == current_user.company_id,
        )
    )
    milestone = result.scalar_one_or_none()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(milestone, k, v)
    await db.flush()
    await db.refresh(milestone)
    return ResponseModel(data=ProjectMilestoneResponse.model_validate(milestone))


@router.delete("/milestones/{milestone_id}", response_model=ResponseModel)
async def delete_milestone(
    milestone_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectMilestone)
        .join(Project, ProjectMilestone.project_id == Project.id)
        .where(
            ProjectMilestone.id == milestone_id,
            Project.company_id == current_user.company_id,
        )
    )
    milestone = result.scalar_one_or_none()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    await db.delete(milestone)
    await db.flush()
    return ResponseModel(message="Milestone deleted")


# ── Bugs ──

@router.get("/bugs/list", response_model=PaginatedResponse)
async def list_bugs(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    project_id: Optional[int] = None,
    status: Optional[str] = None,
    severity: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = (
        select(ProjectBug)
        .join(Project, ProjectBug.project_id == Project.id)
        .where(Project.company_id == current_user.company_id)
    )
    count_query = (
        select(sa_func.count())
        .select_from(ProjectBug)
        .join(Project, ProjectBug.project_id == Project.id)
        .where(Project.company_id == current_user.company_id)
    )

    if search:
        query = query.where(ProjectBug.title.ilike(f"%{search}%"))
        count_query = count_query.where(ProjectBug.title.ilike(f"%{search}%"))
    if project_id:
        query = query.where(ProjectBug.project_id == project_id)
        count_query = count_query.where(ProjectBug.project_id == project_id)
    if status:
        query = query.where(ProjectBug.status == status)
        count_query = count_query.where(ProjectBug.status == status)
    if severity:
        query = query.where(ProjectBug.severity == severity)
        count_query = count_query.where(ProjectBug.severity == severity)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(ProjectBug.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[ProjectBugResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/bugs/{bug_id}", response_model=ResponseModel)
async def get_bug(
    bug_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectBug)
        .join(Project, ProjectBug.project_id == Project.id)
        .where(
            ProjectBug.id == bug_id,
            Project.company_id == current_user.company_id,
        )
    )
    bug = result.scalar_one_or_none()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")
    return ResponseModel(data=ProjectBugResponse.model_validate(bug))


@router.post("/bugs", response_model=ResponseModel, status_code=201)
async def create_bug(
    data: ProjectBugCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    bug = ProjectBug(**data.model_dump())
    db.add(bug)
    await db.flush()
    await db.refresh(bug)
    return ResponseModel(data=ProjectBugResponse.model_validate(bug))


@router.put("/bugs/{bug_id}", response_model=ResponseModel)
async def update_bug(
    bug_id: int,
    data: ProjectBugUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectBug)
        .join(Project, ProjectBug.project_id == Project.id)
        .where(
            ProjectBug.id == bug_id,
            Project.company_id == current_user.company_id,
        )
    )
    bug = result.scalar_one_or_none()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(bug, k, v)
    await db.flush()
    await db.refresh(bug)
    return ResponseModel(data=ProjectBugResponse.model_validate(bug))


@router.delete("/bugs/{bug_id}", response_model=ResponseModel)
async def delete_bug(
    bug_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectBug)
        .join(Project, ProjectBug.project_id == Project.id)
        .where(
            ProjectBug.id == bug_id,
            Project.company_id == current_user.company_id,
        )
    )
    bug = result.scalar_one_or_none()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")
    await db.delete(bug)
    await db.flush()
    return ResponseModel(message="Bug deleted")


# ── Timesheets ──

@router.get("/timesheets/list", response_model=PaginatedResponse)
async def list_timesheets(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    project_id: Optional[int] = None,
    employee_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Timesheet).where(Timesheet.company_id == current_user.company_id)
    count_query = (
        select(sa_func.count())
        .select_from(Timesheet)
        .where(Timesheet.company_id == current_user.company_id)
    )

    if project_id:
        query = query.where(Timesheet.project_id == project_id)
        count_query = count_query.where(Timesheet.project_id == project_id)
    if employee_id:
        query = query.where(Timesheet.employee_id == employee_id)
        count_query = count_query.where(Timesheet.employee_id == employee_id)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Timesheet.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[TimesheetResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/timesheets/{timesheet_id}", response_model=ResponseModel)
async def get_timesheet(
    timesheet_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Timesheet).where(
            Timesheet.id == timesheet_id,
            Timesheet.company_id == current_user.company_id,
        )
    )
    ts = result.scalar_one_or_none()
    if not ts:
        raise HTTPException(status_code=404, detail="Timesheet not found")
    return ResponseModel(data=TimesheetResponse.model_validate(ts))


@router.post("/timesheets", response_model=ResponseModel, status_code=201)
async def create_timesheet(
    data: TimesheetCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    ts = Timesheet(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(ts)
    await db.flush()
    await db.refresh(ts)
    return ResponseModel(data=TimesheetResponse.model_validate(ts))


@router.put("/timesheets/{timesheet_id}", response_model=ResponseModel)
async def update_timesheet(
    timesheet_id: int,
    data: TimesheetUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Timesheet).where(
            Timesheet.id == timesheet_id,
            Timesheet.company_id == current_user.company_id,
        )
    )
    ts = result.scalar_one_or_none()
    if not ts:
        raise HTTPException(status_code=404, detail="Timesheet not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(ts, k, v)
    await db.flush()
    await db.refresh(ts)
    return ResponseModel(data=TimesheetResponse.model_validate(ts))


@router.delete("/timesheets/{timesheet_id}", response_model=ResponseModel)
async def delete_timesheet(
    timesheet_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Timesheet).where(
            Timesheet.id == timesheet_id,
            Timesheet.company_id == current_user.company_id,
        )
    )
    ts = result.scalar_one_or_none()
    if not ts:
        raise HTTPException(status_code=404, detail="Timesheet not found")
    await db.delete(ts)
    await db.flush()
    return ResponseModel(message="Timesheet deleted")


# ── Expenses ──

@router.get("/expenses/list", response_model=PaginatedResponse)
async def list_expenses(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    project_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = (
        select(ProjectExpense)
        .join(Project, ProjectExpense.project_id == Project.id)
        .where(Project.company_id == current_user.company_id)
    )
    count_query = (
        select(sa_func.count())
        .select_from(ProjectExpense)
        .join(Project, ProjectExpense.project_id == Project.id)
        .where(Project.company_id == current_user.company_id)
    )

    if project_id:
        query = query.where(ProjectExpense.project_id == project_id)
        count_query = count_query.where(ProjectExpense.project_id == project_id)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(ProjectExpense.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[ProjectExpenseResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/expenses/{expense_id}", response_model=ResponseModel)
async def get_expense(
    expense_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectExpense)
        .join(Project, ProjectExpense.project_id == Project.id)
        .where(
            ProjectExpense.id == expense_id,
            Project.company_id == current_user.company_id,
        )
    )
    expense = result.scalar_one_or_none()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return ResponseModel(data=ProjectExpenseResponse.model_validate(expense))


@router.post("/expenses", response_model=ResponseModel, status_code=201)
async def create_expense(
    data: ProjectExpenseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    expense = ProjectExpense(**data.model_dump())
    db.add(expense)
    await db.flush()
    await db.refresh(expense)
    return ResponseModel(data=ProjectExpenseResponse.model_validate(expense))


@router.put("/expenses/{expense_id}", response_model=ResponseModel)
async def update_expense(
    expense_id: int,
    data: ProjectExpenseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectExpense)
        .join(Project, ProjectExpense.project_id == Project.id)
        .where(
            ProjectExpense.id == expense_id,
            Project.company_id == current_user.company_id,
        )
    )
    expense = result.scalar_one_or_none()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(expense, k, v)
    await db.flush()
    await db.refresh(expense)
    return ResponseModel(data=ProjectExpenseResponse.model_validate(expense))


@router.delete("/expenses/{expense_id}", response_model=ResponseModel)
async def delete_expense(
    expense_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectExpense)
        .join(Project, ProjectExpense.project_id == Project.id)
        .where(
            ProjectExpense.id == expense_id,
            Project.company_id == current_user.company_id,
        )
    )
    expense = result.scalar_one_or_none()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    await db.delete(expense)
    await db.flush()
    return ResponseModel(message="Expense deleted")


# ── Notes ──

@router.get("/notes/list", response_model=PaginatedResponse)
async def list_notes(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    project_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = (
        select(ProjectNote)
        .join(Project, ProjectNote.project_id == Project.id)
        .where(Project.company_id == current_user.company_id)
    )
    count_query = (
        select(sa_func.count())
        .select_from(ProjectNote)
        .join(Project, ProjectNote.project_id == Project.id)
        .where(Project.company_id == current_user.company_id)
    )

    if project_id:
        query = query.where(ProjectNote.project_id == project_id)
        count_query = count_query.where(ProjectNote.project_id == project_id)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(ProjectNote.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[ProjectNoteResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/notes/{note_id}", response_model=ResponseModel)
async def get_note(
    note_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectNote)
        .join(Project, ProjectNote.project_id == Project.id)
        .where(
            ProjectNote.id == note_id,
            Project.company_id == current_user.company_id,
        )
    )
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return ResponseModel(data=ProjectNoteResponse.model_validate(note))


@router.post("/notes", response_model=ResponseModel, status_code=201)
async def create_note(
    data: ProjectNoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    note = ProjectNote(**data.model_dump(), user_id=current_user.id)
    db.add(note)
    await db.flush()
    await db.refresh(note)
    return ResponseModel(data=ProjectNoteResponse.model_validate(note))


@router.put("/notes/{note_id}", response_model=ResponseModel)
async def update_note(
    note_id: int,
    data: ProjectNoteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectNote)
        .join(Project, ProjectNote.project_id == Project.id)
        .where(
            ProjectNote.id == note_id,
            Project.company_id == current_user.company_id,
        )
    )
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(note, k, v)
    await db.flush()
    await db.refresh(note)
    return ResponseModel(data=ProjectNoteResponse.model_validate(note))


@router.delete("/notes/{note_id}", response_model=ResponseModel)
async def delete_note(
    note_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(ProjectNote)
        .join(Project, ProjectNote.project_id == Project.id)
        .where(
            ProjectNote.id == note_id,
            Project.company_id == current_user.company_id,
        )
    )
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    await db.delete(note)
    await db.flush()
    return ResponseModel(message="Note deleted")
