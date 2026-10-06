import base64
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func, cast, Date
from sqlalchemy.orm import selectinload
from datetime import datetime, date, timedelta
from typing import Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.dependencies.auth import require_company
from app.models.auth import User, Department, Role
from app.models.hr import (
    Employee, Attendance, Leave, LeaveBalance, LeaveType, Holiday,
    Payroll, PayrollItem, SalaryComponent, BenefitPlan, EmployeeBenefit,
    EmployeeDocument, EmployeeAsset, Training, TrainingEnrollment,
    KPI, PerformanceReview, Loan, LoanInstallment,
)
from app.models.support import Ticket
from app.schemas.common import PaginatedResponse, ResponseModel
from app.schemas.ess import (
    ESSDashboardData, ESSProfileUpdate, ESSBankUpdate,
    ESSCheckInRequest, ESSCheckOutRequest,
    ESSLeaveApply, ESSLeaveRequestResponse,
    ESSTrainingResponse, ESSTrainingEnrollmentResponse,
    ESSKPIResponse, ESSSelfAssessment,
    ESSLoanRequest, ESSAssetRequest, ESSDocumentRequest,
    ESSTicketCreate, ESSTicketResponse,
)

router = APIRouter(prefix="/ess", tags=["Employee Self-Service"])


async def _get_employee(db: AsyncSession, user: User) -> Employee:
    result = await db.execute(
        select(Employee).where(
            Employee.user_id == user.id,
            Employee.company_id == user.company_id,
            Employee.deleted_at.is_(None),
        )
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found. Please contact HR.")
    return employee


# ═══════════════════════════════════════════════════════════════════════════════
# ESS DASHBOARD
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/dashboard", response_model=ResponseModel)
async def ess_dashboard(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    today = date.today()

    # Today's attendance
    att_result = await db.execute(
        select(Attendance).where(
            Attendance.employee_id == employee.id,
            Attendance.company_id == current_user.company_id,
            cast(Attendance.date, Date) == today,
        )
    )
    today_att = att_result.scalar_one_or_none()
    att_data = None
    if today_att:
        wh = None
        if today_att.check_in and today_att.check_out:
            wh = round((today_att.check_out - today_att.check_in).total_seconds() / 3600, 2)
        att_data = {
            "check_in": str(today_att.check_in) if today_att.check_in else None,
            "check_out": str(today_att.check_out) if today_att.check_out else None,
            "status": today_att.status,
            "work_hours": wh,
        }

    # Leave balance total
    lb_result = await db.execute(
        select(sa_func.coalesce(sa_func.sum(LeaveBalance.remaining), 0)).where(
            LeaveBalance.employee_id == employee.id,
            LeaveBalance.company_id == current_user.company_id,
        )
    )
    leave_balance_total = lb_result.scalar() or 0

    # Pending leaves
    pl_result = await db.execute(
        select(sa_func.count()).select_from(Leave).where(
            Leave.employee_id == employee.id,
            Leave.company_id == current_user.company_id,
            Leave.status == "pending",
        )
    )
    pending_leaves = pl_result.scalar() or 0

    # Upcoming holidays (next 30 days)
    h_result = await db.execute(
        select(Holiday).where(
            Holiday.company_id == current_user.company_id,
            Holiday.date >= today,
            Holiday.date <= today + timedelta(days=30),
        ).order_by(Holiday.date).limit(5)
    )
    upcoming_holidays = [{"name": h.name, "date": str(h.date)} for h in h_result.scalars().all()]

    # Recent payslips
    p_result = await db.execute(
        select(Payroll).where(
            Payroll.employee_id == employee.id,
            Payroll.company_id == current_user.company_id,
        ).order_by(Payroll.created_at.desc()).limit(3)
    )
    recent_payslips = [
        {"month": p.month, "year": p.year, "net_pay": p.net_pay, "status": p.status}
        for p in p_result.scalars().all()
    ]

    # Assigned assets count
    aa_result = await db.execute(
        select(sa_func.count()).select_from(EmployeeAsset).where(
            EmployeeAsset.employee_id == employee.id,
            EmployeeAsset.company_id == current_user.company_id,
        )
    )
    assigned_assets_count = aa_result.scalar() or 0

    # Pending trainings
    pt_result = await db.execute(
        select(sa_func.count()).select_from(TrainingEnrollment).where(
            TrainingEnrollment.employee_id == employee.id,
            TrainingEnrollment.status != "completed",
        )
    )
    pending_trainings = pt_result.scalar() or 0

    dept_name = ""
    if employee.department_id:
        dept_result = await db.execute(select(Department.name).where(Department.id == employee.department_id))
        dept_name = dept_result.scalar_one_or_none() or ""

    data = ESSDashboardData(
        employee_name=current_user.full_name or "",
        department_name=dept_name,
        designation=employee.designation or "",
        today_attendance=att_data,
        leave_balance_total=leave_balance_total,
        pending_leaves=pending_leaves,
        upcoming_holidays=upcoming_holidays,
        recent_payslips=recent_payslips,
        assigned_assets_count=assigned_assets_count,
        pending_trainings=pending_trainings,
        unread_announcements=0,
    )
    return ResponseModel(data=data.model_dump())


# ═══════════════════════════════════════════════════════════════════════════════
# ESS PROFILE
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/profile", response_model=ResponseModel)
async def get_profile(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    from app.schemas.hr import EmployeeResponse
    d = EmployeeResponse.model_validate(employee)
    d.full_name = current_user.full_name
    d.email = current_user.email
    d.first_name = (current_user.full_name or "").split(" ")[0] if current_user.full_name else None
    d.last_name = " ".join((current_user.full_name or "").split(" ")[1:]) if current_user.full_name and len(current_user.full_name.split(" ")) > 1 else None
    if employee.department_id:
        dept_result = await db.execute(select(Department.name).where(Department.id == employee.department_id))
        d.department_name = dept_result.scalar_one_or_none()
    return ResponseModel(data=d)


@router.put("/profile", response_model=ResponseModel)
async def update_profile(data: ESSProfileUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    update_data = data.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(employee, k, v)
    await db.flush()
    await db.refresh(employee)
    from app.schemas.hr import EmployeeResponse
    return ResponseModel(data=EmployeeResponse.model_validate(employee))


@router.post("/profile/signature", response_model=ResponseModel)
async def upload_signature(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Upload employee signature (PNG/JPG) and store as base64 in DB."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (PNG, JPG)")

    content = await file.read()
    if len(content) > 2 * 1024 * 1024:  # 2MB limit
        raise HTTPException(status_code=400, detail="Image must be under 2MB")

    employee = await _get_employee(db, current_user)
    employee.signature_url = base64.b64encode(content).decode("utf-8")
    await db.flush()
    await db.refresh(employee)

    return ResponseModel(message="Signature uploaded successfully")


@router.delete("/profile/signature", response_model=ResponseModel)
async def delete_signature(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Remove employee signature."""
    employee = await _get_employee(db, current_user)
    employee.signature_url = None
    await db.flush()
    return ResponseModel(message="Signature removed")


@router.put("/profile/bank", response_model=ResponseModel)
async def update_bank_info(data: ESSBankUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    update_data = data.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(employee, k, v)
    await db.flush()
    await db.refresh(employee)
    from app.schemas.hr import EmployeeResponse
    return ResponseModel(data=EmployeeResponse.model_validate(employee))


# ═══════════════════════════════════════════════════════════════════════════════
# ESS ATTENDANCE
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/attendance/today", response_model=ResponseModel)
async def get_today_attendance(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    today = date.today()
    result = await db.execute(
        select(Attendance).where(
            Attendance.employee_id == employee.id,
            Attendance.company_id == current_user.company_id,
            cast(Attendance.date, Date) == today,
        )
    )
    att = result.scalar_one_or_none()
    if att:
        from app.schemas.hr import AttendanceResponse
        return ResponseModel(data=AttendanceResponse.model_validate(att))
    return ResponseModel(data=None, message="No attendance record today")


@router.post("/attendance/check-in", response_model=ResponseModel, status_code=201)
async def check_in(data: ESSCheckInRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    today = date.today()
    existing = await db.execute(
        select(Attendance).where(
            Attendance.employee_id == employee.id,
            Attendance.company_id == current_user.company_id,
            cast(Attendance.date, Date) == today,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already checked in today")
    att = Attendance(
        employee_id=employee.id,
        company_id=current_user.company_id,
        date=datetime.now(),
        check_in=datetime.now(),
        status="present",
        method=data.method or "manual",
        latitude=data.latitude,
        longitude=data.longitude,
        location_id=data.location_id,
        notes=data.notes,
    )
    db.add(att)
    await db.flush()
    await db.refresh(att)
    from app.schemas.hr import AttendanceResponse
    return ResponseModel(data=AttendanceResponse.model_validate(att), message="Checked in successfully")


@router.post("/attendance/check-out", response_model=ResponseModel)
async def check_out(data: ESSCheckOutRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    today = date.today()
    result = await db.execute(
        select(Attendance).where(
            Attendance.employee_id == employee.id,
            Attendance.company_id == current_user.company_id,
            cast(Attendance.date, Date) == today,
        )
    )
    att = result.scalar_one_or_none()
    if not att:
        raise HTTPException(status_code=400, detail="No check-in found for today")
    if att.check_out:
        raise HTTPException(status_code=400, detail="Already checked out today")
    att.check_out = datetime.now()
    if att.check_in:
        delta = att.check_out - att.check_in
        att.work_hours = round(delta.total_seconds() / 3600, 2)
    if data.notes:
        att.notes = data.notes
    await db.flush()
    await db.refresh(att)
    from app.schemas.hr import AttendanceResponse
    return ResponseModel(data=AttendanceResponse.model_validate(att), message="Checked out successfully")


@router.get("/attendance/history", response_model=PaginatedResponse)
async def attendance_history(
    page: int = Query(1, ge=1),
    per_page: int = Query(15, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    employee = await _get_employee(db, current_user)
    query = select(Attendance).where(
        Attendance.employee_id == employee.id,
        Attendance.company_id == current_user.company_id,
    ).order_by(Attendance.created_at.desc())
    count_q = select(sa_func.count()).select_from(Attendance).where(
        Attendance.employee_id == employee.id,
        Attendance.company_id == current_user.company_id,
    )
    total = (await db.execute(count_q)).scalar() or 0
    result = await db.execute(query.offset((page - 1) * per_page).limit(per_page))
    items = result.scalars().all()
    from app.schemas.hr import AttendanceResponse
    return PaginatedResponse(
        items=[AttendanceResponse.model_validate(i) for i in items],
        total=total, page=page, per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/attendance/summary", response_model=ResponseModel)
async def attendance_summary(
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    employee = await _get_employee(db, current_user)
    now = datetime.now()
    m = month or now.month
    y = year or now.year
    query = select(Attendance).where(
        Attendance.employee_id == employee.id,
        Attendance.company_id == current_user.company_id,
    )
    result = await db.execute(query)
    all_att = result.scalars().all()
    month_att = [a for a in all_att if a.date and a.date.month == m and a.date.year == y]
    total_days = len(month_att)
    present = sum(1 for a in month_att if a.status == "present")
    late = sum(1 for a in month_att if a.status == "late")
    absent = sum(1 for a in month_att if a.status == "absent")
    total_hours = 0.0
    for a in month_att:
        if a.check_in and a.check_out:
            total_hours += (a.check_out - a.check_in).total_seconds() / 3600
        elif a.ot_hours:
            total_hours += float(a.ot_hours)
    return ResponseModel(data={
        "month": m, "year": y,
        "total_days": total_days, "present": present, "late": late, "absent": absent,
        "total_hours": round(total_hours, 2),
        "avg_hours": round(total_hours / max(total_days, 1), 2),
    })


# ═══════════════════════════════════════════════════════════════════════════════
# ESS LEAVE
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/leave/balance", response_model=ResponseModel)
async def leave_balance(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    result = await db.execute(
        select(LeaveBalance).where(
            LeaveBalance.employee_id == employee.id,
            LeaveBalance.company_id == current_user.company_id,
        )
    )
    balances = result.scalars().all()
    # Also fetch leave type names
    data = []
    for b in balances:
        lt_result = await db.execute(select(LeaveType).where(LeaveType.id == b.leave_type_id))
        lt = lt_result.scalar_one_or_none()
        data.append({
            "id": b.id,
            "leave_type_id": b.leave_type_id,
            "leave_type_name": lt.name if lt else "Unknown",
            "entitled": b.entitled,
            "used": b.used,
            "remaining": b.remaining,
            "carried_forward": b.carried_forward or 0,
        })
    return ResponseModel(data=data)


@router.get("/leave/types", response_model=ResponseModel)
async def leave_types(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    result = await db.execute(
        select(LeaveType).where(
            LeaveType.company_id == current_user.company_id,
            LeaveType.is_active == True,
        )
    )
    items = result.scalars().all()
    return ResponseModel(data=[{"id": lt.id, "name": lt.name, "days_per_year": lt.days_per_year, "is_paid": lt.is_paid} for lt in items])


@router.post("/leave/apply", response_model=ResponseModel, status_code=201)
async def apply_leave(data: ESSLeaveApply, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    # Check gender restriction on leave type
    lt_result = await db.execute(select(LeaveType).where(LeaveType.id == data.leave_type_id, LeaveType.deleted_at.is_(None)))
    leave_type = lt_result.scalar_one_or_none()
    if leave_type and leave_type.gender_restriction:
        if employee.gender != leave_type.gender_restriction:
            raise HTTPException(
                status_code=400,
                detail=f"{leave_type.name} is only available for {leave_type.gender_restriction} employees"
            )
    leave = Leave(
        employee_id=employee.id,
        company_id=current_user.company_id,
        leave_type_id=data.leave_type_id,
        start_date=data.start_date,
        end_date=data.end_date,
        days=data.days,
        reason=data.reason,
        status="pending",
    )
    db.add(leave)
    await db.flush()
    await db.refresh(leave)
    from app.schemas.hr import LeaveResponse
    return ResponseModel(data=LeaveResponse.model_validate(leave), message="Leave request submitted")


@router.get("/leave/history", response_model=PaginatedResponse)
async def leave_history(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    employee = await _get_employee(db, current_user)
    query = select(Leave).where(
        Leave.employee_id == employee.id,
        Leave.company_id == current_user.company_id,
    ).order_by(Leave.created_at.desc())
    count_q = select(sa_func.count()).select_from(Leave).where(
        Leave.employee_id == employee.id,
        Leave.company_id == current_user.company_id,
    )
    total = (await db.execute(count_q)).scalar() or 0
    result = await db.execute(query.offset((page - 1) * per_page).limit(per_page))
    items = result.scalars().all()
    from app.schemas.hr import LeaveResponse
    return PaginatedResponse(
        items=[LeaveResponse.model_validate(i) for i in items],
        total=total, page=page, per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.delete("/leave/{leave_id}", response_model=ResponseModel)
async def cancel_leave(leave_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    result = await db.execute(
        select(Leave).where(
            Leave.id == leave_id,
            Leave.employee_id == employee.id,
            Leave.company_id == current_user.company_id,
        )
    )
    leave = result.scalar_one_or_none()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    if leave.status != "pending":
        raise HTTPException(status_code=400, detail="Can only cancel pending leaves")
    leave.status = "cancelled"
    await db.flush()
    return ResponseModel(message="Leave request cancelled")


# ═══════════════════════════════════════════════════════════════════════════════
# ESS PAYROLL
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/payroll/history", response_model=PaginatedResponse)
async def payroll_history(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    employee = await _get_employee(db, current_user)
    query = select(Payroll).where(
        Payroll.employee_id == employee.id,
        Payroll.company_id == current_user.company_id,
    ).order_by(Payroll.created_at.desc())
    count_q = select(sa_func.count()).select_from(Payroll).where(
        Payroll.employee_id == employee.id,
        Payroll.company_id == current_user.company_id,
    )
    total = (await db.execute(count_q)).scalar() or 0
    result = await db.execute(query.offset((page - 1) * per_page).limit(per_page))
    items = result.scalars().all()
    from app.schemas.hr import PayrollResponse
    return PaginatedResponse(
        items=[PayrollResponse.model_validate(i) for i in items],
        total=total, page=page, per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/payroll/{payroll_id}", response_model=ResponseModel)
async def payroll_detail(payroll_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    result = await db.execute(
        select(Payroll).where(
            Payroll.id == payroll_id,
            Payroll.employee_id == employee.id,
            Payroll.company_id == current_user.company_id,
        )
    )
    payroll = result.scalar_one_or_none()
    if not payroll:
        raise HTTPException(status_code=404, detail="Payroll record not found")

    # Get payroll items
    items_result = await db.execute(
        select(PayrollItem).where(PayrollItem.payroll_id == payroll.id)
    )
    items = items_result.scalars().all()

    from app.schemas.hr import PayrollResponse
    return ResponseModel(data={
        "payroll": PayrollResponse.model_validate(payroll).model_dump(),
        "items": [{"component_id": i.component_id, "amount": i.amount, "type": i.type} for i in items],
    })


# ═══════════════════════════════════════════════════════════════════════════════
# ESS BENEFITS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/benefits", response_model=ResponseModel)
async def my_benefits(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    result = await db.execute(
        select(EmployeeBenefit).where(
            EmployeeBenefit.employee_id == employee.id,
            EmployeeBenefit.company_id == current_user.company_id,
        )
    )
    benefits = result.scalars().all()
    data = []
    for b in benefits:
        bp_result = await db.execute(select(BenefitPlan).where(BenefitPlan.id == b.plan_id))
        bp = bp_result.scalar_one_or_none()
        data.append({
            "id": b.id,
            "plan_id": b.plan_id,
            "plan_name": bp.name if bp else "Unknown",
            "plan_type": bp.type if bp else None,
            "monthly_cost": float(bp.monthly_cost) if bp and bp.monthly_cost else None,
            "employee_contribution": float(bp.employee_contribution) if bp and bp.employee_contribution else None,
            "status": b.status,
        })
    return ResponseModel(data=data)


# ═══════════════════════════════════════════════════════════════════════════════
# ESS DOCUMENTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/documents", response_model=ResponseModel)
async def my_documents(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    result = await db.execute(
        select(EmployeeDocument).where(
            EmployeeDocument.employee_id == employee.id,
            EmployeeDocument.company_id == current_user.company_id,
        ).order_by(EmployeeDocument.uploaded_at.desc())
    )
    docs = result.scalars().all()
    return ResponseModel(data=[
        {
            "id": d.id, "title": d.title, "category": d.category,
            "file_url": d.file_url, "version": d.version,
            "uploaded_by": d.uploaded_by, "created_at": str(d.uploaded_at) if d.uploaded_at else None,
        }
        for d in docs
    ])


# ═══════════════════════════════════════════════════════════════════════════════
# ESS ASSETS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/assets", response_model=ResponseModel)
async def my_assets(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    result = await db.execute(
        select(EmployeeAsset).where(
            EmployeeAsset.employee_id == employee.id,
            EmployeeAsset.company_id == current_user.company_id,
        ).order_by(EmployeeAsset.assigned_at.desc())
    )
    assets = result.scalars().all()
    return ResponseModel(data=[
        {
            "id": a.id, "asset_name": a.name, "asset_type": a.asset_type,
            "serial_number": a.serial,
            "assigned_date": str(a.assigned_at) if a.assigned_at else None,
            "return_date": str(a.returned_at) if a.returned_at else None,
            "condition_at_assignment": a.condition_at_assignment,
            "condition_at_return": a.condition_at_return,
            "status": a.status,
        }
        for a in assets
    ])


# ═══════════════════════════════════════════════════════════════════════════════
# ESS TRAINING
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/trainings", response_model=ResponseModel)
async def my_trainings(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    result = await db.execute(
        select(TrainingEnrollment).where(
            TrainingEnrollment.employee_id == employee.id,
        ).order_by(TrainingEnrollment.id.desc())
    )
    enrollments = result.scalars().all()
    data = []
    for e in enrollments:
        t_result = await db.execute(select(Training).where(Training.id == e.training_id))
        t = t_result.scalar_one_or_none()
        data.append({
            "id": e.id, "training_id": e.training_id,
            "title": t.title if t else "Unknown",
            "description": t.description if t else None,
            "training_type": t.training_type if t else None,
            "duration_hours": t.duration_hours if t else None,
            "location": t.location if t else None,
            "status": e.status,
            "completion_date": str(e.completion_date) if e.completion_date else None,
            "score": e.score,
            "certificate_url": e.certificate_url,
        })
    return ResponseModel(data=data)


@router.put("/trainings/{enrollment_id}/complete", response_model=ResponseModel)
async def complete_training(enrollment_id: int, score: Optional[float] = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    result = await db.execute(
        select(TrainingEnrollment).where(
            TrainingEnrollment.id == enrollment_id,
            TrainingEnrollment.employee_id == employee.id,
        )
    )
    enrollment = result.scalar_one_or_none()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Training enrollment not found")
    enrollment.status = "completed"
    enrollment.completion_date = date.today()
    if score is not None:
        enrollment.score = score
    await db.flush()
    return ResponseModel(message="Training marked as completed")


# ═══════════════════════════════════════════════════════════════════════════════
# ESS PERFORMANCE
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/kpis", response_model=ResponseModel)
async def my_kpis(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    result = await db.execute(
        select(KPI).where(
            KPI.employee_id == employee.id,
            KPI.company_id == current_user.company_id,
        ).order_by(KPI.created_at.desc())
    )
    kpis = result.scalars().all()
    return ResponseModel(data=[
        {
            "id": k.id, "title": k.name, "description": k.description,
            "target_value": k.target_value, "actual_value": k.actual_value,
            "weight": k.weight, "period": k.period, "status": k.status,
        }
        for k in kpis
    ])


@router.get("/reviews", response_model=ResponseModel)
async def my_reviews(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    result = await db.execute(
        select(PerformanceReview).where(
            PerformanceReview.employee_id == employee.id,
            PerformanceReview.company_id == current_user.company_id,
        ).order_by(PerformanceReview.created_at.desc())
    )
    reviews = result.scalars().all()
    return ResponseModel(data=[
        {
            "id": r.id, "review_type": r.review_type, "period": r.period,
            "rating": float(r.rating) if r.rating else None,
            "feedback": r.feedback, "self_assessment": r.self_assessment,
            "status": r.status,
        }
        for r in reviews
    ])


@router.put("/reviews/{review_id}/self-assessment", response_model=ResponseModel)
async def submit_self_assessment(review_id: int, data: ESSSelfAssessment, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    result = await db.execute(
        select(PerformanceReview).where(
            PerformanceReview.id == review_id,
            PerformanceReview.employee_id == employee.id,
        )
    )
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.self_assessment = data.self_comments
    review.status = "self_assessed"
    await db.flush()
    return ResponseModel(message="Self-assessment submitted")


# ═══════════════════════════════════════════════════════════════════════════════
# ESS REQUESTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/requests/loan", response_model=ResponseModel, status_code=201)
async def request_loan(data: ESSLoanRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    loan = Loan(
        employee_id=employee.id,
        company_id=current_user.company_id,
        type=data.loan_type,
        amount=data.amount,
        remaining=data.amount,
        reason=data.reason,
        status="pending",
    )
    db.add(loan)
    await db.flush()
    await db.refresh(loan)

    # Create workflow instance for approval chain
    from app.models.workflow import Workflow, WorkflowStep, WorkflowInstance, WorkflowApproval
    # Find active workflow for loan entity type
    wf_result = await db.execute(
        select(Workflow)
        .options(selectinload(Workflow.steps))
        .where(
            Workflow.company_id == current_user.company_id,
            Workflow.entity_type == "loan",
            Workflow.is_active == True,
            Workflow.deleted_at.is_(None),
        )
        .order_by(Workflow.created_at.desc())
        .limit(1)
    )
    workflow = wf_result.scalars().unique().first()

    if workflow and workflow.steps:
        # Create workflow instance
        instance = WorkflowInstance(
            company_id=current_user.company_id,
            workflow_id=workflow.id,
            entity_type="loan",
            entity_id=loan.id,
            status="pending",
            created_by=current_user.id,
        )
        db.add(instance)
        await db.flush()
        await db.refresh(instance)

        # Create approval steps
        sorted_steps = sorted(workflow.steps, key=lambda s: s.step_order)
        for step in sorted_steps:
            # Determine approver_id based on step.approver_type
            approver_id = None
            if step.approver_type == "supervisor" and employee.reporting_to:
                # Find user linked to the supervisor employee
                sup_result = await db.execute(
                    select(User.id).where(User.id == select(Employee.user_id).where(
                        Employee.id == employee.reporting_to
                    ).scalar_subquery())
                )
                approver_id = sup_result.scalar_one_or_none()
            elif step.approver_type == "role" and step.approver_id:
                # Find users with this role
                role_user_result = await db.execute(
                    select(User.id).where(
                        User.role_id == step.approver_id,
                        User.company_id == current_user.company_id,
                        User.deleted_at.is_(None),
                    ).limit(1)
                )
                approver_id = role_user_result.scalar_one_or_none()
            elif step.approver_type == "hr":
                role_result = await db.execute(
                    select(Role.id).where(Role.name == "HR Manager", Role.company_id == current_user.company_id).limit(1)
                )
                hr_role_id = role_result.scalar_one_or_none()
                if hr_role_id:
                    hr_user_result = await db.execute(
                        select(User.id).where(
                            User.role_id == hr_role_id,
                            User.company_id == current_user.company_id,
                            User.deleted_at.is_(None),
                        ).limit(1)
                    )
                    approver_id = hr_user_result.scalar_one_or_none()
            elif step.approver_type == "finance":
                role_result = await db.execute(
                    select(Role.id).where(Role.name == "Finance Manager", Role.company_id == current_user.company_id).limit(1)
                )
                fin_role_id = role_result.scalar_one_or_none()
                if fin_role_id:
                    fin_user_result = await db.execute(
                        select(User.id).where(
                            User.role_id == fin_role_id,
                            User.company_id == current_user.company_id,
                            User.deleted_at.is_(None),
                        ).limit(1)
                    )
                    approver_id = fin_user_result.scalar_one_or_none()
            elif step.approver_type == "manager":
                # Find the employee's department manager
                if employee.department_id:
                    mgr_result = await db.execute(
                        select(User.id).join(Employee, Employee.user_id == User.id).where(
                            Employee.department_id == employee.department_id,
                            Employee.id != employee.id,
                            Employee.company_id == current_user.company_id,
                            Employee.deleted_at.is_(None),
                        ).limit(1)
                    )
                    approver_id = mgr_result.scalar_one_or_none()

            approval = WorkflowApproval(
                instance_id=instance.id,
                step_id=step.id,
                approver_id=approver_id,
                status="pending",
            )
            db.add(approval)
        await db.flush()

    from app.schemas.hr import LoanResponse
    from app.models.auth import Role
    return ResponseModel(data=LoanResponse.model_validate(loan), message="Loan request submitted for approval")


@router.get("/requests/history", response_model=ResponseModel)
async def request_history(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    result = await db.execute(
        select(Loan).where(
            Loan.employee_id == employee.id,
            Loan.company_id == current_user.company_id,
        ).order_by(Loan.created_at.desc())
    )
    loans = result.scalars().all()
    return ResponseModel(data=[
        {
            "id": l.id, "loan_type": l.type, "amount": float(l.amount) if l.amount else 0,
            "reason": l.reason, "status": l.status,
            "created_at": str(l.created_at) if l.created_at else None,
        }
        for l in loans
    ])


# ═══════════════════════════════════════════════════════════════════════════════
# ESS SUPPORT
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/support/tickets", response_model=ResponseModel)
async def my_tickets(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    employee = await _get_employee(db, current_user)
    result = await db.execute(
        select(Ticket).where(
            Ticket.requester_id == current_user.id,
            Ticket.company_id == current_user.company_id,
        ).order_by(Ticket.created_at.desc())
    )
    tickets = result.scalars().all()
    return ResponseModel(data=[
        {
            "id": t.id, "ticket_number": t.ticket_number, "subject": t.subject,
            "category": t.category, "priority": t.priority, "status": t.status,
            "created_at": str(t.created_at) if t.created_at else None,
        }
        for t in tickets
    ])


@router.post("/support/tickets", response_model=ResponseModel, status_code=201)
async def create_ticket(data: ESSTicketCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_company)):
    import uuid
    ticket = Ticket(
        ticket_number=f"TKT-{uuid.uuid4().hex[:8].upper()}",
        subject=data.subject,
        category=data.category,
        priority=data.priority,
        status="open",
        company_id=current_user.company_id,
        requester_id=current_user.id,
    )
    db.add(ticket)
    await db.flush()
    await db.refresh(ticket)
    return ResponseModel(data={
        "id": ticket.id, "ticket_number": ticket.ticket_number, "subject": ticket.subject, "status": ticket.status,
    }, message="Ticket created")
