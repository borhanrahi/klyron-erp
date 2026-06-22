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
from app.models.procurement import (
    Supplier, PurchaseRequisition, PRItem,
    PurchaseOrder, POItem, GRN, GRNItem, SupplierPayment,
)
from app.schemas.procurement import (
    SupplierCreate, SupplierUpdate, SupplierResponse,
    PurchaseRequisitionCreate, PurchaseRequisitionUpdate, PurchaseRequisitionResponse,
    PRItemCreate, PRItemResponse,
    PurchaseOrderCreate, PurchaseOrderUpdate, PurchaseOrderResponse,
    POItemCreate, POItemResponse,
    GRNCreate, GRNUpdate, GRNResponse,
    GRNItemCreate, GRNItemResponse,
    SupplierPaymentCreate, SupplierPaymentUpdate, SupplierPaymentResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/procurement", tags=["Procurement"])


# ── Suppliers ──

@router.get("/suppliers", response_model=PaginatedResponse)
async def list_suppliers(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Supplier).where(
        Supplier.company_id == current_user.company_id,
        Supplier.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Supplier).where(
        Supplier.company_id == current_user.company_id,
        Supplier.deleted_at.is_(None),
    )

    if search:
        query = query.where(Supplier.name.ilike(f"%{search}%"))
        count_query = count_query.where(Supplier.name.ilike(f"%{search}%"))

    if status:
        query = query.where(Supplier.status == status)
        count_query = count_query.where(Supplier.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[SupplierResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/suppliers/{supplier_id}", response_model=ResponseModel)
async def get_supplier(
    supplier_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Supplier).where(
        Supplier.id == supplier_id,
        Supplier.company_id == current_user.company_id,
        Supplier.deleted_at.is_(None),
    ))
    supplier = result.scalar_one_or_none()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return ResponseModel(data=SupplierResponse.model_validate(supplier))


@router.post("/suppliers", response_model=ResponseModel, status_code=201)
async def create_supplier(
    data: SupplierCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    supplier = Supplier(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(supplier)
    await db.flush()
    await db.refresh(supplier)
    return ResponseModel(data=SupplierResponse.model_validate(supplier))


@router.put("/suppliers/{supplier_id}", response_model=ResponseModel)
async def update_supplier(
    supplier_id: int,
    data: SupplierUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Supplier).where(
        Supplier.id == supplier_id,
        Supplier.company_id == current_user.company_id,
        Supplier.deleted_at.is_(None),
    ))
    supplier = result.scalar_one_or_none()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(supplier, k, v)
    await db.flush()
    await db.refresh(supplier)
    return ResponseModel(data=SupplierResponse.model_validate(supplier))


@router.delete("/suppliers/{supplier_id}", response_model=ResponseModel)
async def delete_supplier(
    supplier_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Supplier).where(
        Supplier.id == supplier_id,
        Supplier.company_id == current_user.company_id,
        Supplier.deleted_at.is_(None),
    ))
    supplier = result.scalar_one_or_none()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    supplier.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Supplier deleted")


# ── Purchase Requisitions (with items) ──

@router.get("/requisitions", response_model=PaginatedResponse)
async def list_requisitions(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(PurchaseRequisition).options(selectinload(PurchaseRequisition.items)).where(
        PurchaseRequisition.company_id == current_user.company_id,
    )
    count_query = select(sa_func.count()).select_from(PurchaseRequisition).where(
        PurchaseRequisition.company_id == current_user.company_id,
    )

    if search:
        query = query.where(PurchaseRequisition.pr_number.ilike(f"%{search}%"))
        count_query = count_query.where(PurchaseRequisition.pr_number.ilike(f"%{search}%"))

    if status:
        query = query.where(PurchaseRequisition.status == status)
        count_query = count_query.where(PurchaseRequisition.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[PurchaseRequisitionResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/requisitions/{requisition_id}", response_model=ResponseModel)
async def get_requisition(
    requisition_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(PurchaseRequisition)
        .where(
            PurchaseRequisition.id == requisition_id,
            PurchaseRequisition.company_id == current_user.company_id,
        )
    )
    pr = result.scalar_one_or_none()
    if not pr:
        raise HTTPException(status_code=404, detail="Purchase requisition not found")

    items_result = await db.execute(
        select(PRItem).where(PRItem.pr_id == pr.id)
    )
    pr.items = items_result.scalars().all()

    return ResponseModel(data=PurchaseRequisitionResponse.model_validate(pr))


@router.post("/requisitions", response_model=ResponseModel, status_code=201)
async def create_requisition(
    data: PurchaseRequisitionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    items_data = data.items
    pr_data = data.model_dump(exclude={"items"})
    pr = PurchaseRequisition(**pr_data, company_id=current_user.company_id)
    db.add(pr)
    await db.flush()
    await db.refresh(pr)

    for item_data in items_data:
        item = PRItem(**item_data.model_dump(), pr_id=pr.id)
        db.add(item)
    await db.flush()

    items_result = await db.execute(select(PRItem).where(PRItem.pr_id == pr.id))
    pr.items = items_result.scalars().all()

    return ResponseModel(data=PurchaseRequisitionResponse.model_validate(pr))


@router.put("/requisitions/{requisition_id}", response_model=ResponseModel)
async def update_requisition(
    requisition_id: int,
    data: PurchaseRequisitionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(PurchaseRequisition).where(
            PurchaseRequisition.id == requisition_id,
            PurchaseRequisition.company_id == current_user.company_id,
        )
    )
    pr = result.scalar_one_or_none()
    if not pr:
        raise HTTPException(status_code=404, detail="Purchase requisition not found")

    update_data = data.model_dump(exclude_unset=True, exclude={"items"})
    for k, v in update_data.items():
        setattr(pr, k, v)

    if data.items is not None:
        from sqlalchemy import delete as sa_delete
        await db.execute(sa_delete(PRItem).where(PRItem.pr_id == pr.id))
        for item_data in data.items:
            item = PRItem(**item_data.model_dump(), pr_id=pr.id)
            db.add(item)

    await db.flush()

    items_result = await db.execute(select(PRItem).where(PRItem.pr_id == pr.id))
    pr.items = items_result.scalars().all()

    return ResponseModel(data=PurchaseRequisitionResponse.model_validate(pr))


@router.delete("/requisitions/{requisition_id}", response_model=ResponseModel)
async def delete_requisition(
    requisition_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(PurchaseRequisition).where(
            PurchaseRequisition.id == requisition_id,
            PurchaseRequisition.company_id == current_user.company_id,
        )
    )
    pr = result.scalar_one_or_none()
    if not pr:
        raise HTTPException(status_code=404, detail="Purchase requisition not found")
    pr.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Purchase requisition deleted")


# ── Purchase Orders (with items) ──

@router.get("/orders", response_model=PaginatedResponse)
async def list_purchase_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(PurchaseOrder).options(selectinload(PurchaseOrder.items)).where(
        PurchaseOrder.company_id == current_user.company_id,
    )
    count_query = select(sa_func.count()).select_from(PurchaseOrder).where(
        PurchaseOrder.company_id == current_user.company_id,
    )

    if search:
        query = query.where(PurchaseOrder.po_number.ilike(f"%{search}%"))
        count_query = count_query.where(PurchaseOrder.po_number.ilike(f"%{search}%"))

    if status:
        query = query.where(PurchaseOrder.status == status)
        count_query = count_query.where(PurchaseOrder.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[PurchaseOrderResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/orders/{order_id}", response_model=ResponseModel)
async def get_purchase_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(PurchaseOrder).where(
            PurchaseOrder.id == order_id,
            PurchaseOrder.company_id == current_user.company_id,
        )
    )
    po = result.scalar_one_or_none()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")

    items_result = await db.execute(select(POItem).where(POItem.po_id == po.id))
    po.items = items_result.scalars().all()

    return ResponseModel(data=PurchaseOrderResponse.model_validate(po))


@router.post("/orders", response_model=ResponseModel, status_code=201)
async def create_purchase_order(
    data: PurchaseOrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    items_data = data.items
    po_data = data.model_dump(exclude={"items"})
    po = PurchaseOrder(**po_data, company_id=current_user.company_id)
    db.add(po)
    await db.flush()
    await db.refresh(po)

    for item_data in items_data:
        item = POItem(**item_data.model_dump(), po_id=po.id)
        db.add(item)
    await db.flush()

    items_result = await db.execute(select(POItem).where(POItem.po_id == po.id))
    po.items = items_result.scalars().all()

    return ResponseModel(data=PurchaseOrderResponse.model_validate(po))


@router.put("/orders/{order_id}", response_model=ResponseModel)
async def update_purchase_order(
    order_id: int,
    data: PurchaseOrderUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(PurchaseOrder).where(
            PurchaseOrder.id == order_id,
            PurchaseOrder.company_id == current_user.company_id,
        )
    )
    po = result.scalar_one_or_none()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")

    update_data = data.model_dump(exclude_unset=True, exclude={"items"})
    for k, v in update_data.items():
        setattr(po, k, v)

    if data.items is not None:
        from sqlalchemy import delete as sa_delete
        await db.execute(sa_delete(POItem).where(POItem.po_id == po.id))
        for item_data in data.items:
            item = POItem(**item_data.model_dump(), po_id=po.id)
            db.add(item)

    await db.flush()

    items_result = await db.execute(select(POItem).where(POItem.po_id == po.id))
    po.items = items_result.scalars().all()

    return ResponseModel(data=PurchaseOrderResponse.model_validate(po))


@router.delete("/orders/{order_id}", response_model=ResponseModel)
async def delete_purchase_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(PurchaseOrder).where(
            PurchaseOrder.id == order_id,
            PurchaseOrder.company_id == current_user.company_id,
        )
    )
    po = result.scalar_one_or_none()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    po.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Purchase order deleted")


# ── GRN (with items) ──

@router.get("/grn", response_model=PaginatedResponse)
async def list_grn(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(GRN).where(GRN.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(GRN).where(
        GRN.company_id == current_user.company_id,
    )

    if search:
        query = query.where(GRN.grn_number.ilike(f"%{search}%"))
        count_query = count_query.where(GRN.grn_number.ilike(f"%{search}%"))

    if status:
        query = query.where(GRN.status == status)
        count_query = count_query.where(GRN.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[GRNResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/grn/{grn_id}", response_model=ResponseModel)
async def get_grn(
    grn_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(GRN).where(
            GRN.id == grn_id,
            GRN.company_id == current_user.company_id,
        )
    )
    grn = result.scalar_one_or_none()
    if not grn:
        raise HTTPException(status_code=404, detail="GRN not found")

    items_result = await db.execute(select(GRNItem).where(GRNItem.grn_id == grn.id))
    grn.items = items_result.scalars().all()

    return ResponseModel(data=GRNResponse.model_validate(grn))


@router.post("/grn", response_model=ResponseModel, status_code=201)
async def create_grn(
    data: GRNCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    items_data = data.items
    grn_data = data.model_dump(exclude={"items"})
    grn = GRN(**grn_data, company_id=current_user.company_id)
    db.add(grn)
    await db.flush()
    await db.refresh(grn)

    for item_data in items_data:
        item = GRNItem(**item_data.model_dump(), grn_id=grn.id)
        db.add(item)
    await db.flush()

    items_result = await db.execute(select(GRNItem).where(GRNItem.grn_id == grn.id))
    grn.items = items_result.scalars().all()

    return ResponseModel(data=GRNResponse.model_validate(grn))


@router.put("/grn/{grn_id}", response_model=ResponseModel)
async def update_grn(
    grn_id: int,
    data: GRNUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(GRN).where(
            GRN.id == grn_id,
            GRN.company_id == current_user.company_id,
        )
    )
    grn = result.scalar_one_or_none()
    if not grn:
        raise HTTPException(status_code=404, detail="GRN not found")

    update_data = data.model_dump(exclude_unset=True, exclude={"items"})
    for k, v in update_data.items():
        setattr(grn, k, v)

    if data.items is not None:
        from sqlalchemy import delete as sa_delete
        await db.execute(sa_delete(GRNItem).where(GRNItem.grn_id == grn.id))
        for item_data in data.items:
            item = GRNItem(**item_data.model_dump(), grn_id=grn.id)
            db.add(item)

    await db.flush()

    items_result = await db.execute(select(GRNItem).where(GRNItem.grn_id == grn.id))
    grn.items = items_result.scalars().all()

    return ResponseModel(data=GRNResponse.model_validate(grn))


@router.delete("/grn/{grn_id}", response_model=ResponseModel)
async def delete_grn(
    grn_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(GRN).where(
            GRN.id == grn_id,
            GRN.company_id == current_user.company_id,
        )
    )
    grn = result.scalar_one_or_none()
    if not grn:
        raise HTTPException(status_code=404, detail="GRN not found")
    grn.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="GRN deleted")


# ── Supplier Payments ──

@router.get("/supplier-payments", response_model=PaginatedResponse)
async def list_supplier_payments(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(SupplierPayment).where(
        SupplierPayment.company_id == current_user.company_id,
    )
    count_query = select(sa_func.count()).select_from(SupplierPayment).where(
        SupplierPayment.company_id == current_user.company_id,
    )

    if search:
        query = query.where(SupplierPayment.reference.ilike(f"%{search}%"))
        count_query = count_query.where(SupplierPayment.reference.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(SupplierPayment.created_at.desc()).offset(
        (page - 1) * per_page
    ).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[SupplierPaymentResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/supplier-payments/{payment_id}", response_model=ResponseModel)
async def get_supplier_payment(
    payment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(SupplierPayment).where(
        SupplierPayment.id == payment_id,
        SupplierPayment.company_id == current_user.company_id,
    ))
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Supplier payment not found")
    return ResponseModel(data=SupplierPaymentResponse.model_validate(payment))


@router.post("/supplier-payments", response_model=ResponseModel, status_code=201)
async def create_supplier_payment(
    data: SupplierPaymentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    payment = SupplierPayment(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(payment)
    await db.flush()
    await db.refresh(payment)
    return ResponseModel(data=SupplierPaymentResponse.model_validate(payment))


@router.put("/supplier-payments/{payment_id}", response_model=ResponseModel)
async def update_supplier_payment(
    payment_id: int,
    data: SupplierPaymentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(SupplierPayment).where(
        SupplierPayment.id == payment_id,
        SupplierPayment.company_id == current_user.company_id,
    ))
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Supplier payment not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(payment, k, v)
    await db.flush()
    await db.refresh(payment)
    return ResponseModel(data=SupplierPaymentResponse.model_validate(payment))


@router.delete("/supplier-payments/{payment_id}", response_model=ResponseModel)
async def delete_supplier_payment(
    payment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(SupplierPayment).where(
        SupplierPayment.id == payment_id,
        SupplierPayment.company_id == current_user.company_id,
    ))
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Supplier payment not found")
    payment.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Supplier payment deleted")
