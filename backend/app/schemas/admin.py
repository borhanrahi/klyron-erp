from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel


# ─── Permission constants ─────────────────────────────────────────

PERMISSION_ACTIONS = ["view", "create", "edit", "delete", "approve"]

# All ERP modules organized by group
PERMISSION_MODULES: Dict[str, List[Dict[str, str]]] = {
    "Dashboard": [
        {"id": "dashboard.executive", "label": "Executive Dashboard"},
        {"id": "dashboard.team", "label": "Team Dashboard"},
        {"id": "dashboard.reports", "label": "Reports"},
    ],
    "Sales": [
        {"id": "sales.orders", "label": "Orders"},
        {"id": "sales.leads", "label": "Leads"},
        {"id": "sales.deals", "label": "Deals"},
        {"id": "sales.quotations", "label": "Quotations"},
        {"id": "sales.customers", "label": "Customers"},
        {"id": "sales.contracts", "label": "Contracts"},
        {"id": "sales.campaigns", "label": "Campaigns"},
    ],
    "Finance": [
        {"id": "finance.ledger", "label": "General Ledger"},
        {"id": "finance.invoices", "label": "Invoices"},
        {"id": "finance.journal", "label": "Journal Entries"},
        {"id": "finance.credit_notes", "label": "Credit Notes"},
        {"id": "finance.banking", "label": "Banking"},
        {"id": "finance.estimates", "label": "Estimates"},
    ],
    "Procurement": [
        {"id": "procurement.requisitions", "label": "Purchase Requisitions"},
        {"id": "procurement.rfq", "label": "RFQs"},
        {"id": "procurement.purchase_orders", "label": "Purchase Orders"},
        {"id": "procurement.grn", "label": "GRN"},
        {"id": "procurement.suppliers", "label": "Suppliers"},
    ],
    "Inventory": [
        {"id": "inventory.items", "label": "Items"},
        {"id": "inventory.stock", "label": "Stock"},
        {"id": "inventory.warehouses", "label": "Warehouses"},
        {"id": "inventory.adjustments", "label": "Adjustments"},
    ],
    "HR": [
        {"id": "hr.employees", "label": "Employees"},
        {"id": "hr.teams", "label": "Teams"},
        {"id": "hr.org_chart", "label": "Org Chart"},
        {"id": "hr.my_team", "label": "My Team (Supervisor)"},
        {"id": "hr.attendance", "label": "Attendance"},
        {"id": "hr.leaves", "label": "Leave Management"},
        {"id": "hr.payroll", "label": "Payroll"},
        {"id": "hr.loans", "label": "Loans & Advances"},
        {"id": "hr.recruitment", "label": "Recruitment"},
        {"id": "hr.training", "label": "Training"},
        {"id": "hr.performance", "label": "Performance"},
    ],
    "Management": [
        {"id": "mgmt.dashboard", "label": "Management Dashboard"},
        {"id": "mgmt.my_team", "label": "My Team"},
        {"id": "mgmt.leave_approvals", "label": "Leave Approvals"},
        {"id": "mgmt.loan_approvals", "label": "Loan Approvals"},
        {"id": "mgmt.attendance", "label": "Team Attendance"},
        {"id": "mgmt.tasks", "label": "Task Management"},
        {"id": "mgmt.performance", "label": "Performance Reviews"},
    ],
    "Employee Self-Service": [
        {"id": "ess.profile", "label": "My Profile"},
        {"id": "ess.attendance", "label": "Attendance"},
        {"id": "ess.leave", "label": "Leave"},
        {"id": "ess.payroll", "label": "Payroll"},
        {"id": "ess.loans", "label": "Apply for Loan"},
        {"id": "ess.benefits", "label": "Benefits"},
        {"id": "ess.documents", "label": "Documents"},
        {"id": "ess.support", "label": "Support"},
    ],
    "CRM": [
        {"id": "crm.inquiries", "label": "Inquiries"},
        {"id": "crm.campaigns", "label": "Campaigns"},
    ],
    "POS": [
        {"id": "pos.terminal", "label": "Terminal"},
        {"id": "pos.history", "label": "History"},
        {"id": "pos.reports", "label": "Reports"},
    ],
    "Projects": [
        {"id": "projects.projects", "label": "Projects"},
        {"id": "projects.tasks", "label": "Tasks"},
        {"id": "projects.bugs", "label": "Bugs"},
        {"id": "projects.timesheets", "label": "Timesheets"},
    ],
    "Support": [
        {"id": "support.tickets", "label": "Tickets"},
        {"id": "support.knowledge_base", "label": "Knowledge Base"},
    ],
    "Administration": [
        {"id": "admin.company", "label": "Company Profile"},
        {"id": "admin.branches", "label": "Branches"},
        {"id": "admin.roles", "label": "Roles & Permissions"},
        {"id": "admin.users", "label": "User Management"},
        {"id": "admin.audit_logs", "label": "Audit Logs"},
        {"id": "admin.settings", "label": "System Settings"},
        {"id": "admin.workflows", "label": "Workflow Builder"},
    ],
    "Settings": [
        {"id": "settings.profile", "label": "Profile"},
        {"id": "settings.billing", "label": "Billing"},
        {"id": "settings.theme", "label": "Theme"},
        {"id": "settings.notifications", "label": "Notifications"},
    ],
}

