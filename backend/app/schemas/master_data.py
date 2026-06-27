from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# ─── Currency ────────────────────────────────────────────────────

class CurrencyBase(BaseModel):
    code: str
    name: str
    symbol: str
    is_default: bool = False


class CurrencyCreate(CurrencyBase):
    pass


class CurrencyUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    symbol: Optional[str] = None
    is_default: Optional[bool] = None


class CurrencyResponse(CurrencyBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Country ─────────────────────────────────────────────────────

class CountryBase(BaseModel):
    code: str
    name: str
    phone_code: Optional[str] = None


class CountryCreate(CountryBase):
    pass


class CountryUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    phone_code: Optional[str] = None


class CountryResponse(CountryBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── State ───────────────────────────────────────────────────────

class StateBase(BaseModel):
    country_id: int
    code: str
    name: str


class StateCreate(StateBase):
    pass


class StateUpdate(BaseModel):
    country_id: Optional[int] = None
    code: Optional[str] = None
    name: Optional[str] = None


class StateResponse(StateBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── City ────────────────────────────────────────────────────────

class CityBase(BaseModel):
    state_id: int
    name: str


class CityCreate(CityBase):
    pass


class CityUpdate(BaseModel):
    state_id: Optional[int] = None
    name: Optional[str] = None


class CityResponse(CityBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Unit ────────────────────────────────────────────────────────

class UnitBase(BaseModel):
    name: str
    symbol: str
    is_base: bool = False


class UnitCreate(UnitBase):
    pass


class UnitUpdate(BaseModel):
    name: Optional[str] = None
    symbol: Optional[str] = None
    is_base: Optional[bool] = None


class UnitResponse(UnitBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── TaxCode ─────────────────────────────────────────────────────

class TaxCodeBase(BaseModel):
    company_id: Optional[int] = None
    code: str
    name: str
    rate: float
    type: str
    is_active: bool = True


class TaxCodeCreate(TaxCodeBase):
    pass


class TaxCodeUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    rate: Optional[float] = None
    type: Optional[str] = None
    is_active: Optional[bool] = None


class TaxCodeResponse(TaxCodeBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── PaymentTerm ─────────────────────────────────────────────────

class PaymentTermBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    days: int
    is_active: bool = True


class PaymentTermCreate(PaymentTermBase):
    pass


class PaymentTermUpdate(BaseModel):
    name: Optional[str] = None
    days: Optional[int] = None
    is_active: Optional[bool] = None


class PaymentTermResponse(PaymentTermBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── ShippingMethod ──────────────────────────────────────────────

class ShippingMethodBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    base_cost: float
    is_active: bool = True


class ShippingMethodCreate(ShippingMethodBase):
    pass


class ShippingMethodUpdate(BaseModel):
    name: Optional[str] = None
    base_cost: Optional[float] = None
    is_active: Optional[bool] = None


class ShippingMethodResponse(ShippingMethodBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Designation ─────────────────────────────────────────────────

class DesignationBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    department_id: Optional[int] = None
    grade_level: Optional[str] = None
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    is_active: bool = True


class DesignationCreate(DesignationBase):
    pass


class DesignationUpdate(BaseModel):
    name: Optional[str] = None
    department_id: Optional[int] = None
    grade_level: Optional[str] = None
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    is_active: Optional[bool] = None


class DesignationResponse(DesignationBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True
