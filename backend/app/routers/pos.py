from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.dependencies.auth import require_company
from app.models.auth import User
from app.models.pos import (
    POSSession, POSSale, POSSaleItem, CashRegister, POSReceipt,
)
from app.schemas.pos import (
    POSSessionCreate, POSSessionUpdate, POSSessionResponse,
    POSSaleCreate, POSSaleUpdate, POSSaleResponse,
    POSSaleItemCreate, POSSaleItemResponse,
    CashRegisterCreate, CashRegisterUpdate, CashRegisterResponse,
    POSReceiptCreate, POSReceiptUpdate, POSReceiptResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/pos", tags=["Point of Sale"])


# ── POS Sessions ──

@router.get("/sessions", response_model=PaginatedResponse)
async def list_sessions(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(POSSession).where(
        POSSession.company_id == current_user.company_id,
    )
    count_query = select(sa_func.count()).select_from(POSSession).where(
        POSSession.company_id == current_user.company_id,
    )

    if status:
        query = query.where(POSSession.status == status)
        count_query = count_query.where(POSSession.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(POSSession.created_at.desc()).offset(
        (page - 1) * per_page
    ).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[POSSessionResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/sessions/{session_id}", response_model=ResponseModel)
async def get_session(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(POSSession).where(
        POSSession.id == session_id,
        POSSession.company_id == current_user.company_id,
    ))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="POS session not found")
    return ResponseModel(data=POSSessionResponse.model_validate(session))


@router.post("/sessions", response_model=ResponseModel, status_code=201)
async def create_session(
    data: POSSessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    session = POSSession(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(session)
    await db.flush()
    await db.refresh(session)
    return ResponseModel(data=POSSessionResponse.model_validate(session))


@router.put("/sessions/{session_id}", response_model=ResponseModel)
async def update_session(
    session_id: int,
    data: POSSessionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(POSSession).where(
        POSSession.id == session_id,
        POSSession.company_id == current_user.company_id,
    ))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="POS session not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(session, k, v)
    await db.flush()
    await db.refresh(session)
    return ResponseModel(data=POSSessionResponse.model_validate(session))


@router.delete("/sessions/{session_id}", response_model=ResponseModel)
async def delete_session(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(POSSession).where(
        POSSession.id == session_id,
        POSSession.company_id == current_user.company_id,
    ))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="POS session not found")
    session.status = "closed"
    session.closed_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="POS session closed")


# ── POS Sales (with items) ──

@router.get("/sales", response_model=PaginatedResponse)
async def list_pos_sales(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    session_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(POSSale).where(POSSale.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(POSSale).where(
        POSSale.company_id == current_user.company_id,
    )

    if search:
        query = query.where(POSSale.sale_number.ilike(f"%{search}%"))
        count_query = count_query.where(POSSale.sale_number.ilike(f"%{search}%"))

    if status:
        query = query.where(POSSale.status == status)
        count_query = count_query.where(POSSale.status == status)

    if session_id:
        query = query.where(POSSale.session_id == session_id)
        count_query = count_query.where(POSSale.session_id == session_id)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(POSSale.created_at.desc()).offset(
        (page - 1) * per_page
    ).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[POSSaleResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/sales/{sale_id}", response_model=ResponseModel)
async def get_pos_sale(
    sale_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(POSSale).where(
        POSSale.id == sale_id,
        POSSale.company_id == current_user.company_id,
    ))
    sale = result.scalar_one_or_none()
    if not sale:
        raise HTTPException(status_code=404, detail="POS sale not found")

    items_result = await db.execute(
        select(POSSaleItem).where(POSSaleItem.pos_sale_id == sale.id)
    )
    sale.items = items_result.scalars().all()

    return ResponseModel(data=POSSaleResponse.model_validate(sale))


@router.post("/sales", response_model=ResponseModel, status_code=201)
async def create_pos_sale(
    data: POSSaleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    items_data = data.items
    sale_data = data.model_dump(exclude={"items"})
    sale = POSSale(**sale_data, company_id=current_user.company_id)
    db.add(sale)
    await db.flush()
    await db.refresh(sale)

    for item_data in items_data:
        item = POSSaleItem(**item_data.model_dump(), pos_sale_id=sale.id)
        db.add(item)
    await db.flush()

    items_result = await db.execute(
        select(POSSaleItem).where(POSSaleItem.pos_sale_id == sale.id)
    )
    sale.items = items_result.scalars().all()

    return ResponseModel(data=POSSaleResponse.model_validate(sale))


@router.put("/sales/{sale_id}", response_model=ResponseModel)
async def update_pos_sale(
    sale_id: int,
    data: POSSaleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(POSSale).where(
        POSSale.id == sale_id,
        POSSale.company_id == current_user.company_id,
    ))
    sale = result.scalar_one_or_none()
    if not sale:
        raise HTTPException(status_code=404, detail="POS sale not found")

    update_data = data.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(sale, k, v)

    await db.flush()
    await db.refresh(sale)

    items_result = await db.execute(
        select(POSSaleItem).where(POSSaleItem.pos_sale_id == sale.id)
    )
    sale.items = items_result.scalars().all()

    return ResponseModel(data=POSSaleResponse.model_validate(sale))


@router.delete("/sales/{sale_id}", response_model=ResponseModel)
async def delete_pos_sale(
    sale_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(POSSale).where(
        POSSale.id == sale_id,
        POSSale.company_id == current_user.company_id,
    ))
    sale = result.scalar_one_or_none()
    if not sale:
        raise HTTPException(status_code=404, detail="POS sale not found")
    sale.status = "voided"
    await db.flush()
    return ResponseModel(message="POS sale voided")


# ── Cash Registers ──

@router.get("/cash-registers", response_model=PaginatedResponse)
async def list_cash_registers(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(CashRegister).where(
        CashRegister.company_id == current_user.company_id,
    )
    count_query = select(sa_func.count()).select_from(CashRegister).where(
        CashRegister.company_id == current_user.company_id,
    )

    if search:
        query = query.where(CashRegister.name.ilike(f"%{search}%"))
        count_query = count_query.where(CashRegister.name.ilike(f"%{search}%"))

    if status:
        query = query.where(CashRegister.status == status)
        count_query = count_query.where(CashRegister.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[CashRegisterResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/cash-registers/{register_id}", response_model=ResponseModel)
async def get_cash_register(
    register_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(CashRegister).where(
        CashRegister.id == register_id,
        CashRegister.company_id == current_user.company_id,
    ))
    register = result.scalar_one_or_none()
    if not register:
        raise HTTPException(status_code=404, detail="Cash register not found")
    return ResponseModel(data=CashRegisterResponse.model_validate(register))


@router.post("/cash-registers", response_model=ResponseModel, status_code=201)
async def create_cash_register(
    data: CashRegisterCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    register = CashRegister(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(register)
    await db.flush()
    await db.refresh(register)
    return ResponseModel(data=CashRegisterResponse.model_validate(register))


@router.put("/cash-registers/{register_id}", response_model=ResponseModel)
async def update_cash_register(
    register_id: int,
    data: CashRegisterUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(CashRegister).where(
        CashRegister.id == register_id,
        CashRegister.company_id == current_user.company_id,
    ))
    register = result.scalar_one_or_none()
    if not register:
        raise HTTPException(status_code=404, detail="Cash register not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(register, k, v)
    await db.flush()
    await db.refresh(register)
    return ResponseModel(data=CashRegisterResponse.model_validate(register))


@router.delete("/cash-registers/{register_id}", response_model=ResponseModel)
async def delete_cash_register(
    register_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(CashRegister).where(
        CashRegister.id == register_id,
        CashRegister.company_id == current_user.company_id,
    ))
    register = result.scalar_one_or_none()
    if not register:
        raise HTTPException(status_code=404, detail="Cash register not found")
    register.status = "inactive"
    await db.flush()
    return ResponseModel(message="Cash register deactivated")


# ── POS Receipts ──

@router.get("/receipts", response_model=PaginatedResponse)
async def list_receipts(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(POSReceipt).join(POSSale).where(
        POSSale.company_id == current_user.company_id,
    )
    count_query = select(sa_func.count()).select_from(POSReceipt).join(POSSale).where(
        POSSale.company_id == current_user.company_id,
    )

    if search:
        query = query.where(POSReceipt.receipt_number.ilike(f"%{search}%"))
        count_query = count_query.where(POSReceipt.receipt_number.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(POSReceipt.printed_at.desc()).offset(
        (page - 1) * per_page
    ).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[POSReceiptResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/receipts/{receipt_id}", response_model=ResponseModel)
async def get_receipt(
    receipt_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(POSReceipt)
        .join(POSSale)
        .where(
            POSReceipt.id == receipt_id,
            POSSale.company_id == current_user.company_id,
        )
    )
    receipt = result.scalar_one_or_none()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return ResponseModel(data=POSReceiptResponse.model_validate(receipt))


@router.post("/receipts", response_model=ResponseModel, status_code=201)
async def create_receipt(
    data: POSReceiptCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    receipt = POSReceipt(**data.model_dump())
    db.add(receipt)
    await db.flush()
    await db.refresh(receipt)
    return ResponseModel(data=POSReceiptResponse.model_validate(receipt))


@router.put("/receipts/{receipt_id}", response_model=ResponseModel)
async def update_receipt(
    receipt_id: int,
    data: POSReceiptUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(POSReceipt)
        .join(POSSale)
        .where(
            POSReceipt.id == receipt_id,
            POSSale.company_id == current_user.company_id,
        )
    )
    receipt = result.scalar_one_or_none()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(receipt, k, v)
    await db.flush()
    await db.refresh(receipt)
    return ResponseModel(data=POSReceiptResponse.model_validate(receipt))


@router.delete("/receipts/{receipt_id}", response_model=ResponseModel)
async def delete_receipt(
    receipt_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(POSReceipt)
        .join(POSSale)
        .where(
            POSReceipt.id == receipt_id,
            POSSale.company_id == current_user.company_id,
        )
    )
    receipt = result.scalar_one_or_none()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    await db.delete(receipt)
    await db.flush()
    return ResponseModel(message="Receipt deleted")
