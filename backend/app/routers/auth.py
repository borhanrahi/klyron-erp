import base64
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.database import get_db
from app.models.auth import User
from app.schemas.auth import (
    UserCreate, UserResponse, UserProfileResponse, ProfileUpdate, PasswordChange,
    Token, LoginRequest, RegisterRequest
)
from app.utils.hashing import verify_password, get_password_hash
from app.utils.jwt import (
    create_access_token, create_refresh_token, decode_token
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user

@router.post("/login", response_model=Token)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    access_token = create_access_token(data={"sub": str(user.id), "company_id": user.company_id})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    return Token(access_token=access_token, refresh_token=refresh_token)

@router.post("/register", response_model=UserResponse)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == request.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    user = User(
        email=request.email,
        full_name=request.full_name,
        password_hash=get_password_hash(request.password)
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.get("/me", response_model=UserProfileResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Return current user profile with role name, permissions, and employee details."""
    from app.models.auth import Role, Branch, Department
    from app.models.hr import Employee

    role_name = None
    role_permissions = None
    if current_user.role_id:
        result = await db.execute(select(Role).where(Role.id == current_user.role_id))
        role = result.scalar_one_or_none()
        if role:
            role_name = role.name
            role_permissions = role.permissions_json

    # Query employee record for this user
    phone = None
    designation = None
    photo_url = None
    employee_id = None
    employee_code = None
    department_name = None

    emp_result = await db.execute(
        select(Employee).where(
            Employee.user_id == current_user.id,
            Employee.company_id == current_user.company_id,
            Employee.deleted_at.is_(None),
        )
    )
    employee = emp_result.scalar_one_or_none()

    if employee:
        employee_id = employee.id
        phone = employee.phone
        designation = employee.designation
        photo_url = employee.photo_url
        employee_code = employee.employee_code

        if employee.department_id:
            dept_result = await db.execute(select(Department.name).where(Department.id == employee.department_id))
            department_name = dept_result.scalar_one_or_none()

    # Branch name
    branch_name = None
    if current_user.branch_id:
        branch_result = await db.execute(select(Branch.name).where(Branch.id == current_user.branch_id))
        branch_name = branch_result.scalar_one_or_none()

    profile = UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role_id=current_user.role_id,
        branch_id=current_user.branch_id,
        company_id=current_user.company_id,
        status=current_user.status,
        last_login=current_user.last_login,
        created_at=current_user.created_at,
        role_name=role_name,
        role_permissions=role_permissions,
        employee_id=employee_id,
        phone=phone,
        designation=designation,
        photo_url=photo_url,
        employee_code=employee_code,
        department_name=department_name,
        branch_name=branch_name,
        created_at_display=str(current_user.created_at) if current_user.created_at else None,
    )
    return profile

@router.put("/profile", response_model=UserProfileResponse)
async def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's profile (name, phone, designation)."""
    from app.models.hr import Employee

    # Update user full_name if provided
    if data.full_name is not None:
        current_user.full_name = data.full_name

    # Update employee fields if employee record exists
    if data.phone is not None or data.designation is not None:
        emp_result = await db.execute(
            select(Employee).where(
                Employee.user_id == current_user.id,
                Employee.company_id == current_user.company_id,
                Employee.deleted_at.is_(None),
            )
        )
        employee = emp_result.scalar_one_or_none()
        if employee:
            if data.phone is not None:
                employee.phone = data.phone
            if data.designation is not None:
                employee.designation = data.designation

    await db.flush()
    await db.refresh(current_user)

    # Return updated profile (same as GET /me)
    return await get_me(current_user=current_user, db=db)


@router.post("/profile/password", status_code=200)
async def change_password(
    data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change password after verifying current password."""
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    current_user.password_hash = get_password_hash(data.new_password)
    await db.flush()

    return {"message": "Password updated successfully"}


@router.post("/profile/avatar", response_model=UserProfileResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload profile picture. Stores as base64 in the employee's photo_url."""
    from app.models.hr import Employee

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (JPG, PNG, GIF)")

    content = await file.read()
    if len(content) > 2 * 1024 * 1024:  # 2MB limit
        raise HTTPException(status_code=400, detail="Image must be under 2MB")

    # Check if user has an employee record
    emp_result = await db.execute(
        select(Employee).where(
            Employee.user_id == current_user.id,
            Employee.company_id == current_user.company_id,
            Employee.deleted_at.is_(None),
        )
    )
    employee = emp_result.scalar_one_or_none()

    b64_data = base64.b64encode(content).decode("utf-8")
    data_url = f"data:{file.content_type};base64,{b64_data}"

    if employee:
        employee.photo_url = data_url
    else:
        # If user doesn't have an employee record, store directly on user (no field yet)
        # We skip this case — the employee record should exist
        raise HTTPException(status_code=400, detail="No employee record found. Please contact HR.")

    await db.flush()

    return await get_me(current_user=current_user, db=db)


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_db)):
    payload = decode_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    new_access_token = create_access_token(data={"sub": str(user.id), "company_id": user.company_id})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    return Token(access_token=new_access_token, refresh_token=new_refresh_token)
