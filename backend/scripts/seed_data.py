"""
Klyron ERP — Database Seed Script
Populates the database with realistic employee, HR, and operational data.

Usage:
    cd backend
    uv run python scripts/seed_data.py
"""

import asyncio
import random
import sys
import os
from datetime import date, datetime, timedelta
from decimal import Decimal

# Add backend dir to path so app.schemas.admin is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Windows encoding fix
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import text
import json

DATABASE_URL = "postgresql+asyncpg://klyron_borhan:klyron123@localhost:5433/klyron_erp"

# ─── Helpers ──────────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Hash password using passlib bcrypt (same as app)."""
    from passlib.context import CryptContext
    ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return ctx.hash(password)


def random_date(start: date, end: date) -> date:
    delta = (end - start).days
    return start + timedelta(days=random.randint(0, delta))


def random_phone() -> str:
    prefixes = ["017", "018", "019", "013", "016", "015"]
    return f"+880{random.choice(prefixes)}{random.randint(10000000, 99999999)}"


# ─── Data ─────────────────────────────────────────────────────────────────────

DEPARTMENTS = [
    ("Engineering", "ENG"),
    ("Product", "PRD"),
    ("Design", "DSN"),
    ("Marketing", "MKT"),
    ("Sales", "SAL"),
    ("Finance", "FIN"),
    ("Human Resources", "HRS"),
    ("Operations", "OPS"),
    ("Customer Support", "SUP"),
    ("Quality Assurance", "QA"),
]

DESIGNATIONS = {
    "Engineering": ["Software Engineer", "Senior Software Engineer", "Lead Engineer", "DevOps Engineer", "QA Engineer", "Tech Lead", "CTO"],
    "Product": ["Product Manager", "Senior Product Manager", "Product Analyst", "VP Product"],
    "Design": ["UI/UX Designer", "Senior Designer", "Graphic Designer", "Design Lead"],
    "Marketing": ["Marketing Specialist", "Content Writer", "SEO Analyst", "Marketing Manager", "CMO"],
    "Sales": ["Sales Executive", "Senior Sales Executive", "Sales Manager", "Account Executive", "VP Sales"],
    "Finance": ["Accountant", "Senior Accountant", "Financial Analyst", "Finance Manager", "CFO"],
    "Human Resources": ["HR Executive", "HR Manager", "Recruiter", "HR Director"],
    "Operations": ["Operations Executive", "Operations Manager", "Logistics Coordinator"],
    "Customer Support": ["Support Executive", "Senior Support Executive", "Support Lead"],
    "Quality Assurance": ["QA Analyst", "QA Lead", "QA Manager"],
}

EMPLOYEES = [
    # (first, last, gender, dept, designation_key, salary, joining_offset_days, blood, marital, nationality)
    ("Rahim", "Uddin", "male", "Engineering", "Senior Software Engineer", 95000, -365, "O+", "Married", "Bangladeshi"),
    ("Fatima", "Akter", "female", "Engineering", "Software Engineer", 75000, -200, "A+", "Single", "Bangladeshi"),
    ("Kamal", "Hossain", "male", "Engineering", "Tech Lead", 120000, -730, "B+", "Married", "Bangladeshi"),
    ("Nusrat", "Jahan", "female", "Engineering", "DevOps Engineer", 88000, -150, "AB+", "Single", "Bangladeshi"),
    ("Arif", "Hasan", "male", "Engineering", "QA Engineer", 65000, -90, "O-", "Single", "Bangladeshi"),
    ("Sumaiya", "Rahman", "female", "Product", "Product Manager", 110000, -400, "A-", "Married", "Bangladeshi"),
    ("Tanvir", "Ahmed", "male", "Design", "UI/UX Designer", 72000, -250, "B-", "Single", "Bangladeshi"),
    ("Sabrina", "Islam", "female", "Design", "Senior Designer", 85000, -500, "O+", "Married", "Bangladeshi"),
    ("Md", "Karim", "male", "Marketing", "Marketing Manager", 90000, -300, "A+", "Married", "Bangladeshi"),
    ("Tasnim", "Fahmida", "female", "Marketing", "Content Writer", 55000, -120, "B+", "Single", "Bangladeshi"),
    ("Jubayer", "Hossain", "male", "Sales", "Sales Manager", 98000, -450, "O+", "Married", "Bangladeshi"),
    ("Farhana", "Parveen", "female", "Sales", "Account Executive", 62000, -80, "AB+", "Single", "Bangladeshi"),
    ("Imran", "Khan", "male", "Finance", "Finance Manager", 105000, -600, "A+", "Married", "Bangladeshi"),
    ("Nadia", "Sultana", "female", "Finance", "Accountant", 60000, -180, "B-", "Single", "Bangladeshi"),
    ("Anisur", "Rahman", "male", "Human Resources", "HR Manager", 88000, -550, "O+", "Married", "Bangladeshi"),
    ("Mst", "Khatun", "female", "Human Resources", "HR Executive", 52000, -100, "A-", "Single", "Bangladeshi"),
    ("Zahid", "Hassan", "male", "Operations", "Operations Manager", 82000, -350, "B+", "Married", "Bangladeshi"),
    ("Ruma", "Akhter", "female", "Customer Support", "Support Lead", 68000, -220, "AB-", "Single", "Bangladeshi"),
    ("Sohel", "Rana", "male", "Quality Assurance", "QA Manager", 78000, -400, "O+", "Married", "Bangladeshi"),
    ("Ayesha", "Khanam", "female", "Engineering", "Software Engineer", 70000, -60, "A+", "Single", "Bangladeshi"),
    ("Badrul", "Alam", "male", "Engineering", "Software Engineer", 72000, -45, "B+", "Single", "Bangladeshi"),
    ("Shirin", "Sultana", "female", "Product", "Product Analyst", 65000, -130, "O-", "Single", "Bangladeshi"),
    ("Rakibul", "Islam", "male", "Sales", "Sales Executive", 55000, -70, "A+", "Single", "Bangladeshi"),
    ("Jahanara", "Begum", "female", "Finance", "Senior Accountant", 75000, -500, "B-", "Married", "Bangladeshi"),
]

