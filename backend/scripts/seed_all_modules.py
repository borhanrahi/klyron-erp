"""
Klyron ERP - Comprehensive Module Seed Data
============================================
Populates ALL modules with realistic demo data.

Run: cd backend && uv run python scripts/seed_all_modules.py
"""
import asyncio
import sys
import os
import random
from datetime import datetime, date, timedelta
from decimal import Decimal

# Add backend dir to path so app.models is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Windows encoding fix
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import text
from sqlalchemy.future import select

# Import ALL models
from app.models.auth import User, Company, Branch, Department, Role
from app.models.hr import (
    Employee, Attendance, Leave, LeaveType, LeaveBalance, Holiday,
    Payroll, PayrollItem, SalaryComponent, BenefitPlan, EmployeeBenefit,
    Training, TrainingEnrollment, KPI, PerformanceReview,
    EmployeeDocument, EmployeeAsset, Loan,
)
from app.models.inventory import (
    ItemCategory, Item, Warehouse, Stock, StockAdjustment, StockTransfer,
)
from app.models.sales import (
    Customer, CustomerContract, Lead, Deal, Quotation, QuotationItem, SalesOrder, SalesOrderItem,
    Inquiry, SalesCampaign, DeliveryNote,
)
from app.models.finance import (
    BankAccount, ChartOfAccount, Transaction, Invoice, InvoiceItem,
    CreditNote, DebitNote, Estimate, EstimateItem, Expense, Budget, TaxRate,
)
from app.models.procurement import (
    Supplier, PurchaseRequisition, PRItem, PurchaseOrder, POItem, GRN, GRNItem,
    SupplierPayment,
)
from app.models.pos import POSSession, POSSale, POSSaleItem, CashRegister
from app.models.project import (
    Project, ProjectTask, ProjectBug, Timesheet, ProjectMilestone,
)
from app.models.support import Ticket, TicketComment, Meeting
from app.models.master_data import (
    Currency, Country, State, Unit, TaxCode, PaymentTerm, Designation,
)

DATABASE_URL = "postgresql+asyncpg://klyron_borhan:klyron123@localhost:5433/klyron_erp"
COMPANY_ID = 1
ADMIN_USER_ID = 135

engine = create_async_engine(DATABASE_URL, echo=False)
Session = async_sessionmaker(engine, expire_on_commit=False)


