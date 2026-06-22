from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.dependencies.auth import require_company
from app.models.auth import User
from app.models.master_data import (
    Currency, Country, State, City, Unit,
    TaxCode, PaymentTerm, ShippingMethod, Designation,
)
from app.schemas.master_data import (
    CurrencyCreate, CurrencyUpdate, CurrencyResponse,
    CountryCreate, CountryUpdate, CountryResponse,
    StateCreate, StateUpdate, StateResponse,
    CityCreate, CityUpdate, CityResponse,
    UnitCreate, UnitUpdate, UnitResponse,
    TaxCodeCreate, TaxCodeUpdate, TaxCodeResponse,
    PaymentTermCreate, PaymentTermUpdate, PaymentTermResponse,
    ShippingMethodCreate, ShippingMethodUpdate, ShippingMethodResponse,
    DesignationCreate, DesignationUpdate, DesignationResponse,
)
from app.schemas.common import PaginatedResponse, ResponseModel

router = APIRouter(prefix="/master-data", tags=["Master Data"])


# ═══════════════════════════════════════════════════════════════════
#  GLOBAL ENTITIES (not company-filtered)
# ═══════════════════════════════════════════════════════════════════


# ── Currencies ───────────────────────────────────────────────────

@router.get("/currencies", response_model=PaginatedResponse)
async def list_currencies(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Currency).where(Currency.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(Currency).where(Currency.deleted_at.is_(None))

    if search:
        query = query.where(Currency.name.ilike(f"%{search}%"))
        count_query = count_query.where(Currency.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[CurrencyResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/currencies/{currency_id}", response_model=ResponseModel)
async def get_currency(
    currency_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Currency).where(
        Currency.id == currency_id,
        Currency.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Currency not found")
    return ResponseModel(data=CurrencyResponse.model_validate(item))


@router.post("/currencies", response_model=ResponseModel, status_code=201)
async def create_currency(
    data: CurrencyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    item = Currency(**data.model_dump())
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=CurrencyResponse.model_validate(item))


@router.put("/currencies/{currency_id}", response_model=ResponseModel)
async def update_currency(
    currency_id: int,
    data: CurrencyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Currency).where(
        Currency.id == currency_id,
        Currency.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Currency not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=CurrencyResponse.model_validate(item))


@router.delete("/currencies/{currency_id}", response_model=ResponseModel)
async def delete_currency(
    currency_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Currency).where(
        Currency.id == currency_id,
        Currency.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Currency not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Currency deleted")


# ── Countries ────────────────────────────────────────────────────

@router.get("/countries", response_model=PaginatedResponse)
async def list_countries(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Country).where(Country.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(Country).where(Country.deleted_at.is_(None))

    if search:
        query = query.where(Country.name.ilike(f"%{search}%"))
        count_query = count_query.where(Country.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[CountryResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/countries/{country_id}", response_model=ResponseModel)
async def get_country(
    country_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Country).where(
        Country.id == country_id,
        Country.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Country not found")
    return ResponseModel(data=CountryResponse.model_validate(item))


@router.post("/countries", response_model=ResponseModel, status_code=201)
async def create_country(
    data: CountryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    item = Country(**data.model_dump())
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=CountryResponse.model_validate(item))


@router.put("/countries/{country_id}", response_model=ResponseModel)
async def update_country(
    country_id: int,
    data: CountryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Country).where(
        Country.id == country_id,
        Country.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Country not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=CountryResponse.model_validate(item))


@router.delete("/countries/{country_id}", response_model=ResponseModel)
async def delete_country(
    country_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Country).where(
        Country.id == country_id,
        Country.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Country not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Country deleted")


# ── States ───────────────────────────────────────────────────────

@router.get("/states", response_model=PaginatedResponse)
async def list_states(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    country_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(State).where(State.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(State).where(State.deleted_at.is_(None))

    if country_id:
        query = query.where(State.country_id == country_id)
        count_query = count_query.where(State.country_id == country_id)

    if search:
        query = query.where(State.name.ilike(f"%{search}%"))
        count_query = count_query.where(State.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[StateResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/states/{state_id}", response_model=ResponseModel)
async def get_state(
    state_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(State).where(
        State.id == state_id,
        State.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="State not found")
    return ResponseModel(data=StateResponse.model_validate(item))


@router.post("/states", response_model=ResponseModel, status_code=201)
async def create_state(
    data: StateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    item = State(**data.model_dump())
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=StateResponse.model_validate(item))


@router.put("/states/{state_id}", response_model=ResponseModel)
async def update_state(
    state_id: int,
    data: StateUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(State).where(
        State.id == state_id,
        State.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="State not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=StateResponse.model_validate(item))


@router.delete("/states/{state_id}", response_model=ResponseModel)
async def delete_state(
    state_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(State).where(
        State.id == state_id,
        State.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="State not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="State deleted")


# ── Cities ───────────────────────────────────────────────────────

@router.get("/cities", response_model=PaginatedResponse)
async def list_cities(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    state_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(City).where(City.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(City).where(City.deleted_at.is_(None))

    if state_id:
        query = query.where(City.state_id == state_id)
        count_query = count_query.where(City.state_id == state_id)

    if search:
        query = query.where(City.name.ilike(f"%{search}%"))
        count_query = count_query.where(City.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[CityResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/cities/{city_id}", response_model=ResponseModel)
async def get_city(
    city_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(City).where(
        City.id == city_id,
        City.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="City not found")
    return ResponseModel(data=CityResponse.model_validate(item))


@router.post("/cities", response_model=ResponseModel, status_code=201)
async def create_city(
    data: CityCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    item = City(**data.model_dump())
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=CityResponse.model_validate(item))


@router.put("/cities/{city_id}", response_model=ResponseModel)
async def update_city(
    city_id: int,
    data: CityUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(City).where(
        City.id == city_id,
        City.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="City not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=CityResponse.model_validate(item))


@router.delete("/cities/{city_id}", response_model=ResponseModel)
async def delete_city(
    city_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(City).where(
        City.id == city_id,
        City.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="City not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="City deleted")


# ── Units ────────────────────────────────────────────────────────

@router.get("/units", response_model=PaginatedResponse)
async def list_units(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Unit).where(Unit.deleted_at.is_(None))
    count_query = select(sa_func.count()).select_from(Unit).where(Unit.deleted_at.is_(None))

    if search:
        query = query.where(Unit.name.ilike(f"%{search}%"))
        count_query = count_query.where(Unit.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[UnitResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/units/{unit_id}", response_model=ResponseModel)
async def get_unit(
    unit_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Unit).where(
        Unit.id == unit_id,
        Unit.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Unit not found")
    return ResponseModel(data=UnitResponse.model_validate(item))


@router.post("/units", response_model=ResponseModel, status_code=201)
async def create_unit(
    data: UnitCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    item = Unit(**data.model_dump())
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=UnitResponse.model_validate(item))


@router.put("/units/{unit_id}", response_model=ResponseModel)
async def update_unit(
    unit_id: int,
    data: UnitUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Unit).where(
        Unit.id == unit_id,
        Unit.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Unit not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=UnitResponse.model_validate(item))


@router.delete("/units/{unit_id}", response_model=ResponseModel)
async def delete_unit(
    unit_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Unit).where(
        Unit.id == unit_id,
        Unit.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Unit not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Unit deleted")


# ═══════════════════════════════════════════════════════════════════
#  COMPANY-FILTERED ENTITIES
# ═══════════════════════════════════════════════════════════════════


# ── Tax Codes ────────────────────────────────────────────────────

@router.get("/tax-codes", response_model=PaginatedResponse)
async def list_tax_codes(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(TaxCode).where(
        TaxCode.company_id == current_user.company_id,
        TaxCode.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(TaxCode).where(
        TaxCode.company_id == current_user.company_id,
        TaxCode.deleted_at.is_(None),
    )

    if search:
        query = query.where(TaxCode.name.ilike(f"%{search}%"))
        count_query = count_query.where(TaxCode.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[TaxCodeResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/tax-codes/{tax_code_id}", response_model=ResponseModel)
async def get_tax_code(
    tax_code_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(TaxCode).where(
        TaxCode.id == tax_code_id,
        TaxCode.company_id == current_user.company_id,
        TaxCode.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Tax code not found")
    return ResponseModel(data=TaxCodeResponse.model_validate(item))


@router.post("/tax-codes", response_model=ResponseModel, status_code=201)
async def create_tax_code(
    data: TaxCodeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    item = TaxCode(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=TaxCodeResponse.model_validate(item))


@router.put("/tax-codes/{tax_code_id}", response_model=ResponseModel)
async def update_tax_code(
    tax_code_id: int,
    data: TaxCodeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(TaxCode).where(
        TaxCode.id == tax_code_id,
        TaxCode.company_id == current_user.company_id,
        TaxCode.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Tax code not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=TaxCodeResponse.model_validate(item))


@router.delete("/tax-codes/{tax_code_id}", response_model=ResponseModel)
async def delete_tax_code(
    tax_code_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(TaxCode).where(
        TaxCode.id == tax_code_id,
        TaxCode.company_id == current_user.company_id,
        TaxCode.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Tax code not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Tax code deleted")


# ── Payment Terms ────────────────────────────────────────────────

@router.get("/payment-terms", response_model=PaginatedResponse)
async def list_payment_terms(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(PaymentTerm).where(
        PaymentTerm.company_id == current_user.company_id,
        PaymentTerm.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(PaymentTerm).where(
        PaymentTerm.company_id == current_user.company_id,
        PaymentTerm.deleted_at.is_(None),
    )

    if search:
        query = query.where(PaymentTerm.name.ilike(f"%{search}%"))
        count_query = count_query.where(PaymentTerm.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[PaymentTermResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/payment-terms/{payment_term_id}", response_model=ResponseModel)
async def get_payment_term(
    payment_term_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(PaymentTerm).where(
        PaymentTerm.id == payment_term_id,
        PaymentTerm.company_id == current_user.company_id,
        PaymentTerm.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Payment term not found")
    return ResponseModel(data=PaymentTermResponse.model_validate(item))


@router.post("/payment-terms", response_model=ResponseModel, status_code=201)
async def create_payment_term(
    data: PaymentTermCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    item = PaymentTerm(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=PaymentTermResponse.model_validate(item))


@router.put("/payment-terms/{payment_term_id}", response_model=ResponseModel)
async def update_payment_term(
    payment_term_id: int,
    data: PaymentTermUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(PaymentTerm).where(
        PaymentTerm.id == payment_term_id,
        PaymentTerm.company_id == current_user.company_id,
        PaymentTerm.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Payment term not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=PaymentTermResponse.model_validate(item))


@router.delete("/payment-terms/{payment_term_id}", response_model=ResponseModel)
async def delete_payment_term(
    payment_term_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(PaymentTerm).where(
        PaymentTerm.id == payment_term_id,
        PaymentTerm.company_id == current_user.company_id,
        PaymentTerm.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Payment term not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Payment term deleted")


# ── Shipping Methods ─────────────────────────────────────────────

@router.get("/shipping-methods", response_model=PaginatedResponse)
async def list_shipping_methods(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(ShippingMethod).where(
        ShippingMethod.company_id == current_user.company_id,
        ShippingMethod.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(ShippingMethod).where(
        ShippingMethod.company_id == current_user.company_id,
        ShippingMethod.deleted_at.is_(None),
    )

    if search:
        query = query.where(ShippingMethod.name.ilike(f"%{search}%"))
        count_query = count_query.where(ShippingMethod.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[ShippingMethodResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/shipping-methods/{shipping_method_id}", response_model=ResponseModel)
async def get_shipping_method(
    shipping_method_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(ShippingMethod).where(
        ShippingMethod.id == shipping_method_id,
        ShippingMethod.company_id == current_user.company_id,
        ShippingMethod.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Shipping method not found")
    return ResponseModel(data=ShippingMethodResponse.model_validate(item))


@router.post("/shipping-methods", response_model=ResponseModel, status_code=201)
async def create_shipping_method(
    data: ShippingMethodCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    item = ShippingMethod(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=ShippingMethodResponse.model_validate(item))


@router.put("/shipping-methods/{shipping_method_id}", response_model=ResponseModel)
async def update_shipping_method(
    shipping_method_id: int,
    data: ShippingMethodUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(ShippingMethod).where(
        ShippingMethod.id == shipping_method_id,
        ShippingMethod.company_id == current_user.company_id,
        ShippingMethod.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Shipping method not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=ShippingMethodResponse.model_validate(item))


@router.delete("/shipping-methods/{shipping_method_id}", response_model=ResponseModel)
async def delete_shipping_method(
    shipping_method_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(ShippingMethod).where(
        ShippingMethod.id == shipping_method_id,
        ShippingMethod.company_id == current_user.company_id,
        ShippingMethod.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Shipping method not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Shipping method deleted")


# ── Designations ─────────────────────────────────────────────────

@router.get("/designations", response_model=PaginatedResponse)
async def list_designations(
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    query = select(Designation).where(
        Designation.company_id == current_user.company_id,
        Designation.deleted_at.is_(None),
    )
    count_query = select(sa_func.count()).select_from(Designation).where(
        Designation.company_id == current_user.company_id,
        Designation.deleted_at.is_(None),
    )

    if search:
        query = query.where(Designation.name.ilike(f"%{search}%"))
        count_query = count_query.where(Designation.name.ilike(f"%{search}%"))

    total = (await db.execute(count_query)).scalar() or 0
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[DesignationResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/designations/{designation_id}", response_model=ResponseModel)
async def get_designation(
    designation_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Designation).where(
        Designation.id == designation_id,
        Designation.company_id == current_user.company_id,
        Designation.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Designation not found")
    return ResponseModel(data=DesignationResponse.model_validate(item))


@router.post("/designations", response_model=ResponseModel, status_code=201)
async def create_designation(
    data: DesignationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    item = Designation(**data.model_dump(exclude={"company_id"}), company_id=current_user.company_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=DesignationResponse.model_validate(item))


@router.put("/designations/{designation_id}", response_model=ResponseModel)
async def update_designation(
    designation_id: int,
    data: DesignationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Designation).where(
        Designation.id == designation_id,
        Designation.company_id == current_user.company_id,
        Designation.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Designation not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    await db.flush()
    await db.refresh(item)
    return ResponseModel(data=DesignationResponse.model_validate(item))


@router.delete("/designations/{designation_id}", response_model=ResponseModel)
async def delete_designation(
    designation_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_company),
):
    result = await db.execute(select(Designation).where(
        Designation.id == designation_id,
        Designation.company_id == current_user.company_id,
        Designation.deleted_at.is_(None),
    ))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Designation not found")
    item.deleted_at = datetime.utcnow()
    await db.flush()
    return ResponseModel(message="Designation deleted")
