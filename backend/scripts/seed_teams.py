"""
Klyron ERP — Seed Teams & Assignment Rules
Creates Sales and Call Center teams, assigns employees, and creates
criteria-based assignment rules with team routing.

Usage:
    cd backend
    python scripts/seed_teams.py
"""
import asyncio
import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import text

DATABASE_URL = "postgresql+asyncpg://klyron_borhan:klyron123@localhost:5433/klyron_erp"


async def seed():
    engine = create_async_engine(DATABASE_URL)
    Session = async_sessionmaker(engine, expire_on_commit=False)

    async with Session() as db:
        print("Seeding teams and assignment rules...")
        print("=" * 60)

        # Get users
        result = await db.execute(text("SELECT id FROM users WHERE company_id = 1 ORDER BY id LIMIT 25"))
        user_ids = [r[0] for r in result.fetchall()]
        if not user_ids:
            print("ERROR: No users found. Run seed_data.py first.")
            return
        print(f"  Found {len(user_ids)} users")

        # Get employees with user_ids
        emp_result = await db.execute(
            text("SELECT e.id, e.user_id, u.full_name FROM employees e JOIN users u ON u.id = e.user_id WHERE e.company_id = 1 AND e.deleted_at IS NULL")
        )
        employees = emp_result.all()
        print(f"  Found {len(employees)} employees")

        # Check if teams exist
        existing = await db.execute(text("SELECT id, name FROM teams WHERE company_id = 1 AND name IN ('Sales Team', 'Call Center') LIMIT 2"))
        existing_teams = {row.name: row.id for row in existing.all()}

        team1_id = None
        team2_id = None

        if "Sales Team" in existing_teams:
            team1_id = existing_teams["Sales Team"]
            print("  [SKIP] Sales Team already exists")
        else:
            r = await db.execute(
                text("INSERT INTO teams (company_id, name, description, is_active) VALUES (:cid, 'Sales Team', 'Sales & Business Development team handling qualified leads and deals', true) RETURNING id"),
                dict(cid=1),
            )
            team1_id = r.scalar_one()
            print("  [OK] Created Sales Team")

        if "Call Center" in existing_teams:
            team2_id = existing_teams["Call Center"]
            print("  [SKIP] Call Center already exists")
        else:
            r = await db.execute(
                text("INSERT INTO teams (company_id, name, description, is_active) VALUES (:cid, 'Call Center', 'Inbound/Outbound call center team handling initial lead contact', true) RETURNING id"),
                dict(cid=1),
            )
            team2_id = r.scalar_one()
            print("  [OK] Created Call Center")

        await db.commit()

        # Assign employees to teams based on name matching
        sales_emp_ids = []
        call_center_emp_ids = []
        for emp in employees:
            name_lower = emp.full_name.lower() if emp.full_name else ""
            if any(kw in name_lower for kw in ["jubayer", "farhana", "rakibul", "hasan", "mahmud"]):
                sales_emp_ids.append(emp.id)
            elif any(kw in name_lower for kw in ["nargis", "parvin", "shamima", "laily", "farida"]):
                call_center_emp_ids.append(emp.id)

        # Fallback: first 3 to sales, next 3 to call center
        if not sales_emp_ids and len(employees) >= 3:
            sales_emp_ids = [employees[i].id for i in range(min(3, len(employees)))]
        if not call_center_emp_ids and len(employees) >= 6:
            call_center_emp_ids = [employees[i].id for i in range(3, min(6, len(employees)))]

        for emp_id in sales_emp_ids:
            existing_assoc = await db.execute(
                text("SELECT 1 FROM employee_teams WHERE employee_id = :eid AND team_id = :tid"),
                dict(eid=emp_id, tid=team1_id),
            )
            if not existing_assoc.scalar_one_or_none():
                await db.execute(
                    text("INSERT INTO employee_teams (employee_id, team_id, role) VALUES (:eid, :tid, 'member')"),
                    dict(eid=emp_id, tid=team1_id),
                )

        for emp_id in call_center_emp_ids:
            existing_assoc = await db.execute(
                text("SELECT 1 FROM employee_teams WHERE employee_id = :eid AND team_id = :tid"),
                dict(eid=emp_id, tid=team2_id),
            )
            if not existing_assoc.scalar_one_or_none():
                await db.execute(
                    text("INSERT INTO employee_teams (employee_id, team_id, role) VALUES (:eid, :tid, 'member')"),
                    dict(eid=emp_id, tid=team2_id),
                )

        await db.commit()

        # Get user_ids of sales and call center team members
        sales_user_ids = [e.user_id for e in employees if e.id in sales_emp_ids and e.user_id]
        cc_user_ids = [e.user_id for e in employees if e.id in call_center_emp_ids and e.user_id]
        print(f"  [OK] Sales Team members: {len(sales_emp_ids)}, Call Center: {len(call_center_emp_ids)}")

        # ── Clean existing rules ──
        await db.execute(text("DELETE FROM lead_assignment_distributions"))
        await db.execute(text("DELETE FROM lead_assignment_rules"))
        await db.commit()

        # ── Create Assignment Rules ──
        print("Creating assignment rules...")

        # Rule 1: Website/Referral → Sales Team (Round Robin)
        r = await db.execute(
            text("""INSERT INTO lead_assignment_rules (company_id, name, rule_type, team_id, criteria, is_active, created_by)
                 VALUES (1, 'Website & Referral → Sales', 'round_robin', :tid,
                 :criteria, true, :cb) RETURNING id"""),
            dict(tid=team1_id, criteria=json.dumps({"sources": ["website", "referral", "linkedin", "email_campaign"]}), cb=user_ids[0]),
        )
        rule1_id = r.scalar_one()
        for uid in sales_user_ids:
            await db.execute(
                text("INSERT INTO lead_assignment_distributions (rule_id, user_id, weight) VALUES (:rid, :uid, 1)"),
                dict(rid=rule1_id, uid=uid),
            )
        print("  [OK] Rule 1: Website & Referral → Sales (Round Robin)")

        # Rule 2: Cold Call/Event → Call Center (Ratio)
        r = await db.execute(
            text("""INSERT INTO lead_assignment_rules (company_id, name, rule_type, team_id, criteria, is_active, created_by)
                 VALUES (1, 'Cold Call & Event → Call Center', 'ratio', :tid,
                 :criteria, true, :cb) RETURNING id"""),
            dict(tid=team2_id, criteria=json.dumps({"sources": ["cold_call", "event", "other"]}), cb=user_ids[0]),
        )
        rule2_id = r.scalar_one()
        for i, uid in enumerate(cc_user_ids):
            weight = max(3 - i, 1)
            await db.execute(
                text("INSERT INTO lead_assignment_distributions (rule_id, user_id, weight) VALUES (:rid, :uid, :w)"),
                dict(rid=rule2_id, uid=uid, w=weight),
            )
        print("  [OK] Rule 2: Cold Call & Event → Call Center (Ratio weighted)")

        # Rule 3: Catch-all → Sales Team (Ratio, no criteria = matches all)
        r = await db.execute(
            text("""INSERT INTO lead_assignment_rules (company_id, name, rule_type, team_id, is_active, created_by)
                 VALUES (1, 'Catch-All → Sales', 'ratio', :tid, true, :cb) RETURNING id"""),
            dict(tid=team1_id, cb=user_ids[0]),
        )
        rule3_id = r.scalar_one()
        for i, uid in enumerate(sales_user_ids):
            weight = max(3 - i, 1)
            await db.execute(
                text("INSERT INTO lead_assignment_distributions (rule_id, user_id, weight) VALUES (:rid, :uid, :w)"),
                dict(rid=rule3_id, uid=uid, w=weight),
            )
        print("  [OK] Rule 3: Catch-All → Sales (Ratio weighted)")

        await db.commit()

        # ── Summary ──
        print("\n" + "=" * 60)
        print("TEAM & RULE SEED COMPLETE!")
        print("=" * 60)
        print(f"  Sales Team:     {len(sales_emp_ids)} members")
        print(f"  Call Center:    {len(call_center_emp_ids)} members")
        print(f"  Rules:          3")
        print(f"    - Website/Referral → Sales (Round Robin)")
        print(f"    - Cold Call/Event → Call Center (Ratio)")
        print(f"    - Catch-All → Sales (Ratio)")
        print()

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