def log(msg):
    print(f"  [OK] {msg}")


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 1: MASTER DATA
# ═══════════════════════════════════════════════════════════════════════════════
async def seed_master_data(session):
    print("\n[1] Master Data")

    # Currencies
    currencies_data = [
        ("BDT", "Bangladeshi Taka", "৳", True),
        ("USD", "US Dollar", "$", False),
        ("EUR", "Euro", "€", False),
        ("GBP", "British Pound", "£", False),
        ("INR", "Indian Rupee", "₹", False),
        ("SGD", "Singapore Dollar", "S$", False),
        ("AED", "UAE Dirham", "د.إ", False),
        ("JPY", "Japanese Yen", "¥", False),
    ]
    for code, name, symbol, default in currencies_data:
        existing = await session.execute(select(Currency).where(Currency.code == code))
        if not existing.scalar_one_or_none():
            session.add(Currency(code=code, name=name, symbol=symbol, is_default=default))
    log(f"Currencies: {len(currencies_data)}")

    # Countries + States
    countries = [
        ("BD", "Bangladesh", "+880", ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh"]),
        ("IN", "India", "+91", ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"]),
        ("US", "United States", "+1", ["California", "New York", "Texas", "Florida"]),
        ("SG", "Singapore", "+65", ["Central", "East", "West", "North", "South"]),
    ]
    for c_code, c_name, phone, states in countries:
        existing = await session.execute(select(Country).where(Country.code == c_code))
        country = existing.scalar_one_or_none()
        if not country:
            country = Country(code=c_code, name=c_name, phone_code=phone)
            session.add(country)
            await session.flush()
        for s_name in states:
            existing_s = await session.execute(select(State).where(State.name == s_name, State.country_id == country.id))
            if not existing_s.scalar_one_or_none():
                session.add(State(country_id=country.id, code=s_name[:3].upper(), name=s_name))
    log("Countries & States")

    # Units
    units_data = [
        ("Piece", "pc", True), ("Kilogram", "kg", False), ("Gram", "g", False),
        ("Meter", "m", False), ("Liter", "L", False), ("Box", "box", False),
        ("Pack", "pack", False), ("Set", "set", False), ("Pair", "pair", False),
        ("Dozen", "dz", False),
    ]
    for name, symbol, base in units_data:
        existing = await session.execute(select(Unit).where(Unit.name == name))
        if not existing.scalar_one_or_none():
            session.add(Unit(name=name, symbol=symbol, is_base=base))
    log(f"Units: {len(units_data)}")

    # Tax Codes
    tax_codes = [
        ("VAT15", "VAT 15%", 15.0, "percentage"),
        ("VAT75", "VAT 7.5%", 7.5, "percentage"),
        ("VAT50", "VAT 5%", 5.0, "percentage"),
        ("VAT0", "Zero Rated", 0.0, "percentage"),
        ("EXEMPT", "Exempt", 0.0, "fixed"),
    ]
    for code, name, rate, t_type in tax_codes:
        existing = await session.execute(select(TaxCode).where(TaxCode.code == code))
        if not existing.scalar_one_or_none():
            session.add(TaxCode(company_id=COMPANY_ID, code=code, name=name, rate=rate, type=t_type, is_active=True))
    log(f"Tax Codes: {len(tax_codes)}")

    # Payment Terms
    terms = [
        ("Net 15", 15), ("Net 30", 30), ("Net 45", 45), ("Net 60", 60),
        ("Net 90", 90), ("Due on Receipt", 0), ("2/10 Net 30", 30),
    ]
    for name, days in terms:
        existing = await session.execute(select(PaymentTerm).where(PaymentTerm.name == name))
        if not existing.scalar_one_or_none():
            session.add(PaymentTerm(company_id=COMPANY_ID, name=name, days=days, is_active=True))
    log(f"Payment Terms: {len(terms)}")

    # Designations
    designations_data = [
        ("CEO", None), ("CTO", None), ("CFO", None),
        ("VP Engineering", None), ("VP Sales", None), ("VP Marketing", None),
        ("Director HR", None), ("Director Operations", None),
        ("Senior Software Engineer", None), ("Software Engineer", None),
        ("Senior Accountant", None), ("Accountant", None),
        ("Sales Executive", None), ("Sales Manager", None),
        ("Marketing Specialist", None), ("HR Specialist", None),
        ("Product Analyst", None), ("UX Designer", None),
        ("DevOps Engineer", None), ("QA Engineer", None),
        ("Support Engineer", None), ("Project Manager", None),
        ("Data Analyst", None), ("Business Analyst", None),
    ]
    for name, dept_id in designations_data:
        existing = await session.execute(select(Designation).where(Designation.name == name))
        if not existing.scalar_one_or_none():
            session.add(Designation(company_id=COMPANY_ID, name=name, department_id=dept_id))
    log(f"Designations: {len(designations_data)}")

    # Branches (needed by POS, BankAccount, Invoice, etc.)
    branches_data = [
        ("Head Office", "Gulshan, Dhaka"),
        ("Banani Branch", "Banani, Dhaka"),
        ("Chattogram Branch", "Agrabad, Chattogram"),
    ]
    branch_ids = []
    for name, addr in branches_data:
        existing = await session.execute(select(Branch).where(Branch.name == name))
        br = existing.scalar_one_or_none()
        if not br:
            br = Branch(company_id=COMPANY_ID, name=name, address=addr, is_active=True)
            session.add(br)
            await session.flush()
        branch_ids.append(br.id)
    log(f"Branches: {len(branches_data)}")

    await session.commit()
    print("  Master Data DONE")
    return branch_ids


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 2: INVENTORY
# ═══════════════════════════════════════════════════════════════════════════════
async def seed_inventory(session):
    print("\n[2] Inventory")

    # Warehouses
    warehouses = [
        ("WH-DH-01", "Dhaka Main Warehouse", "House 12, Road 5, Gulshan, Dhaka"),
        ("WH-DH-02", "Dhaka Secondary Warehouse", "Block C, Banani, Dhaka"),
        ("WH-CT-01", "Chattogram Warehouse", "Agrabad, Chattogram"),
        ("WH-SY-01", "Sylhet Distribution Center", "Zindabazar, Sylhet"),
    ]
    wh_ids = []
    for code, name, addr in warehouses:
        existing = await session.execute(select(Warehouse).where(Warehouse.code == code))
        wh = existing.scalar_one_or_none()
        if not wh:
            wh = Warehouse(company_id=COMPANY_ID, code=code, name=name, address=addr, is_active=True)
            session.add(wh)
            await session.flush()
        wh_ids.append(wh.id)
    log(f"Warehouses: {len(warehouses)}")

    # Item Categories
    categories = [
        "Electronics", "Office Furniture", "Office Supplies", "Software Licenses",
        "IT Accessories", "Networking Equipment", "Server Hardware", "Peripherals",
        "Stationery", "Cleaning Supplies",
    ]
    cat_ids = {}
    for cat_name in categories:
        existing = await session.execute(select(ItemCategory).where(ItemCategory.name == cat_name))
        cat = existing.scalar_one_or_none()
        if not cat:
            cat = ItemCategory(company_id=COMPANY_ID, name=cat_name, code=cat_name[:3].upper())
            session.add(cat)
            await session.flush()
        cat_ids[cat_name] = cat.id
    log(f"Categories: {len(categories)}")

    # Items (products)
    items_data = [
        ("ELC-LPT-001", "MacBook Pro 16-inch M3 Max", "Electronics", "pc", 2800, 3499, 15, 50),
        ("ELC-LPT-002", "Dell XPS 15 Laptop", "Electronics", "pc", 1200, 1699, 15, 30),
        ("ELC-MON-001", 'Dell UltraSharp 27" 4K Monitor', "Electronics", "pc", 420, 649.99, 15, 60),
        ("ELC-MON-002", 'LG 34" Ultrawide Monitor', "Electronics", "pc", 550, 899.99, 15, 25),
        ("ELC-KB-001", "Logitech MX Keys Keyboard", "Electronics", "pc", 72, 119.99, 15, 100),
        ("ELC-MS-001", "Logitech MX Master 3S Mouse", "Electronics", "pc", 58, 99.99, 15, 80),
        ("ELC-HED-001", "Sony WH-1000XM5 Headphones", "Electronics", "pc", 220, 349.99, 15, 40),
        ("ELC-HUB-001", "USB-C Hub 7-in-1 Adapter", "Electronics", "pc", 22, 49.99, 15, 120),
        ("ELC-CAM-001", "Logitech Brio 4K Webcam", "Electronics", "pc", 120, 199.99, 15, 35),
        ("ELC-SPK-001", "Jabra Speak 750 Speakerphone", "Electronics", "pc", 180, 299.99, 15, 20),
        ("FUR-CHR-001", "Herman Miller Aeron Chair", "Office Furniture", "pc", 890, 1395, 7.5, 15),
        ("FUR-CHR-002", "Secretlab Titan Evo 2024", "Office Furniture", "pc", 450, 649, 7.5, 20),
        ("FUR-DSK-001", "Standing Desk Electric Adjustable", "Office Furniture", "pc", 320, 599, 7.5, 25),
        ("FUR-DSK-002", "Executive Office Desk L-Shape", "Office Furniture", "pc", 280, 499, 7.5, 10),
        ("FUR-CAB-001", "3-Drawer Filing Cabinet", "Office Furniture", "pc", 120, 219, 7.5, 15),
        ("SUP-PAP-001", "A4 Copy Paper 80gsm (5 reams)", "Office Supplies", "box", 15, 24.99, 15, 500),
        ("SUP-PEN-001", "Ballpoint Pen Box (50 pcs)", "Office Supplies", "box", 9.5, 18.50, 15, 200),
        ("SUP-MKR-001", "Whiteboard Marker Set (12)", "Office Supplies", "pack", 8, 15.99, 15, 150),
        ("SUP-TAP-001", "Packing Tape (6 pack)", "Office Supplies", "pack", 6, 12.99, 15, 100),
        ("SUP-FOL-001", "Lever Arch File (12 pack)", "Office Supplies", "box", 18, 32.00, 15, 80),
        ("NET-SWI-001", "Cisco Catalyst 24-Port Switch", "Networking Equipment", "pc", 280, 449, 15, 10),
        ("NET-ROT-001", "Ubiquiti UniFi AP AC Pro", "Networking Equipment", "pc", 150, 249, 15, 15),
        ("NET-CAB-001", "Cat6 Ethernet Cable 3m (50)", "Networking Equipment", "pack", 45, 79.99, 15, 30),
        ("NET-FW-001", "Fortinet FortiGate 60F Firewall", "Networking Equipment", "pc", 800, 1299, 15, 5),
        ("SRV-SRV-001", "Dell PowerEdge R750 Server", "Server Hardware", "pc", 4500, 7999, 15, 3),
        ("SRV-NAS-001", "Synology DS1621+ NAS", "Server Hardware", "pc", 900, 1499, 15, 5),
        ("PRP-PRN-001", "HP LaserJet Pro M404dn", "Peripherals", "pc", 280, 449, 15, 20),
        ("PRP-SCN-001", "Epson Perfection V600 Scanner", "Peripherals", "pc", 250, 399, 15, 8),
        ("SFT-MS365-001", "Microsoft 365 Business Standard (1yr)", "Software Licenses", "pc", 150, 250, 0, 50),
        ("SFT-SLACK-001", "Slack Business+ (1yr/user)", "Software Licenses", "pc", 100, 150, 0, 100),
        ("SFT-FG-001", "Figma Professional (1yr)", "Software Licenses", "pc", 90, 144, 0, 30),
        ("SFT-GH-001", "GitHub Team (1yr/user)", "Software Licenses", "pc", 50, 84, 0, 40),
    ]
    item_ids = []
    for sku, name, cat, unit, cost, price, tax, qty in items_data:
        existing = await session.execute(select(Item).where(Item.sku == sku))
        item = existing.scalar_one_or_none()
        if not item:
            item = Item(
                company_id=COMPANY_ID, sku=sku, name=name, category_id=cat_ids.get(cat),
                unit=unit, cost_price=cost, sell_price=price, tax_rate=tax,
                barcode=f"890{random.randint(100000000, 999999999)}",
            )
            session.add(item)
            await session.flush()
        item_ids.append(item.id)
    log(f"Items: {len(items_data)}")

    # Stock for each item in random warehouses
    stock_count = 0
    for i, item_id in enumerate(item_ids):
        whs = random.sample(wh_ids, k=random.randint(1, 3))
        for wh_id in whs:
            existing = await session.execute(
                select(Stock).where(Stock.item_id == item_id, Stock.warehouse_id == wh_id)
            )
            if not existing.scalar_one_or_none():
                qty = random.randint(5, 200)
                session.add(Stock(
                    company_id=COMPANY_ID, item_id=item_id, warehouse_id=wh_id,
                    quantity=qty, reserved_qty=random.randint(0, min(5, qty)),
                    reorder_level=random.randint(10, 30), reorder_qty=random.randint(20, 50),
                ))
                stock_count += 1
    log(f"Stock records: {stock_count}")

    # Stock Adjustments
    adj_count = 0
    adj_types = ["Damaged", "Expired", "Lost", "Found", "Returned", "Correction", "Counted"]
    reasons = [
        "Physical count discrepancy", "Item found during audit", "Damaged in transit",
        "Expired shelf life", "Returned by customer", "Correction after stock take",
        "Item lost in warehouse", "New stock received", "Damaged during move",
    ]
    for _ in range(20):
        session.add(StockAdjustment(
            company_id=COMPANY_ID,
            item_id=random.choice(item_ids),
            warehouse_id=random.choice(wh_ids),
            type=random.choice(adj_types),
            qty_change=random.randint(-10, 15),
            reason=random.choice(reasons),
            date=datetime.now() - timedelta(days=random.randint(1, 60)),
            created_by=ADMIN_USER_ID,
        ))
        adj_count += 1
    log(f"Stock Adjustments: {adj_count}")

    # Stock Transfers
    xfer_count = 0
    for _ in range(10):
        from_wh, to_wh = random.sample(wh_ids, 2)
        session.add(StockTransfer(
            company_id=COMPANY_ID, from_warehouse_id=from_wh, to_warehouse_id=to_wh,
            item_id=random.choice(item_ids), qty=random.randint(5, 30),
            status=random.choice(["pending", "approved", "completed"]),
            date=datetime.now() - timedelta(days=random.randint(1, 30)),
            approved_by=ADMIN_USER_ID,
        ))
        xfer_count += 1
    log(f"Stock Transfers: {xfer_count}")

    await session.commit()
    print("  Inventory DONE")
    return item_ids


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 3: SALES (Customers, Leads, Deals, Quotations, Orders, Inquiries, Campaigns)
# ═══════════════════════════════════════════════════════════════════════════════
async def seed_sales(session, item_ids):
    print("\n[3] Sales")

    # Customers
    customers_data = [
        ("TechVision Bangladesh", "info@techvisionbd.com", "+8801712345678", "Gulshan, Dhaka", 500000),
        ("GreenDelta Insurance", "contact@greendelta.com", "+8801812345679", "Motijheel, Dhaka", 750000),
        ("BRAC Bank", "it@bracbank.com", "+8801912345680", "Gulshan, Dhaka", 1000000),
        ("Grameenphone", "procurement@gp.com", "+8801612345681", "Gulshan, Dhaka", 2000000),
        ("Walton Group", "purchase@waltonbd.com", "+8801512345682", "Chattogram", 1500000),
        ("Beximco Pharmaceuticals", "supply@beximco.com", "+8801712345683", "Uttara, Dhaka", 800000),
        ("Square Pharmaceuticals", "orders@squarepharma.com", "+8801812345684", "Shahbag, Dhaka", 1200000),
        ("Robi Axiata", "ops@robi.com.bd", "+8801912345685", "Banani, Dhaka", 900000),
        ("Eastern Bank", "finance@ebl.com.bd", "+8801612345686", "Dhanmondi, Dhaka", 600000),
        ("IDCOL", "admin@idcol.com", "+8801512345687", "Baridhara, Dhaka", 400000),
        ("Summit Power", "info@summitpower.com", "+8801712345688", "Gulshan, Dhaka", 350000),
        ("UCB Bank", "tech@ucb.com.bd", "+8801812345689", "Motijheel, Dhaka", 450000),
        ("Marico Bangladesh", "purchase@marico.com", "+8801912345690", "Tejgaon, Dhaka", 300000),
        ("Nestle Bangladesh", "orders@nestle.com.bd", "+8801612345691", "Banani, Dhaka", 550000),
        ("Unilever Bangladesh", "supply@unileverbd.com", "+8801512345692", "Gulshan, Dhaka", 700000),
        ("ACI Limited", "procurement@aci-bd.com", "+8801712345693", "Tejgaon, Dhaka", 420000),
        ("LankaBangla Finance", "ops@lankabangla.com", "+8801812345694", "Gulshan, Dhaka", 380000),
        ("Bashundhara Group", "admin@bashundhara.com", "+8801912345695", "Bashundhara, Dhaka", 2500000),
        ("PRAN-RFL Group", "purchase@pranrfl.com", "+8801612345696", "Uttara, Dhaka", 800000),
        ("Meghna Group", "info@meghnagroup.com", "+8801512345697", "Chattogram", 600000),
    ]
    customer_ids = []
    for name, email, phone, addr, limit in customers_data:
        existing = await session.execute(select(Customer).where(Customer.name == name))
        cust = existing.scalar_one_or_none()
        if not cust:
            cust = Customer(
                company_id=COMPANY_ID, name=name, email=email, phone=phone,
                address=addr, credit_limit=limit, balance=random.uniform(0, limit * 0.3),
                loyalty_points=random.randint(0, 5000), status="active",
            )
            session.add(cust)
            await session.flush()
        customer_ids.append(cust.id)
    log(f"Customers: {len(customers_data)}")

    # Leads
    leads_data = [
        ("Rahat Rahman", "rahat@startupbd.com", "+8801711111111", "website", "qualified"),
        ("Nusrat Jahan", "nusrat@corp.com", "+8801811111112", "referral", "contacted"),
        ("Tanvir Ahmed", "tanvir@tech.io", "+8801911111113", "linkedin", "proposal"),
        ("Sabrina Haque", "sabrina@enterprise.com", "+8801611111114", "cold_call", "qualified"),
        ("Imran Hossain", "imran@digital.com", "+8801511111115", "website", "new"),
        ("Farhana Karim", "farhana@startup.com", "+880171111116", "event", "contacted"),
        ("Zahid Hasan", "zahid@corpbd.com", "+8801811111117", "referral", "proposal"),
        ("Tasnim Ahmed", "tasnim@megacorp.com", "+8801911111118", "linkedin", "qualified"),
        ("Kamal Hossain", "kamal@finserve.com", "+8801611111119", "website", "new"),
        ("Rumaisa Chowdhury", "rumaisa@techpark.com", "+8801511111120", "cold_call", "contacted"),
        ("Shafiq Rahman", "shafiq@bigdata.com", "+8801711111121", "linkedin", "proposal"),
        ("Maliha Tabassum", "maliha@cloud.com", "+8801811111122", "website", "qualified"),
    ]
    lead_ids = []
    for name, email, phone, source, status in leads_data:
        existing = await session.execute(select(Lead).where(Lead.name == name))
        lead = existing.scalar_one_or_none()
        if not lead:
            lead = Lead(
                company_id=COMPANY_ID, name=name, email=email, phone=phone,
                source=source, status=status, assigned_to=ADMIN_USER_ID,
                score=random.randint(20, 95),
                notes=f"Interested in enterprise solutions. {random.choice(['High', 'Medium', 'Low'])} priority.",
            )
            session.add(lead)
            await session.flush()
        lead_ids.append(lead.id)
    log(f"Leads: {len(leads_data)}")

    # Deals
    deals_data = [
        ("Enterprise License - TechVision", lead_ids[0], 250000, "negotiation", 70),
        ("Cloud Migration - GreenDelta", lead_ids[1], 500000, "proposal", 50),
        ("IT Infrastructure - BRAC", lead_ids[2], 1200000, "closed_won", 100),
        ("ERP Implementation - GP", lead_ids[3], 800000, "discovery", 30),
        ("Network Upgrade - Walton", lead_ids[4], 350000, "negotiation", 60),
        ("Security Audit - Beximco", lead_ids[5], 150000, "proposal", 45),
        ("Data Center Setup - Square", lead_ids[6], 2000000, "closed_won", 100),
        ("VoIP System - Robi", lead_ids[7], 180000, "discovery", 25),
        ("Backup Solution - EBL", lead_ids[8], 90000, "negotiation", 55),
        ("Cloud Hosting - IDCOL", lead_ids[9], 120000, "proposal", 40),
    ]
    deal_ids = []
    for title, lead_id, value, stage, prob in deals_data:
        existing = await session.execute(select(Deal).where(Deal.title == title))
        deal = existing.scalar_one_or_none()
        if not deal:
            deal = Deal(
                company_id=COMPANY_ID, lead_id=lead_id, title=title,
                value=value, currency="BDT", stage=stage, probability=prob,
                expected_close=date.today() + timedelta(days=random.randint(10, 90)),
                status="open" if stage != "closed_won" else "won",
            )
            session.add(deal)
            await session.flush()
        deal_ids.append(deal.id)
    log(f"Deals: {len(deals_data)}")

    # Quotations
    quot_count = 0
    for i, cust_id in enumerate(customer_ids[:8]):
        existing = await session.execute(select(Quotation).where(Quotation.customer_id == cust_id))
        if existing.scalar_one_or_none():
            continue
        items_in_quote = random.sample(item_ids, k=random.randint(1, 4))
        subtotal = 0
        q = Quotation(
            company_id=COMPANY_ID, customer_id=cust_id,
            quote_number=f"QTN-{2026}-{i+1:04d}",
            date=date.today() - timedelta(days=random.randint(1, 60)),
            expiry=date.today() + timedelta(days=random.randint(10, 30)),
            status=random.choice(["draft", "sent", "accepted", "rejected"]),
        )
        session.add(q)
        await session.flush()
        for item_id in items_in_quote:
            qty = random.randint(1, 10)
            price = float(random.uniform(100, 5000))
            total = qty * price
            subtotal += total
            session.add(QuotationItem(quotation_id=q.id, item_id=item_id, qty=qty, price=price, total=total))
        q.subtotal = subtotal
        q.tax = subtotal * 0.15
        q.total = subtotal + q.tax
        quot_count += 1
    log(f"Quotations: {quot_count}")

    # Sales Orders
    so_count = 0
    for i, cust_id in enumerate(customer_ids[:6]):
        existing = await session.execute(select(SalesOrder).where(SalesOrder.customer_id == cust_id))
        if existing.scalar_one_or_none():
            continue
        items_in_order = random.sample(item_ids, k=random.randint(1, 3))
        subtotal = 0
        so = SalesOrder(
            company_id=COMPANY_ID, customer_id=cust_id,
            order_number=f"SO-{2026}-{i+1:04d}",
            date=date.today() - timedelta(days=random.randint(1, 30)),
            status=random.choice(["confirmed", "processing", "shipped", "delivered"]),
        )
        session.add(so)
        await session.flush()
        for item_id in items_in_order:
            qty = random.randint(1, 15)
            price = float(random.uniform(100, 3000))
            total = qty * price
            subtotal += total
            session.add(SalesOrderItem(sales_order_id=so.id, item_id=item_id, qty=qty, price=price, total=total, delivered_qty=random.randint(0, qty)))
        so.subtotal = subtotal
        so.tax = subtotal * 0.15
        so.total = subtotal + so.tax
        so_count += 1
    log(f"Sales Orders: {so_count}")

    # Delivery Notes
    dn_count = 0
    so_result = await session.execute(select(SalesOrder).where(SalesOrder.status.in_(["shipped", "delivered"])).limit(3))
    for so in so_result.scalars().all():
        existing = await session.execute(select(DeliveryNote).where(DeliveryNote.sales_order_id == so.id))
        if existing.scalar_one_or_none():
            continue
        session.add(DeliveryNote(
            company_id=COMPANY_ID, dn_number=f"DN-{2026}-{dn_count+1:04d}",
            sales_order_id=so.id, date=date.today() - timedelta(days=random.randint(1, 5)),
            shipped_by=ADMIN_USER_ID, status="delivered",
            tracking_number=f"TRK{random.randint(100000, 999999)}",
        ))
        dn_count += 1
    log(f"Delivery Notes: {dn_count}")

    # Inquiries
    inquiry_count = 0
    statuses = ["new", "new", "new", "contacted", "contacted", "qualified", "qualified", "resolved", "resolved", "closed"]
    sources = ["website", "phone", "email", "referral", "social", "walk-in", "partner"]
    inquiries = [
        ("Ahmed Ali", "ahmed@email.com", "+8801710000001", "Interested in bulk laptop purchase for office", "website"),
        ("Fatima Rahman", "fatima@company.com", "+8801810000002", "Need quote for network setup at new branch", "phone"),
        ("Kamal Mia", "kamal@corp.com", "+8801910000003", "Looking for ERP solution for manufacturing", "email"),
        ("Nadia Khan", "nadia@startup.io", "+8801610000004", "Software license inquiry for 50 users", "website"),
        ("Rafiq Uddin", "rafiq@enterprise.com", "+8801510000005", "Server maintenance contract renewal", "referral"),
        ("Sakib Hasan", "sakib@techco.com", "+8801710000006", "Cloud migration consultation needed", "website"),
        ("Tasnim Ahmed", "tasnim@retail.com", "+8801810000007", "POS system integration query", "phone"),
        ("Zara Islam", "zara@design.co", "+8801910000008", "Custom software development quote", "email"),
        ("Imran Hossain", "imran@logistics.com", "+8801610000009", "Fleet management system pricing", "referral"),
        ("Maliha Khan", "maliha@health.org", "+8801510000010", "Hospital management software demo", "website"),
        ("Farhan Rahman", "farhan@edu.bd", "+8801710000011", "Student management system inquiry", "social"),
        ("Nusrat Jahan", "nusrat@fashion.com", "+8801810000012", "E-commerce platform setup", "website"),
        ("Rakibul Hasan", "rakib@construction.com", "+8801910000013", "Project management tool for sites", "phone"),
        ("Sumaiya Akter", "sumaiya@food.com", "+8801610000014", "Inventory management for restaurants", "walk-in"),
        ("Tanvir Alam", "tanvir@auto.com", "+8801510000015", "CRM implementation for dealership", "partner"),
        ("Jesmin Ara", "jesmin@textile.com", "+8801710000016", "Supply chain module pricing", "email"),
        ("Habib Rahman", "habib@pharma.com", "+8801810000017", "Batch tracking software requirements", "website"),
        ("Ruma Akhtar", "ruma@travel.com", "+8801910000018", "Booking system integration", "referral"),
        ("Arif Khan", "arif@energy.com", "+8801610000019", "Asset management system quote", "social"),
        ("Sabrina Mostafa", "sabrina@media.com", "+8801510000020", "Content management system demo", "phone"),
        ("Wali Ullah", "wali@agri.com", "+8801710000021", "Farm management software inquiry", "walk-in"),
        ("Tahsin Rahman", "tahsin@bank.com", "+8801810000022", "Core banking integration query", "partner"),
        ("Maimuna Begum", "maimuna@ngo.org", "+8801910000023", "Donor management system needs", "email"),
        ("Khalid Hossain", "khalid@realty.com", "+8801610000024", "Property management platform", "website"),
        ("Nishat Tasnim", "nishat@beauty.com", "+8801510000025", "Salon booking app development", "social"),
        ("Asif Mahmud", "asif@gov.bd", "+8801710000026", "Government portal modernization RFI", "walk-in"),
        ("Farzana Yasmin", "farzana@legal.com", "+8801810000027", "Legal case management system", "phone"),
        ("Mamun Reza", "mamun@shipping.com", "+8801910000028", "Logistics tracking dashboard quote", "partner"),
        ("Syeda Chowdhury", "syeda@edu.edu", "+8801610000029", "University exam management software", "email"),
        ("Raihan Uddin", "raihan@telecom.com", "+8801510000030", "Network monitoring tool pricing", "website"),
    ]
    for name, email, phone, msg, source in inquiries:
        existing = await session.execute(select(Inquiry).where(Inquiry.name == name))
        if not existing.scalar_one_or_none():
            session.add(Inquiry(
                company_id=COMPANY_ID, name=name, email=email, phone=phone,
                message=msg, source=source,
                status=random.choice(statuses),
                assigned_to=ADMIN_USER_ID,
            ))
            inquiry_count += 1
    log(f"Inquiries: {inquiry_count}")

    # Sales Campaigns
    campaign_count = 0
    campaign_statuses = ["active", "active", "draft", "draft", "completed", "completed", "paused", "planning"]
    campaigns = [
        ("Monsoon Sale 2026", "email", "All customers", 50000),
        ("Corporate Bundle Offer", "social", "IT managers", 120000),
        ("Referral Program Q3", "referral", "Existing customers", 30000),
        ("Back to Office Promo", "banner", "SME owners", 75000),
        ("Year-End Clearance", "email", "All leads", 200000),
        ("Diwali Mega Sale", "email", "All customers", 80000),
        ("Partner Onboarding Drive", "event", "New partners", 45000),
        ("Free Trial Push", "paid", "Trial users", 60000),
        ("Customer Win-Back", "email", "Churned customers", 25000),
        ("Product Launch 2026", "social", "All prospects", 150000),
        ("LinkedIn Thought Leadership", "social", "Enterprise leads", 35000),
        ("Webinar Series Q2", "event", "Tech audience", 20000),
        ("Annual Customer Survey", "email", "Active customers", 5000),
        ("Upsell Premium Plan", "email", "Free users", 40000),
        ("Festival Season Promo", "paid", "All segments", 90000),
        ("New Branch Announcement", "banner", "Local customers", 15000),
        ("Training Workshop Series", "event", "Existing customers", 30000),
        ("Google Ads Retargeting", "paid", "Website visitors", 55000),
        ("Newsletter Signup Drive", "email", "Blog readers", 8000),
        ("CRM Migration Offer", "referral", "Competitor users", 70000),
        ("Quarterly Business Review", "event", "Enterprise clients", 10000),
        ("Social Media Contest", "social", "All followers", 12000),
        ("End of Year Giveaway", "email", "All customers", 45000),
        ("App Download Campaign", "paid", "Mobile users", 65000),
        ("Customer Appreciation Week", "email", "Loyal customers", 20000),
    ]
    for name, t_type, audience, budget in campaigns:
        existing = await session.execute(select(SalesCampaign).where(SalesCampaign.name == name))
        if not existing.scalar_one_or_none():
            session.add(SalesCampaign(
                company_id=COMPANY_ID, name=name, type=t_type,
                start_date=date.today() - timedelta(days=random.randint(1, 60)),
                end_date=date.today() + timedelta(days=random.randint(15, 90)),
                target_audience=audience, status=random.choice(campaign_statuses), budget=budget,
            ))
            campaign_count += 1
    log(f"Campaigns: {campaign_count}")

    # Contracts
    contract_statuses = ["active", "pending", "draft", "expired"]
    contracts_data = [
        ("Enterprise Platform License", 1, 120000, "active"),
        ("Cloud Infrastructure Agreement", 2, 85000, "active"),
        ("Software Maintenance Contract", 3, 45000, "pending"),
        ("Annual Support Agreement", 4, 60000, "active"),
        ("Digital Transformation Project", 5, 250000, "draft"),
        ("Data Analytics Partnership", 6, 95000, "active"),
        ("Cybersecurity Audit Contract", 7, 75000, "pending"),
        ("Mobile App Development", 8, 110000, "active"),
        ("ERP Implementation Phase 1", 9, 180000, "active"),
        ("Network Infrastructure Upgrade", 10, 55000, "expired"),
        ("IT Consulting Retainer", 11, 35000, "active"),
        ("Server Hosting Agreement", 12, 42000, "active"),
        ("Software Licensing Agreement", 13, 28000, "pending"),
        ("Backup & Disaster Recovery", 14, 65000, "active"),
        ("VoIP System Contract", 15, 38000, "draft"),
    ]
    contract_count = 0
    for title, cust_idx, value, status in contracts_data:
        existing = await session.execute(select(CustomerContract).where(CustomerContract.title == title))
        if not existing.scalar_one_or_none():
            session.add(CustomerContract(
                company_id=COMPANY_ID,
                customer_id=cust_idx,
                title=title,
                start_date=date.today() - timedelta(days=random.randint(1, 180)),
                end_date=date.today() + timedelta(days=random.randint(30, 365)),
                value=value,
                status=status,
                renewal_reminder=random.choice([True, False]),
            ))
            contract_count += 1
    log(f"Contracts: {contract_count}")

    await session.commit()
    print("  Sales DONE")
    return customer_ids


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 4: FINANCE
# ═══════════════════════════════════════════════════════════════════════════════
async def seed_finance(session, customer_ids, item_ids):
    print("\n[4] Finance")

    # Bank Accounts
    bank_accounts_data = [
        ("Primary Business Account", "DBBL", "1234567890", 12500000, True),
        ("Savings Account", "BRAC Bank", "9876543210", 3200000, False),
        ("Payroll Account", "UCB", "5555666677", 4500000, False),
        ("Foreign Currency Account", "Standard Chartered", "1112223334", 850000, False),
        ("Petty Cash", "City Bank", "9998887776", 150000, False),
    ]
    bank_ids = []
    for name, bank, acc_no, balance, default in bank_accounts_data:
        existing = await session.execute(select(BankAccount).where(BankAccount.account_number == acc_no))
        if not existing.scalar_one_or_none():
            ba = BankAccount(
                company_id=COMPANY_ID, name=name, bank_name=bank,
                account_number=acc_no, balance=balance, currency="BDT",
                is_default=default,
            )
            session.add(ba)
            await session.flush()
            bank_ids.append(ba.id)
    log(f"Bank Accounts: {len(bank_accounts_data)}")

    # Chart of Accounts
    coa_data = [
        ("1000", "Cash", "asset", 500000),
        ("1100", "Bank Accounts", "asset", 21200000),
        ("1200", "Accounts Receivable", "asset", 3500000),
        ("1300", "Inventory", "asset", 2800000),
        ("1400", "Prepaid Expenses", "asset", 200000),
        ("2000", "Accounts Payable", "liability", 1800000),
        ("2100", "Tax Payable", "liability", 950000),
        ("2200", "Accrued Expenses", "liability", 300000),
        ("2300", "Loan Payable", "liability", 5000000),
        ("3000", "Owner's Equity", "equity", 10000000),
        ("3100", "Retained Earnings", "equity", 4500000),
        ("4000", "Sales Revenue", "revenue", 0),
        ("4100", "Service Revenue", "revenue", 0),
        ("4200", "Other Income", "revenue", 0),
        ("5000", "Cost of Goods Sold", "expense", 0),
        ("5100", "Salary Expense", "expense", 0),
        ("5200", "Rent Expense", "expense", 0),
        ("5300", "Utilities Expense", "expense", 0),
        ("5400", "Marketing Expense", "expense", 0),
        ("5500", "Office Supplies", "expense", 0),
        ("5600", "Depreciation", "expense", 0),
        ("5700", "Travel Expense", "expense", 0),
    ]
    coa_ids = {}
    for code, name, t_type, balance in coa_data:
        existing = await session.execute(select(ChartOfAccount).where(ChartOfAccount.code == code))
        coa = existing.scalar_one_or_none()
        if not coa:
            coa = ChartOfAccount(
                company_id=COMPANY_ID, code=code, name=name, type=t_type, balance=balance, is_active=True,
            )
            session.add(coa)
            await session.flush()
        coa_ids[code] = coa.id
    log(f"Chart of Accounts: {len(coa_data)}")

    # Tax Rates
    tax_rates_data = [
        ("VAT 15%", 15.0, "percentage", True),
        ("VAT 7.5%", 7.5, "percentage", False),
        ("VAT 5%", 5.0, "percentage", False),
        ("Supplementary Duty 10%", 10.0, "percentage", False),
        ("Zero Rate", 0.0, "percentage", False),
    ]
    for name, rate, t_type, default in tax_rates_data:
        existing = await session.execute(select(TaxRate).where(TaxRate.name == name))
        if not existing.scalar_one_or_none():
            session.add(TaxRate(company_id=COMPANY_ID, name=name, rate=rate, type=t_type, is_default=default))
    log(f"Tax Rates: {len(tax_rates_data)}")

    # Invoices
    inv_count = 0
    for i, cust_id in enumerate(customer_ids[:10]):
        existing = await session.execute(select(Invoice).where(Invoice.customer_id == cust_id).limit(1))
        if existing.scalar_one_or_none():
            continue
        inv_items = random.sample(item_ids, k=random.randint(1, 4))
        subtotal = 0
        inv = Invoice(
            company_id=COMPANY_ID, customer_id=cust_id,
            invoice_number=f"INV-{2026}-{i+1:05d}",
            date=date.today() - timedelta(days=random.randint(1, 60)),
            due_date=date.today() + timedelta(days=random.randint(10, 45)),
            status=random.choice(["draft", "sent", "paid", "overdue", "partial"]),
        )
        session.add(inv)
        await session.flush()
        for item_id in inv_items:
            qty = random.randint(1, 10)
            price = float(random.uniform(200, 5000))
            item_tax = price * qty * 0.15
            total = price * qty + item_tax
            subtotal += price * qty
            session.add(InvoiceItem(
                invoice_id=inv.id, item_id=item_id,
                description=f"Item #{item_id}", quantity=qty,
                unit_price=price, tax=item_tax, total=total,
            ))
        tax = subtotal * 0.15
        total = subtotal + tax
        inv.subtotal = subtotal
        inv.tax = tax
        inv.total = total
        inv.paid_amount = total if inv.status == "paid" else (total * random.uniform(0.3, 0.7) if inv.status == "partial" else 0)
        inv.balance_due = total - inv.paid_amount
        inv_count += 1
    log(f"Invoices: {inv_count}")

    # Transactions
    txn_count = 0
    txn_types = ["credit", "debit"]
    txn_descs = [
        "Client payment received", "Office rent payment", "Salary disbursement",
        "Utility bill payment", "Software subscription", "Equipment purchase",
        "Marketing campaign spend", "Travel reimbursement", "Consulting fee",
        "Insurance premium",
    ]
    for _ in range(30):
        session.add(Transaction(
            company_id=COMPANY_ID,
            account_id=random.choice(list(coa_ids.values())),
            type=random.choice(txn_types),
            amount=random.uniform(5000, 500000),
            date=date.today() - timedelta(days=random.randint(1, 90)),
            reference=f"TXN-{random.randint(100000, 999999)}",
            description=random.choice(txn_descs),
            created_by=ADMIN_USER_ID,
        ))
        txn_count += 1
    log(f"Transactions: {txn_count}")

    # Expenses
    exp_count = 0
    exp_categories = [
        "Rent", "Utilities", "Salaries", "Marketing", "Travel",
        "Office Supplies", "Software", "Maintenance", "Insurance", "Training",
    ]
    vendors = ["Walton", "Grameenphone", "DBBL", "BRAC Bank", "City Corporation", "LankaGas", "BPDB", "Banglalink"]
    for _ in range(25):
        session.add(Expense(
            company_id=COMPANY_ID,
            category_id=random.randint(1, 10),
            amount=random.uniform(5000, 200000),
            date=datetime.now() - timedelta(days=random.randint(1, 90)),
            vendor=random.choice(vendors),
            description=f"Monthly {random.choice(exp_categories).lower()} expense",
            approved_by=ADMIN_USER_ID,
        ))
        exp_count += 1
    log(f"Expenses: {exp_count}")

    # Budgets
    budget_count = 0
    depts = await session.execute(select(Department))
    for dept in depts.scalars().all():
        existing = await session.execute(select(Budget).where(Budget.department_id == dept.id, Budget.fiscal_year == 2026))
        if not existing.scalar_one_or_none():
            allocated = random.uniform(500000, 5000000)
            spent = allocated * random.uniform(0.2, 0.8)
            session.add(Budget(
                company_id=COMPANY_ID, department_id=dept.id,
                fiscal_year=2026, allocated=allocated,
                spent=spent, remaining=allocated - spent,
            ))
            budget_count += 1
    log(f"Budgets: {budget_count}")

    # Estimates
    est_count = 0
    for i, cust_id in enumerate(customer_ids[:5]):
        existing = await session.execute(select(Estimate).where(Estimate.customer_id == cust_id))
        if existing.scalar_one_or_none():
            continue
        est_items = random.sample(item_ids, k=random.randint(1, 3))
        subtotal = 0
        est = Estimate(
            company_id=COMPANY_ID, customer_id=cust_id,
            estimate_number=f"EST-{2026}-{i+1:04d}",
            date=date.today() - timedelta(days=random.randint(1, 30)),
            expiry_date=date.today() + timedelta(days=random.randint(10, 30)),
            status=random.choice(["draft", "sent", "accepted", "rejected"]),
        )
        session.add(est)
        await session.flush()
        for item_id in est_items:
            qty = random.randint(1, 5)
            price = float(random.uniform(100, 3000))
            total = qty * price
            subtotal += total
            session.add(EstimateItem(estimate_id=est.id, item_id=item_id, qty=qty, price=price, total=total))
        est.subtotal = subtotal
        est.tax = subtotal * 0.15
        est.total = subtotal + est.tax
        est_count += 1
    log(f"Estimates: {est_count}")

    # Credit Notes
    cn_count = 0
    for i, cust_id in enumerate(customer_ids[:3]):
        existing = await session.execute(select(CreditNote).where(CreditNote.customer_id == cust_id))
        if existing.scalar_one_or_none():
            continue
        session.add(CreditNote(
            company_id=COMPANY_ID, customer_id=cust_id,
            credit_number=f"CN-{2026}-{cn_count+1:04d}",
            date=date.today() - timedelta(days=random.randint(1, 30)),
            amount=random.uniform(5000, 50000),
            status=random.choice(["draft", "issued", "applied"]),
            reason=random.choice(["Return", "Overcharge", "Discount", "Quality issue"]),
        ))
        cn_count += 1
    log(f"Credit Notes: {cn_count}")

    await session.commit()
    print("  Finance DONE")


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 5: PROCUREMENT
# ═══════════════════════════════════════════════════════════════════════════════
async def seed_procurement(session, item_ids):
    print("\n[5] Procurement")

    # Suppliers
    suppliers_data = [
        ("TechSource BD", "sales@techsource.com", "+8801720000001", "Gulshan, Dhaka", 500000),
        ("Office World Bangladesh", "info@officeworld.com", "+8801820000002", "Motijheel, Dhaka", 300000),
        ("Digital Distribution Ltd", "orders@digitaldist.com", "+8801920000003", "Banani, Dhaka", 750000),
        ("Global IT Solutions", "supply@globalit.com", "+8801620000004", "Tejgaon, Dhaka", 400000),
        ("Dhaka Electronics", "purchase@dhaka-elec.com", "+8801520000005", "Elephant Road, Dhaka", 250000),
        ("Chattogram Traders", "info@ctgtraders.com", "+8801720000006", "Agrabad, Chattogram", 350000),
        ("Prime Supply Chain", "ops@primesupply.com", "+8801820000007", "Uttara, Dhaka", 600000),
        ("BanglaTech Imports", "sales@banglatech.com", "+8801920000008", "Dhanmondi, Dhaka", 450000),
    ]
    supplier_ids = []
    for name, email, phone, addr, limit in suppliers_data:
        existing = await session.execute(select(Supplier).where(Supplier.name == name))
        sup = existing.scalar_one_or_none()
        if not sup:
            sup = Supplier(
                company_id=COMPANY_ID, name=name, email=email, phone=phone,
                address=addr, credit_limit=limit, balance=random.uniform(0, limit * 0.2),
                status="active", rating=random.choice([4, 5, 3, 5]),
            )
            session.add(sup)
            await session.flush()
        supplier_ids.append(sup.id)
    log(f"Suppliers: {len(suppliers_data)}")

    # Purchase Requisitions
    pr_count = 0
    for i in range(8):
        pr_items_data = random.sample(item_ids, k=random.randint(1, 4))
        existing = await session.execute(select(PurchaseRequisition).where(PurchaseRequisition.pr_number == f"PR-{2026}-{i+1:04d}"))
        if existing.scalar_one_or_none():
            continue
        pr = PurchaseRequisition(
            company_id=COMPANY_ID, pr_number=f"PR-{2026}-{i+1:04d}",
            department_id=random.randint(67, 76),
            requester_id=ADMIN_USER_ID,
            date=date.today() - timedelta(days=random.randint(1, 45)),
            status=random.choice(["draft", "approved", "ordered"]),
            priority=random.choice(["low", "normal", "high", "urgent"]),
        )
        session.add(pr)
        await session.flush()
        total_est = 0
        for item_id in pr_items_data:
            price = float(random.uniform(100, 5000))
            qty = random.randint(2, 20)
            total_est += price * qty
            session.add(PRItem(pr_id=pr.id, item_id=item_id, qty=qty, estimated_price=price))
        pr.total_estimated = total_est
        pr_count += 1
    log(f"Purchase Requisitions: {pr_count}")

    # Purchase Orders
    po_count = 0
    for i, sup_id in enumerate(supplier_ids[:6]):
        existing = await session.execute(select(PurchaseOrder).where(PurchaseOrder.supplier_id == sup_id).limit(1))
        if existing.scalar_one_or_none():
            continue
        po_items_data = random.sample(item_ids, k=random.randint(1, 4))
        po = PurchaseOrder(
            company_id=COMPANY_ID, po_number=f"PO-{2026}-{po_count+1:04d}",
            supplier_id=sup_id,
            date=date.today() - timedelta(days=random.randint(1, 30)),
            status=random.choice(["draft", "confirmed", "received", "partial"]),
            delivery_date=date.today() + timedelta(days=random.randint(5, 30)),
        )
        session.add(po)
        await session.flush()
        subtotal = 0
        for item_id in po_items_data:
            qty = random.randint(2, 15)
            price = float(random.uniform(100, 3000))
            tax = price * qty * 0.15
            total = price * qty + tax
            subtotal += price * qty
            session.add(POItem(
                po_id=po.id, item_id=item_id, qty=qty, unit_price=price,
                tax=tax, total=total,
                received_qty=random.randint(0, qty),
            ))
        po.subtotal = subtotal
        po.tax = subtotal * 0.15
        po.total = subtotal + po.tax
        po_count += 1
    log(f"Purchase Orders: {po_count}")

    # GRN (Goods Received Notes)
    grn_count = 0
    po_result = await session.execute(select(PurchaseOrder).where(PurchaseOrder.status.in_(["received", "partial"])).limit(4))
    for po in po_result.scalars().all():
        existing = await session.execute(select(GRN).where(GRN.po_id == po.id))
        if existing.scalar_one_or_none():
            continue
        grn = GRN(
            company_id=COMPANY_ID, grn_number=f"GRN-{2026}-{grn_count+1:04d}",
            po_id=po.id, date=date.today() - timedelta(days=random.randint(1, 5)),
            received_by=ADMIN_USER_ID, status="completed",
            warehouse_id=1,
        )
        session.add(grn)
        await session.flush()
        po_items = await session.execute(select(POItem).where(POItem.po_id == po.id))
        for poi in po_items.scalars().all():
            session.add(GRNItem(
                grn_id=grn.id, po_item_id=poi.id,
                received_qty=poi.received_qty or poi.qty,
                accepted_qty=(poi.received_qty or poi.qty) - random.randint(0, 2),
                rejected_qty=random.randint(0, 2),
            ))
        grn_count += 1
    log(f"GRN: {grn_count}")

    # Supplier Payments
    sp_count = 0
    for po in (await session.execute(select(PurchaseOrder).where(PurchaseOrder.status.in_(["received", "confirmed"])))).scalars().all()[:5]:
        existing = await session.execute(select(SupplierPayment).where(SupplierPayment.po_id == po.id))
        if existing.scalar_one_or_none():
            continue
        session.add(SupplierPayment(
            company_id=COMPANY_ID, supplier_id=po.supplier_id, po_id=po.id,
            amount=float(po.total or 0) * random.uniform(0.5, 1.0),
            date=date.today() - timedelta(days=random.randint(1, 15)),
            method=random.choice(["bank_transfer", "cheque", "cash"]),
            reference=f"SP-{random.randint(100000, 999999)}",
        ))
        sp_count += 1
    log(f"Supplier Payments: {sp_count}")

    await session.commit()
    print("  Procurement DONE")


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 6: POS
# ═══════════════════════════════════════════════════════════════════════════════
async def seed_pos(session, item_ids, customer_ids, branch_ids):
    print("\n[6] POS")

    # Cash Registers
    reg_count = 0
    registers = [
        ("Main Register - Gulshan", 50000, "active"),
        ("Main Register - Banani", 35000, "active"),
        ("Warehouse Register - Dhaka", 20000, "inactive"),
    ]
    reg_ids = []
    for name, balance, status in registers:
        existing = await session.execute(select(CashRegister).where(CashRegister.name == name))
        reg = existing.scalar_one_or_none()
        if not reg:
            reg = CashRegister(
                company_id=COMPANY_ID, name=name,
                current_balance=balance, status=status,
            )
            session.add(reg)
            await session.flush()
        reg_ids.append(reg.id)
    log(f"Cash Registers: {len(registers)}")

    # POS Sessions
    session_count = 0
    session_ids = []
    for _ in range(8):
        opened = datetime.now() - timedelta(days=random.randint(1, 30), hours=random.randint(1, 12))
        closed = opened + timedelta(hours=random.randint(4, 10))
        ps = POSSession(
            company_id=COMPANY_ID, branch_id=random.choice(branch_ids) if branch_ids else None,
            cashier_id=ADMIN_USER_ID,
            opened_at=opened, closed_at=closed,
            opening_balance=random.choice([10000, 20000, 50000]),
            closing_balance=random.uniform(15000, 80000),
            status="closed",
        )
        session.add(ps)
        await session.flush()
        session_ids.append(ps.id)
        session_count += 1
    log(f"POS Sessions: {session_count}")

    # POS Sales
    sale_count = 0
    payment_methods = ["cash", "card", "mobile_banking", "bank_transfer"]
    for sess_id in session_ids:
        num_sales = random.randint(3, 8)
        for j in range(num_sales):
            items_in_sale = random.sample(item_ids, k=random.randint(1, 4))
            subtotal = 0
            sale = POSSale(
                company_id=COMPANY_ID, session_id=sess_id,
                sale_number=f"POS-{sess_id:04d}-{j+1:04d}",
                customer_id=random.choice(customer_ids[:5]) if random.random() > 0.3 else None,
                payment_method=random.choice(payment_methods),
                status="completed",
            )
            session.add(sale)
            await session.flush()
            for item_id in items_in_sale:
                qty = random.randint(1, 5)
                price = float(random.uniform(50, 2000))
                tax = price * qty * 0.15
                discount = price * qty * random.uniform(0, 0.1)
                total = price * qty + tax - discount
                subtotal += price * qty
                session.add(POSSaleItem(
                    pos_sale_id=sale.id, item_id=item_id,
                    qty=qty, unit_price=price, tax=tax,
                    discount=discount, total=total,
                ))
            tax = subtotal * 0.15
            discount = subtotal * random.uniform(0, 0.05)
            total = subtotal + tax - discount
            sale.subtotal = subtotal
            sale.tax = tax
            sale.discount = discount
            sale.total = total
            sale.paid = total + random.uniform(0, 100)
            sale.change = sale.paid - total
            sale_count += 1
    log(f"POS Sales: {sale_count}")

    await session.commit()
    print("  POS DONE")


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 7: PROJECTS
# ═══════════════════════════════════════════════════════════════════════════════
async def seed_projects(session):
    print("\n[7] Projects")

    projects_data = [
        ("PRJ-001", "ERP System Development", 1, 2500000, "active", "high", 65),
        ("PRJ-002", "Mobile App - Customer Portal", 2, 800000, "active", "normal", 40),
        ("PRJ-003", "Website Redesign", 3, 350000, "active", "normal", 80),
        ("PRJ-004", "Data Migration Project", 4, 1200000, "planning", "high", 10),
        ("PRJ-005", "Security Audit & Compliance", 5, 500000, "active", "urgent", 30),
        ("PRJ-006", "Cloud Infrastructure Setup", 6, 1800000, "completed", "high", 100),
        ("PRJ-007", "AI Chatbot Integration", 7, 600000, "active", "normal", 55),
        ("PRJ-008", "CRM Module Development", 8, 900000, "active", "high", 70),
    ]
    proj_ids = []
    for code, name, client_idx, budget, status, priority, progress in projects_data:
        existing = await session.execute(select(Project).where(Project.code == code))
        proj = existing.scalar_one_or_none()
        if not proj:
            proj = Project(
                company_id=COMPANY_ID, code=code, name=name,
                client_id=client_idx,
                manager_id=ADMIN_USER_ID,
                budget=budget,
                start_date=date.today() - timedelta(days=random.randint(30, 180)),
                end_date=date.today() + timedelta(days=random.randint(30, 365)),
                status=status, priority=priority, progress_pct=progress,
                billing_type=random.choice(["fixed", "hourly", "retainer"]),
            )
            session.add(proj)
            await session.flush()
        proj_ids.append(proj.id)
    log(f"Projects: {len(projects_data)}")

    # Milestones
    ms_count = 0
    for proj_id in proj_ids:
        num_ms = random.randint(2, 4)
        for i in range(num_ms):
            session.add(ProjectMilestone(
                project_id=proj_id,
                name=f"Milestone {i+1}: {random.choice(['Planning', 'Design', 'Development', 'Testing', 'Deployment', 'Review'])}",
                due_date=date.today() + timedelta(days=random.randint(-30, 120)),
                amount=random.uniform(50000, 300000),
                status=random.choice(["pending", "in_progress", "completed"]),
            ))
            ms_count += 1
    log(f"Milestones: {ms_count}")

    # Tasks
    task_count = 0
    task_titles = [
        "Setup project repository", "Design database schema", "Create API endpoints",
        "Build frontend components", "Write unit tests", "Setup CI/CD pipeline",
        "Code review", "Performance optimization", "Security review",
        "Documentation", "Bug fixes", "User acceptance testing",
        "Deploy to staging", "Client presentation", "Sprint planning",
        "Requirements gathering", "UI/UX design", "Integration testing",
        "Database optimization", "API documentation", "Mobile responsiveness",
    ]
    priorities = ["low", "normal", "high", "critical"]
    stages = ["backlog", "todo", "in_progress", "review", "done"]
    for proj_id in proj_ids:
        num_tasks = random.randint(5, 12)
        for _ in range(num_tasks):
            session.add(ProjectTask(
                project_id=proj_id,
                title=random.choice(task_titles),
                description=f"Detailed task description for {random.choice(task_titles).lower()}",
                assignee_id=ADMIN_USER_ID,
                priority=random.choice(priorities),
                due_date=date.today() + timedelta(days=random.randint(-10, 60)),
                status=random.choice(stages),
                hours_estimated=random.randint(2, 40),
                hours_logged=random.randint(0, 30),
                stage=random.choice(stages),
            ))
            task_count += 1
    log(f"Tasks: {task_count}")

    # Bugs
    bug_count = 0
    severities = ["low", "medium", "high", "critical"]
    bug_titles = [
        "Login page not responsive", "API timeout on large datasets",
        "Dashboard chart not loading", "Form validation missing",
        "Database connection pool exhaustion", "Memory leak in worker",
        "Incorrect calculation in payroll", "File upload fails for large files",
        "Session timeout too short", "Search returns duplicate results",
        "Export CSV encoding issue", "Permission denied on admin route",
    ]
    for proj_id in proj_ids[:5]:
        num_bugs = random.randint(1, 4)
        for _ in range(num_bugs):
            session.add(ProjectBug(
                project_id=proj_id,
                title=random.choice(bug_titles),
                description="Bug description with steps to reproduce",
                severity=random.choice(severities),
                status=random.choice(["open", "in_progress", "resolved", "closed"]),
                reporter_id=ADMIN_USER_ID,
                assignee_id=ADMIN_USER_ID,
            ))
            bug_count += 1
    log(f"Bugs: {bug_count}")

    # Timesheets
    ts_count = 0
    for proj_id in proj_ids[:4]:
        for _ in range(random.randint(5, 15)):
            session.add(Timesheet(
                company_id=COMPANY_ID,
                employee_id=ADMIN_USER_ID,
                project_id=proj_id,
                date=date.today() - timedelta(days=random.randint(0, 30)),
                hours=random.uniform(1, 8),
                description=random.choice([
                    "Development work", "Bug fixing", "Code review",
                    "Meeting with client", "Documentation", "Testing",
                ]),
                billable=random.choice([True, True, True, False]),
                approved_by=ADMIN_USER_ID,
            ))
            ts_count += 1
    log(f"Timesheets: {ts_count}")

    await session.commit()
    print("  Projects DONE")


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE 8: SUPPORT (Tickets, Meetings)
# ═══════════════════════════════════════════════════════════════════════════════
async def seed_support(session):
    print("\n[8] Support")

    # Additional Tickets
    ticket_data = [
        ("Server is running slow", "infrastructure", "high", "open", "Performance degradation on production server"),
        ("Cannot access email", "software", "critical", "in_progress", "User unable to access Outlook since morning"),
        ("New employee onboarding", "hr", "normal", "completed", "Setup accounts for new hire starting Monday"),
        ("Printer not working", "hardware", "low", "open", "Floor 3 printer jammed repeatedly"),
        ("VPN connection issues", "network", "high", "in_progress", "Multiple users reporting VPN drops"),
        ("Software license renewal", "license", "normal", "open", "Adobe Creative Suite expires next month"),
        ("Data backup failure", "infrastructure", "critical", "in_progress", "Nightly backup job failing since Tuesday"),
        ("Website down", "web", "critical", "open", "Customer-facing website returning 502 errors"),
        ("Mobile app crash", "software", "high", "open", "App crashes on iOS when opening settings"),
        ("API rate limiting", "infrastructure", "medium", "resolved", "Third-party API returning 429 errors"),
        ("Password reset not working", "software", "high", "open", "Users cannot reset passwords via portal"),
        ("Firewall alert", "security", "critical", "in_progress", "Unusual traffic pattern detected"),
        ("Database slow queries", "infrastructure", "high", "open", "Report generation taking 5+ minutes"),
        ("New office WiFi setup", "network", "normal", "open", "Need WiFi coverage for new floor"),
    ]
    ticket_ids = []
    for subject, cat, priority, status, desc in ticket_data:
        existing = await session.execute(select(Ticket).where(Ticket.subject == subject))
        if existing.scalar_one_or_none():
            continue
        t = Ticket(
            company_id=COMPANY_ID,
            ticket_number=f"TKT-{random.randint(10000, 99999)}",
            subject=subject, category=cat, priority=priority, status=status,
            requester_id=ADMIN_USER_ID,
            assignee_id=ADMIN_USER_ID if random.random() > 0.3 else None,
            sla_deadline=datetime.now() + timedelta(hours=random.randint(4, 72)),
            resolved_at=datetime.now() - timedelta(hours=random.randint(1, 24)) if status == "resolved" else None,
        )
        session.add(t)
        await session.flush()
        ticket_ids.append(t.id)
    log(f"Tickets: {len(ticket_data)}")

    # Ticket Comments
    comment_count = 0
    for tid in ticket_ids[:8]:
        num_comments = random.randint(1, 4)
        for _ in range(num_comments):
            session.add(TicketComment(
                ticket_id=tid, user_id=ADMIN_USER_ID,
                message=random.choice([
                    "Looking into this now, will update shortly.",
                    "This has been escalated to the infrastructure team.",
                    "Fixed in the latest deployment. Please verify.",
                    "Need more information to reproduce this issue.",
                    "This is a known issue, workaround is available.",
                    "Assigned to the senior engineer for review.",
                    "Checking server logs for more details.",
                    "This should be resolved after the next maintenance window.",
                ]),
                is_internal=random.choice([True, False]),
            ))
            comment_count += 1
    log(f"Ticket Comments: {comment_count}")

    # Meetings
    meeting_count = 0
    meetings_data = [
        ("Sprint Planning - Week 25", "Weekly sprint planning session", 60),
        ("Client Demo - TechVision", "Demo of new ERP features to TechVision BD", 90),
        ("Architecture Review", "Review system architecture for new module", 120),
        ("HR Policy Update Meeting", "Discuss updated HR policies for 2026", 45),
        ("Quarterly Business Review", "Q2 2026 performance review with leadership", 120),
        ("Vendor Evaluation", "Evaluate new cloud service providers", 60),
        ("Security Briefing", "Monthly security awareness briefing", 30),
        ("Team Standup - Engineering", "Daily engineering standup", 15),
    ]
    for title, desc, duration in meetings_data:
        existing = await session.execute(select(Meeting).where(Meeting.title == title))
        if existing.scalar_one_or_none():
            continue
        start = datetime.now() + timedelta(days=random.randint(-14, 14), hours=random.randint(9, 17))
        session.add(Meeting(
            company_id=COMPANY_ID, title=title, description=desc,
            zoom_link=f"https://zoom.us/j/{random.randint(100000000, 999999999)}",
            start_time=start, end_time=start + timedelta(minutes=duration),
            attendees_json=[ADMIN_USER_ID, ADMIN_USER_ID + 1, ADMIN_USER_ID + 2],
            created_by=ADMIN_USER_ID,
        ))
        meeting_count += 1
    log(f"Meetings: {meeting_count}")

    await session.commit()
    print("  Support DONE")


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════
async def main():
    print("=" * 60)
    print("  KLYRON ERP - Comprehensive Module Seed Data")
    print("=" * 60)

    async with Session() as session:
        branch_ids = await seed_master_data(session)
        item_ids = await seed_inventory(session)
        customer_ids = await seed_sales(session, item_ids)
        await seed_finance(session, customer_ids, item_ids)
        await seed_procurement(session, item_ids)
        await seed_pos(session, item_ids, customer_ids, branch_ids)
        await seed_projects(session)
        await seed_support(session)

    print("\n" + "=" * 60)
    print("  ALL MODULES SEEDED SUCCESSFULLY!")
    print("=" * 60)

    # Print summary
    async with engine.connect() as conn:
        tables = [
            "currencies", "countries", "states", "units", "tax_codes", "payment_terms", "designations",
            "items", "item_categories", "warehouses", "stock", "stock_adjustments", "stock_transfers",
            "customers", "leads", "deals", "quotations", "sales_orders", "delivery_notes", "inquiries", "sales_campaigns",
            "bank_accounts", "chart_of_accounts", "transactions", "invoices", "expenses", "budgets", "tax_rates", "estimates", "credit_notes",
            "suppliers", "purchase_requisitions", "purchase_orders", "grn", "supplier_payments",
            "pos_sessions", "pos_sales", "cash_registers",
            "projects", "project_milestones", "project_tasks", "project_bugs", "timesheets",
            "tickets", "ticket_comments", "meetings",
        ]
        print("\n  TABLE COUNTS:")
        for t in tables:
            try:
                r = await conn.execute(text(f'SELECT count(*) FROM "{t}"'))
                count = r.scalar()
                print(f"    {t}: {count}")
            except:
                pass

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
