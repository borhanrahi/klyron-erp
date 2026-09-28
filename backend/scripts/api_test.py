"""
Klyron ERP - Full API Test Suite
"""
import urllib.request
import json
import sys

BASE = "http://localhost:8000/api/v1"


def post(url, data):
    req = urllib.request.Request(
        url, data=json.dumps(data).encode(),
        headers={"Content-Type": "application/json"}
    )
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:300]
        return e.code, body
    except Exception as e:
        return 0, str(e)


def get(url, token):
    req = urllib.request.Request(
        url, headers={"Authorization": f"Bearer {token}"}
    )
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read().decode())
        return resp.status, data
    except urllib.error.HTTPError as e:
        try:
            body = json.loads(e.read().decode())
            return e.code, body
        except Exception:
            return e.code, {"detail": str(e)}
    except Exception as e:
        return 0, str(e)


def count_items(d):
    if isinstance(d, list):
        return len(d)
    if isinstance(d, dict):
        for key in ["items", "data", "results", "records"]:
            if key in d and isinstance(d[key], list):
                return len(d[key])
    return "?"


def test(name, ep, token):
    status, body = get(f"{BASE}{ep}", token)
    items = count_items(body)
    if status == 200:
        print(f"  [OK] GET {ep} -> {status} | count={items}")
        return True
    else:
        detail = ""
        if isinstance(body, dict):
            detail = f" | {str(body.get('detail', ''))[:120]}"
        else:
            detail = f" | {str(body)[:120]}"
        print(f"  [ERR] GET {ep} -> {status}{detail}")
        return False


results = {"passed": 0, "failed": 0, "failures": []}
r = results


def run(name, ep, token):
    ok = test(name, ep, token)
    if ok:
        r["passed"] += 1
    else:
        r["failed"] += 1
        r["failures"].append(ep)


print("=" * 65)
print("  KLYRON ERP - FULL API TEST SUITE")
print("=" * 65)

# Step 1: Login
print("\n[1] AUTHENTICATION")
print("-" * 50)
status, body = post(
    f"{BASE}/auth/login",
    {"email": "borhanuddin.bd2026@gmail.com", "password": "Admin@123456"}
)
if status == 200:
    token = body.get("access_token", "")
    print(f"  [OK] POST /auth/login -> {status} | Token: {token[:30]}...")
    r["passed"] += 1
else:
    token = ""
    print(f"  [ERR] POST /auth/login -> {status} | {body}")
    r["failed"] += 1
    r["failures"].append("/auth/login")

if not token:
    print("\nCRITICAL: No token obtained. Aborting remaining tests.")
    print(f"\nRESULTS: {r['passed']} passed, {r['failed']} failed out of {r['passed']+r['failed']} tests")
    sys.exit(1)

# Auth/me
run("/auth/me", "/auth/me", token)

# Dashboard
print("\n[2] DASHBOARD")
print("-" * 50)
for ep in ["/dashboard/executive", "/dashboard/team", "/dashboard/activity"]:
    run(ep, ep, token)

# Sales
print("\n[3] SALES")
print("-" * 50)
for ep in ["/sales/leads", "/sales/customers", "/sales/deals",
           "/sales/orders", "/sales/quotations", "/sales/contracts"]:
    run(ep, ep, token)

# Finance
print("\n[4] FINANCE")
print("-" * 50)
for ep in ["/finance/invoices", "/finance/chart-of-accounts",
           "/finance/bank-accounts", "/finance/credit-notes",
           "/finance/debit-notes", "/finance/estimates",
           "/finance/expenses", "/finance/budgets",
           "/finance/payments", "/finance/transactions"]:
    run(ep, ep, token)

# HR
print("\n[5] HR")
print("-" * 50)
for ep in ["/hr/employees", "/hr/payroll", "/hr/attendance",
           "/hr/departments", "/hr/positions", "/hr/leaves"]:
    run(ep, ep, token)

# Inventory
print("\n[6] INVENTORY")
print("-" * 50)
for ep in ["/inventory/items", "/inventory/categories",
           "/inventory/warehouses", "/inventory/stock",
           "/inventory/adjustments", "/inventory/transfers"]:
    run(ep, ep, token)

# Support
print("\n[7] SUPPORT")
print("-" * 50)
for ep in ["/support/tickets", "/support/meetings", "/support/knowledge-base"]:
    run(ep, ep, token)

# Projects & Procurement
print("\n[8] PROJECTS & PROCUREMENT")
print("-" * 50)
for ep in ["/projects", "/procurement/purchase-orders",
           "/procurement/suppliers", "/procurement/grn"]:
    run(ep, ep, token)

# Admin & Master Data
print("\n[9] ADMIN & MASTER DATA")
print("-" * 50)
for ep in ["/admin/users", "/admin/roles", "/admin/audit-logs",
           "/master-data/companies", "/master-data/currencies",
           "/master-data/tax-rates", "/master-data/uom"]:
    run(ep, ep, token)

print("\n" + "=" * 65)
print(f"  RESULTS: {r['passed']} passed, {r['failed']} failed out of {r['passed'] + r['failed']} tests")
print("=" * 65)
if r["failures"]:
    print("\nFAILED ENDPOINTS:")
    for f in r["failures"]:
        print(f"  - {f}")
else:
    print("\nAll endpoints passed!")