# Type alias for a permission entry: { "module_id": { "view": true, "create": false, ... } }
PermissionDict = Dict[str, Dict[str, bool]]


def get_default_permissions(full_access: bool = False) -> PermissionDict:
    """Generate default permissions for all modules, optionally with full access."""
    result = {}
    for group, modules in PERMISSION_MODULES.items():
        for mod in modules:
            mid = mod["id"]
            if full_access:
                result[mid] = {action: True for action in PERMISSION_ACTIONS}
            else:
                result[mid] = {action: False for action in PERMISSION_ACTIONS}
    return result


# ─── Role ────────────────────────────────────────────────────────

class RoleBase(BaseModel):
    name: str
    description: str = ""
    permissions_json: PermissionDict = {}
    is_system: bool = False


class RoleCreate(BaseModel):
    name: str
    description: str = ""
    permissions_json: PermissionDict = {}


class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    permissions_json: Optional[PermissionDict] = None


class RoleResponse(RoleBase):
    id: int
    company_id: Optional[int] = None
    created_at: datetime
    user_count: int = 0

    class Config:
        from_attributes = True


# ─── Permissions Config Response ─────────────────────────────────

class PermissionModuleInfo(BaseModel):
    id: str
    label: str


class PermissionGroupInfo(BaseModel):
    group: str
    modules: List[PermissionModuleInfo]


class PermissionsConfigResponse(BaseModel):
    groups: List[PermissionGroupInfo]
    actions: List[str]


# ─── Company ─────────────────────────────────────────────────────

class CompanyBase(BaseModel):
    name: str
    slug: str
    plan_id: Optional[int] = None
    logo_url: Optional[str] = None
    settings_json: dict = {}
    is_active: bool = True


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    plan_id: Optional[int] = None
    logo_url: Optional[str] = None
    settings_json: Optional[dict] = None
    is_active: Optional[bool] = None


class CompanyResponse(CompanyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Department ──────────────────────────────────────────────────

class DepartmentBase(BaseModel):
    company_id: Optional[int] = None
    name: str
    head_id: Optional[int] = None
    parent_id: Optional[int] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    head_id: Optional[int] = None
    parent_id: Optional[int] = None


class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── AuditLog ────────────────────────────────────────────────────

class AuditLogBase(BaseModel):
    company_id: Optional[int] = None
    user_id: int
    action: str
    entity_type: str
    entity_id: Optional[int] = None
    old_json: Optional[dict] = None
    new_json: Optional[dict] = None
    ip: Optional[str] = None


class AuditLogCreate(AuditLogBase):
    pass


class AuditLogUpdate(BaseModel):
    action: Optional[str] = None
    entity_type: Optional[str] = None
    entity_id: Optional[int] = None
    old_json: Optional[dict] = None
    new_json: Optional[dict] = None
    ip: Optional[str] = None


class AuditLogResponse(AuditLogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Notification ────────────────────────────────────────────────

class NotificationBase(BaseModel):
    user_id: int
    title: str
    message: str
    is_read: bool = False
    link: Optional[str] = None


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
    is_read: Optional[bool] = None
    link: Optional[str] = None


class NotificationResponse(NotificationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
