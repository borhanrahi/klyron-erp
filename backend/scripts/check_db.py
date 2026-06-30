"""Check database state - tables and columns."""
import sys
sys.path.insert(0, '.')
import asyncio
from app.database import engine
from sqlalchemy import text

async def main():
    async with engine.connect() as conn:
        # Check leads columns
        result = await conn.execute(text(
            "SELECT column_name, data_type FROM information_schema.columns "
            "WHERE table_name = 'leads' ORDER BY ordinal_position"
        ))
        cols = result.fetchall()
        print("=== Leads Table Columns ===")
        for c in cols:
            print(f"  {c[0]:30s} {c[1]}")

        # Check all tables
        result = await conn.execute(text(
            "SELECT table_name FROM information_schema.tables "
            "WHERE table_schema = 'public' ORDER BY table_name"
        ))
        tables = result.fetchall()
        print("\n=== All Tables ===")
        for t in tables:
            print(f"  {t[0]}")

        # Check new tables specifically
        new_tables = ['lead_activities', 'lead_tasks', 'lead_assignment_rules',
                       'lead_assignment_distributions', 'lead_assignment_logs']
        print("\n=== New Tables Check ===")
        table_names = {t[0] for t in tables}
        for nt in new_tables:
            print(f"  {nt}: {'✅ EXISTS' if nt in table_names else '❌ MISSING'}")

        # Check lead count
        result = await conn.execute(text("SELECT COUNT(*) FROM leads"))
        count = result.scalar()
        print(f"\n=== Lead Count: {count} ===")

        # Show sample leads if any
        if count > 0:
            result = await conn.execute(text("SELECT id, name, email, status, score, company_name, assigned_to FROM leads LIMIT 5"))
            rows = result.fetchall()
            print("\n=== Sample Leads ===")
            for r in rows:
                print(f"  ID={r[0]:4d}  Name={r[1]:20s}  Status={r[2]:15s}  Score={r[3]:3d}  Company={r[4]:20s}  Assigned={r[5]}")

asyncio.run(main())
