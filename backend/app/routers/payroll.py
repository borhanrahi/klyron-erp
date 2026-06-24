import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional

from app.database import get_db
from app.dependencies.auth import require_company
from app.models.auth import User, Department
from app.models.hr import Employee, Payroll, PayrollItem
from app.schemas.common import ResponseModel

router = APIRouter(prefix="/hr/payroll-actions", tags=["Payroll Actions"])


@router.get("/template")
async def download_payroll_template(current_user: User = Depends(require_company)):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["employee_code", "bonus", "allowances", "deductions", "notes"])
    writer.writerow(["EMP-001", 500, 200, 0, "Performance bonus"])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=payroll_template.csv"}
    )


@router.get("/export")
async def export_payroll_csv(
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=2000, le=2099),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company)
):
    base = (
        select(Payroll, Employee.employee_code, Employee.salary)
        .outerjoin(Employee, Payroll.employee_id == Employee.id)
        .where(Payroll.company_id == current_user.company_id)
    )
    if month:
        base = base.where(Payroll.month == month)
    if year:
        base = base.where(Payroll.year == year)
    base = base.order_by(Payroll.id.desc())

    result = await db.execute(base)
    rows = result.all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "id", "employee_code", "employee_id", "month", "year",
        "base_salary", "allowances", "deductions", "tax", "bonus",
        "loan_deduction", "net_pay", "status", "paid_at"
    ])
    for payroll, emp_code, _ in rows:
        writer.writerow([
            payroll.id, emp_code or "", payroll.employee_id,
            payroll.month, payroll.year,
            float(payroll.base_salary or 0), float(payroll.allowances or 0),
            float(payroll.deductions or 0), float(payroll.tax or 0),
            float(payroll.bonus or 0), float(payroll.loan_deduction or 0),
            float(payroll.net_pay or 0), payroll.status,
            str(payroll.paid_at) if payroll.paid_at else ""
        ])

    output.seek(0)
    filename = f"payroll_export"
    if month and year:
        filename += f"_{year}_{month:02d}"
    filename += ".csv"

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.post("/upload")
async def upload_payroll_adjustments(
    file: UploadFile = File(...),
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000, le=2099),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    content = await file.read()
    decoded = content.decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))

    required_cols = ['employee_code', 'bonus']
    if not reader.fieldnames or not all(col in reader.fieldnames for col in required_cols):
        raise HTTPException(status_code=400, detail=f"CSV must contain columns: {required_cols}")

    results = {"processed": 0, "errors": []}

    for index, row in enumerate(reader):
        try:
            emp_result = await db.execute(
                select(Employee).where(
                    Employee.employee_code == row['employee_code'],
                    Employee.company_id == current_user.company_id
                )
            )
            employee = emp_result.scalar_one_or_none()
            if not employee:
                results["errors"].append(f"Row {index+2}: Employee {row['employee_code']} not found")
                continue

            payroll_result = await db.execute(
                select(Payroll).where(
                    Payroll.employee_id == employee.id,
                    Payroll.month == month,
                    Payroll.year == year,
                    Payroll.company_id == current_user.company_id
                )
            )
            payroll = payroll_result.scalar_one_or_none()

            bonus = float(row.get('bonus', 0) or 0)
            allowances = float(row.get('allowances', 0) or 0)
            deductions = float(row.get('deductions', 0) or 0)

            if payroll:
                payroll.bonus += bonus
                payroll.allowances += allowances
                payroll.deductions += deductions
                payroll.net_pay = (payroll.base_salary + payroll.allowances + payroll.bonus) - (payroll.deductions + payroll.tax + payroll.loan_deduction)
            else:
                new_payroll = Payroll(
                    company_id=current_user.company_id,
                    employee_id=employee.id,
                    month=month,
                    year=year,
                    base_salary=employee.salary,
                    bonus=bonus,
                    allowances=allowances,
                    deductions=deductions,
                    net_pay=(employee.salary + allowances + bonus) - deductions,
                    status="draft"
                )
                db.add(new_payroll)

            results["processed"] += 1
        except Exception as e:
            results["errors"].append(f"Row {index+2}: {str(e)}")

    return ResponseModel(data=results)


@router.post("/generate")
async def generate_payroll(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000, le=2099),
    employee_ids: Optional[str] = Query(None, description="Comma-separated employee IDs"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company)
):
    query = select(Employee).where(
        Employee.company_id == current_user.company_id,
        Employee.status == "active"
    )
    if employee_ids:
        id_list = [int(i.strip()) for i in employee_ids.split(",") if i.strip().isdigit()]
        if id_list:
            query = query.where(Employee.id.in_(id_list))

    result = await db.execute(query)
    employees = result.scalars().all()

    created = 0
    updated = 0

    for emp in employees:
        existing = await db.execute(
            select(Payroll).where(
                Payroll.employee_id == emp.id,
                Payroll.month == month,
                Payroll.year == year,
                Payroll.company_id == current_user.company_id
            )
        )
        payroll = existing.scalar_one_or_none()

        base = float(emp.salary or 0)

        if payroll:
            payroll.base_salary = base
            payroll.net_pay = (base + payroll.allowances + payroll.bonus) - (payroll.deductions + payroll.tax + payroll.loan_deduction)
            updated += 1
        else:
            new_payroll = Payroll(
                company_id=current_user.company_id,
                employee_id=emp.id,
                month=month,
                year=year,
                base_salary=base,
                net_pay=base,
                status="draft"
            )
            db.add(new_payroll)
            created += 1

    return ResponseModel(data={"created": created, "updated": updated})
