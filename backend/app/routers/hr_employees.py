"""Extended employee features: Teams, Dependents, Lifecycle, Org Chart, Directory."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.dependencies.auth import require_company
from app.models.auth import User, Department
from app.models.hr import (
    Employee, Team, EmployeeDependent, EmployeeLifecycle,
    employee_teams_table,
)
from app.schemas.hr import (
    TeamCreate, TeamUpdate, TeamResponse, TeamMemberAdd,
    EmployeeDependentCreate, EmployeeDependentUpdate, EmployeeDependentResponse,
    EmployeeLifecycleCreate, EmployeeLifecycleResponse,
    EmployeeResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/hr", tags=["Human Resources"])


# ═══════════════════════════════════════════════════════════════════════════════
# TEAMS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/teams", response_model=PaginatedResponse)
async def list_teams(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    department_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Team).where(Team.company_id == current_user.company_id, Team.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(Team).where(Team.company_id == current_user.company_id, Team.deleted_at.is_(None))
    if search:
        query = query.where(Team.name.ilike(f"%{search}%"))
        count_query = count_query.where(Team.name.ilike(f"%{search}%"))
    if department_id:
        query = query.where(Team.department_id == department_id)
        count_query = count_query.where(Team.department_id == department_id)
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    enriched = []
    for team in items:
        d = TeamResponse.model_validate(team, update={"members": None})
        if team.lead_id:
            lead_result = await db.execute(
                select(User.full_name).join(Employee, Employee.user_id == User.id).where(Employee.id == team.lead_id)
            )
            d.lead_name = lead_result.scalar_one_or_none()
        if team.department_id:
            dept_result = await db.execute(select(Department.name).where(Department.id == team.department_id))
            d.department_name = dept_result.scalar_one_or_none()
        member_count_q = select(sa_func.count()).select_from(employee_teams_table).where(employee_teams_table.c.team_id == team.id)
        d.member_count = (await db.execute(member_count_q)).scalar() or 0
        enriched.append(d)

    return PaginatedResponse(items=enriched, total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/teams/{item_id}", response_model=ResponseModel)
async def get_team(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Team).where(Team.id == item_id, Team.company_id == current_user.company_id, Team.deleted_at.is_(None)))
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    d = TeamResponse.model_validate(team, update={"members": None})
    if team.lead_id:
        lead_result = await db.execute(
            select(User.full_name).join(Employee, Employee.user_id == User.id).where(Employee.id == team.lead_id)
        )
        d.lead_name = lead_result.scalar_one_or_none()
    if team.department_id:
        dept_result = await db.execute(select(Department.name).where(Department.id == team.department_id))
        d.department_name = dept_result.scalar_one_or_none()

    members_q = (
        select(employee_teams_table, User.full_name, Employee.employee_code, Employee.designation)
        .join(Employee, Employee.id == employee_teams_table.c.employee_id)
        .outerjoin(User, Employee.user_id == User.id)
        .where(employee_teams_table.c.team_id == team.id)
    )
    members_result = await db.execute(members_q)
    members = []
    for row in members_result.all():
        members.append({
            "employee_id": row.employee_id,
            "employee_name": row.full_name,
            "employee_code": row.employee_code,
            "designation": row.designation,
            "role": row.role,
            "joined_at": row.joined_at,
        })
    d.members = members
    d.member_count = len(members)
    return ResponseModel(data=d)


@router.post("/teams", response_model=ResponseModel, status_code=201)
async def create_team(data: TeamCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    member_ids = data.member_ids or []
    member_roles = data.member_roles or []
    team = Team(
        **data.model_dump(exclude={"company_id", "member_ids", "member_roles"}),
        company_id=current_user.company_id,
    )
    db.add(team)
    await db.flush()
    for i, mid in enumerate(member_ids):
        role = member_roles[i] if i < len(member_roles) else "member"
        await db.execute(employee_teams_table.insert().values(employee_id=mid, team_id=team.id, role=role))
    await db.flush()
    return ResponseModel(data=TeamResponse.model_validate(team))


@router.put("/teams/{item_id}", response_model=ResponseModel)
async def update_team(item_id: int, data: TeamUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Team).where(Team.id == item_id, Team.company_id == current_user.company_id, Team.deleted_at.is_(None)))
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    update_data = data.model_dump(exclude_unset=True)
    member_ids = update_data.pop("member_ids", None)
    member_roles = update_data.pop("member_roles", None)
    for k, v in update_data.items():
        setattr(team, k, v)
    if member_ids is not None:
        await db.execute(employee_teams_table.delete().where(employee_teams_table.c.team_id == team.id))
        for i, mid in enumerate(member_ids):
            role = member_roles[i] if member_roles and i < len(member_roles) else "member"
            await db.execute(employee_teams_table.insert().values(employee_id=mid, team_id=team.id, role=role))
    await db.flush()
    return ResponseModel(data=TeamResponse.model_validate(team))


@router.delete("/teams/{item_id}", response_model=ResponseModel)
async def delete_team(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Team).where(Team.id == item_id, Team.company_id == current_user.company_id, Team.deleted_at.is_(None)))
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    team.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Team deleted")


@router.post("/teams/{item_id}/members", response_model=ResponseModel)
async def add_team_member(item_id: int, data: TeamMemberAdd, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Team).where(Team.id == item_id, Team.company_id == current_user.company_id, Team.deleted_at.is_(None)))
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    existing = await db.execute(
        select(employee_teams_table).where(
            employee_teams_table.c.team_id == team.id,
            employee_teams_table.c.employee_id == data.employee_id,
        )
    )
    if existing.first():
        raise HTTPException(status_code=400, detail="Employee is already a team member")
    await db.execute(employee_teams_table.insert().values(
        employee_id=data.employee_id, team_id=team.id, role=data.role,
    ))
    await db.flush()
    return ResponseModel(message="Member added to team")


@router.delete("/teams/{item_id}/members/{employee_id}", response_model=ResponseModel)
async def remove_team_member(item_id: int, employee_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Team).where(Team.id == item_id, Team.company_id == current_user.company_id, Team.deleted_at.is_(None)))
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    await db.execute(
        employee_teams_table.delete().where(
            employee_teams_table.c.team_id == team.id,
            employee_teams_table.c.employee_id == employee_id,
        )
    )
    await db.flush()
    return ResponseModel(message="Member removed from team")


# ═══════════════════════════════════════════════════════════════════════════════
# EMPLOYEE DEPENDENTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/employees/{employee_id}/dependents", response_model=ResponseModel)
async def list_employee_dependents(employee_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmployeeDependent).where(
        EmployeeDependent.employee_id == employee_id,
        EmployeeDependent.company_id == current_user.company_id,
        EmployeeDependent.deleted_at.is_(None),
    ))
    items = result.scalars().all()
    return ResponseModel(data=[EmployeeDependentResponse.model_validate(i).model_dump() for i in items])


@router.post("/employees/{employee_id}/dependents", response_model=ResponseModel, status_code=201)
async def create_employee_dependent(employee_id: int, data: EmployeeDependentCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    dep = EmployeeDependent(
        **data.model_dump(exclude={"company_id"}),
        employee_id=employee_id,
        company_id=current_user.company_id,
    )
    db.add(dep)
    await db.flush()
    await db.refresh(dep)
    return ResponseModel(data=EmployeeDependentResponse.model_validate(dep))


@router.put("/employees/{employee_id}/dependents/{dep_id}", response_model=ResponseModel)
async def update_employee_dependent(employee_id: int, dep_id: int, data: EmployeeDependentUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmployeeDependent).where(
        EmployeeDependent.id == dep_id,
        EmployeeDependent.employee_id == employee_id,
        EmployeeDependent.company_id == current_user.company_id,
        EmployeeDependent.deleted_at.is_(None),
    ))
    dep = result.scalar_one_or_none()
    if not dep:
        raise HTTPException(status_code=404, detail="Dependent not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(dep, k, v)
    await db.flush()
    await db.refresh(dep)
    return ResponseModel(data=EmployeeDependentResponse.model_validate(dep))


@router.delete("/employees/{employee_id}/dependents/{dep_id}", response_model=ResponseModel)
async def delete_employee_dependent(employee_id: int, dep_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmployeeDependent).where(
        EmployeeDependent.id == dep_id,
        EmployeeDependent.employee_id == employee_id,
        EmployeeDependent.company_id == current_user.company_id,
        EmployeeDependent.deleted_at.is_(None),
    ))
    dep = result.scalar_one_or_none()
    if not dep:
        raise HTTPException(status_code=404, detail="Dependent not found")
    dep.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Dependent deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# EMPLOYEE TEAMS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/employees/{employee_id}/teams", response_model=ResponseModel)
async def list_employee_teams(employee_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(
        select(Team, User.full_name)
        .join(employee_teams_table, Team.id == employee_teams_table.c.team_id)
        .outerjoin(Employee, Employee.id == Team.lead_id)
        .outerjoin(User, Employee.user_id == User.id)
        .where(employee_teams_table.c.employee_id == employee_id, Team.deleted_at.is_(None))
    )
    rows = result.all()
    teams = []
    for team, lead_name in rows:
        mc = await db.execute(select(sa_func.count()).select_from(employee_teams_table).where(employee_teams_table.c.team_id == team.id))
        teams.append({
            "id": team.id,
            "name": team.name,
            "lead_name": lead_name,
            "member_count": mc.scalar() or 0,
        })
    return ResponseModel(data=teams)


# ═══════════════════════════════════════════════════════════════════════════════
# EMPLOYEE LIFECYCLE
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/employees/{employee_id}/lifecycle", response_model=ResponseModel)
async def list_employee_lifecycle(employee_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    base = (
        select(EmployeeLifecycle, User.full_name, Employee.employee_code)
        .outerjoin(User, EmployeeLifecycle.changed_by == User.id)
        .outerjoin(Employee, EmployeeLifecycle.employee_id == Employee.id)
        .where(
            EmployeeLifecycle.employee_id == employee_id,
            EmployeeLifecycle.company_id == current_user.company_id,
        )
        .order_by(EmployeeLifecycle.created_at.desc())
    )
    result = await db.execute(base)
    items = []
    for row in result.all():
        lc, changed_by_name, emp_code = row
        d = EmployeeLifecycleResponse.model_validate(lc)
        d.changed_by_name = changed_by_name
        d.employee_code = emp_code
        items.append(d)
    return ResponseModel(data=[i.model_dump() for i in items])


@router.post("/employees/{employee_id}/lifecycle", response_model=ResponseModel, status_code=201)
async def create_lifecycle_event(employee_id: int, data: EmployeeLifecycleCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    emp_result = await db.execute(select(Employee).where(Employee.id == employee_id, Employee.company_id == current_user.company_id))
    employee = emp_result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    event = EmployeeLifecycle(
        **data.model_dump(exclude={"company_id"}),
        employee_id=employee_id,
        company_id=current_user.company_id,
        from_status=data.from_status or employee.status,
        changed_by=current_user.id,
    )
    db.add(event)
    employee.status = data.to_status
    await db.flush()
    await db.refresh(event)
    return ResponseModel(data=EmployeeLifecycleResponse.model_validate(event))


# ═══════════════════════════════════════════════════════════════════════════════
# ORG CHART
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/org-chart", response_model=ResponseModel)
async def get_org_chart(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(
        select(Employee, User.full_name, Department.name.label("dept_name"))
        .outerjoin(User, Employee.user_id == User.id)
        .outerjoin(Department, Employee.department_id == Department.id)
        .where(Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None), Employee.status == "active")
    )
    rows = result.all()
    employees = {}
    for emp, full_name, dept_name in rows:
        employees[emp.id] = {
            "id": emp.id,
            "employee_id": emp.id,
            "employee_name": full_name,
            "employee_code": emp.employee_code,
            "designation": emp.designation,
            "department": dept_name,
            "photo_url": emp.photo_url,
            "reports_to": emp.reporting_to,
            "children": [],
        }

    def build_tree(parent_id):
        children = []
        for eid, node in employees.items():
            if node["reports_to"] == parent_id:
                node_copy = {k: v for k, v in node.items() if k != "reports_to"}
                node_copy["children"] = build_tree(eid)
                children.append(node_copy)
        return children

    tree = []
    for eid, node in employees.items():
        if not node["reports_to"] or node["reports_to"] not in employees:
            node_copy = {k: v for k, v in node.items() if k != "reports_to"}
            node_copy["children"] = build_tree(eid)
            tree.append(node_copy)
    return ResponseModel(data=tree)


# ═══════════════════════════════════════════════════════════════════════════════
# EMPLOYEE DIRECTORY
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/employee-directory", response_model=PaginatedResponse)
async def employee_directory(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    department_id: Optional[int] = None,
    team_id: Optional[int] = None,
    reporting_to: Optional[int] = None,
    status: Optional[str] = "active",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    base = (
        select(Employee, User.full_name, User.email, Department.name.label("dept_name"))
        .outerjoin(User, Employee.user_id == User.id)
        .outerjoin(Department, Employee.department_id == Department.id)
        .where(Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None))
    )
    count_q = (
        select(sa_func.count())
        .select_from(Employee)
        .outerjoin(User, Employee.user_id == User.id)
        .where(Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None))
    )
    if status:
        base = base.where(Employee.status == status)
        count_q = count_q.where(Employee.status == status)
    if department_id:
        base = base.where(Employee.department_id == department_id)
        count_q = count_q.where(Employee.department_id == department_id)
    if reporting_to is not None:
        base = base.where(Employee.reporting_to == reporting_to)
        count_q = count_q.where(Employee.reporting_to == reporting_to)
    if team_id:
        base = base.join(employee_teams_table, Employee.id == employee_teams_table.c.employee_id).where(employee_teams_table.c.team_id == team_id)
        count_q = count_q.join(employee_teams_table, Employee.id == employee_teams_table.c.employee_id).where(employee_teams_table.c.team_id == team_id)
    if search:
        term = f"%{search}%"
        name_filter = User.full_name.ilike(term) | User.email.ilike(term) | Employee.employee_code.ilike(term) | Employee.designation.ilike(term) | Employee.phone.ilike(term)
        base = base.where(name_filter)
        count_q = count_q.where(name_filter)
    total = (await db.execute(count_q)).scalar() or 0
    base = base.order_by(User.full_name).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(base)
    rows = result.all()
    items = []
    for emp, full_name, email, dept_name in rows:
        d = EmployeeResponse.model_validate(emp)
        d.first_name = (full_name or "").split(" ")[0] if full_name else None
        d.last_name = " ".join((full_name or "").split(" ")[1:]) if full_name and len(full_name.split(" ")) > 1 else None
        d.full_name = full_name
        d.email = email
        d.department_name = dept_name
        items.append(d)
    return PaginatedResponse(items=items, total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)
