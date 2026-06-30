from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, field_validator

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role_id: Optional[int] = None
    branch_id: Optional[int] = None
    company_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role_id: Optional[int] = None
    branch_id: Optional[int] = None
    status: Optional[str] = None

class UserResponse(UserBase):
    id: int
    status: str
    last_login: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserProfileResponse(UserResponse):
    """Extended user response with role name and permissions for frontend."""
    role_name: Optional[str] = None
    role_permissions: Optional[Dict[str, Any]] = None
    employee_id: Optional[int] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    photo_url: Optional[str] = None
    employee_code: Optional[str] = None
    department_name: Optional[str] = None
    branch_name: Optional[str] = None
    created_at_display: Optional[str] = None


class ProfileUpdate(BaseModel):
    """Update current user's profile (name, phone, designation)."""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None


class PasswordChange(BaseModel):
    """Change password with current password verification."""
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: int
    company_id: Optional[int] = None
    exp: datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    company_name: Optional[str] = None
