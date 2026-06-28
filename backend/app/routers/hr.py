from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from sqlalchemy.orm import selectinload
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.dependencies.auth import require_company
from app.models.auth import User, Department
from app.models.hr import (
    EmploymentType, WorkLocation, Shift,
    Employee, JobRequisition, Candidate, Interview, OfferLetter,
    OnboardingChecklist, OnboardingTask,
    Attendance, OvertimeRequest,
    LeaveType, LeavePolicy, Leave, LeaveBalance, Holiday,
    SalaryComponent, SalaryStructure, SalaryStructureComponent,
    Payroll, PayrollItem, Loan, LoanInstallment,
    BenefitPlan, EmployeeBenefit,
    KPI, PerformanceReview, Appraisal,
    Training, TrainingEnrollment, Certification,
    DisciplinaryIncident, DisciplinaryAction,
    EmployeeDocument, EmployeeAsset,
    Resignation, ClearanceChecklist,
    AttendancePolicy, PayrollPolicy,
)
from app.schemas.hr import (
    EmploymentTypeCreate, EmploymentTypeUpdate, EmploymentTypeResponse,
    WorkLocationCreate, WorkLocationUpdate, WorkLocationResponse,
    ShiftCreate, ShiftUpdate, ShiftResponse,
    EmployeeCreate, EmployeeUpdate, EmployeeResponse,
    JobRequisitionCreate, JobRequisitionUpdate, JobRequisitionResponse,
    CandidateCreate, CandidateUpdate, CandidateResponse,
    InterviewCreate, InterviewUpdate, InterviewResponse,
    OfferLetterCreate, OfferLetterUpdate, OfferLetterResponse,
    OnboardingChecklistCreate, OnboardingChecklistUpdate, OnboardingChecklistResponse,
    OnboardingTaskCreate, OnboardingTaskResponse,
    AttendanceCreate, AttendanceUpdate, AttendanceResponse,
    OvertimeRequestCreate, OvertimeRequestUpdate, OvertimeRequestResponse,
    LeaveTypeCreate, LeaveTypeUpdate, LeaveTypeResponse,
    LeavePolicyCreate, LeavePolicyUpdate, LeavePolicyResponse,
    LeaveCreate, LeaveUpdate, LeaveResponse,
    LeaveBalanceCreate, LeaveBalanceUpdate, LeaveBalanceResponse,
    HolidayCreate, HolidayUpdate, HolidayResponse,
    SalaryComponentCreate, SalaryComponentUpdate, SalaryComponentResponse,
    SalaryStructureCreate, SalaryStructureUpdate, SalaryStructureResponse,
    SalaryStructureComponentCreate, SalaryStructureComponentResponse,
    PayrollCreate, PayrollUpdate, PayrollResponse,
    PayrollItemCreate, PayrollItemUpdate, PayrollItemResponse,
    LoanCreate, LoanUpdate, LoanResponse,
    LoanInstallmentCreate, LoanInstallmentResponse,
    BenefitPlanCreate, BenefitPlanUpdate, BenefitPlanResponse,
    EmployeeBenefitCreate, EmployeeBenefitUpdate, EmployeeBenefitResponse,
    KPICreate, KPIUpdate, KPIResponse,
    PerformanceReviewCreate, PerformanceReviewUpdate, PerformanceReviewResponse,
    AppraisalCreate, AppraisalUpdate, AppraisalResponse,
    TrainingCreate, TrainingUpdate, TrainingResponse,
    TrainingEnrollmentCreate, TrainingEnrollmentResponse,
    CertificationCreate, CertificationUpdate, CertificationResponse,
    DisciplinaryIncidentCreate, DisciplinaryIncidentUpdate, DisciplinaryIncidentResponse,
    DisciplinaryActionCreate, DisciplinaryActionUpdate, DisciplinaryActionResponse,
    EmployeeDocumentCreate, EmployeeDocumentUpdate, EmployeeDocumentResponse,
    EmployeeAssetCreate, EmployeeAssetUpdate, EmployeeAssetResponse,
    ResignationCreate, ResignationUpdate, ResignationResponse,
    ClearanceChecklistCreate, ClearanceChecklistUpdate, ClearanceChecklistResponse,
    AttendancePolicyCreate, AttendancePolicyUpdate, AttendancePolicyResponse,
    PayrollPolicyCreate, PayrollPolicyUpdate, PayrollPolicyResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/hr", tags=["Human Resources"])


# ═══════════════════════════════════════════════════════════════════════════════
# ORGANIZATION SETUP
# ═══════════════════════════════════════════════════════════════════════════════

# ── Employment Types ──

@router.get("/employment-types", response_model=PaginatedResponse)
async def list_employment_types(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(EmploymentType).where(
        EmploymentType.company_id == current_user.company_id,
        EmploymentType.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(EmploymentType).where(
        EmploymentType.company_id == current_user.company_id,
        EmploymentType.deleted_at.is_(None),
    )
    if search:
        query = query.where(EmploymentType.name.ilike(f"%{search}%"))
        count_query = count_query.where(EmploymentType.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(
        items=[EmploymentTypeResponse.model_validate(i) for i in items],
        total=total, page=page, per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/employment-types/{item_id}", response_model=ResponseModel)
async def get_employment_type(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmploymentType).where(EmploymentType.id == item_id, EmploymentType.company_id == current_user.company_id, EmploymentType.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employment type not found")
    return ResponseModel(data=EmploymentTypeResponse.model_validate(item))


@router.post("/employment-types", response_model=ResponseModel, status_code=201)
async def create_employment_type(data: EmploymentTypeCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = EmploymentType(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=EmploymentTypeResponse.model_validate(item))


@router.put("/employment-types/{item_id}", response_model=ResponseModel)
async def update_employment_type(item_id: int, data: EmploymentTypeUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmploymentType).where(EmploymentType.id == item_id, EmploymentType.company_id == current_user.company_id, EmploymentType.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employment type not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=EmploymentTypeResponse.model_validate(item))


@router.delete("/employment-types/{item_id}", response_model=ResponseModel)
async def delete_employment_type(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmploymentType).where(EmploymentType.id == item_id, EmploymentType.company_id == current_user.company_id, EmploymentType.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employment type not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Employment type deleted")


# ── Work Locations ──

@router.get("/work-locations", response_model=PaginatedResponse)
async def list_work_locations(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(WorkLocation).where(WorkLocation.company_id == current_user.company_id, WorkLocation.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(WorkLocation).where(WorkLocation.company_id == current_user.company_id, WorkLocation.deleted_at.is_(None))
    if search:
        query = query.where(WorkLocation.name.ilike(f"%{search}%"))
        count_query = count_query.where(WorkLocation.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[WorkLocationResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/work-locations/{item_id}", response_model=ResponseModel)
async def get_work_location(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(WorkLocation).where(WorkLocation.id == item_id, WorkLocation.company_id == current_user.company_id, WorkLocation.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Work location not found")
    return ResponseModel(data=WorkLocationResponse.model_validate(item))


@router.post("/work-locations", response_model=ResponseModel, status_code=201)
async def create_work_location(data: WorkLocationCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = WorkLocation(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=WorkLocationResponse.model_validate(item))


@router.put("/work-locations/{item_id}", response_model=ResponseModel)
async def update_work_location(item_id: int, data: WorkLocationUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(WorkLocation).where(WorkLocation.id == item_id, WorkLocation.company_id == current_user.company_id, WorkLocation.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Work location not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=WorkLocationResponse.model_validate(item))


@router.delete("/work-locations/{item_id}", response_model=ResponseModel)
async def delete_work_location(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(WorkLocation).where(WorkLocation.id == item_id, WorkLocation.company_id == current_user.company_id, WorkLocation.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Work location not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Work location deleted")


# ── Shifts ──

@router.get("/shifts", response_model=PaginatedResponse)
async def list_shifts(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(Shift).where(Shift.company_id == current_user.company_id, Shift.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(Shift).where(Shift.company_id == current_user.company_id, Shift.deleted_at.is_(None))
    if search:
        query = query.where(Shift.name.ilike(f"%{search}%"))
        count_query = count_query.where(Shift.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[ShiftResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/shifts/{item_id}", response_model=ResponseModel)
async def get_shift(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Shift).where(Shift.id == item_id, Shift.company_id == current_user.company_id, Shift.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Shift not found")
    return ResponseModel(data=ShiftResponse.model_validate(item))


@router.post("/shifts", response_model=ResponseModel, status_code=201)
async def create_shift(data: ShiftCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = Shift(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=ShiftResponse.model_validate(item))


@router.put("/shifts/{item_id}", response_model=ResponseModel)
async def update_shift(item_id: int, data: ShiftUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Shift).where(Shift.id == item_id, Shift.company_id == current_user.company_id, Shift.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Shift not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=ShiftResponse.model_validate(item))


@router.delete("/shifts/{item_id}", response_model=ResponseModel)
async def delete_shift(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Shift).where(Shift.id == item_id, Shift.company_id == current_user.company_id, Shift.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Shift not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Shift deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# EMPLOYEE MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/employees", response_model=PaginatedResponse)
async def list_employees(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
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
    if search:
        term = f"%{search}%"
        name_filter = User.full_name.ilike(term) | User.email.ilike(term) | Employee.employee_code.ilike(term) | Employee.designation.ilike(term)
        base = base.where(name_filter)
        count_q = count_q.where(name_filter)
    total = (await db.execute(count_q)).scalar() or 0
    base = base.order_by(Employee.id.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(base)
    rows = result.all()
    items = []
    for row in rows:
        emp, full_name, email, dept_name = row
        d = EmployeeResponse.model_validate(emp)
        d.first_name = (full_name or "").split(" ")[0] if full_name else None
        d.last_name = " ".join((full_name or "").split(" ")[1:]) if full_name and len(full_name.split(" ")) > 1 else None
        d.full_name = full_name
        d.email = email
        d.department_name = dept_name
        items.append(d)
    return PaginatedResponse(items=items, total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/employees/{item_id}", response_model=ResponseModel)
async def get_employee(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    q = (
        select(Employee, User.full_name, User.email, Department.name.label("dept_name"))
        .outerjoin(User, Employee.user_id == User.id)
        .outerjoin(Department, Employee.department_id == Department.id)
        .where(Employee.id == item_id, Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None))
    )
    result = await db.execute(q)
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Employee not found")
    emp, full_name, email, dept_name = row
    d = EmployeeResponse.model_validate(emp)
    d.first_name = (full_name or "").split(" ")[0] if full_name else None
    d.last_name = " ".join((full_name or "").split(" ")[1:]) if full_name and len(full_name.split(" ")) > 1 else None
    d.full_name = full_name
    d.email = email
    d.department_name = dept_name
    return ResponseModel(data=d)


@router.post("/employees", response_model=ResponseModel, status_code=201)
async def create_employee(data: EmployeeCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = Employee(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=EmployeeResponse.model_validate(item))


@router.put("/employees/{item_id}", response_model=ResponseModel)
async def update_employee(item_id: int, data: EmployeeUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Employee).where(Employee.id == item_id, Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employee not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=EmployeeResponse.model_validate(item))


@router.delete("/employees/{item_id}", response_model=ResponseModel)
async def delete_employee(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Employee).where(Employee.id == item_id, Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employee not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Employee deleted")


@router.post("/employees/{item_id}/check-in", response_model=ResponseModel)
async def employee_check_in(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Employee).where(Employee.id == item_id, Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None)))
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    now = datetime.utcnow()
    attendance = Attendance(company_id=current_user.company_id, employee_id=item_id, date=now, check_in=now, status="present", method="manual")
    db.add(attendance)
    await db.flush()
    await db.refresh(attendance)
    return ResponseModel(data=AttendanceResponse.model_validate(attendance))


@router.post("/employees/{item_id}/check-out", response_model=ResponseModel)
async def employee_check_out(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Attendance).where(Attendance.employee_id == item_id, Attendance.company_id == current_user.company_id, Attendance.check_out.is_(None)).order_by(Attendance.id.desc()))
    attendance = result.scalars().first()
    if not attendance:
        raise HTTPException(status_code=404, detail="No open check-in found")
    attendance.check_out = datetime.utcnow()
    await db.flush()
    await db.refresh(attendance)
    return ResponseModel(data=AttendanceResponse.model_validate(attendance))


# ═══════════════════════════════════════════════════════════════════════════════
# RECRUITMENT
# ═══════════════════════════════════════════════════════════════════════════════

# ── Job Requisitions ──

@router.get("/job-requisitions", response_model=PaginatedResponse)
async def list_job_requisitions(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(JobRequisition).where(JobRequisition.company_id == current_user.company_id, JobRequisition.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(JobRequisition).where(JobRequisition.company_id == current_user.company_id, JobRequisition.deleted_at.is_(None))
    if search:
        query = query.where(JobRequisition.title.ilike(f"%{search}%"))
        count_query = count_query.where(JobRequisition.title.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[JobRequisitionResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/job-requisitions/{item_id}", response_model=ResponseModel)
async def get_job_requisition(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(JobRequisition).where(JobRequisition.id == item_id, JobRequisition.company_id == current_user.company_id, JobRequisition.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Job requisition not found")
    return ResponseModel(data=JobRequisitionResponse.model_validate(item))


@router.post("/job-requisitions", response_model=ResponseModel, status_code=201)
async def create_job_requisition(data: JobRequisitionCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = JobRequisition(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=JobRequisitionResponse.model_validate(item))


@router.put("/job-requisitions/{item_id}", response_model=ResponseModel)
async def update_job_requisition(item_id: int, data: JobRequisitionUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(JobRequisition).where(JobRequisition.id == item_id, JobRequisition.company_id == current_user.company_id, JobRequisition.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Job requisition not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=JobRequisitionResponse.model_validate(item))


@router.delete("/job-requisitions/{item_id}", response_model=ResponseModel)
async def delete_job_requisition(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(JobRequisition).where(JobRequisition.id == item_id, JobRequisition.company_id == current_user.company_id, JobRequisition.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Job requisition not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Job requisition deleted")


# ── Candidates ──

@router.get("/candidates", response_model=PaginatedResponse)
async def list_candidates(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(Candidate).where(Candidate.company_id == current_user.company_id, Candidate.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(Candidate).where(Candidate.company_id == current_user.company_id, Candidate.deleted_at.is_(None))
    if search:
        query = query.where(Candidate.name.ilike(f"%{search}%"))
        count_query = count_query.where(Candidate.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[CandidateResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/candidates/{item_id}", response_model=ResponseModel)
async def get_candidate(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Candidate).where(Candidate.id == item_id, Candidate.company_id == current_user.company_id, Candidate.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return ResponseModel(data=CandidateResponse.model_validate(item))


@router.post("/candidates", response_model=ResponseModel, status_code=201)
async def create_candidate(data: CandidateCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = Candidate(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=CandidateResponse.model_validate(item))


@router.put("/candidates/{item_id}", response_model=ResponseModel)
async def update_candidate(item_id: int, data: CandidateUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Candidate).where(Candidate.id == item_id, Candidate.company_id == current_user.company_id, Candidate.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Candidate not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=CandidateResponse.model_validate(item))


@router.delete("/candidates/{item_id}", response_model=ResponseModel)
async def delete_candidate(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Candidate).where(Candidate.id == item_id, Candidate.company_id == current_user.company_id, Candidate.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Candidate not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Candidate deleted")


# ── Interviews ──

@router.get("/interviews", response_model=PaginatedResponse)
async def list_interviews(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, candidate_id: Optional[int] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(Interview).where(Interview.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(Interview).where(Interview.company_id == current_user.company_id)
    if candidate_id:
        query = query.where(Interview.candidate_id == candidate_id)
        count_query = count_query.where(Interview.candidate_id == candidate_id)
    if search:
        query = query.where(Interview.status.ilike(f"%{search}%"))
        count_query = count_query.where(Interview.status.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Interview.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[InterviewResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/interviews/{item_id}", response_model=ResponseModel)
async def get_interview(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Interview).where(Interview.id == item_id, Interview.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Interview not found")
    return ResponseModel(data=InterviewResponse.model_validate(item))


@router.post("/interviews", response_model=ResponseModel, status_code=201)
async def create_interview(data: InterviewCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = Interview(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=InterviewResponse.model_validate(item))


@router.put("/interviews/{item_id}", response_model=ResponseModel)
async def update_interview(item_id: int, data: InterviewUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Interview).where(Interview.id == item_id, Interview.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Interview not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=InterviewResponse.model_validate(item))


@router.delete("/interviews/{item_id}", response_model=ResponseModel)
async def delete_interview(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Interview).where(Interview.id == item_id, Interview.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Interview not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Interview deleted")


# ── Offer Letters ──

@router.get("/offer-letters", response_model=PaginatedResponse)
async def list_offer_letters(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, candidate_id: Optional[int] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(OfferLetter).where(OfferLetter.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(OfferLetter).where(OfferLetter.company_id == current_user.company_id)
    if candidate_id:
        query = query.where(OfferLetter.candidate_id == candidate_id)
        count_query = count_query.where(OfferLetter.candidate_id == candidate_id)
    if search:
        query = query.where(OfferLetter.position.ilike(f"%{search}%"))
        count_query = count_query.where(OfferLetter.position.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(OfferLetter.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[OfferLetterResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/offer-letters/{item_id}", response_model=ResponseModel)
async def get_offer_letter(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(OfferLetter).where(OfferLetter.id == item_id, OfferLetter.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Offer letter not found")
    return ResponseModel(data=OfferLetterResponse.model_validate(item))


@router.post("/offer-letters", response_model=ResponseModel, status_code=201)
async def create_offer_letter(data: OfferLetterCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = OfferLetter(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=OfferLetterResponse.model_validate(item))


@router.put("/offer-letters/{item_id}", response_model=ResponseModel)
async def update_offer_letter(item_id: int, data: OfferLetterUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(OfferLetter).where(OfferLetter.id == item_id, OfferLetter.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Offer letter not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=OfferLetterResponse.model_validate(item))


@router.delete("/offer-letters/{item_id}", response_model=ResponseModel)
async def delete_offer_letter(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(OfferLetter).where(OfferLetter.id == item_id, OfferLetter.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Offer letter not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Offer letter deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# ONBOARDING
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/onboarding-checklists", response_model=PaginatedResponse)
async def list_onboarding_checklists(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(OnboardingChecklist).where(OnboardingChecklist.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(OnboardingChecklist).where(OnboardingChecklist.company_id == current_user.company_id)
    if search:
        query = query.where(OnboardingChecklist.status.ilike(f"%{search}%"))
        count_query = count_query.where(OnboardingChecklist.status.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[OnboardingChecklistResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/onboarding-checklists/{item_id}", response_model=ResponseModel)
async def get_onboarding_checklist(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(OnboardingChecklist).options(selectinload(OnboardingChecklist.tasks)).where(OnboardingChecklist.id == item_id, OnboardingChecklist.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Onboarding checklist not found")
    return ResponseModel(data=OnboardingChecklistResponse.model_validate(item))


@router.post("/onboarding-checklists", response_model=ResponseModel, status_code=201)
async def create_onboarding_checklist(data: OnboardingChecklistCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    tasks_data = data.model_dump().pop("tasks", None) or []
    item = OnboardingChecklist(**data.model_dump(exclude={"tasks", "company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    for task_data in tasks_data:
        db.add(OnboardingTask(checklist_id=item.id, **task_data))
    await db.flush()
    result = await db.execute(select(OnboardingChecklist).options(selectinload(OnboardingChecklist.tasks)).where(OnboardingChecklist.id == item.id))
    item = result.scalar_one()
    return ResponseModel(data=OnboardingChecklistResponse.model_validate(item))


@router.put("/onboarding-checklists/{item_id}", response_model=ResponseModel)
async def update_onboarding_checklist(item_id: int, data: OnboardingChecklistUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(OnboardingChecklist).options(selectinload(OnboardingChecklist.tasks)).where(OnboardingChecklist.id == item_id, OnboardingChecklist.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Onboarding checklist not found")
    update_data = data.model_dump(exclude_unset=True)
    tasks_data = update_data.pop("tasks", None)
    for k, v in update_data.items():
        setattr(item, k, v)
    if tasks_data is not None:
        for existing_task in item.tasks:
            await db.delete(existing_task)
        for task_data in tasks_data:
            db.add(OnboardingTask(checklist_id=item.id, **task_data))
    await db.flush()
    result = await db.execute(select(OnboardingChecklist).options(selectinload(OnboardingChecklist.tasks)).where(OnboardingChecklist.id == item.id))
    item = result.scalar_one()
    return ResponseModel(data=OnboardingChecklistResponse.model_validate(item))


@router.delete("/onboarding-checklists/{item_id}", response_model=ResponseModel)
async def delete_onboarding_checklist(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(OnboardingChecklist).where(OnboardingChecklist.id == item_id, OnboardingChecklist.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Onboarding checklist not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Onboarding checklist deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# ATTENDANCE MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/attendance", response_model=PaginatedResponse)
async def list_attendance(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    base = (
        select(Attendance, User.full_name, Employee.employee_code)
        .outerjoin(Employee, Attendance.employee_id == Employee.id)
        .outerjoin(User, Employee.user_id == User.id)
        .where(Attendance.company_id == current_user.company_id)
    )
    count_q = select(sa_func.count()).select_from(Attendance).where(Attendance.company_id == current_user.company_id)
    if search:
        term = f"%{search}%"
        name_filter = User.full_name.ilike(term) | Employee.employee_code.ilike(term) | Attendance.status.ilike(term)
        base = base.where(name_filter)
        count_q = count_q.where(name_filter)
    total = (await db.execute(count_q)).scalar() or 0
    base = base.order_by(Attendance.date.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(base)
    rows = result.all()
    items = []
    for row in rows:
        att, full_name, emp_code = row
        d = AttendanceResponse.model_validate(att)
        d.employee_name = full_name
        d.employee_code = emp_code
        items.append(d)
    return PaginatedResponse(items=items, total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/attendance/{item_id}", response_model=ResponseModel)
async def get_attendance(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Attendance).where(Attendance.id == item_id, Attendance.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Attendance not found")
    return ResponseModel(data=AttendanceResponse.model_validate(item))


@router.post("/attendance", response_model=ResponseModel, status_code=201)
async def create_attendance(data: AttendanceCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = Attendance(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=AttendanceResponse.model_validate(item))


@router.put("/attendance/{item_id}", response_model=ResponseModel)
async def update_attendance(item_id: int, data: AttendanceUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Attendance).where(Attendance.id == item_id, Attendance.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Attendance not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=AttendanceResponse.model_validate(item))


@router.delete("/attendance/{item_id}", response_model=ResponseModel)
async def delete_attendance(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Attendance).where(Attendance.id == item_id, Attendance.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Attendance not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Attendance deleted")


# ── Overtime Requests ──

@router.get("/overtime-requests", response_model=PaginatedResponse)
async def list_overtime_requests(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(OvertimeRequest).where(OvertimeRequest.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(OvertimeRequest).where(OvertimeRequest.company_id == current_user.company_id)
    if search:
        query = query.where(OvertimeRequest.status.ilike(f"%{search}%"))
        count_query = count_query.where(OvertimeRequest.status.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(OvertimeRequest.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[OvertimeRequestResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/overtime-requests/{item_id}", response_model=ResponseModel)
async def get_overtime_request(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(OvertimeRequest).where(OvertimeRequest.id == item_id, OvertimeRequest.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Overtime request not found")
    return ResponseModel(data=OvertimeRequestResponse.model_validate(item))


@router.post("/overtime-requests", response_model=ResponseModel, status_code=201)
async def create_overtime_request(data: OvertimeRequestCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = OvertimeRequest(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=OvertimeRequestResponse.model_validate(item))


@router.put("/overtime-requests/{item_id}", response_model=ResponseModel)
async def update_overtime_request(item_id: int, data: OvertimeRequestUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(OvertimeRequest).where(OvertimeRequest.id == item_id, OvertimeRequest.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Overtime request not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=OvertimeRequestResponse.model_validate(item))


@router.delete("/overtime-requests/{item_id}", response_model=ResponseModel)
async def delete_overtime_request(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(OvertimeRequest).where(OvertimeRequest.id == item_id, OvertimeRequest.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Overtime request not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Overtime request deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# LEAVE MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

# ── Leave Types ──

@router.get("/leave-types", response_model=PaginatedResponse)
async def list_leave_types(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(LeaveType).where(LeaveType.company_id == current_user.company_id, LeaveType.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(LeaveType).where(LeaveType.company_id == current_user.company_id, LeaveType.deleted_at.is_(None))
    if search:
        query = query.where(LeaveType.name.ilike(f"%{search}%"))
        count_query = count_query.where(LeaveType.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[LeaveTypeResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/leave-types/{item_id}", response_model=ResponseModel)
async def get_leave_type(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(LeaveType).where(LeaveType.id == item_id, LeaveType.company_id == current_user.company_id, LeaveType.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Leave type not found")
    return ResponseModel(data=LeaveTypeResponse.model_validate(item))


@router.post("/leave-types", response_model=ResponseModel, status_code=201)
async def create_leave_type(data: LeaveTypeCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = LeaveType(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=LeaveTypeResponse.model_validate(item))


@router.put("/leave-types/{item_id}", response_model=ResponseModel)
async def update_leave_type(item_id: int, data: LeaveTypeUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(LeaveType).where(LeaveType.id == item_id, LeaveType.company_id == current_user.company_id, LeaveType.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Leave type not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=LeaveTypeResponse.model_validate(item))


@router.delete("/leave-types/{item_id}", response_model=ResponseModel)
async def delete_leave_type(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(LeaveType).where(LeaveType.id == item_id, LeaveType.company_id == current_user.company_id, LeaveType.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Leave type not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Leave type deleted")


# ── Leave Policies ──

@router.get("/leave-policies", response_model=PaginatedResponse)
async def list_leave_policies(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(LeavePolicy).where(LeavePolicy.company_id == current_user.company_id, LeavePolicy.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(LeavePolicy).where(LeavePolicy.company_id == current_user.company_id, LeavePolicy.deleted_at.is_(None))
    if search:
        query = query.where(LeavePolicy.name.ilike(f"%{search}%"))
        count_query = count_query.where(LeavePolicy.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[LeavePolicyResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/leave-policies/{item_id}", response_model=ResponseModel)
async def get_leave_policy(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(LeavePolicy).where(LeavePolicy.id == item_id, LeavePolicy.company_id == current_user.company_id, LeavePolicy.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Leave policy not found")
    return ResponseModel(data=LeavePolicyResponse.model_validate(item))


@router.post("/leave-policies", response_model=ResponseModel, status_code=201)
async def create_leave_policy(data: LeavePolicyCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = LeavePolicy(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=LeavePolicyResponse.model_validate(item))


@router.put("/leave-policies/{item_id}", response_model=ResponseModel)
async def update_leave_policy(item_id: int, data: LeavePolicyUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(LeavePolicy).where(LeavePolicy.id == item_id, LeavePolicy.company_id == current_user.company_id, LeavePolicy.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Leave policy not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=LeavePolicyResponse.model_validate(item))


@router.delete("/leave-policies/{item_id}", response_model=ResponseModel)
async def delete_leave_policy(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(LeavePolicy).where(LeavePolicy.id == item_id, LeavePolicy.company_id == current_user.company_id, LeavePolicy.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Leave policy not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Leave policy deleted")


# ── Leaves ──

@router.get("/leaves", response_model=PaginatedResponse)
async def list_leaves(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    base = (
        select(Leave, User.full_name, Employee.employee_code)
        .outerjoin(Employee, Leave.employee_id == Employee.id)
        .outerjoin(User, Employee.user_id == User.id)
        .where(Leave.company_id == current_user.company_id)
    )
    count_q = select(sa_func.count()).select_from(Leave).where(Leave.company_id == current_user.company_id)
    if search:
        term = f"%{search}%"
        name_filter = User.full_name.ilike(term) | Employee.employee_code.ilike(term) | Leave.status.ilike(term)
        base = base.where(name_filter)
        count_q = count_q.where(name_filter)
    total = (await db.execute(count_q)).scalar() or 0
    base = base.order_by(Leave.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(base)
    rows = result.all()
    items = []
    for row in rows:
        leave, full_name, emp_code = row
        d = LeaveResponse.model_validate(leave)
        d.employee_name = full_name
        d.employee_code = emp_code
        items.append(d)
    return PaginatedResponse(items=items, total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/leaves/{item_id}", response_model=ResponseModel)
async def get_leave(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Leave).where(Leave.id == item_id, Leave.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Leave not found")
    return ResponseModel(data=LeaveResponse.model_validate(item))


@router.post("/leaves", response_model=ResponseModel, status_code=201)
async def create_leave(data: LeaveCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    # Check gender restriction on leave type
    if data.leave_type_id:
        lt_result = await db.execute(select(LeaveType).where(LeaveType.id == data.leave_type_id, LeaveType.deleted_at.is_(None)))
        leave_type = lt_result.scalar_one_or_none()
        if leave_type and leave_type.gender_restriction:
            emp_result = await db.execute(select(Employee).where(Employee.id == data.employee_id, Employee.deleted_at.is_(None)))
            employee = emp_result.scalar_one_or_none()
            if employee and employee.gender != leave_type.gender_restriction:
                raise HTTPException(
                    status_code=400,
                    detail=f"{leave_type.name} is only available for {leave_type.gender_restriction} employees"
                )
    item = Leave(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=LeaveResponse.model_validate(item))


@router.put("/leaves/{item_id}", response_model=ResponseModel)
async def update_leave(item_id: int, data: LeaveUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Leave).where(Leave.id == item_id, Leave.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Leave not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=LeaveResponse.model_validate(item))


@router.delete("/leaves/{item_id}", response_model=ResponseModel)
async def delete_leave(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Leave).where(Leave.id == item_id, Leave.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Leave not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Leave deleted")


# ── Leave Balances ──

@router.get("/leave-balances", response_model=PaginatedResponse)
async def list_leave_balances(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(LeaveBalance).where(LeaveBalance.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(LeaveBalance).where(LeaveBalance.company_id == current_user.company_id)
    if search:
        query = query.where(LeaveBalance.type.ilike(f"%{search}%"))
        count_query = count_query.where(LeaveBalance.type.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[LeaveBalanceResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/leave-balances/{item_id}", response_model=ResponseModel)
async def get_leave_balance(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(LeaveBalance).where(LeaveBalance.id == item_id, LeaveBalance.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Leave balance not found")
    return ResponseModel(data=LeaveBalanceResponse.model_validate(item))


@router.post("/leave-balances", response_model=ResponseModel, status_code=201)
async def create_leave_balance(data: LeaveBalanceCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = LeaveBalance(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=LeaveBalanceResponse.model_validate(item))


@router.put("/leave-balances/{item_id}", response_model=ResponseModel)
async def update_leave_balance(item_id: int, data: LeaveBalanceUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(LeaveBalance).where(LeaveBalance.id == item_id, LeaveBalance.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Leave balance not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=LeaveBalanceResponse.model_validate(item))


@router.delete("/leave-balances/{item_id}", response_model=ResponseModel)
async def delete_leave_balance(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(LeaveBalance).where(LeaveBalance.id == item_id, LeaveBalance.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Leave balance not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Leave balance deleted")


# ── Holidays ──

@router.get("/holidays", response_model=PaginatedResponse)
async def list_holidays(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(Holiday).where(Holiday.company_id == current_user.company_id, Holiday.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(Holiday).where(Holiday.company_id == current_user.company_id, Holiday.deleted_at.is_(None))
    if search:
        query = query.where(Holiday.name.ilike(f"%{search}%"))
        count_query = count_query.where(Holiday.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[HolidayResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/holidays/{item_id}", response_model=ResponseModel)
async def get_holiday(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Holiday).where(Holiday.id == item_id, Holiday.company_id == current_user.company_id, Holiday.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Holiday not found")
    return ResponseModel(data=HolidayResponse.model_validate(item))


@router.post("/holidays", response_model=ResponseModel, status_code=201)
async def create_holiday(data: HolidayCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = Holiday(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=HolidayResponse.model_validate(item))


@router.put("/holidays/{item_id}", response_model=ResponseModel)
async def update_holiday(item_id: int, data: HolidayUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Holiday).where(Holiday.id == item_id, Holiday.company_id == current_user.company_id, Holiday.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Holiday not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=HolidayResponse.model_validate(item))


@router.delete("/holidays/{item_id}", response_model=ResponseModel)
async def delete_holiday(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Holiday).where(Holiday.id == item_id, Holiday.company_id == current_user.company_id, Holiday.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Holiday not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Holiday deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# PAYROLL MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

# ── Salary Components ──

@router.get("/salary-components", response_model=PaginatedResponse)
async def list_salary_components(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(SalaryComponent).where(SalaryComponent.company_id == current_user.company_id, SalaryComponent.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(SalaryComponent).where(SalaryComponent.company_id == current_user.company_id, SalaryComponent.deleted_at.is_(None))
    if search:
        query = query.where(SalaryComponent.name.ilike(f"%{search}%"))
        count_query = count_query.where(SalaryComponent.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[SalaryComponentResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/salary-components/{item_id}", response_model=ResponseModel)
async def get_salary_component(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(SalaryComponent).where(SalaryComponent.id == item_id, SalaryComponent.company_id == current_user.company_id, SalaryComponent.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Salary component not found")
    return ResponseModel(data=SalaryComponentResponse.model_validate(item))


@router.post("/salary-components", response_model=ResponseModel, status_code=201)
async def create_salary_component(data: SalaryComponentCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = SalaryComponent(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=SalaryComponentResponse.model_validate(item))


@router.put("/salary-components/{item_id}", response_model=ResponseModel)
async def update_salary_component(item_id: int, data: SalaryComponentUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(SalaryComponent).where(SalaryComponent.id == item_id, SalaryComponent.company_id == current_user.company_id, SalaryComponent.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Salary component not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=SalaryComponentResponse.model_validate(item))


@router.delete("/salary-components/{item_id}", response_model=ResponseModel)
async def delete_salary_component(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(SalaryComponent).where(SalaryComponent.id == item_id, SalaryComponent.company_id == current_user.company_id, SalaryComponent.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Salary component not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Salary component deleted")


# ── Salary Structures ──

@router.get("/salary-structures", response_model=PaginatedResponse)
async def list_salary_structures(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(SalaryStructure).where(SalaryStructure.company_id == current_user.company_id, SalaryStructure.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(SalaryStructure).where(SalaryStructure.company_id == current_user.company_id, SalaryStructure.deleted_at.is_(None))
    if search:
        query = query.where(SalaryStructure.name.ilike(f"%{search}%"))
        count_query = count_query.where(SalaryStructure.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[SalaryStructureResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/salary-structures/{item_id}", response_model=ResponseModel)
async def get_salary_structure(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(SalaryStructure).options(selectinload(SalaryStructure.components)).where(SalaryStructure.id == item_id, SalaryStructure.company_id == current_user.company_id, SalaryStructure.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Salary structure not found")
    return ResponseModel(data=SalaryStructureResponse.model_validate(item))


@router.post("/salary-structures", response_model=ResponseModel, status_code=201)
async def create_salary_structure(data: SalaryStructureCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    components_data = data.model_dump().pop("components", None) or []
    item = SalaryStructure(**data.model_dump(exclude={"components", "company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    for comp_data in components_data:
        db.add(SalaryStructureComponent(structure_id=item.id, **comp_data))
    await db.flush()
    result = await db.execute(select(SalaryStructure).options(selectinload(SalaryStructure.components)).where(SalaryStructure.id == item.id))
    item = result.scalar_one()
    return ResponseModel(data=SalaryStructureResponse.model_validate(item))


@router.put("/salary-structures/{item_id}", response_model=ResponseModel)
async def update_salary_structure(item_id: int, data: SalaryStructureUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(SalaryStructure).options(selectinload(SalaryStructure.components)).where(SalaryStructure.id == item_id, SalaryStructure.company_id == current_user.company_id, SalaryStructure.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Salary structure not found")
    update_data = data.model_dump(exclude_unset=True)
    components_data = update_data.pop("components", None)
    for k, v in update_data.items():
        setattr(item, k, v)
    if components_data is not None:
        for existing_comp in item.components:
            await db.delete(existing_comp)
        for comp_data in components_data:
            db.add(SalaryStructureComponent(structure_id=item.id, **comp_data))
    await db.flush()
    result = await db.execute(select(SalaryStructure).options(selectinload(SalaryStructure.components)).where(SalaryStructure.id == item.id))
    item = result.scalar_one()
    return ResponseModel(data=SalaryStructureResponse.model_validate(item))


@router.delete("/salary-structures/{item_id}", response_model=ResponseModel)
async def delete_salary_structure(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(SalaryStructure).where(SalaryStructure.id == item_id, SalaryStructure.company_id == current_user.company_id, SalaryStructure.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Salary structure not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Salary structure deleted")


# ── Payroll ──

@router.get("/payroll", response_model=PaginatedResponse)
async def list_payroll(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    base = (
        select(Payroll, User.full_name, Employee.employee_code)
        .outerjoin(Employee, Payroll.employee_id == Employee.id)
        .outerjoin(User, Employee.user_id == User.id)
        .options(selectinload(Payroll.items))
        .where(Payroll.company_id == current_user.company_id)
    )
    count_q = select(sa_func.count()).select_from(Payroll).where(Payroll.company_id == current_user.company_id)
    if search:
        term = f"%{search}%"
        name_filter = User.full_name.ilike(term) | Payroll.status.ilike(term)
        base = base.where(name_filter)
        count_q = count_q.where(name_filter)
    total = (await db.execute(count_q)).scalar() or 0
    base = base.order_by(Payroll.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(base)
    rows = result.all()
    items = []
    for row in rows:
        p, full_name, emp_code = row
        d = PayrollResponse.model_validate(p)
        d.employee_name = full_name
        d.employee_code = emp_code
        items.append(d)
    return PaginatedResponse(items=items, total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/payroll/{item_id}", response_model=ResponseModel)
async def get_payroll(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Payroll).options(selectinload(Payroll.items)).where(Payroll.id == item_id, Payroll.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Payroll not found")
    return ResponseModel(data=PayrollResponse.model_validate(item))


@router.post("/payroll", response_model=ResponseModel, status_code=201)
async def create_payroll(data: PayrollCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    items_data = data.model_dump().pop("items", None) or []
    item = Payroll(**data.model_dump(exclude={"items", "company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    for item_data in items_data:
        db.add(PayrollItem(payroll_id=item.id, **item_data))
    await db.flush()
    result = await db.execute(select(Payroll).options(selectinload(Payroll.items)).where(Payroll.id == item.id))
    item = result.scalar_one()
    return ResponseModel(data=PayrollResponse.model_validate(item))


@router.put("/payroll/{item_id}", response_model=ResponseModel)
async def update_payroll(item_id: int, data: PayrollUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Payroll).options(selectinload(Payroll.items)).where(Payroll.id == item_id, Payroll.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Payroll not found")
    update_data = data.model_dump(exclude_unset=True)
    items_data = update_data.pop("items", None)
    for k, v in update_data.items():
        setattr(item, k, v)
    if items_data is not None:
        for existing_item in item.items:
            await db.delete(existing_item)
        for item_data in items_data:
            db.add(PayrollItem(payroll_id=item.id, **item_data))
    await db.flush()
    result = await db.execute(select(Payroll).options(selectinload(Payroll.items)).where(Payroll.id == item.id))
    item = result.scalar_one()
    return ResponseModel(data=PayrollResponse.model_validate(item))


@router.delete("/payroll/{item_id}", response_model=ResponseModel)
async def delete_payroll(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Payroll).where(Payroll.id == item_id, Payroll.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Payroll not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Payroll deleted")


# ── Loans ──

@router.get("/loans", response_model=PaginatedResponse)
async def list_loans(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(Loan).where(Loan.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(Loan).where(Loan.company_id == current_user.company_id)
    if search:
        query = query.where(Loan.status.ilike(f"%{search}%"))
        count_query = count_query.where(Loan.status.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Loan.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[LoanResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/loans/{item_id}", response_model=ResponseModel)
async def get_loan(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Loan).options(selectinload(Loan.installments)).where(Loan.id == item_id, Loan.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Loan not found")
    return ResponseModel(data=LoanResponse.model_validate(item))


@router.post("/loans", response_model=ResponseModel, status_code=201)
async def create_loan(data: LoanCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    installments_data = data.model_dump().pop("installments", None) or []
    item = Loan(**data.model_dump(exclude={"installments", "company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    for inst_data in installments_data:
        db.add(LoanInstallment(loan_id=item.id, **inst_data))
    await db.flush()
    result = await db.execute(select(Loan).options(selectinload(Loan.installments)).where(Loan.id == item.id))
    item = result.scalar_one()
    return ResponseModel(data=LoanResponse.model_validate(item))


@router.put("/loans/{item_id}", response_model=ResponseModel)
async def update_loan(item_id: int, data: LoanUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Loan).options(selectinload(Loan.installments)).where(Loan.id == item_id, Loan.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Loan not found")
    update_data = data.model_dump(exclude_unset=True)
    installments_data = update_data.pop("installments", None)
    for k, v in update_data.items():
        setattr(item, k, v)
    if installments_data is not None:
        for existing_inst in item.installments:
            await db.delete(existing_inst)
        for inst_data in installments_data:
            db.add(LoanInstallment(loan_id=item.id, **inst_data))
    await db.flush()
    result = await db.execute(select(Loan).options(selectinload(Loan.installments)).where(Loan.id == item.id))
    item = result.scalar_one()
    return ResponseModel(data=LoanResponse.model_validate(item))


@router.delete("/loans/{item_id}", response_model=ResponseModel)
async def delete_loan(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Loan).where(Loan.id == item_id, Loan.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Loan not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Loan deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# BENEFITS MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/benefit-plans", response_model=PaginatedResponse)
async def list_benefit_plans(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(BenefitPlan).where(BenefitPlan.company_id == current_user.company_id, BenefitPlan.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(BenefitPlan).where(BenefitPlan.company_id == current_user.company_id, BenefitPlan.deleted_at.is_(None))
    if search:
        query = query.where(BenefitPlan.name.ilike(f"%{search}%"))
        count_query = count_query.where(BenefitPlan.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[BenefitPlanResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/benefit-plans/{item_id}", response_model=ResponseModel)
async def get_benefit_plan(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(BenefitPlan).where(BenefitPlan.id == item_id, BenefitPlan.company_id == current_user.company_id, BenefitPlan.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Benefit plan not found")
    return ResponseModel(data=BenefitPlanResponse.model_validate(item))


@router.post("/benefit-plans", response_model=ResponseModel, status_code=201)
async def create_benefit_plan(data: BenefitPlanCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = BenefitPlan(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=BenefitPlanResponse.model_validate(item))


@router.put("/benefit-plans/{item_id}", response_model=ResponseModel)
async def update_benefit_plan(item_id: int, data: BenefitPlanUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(BenefitPlan).where(BenefitPlan.id == item_id, BenefitPlan.company_id == current_user.company_id, BenefitPlan.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Benefit plan not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=BenefitPlanResponse.model_validate(item))


@router.delete("/benefit-plans/{item_id}", response_model=ResponseModel)
async def delete_benefit_plan(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(BenefitPlan).where(BenefitPlan.id == item_id, BenefitPlan.company_id == current_user.company_id, BenefitPlan.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Benefit plan not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Benefit plan deleted")


@router.get("/employee-benefits", response_model=PaginatedResponse)
async def list_employee_benefits(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(EmployeeBenefit).where(EmployeeBenefit.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(EmployeeBenefit).where(EmployeeBenefit.company_id == current_user.company_id)
    if search:
        query = query.where(EmployeeBenefit.status.ilike(f"%{search}%"))
        count_query = count_query.where(EmployeeBenefit.status.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[EmployeeBenefitResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/employee-benefits/{item_id}", response_model=ResponseModel)
async def get_employee_benefit(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmployeeBenefit).where(EmployeeBenefit.id == item_id, EmployeeBenefit.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employee benefit not found")
    return ResponseModel(data=EmployeeBenefitResponse.model_validate(item))


@router.post("/employee-benefits", response_model=ResponseModel, status_code=201)
async def create_employee_benefit(data: EmployeeBenefitCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = EmployeeBenefit(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=EmployeeBenefitResponse.model_validate(item))


@router.put("/employee-benefits/{item_id}", response_model=ResponseModel)
async def update_employee_benefit(item_id: int, data: EmployeeBenefitUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmployeeBenefit).where(EmployeeBenefit.id == item_id, EmployeeBenefit.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employee benefit not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=EmployeeBenefitResponse.model_validate(item))


@router.delete("/employee-benefits/{item_id}", response_model=ResponseModel)
async def delete_employee_benefit(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmployeeBenefit).where(EmployeeBenefit.id == item_id, EmployeeBenefit.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employee benefit not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Employee benefit deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# PERFORMANCE MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

# ── KPIs ──

@router.get("/kpis", response_model=PaginatedResponse)
async def list_kpis(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(KPI).where(KPI.company_id == current_user.company_id, KPI.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(KPI).where(KPI.company_id == current_user.company_id, KPI.deleted_at.is_(None))
    if search:
        query = query.where(KPI.name.ilike(f"%{search}%"))
        count_query = count_query.where(KPI.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[KPIResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/kpis/{item_id}", response_model=ResponseModel)
async def get_kpi(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(KPI).where(KPI.id == item_id, KPI.company_id == current_user.company_id, KPI.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="KPI not found")
    return ResponseModel(data=KPIResponse.model_validate(item))


@router.post("/kpis", response_model=ResponseModel, status_code=201)
async def create_kpi(data: KPICreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = KPI(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=KPIResponse.model_validate(item))


@router.put("/kpis/{item_id}", response_model=ResponseModel)
async def update_kpi(item_id: int, data: KPIUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(KPI).where(KPI.id == item_id, KPI.company_id == current_user.company_id, KPI.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="KPI not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=KPIResponse.model_validate(item))


@router.delete("/kpis/{item_id}", response_model=ResponseModel)
async def delete_kpi(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(KPI).where(KPI.id == item_id, KPI.company_id == current_user.company_id, KPI.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="KPI not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="KPI deleted")


# ── Performance Reviews ──

@router.get("/performance-reviews", response_model=PaginatedResponse)
async def list_performance_reviews(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(PerformanceReview).where(PerformanceReview.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(PerformanceReview).where(PerformanceReview.company_id == current_user.company_id)
    if search:
        query = query.where(PerformanceReview.status.ilike(f"%{search}%"))
        count_query = count_query.where(PerformanceReview.status.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(PerformanceReview.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[PerformanceReviewResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/performance-reviews/{item_id}", response_model=ResponseModel)
async def get_performance_review(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(PerformanceReview).where(PerformanceReview.id == item_id, PerformanceReview.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Performance review not found")
    return ResponseModel(data=PerformanceReviewResponse.model_validate(item))


@router.post("/performance-reviews", response_model=ResponseModel, status_code=201)
async def create_performance_review(data: PerformanceReviewCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = PerformanceReview(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=PerformanceReviewResponse.model_validate(item))


@router.put("/performance-reviews/{item_id}", response_model=ResponseModel)
async def update_performance_review(item_id: int, data: PerformanceReviewUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(PerformanceReview).where(PerformanceReview.id == item_id, PerformanceReview.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Performance review not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=PerformanceReviewResponse.model_validate(item))


@router.delete("/performance-reviews/{item_id}", response_model=ResponseModel)
async def delete_performance_review(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(PerformanceReview).where(PerformanceReview.id == item_id, PerformanceReview.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Performance review not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Performance review deleted")


# ── Appraisals ──

@router.get("/appraisals", response_model=PaginatedResponse)
async def list_appraisals(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(Appraisal).where(Appraisal.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(Appraisal).where(Appraisal.company_id == current_user.company_id)
    if search:
        query = query.where(Appraisal.status.ilike(f"%{search}%"))
        count_query = count_query.where(Appraisal.status.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Appraisal.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[AppraisalResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/appraisals/{item_id}", response_model=ResponseModel)
async def get_appraisal(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Appraisal).where(Appraisal.id == item_id, Appraisal.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Appraisal not found")
    return ResponseModel(data=AppraisalResponse.model_validate(item))


@router.post("/appraisals", response_model=ResponseModel, status_code=201)
async def create_appraisal(data: AppraisalCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = Appraisal(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=AppraisalResponse.model_validate(item))


@router.put("/appraisals/{item_id}", response_model=ResponseModel)
async def update_appraisal(item_id: int, data: AppraisalUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Appraisal).where(Appraisal.id == item_id, Appraisal.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Appraisal not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=AppraisalResponse.model_validate(item))


@router.delete("/appraisals/{item_id}", response_model=ResponseModel)
async def delete_appraisal(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Appraisal).where(Appraisal.id == item_id, Appraisal.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Appraisal not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Appraisal deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# TRAINING MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/trainings", response_model=PaginatedResponse)
async def list_trainings(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(Training).where(Training.company_id == current_user.company_id, Training.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(Training).where(Training.company_id == current_user.company_id, Training.deleted_at.is_(None))
    if search:
        query = query.where(Training.title.ilike(f"%{search}%"))
        count_query = count_query.where(Training.title.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[TrainingResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/trainings/{item_id}", response_model=ResponseModel)
async def get_training(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Training).options(selectinload(Training.enrollments)).where(Training.id == item_id, Training.company_id == current_user.company_id, Training.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Training not found")
    return ResponseModel(data=TrainingResponse.model_validate(item))


@router.post("/trainings", response_model=ResponseModel, status_code=201)
async def create_training(data: TrainingCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    enrollments_data = data.model_dump().pop("enrollments", None) or []
    item = Training(**data.model_dump(exclude={"enrollments", "company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    for enroll_data in enrollments_data:
        db.add(TrainingEnrollment(training_id=item.id, **enroll_data))
    await db.flush()
    result = await db.execute(select(Training).options(selectinload(Training.enrollments)).where(Training.id == item.id))
    item = result.scalar_one()
    return ResponseModel(data=TrainingResponse.model_validate(item))


@router.put("/trainings/{item_id}", response_model=ResponseModel)
async def update_training(item_id: int, data: TrainingUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Training).options(selectinload(Training.enrollments)).where(Training.id == item_id, Training.company_id == current_user.company_id, Training.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Training not found")
    update_data = data.model_dump(exclude_unset=True)
    enrollments_data = update_data.pop("enrollments", None)
    for k, v in update_data.items():
        setattr(item, k, v)
    if enrollments_data is not None:
        for existing_enrollment in item.enrollments:
            await db.delete(existing_enrollment)
        for enroll_data in enrollments_data:
            db.add(TrainingEnrollment(training_id=item.id, **enroll_data))
    await db.flush()
    result = await db.execute(select(Training).options(selectinload(Training.enrollments)).where(Training.id == item.id))
    item = result.scalar_one()
    return ResponseModel(data=TrainingResponse.model_validate(item))


@router.delete("/trainings/{item_id}", response_model=ResponseModel)
async def delete_training(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Training).where(Training.id == item_id, Training.company_id == current_user.company_id, Training.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Training not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Training deleted")


# ── Certifications ──

@router.get("/certifications", response_model=PaginatedResponse)
async def list_certifications(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(Certification).where(Certification.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(Certification).where(Certification.company_id == current_user.company_id)
    if search:
        query = query.where(Certification.name.ilike(f"%{search}%"))
        count_query = count_query.where(Certification.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Certification.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[CertificationResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/certifications/{item_id}", response_model=ResponseModel)
async def get_certification(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Certification).where(Certification.id == item_id, Certification.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Certification not found")
    return ResponseModel(data=CertificationResponse.model_validate(item))


@router.post("/certifications", response_model=ResponseModel, status_code=201)
async def create_certification(data: CertificationCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = Certification(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=CertificationResponse.model_validate(item))


@router.put("/certifications/{item_id}", response_model=ResponseModel)
async def update_certification(item_id: int, data: CertificationUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Certification).where(Certification.id == item_id, Certification.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Certification not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=CertificationResponse.model_validate(item))


@router.delete("/certifications/{item_id}", response_model=ResponseModel)
async def delete_certification(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Certification).where(Certification.id == item_id, Certification.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Certification not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Certification deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# DISCIPLINARY MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/disciplinary-incidents", response_model=PaginatedResponse)
async def list_disciplinary_incidents(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(DisciplinaryIncident).where(DisciplinaryIncident.company_id == current_user.company_id, DisciplinaryIncident.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(DisciplinaryIncident).where(DisciplinaryIncident.company_id == current_user.company_id, DisciplinaryIncident.deleted_at.is_(None))
    if search:
        query = query.where(DisciplinaryIncident.title.ilike(f"%{search}%"))
        count_query = count_query.where(DisciplinaryIncident.title.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[DisciplinaryIncidentResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/disciplinary-incidents/{item_id}", response_model=ResponseModel)
async def get_disciplinary_incident(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(DisciplinaryIncident).options(selectinload(DisciplinaryIncident.actions)).where(DisciplinaryIncident.id == item_id, DisciplinaryIncident.company_id == current_user.company_id, DisciplinaryIncident.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Disciplinary incident not found")
    return ResponseModel(data=DisciplinaryIncidentResponse.model_validate(item))


@router.post("/disciplinary-incidents", response_model=ResponseModel, status_code=201)
async def create_disciplinary_incident(data: DisciplinaryIncidentCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    actions_data = data.model_dump().pop("actions", None) or []
    item = DisciplinaryIncident(**data.model_dump(exclude={"actions", "company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    for action_data in actions_data:
        db.add(DisciplinaryAction(incident_id=item.id, **action_data))
    await db.flush()
    result = await db.execute(select(DisciplinaryIncident).options(selectinload(DisciplinaryIncident.actions)).where(DisciplinaryIncident.id == item.id))
    item = result.scalar_one()
    return ResponseModel(data=DisciplinaryIncidentResponse.model_validate(item))


@router.put("/disciplinary-incidents/{item_id}", response_model=ResponseModel)
async def update_disciplinary_incident(item_id: int, data: DisciplinaryIncidentUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(DisciplinaryIncident).options(selectinload(DisciplinaryIncident.actions)).where(DisciplinaryIncident.id == item_id, DisciplinaryIncident.company_id == current_user.company_id, DisciplinaryIncident.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Disciplinary incident not found")
    update_data = data.model_dump(exclude_unset=True)
    actions_data = update_data.pop("actions", None)
    for k, v in update_data.items():
        setattr(item, k, v)
    if actions_data is not None:
        for existing_action in item.actions:
            await db.delete(existing_action)
        for action_data in actions_data:
            db.add(DisciplinaryAction(incident_id=item.id, **action_data))
    await db.flush()
    result = await db.execute(select(DisciplinaryIncident).options(selectinload(DisciplinaryIncident.actions)).where(DisciplinaryIncident.id == item.id))
    item = result.scalar_one()
    return ResponseModel(data=DisciplinaryIncidentResponse.model_validate(item))


@router.delete("/disciplinary-incidents/{item_id}", response_model=ResponseModel)
async def delete_disciplinary_incident(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(DisciplinaryIncident).where(DisciplinaryIncident.id == item_id, DisciplinaryIncident.company_id == current_user.company_id, DisciplinaryIncident.deleted_at.is_(None)))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Disciplinary incident not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Disciplinary incident deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# EMPLOYEE DOCUMENTS & ASSETS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/employee-documents", response_model=PaginatedResponse)
async def list_employee_documents(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(EmployeeDocument).where(EmployeeDocument.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(EmployeeDocument).where(EmployeeDocument.company_id == current_user.company_id)
    if search:
        query = query.where(EmployeeDocument.doc_type.ilike(f"%{search}%"))
        count_query = count_query.where(EmployeeDocument.doc_type.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(EmployeeDocument.uploaded_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[EmployeeDocumentResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/employee-documents/{item_id}", response_model=ResponseModel)
async def get_employee_document(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmployeeDocument).where(EmployeeDocument.id == item_id, EmployeeDocument.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employee document not found")
    return ResponseModel(data=EmployeeDocumentResponse.model_validate(item))


@router.post("/employee-documents", response_model=ResponseModel, status_code=201)
async def create_employee_document(data: EmployeeDocumentCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = EmployeeDocument(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=EmployeeDocumentResponse.model_validate(item))


@router.put("/employee-documents/{item_id}", response_model=ResponseModel)
async def update_employee_document(item_id: int, data: EmployeeDocumentUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmployeeDocument).where(EmployeeDocument.id == item_id, EmployeeDocument.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employee document not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=EmployeeDocumentResponse.model_validate(item))


@router.delete("/employee-documents/{item_id}", response_model=ResponseModel)
async def delete_employee_document(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmployeeDocument).where(EmployeeDocument.id == item_id, EmployeeDocument.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employee document not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Employee document deleted")


@router.get("/employee-assets", response_model=PaginatedResponse)
async def list_employee_assets(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(EmployeeAsset).where(EmployeeAsset.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(EmployeeAsset).where(EmployeeAsset.company_id == current_user.company_id)
    if search:
        query = query.where(EmployeeAsset.name.ilike(f"%{search}%"))
        count_query = count_query.where(EmployeeAsset.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[EmployeeAssetResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/employee-assets/{item_id}", response_model=ResponseModel)
async def get_employee_asset(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmployeeAsset).where(EmployeeAsset.id == item_id, EmployeeAsset.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employee asset not found")
    return ResponseModel(data=EmployeeAssetResponse.model_validate(item))


@router.post("/employee-assets", response_model=ResponseModel, status_code=201)
async def create_employee_asset(data: EmployeeAssetCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = EmployeeAsset(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=EmployeeAssetResponse.model_validate(item))


@router.put("/employee-assets/{item_id}", response_model=ResponseModel)
async def update_employee_asset(item_id: int, data: EmployeeAssetUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmployeeAsset).where(EmployeeAsset.id == item_id, EmployeeAsset.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employee asset not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=EmployeeAssetResponse.model_validate(item))


@router.delete("/employee-assets/{item_id}", response_model=ResponseModel)
async def delete_employee_asset(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(EmployeeAsset).where(EmployeeAsset.id == item_id, EmployeeAsset.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Employee asset not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Employee asset deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# OFFBOARDING
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/resignations", response_model=PaginatedResponse)
async def list_resignations(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(Resignation).where(Resignation.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(Resignation).where(Resignation.company_id == current_user.company_id)
    if search:
        query = query.where(Resignation.status.ilike(f"%{search}%"))
        count_query = count_query.where(Resignation.status.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Resignation.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[ResignationResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/resignations/{item_id}", response_model=ResponseModel)
async def get_resignation(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Resignation).where(Resignation.id == item_id, Resignation.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Resignation not found")
    return ResponseModel(data=ResignationResponse.model_validate(item))


@router.post("/resignations", response_model=ResponseModel, status_code=201)
async def create_resignation(data: ResignationCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = Resignation(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=ResignationResponse.model_validate(item))


@router.put("/resignations/{item_id}", response_model=ResponseModel)
async def update_resignation(item_id: int, data: ResignationUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Resignation).where(Resignation.id == item_id, Resignation.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Resignation not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=ResignationResponse.model_validate(item))


@router.delete("/resignations/{item_id}", response_model=ResponseModel)
async def delete_resignation(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Resignation).where(Resignation.id == item_id, Resignation.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Resignation not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Resignation deleted")


@router.get("/clearance-checklists", response_model=PaginatedResponse)
async def list_clearance_checklists(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(ClearanceChecklist).join(Resignation).where(Resignation.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(ClearanceChecklist).join(Resignation).where(Resignation.company_id == current_user.company_id)
    if search:
        query = query.where(ClearanceChecklist.status.ilike(f"%{search}%"))
        count_query = count_query.where(ClearanceChecklist.status.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(ClearanceChecklist.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[ClearanceChecklistResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/clearance-checklists/{item_id}", response_model=ResponseModel)
async def get_clearance_checklist(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(ClearanceChecklist).where(ClearanceChecklist.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Clearance checklist not found")
    return ResponseModel(data=ClearanceChecklistResponse.model_validate(item))


@router.post("/clearance-checklists", response_model=ResponseModel, status_code=201)
async def create_clearance_checklist(data: ClearanceChecklistCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = ClearanceChecklist(**data.model_dump())
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=ClearanceChecklistResponse.model_validate(item))


@router.put("/clearance-checklists/{item_id}", response_model=ResponseModel)
async def update_clearance_checklist(item_id: int, data: ClearanceChecklistUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(ClearanceChecklist).where(ClearanceChecklist.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Clearance checklist not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=ClearanceChecklistResponse.model_validate(item))


@router.delete("/clearance-checklists/{item_id}", response_model=ResponseModel)
async def delete_clearance_checklist(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(ClearanceChecklist).where(ClearanceChecklist.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Clearance checklist not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Clearance checklist deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# HR SETTINGS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/attendance-policies", response_model=PaginatedResponse)
async def list_attendance_policies(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(AttendancePolicy).where(AttendancePolicy.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(AttendancePolicy).where(AttendancePolicy.company_id == current_user.company_id)
    if search:
        query = query.where(AttendancePolicy.name.ilike(f"%{search}%"))
        count_query = count_query.where(AttendancePolicy.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[AttendancePolicyResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/attendance-policies/{item_id}", response_model=ResponseModel)
async def get_attendance_policy(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(AttendancePolicy).where(AttendancePolicy.id == item_id, AttendancePolicy.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Attendance policy not found")
    return ResponseModel(data=AttendancePolicyResponse.model_validate(item))


@router.post("/attendance-policies", response_model=ResponseModel, status_code=201)
async def create_attendance_policy(data: AttendancePolicyCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = AttendancePolicy(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=AttendancePolicyResponse.model_validate(item))


@router.put("/attendance-policies/{item_id}", response_model=ResponseModel)
async def update_attendance_policy(item_id: int, data: AttendancePolicyUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(AttendancePolicy).where(AttendancePolicy.id == item_id, AttendancePolicy.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Attendance policy not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=AttendancePolicyResponse.model_validate(item))


@router.delete("/attendance-policies/{item_id}", response_model=ResponseModel)
async def delete_attendance_policy(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(AttendancePolicy).where(AttendancePolicy.id == item_id, AttendancePolicy.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Attendance policy not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Attendance policy deleted")


@router.get("/payroll-policies", response_model=PaginatedResponse)
async def list_payroll_policies(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), search: Optional[str] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    query = select(PayrollPolicy).where(PayrollPolicy.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(PayrollPolicy).where(PayrollPolicy.company_id == current_user.company_id)
    if search:
        query = query.where(PayrollPolicy.name.ilike(f"%{search}%"))
        count_query = count_query.where(PayrollPolicy.name.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[PayrollPolicyResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/payroll-policies/{item_id}", response_model=ResponseModel)
async def get_payroll_policy(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(PayrollPolicy).where(PayrollPolicy.id == item_id, PayrollPolicy.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Payroll policy not found")
    return ResponseModel(data=PayrollPolicyResponse.model_validate(item))


@router.post("/payroll-policies", response_model=ResponseModel, status_code=201)
async def create_payroll_policy(data: PayrollPolicyCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    item = PayrollPolicy(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=PayrollPolicyResponse.model_validate(item))


@router.put("/payroll-policies/{item_id}", response_model=ResponseModel)
async def update_payroll_policy(item_id: int, data: PayrollPolicyUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(PayrollPolicy).where(PayrollPolicy.id == item_id, PayrollPolicy.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Payroll policy not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=PayrollPolicyResponse.model_validate(item))


@router.delete("/payroll-policies/{item_id}", response_model=ResponseModel)
async def delete_payroll_policy(item_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(PayrollPolicy).where(PayrollPolicy.id == item_id, PayrollPolicy.company_id == current_user.company_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Payroll policy not found")
    await db.delete(item)
    await db.flush()
    return ResponseModel(message="Payroll policy deleted")


# ═══════════════════════════════════════════════════════════════════════════════
# DASHBOARD
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/dashboard", response_model=ResponseModel)
async def hr_dashboard(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    cid = current_user.company_id
    total_employees = (await db.execute(select(sa_func.count()).select_from(Employee).where(Employee.company_id == cid, Employee.deleted_at.is_(None)))).scalar() or 0
    active_employees = (await db.execute(select(sa_func.count()).select_from(Employee).where(Employee.company_id == cid, Employee.deleted_at.is_(None), Employee.status == "active"))).scalar() or 0
    on_leave = (await db.execute(select(sa_func.count()).select_from(Leave).where(Leave.company_id == cid, Leave.status == "approved"))).scalar() or 0
    today = datetime.utcnow().date()
    today_attendance = (await db.execute(select(sa_func.count()).select_from(Attendance).where(Attendance.company_id == cid, Attendance.date >= datetime.combine(today, datetime.min.time())))).scalar() or 0
    pending_approvals = (await db.execute(select(sa_func.count()).select_from(Leave).where(Leave.company_id == cid, Leave.status == "pending"))).scalar() or 0
    new_hires = (await db.execute(select(sa_func.count()).select_from(Employee).where(Employee.company_id == cid, Employee.deleted_at.is_(None), Employee.joining_date >= datetime.combine(today, datetime.min.time())))).scalar() or 0
    resignations = (await db.execute(select(sa_func.count()).select_from(Resignation).where(Resignation.company_id == cid, Resignation.status == "pending"))).scalar() or 0
    return ResponseModel(data={
        "total_employees": total_employees,
        "active_employees": active_employees,
        "on_leave": on_leave,
        "today_attendance": today_attendance,
        "pending_approvals": pending_approvals,
        "new_hires": new_hires,
        "resignations": resignations,
    })


# ═══════════════════════════════════════════════════════════════════════════════
# REPORTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/reports/employee-list", response_model=ResponseModel)
async def report_employee_list(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Employee).where(Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None)))
    items = result.scalars().all()
    return ResponseModel(data=[EmployeeResponse.model_validate(i).model_dump() for i in items])


@router.get("/reports/attendance-summary", response_model=ResponseModel)
async def report_attendance_summary(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Attendance).where(Attendance.company_id == current_user.company_id))
    items = result.scalars().all()
    return ResponseModel(data=[AttendanceResponse.model_validate(i).model_dump() for i in items])


@router.get("/reports/payroll-summary", response_model=ResponseModel)
async def report_payroll_summary(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Payroll).where(Payroll.company_id == current_user.company_id))
    items = result.scalars().all()
    return ResponseModel(data=[PayrollResponse.model_validate(i).model_dump() for i in items])


@router.get("/reports/leave-summary", response_model=ResponseModel)
async def report_leave_summary(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Leave).where(Leave.company_id == current_user.company_id))
    items = result.scalars().all()
    return ResponseModel(data=[LeaveResponse.model_validate(i).model_dump() for i in items])


# ═══════════════════════════════════════════════════════════════════════════════
# EMPLOYEE SELF-SERVICE (ESS)
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/ess/profile", response_model=ResponseModel)
async def ess_profile(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(select(Employee).where(Employee.user_id == current_user.id, Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None)))
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found")
    return ResponseModel(data=EmployeeResponse.model_validate(employee))


@router.get("/ess/attendance", response_model=PaginatedResponse)
async def ess_attendance(page: int = Query(1, ge=1), per_page: int = Query(25, ge=1, le=100), db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    emp_result = await db.execute(select(Employee).where(Employee.user_id == current_user.id, Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None)))
    employee = emp_result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    query = select(Attendance).where(Attendance.employee_id == employee.id, Attendance.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(Attendance).where(Attendance.employee_id == employee.id, Attendance.company_id == current_user.company_id)
    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(Attendance.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()
    return PaginatedResponse(items=[AttendanceResponse.model_validate(i) for i in items], total=total, page=page, per_page=per_page, pages=(total + per_page - 1) // per_page)


@router.get("/ess/leave-balance", response_model=ResponseModel)
async def ess_leave_balance(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    emp_result = await db.execute(select(Employee).where(Employee.user_id == current_user.id, Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None)))
    employee = emp_result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    result = await db.execute(select(LeaveBalance).where(LeaveBalance.employee_id == employee.id, LeaveBalance.company_id == current_user.company_id))
    items = result.scalars().all()
    return ResponseModel(data=[LeaveBalanceResponse.model_validate(i).model_dump() for i in items])


@router.get("/ess/payroll", response_model=ResponseModel)
async def ess_payroll(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    emp_result = await db.execute(select(Employee).where(Employee.user_id == current_user.id, Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None)))
    employee = emp_result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    result = await db.execute(select(Payroll).where(Payroll.employee_id == employee.id, Payroll.company_id == current_user.company_id))
    items = result.scalars().all()
    return ResponseModel(data=[PayrollResponse.model_validate(i).model_dump() for i in items])


@router.post("/ess/leave-request", response_model=ResponseModel, status_code=201)
async def ess_leave_request(data: LeaveCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    emp_result = await db.execute(select(Employee).where(Employee.user_id == current_user.id, Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None)))
    employee = emp_result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    item = Leave(**data.model_dump(exclude={"company_id", "employee_id"}), employee_id=employee.id, company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=LeaveResponse.model_validate(item))


@router.get("/ess/assets", response_model=ResponseModel)
async def ess_assets(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    emp_result = await db.execute(select(Employee).where(Employee.user_id == current_user.id, Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None)))
    employee = emp_result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    result = await db.execute(select(EmployeeAsset).where(EmployeeAsset.employee_id == employee.id, EmployeeAsset.company_id == current_user.company_id))
    items = result.scalars().all()
    return ResponseModel(data=[EmployeeAssetResponse.model_validate(i).model_dump() for i in items])


@router.get("/ess/documents", response_model=ResponseModel)
async def ess_documents(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    emp_result = await db.execute(select(Employee).where(Employee.user_id == current_user.id, Employee.company_id == current_user.company_id, Employee.deleted_at.is_(None)))
    employee = emp_result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    result = await db.execute(select(EmployeeDocument).where(EmployeeDocument.employee_id == employee.id, EmployeeDocument.company_id == current_user.company_id))
    items = result.scalars().all()
    return ResponseModel(data=[EmployeeDocumentResponse.model_validate(i).model_dump() for i in items])