USERS_DATA = [
    ("borhanuddin.bd2026@gmail.com", "Borhan Uddin", "Admin@123456"),
    ("rahim@klyron.com", "Rahim Uddin", "password123"),
    ("fatima@klyron.com", "Fatima Akter", "password123"),
    ("kamal@klyron.com", "Kamal Hossain", "password123"),
    ("nusrat@klyron.com", "Nusrat Jahan", "password123"),
    ("arif@klyron.com", "Arif Hasan", "password123"),
    ("sumaiya@klyron.com", "Sumaiya Rahman", "password123"),
    ("tanvir@klyron.com", "Tanvir Ahmed", "password123"),
    ("sabrina@klyron.com", "Sabrina Islam", "password123"),
    ("karim@klyron.com", "Md Karim", "password123"),
    ("tasnim@klyron.com", "Tasnim Fahmida", "password123"),
    ("jubayer@klyron.com", "Jubayer Hossain", "password123"),
    ("farhana@klyron.com", "Farhana Parveen", "password123"),
    ("imran@klyron.com", "Imran Khan", "password123"),
    ("nadia@klyron.com", "Nadia Sultana", "password123"),
    ("anisur@klyron.com", "Anisur Rahman", "password123"),
    ("mst@klyron.com", "Mst Khatun", "password123"),
    ("zahid@klyron.com", "Zahid Hassan", "password123"),
    ("ruma@klyron.com", "Ruma Akhter", "password123"),
    ("sohel@klyron.com", "Sohel Rana", "password123"),
    ("ayesha@klyron.com", "Ayesha Khanam", "password123"),
    ("badrul@klyron.com", "Badrul Alam", "password123"),
    ("shirin@klyron.com", "Shirin Sultana", "password123"),
    ("rakibul@klyron.com", "Rakibul Islam", "password123"),
    ("jahanara@klyron.com", "Jahanara Begum", "password123"),
]


# ─── Main Seed Function ──────────────────────────────────────────────────────

