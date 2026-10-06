"""
Fix seed_data.py: Fix employee_assets column + add comprehensive business seed data.
"""
import sys

with open('scripts/seed_data.py', 'r', encoding='utf-8') as f:
    content = f.read()

# ===== FIX 1: Remove invalid 'condition' column from employee_assets INSERT =====
old_cols = "assigned_at, condition, condition_at_assignment, status)"
new_cols = "assigned_at, condition_at_assignment, status)"

old_vals = ":aa, :cond, :cond, 'assigned')"
new_vals = ":aa, :cond, 'assigned')"

if old_cols in content:
    content = content.replace(old_cols, new_cols)
    content = content.replace(old_vals, new_vals)
    print("FIX 1: Removed invalid 'condition' column from employee_assets")
else:
    print("WARN: employee_assets SQL pattern not found")
    idx = content.find("condition, condition_at_assignment")
    if idx >= 0:
        print(f"  Found at pos {idx}: ...{content[max(0,idx-20):idx+60]}...")
        content = content.replace("condition, condition_at_assignment", "condition_at_assignment")

# ===== FIX 2: Add seed data sections before Summary marker =====
summary_marker = "        # ── Summary ─────────────────────────────────────────────────────"
if summary_marker not in content:
    print("ERROR: Summary marker not found!")
    sys.exit(1)

