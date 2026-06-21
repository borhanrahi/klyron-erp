from typing import Any, Optional
from datetime import datetime
from pydantic import BaseModel

class ResponseModel(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Any = None

class PaginationParams(BaseModel):
    page: int = 1
    per_page: int = 25
    sort_by: Optional[str] = None
    sort_order: str = "desc"
    search: Optional[str] = None

class PaginatedResponse(BaseModel):
    items: list = []
    total: int = 0
    page: int = 1
    per_page: int = 25
    pages: int = 0

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    details: Optional[dict] = None