async def seed():
    engine = create_async_engine(DATABASE_URL)
    Session = async_sessionmaker(engine, expire_on_commit=False)

    async with Session() as db:
        print("Seeding Klyron ERP database...")
        print("=" * 60)

        # ── 0. Clean existing data (TRUNCATE CASCADE handles FK dependencies) ─
        print("Cleaning existing data...")
        # Use TRUNCATE CASCADE to clean all tables regardless of FK dependencies
        # We specify tables in multiple groups to handle missing tables gracefully
        for table_group in [
            # Workflow
            "workflow_history", "workflow_approvals", "workflow_instances", "workflow_steps", "workflows",
            # HR child tables
            "appraisals", "certifications", "disciplinary_incidents", "disciplinary_actions",
            "offer_letters", "onboarding_checklists", "onboarding_tasks", "overtime_requests",
            "resignations", "clearance_checklists", "loans", "loan_installments",
            "training_enrollments", "trainings", "employee_benefits", "benefit_plans",
            "payroll_items", "payroll", "salary_structures", "salary_structure_components",
            "salary_components", "leave_balances", "leaves", "leave_policies",
            "leave_types", "attendance_policies", "payroll_policies",
            "attendance", "employee_documents", "employee_assets",
            "kpis", "performance_reviews", "employee_lifecycle", "employee_dependents",
            "holidays", "job_requisitions", "candidates", "interviews",
            "employment_types", "work_locations", "shifts",
            # Support
            "ticket_comments", "meetings", "tickets",
            # Sales
            "sales_order_items", "sales_orders", "delivery_notes",
            "quotation_items", "quotations", "deals",
            "inquiry_follow_ups", "inquiry_email_logs", "inquiries",
            "sales_campaigns", "customer_contracts", "leads",
            "customers",
            # Finance
            "invoice_items", "invoices", "credit_notes", "debit_notes",
            "estimate_items", "estimates", "expenses", "budgets",
            "transactions", "chart_of_accounts", "bank_transfers", "bank_accounts",
            "tax_rates",
            # Procurement
            "pr_items", "purchase_requisitions",
            "po_items", "purchase_orders",
            "grn_items", "grn",
            "supplier_payments", "requests_for_quotation", "suppliers",
            # Inventory
            "stock_take_items", "stock_takes",
            "stock_adjustments", "stock_transfers", "stock",
            "items", "item_categories", "warehouses",
            # POS
            "pos_receipts", "pos_sale_items", "pos_sales",
            "pos_sessions", "cash_registers",
            # Projects
            "project_notes", "project_expenses", "timesheets",
            "project_bugs", "project_tasks", "project_milestones", "projects",
            # Master data
            "currencies", "countries", "states", "cities", "units",
            "tax_codes", "payment_terms", "shipping_methods", "designations",
            # Portal
            "portal_sessions", "portal_users",
            # Subscription
            "payments", "subscriptions", "gateways",
            # Auth / System (these may be referenced by FK, so truncate cascade)
            "audit_logs", "notifications",
            "branches",
            "employees", "users", "departments", "roles",
        ]:
            try:
                await db.execute(text(f"TRUNCATE TABLE {table_group} CASCADE"))
            except Exception:
                pass  # Skip tables that don't exist
        await db.commit()
        print("  [OK] Cleaned existing data")

        # ── 1. Departments ──────────────────────────────────────────────
        print("Creating departments...")
        dept_ids = {}
        for name, code in DEPARTMENTS:
            r = await db.execute(
                text("INSERT INTO departments (name, code) VALUES (:n, :c) RETURNING id"),
                {"n": name, "c": code},
            )
            dept_ids[name] = r.scalar_one()
        await db.commit()
        print(f"  [OK] {len(DEPARTMENTS)} departments created")

        # ── 2. Roles ────────────────────────────────────────────────────
        print("Creating default roles...")
        from app.schemas.admin import get_default_permissions, PERMISSION_MODULES
        default_roles = [
            ("Admin", "Full system access within the company", True),
            ("Manager", "Department/team level management access", True),
            ("Supervisor", "Can view and approve team members' requests", True),
            ("HR Manager", "HR module management including payroll and loans", True),
            ("Finance Manager", "Financial operations and payment approvals", True),
            ("Employee", "Self-service access to own records", True),
            ("Viewer", "Read-only access to reports and dashboards", True),
        ]
        role_ids_map = {}
        for role_name, role_desc, is_sys in default_roles:
            perms = get_default_permissions(full_access=(role_name == "Admin"))
            # EVERY non-Admin role gets Dashboard + Employee (ESS) as BASELINE
            # Admin already has everything via get_default_permissions(True)
            # Then role-specific extra modules are added on top
            if role_name != "Admin":
                for mid in perms:
                    if mid.startswith("dashboard."):
                        perms[mid]["view"] = True
                    if mid.startswith("ess."):
                        perms[mid] = {a: True for a in ["view", "create"]}
            # Role-specific extras on top of baseline
            if role_name == "Manager":
                for mid in perms:
                    if mid.startswith("mgmt."):
                        perms[mid] = {a: True for a in ["view", "create", "edit", "approve"]}
                    if mid.startswith("sales.") or mid.startswith("projects.") or mid.startswith("support."):
                        perms[mid]["view"] = True
            elif role_name == "Supervisor":
                for mid in perms:
                    if mid.startswith("mgmt."):
                        perms[mid]["view"] = True
                        perms[mid]["approve"] = True
                    if mid.startswith("projects."):
                        perms[mid]["view"] = True
            elif role_name == "HR Manager":
                for mid in perms:
                    if mid.startswith("hr."):
                        perms[mid] = {a: True for a in ["view", "create", "edit", "approve"]}
            elif role_name == "Finance Manager":
                for mid in perms:
                    if mid.startswith("finance."):
                        perms[mid] = {a: True for a in ["view", "create", "edit", "approve"]}
            # Employee and Viewer roles fall through — baseline only

            r = await db.execute(
                text("INSERT INTO roles (name, description, permissions_json, is_system, company_id) VALUES (:n, :d, :p, :s, 1) RETURNING id"),
                {
                    "n": role_name,
                    "d": role_desc,
                    "p": json.dumps(perms),
                    "s": is_sys,
                },
            )
            role_id = r.scalar_one()
            role_ids_map[role_name] = role_id
        await db.commit()
        print(f"  [OK] {len(default_roles)} default roles created")

        # ── 3. Default Workflows ───────────────────────────────────────
        print("Creating default workflows...")
        hr_role_id = role_ids_map.get("HR Manager")
        fin_role_id = role_ids_map.get("Finance Manager")
        wf_result = await db.execute(
            text("INSERT INTO workflows (company_id, name, entity_type, is_active) VALUES (1, 'Loan Approval', 'loan', true) RETURNING id")
        )
        loan_wf_id = wf_result.scalar_one()

        # Workflow steps: Supervisor -> HR -> Finance
        steps_data = [
            (loan_wf_id, 1, 'Supervisor Approval', 'supervisor', None, None, None, 'approve'),
            (loan_wf_id, 2, 'HR Review', 'role', hr_role_id, None, None, 'approve'),
            (loan_wf_id, 3, 'Finance Approval', 'role', fin_role_id, None, None, 'approve'),
        ]
        for wf_id, step_order, name, app_type, app_id, min_amt, max_amt, action in steps_data:
            await db.execute(
                text("INSERT INTO workflow_steps (workflow_id, step_order, name, approver_type, approver_id, min_amount, max_amount, action) VALUES (:wf, :so, :n, :at, :ai, :mina, :maxa, :act)"),
                {"wf": wf_id, "so": step_order, "n": name, "at": app_type, "ai": app_id, "mina": min_amt, "maxa": max_amt, "act": action},
            )
        await db.commit()
        print(f"  [OK] 'Loan Approval' workflow created with 3 steps (Supervisor → HR → Finance)")

        # ── 4. Users ────────────────────────────────────────────────────
        print("Creating users...")
        user_ids = []
        # Assign roles based on actual job designations:
        #   borhanuddin (linked to EMP001/Rahim) -> Admin
        #   Department heads (Sumaiya, Sabrina, Karim, Jubayer, Anisur, Zahid, Sohel) -> Manager
        #   Team leads (Kamal/Tech Lead, Ruma/Support Lead) -> Supervisor
        #   Finance specialists (Imran/Finance Manager) -> Finance Manager
        #   HR lead -> HR Manager
        #   Everyone else -> Employee
        user_role_assignments = [
            #0=Admin      1=Emp       2=Emp       3=Supervisor 4=Emp     5=Emp
            "Admin",      "Employee", "Employee", "Supervisor", "Employee", "Employee",
            #6=Manager    7=Emp       8=Manager  9=Manager    10=Emp
            "Manager",    "Employee", "Manager", "Manager",    "Employee",
            #11=Manager   12=Emp      13=FinMgr  14=Emp        15=HRMgr
            "Manager",    "Employee", "Finance Manager", "Employee", "HR Manager",
            #16=Emp       17=Manager  18=Sup     19=Manager    20=Emp
            "Employee",   "Manager", "Supervisor", "Manager", "Employee",
            #21=Emp       22=Emp      23=Emp     24=Emp
            "Employee",   "Employee", "Employee", "Employee",
        ]
        for i, (email, full_name, password) in enumerate(USERS_DATA):
            role_name = user_role_assignments[i] if i < len(user_role_assignments) else "Employee"
            role_id = role_ids_map.get(role_name)
            r = await db.execute(
                text("INSERT INTO users (email, full_name, password_hash, role_id, company_id, status) VALUES (:e, :f, :p, :rid, 1, 'active') RETURNING id"),
                {"e": email, "f": full_name, "p": hash_password(password), "rid": role_id},
            )
            user_ids.append(r.scalar_one())
        await db.commit()
        print(f"  [OK] {len(USERS_DATA)} users created with role assignments")

        # ── 3. Employees ────────────────────────────────────────────────
        print("Creating employees...")
        emp_ids = []
        for i, (first, last, gender, dept, designation, salary, join_offset, blood, marital, nationality) in enumerate(EMPLOYEES):
            full_name = f"{first} {last}"
            joining_date = date.today() + timedelta(days=join_offset)
            dob = date(random.randint(1988, 2000), random.randint(1, 12), random.randint(1, 28))

            # Map user: first employee links to admin (user_ids[0]), rest to sequential users
            user_id = user_ids[i] if i < len(user_ids) else None

            r = await db.execute(
                text("""INSERT INTO employees
                    (company_id, user_id, employee_code, department_id, designation,
                     gender, date_of_birth, marital_status, blood_group, nationality,
                     phone, salary, joining_date, status, present_address, permanent_address,
                     emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
                     bank_name, bank_account_number, tax_id)
                VALUES
                    (1, :uid, :code, :did, :desig,
                     :gender, :dob, :marital, :blood, :nationality,
                     :phone, :salary, :joining, 'active', :addr, :addr,
                     :ec_name, :ec_phone, :ec_rel,
                     :bank, :acct, :tax)
                RETURNING id"""),
                {
                    "uid": user_id,
                    "code": f"EMP{i + 1:03d}",
                    "did": dept_ids.get(dept),
                    "desig": designation,
                    "gender": gender,
                    "dob": dob,
                    "marital": marital,
                    "blood": blood,
                    "nationality": nationality,
                    "phone": random_phone(),
                    "salary": salary,
                    "joining": joining_date,
                    "addr": f"House {random.randint(1, 50)}, Road {random.randint(1, 30)}, Dhaka",
                    "ec_name": f"{first} {random.choice(['Hossain', 'Khan', 'Ali', 'Begum'])} (Emergency)",
                    "ec_phone": random_phone(),
                    "ec_rel": random.choice(["Spouse", "Parent", "Sibling"]),
                    "bank": random.choice(["DBBL", "BRAC Bank", "City Bank", "UCB", "Prime Bank"]),
                    "acct": f"{random.randint(1000000000, 9999999999)}",
                    "tax": f"TAX-{random.randint(100000, 999999)}",
                },
            )
            emp_ids.append(r.scalar_one())
        await db.commit()
        print(f"  [OK] {len(EMPLOYEES)} employees created")

        # ── 3b. Set reporting_to relationships ───────────────────────────
        print("Setting reporting_to relationships...")
        # Reporting structure:
        #   emp_ids[0] (Rahim/EMP001, admin user) -> top-level manager
        #   Department heads report to Rahim, team members report to department heads
        reporting_map = {
            # Rahim (Engineering Lead) - linked to admin user, direct reports:
            0: None,  # Rahim - top level, no supervisor
            # People reporting to Rahim (emp_ids[0]):
            2: 0,  # Kamal (Tech Lead) -> Rahim
            1: 0,  # Fatima (SWE) -> Rahim
            3: 0,  # Nusrat (DevOps) -> Rahim
            4: 0,  # Arif (QA) -> Rahim
            19: 0, # Ayesha (SWE) -> Rahim
            20: 0, # Badrul (SWE) -> Rahim
            17: 0, # Ruma (Support Lead) -> Rahim
            18: 0, # Sohel (QA Manager) -> Rahim
            # Department heads (no supervisor):
            5: None,  # Sumaiya (Product Manager)
            7: None,  # Sabrina (Design Lead)
            8: None,  # Karim (Marketing Manager)
            10: None, # Jubayer (Sales Manager)
            12: None, # Imran (Finance Manager)
            14: None, # Anisur (HR Manager)
            16: None, # Zahid (Operations Manager)
            # Team members reporting to department heads:
            21: 5,  # Shirin (Product Analyst) -> Sumaiya
            6: 7,   # Tanvir (Designer) -> Sabrina
            9: 8,   # Tasnim (Content Writer) -> Karim
            11: 10, # Farhana (Account Exec) -> Jubayer
            22: 10, # Rakibul (Sales Exec) -> Jubayer
            13: 12, # Nadia (Accountant) -> Imran
            23: 12, # Jahanara (Sr. Accountant) -> Imran
            15: 14, # Mst (HR Exec) -> Anisur
        }
        for emp_idx, reports_to_idx in reporting_map.items():
            rt = emp_ids[reports_to_idx] if reports_to_idx is not None else None
            await db.execute(
                text("UPDATE employees SET reporting_to = :rt WHERE id = :eid"),
                {"rt": rt, "eid": emp_ids[emp_idx]},
            )
        await db.commit()
        print("  [OK] reporting_to relationships set for all employees")

        # ── 3c. Create Teams with Supervisors as leads ───────────────────
        print("Creating teams with supervisors as team leads...")
        # Team definitions: (name, description, lead_emp_idx, dept_name, member_emp_indices)
        teams_data = [
            ("Engineering Team", "Software development and infrastructure", 2, "Engineering",
             [1, 3, 4, 19, 20]),  # Fatima, Nusrat, Arif, Ayesha, Badrul
            ("Support Team", "Customer support and ticket resolution", 17, "Customer Support",
             []),  # Ruma leads but no other support team members
            ("Product Team", "Product strategy and roadmapping", 5, "Product",
             [21]),  # Sumaiya leads, Shirin is member
            ("Design Team", "UI/UX and graphic design", 7, "Design",
             [6]),  # Sabrina leads, Tanvir is member
            ("Marketing Team", "Brand, content and campaigns", 8, "Marketing",
             [9]),  # Karim leads, Tasnim is member
            ("Sales Team", "Revenue and client acquisition", 10, "Sales",
             [11, 22]),  # Jubayer leads, Farhana, Rakibul
            ("Finance Team", "Accounting and financial operations", 12, "Finance",
             [13, 23]),  # Imran leads, Nadia, Jahanara
            ("HR Team", "Human resources and employee relations", 14, "Human Resources",
             [15]),  # Anisur leads, Mst is member
            ("Operations Team", "Logistics and daily operations", 16, "Operations",
             []),  # Zahid leads
            ("QA Team", "Quality assurance and testing", 18, "Quality Assurance",
             []),  # Sohel leads
        ]
        team_ids = []
        for team_name, team_desc, lead_idx, dept_name, member_indices in teams_data:
            lead_id = emp_ids[lead_idx]
            dept_id = dept_ids.get(dept_name)
            r = await db.execute(
                text("INSERT INTO teams (company_id, name, description, lead_id, department_id, is_active) VALUES (1, :n, :d, :lid, :did, true) RETURNING id"),
                {"n": team_name, "d": team_desc, "lid": lead_id, "did": dept_id},
            )
            team_id = r.scalar_one()
            team_ids.append(team_id)

            # Add team members to employee_teams association table
            for member_idx in member_indices:
                member_id = emp_ids[member_idx]
                await db.execute(
                    text("INSERT INTO employee_teams (employee_id, team_id, role) VALUES (:eid, :tid, 'member')"),
                    {"eid": member_id, "tid": team_id},
                )
            # Add team lead as a member too (with role 'lead')
            await db.execute(
                text("INSERT INTO employee_teams (employee_id, team_id, role) VALUES (:eid, :tid, 'lead')"),
                {"eid": lead_id, "tid": team_id},
            )
        await db.commit()
        print(f"  [OK] {len(teams_data)} teams created with leads and members")

        admin_user_id = user_ids[0]  # admin user for approved_by references

        # ── 4. Leave Types ──────────────────────────────────────────────
        print("Creating leave types...")
        leave_type_data = [
            ("Annual Leave", 20, True, True, 5, None),
            ("Sick Leave", 12, True, False, 0, None),
            ("Casual Leave", 7, True, False, 0, None),
            ("Maternity Leave", 180, True, False, 0, "female"),
            ("Paternity Leave", 15, True, False, 0, "male"),
            ("Unpaid Leave", 0, False, False, 0, None),
            ("Bereavement Leave", 5, True, False, 0, None),
            ("Study Leave", 10, True, False, 0, None),
        ]
        lt_ids = []
        for name, days, paid, cf, max_cf, gender_res in leave_type_data:
            r = await db.execute(
                text("INSERT INTO leave_types (company_id, name, days_per_year, is_paid, is_carry_forward, max_carry_forward, gender_restriction, is_active) VALUES (1, :n, :d, :p, :cf, :mf, :gr, true) RETURNING id"),
                {"n": name, "d": days, "p": paid, "cf": cf, "mf": max_cf, "gr": gender_res},
            )
            lt_ids.append(r.scalar_one())
        await db.commit()
        print(f"  [OK] {len(leave_type_data)} leave types created")

        # ── 5. Leave Balances ───────────────────────────────────────────
        print("Creating leave balances...")
        current_year = date.today().year
        for emp_id in emp_ids:
            for lt_id, (_, days, _, _, _, _) in zip(lt_ids, leave_type_data):
                if days > 0:
                    used = random.randint(0, min(days, 8))
                    await db.execute(
                        text("INSERT INTO leave_balances (company_id, employee_id, year, type, entitled, used, remaining, leave_type_id, carried_forward) VALUES (1, :eid, :y, 'annual', :ent, :used, :rem, :ltid, 0)"),
                        {"eid": emp_id, "y": current_year, "ent": days, "used": used, "rem": days - used, "ltid": lt_id},
                    )
        await db.commit()
        print(f"  [OK] Leave balances created for all employees")

        # ── 6. Holidays ─────────────────────────────────────────────────
        print("Creating holidays...")
        holidays = [
            ("Independence Day", date(2026, 3, 26), "National Independence Day"),
            ("Bengali New Year", date(2026, 4, 14), "Pohela Boishakh"),
            ("May Day", date(2026, 5, 1), "International Workers' Day"),
            ("Eid ul-Fitr", date(2026, 3, 31), "End of Ramadan"),
            ("Eid ul-Adha", date(2026, 6, 7), "Festival of Sacrifice"),
            ("Company Picnic", date(2026, 7, 5), "Annual company outing"),
            ("Mid-Year Review", date(2026, 7, 15), "Half-year performance review"),
            ("Victory Day", date(2026, 12, 16), "National Victory Day"),
            ("Christmas Day", date(2026, 12, 25), "Christian Holiday"),
            ("Durga Puja", date(2026, 10, 10), "Hindu Festival"),
        ]
        for name, d, desc in holidays:
            await db.execute(
                text("INSERT INTO holidays (company_id, name, date, description, is_recurring) VALUES (1, :n, :d, :desc, true)"),
                {"n": name, "d": d, "desc": desc},
            )
        await db.commit()
        print(f"  [OK] {len(holidays)} holidays created")

        # ── 7. Attendance (last 30 days) ────────────────────────────────
        print("Creating attendance records (last 30 days)...")
        att_count = 0
        today = date.today()
        for emp_id in emp_ids:
            for day_offset in range(30, 0, -1):
                d = today - timedelta(days=day_offset)
                if d.weekday() >= 5:  # skip weekends
                    continue
                status = random.choices(["present", "late", "absent"], weights=[75, 15, 10])[0]
                check_in = None
                check_out = None
                late = 0
                ot = 0.0
                if status == "present":
                    hour = random.randint(8, 9)
                    minute = random.randint(0, 30)
                    check_in = datetime(d.year, d.month, d.day, hour, minute)
                    check_out = datetime(d.year, d.month, d.day, random.randint(17, 18), random.randint(0, 59))
                elif status == "late":
                    check_in = datetime(d.year, d.month, d.day, random.randint(9, 10), random.randint(0, 30))
                    check_out = datetime(d.year, d.month, d.day, random.randint(17, 19), random.randint(0, 59))
                    late = random.randint(10, 60)

                await db.execute(
                    text("""INSERT INTO attendance
                        (company_id, employee_id, date, check_in, check_out, status,
                         late_minutes, ot_hours, early_exit_minutes, method)
                    VALUES (1, :eid, :d, :ci, :co, :st, :late, :ot, 0, 'manual')"""),
                    {"eid": emp_id, "d": d, "ci": check_in, "co": check_out, "st": status, "late": late, "ot": ot},
                )
                att_count += 1
        await db.commit()
        print(f"  [OK] {att_count} attendance records created")

        # ── 8. Leaves (some past, some pending) ─────────────────────────
        print("Creating leave records...")
        leave_scenarios = [
            (0, "approved", "Annual family vacation", -20, -15),
            (1, "approved", "Medical leave - flu", -10, -8),
            (2, "pending", "Personal work", 5, 7),
            (0, "approved", "Eid celebration", -3, -1),
            (1, "pending", "Doctor appointment", 3, 3),
            (0, "rejected", "Extended weekend", -40, -38),
        ]
        for emp_id in emp_ids[:12]:
            for lt_idx, status, reason, start_off, end_off in leave_scenarios:
                if random.random() > 0.5:
                    continue
                sd = today + timedelta(days=start_off)
                ed = today + timedelta(days=end_off)
                days = (ed - sd).days + 1
                lt_name = leave_type_data[lt_idx][0]  # Get leave type name
                await db.execute(
                    text("""INSERT INTO leaves
                        (company_id, employee_id, leave_type_id, start_date, end_date,
                         days, reason, type, status, approved_by)
                    VALUES (1, :eid, :ltid, :sd, :ed, :days, :reason, :ltname, :st, :ab)"""),
                    {
                        "eid": emp_id,
                        "ltid": lt_ids[lt_idx],
                        "sd": sd,
                        "ed": ed,
                        "days": days,
                        "reason": reason,
                        "ltname": lt_name,
                        "st": status,
                        "ab": admin_user_id if status in ("approved", "rejected") else None,
                    },
                )
        await db.commit()
        print("  [OK] Leave records created")

        # ── 9. Payroll (last 6 months) ──────────────────────────────────
        print("Creating payroll records...")
        month_names = ["January", "February", "March", "April", "May", "June"]
        for emp_id in emp_ids:
            emp_idx = emp_ids.index(emp_id)
            base = EMPLOYEES[emp_idx][5]  # salary
            for m_idx, month_name in enumerate(month_names):
                yr = 2026
                mo = m_idx + 1
                allowances = round(base * Decimal(str(random.uniform(0.1, 0.25))), 2)
                deductions = round(base * Decimal(str(random.uniform(0.02, 0.08))), 2)
                tax = round(base * Decimal("0.10"), 2)
                bonus = round(base * Decimal(str(random.uniform(0, 0.1))), 2) if random.random() > 0.7 else 0
                net = base + allowances - deductions - tax + bonus

                r = await db.execute(
                    text("""INSERT INTO payroll
                        (company_id, employee_id, month, year, base_salary, allowances,
                         deductions, tax, bonus, net_pay, status, paid_at)
                    VALUES (1, :eid, :month, :yr, :base, :allow,
                            :ded, :tax, :bonus, :net, :status, :paid) RETURNING id"""),
                    {
                        "eid": emp_id,
                        "month": mo,
                        "yr": yr,
                        "base": base,
                        "allow": allowances,
                        "ded": deductions,
                        "tax": tax,
                        "bonus": bonus,
                        "net": net,
                        "status": "paid" if mo < 6 else "processed",
                        "paid": datetime(yr, mo, 28) if mo < 6 else None,
                    },
                )
                payroll_id = r.scalar_one()

                # Payroll items
                items = [
                    ("allowance", "House Rent", str(round(base * Decimal("0.2"), 2))),
                    ("allowance", "Transport", str(round(base * Decimal("0.05"), 2))),
                    ("allowance", "Medical", str(round(base * Decimal("0.05"), 2))),
                    ("deduction", "Provident Fund", str(round(base * Decimal("0.05"), 2))),
                    ("deduction", "Income Tax", str(tax)),
                ]
                for ptype, pname, pamount in items:
                    await db.execute(
                        text("INSERT INTO payroll_items (payroll_id, type, name, amount) VALUES (:pid, :t, :n, :a)"),
                        {"pid": payroll_id, "t": ptype, "n": pname, "a": pamount},
                    )
        await db.commit()
        print(f"  [OK] {len(emp_ids) * 6} payroll records created with items")

        # ── 10. Salary Components ────────────────────────────────────────
        print("Creating salary components...")
        components = [
            ("Basic Salary", "earning", "fixed", 0, True),
            ("House Rent", "earning", "percentage", 20, True),
            ("Transport Allowance", "earning", "fixed", 5000, True),
            ("Medical Allowance", "earning", "fixed", 3000, True),
            ("Overtime", "earning", "fixed", 0, True),
            ("Provident Fund", "deduction", "percentage", 5, False),
            ("Income Tax", "deduction", "percentage", 10, False),
            ("Insurance", "deduction", "fixed", 1500, False),
        ]
        for name, ctype, atype, default, taxable in components:
            await db.execute(
                text("INSERT INTO salary_components (company_id, name, type, amount_type, default_amount, is_taxable, is_active) VALUES (1, :n, :t, :at, :d, :tax, true)"),
                {"n": name, "t": ctype, "at": atype, "d": default, "tax": taxable},
            )
        await db.commit()
        print(f"  [OK] {len(components)} salary components created")

        # ── 11. Benefit Plans ───────────────────────────────────────────
        print("Creating benefit plans...")
        plans = [
            ("Group Health Insurance", "health", "Comprehensive health coverage for employees and dependents", "Green Delta Insurance", 3500, 500),
            ("Life Insurance", "life", "Term life insurance coverage", "Padma Insurance", 1200, 200),
            ("Transportation Allowance", "transport", "Monthly transport facility", "Company", 8000, 0),
            ("Meal Allowance", "meal", "Daily meal facility", "Food Court Partner", 5000, 1000),
            ("Gym Membership", "wellness", "Annual gym membership", "Fitness Zone", 2000, 500),
        ]
        plan_ids = []
        for name, ptype, desc, provider, cost, contrib in plans:
            r = await db.execute(
                text("INSERT INTO benefit_plans (company_id, name, type, description, provider, monthly_cost, employee_contribution, is_active) VALUES (1, :n, :t, :d, :p, :c, :ec, true) RETURNING id"),
                {"n": name, "t": ptype, "d": desc, "p": provider, "c": cost, "ec": contrib},
            )
            plan_ids.append(r.scalar_one())
        await db.commit()
        print(f"  [OK] {len(plans)} benefit plans created")

        # ── 12. Employee Benefits ───────────────────────────────────────
        print("Enrolling employees in benefits...")
        for emp_id in emp_ids[:15]:
            enrolled = random.sample(plan_ids, k=random.randint(2, 4))
            for pid in enrolled:
                await db.execute(
                    text("INSERT INTO employee_benefits (company_id, employee_id, plan_id, status) VALUES (1, :eid, :pid, 'active')"),
                    {"eid": emp_id, "pid": pid},
                )
        await db.commit()
        print("  [OK] Employee benefit enrollments created")

        # ── 13. Trainings ───────────────────────────────────────────────
        print("Creating trainings...")
        training_data = [
            ("React Advanced Patterns", "Deep dive into React hooks, context, and performance optimization", "Kamal Hossain", "online", "completed", 20),
            ("Docker & Kubernetes", "Container orchestration for production deployments", "External Trainer", "offline", "active", 15),
            ("Leadership Workshop", "Building effective teams and communication", "HR Department", "offline", "active", 20),
            ("Python for Data Science", "Introduction to pandas, numpy, and scikit-learn", "Online Platform", "online", "completed", 25),
            ("Cybersecurity Awareness", "Protecting company data and recognizing threats", "Security Team", "online", "active", 30),
            ("Agile Project Management", "Scrum and Kanban methodologies", "Product Team", "offline", "active", 15),
            ("UI/UX Design Fundamentals", "Design thinking and user-centered design", "Sabrina Islam", "online", "completed", 12),
            ("Financial Reporting", "Understanding financial statements and compliance", "Finance Dept", "offline", "active", 10),
        ]
        train_ids = []
        for title, desc, trainer, mode, status, max_p in training_data:
            sd = today + timedelta(days=random.randint(-60, 30))
            ed = sd + timedelta(days=random.randint(3, 14))
            r = await db.execute(
                text("""INSERT INTO trainings
                    (company_id, title, description, trainer, start_date, end_date,
                     mode, status, duration_hours, max_participants)
                VALUES (1, :t, :d, :tr, :sd, :ed, :m, :s, :dur, :mp) RETURNING id"""),
                {"t": title, "d": desc, "tr": trainer, "sd": sd, "ed": ed, "m": mode, "s": status, "dur": random.randint(4, 20), "mp": max_p},
            )
            train_ids.append(r.scalar_one())
        await db.commit()
        print(f"  [OK] {len(training_data)} trainings created")

        # ── 14. Training Enrollments ────────────────────────────────────
        print("Creating training enrollments...")
        enroll_count = 0
        for tid in train_ids:
            num_enrolled = random.randint(5, min(15, len(emp_ids)))
            enrolled_emps = random.sample(emp_ids, k=num_enrolled)
            for eid in enrolled_emps:
                status = random.choice(["completed", "in_progress", "enrolled"])
                score = random.randint(60, 95) if status == "completed" else None
                completed = today - timedelta(days=random.randint(1, 30)) if status == "completed" else None
                await db.execute(
                    text("""INSERT INTO training_enrollments
                        (training_id, employee_id, status, completion_date, score)
                    VALUES (:tid, :eid, :st, :cd, :sc)"""),
                    {"tid": tid, "eid": eid, "st": status, "cd": completed, "sc": score},
                )
                enroll_count += 1
        await db.commit()
        print(f"  [OK] {enroll_count} training enrollments created")

        # ── 15. KPIs ────────────────────────────────────────────────────
        print("Creating KPIs...")
        kpi_data = [
            ("Code Review Completion", "task", "Code reviews completed per sprint", "%", 95, 88),
            ("Bug Fix Rate", "metric", "Bugs fixed vs reported", "%", 90, 82),
            ("Sprint Velocity", "metric", "Story points delivered per sprint", "points", 40, 36),
            ("Customer Satisfaction", "rating", "Customer feedback score", "score", 4.5, 4.2),
            ("Revenue Target", "metric", "Monthly revenue target", "BDT", 500000, 420000),
            ("Lead Conversion", "metric", "Leads converted to deals", "%", 25, 20),
            ("Attendance Rate", "metric", "Monthly attendance percentage", "%", 98, 95),
            ("Training Completion", "task", "Assigned trainings completed", "%", 100, 75),
        ]
        periods = ["Q1 2026", "Q2 2026", "2026-H1"]
        for emp_id in emp_ids[:15]:
            for name, ktype, desc, unit, target, actual in random.sample(kpi_data, k=random.randint(2, 4)):
                actual_val = target * random.uniform(0.7, 1.1)
                await db.execute(
                    text("""INSERT INTO kpis
                        (company_id, employee_id, name, description, type,
                         target_value, actual_value, unit, weight, period, status)
                    VALUES (1, :eid, :n, :d, :t, :tv, :av, :u, :w, :p, 'active')"""),
                    {
                        "eid": emp_id, "n": name, "d": desc, "t": ktype,
                        "tv": target, "av": round(actual_val, 2), "u": unit,
                        "w": random.randint(10, 30),
                        "p": random.choice(periods),
                    },
                )
        await db.commit()
        print("  [OK] KPIs created")

        # ── 16. Performance Reviews ─────────────────────────────────────
        print("Creating performance reviews...")
        review_periods = ["Q1 2026", "Q2 2026", "2025-Annual"]
        feedback_pool = [
            "Consistently exceeds expectations. Strong technical skills and great team player.",
            "Good performance overall. Needs to improve communication with cross-functional teams.",
            "Excellent problem-solving abilities. Should take more leadership roles.",
            "Meets expectations. Shows potential for growth in the next quarter.",
            "Outstanding contribution to the project. Highly recommended for promotion.",
            "Solid work ethic. Could benefit from additional training in leadership skills.",
            "Very reliable and detail-oriented. A valuable team member.",
        ]
        for emp_id in emp_ids[:15]:
            for period in random.sample(review_periods, k=random.randint(1, 2)):
                rating = round(random.uniform(3.0, 5.0), 1)
                await db.execute(
                    text("""INSERT INTO performance_reviews
                        (company_id, employee_id, reviewer_id, period, review_type,
                         rating, feedback, status, self_assessment)
                    VALUES (1, :eid, :rid, :p, :rt, :r, :f, :s, :sa)"""),
                    {
                        "eid": emp_id,
                        "rid": admin_user_id,
                        "p": period,
                        "rt": random.choice(["quarterly", "annual", "mid-year"]),
                        "r": rating,
                        "f": random.choice(feedback_pool),
                        "s": random.choice(["completed", "completed", "in_progress"]),
                        "sa": random.choice([
                            "I have been focusing on improving my technical skills and meeting project deadlines.",
                            "This quarter I led a key initiative and delivered results ahead of schedule.",
                            "I worked on cross-team collaboration and improved my communication skills.",
                        ]),
                    },
                )
        await db.commit()
        print("  [OK] Performance reviews created")

        # ── 17. Employee Documents ──────────────────────────────────────
        print("Creating employee documents...")
        doc_types = [
            ("Offer Letter", "hr"),
            ("Employment Contract", "hr"),
            ("NID Copy", "identity"),
            ("Passport Copy", "identity"),
            ("Education Certificate", "education"),
            ("Experience Letter", "hr"),
            ("Medical Certificate", "medical"),
            ("Tax Return", "finance"),
        ]
        doc_count = 0
        for emp_id in emp_ids:
            selected = random.sample(doc_types, k=random.randint(2, 5))
            for doc_type, category in selected:
                await db.execute(
                    text("""INSERT INTO employee_documents
                        (company_id, employee_id, doc_type, file_url, category, title, version, uploaded_by, uploaded_at)
                    VALUES (1, :eid, :dt, :url, :cat, :title, 1, :ub, :ua)"""),
                    {
                        "eid": emp_id,
                        "dt": doc_type,
                        "url": f"/documents/{emp_id}/{doc_type.lower().replace(' ', '_')}.pdf",
                        "cat": category,
                        "title": doc_type,
                        "ub": admin_user_id,
                        "ua": datetime.now() - timedelta(days=random.randint(1, 90)),
                    },
                )
                doc_count += 1
        await db.commit()
        print(f"  [OK] {doc_count} employee documents created")

        # ── 18. Employee Assets ─────────────────────────────────────────
        print("Creating employee assets...")
        asset_types = [
            ("laptop", "Dell Latitude 5520"),
            ("laptop", "MacBook Pro 14"),
            ("laptop", "ThinkPad X1 Carbon"),
            ("monitor", "Dell 27\" 4K Monitor"),
            ("monitor", "LG UltraWide 34\""),
            ("phone", "iPhone 15"),
            ("phone", "Samsung Galaxy S24"),
            ("keyboard", "Logitech MX Keys"),
            ("mouse", "Logitech MX Master 3S"),
            ("headset", "Jabra Evolve2 75"),
        ]
        asset_count = 0
        for emp_id in emp_ids:
            num_assets = random.randint(1, 3)
            selected_assets = random.sample(asset_types, k=num_assets)
            for asset_type, name in selected_assets:
                await db.execute(
                    text("""INSERT INTO employee_assets
                        (company_id, employee_id, asset_type, name, serial,
                         assigned_at, condition, condition_at_assignment, status)
                    VALUES (1, :eid, :at, :name, :serial, :aa, :cond, :cond, 'assigned')"""),
                    {
                        "eid": emp_id,
                        "at": asset_type,
                        "name": name,
                        "serial": f"SN-{asset_type[:3].upper()}-{random.randint(100000, 999999)}",
                        "aa": datetime.now() - timedelta(days=random.randint(10, 365)),
                        "cond": random.choice(["Excellent", "Good", "Fair"]),
                    },
                )
                asset_count += 1
        await db.commit()
        print(f"  [OK] {asset_count} employee assets created")

        # ── 19. Support Tickets ──────────────────────────────────────────
        print("Creating support tickets...")
        ticket_subjects = [
            ("VPN not connecting", "it", "high"),
            ("Software license request", "it", "medium"),
            ("Office AC not working", "facilities", "high"),
            ("New ID card request", "hr", "low"),
            ("Printer jam issue", "it", "medium"),
            ("Leave balance query", "hr", "low"),
            ("Salary slip correction", "finance", "medium"),
            ("Meeting room booking", "facilities", "low"),
            ("WiFi password reset", "it", "low"),
            ("Ergonomic chair request", "facilities", "medium"),
        ]
        for uid in random.sample(user_ids[1:], k=min(10, len(user_ids) - 1)):
            subj, cat, pri = random.choice(ticket_subjects)
            status = random.choice(["open", "open", "resolved", "closed"])
            await db.execute(
                text("""INSERT INTO tickets
                    (company_id, ticket_number, subject, category, priority, status, requester_id)
                    VALUES (1, :tn, :subj, :cat, :pri, :st, :rid)"""),
                {
                    "tn": f"TKT-{random.randint(100000, 999999):06X}",
                    "subj": subj,
                    "cat": cat,
                    "pri": pri,
                    "st": status,
                    "rid": uid,
                },
            )
        await db.commit()
        print("  [OK] Support tickets created")

        # ── Summary ─────────────────────────────────────────────────────
        print("\n" + "=" * 60)
        print("SEED COMPLETE!")
        print("=" * 60)
        print(f"  Users:          {len(USERS_DATA)}")
        print(f"  Employees:      {len(EMPLOYEES)}")
        print(f"  Departments:    {len(DEPARTMENTS)}")
        print(f"  Leave Types:    {len(leave_type_data)}")
        print(f"  Holidays:       {len(holidays)}")
        print(f"  Attendance:     {att_count} records (last 30 days)")
        print(f"  Leave Records:  Multiple per employee")
        print(f"  Payroll:        {len(emp_ids) * 6} payslips (6 months)")
        print(f"  Salary Comps:   {len(components)}")
        print(f"  Benefit Plans:  {len(plans)}")
        print(f"  Trainings:      {len(training_data)}")
        print(f"  Enrollments:    {enroll_count}")
        print(f"  KPIs:           Multiple per employee")
        print(f"  Reviews:        Multiple per employee")
        print(f"  Documents:      {doc_count}")
        print(f"  Assets:         {asset_count}")
        print(f"  Tickets:        Multiple")
        print()
        print("Login credentials:")
        print(f"  Admin:   borhanuddin.bd2026@gmail.com / Admin@123456")
        print(f"  Users:   <name>@klyron.com / password123")
        print(f"  (e.g., rahim@klyron.com, fatima@klyron.com, etc.)")
        print()
        print("Start the app:")
        print(f"  Backend:  cd backend && uv run uvicorn app.main:app --host 127.0.0.1 --port 8000")
        print(f"  Frontend: cd frontend && npm run dev")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
