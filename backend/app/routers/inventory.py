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
from app.models.inventory import (
    ItemCategory, Item, Stock, Warehouse,
    StockAdjustment, StockTransfer, StockTake, StockTakeItem,
)
from app.schemas.inventory import (
    ItemCategoryCreate, ItemCategoryUpdate, ItemCategoryResponse,
    ItemCreate, ItemUpdate, ItemResponse,
    StockCreate, StockUpdate, StockResponse,
    WarehouseCreate, WarehouseUpdate, WarehouseResponse,
    StockAdjustmentCreate, StockAdjustmentUpdate, StockAdjustmentResponse,
    StockTransferCreate, StockTransferUpdate, StockTransferResponse,
    StockTakeCreate, StockTakeUpdate, StockTakeResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/inventory", tags=["Inventory"])


# ── Categories ──

@router.get("/categories", response_model=PaginatedResponse)
async def list_categories(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(ItemCategory).where(
        ItemCategory.company_id == current_user.company_id,
        ItemCategory.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(ItemCategory).where(
        ItemCategory.company_id == current_user.company_id,
        ItemCategory.deleted_at.is_(None),
    )

    if search:
        query = query.where(ItemCategory.name.ilike(f"%{search}%"))
        count_query = count_query.where(ItemCategory.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[ItemCategoryResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/categories/{category_id}", response_model=ResponseModel)
async def get_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(ItemCategory).where(
        ItemCategory.id == category_id,
        ItemCategory.company_id == current_user.company_id,
        ItemCategory.deleted_at.is_(None),
    ))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return ResponseModel(data=ItemCategoryResponse.model_validate(category))


@router.post("/categories", response_model=ResponseModel, status_code=201)
async def create_category(
    data: ItemCategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    category = ItemCategory(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(category)
    await db.flush()
    await db.refresh(category)
    return ResponseModel(data=ItemCategoryResponse.model_validate(category))


@router.put("/categories/{category_id}", response_model=ResponseModel)
async def update_category(
    category_id: int,
    data: ItemCategoryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(ItemCategory).where(
        ItemCategory.id == category_id,
        ItemCategory.company_id == current_user.company_id,
        ItemCategory.deleted_at.is_(None),
    ))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(category, k, v)
    await db.flush()
    await db.refresh(category)
    return ResponseModel(data=ItemCategoryResponse.model_validate(category))


@router.delete("/categories/{category_id}", response_model=ResponseModel)
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(ItemCategory).where(
        ItemCategory.id == category_id,
        ItemCategory.company_id == current_user.company_id,
        ItemCategory.deleted_at.is_(None),
    ))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Category deleted")


# ── Items ──

@router.get("/items", response_model=PaginatedResponse)
async def list_items(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Item).where(
        Item.company_id == current_user.company_id,
        Item.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Item).where(
        Item.company_id == current_user.company_id,
        Item.deleted_at.is_(None),
    )

    if search:
        query = query.where(Item.name.ilike(f"%{search}%"))
        count_query = count_query.where(Item.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[ItemResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/items/{item_id}", response_model=ResponseModel)
async def get_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Item).where(
        Item.id == item_id,
        Item.company_id == current_user.company_id,
        Item.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return ResponseModel(data=ItemResponse.model_validate(item))


@router.post("/items", response_model=ResponseModel, status_code=201)
async def create_item(
    data: ItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    item = Item(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=ItemResponse.model_validate(item))


@router.put("/items/{item_id}", response_model=ResponseModel)
async def update_item(
    item_id: int,
    data: ItemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Item).where(
        Item.id == item_id,
        Item.company_id == current_user.company_id,
        Item.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=ItemResponse.model_validate(item))


@router.delete("/items/{item_id}", response_model=ResponseModel)
async def delete_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Item).where(
        Item.id == item_id,
        Item.company_id == current_user.company_id,
        Item.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Item deleted")


# ── Stock ──

@router.get("/stock", response_model=PaginatedResponse)
async def list_stock(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Stock).where(Stock.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(Stock).where(Stock.company_id == current_user.company_id)

    if search:
        query = query.where(Stock.item_id == int(search))  # type: ignore
        count_query = count_query.where(Stock.item_id == int(search))  # type: ignore

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[StockResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/stock/{stock_id}", response_model=ResponseModel)
async def get_stock(
    stock_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Stock).where(
        Stock.id == stock_id,
        Stock.company_id == current_user.company_id,
    ))
    stock = result.scalar_one_or_none()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return ResponseModel(data=StockResponse.model_validate(stock))


@router.post("/stock", response_model=ResponseModel, status_code=201)
async def create_stock(
    data: StockCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    stock = Stock(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(stock)
    await db.flush()
    await db.refresh(stock)
    return ResponseModel(data=StockResponse.model_validate(stock))


@router.put("/stock/{stock_id}", response_model=ResponseModel)
async def update_stock(
    stock_id: int,
    data: StockUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Stock).where(
        Stock.id == stock_id,
        Stock.company_id == current_user.company_id,
    ))
    stock = result.scalar_one_or_none()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(stock, k, v)
    await db.flush()
    await db.refresh(stock)
    return ResponseModel(data=StockResponse.model_validate(stock))


# ── Warehouses ──

@router.get("/warehouses", response_model=PaginatedResponse)
async def list_warehouses(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Warehouse).where(
        Warehouse.company_id == current_user.company_id,
        Warehouse.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Warehouse).where(
        Warehouse.company_id == current_user.company_id,
        Warehouse.deleted_at.is_(None),
    )

    if search:
        query = query.where(Warehouse.name.ilike(f"%{search}%"))
        count_query = count_query.where(Warehouse.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[WarehouseResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/warehouses/{warehouse_id}", response_model=ResponseModel)
async def get_warehouse(
    warehouse_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Warehouse).where(
        Warehouse.id == warehouse_id,
        Warehouse.company_id == current_user.company_id,
        Warehouse.deleted_at.is_(None),
    ))
    warehouse = result.scalar_one_or_none()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return ResponseModel(data=WarehouseResponse.model_validate(warehouse))


@router.post("/warehouses", response_model=ResponseModel, status_code=201)
async def create_warehouse(
    data: WarehouseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    warehouse = Warehouse(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(warehouse)
    await db.flush()
    await db.refresh(warehouse)
    return ResponseModel(data=WarehouseResponse.model_validate(warehouse))


@router.put("/warehouses/{warehouse_id}", response_model=ResponseModel)
async def update_warehouse(
    warehouse_id: int,
    data: WarehouseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Warehouse).where(
        Warehouse.id == warehouse_id,
        Warehouse.company_id == current_user.company_id,
        Warehouse.deleted_at.is_(None),
    ))
    warehouse = result.scalar_one_or_none()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(warehouse, k, v)
    await db.flush()
    await db.refresh(warehouse)
    return ResponseModel(data=WarehouseResponse.model_validate(warehouse))


@router.delete("/warehouses/{warehouse_id}", response_model=ResponseModel)
async def delete_warehouse(
    warehouse_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Warehouse).where(
        Warehouse.id == warehouse_id,
        Warehouse.company_id == current_user.company_id,
        Warehouse.deleted_at.is_(None),
    ))
    warehouse = result.scalar_one_or_none()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    warehouse.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Warehouse deleted")


# ── Stock Adjustments ──

@router.get("/adjustments", response_model=PaginatedResponse)
async def list_adjustments(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(StockAdjustment).where(StockAdjustment.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(StockAdjustment).where(StockAdjustment.company_id == current_user.company_id)

    if search:
        query = query.where(StockAdjustment.type.ilike(f"%{search}%"))
        count_query = count_query.where(StockAdjustment.type.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(StockAdjustment.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[StockAdjustmentResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/adjustments/{adjustment_id}", response_model=ResponseModel)
async def get_adjustment(
    adjustment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(StockAdjustment).where(
        StockAdjustment.id == adjustment_id,
        StockAdjustment.company_id == current_user.company_id,
    ))
    adjustment = result.scalar_one_or_none()
    if not adjustment:
        raise HTTPException(status_code=404, detail="Stock adjustment not found")
    return ResponseModel(data=StockAdjustmentResponse.model_validate(adjustment))


@router.post("/adjustments", response_model=ResponseModel, status_code=201)
async def create_adjustment(
    data: StockAdjustmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    adjustment = StockAdjustment(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(adjustment)
    await db.flush()
    await db.refresh(adjustment)
    return ResponseModel(data=StockAdjustmentResponse.model_validate(adjustment))


@router.put("/adjustments/{adjustment_id}", response_model=ResponseModel)
async def update_adjustment(
    adjustment_id: int,
    data: StockAdjustmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(StockAdjustment).where(
        StockAdjustment.id == adjustment_id,
        StockAdjustment.company_id == current_user.company_id,
    ))
    adjustment = result.scalar_one_or_none()
    if not adjustment:
        raise HTTPException(status_code=404, detail="Stock adjustment not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(adjustment, k, v)
    await db.flush()
    await db.refresh(adjustment)
    return ResponseModel(data=StockAdjustmentResponse.model_validate(adjustment))


# ── Stock Transfers ──

@router.get("/transfers", response_model=PaginatedResponse)
async def list_transfers(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(StockTransfer).where(StockTransfer.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(StockTransfer).where(StockTransfer.company_id == current_user.company_id)

    if search:
        query = query.where(StockTransfer.status.ilike(f"%{search}%"))
        count_query = count_query.where(StockTransfer.status.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(StockTransfer.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[StockTransferResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/transfers/{transfer_id}", response_model=ResponseModel)
async def get_transfer(
    transfer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(StockTransfer).where(
        StockTransfer.id == transfer_id,
        StockTransfer.company_id == current_user.company_id,
    ))
    transfer = result.scalar_one_or_none()
    if not transfer:
        raise HTTPException(status_code=404, detail="Stock transfer not found")
    return ResponseModel(data=StockTransferResponse.model_validate(transfer))


@router.post("/transfers", response_model=ResponseModel, status_code=201)
async def create_transfer(
    data: StockTransferCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    transfer = StockTransfer(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(transfer)
    await db.flush()
    await db.refresh(transfer)
    return ResponseModel(data=StockTransferResponse.model_validate(transfer))


@router.put("/transfers/{transfer_id}", response_model=ResponseModel)
async def update_transfer(
    transfer_id: int,
    data: StockTransferUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(StockTransfer).where(
        StockTransfer.id == transfer_id,
        StockTransfer.company_id == current_user.company_id,
    ))
    transfer = result.scalar_one_or_none()
    if not transfer:
        raise HTTPException(status_code=404, detail="Stock transfer not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(transfer, k, v)
    await db.flush()
    await db.refresh(transfer)
    return ResponseModel(data=StockTransferResponse.model_validate(transfer))


# ── Stock Takes ──

@router.get("/stock-takes", response_model=PaginatedResponse)
async def list_stock_takes(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(StockTake).where(StockTake.company_id == current_user.company_id)
    count_query = select(sa_func.count()).select_from(StockTake).where(StockTake.company_id == current_user.company_id)

    if search:
        query = query.where(StockTake.status.ilike(f"%{search}%"))
        count_query = count_query.where(StockTake.status.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.order_by(StockTake.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[StockTakeResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/stock-takes/{stock_take_id}", response_model=ResponseModel)
async def get_stock_take(
    stock_take_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(StockTake).options(selectinload(StockTake.items)).where(
            StockTake.id == stock_take_id,
            StockTake.company_id == current_user.company_id,
        )
    )
    stock_take = result.scalar_one_or_none()
    if not stock_take:
        raise HTTPException(status_code=404, detail="Stock take not found")
    return ResponseModel(data=StockTakeResponse.model_validate(stock_take))


@router.post("/stock-takes", response_model=ResponseModel, status_code=201)
async def create_stock_take(
    data: StockTakeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    items_data = data.model_dump().pop("items", [])
    stock_take = StockTake(**data.model_dump(exclude={"items"}), company_id=current_user.company_id)
    db.add(stock_take)
    await db.flush()

    for item_data in items_data:
        item = StockTakeItem(stock_take_id=stock_take.id, **item_data)
        db.add(item)
    await db.flush()

    result = await db.execute(
        select(StockTake).options(selectinload(StockTake.items)).where(StockTake.id == stock_take.id)
    )
    stock_take = result.scalar_one()
    return ResponseModel(data=StockTakeResponse.model_validate(stock_take))


@router.put("/stock-takes/{stock_take_id}", response_model=ResponseModel)
async def update_stock_take(
    stock_take_id: int,
    data: StockTakeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(
        select(StockTake).options(selectinload(StockTake.items)).where(
            StockTake.id == stock_take_id,
            StockTake.company_id == current_user.company_id,
        )
    )
    stock_take = result.scalar_one_or_none()
    if not stock_take:
        raise HTTPException(status_code=404, detail="Stock take not found")

    update_data = data.model_dump(exclude_unset=True)
    items_data = update_data.pop("items", None)

    for k, v in update_data.items():
        setattr(stock_take, k, v)

    if items_data is not None:
        for existing_item in stock_take.items:
            await db.delete(existing_item)
        for item_data in items_data:
            item = StockTakeItem(stock_take_id=stock_take.id, **item_data)
            db.add(item)

    await db.flush()
    result = await db.execute(
        select(StockTake).options(selectinload(StockTake.items)).where(StockTake.id == stock_take.id)
    )
    stock_take = result.scalar_one()
    return ResponseModel(data=StockTakeResponse.model_validate(stock_take))
