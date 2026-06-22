from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.dependencies.auth import require_company
from app.models.auth import User
from app.models.sales import (
    Customer, CustomerContract, Lead, Deal,
    Quotation, QuotationItem, SalesOrder, SalesOrderItem,
    DeliveryNote, SalesCampaign, Inquiry,
)
from app.schemas.sales import (
    CustomerCreate, CustomerUpdate, CustomerResponse,
    CustomerContractCreate, CustomerContractUpdate, CustomerContractResponse,
    LeadCreate, LeadUpdate, LeadResponse,
    DealCreate, DealUpdate, DealResponse,
    QuotationCreate, QuotationUpdate, QuotationResponse,
    QuotationItemCreate, QuotationItemResponse,
    SalesOrderCreate, SalesOrderUpdate, SalesOrderResponse,
    SalesOrderItemCreate, SalesOrderItemResponse,
    DeliveryNoteCreate, DeliveryNoteUpdate, DeliveryNoteResponse,
    SalesCampaignCreate, SalesCampaignUpdate, SalesCampaignResponse,
    InquiryCreate, InquiryUpdate, InquiryResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/sales", tags=["Sales"])


# ── Customers ──

@router.get("/customers", response_model=PaginatedResponse)
async def list_customers(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Customer).where(
        Customer.company_id == current_user.company_id,
        Customer.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Customer).where(
        Customer.company_id == current_user.company_id,
        Customer.deleted_at.is_(None),
    )

    if search:
        query = query.where(Customer.name.ilike(f"%{search}%"))
        count_query = count_query.where(Customer.name.ilike(f"%{search}%"))

    if status:
        query = query.where(Customer.status == status)
        count_query = count_query.where(Customer.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[CustomerResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/customers/{customer_id}", response_model=ResponseModel)
async def get_customer(
    customer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Customer).where(
        Customer.id == customer_id,
        Customer.company_id == current_user.company_id,
        Customer.deleted_at.is_(None),
    ))
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return ResponseModel(data=CustomerResponse.model_validate(customer))


@router.post("/customers", response_model=ResponseModel, status_code=201)
async def create_customer(
    data: CustomerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    customer = Customer(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(customer)
    await db.flush()
    await db.refresh(customer)
    return ResponseModel(data=CustomerResponse.model_validate(customer))


@router.put("/customers/{customer_id}", response_model=ResponseModel)
async def update_customer(
    customer_id: int,
    data: CustomerUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Customer).where(
        Customer.id == customer_id,
        Customer.company_id == current_user.company_id,
        Customer.deleted_at.is_(None),
    ))
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(customer, k, v)
    await db.flush()
    await db.refresh(customer)
    return ResponseModel(data=CustomerResponse.model_validate(customer))


@router.delete("/customers/{customer_id}", response_model=ResponseModel)
async def delete_customer(
    customer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Customer).where(
        Customer.id == customer_id,
        Customer.company_id == current_user.company_id,
        Customer.deleted_at.is_(None),
    ))
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Customer deleted")


# ── Customer Contracts ──

@router.get("/contracts", response_model=PaginatedResponse)
async def list_contracts(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(CustomerContract).where(
        CustomerContract.company_id == current_user.company_id,
        CustomerContract.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(CustomerContract).where(
        CustomerContract.company_id == current_user.company_id,
        CustomerContract.deleted_at.is_(None),
    )

    if search:
        query = query.where(CustomerContract.title.ilike(f"%{search}%"))
        count_query = count_query.where(CustomerContract.title.ilike(f"%{search}%"))

    if status:
        query = query.where(CustomerContract.status == status)
        count_query = count_query.where(CustomerContract.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[CustomerContractResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/contracts/{contract_id}", response_model=ResponseModel)
async def get_contract(
    contract_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(CustomerContract).where(
        CustomerContract.id == contract_id,
        CustomerContract.company_id == current_user.company_id,
        CustomerContract.deleted_at.is_(None),
    ))
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return ResponseModel(data=CustomerContractResponse.model_validate(contract))


@router.post("/contracts", response_model=ResponseModel, status_code=201)
async def create_contract(
    data: CustomerContractCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    contract = CustomerContract(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(contract)
    await db.flush()
    await db.refresh(contract)
    return ResponseModel(data=CustomerContractResponse.model_validate(contract))


@router.put("/contracts/{contract_id}", response_model=ResponseModel)
async def update_contract(
    contract_id: int,
    data: CustomerContractUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(CustomerContract).where(
        CustomerContract.id == contract_id,
        CustomerContract.company_id == current_user.company_id,
        CustomerContract.deleted_at.is_(None),
    ))
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(contract, k, v)
    await db.flush()
    await db.refresh(contract)
    return ResponseModel(data=CustomerContractResponse.model_validate(contract))


@router.delete("/contracts/{contract_id}", response_model=ResponseModel)
async def delete_contract(
    contract_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(CustomerContract).where(
        CustomerContract.id == contract_id,
        CustomerContract.company_id == current_user.company_id,
        CustomerContract.deleted_at.is_(None),
    ))
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    contract.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Contract deleted")


# ── Leads ──

@router.get("/leads", response_model=PaginatedResponse)
async def list_leads(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Lead).where(
        Lead.company_id == current_user.company_id,
        Lead.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Lead).where(
        Lead.company_id == current_user.company_id,
        Lead.deleted_at.is_(None),
    )

    if search:
        query = query.where(Lead.name.ilike(f"%{search}%"))
        count_query = count_query.where(Lead.name.ilike(f"%{search}%"))

    if status:
        query = query.where(Lead.status == status)
        count_query = count_query.where(Lead.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[LeadResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/leads/{lead_id}", response_model=ResponseModel)
async def get_lead(
    lead_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Lead).where(
        Lead.id == lead_id,
        Lead.company_id == current_user.company_id,
        Lead.deleted_at.is_(None),
    ))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return ResponseModel(data=LeadResponse.model_validate(lead))


@router.post("/leads", response_model=ResponseModel, status_code=201)
async def create_lead(
    data: LeadCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    lead = Lead(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(lead)
    await db.flush()
    await db.refresh(lead)
    return ResponseModel(data=LeadResponse.model_validate(lead))


@router.put("/leads/{lead_id}", response_model=ResponseModel)
async def update_lead(
    lead_id: int,
    data: LeadUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Lead).where(
        Lead.id == lead_id,
        Lead.company_id == current_user.company_id,
        Lead.deleted_at.is_(None),
    ))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(lead, k, v)
    await db.flush()
    await db.refresh(lead)
    return ResponseModel(data=LeadResponse.model_validate(lead))


@router.delete("/leads/{lead_id}", response_model=ResponseModel)
async def delete_lead(
    lead_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Lead).where(
        Lead.id == lead_id,
        Lead.company_id == current_user.company_id,
        Lead.deleted_at.is_(None),
    ))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Lead deleted")


# ── Deals ──

@router.get("/deals", response_model=PaginatedResponse)
async def list_deals(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Deal).where(
        Deal.company_id == current_user.company_id,
        Deal.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Deal).where(
        Deal.company_id == current_user.company_id,
        Deal.deleted_at.is_(None),
    )

    if search:
        query = query.where(Deal.title.ilike(f"%{search}%"))
        count_query = count_query.where(Deal.title.ilike(f"%{search}%"))

    if status:
        query = query.where(Deal.status == status)
        count_query = count_query.where(Deal.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[DealResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/deals/{deal_id}", response_model=ResponseModel)
async def get_deal(
    deal_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Deal).where(
        Deal.id == deal_id,
        Deal.company_id == current_user.company_id,
        Deal.deleted_at.is_(None),
    ))
    deal = result.scalar_one_or_none()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    return ResponseModel(data=DealResponse.model_validate(deal))


@router.post("/deals", response_model=ResponseModel, status_code=201)
async def create_deal(
    data: DealCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    deal = Deal(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(deal)
    await db.flush()
    await db.refresh(deal)
    return ResponseModel(data=DealResponse.model_validate(deal))


@router.put("/deals/{deal_id}", response_model=ResponseModel)
async def update_deal(
    deal_id: int,
    data: DealUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Deal).where(
        Deal.id == deal_id,
        Deal.company_id == current_user.company_id,
        Deal.deleted_at.is_(None),
    ))
    deal = result.scalar_one_or_none()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(deal, k, v)
    await db.flush()
    await db.refresh(deal)
    return ResponseModel(data=DealResponse.model_validate(deal))


@router.delete("/deals/{deal_id}", response_model=ResponseModel)
async def delete_deal(
    deal_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Deal).where(
        Deal.id == deal_id,
        Deal.company_id == current_user.company_id,
        Deal.deleted_at.is_(None),
    ))
    deal = result.scalar_one_or_none()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    deal.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Deal deleted")


# ── Quotations (with items) ──

@router.get("/quotations", response_model=PaginatedResponse)
async def list_quotations(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Quotation).where(
        Quotation.company_id == current_user.company_id,
        Quotation.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Quotation).where(
        Quotation.company_id == current_user.company_id,
        Quotation.deleted_at.is_(None),
    )

    if search:
        query = query.where(Quotation.quote_number.ilike(f"%{search}%"))
        count_query = count_query.where(Quotation.quote_number.ilike(f"%{search}%"))

    if status:
        query = query.where(Quotation.status == status)
        count_query = count_query.where(Quotation.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[QuotationResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/quotations/{quotation_id}", response_model=ResponseModel)
async def get_quotation(
    quotation_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Quotation).where(
            Quotation.id == quotation_id,
            Quotation.company_id == current_user.company_id,
            Quotation.deleted_at.is_(None),
        )
    )
    quotation = result.scalar_one_or_none()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")

    items_result = await db.execute(
        select(QuotationItem).where(QuotationItem.quotation_id == quotation.id)
    )
    quotation.items = items_result.scalars().all()

    return ResponseModel(data=QuotationResponse.model_validate(quotation))


@router.post("/quotations", response_model=ResponseModel, status_code=201)
async def create_quotation(
    data: QuotationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    items_data = data.items
    quote_data = data.model_dump(exclude={"items"})
    quotation = Quotation(**quote_data, company_id=current_user.company_id)
    db.add(quotation)
    await db.flush()
    await db.refresh(quotation)

    for item_data in items_data:
        item = QuotationItem(**item_data.model_dump(), quotation_id=quotation.id)
        db.add(item)
    await db.flush()

    items_result = await db.execute(
        select(QuotationItem).where(QuotationItem.quotation_id == quotation.id)
    )
    quotation.items = items_result.scalars().all()

    return ResponseModel(data=QuotationResponse.model_validate(quotation))


@router.put("/quotations/{quotation_id}", response_model=ResponseModel)
async def update_quotation(
    quotation_id: int,
    data: QuotationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Quotation).where(
            Quotation.id == quotation_id,
            Quotation.company_id == current_user.company_id,
            Quotation.deleted_at.is_(None),
        )
    )
    quotation = result.scalar_one_or_none()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")

    update_data = data.model_dump(exclude_unset=True, exclude={"items"})
    for k, v in update_data.items():
        setattr(quotation, k, v)

    if data.items is not None:
        from sqlalchemy import delete as sa_delete
        await db.execute(sa_delete(QuotationItem).where(QuotationItem.quotation_id == quotation.id))
        for item_data in data.items:
            item = QuotationItem(**item_data.model_dump(), quotation_id=quotation.id)
            db.add(item)

    await db.flush()

    items_result = await db.execute(
        select(QuotationItem).where(QuotationItem.quotation_id == quotation.id)
    )
    quotation.items = items_result.scalars().all()

    return ResponseModel(data=QuotationResponse.model_validate(quotation))


@router.delete("/quotations/{quotation_id}", response_model=ResponseModel)
async def delete_quotation(
    quotation_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(Quotation).where(
            Quotation.id == quotation_id,
            Quotation.company_id == current_user.company_id,
            Quotation.deleted_at.is_(None),
        )
    )
    quotation = result.scalar_one_or_none()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    quotation.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Quotation deleted")


# ── Sales Orders (with items) ──

@router.get("/orders", response_model=PaginatedResponse)
async def list_sales_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(SalesOrder).where(
        SalesOrder.company_id == current_user.company_id,
        SalesOrder.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(SalesOrder).where(
        SalesOrder.company_id == current_user.company_id,
        SalesOrder.deleted_at.is_(None),
    )

    if search:
        query = query.where(SalesOrder.order_number.ilike(f"%{search}%"))
        count_query = count_query.where(SalesOrder.order_number.ilike(f"%{search}%"))

    if status:
        query = query.where(SalesOrder.status == status)
        count_query = count_query.where(SalesOrder.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[SalesOrderResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/orders/{order_id}", response_model=ResponseModel)
async def get_sales_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(SalesOrder).where(
            SalesOrder.id == order_id,
            SalesOrder.company_id == current_user.company_id,
            SalesOrder.deleted_at.is_(None),
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Sales order not found")

    items_result = await db.execute(
        select(SalesOrderItem).where(SalesOrderItem.sales_order_id == order.id)
    )
    order.items = items_result.scalars().all()

    return ResponseModel(data=SalesOrderResponse.model_validate(order))


@router.post("/orders", response_model=ResponseModel, status_code=201)
async def create_sales_order(
    data: SalesOrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    items_data = data.items
    order_data = data.model_dump(exclude={"items"})
    order = SalesOrder(**order_data, company_id=current_user.company_id)
    db.add(order)
    await db.flush()
    await db.refresh(order)

    for item_data in items_data:
        item = SalesOrderItem(**item_data.model_dump(), sales_order_id=order.id)
        db.add(item)
    await db.flush()

    items_result = await db.execute(
        select(SalesOrderItem).where(SalesOrderItem.sales_order_id == order.id)
    )
    order.items = items_result.scalars().all()

    return ResponseModel(data=SalesOrderResponse.model_validate(order))


@router.put("/orders/{order_id}", response_model=ResponseModel)
async def update_sales_order(
    order_id: int,
    data: SalesOrderUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(SalesOrder).where(
            SalesOrder.id == order_id,
            SalesOrder.company_id == current_user.company_id,
            SalesOrder.deleted_at.is_(None),
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Sales order not found")

    update_data = data.model_dump(exclude_unset=True, exclude={"items"})
    for k, v in update_data.items():
        setattr(order, k, v)

    if data.items is not None:
        from sqlalchemy import delete as sa_delete
        await db.execute(sa_delete(SalesOrderItem).where(SalesOrderItem.sales_order_id == order.id))
        for item_data in data.items:
            item = SalesOrderItem(**item_data.model_dump(), sales_order_id=order.id)
            db.add(item)

    await db.flush()

    items_result = await db.execute(
        select(SalesOrderItem).where(SalesOrderItem.sales_order_id == order.id)
    )
    order.items = items_result.scalars().all()

    return ResponseModel(data=SalesOrderResponse.model_validate(order))


@router.delete("/orders/{order_id}", response_model=ResponseModel)
async def delete_sales_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(SalesOrder).where(
            SalesOrder.id == order_id,
            SalesOrder.company_id == current_user.company_id,
            SalesOrder.deleted_at.is_(None),
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Sales order not found")
    order.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Sales order deleted")


# ── Delivery Notes ──

@router.get("/delivery-notes", response_model=PaginatedResponse)
async def list_delivery_notes(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(DeliveryNote).where(
        DeliveryNote.company_id == current_user.company_id,
    )
    count_query = select(sa_func.count()).select_from(DeliveryNote).where(
        DeliveryNote.company_id == current_user.company_id,
    )

    if search:
        query = query.where(DeliveryNote.dn_number.ilike(f"%{search}%"))
        count_query = count_query.where(DeliveryNote.dn_number.ilike(f"%{search}%"))

    if status:
        query = query.where(DeliveryNote.status == status)
        count_query = count_query.where(DeliveryNote.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[DeliveryNoteResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/delivery-notes/{dn_id}", response_model=ResponseModel)
async def get_delivery_note(
    dn_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(DeliveryNote).where(
        DeliveryNote.id == dn_id,
        DeliveryNote.company_id == current_user.company_id,
    ))
    dn = result.scalar_one_or_none()
    if not dn:
        raise HTTPException(status_code=404, detail="Delivery note not found")
    return ResponseModel(data=DeliveryNoteResponse.model_validate(dn))


@router.post("/delivery-notes", response_model=ResponseModel, status_code=201)
async def create_delivery_note(
    data: DeliveryNoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    dn = DeliveryNote(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(dn)
    await db.flush()
    await db.refresh(dn)
    return ResponseModel(data=DeliveryNoteResponse.model_validate(dn))


@router.put("/delivery-notes/{dn_id}", response_model=ResponseModel)
async def update_delivery_note(
    dn_id: int,
    data: DeliveryNoteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(DeliveryNote).where(
        DeliveryNote.id == dn_id,
        DeliveryNote.company_id == current_user.company_id,
    ))
    dn = result.scalar_one_or_none()
    if not dn:
        raise HTTPException(status_code=404, detail="Delivery note not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(dn, k, v)
    await db.flush()
    await db.refresh(dn)
    return ResponseModel(data=DeliveryNoteResponse.model_validate(dn))


@router.delete("/delivery-notes/{dn_id}", response_model=ResponseModel)
async def delete_delivery_note(
    dn_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(DeliveryNote).where(
        DeliveryNote.id == dn_id,
        DeliveryNote.company_id == current_user.company_id,
    ))
    dn = result.scalar_one_or_none()
    if not dn:
        raise HTTPException(status_code=404, detail="Delivery note not found")
    dn.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Delivery note deleted")


# ── Sales Campaigns ──

@router.get("/campaigns", response_model=PaginatedResponse)
async def list_campaigns(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(SalesCampaign).where(
        SalesCampaign.company_id == current_user.company_id,
        SalesCampaign.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(SalesCampaign).where(
        SalesCampaign.company_id == current_user.company_id,
        SalesCampaign.deleted_at.is_(None),
    )

    if search:
        query = query.where(SalesCampaign.name.ilike(f"%{search}%"))
        count_query = count_query.where(SalesCampaign.name.ilike(f"%{search}%"))

    if status:
        query = query.where(SalesCampaign.status == status)
        count_query = count_query.where(SalesCampaign.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[SalesCampaignResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/campaigns/{campaign_id}", response_model=ResponseModel)
async def get_campaign(
    campaign_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(SalesCampaign).where(
        SalesCampaign.id == campaign_id,
        SalesCampaign.company_id == current_user.company_id,
        SalesCampaign.deleted_at.is_(None),
    ))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return ResponseModel(data=SalesCampaignResponse.model_validate(campaign))


@router.post("/campaigns", response_model=ResponseModel, status_code=201)
async def create_campaign(
    data: SalesCampaignCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    campaign = SalesCampaign(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(campaign)
    await db.flush()
    await db.refresh(campaign)
    return ResponseModel(data=SalesCampaignResponse.model_validate(campaign))


@router.put("/campaigns/{campaign_id}", response_model=ResponseModel)
async def update_campaign(
    campaign_id: int,
    data: SalesCampaignUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(SalesCampaign).where(
        SalesCampaign.id == campaign_id,
        SalesCampaign.company_id == current_user.company_id,
        SalesCampaign.deleted_at.is_(None),
    ))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(campaign, k, v)
    await db.flush()
    await db.refresh(campaign)
    return ResponseModel(data=SalesCampaignResponse.model_validate(campaign))


@router.delete("/campaigns/{campaign_id}", response_model=ResponseModel)
async def delete_campaign(
    campaign_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(SalesCampaign).where(
        SalesCampaign.id == campaign_id,
        SalesCampaign.company_id == current_user.company_id,
        SalesCampaign.deleted_at.is_(None),
    ))
    campaign = result.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    campaign.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Campaign deleted")


# ── Inquiries ──

@router.get("/inquiries", response_model=PaginatedResponse)
async def list_inquiries(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Inquiry).where(Inquiry.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(Inquiry).where(
        Inquiry.company_id == current_user.company_id,
    )

    if search:
        query = query.where(Inquiry.name.ilike(f"%{search}%"))
        count_query = count_query.where(Inquiry.name.ilike(f"%{search}%"))

    if status:
        query = query.where(Inquiry.status == status)
        count_query = count_query.where(Inquiry.status == status)

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[InquiryResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/inquiries/{inquiry_id}", response_model=ResponseModel)
async def get_inquiry(
    inquiry_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Inquiry).where(
        Inquiry.id == inquiry_id,
        Inquiry.company_id == current_user.company_id,
    ))
    inquiry = result.scalar_one_or_none()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return ResponseModel(data=InquiryResponse.model_validate(inquiry))


@router.post("/inquiries", response_model=ResponseModel, status_code=201)
async def create_inquiry(
    data: InquiryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    inquiry = Inquiry(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(inquiry)
    await db.flush()
    await db.refresh(inquiry)
    return ResponseModel(data=InquiryResponse.model_validate(inquiry))


@router.put("/inquiries/{inquiry_id}", response_model=ResponseModel)
async def update_inquiry(
    inquiry_id: int,
    data: InquiryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Inquiry).where(
        Inquiry.id == inquiry_id,
        Inquiry.company_id == current_user.company_id,
    ))
    inquiry = result.scalar_one_or_none()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(inquiry, k, v)
    await db.flush()
    await db.refresh(inquiry)
    return ResponseModel(data=InquiryResponse.model_validate(inquiry))


@router.delete("/inquiries/{inquiry_id}", response_model=ResponseModel)
async def delete_inquiry(
    inquiry_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Inquiry).where(
        Inquiry.id == inquiry_id,
        Inquiry.company_id == current_user.company_id,
    ))
    inquiry = result.scalar_one_or_none()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inquiry.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Inquiry deleted")