new_sections = r"""
        # ── 20. Customers ────────────────────────────────────────────────
        print("Creating customers...")
        customer_data = [
            ("TechSolutions BD", "info@techsolutions.com", "01711111111", "Dhaka, Bangladesh", 500000, 10000),
            ("GreenField Agro", "contact@greenfield.com", "01722222222", "Chittagong, Bangladesh", 300000, 5000),
            ("Digital Horizon Ltd", "hello@digitalhorizon.com", "01733333333", "Dhaka, Bangladesh", 750000, 15000),
            ("Prime Electronics", "sales@primeelec.com", "01744444444", "Dhaka, Bangladesh", 200000, 3000),
            ("Blue Ocean Shipping", "info@blueocean.com", "01755555555", "Chittagong, Bangladesh", 400000, 8000),
            ("SoftCare IT", "contact@softcare.com", "01766666666", "Dhaka, Bangladesh", 350000, 7000),
            ("BuildRight Construction", "info@buildright.com", "01777777777", "Dhaka, Bangladesh", 600000, 12000),
            ("MediCore Hospital", "admin@medicore.com", "01788888888", "Dhaka, Bangladesh", 800000, 20000),
        ]
        customer_ids = []
        for name, email, phone, address, credit_limit, balance in customer_data:
            r = await db.execute(
                text("INSERT INTO customers (company_id, name, email, phone, address, credit_limit, balance, status) VALUES (1, :n, :e, :p, :a, :cl, :b, 'active') RETURNING id"),
                {"n": name, "e": email, "p": phone, "a": address, "cl": credit_limit, "b": balance},
            )
            customer_ids.append(r.scalar_one())
        await db.commit()
        print(f"  [OK] {len(customer_data)} customers created")

        # ── 21. Leads ────────────────────────────────────────────────────
        print("Creating leads...")
        lead_data = [
            ("Abdul Karim", "abdul.k@email.com", "01790123456", "website", "new", 30),
            ("Shamima Akter", "shamima.a@email.com", "01790123457", "referral", "contacted", 50),
            ("Hasan Mahmud", "hasan.m@email.com", "01790123458", "social_media", "qualified", 70),
            ("Nargis Jahan", "nargis.j@email.com", "01790123459", "trade_show", "new", 20),
            ("Rafiq Hasan", "rafiq.h@email.com", "01790123460", "website", "proposal", 85),
            ("Laily Begum", "laily.b@email.com", "01790123461", "referral", "new", 15),
            ("Shahidul Islam", "shahidul.i@email.com", "01790123462", "cold_call", "contacted", 40),
            ("Parvin Sultana", "parvin.s@email.com", "01790123463", "website", "qualified", 60),
            ("Jamil Hossain", "jamil.h@email.com", "01790123464", "social_media", "new", 25),
            ("Rashida Khatun", "rashida.k@email.com", "01790123465", "trade_show", "contacted", 45),
        ]
        for name, email, phone, source, status, score in lead_data:
            await db.execute(
                text("INSERT INTO leads (company_id, name, email, phone, source, status, score, assigned_to) VALUES (1, :n, :e, :p, :s, :st, :sc, :uid)"),
                {"n": name, "e": email, "p": phone, "s": source, "st": status, "sc": score, "uid": random.choice(user_ids[1:])},
            )
        await db.commit()
        print(f"  [OK] {len(lead_data)} leads created")

        # ── 22. Deals ────────────────────────────────────────────────────
        print("Creating deals...")
        deal_data = [
            ("ERP Implementation - TechSolutions", 150000, "negotiation", 75, "open"),
            ("Inventory System - GreenField", 45000, "proposal", 50, "open"),
            ("Digital Transformation - Digital Horizon", 250000, "negotiation", 80, "open"),
            ("POS System - Prime Electronics", 35000, "won", 100, "won"),
            ("Logistics Platform - Blue Ocean", 95000, "proposal", 45, "open"),
            ("Cloud Migration - SoftCare IT", 85000, "won", 100, "won"),
            ("Project Management - BuildRight", 120000, "qualification", 25, "open"),
            ("Hospital Mgmt System - MediCore", 280000, "won", 100, "won"),
            ("CRM Integration - TechSolutions", 55000, "lost", 90, "lost"),
            ("E-commerce Platform - Digital Horizon", 180000, "proposal", 55, "open"),
        ]
        for title, value, stage, prob, status in deal_data:
            await db.execute(
                text("INSERT INTO deals (company_id, title, value, stage, probability, status) VALUES (1, :t, :v, :s, :p, :st)"),
                {"t": title, "v": value, "s": stage, "p": prob, "st": status},
            )
        await db.commit()
        print(f"  [OK] {len(deal_data)} deals created")

        # ── 23. Sales Orders ─────────────────────────────────────────────
        print("Creating sales orders...")
        order_statuses = ["confirmed", "processing", "shipped", "delivered", "draft"]
        for i in range(8):
            cust_id = customer_ids[i % len(customer_ids)]
            total = random.choice([5000, 12000, 25000, 45000, 80000, 150000])
            order_status = random.choice(order_statuses)
            r = await db.execute(
                text("INSERT INTO sales_orders (company_id, order_number, customer_id, subtotal, total, status, delivery_date) VALUES (1, :on, :cid, :st, :t, :s, :dd) RETURNING id"),
                {
                    "on": f"SO-{2026001 + i}",
                    "cid": cust_id,
                    "st": round(total * 0.9, 2),
                    "t": total,
                    "s": order_status,
                    "dd": today + timedelta(days=random.randint(5, 30)),
                },
            )
            order_id = r.scalar_one()
            await db.execute(
                text("INSERT INTO sales_order_items (sales_order_id, qty, price, total) VALUES (:oid, :q, :p, :t)"),
                {"oid": order_id, "q": random.randint(1, 10), "p": round(total * 0.9 / 5, 2), "t": total},
            )
        await db.commit()
        print("  [OK] Sales orders with items created")

        # ── 24. Chart of Accounts ────────────────────────────────────────
        print("Creating chart of accounts...")
        coa_data = [
            ("1000", "Cash & Bank", "asset", None),
            ("1100", "Accounts Receivable", "asset", None),
            ("1200", "Inventory", "asset", None),
            ("1300", "Fixed Assets", "asset", None),
            ("2000", "Accounts Payable", "liability", None),
            ("2100", "Accrued Expenses", "liability", None),
            ("2200", "Short-term Loans", "liability", None),
            ("3000", "Owner's Equity", "equity", None),
            ("3100", "Retained Earnings", "equity", None),
            ("4000", "Sales Revenue", "revenue", None),
            ("4100", "Service Revenue", "revenue", None),
            ("5000", "COGS", "expense", None),
            ("6000", "Operating Expenses", "expense", None),
            ("6100", "Salaries & Wages", "expense", None),
            ("6200", "Rent & Utilities", "expense", None),
            ("7000", "Tax Expense", "expense", None),
        ]
        coa_ids = {}
        for code, name, atype, parent_id in coa_data:
            r = await db.execute(
                text("INSERT INTO chart_of_accounts (company_id, code, name, type, balance, is_active) VALUES (1, :c, :n, :t, :bal, true) RETURNING id"),
                {"c": code, "n": name, "t": atype, "bal": random.uniform(10000, 500000)},
            )
            coa_ids[name] = r.scalar_one()
        await db.commit()
        print(f"  [OK] {len(coa_data)} chart of accounts created")

        # ── 25. Bank Accounts ────────────────────────────────────────────
        print("Creating bank accounts...")
        bank_data = [
            ("DBBL Current Account", "12345678901", "Dutch Bangla Bank", 500000),
            ("BRAC Business Account", "98765432109", "BRAC Bank", 350000),
            ("City Bank USD Account", "CITY-USD-001", "City Bank", 75000),
            ("UCB Savings", "UCB-2025-001", "UCB Bank", 200000),
        ]
        for name, acct_no, bank_name, balance in bank_data:
            await db.execute(
                text("INSERT INTO bank_accounts (company_id, name, account_number, bank_name, balance, is_default, currency) VALUES (1, :n, :an, :bn, :bal, :def, 'BDT')"),
                {"n": name, "an": acct_no, "bn": bank_name, "bal": balance, "def": name == "DBBL Current Account"},
            )
        await db.commit()
        print(f"  [OK] {len(bank_data)} bank accounts created")

        # ── 26. Invoices ─────────────────────────────────────────────────
        print("Creating invoices...")
        for i in range(10):
            cust_id = customer_ids[i % len(customer_ids)]
            subtotal = random.choice([5000, 12000, 25000, 35000, 55000, 85000, 120000])
            tax = round(subtotal * 0.05, 2)
            total = subtotal + tax
            if i < 6:
                inv_status = "paid"
                paid = total
                balance = 0
            elif i < 8:
                inv_status = "partial"
                paid = round(total * 0.5, 2)
                balance = total - paid
            elif i < 9:
                inv_status = "sent"
                paid = 0
                balance = total
            else:
                inv_status = "overdue"
                paid = 0
                balance = total
            inv_date = today - timedelta(days=random.randint(1, 45))
            inv_due = inv_date + timedelta(days=30)
            r = await db.execute(
                text("INSERT INTO invoices (company_id, customer_id, invoice_number, date, due_date, subtotal, tax, total, status, paid_amount, balance_due) VALUES (1, :cid, :invno, :d, :due, :st, :tax, :tot, :s, :pa, :bal) RETURNING id"),
                {
                    "cid": cust_id,
                    "invno": f"INV-{2026001 + i}",
                    "d": inv_date,
                    "due": inv_due,
                    "st": subtotal,
                    "tax": tax,
                    "tot": total,
                    "s": inv_status,
                    "pa": paid,
                    "bal": balance,
                },
            )
            inv_id = r.scalar_one()
            await db.execute(
                text("INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total) VALUES (:iid, :desc, :q, :up, :t)"),
                {"iid": inv_id, "desc": f"Product/Services - Invoice {i+1}", "q": 1, "up": total, "t": total},
            )
        await db.commit()
        print("  [OK] 10 invoices created with items")

        # ── 27. Transactions ─────────────────────────────────────────────
        print("Creating transactions...")
        txn_types = ["debit", "credit"]
        for i in range(15):
            acct_name = random.choice(list(coa_ids.keys()))
            acct_id = coa_ids[acct_name]
            ttype = random.choice(txn_types)
            amount = random.randint(5000, 100000)
            await db.execute(
                text("INSERT INTO transactions (company_id, account_id, type, amount, description, date) VALUES (1, :aid, :t, :amt, :desc, :d)"),
                {
                    "aid": acct_id,
                    "t": ttype,
                    "amt": amount,
                    "desc": f"Transaction #{i+1} - {acct_name}",
                    "d": today - timedelta(days=random.randint(1, 30)),
                },
            )
        await db.commit()
        print("  [OK] 15 transactions created")

        # ── 28. Expenses ─────────────────────────────────────────────────
        print("Creating expenses...")
        vendor_data = ["Dhaka Power Supply", "Titas Gas", "Grameenphone", "Staples BD", "IT Gadgets Ltd", "OfficeMart", "Fresh Catering"]
        for i in range(12):
            amount = random.randint(2000, 75000)
            await db.execute(
                text("INSERT INTO expenses (company_id, amount, date, vendor, description) VALUES (1, :amt, :d, :v, :desc)"),
                {
                    "amt": amount,
                    "d": today - timedelta(days=random.randint(1, 60)),
                    "v": random.choice(vendor_data),
                    "desc": f"Expense #{i+1}",
                },
            )
        await db.commit()
        print("  [OK] 12 expenses created")

        # ── 29. Suppliers ────────────────────────────────────────────────
        print("Creating suppliers...")
        supplier_data = [
            ("GlobalTech BD", "info@globaltech.com", "01711110001", "Dhaka", 500000, 0),
            ("Office Supplies Ltd", "sales@officesupplies.com", "01711110002", "Dhaka", 200000, 0),
            ("Raw Materials Inc", "orders@rawmaterials.com", "01711110003", "Chittagong", 800000, 0),
            ("Hardware Solutions", "info@hardware.com", "01711110004", "Dhaka", 350000, 0),
            ("Packaging Pro", "info@packagingpro.com", "01711110005", "Gazipur", 150000, 0),
        ]
        for name, email, phone, address, cl, bal in supplier_data:
            await db.execute(
                text("INSERT INTO suppliers (company_id, name, email, phone, address, credit_limit, balance, status) VALUES (1, :n, :e, :p, :a, :cl, :b, 'active')"),
                {"n": name, "e": email, "p": phone, "a": address, "cl": cl, "b": bal},
            )
        await db.commit()
        print(f"  [OK] {len(supplier_data)} suppliers created")

        # ── 30. Inventory: Categories, Items, Warehouses, Stock ────────────
        print("Creating inventory data...")
        # Categories
        cat_data = ["Electronics", "Office Supplies", "Furniture", "Raw Materials", "Packaging"]
        cat_ids = []
        for cname in cat_data:
            r = await db.execute(
                text("INSERT INTO item_categories (company_id, name, code) VALUES (1, :n, :c) RETURNING id"),
                {"n": cname, "c": cname[:3].upper()},
            )
            cat_ids.append(r.scalar_one())
        await db.commit()

        # Items
        item_data = [
            ("Laptop Dell Latitude", cat_ids[0], "pcs", 45000, 55000, "DL-LAT-001"),
            ("Office Chair Ergonomic", cat_ids[2], "pcs", 8500, 12000, "OC-ERGO-001"),
            ("A4 Paper Box", cat_ids[1], "box", 800, 1200, "A4-PAPER-001"),
            ("USB Cable Type-C", cat_ids[0], "pcs", 150, 350, "USB-TYPEC-001"),
            ("Steel Almirah", cat_ids[2], "pcs", 15000, 22000, "ALM-STL-001"),
            ("Raw Plastic Granules", cat_ids[3], "kg", 120, 180, "PLA-GRN-001"),
            ("Cardboard Box Large", cat_ids[4], "pcs", 45, 85, "CBD-LRG-001"),
            ("Monitor 24inch", cat_ids[0], "pcs", 12000, 16000, "MON-24-001"),
            ("Whiteboard Magnetic", cat_ids[1], "pcs", 2500, 4000, "WB-MAG-001"),
            ("Steel Shelving Unit", cat_ids[2], "pcs", 18000, 25000, "SHL-STL-001"),
            ("Printer HP LaserJet", cat_ids[0], "pcs", 22000, 30000, "PRN-HP-001"),
            ("Aluminum Sheets", cat_ids[3], "sheet", 350, 550, "ALM-SHT-001"),
            ("Bubble Wrap Roll", cat_ids[4], "roll", 250, 400, "BWR-001"),
            ("Desk Lamp LED", cat_ids[1], "pcs", 1200, 1800, "DL-LED-001"),
            ("Network Switch 24-port", cat_ids[0], "pcs", 8500, 12000, "NS-24P-001"),
        ]
        item_ids = []
        for item_name, cat_id, unit, cost, sell, sku in item_data:
            r = await db.execute(
                text("INSERT INTO items (company_id, sku, name, category_id, unit, cost_price, sell_price) VALUES (1, :sku, :n, :cid, :u, :cp, :sp) RETURNING id"),
                {"sku": sku, "n": item_name, "cid": cat_id, "u": unit, "cp": cost, "sp": sell},
            )
            item_ids.append(r.scalar_one())
        await db.commit()

        # Warehouses
        wh_data = ["Main Warehouse - Dhaka", "Chittagong Warehouse", "Gazipur Storage"]
        wh_ids = []
        for wh_name in wh_data:
            r = await db.execute(
                text("INSERT INTO warehouses (company_id, code, name, address, is_active) VALUES (1, :c, :n, :a, true) RETURNING id"),
                {"c": wh_name[:3].upper(), "n": wh_name, "a": f"{wh_name} Area"},
            )
            wh_ids.append(r.scalar_one())
        await db.commit()

        # Stock
        for item_id in item_ids:
            for wh_id in wh_ids:
                qty = random.randint(20, 500)
                rl = random.randint(5, 50)
                rq = random.randint(20, 100)
                await db.execute(
                    text("INSERT INTO stock (company_id, item_id, warehouse_id, quantity, reserved_qty, reorder_level, reorder_qty) VALUES (1, :iid, :wid, :q, :rq, :rl, :rqty)"),
                    {"iid": item_id, "wid": wh_id, "q": qty, "rq": random.randint(0, qty // 4), "rl": rl, "rqty": rq},
                )
        await db.commit()
        print(f"  [OK] {len(cat_data)} categories, {len(item_data)} items, {len(wh_data)} warehouses, stock created")

        # ── 31. Projects ────────────────────────────────────────────────
        print("Creating projects...")
        project_data = [
            ("PRJ-001", "ERP v2 Development", 1, 2, 500000, 60, "active"),
            ("PRJ-002", "Mobile App - Customer Portal", 6, 2, 200000, 30, "active"),
            ("PRJ-003", "Cloud Infrastructure Migration", 3, 0, 350000, 75, "active"),
            ("PRJ-004", "Data Analytics Dashboard", 1, 2, 180000, 15, "in_progress"),
            ("PRJ-005", "HR Portal Redesign", 8, 12, 120000, 40, "active"),
            ("PRJ-006", "E-commerce Integration", 7, 10, 280000, 80, "active"),
        ]
        project_ids = []
        for code, name, mgr_idx, client_idx, budget, progress, status in project_data:
            manager_id = user_ids[mgr_idx] if mgr_idx < len(user_ids) else None
            client_id = customer_ids[client_idx] if client_idx < len(customer_ids) else None
            sd = today - timedelta(days=random.randint(30, 90))
            ed = sd + timedelta(days=random.randint(60, 180))
            r = await db.execute(
                text("INSERT INTO projects (company_id, code, name, manager_id, client_id, budget, start_date, end_date, status, progress_pct) VALUES (1, :c, :n, :mgr, :cl, :b, :sd, :ed, :st, :pp) RETURNING id"),
                {"c": code, "n": name, "mgr": manager_id, "cl": client_id, "b": budget, "sd": sd, "ed": ed, "st": status, "pp": progress},
            )
            project_ids.append(r.scalar_one())
        await db.commit()

        # Project Tasks
        task_titles = ["Requirements Gathering", "Design Phase", "Development", "Testing", "Deployment", "Documentation", "UI Design", "API Integration", "Code Review"]
        task_count = 0
        for pid in project_ids:
            num_tasks = random.randint(3, 6)
            selected_tasks = random.sample(task_titles, k=num_tasks)
            for title in selected_tasks:
                assignee = random.choice(user_ids)
                due = today + timedelta(days=random.randint(-5, 30))
                task_status = random.choice(["todo", "in_progress", "review", "done"])
                priority = random.choice(["low", "medium", "high"])
                await db.execute(
                    text("INSERT INTO project_tasks (project_id, title, assignee_id, priority, due_date, status, hours_estimated, hours_logged) VALUES (:pid, :t, :aid, :p, :dd, :st, :he, :hl)"),
                    {"pid": pid, "t": title, "aid": assignee, "p": priority, "dd": due, "st": task_status, "he": random.randint(4, 40), "hl": random.randint(0, 20)},
                )
                task_count += 1
        await db.commit()
        print(f"  [OK] {len(project_data)} projects with {task_count} tasks created")

"""

# Insert before Summary
idx = content.find(summary_marker)
if idx >= 0:
    content = content[:idx] + new_sections + content[idx:]
    print("FIX 2: Added comprehensive seed data (customers, leads, deals, orders, finance, inventory, procurement, projects)")
else:
    print("ERROR: Could not find Summary marker")

# FIX 3: Update summary to show new counts
content = content.replace(
    '        print(f"  Tickets:        Multiple")',
    '        print(f"  Tickets:        Multiple")\n        print(f"  Customers:      {len(customer_data)}")\n        print(f"  Leads:          {len(lead_data)}")\n        print(f"  Deals:          {len(deal_data)}")\n        print(f"  Chart of Accts: {len(coa_data)}")\n        print(f"  Invoices:       10")\n        print(f"  Suppliers:      {len(supplier_data)}")\n        print(f"  Items:          {len(item_data)}")\n        print(f"  Warehouses:     {len(wh_data)}")\n        print(f"  Projects:       {len(project_data)}")\n        print(f"  Tasks:          {task_count}")'
)
print("FIX 3: Updated summary counts")

# Write back
with open('scripts/seed_data.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nAll fixes applied successfully!")
