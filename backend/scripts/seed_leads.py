"""
Klyron ERP — Lead Seed Script
Seeds leads with enhanced fields, activities, tasks, and assignment rules.

Usage:
    cd backend
    python scripts/seed_leads.py
"""
import asyncio
import sys
import os
import json
import random
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import text

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql+asyncpg://klyron_borhan:klyron123@localhost:5433/klyron_erp")


async def seed():
    engine = create_async_engine(DATABASE_URL)
    Session = async_sessionmaker(engine, expire_on_commit=False)

    async with Session() as db:
        print("Seeding lead management data...")
        print("=" * 60)

        # Get existing users for assignment
        result = await db.execute(text("SELECT id FROM users WHERE company_id = 1 ORDER BY id LIMIT 25"))
        user_ids = [r[0] for r in result.fetchall()]
        if not user_ids:
            print("ERROR: No users found. Run seed_data.py first.")
            return
        print(f"  Found {len(user_ids)} users")

        # Clean lead-related tables
        for table in ["lead_assignment_logs", "lead_assignment_distributions",
                       "lead_tasks", "lead_activities", "lead_assignment_rules", "leads"]:
            try:
                await db.execute(text(f"TRUNCATE TABLE {table} CASCADE"))
            except Exception:
                pass
        await db.commit()
        print("  [OK] Cleaned lead tables")

        # ── Leads ────────────────────────────────────────────────────────
        print("Creating leads...")
        lead_data = [
            dict(name="Abdul Karim", email="abdul.k@email.com", phone="01790123456",
                 source="website", status="new", score=30,
                 title="CTO", company_name="TechSolutions BD", industry="Technology",
                 website="https://techsolutions.com", lead_value=150000,
                 tags=["hot", "decision-maker"], assigned_to=user_ids[11] if len(user_ids) > 11 else user_ids[1]),
            dict(name="Shamima Akter", email="shamima.a@email.com", phone="01790123457",
                 source="referral", status="contacted", score=50,
                 title="Operations Director", company_name="GreenField Agro", industry="Agriculture",
                 website="https://greenfieldagro.com", lead_value=45000,
                 tags=["vip"], assigned_to=user_ids[12] if len(user_ids) > 12 else user_ids[1]),
            dict(name="Hasan Mahmud", email="hasan.m@email.com", phone="01790123458",
                 source="linkedin", status="qualified", score=70,
                 title="CEO", company_name="Digital Horizon Ltd", industry="Technology",
                 website="https://digitalhorizon.com", lead_value=250000,
                 tags=["hot", "decision-maker", "priority"], assigned_to=user_ids[11] if len(user_ids) > 11 else user_ids[1]),
            dict(name="Nargis Jahan", email="nargis.j@email.com", phone="01790123459",
                 source="event", status="new", score=20,
                 title="Office Manager", company_name="Prime Electronics", industry="Retail",
                 lead_value=35000, tags=[], assigned_to=None),
            dict(name="Rafiq Hasan", email="rafiq.h@email.com", phone="01790123460",
                 source="website", status="proposal", score=85,
                 title="VP Engineering", company_name="SoftCare IT", industry="Technology",
                 website="https://softcareit.com", lead_value=85000,
                 tags=["vip", "decision-maker"], assigned_to=user_ids[22] if len(user_ids) > 22 else user_ids[2]),
            dict(name="Laily Begum", email="laily.b@email.com", phone="01790123461",
                 source="referral", status="new", score=15,
                 title="Procurement Manager", company_name="BuildRight Construction", industry="Construction",
                 lead_value=120000, tags=[], assigned_to=user_ids[12] if len(user_ids) > 12 else user_ids[2]),
            dict(name="Shahidul Islam", email="shahidul.i@email.com", phone="01790123462",
                 source="cold_call", status="contacted", score=40,
                 title="IT Manager", company_name="Blue Ocean Shipping", industry="Logistics",
                 website="https://blueocean.com", lead_value=95000,
                 tags=["tech"], assigned_to=user_ids[22] if len(user_ids) > 22 else user_ids[2]),
            dict(name="Parvin Sultana", email="parvin.s@email.com", phone="01790123463",
                 source="website", status="qualified", score=60,
                 title="Marketing Director", company_name="MediCore Hospital", industry="Healthcare",
                 website="https://medicore.com", lead_value=280000,
                 tags=["vip"], assigned_to=user_ids[11] if len(user_ids) > 11 else user_ids[1]),
            dict(name="Jamil Hossain", email="jamil.h@email.com", phone="01790123464",
                 source="email_campaign", status="new", score=25,
                 title="Business Owner", company_name="Prime Electronics", industry="Retail",
                 lead_value=55000, tags=[], assigned_to=None),
            dict(name="Rashida Khatun", email="rashida.k@email.com", phone="01790123465",
                 source="event", status="contacted", score=45,
                 title="Head of Operations", company_name="GlobalTech BD", industry="Technology",
                 website="https://globaltech.com", lead_value=75000,
                 tags=["tech", "vip"], assigned_to=user_ids[22] if len(user_ids) > 22 else user_ids[2]),
            dict(name="Mizanur Rahman", email="mizan.r@email.com", phone="01790123466",
                 source="referral", status="qualified", score=65,
                 title="Finance Director", company_name="City Group", industry="Manufacturing",
                 lead_value=180000, tags=["decision-maker"],
                 assigned_to=user_ids[11] if len(user_ids) > 11 else user_ids[1]),
            dict(name="Farida Yasmin", email="farida.y@email.com", phone="01790123467",
                 source="website", status="new", score=10,
                 title="Administrator", company_name="Small Steps School", industry="Education",
                 lead_value=15000, tags=[], assigned_to=None),
        ]

        lead_ids = []
        for ld in lead_data:
            r = await db.execute(
                text("""INSERT INTO leads (company_id, name, email, phone, source, status, score, assigned_to,
                     title, company_name, industry, website, lead_value, tags, created_by)
                     VALUES (1, :n, :e, :p, :s, :st, :sc, :uid,
                     :t, :cn, :ind, :web, :lv, :tags, :cb) RETURNING id"""),
                dict(
                    n=ld["name"], e=ld["email"], p=ld["phone"],
                    s=ld["source"], st=ld["status"], sc=ld["score"],
                    uid=ld.get("assigned_to"),
                    t=ld.get("title", ""), cn=ld.get("company_name", ""),
                    ind=ld.get("industry", ""), web=ld.get("website", ""),
                    lv=ld.get("lead_value", 0),
                    tags=json.dumps(ld.get("tags", [])),
                    cb=user_ids[0],
                ),
            )
            lead_ids.append(r.scalar_one())
        await db.commit()
        print(f"  [OK] {len(lead_data)} leads created with enhanced fields")

        # ── Lead Activities ────────────────────────────────────────────
        print("Creating lead activities...")
        activity_templates = [
            ("system", "Lead created from {source}"),
            ("status_change", None),
            ("note", "Initial contact made - prospect showed interest"),
            ("assignment", "Lead assigned to sales team member"),
            ("call", "Discovery call completed - discussed requirements"),
            ("email", "Sent product brochure and pricing information"),
            ("note", "Follow-up scheduled for next week"),
            ("call", "Product demo conducted via Zoom"),
            ("status_change", None),
            ("email", "Sent proposal document for review"),
        ]
        activity_count = 0
        for lid in lead_ids[:8]:
            num_activities = random.randint(3, 6)
            selected = random.sample(activity_templates, k=num_activities)
            for atype, desc_template in selected:
                old_val = None
                new_val = None
                desc = desc_template
                if atype == "status_change":
                    old_val = random.choice(["new", "contacted", "qualified"])
                    new_val = random.choice(["contacted", "qualified", "proposal"])
                    desc = f"Status changed from {old_val} to {new_val}"
                elif atype == "system":
                    desc = desc_template.format(source=random.choice(["website", "referral", "linkedin", "event"]))
                elif atype == "assignment":
                    desc = f"Lead assigned to User #{random.choice(user_ids[1:])}"

                await db.execute(
                    text("""INSERT INTO lead_activities (lead_id, company_id, activity_type, description,
                         old_value, new_value, created_by, created_at)
                         VALUES (:lid, 1, :at, :desc, :ov, :nv, :cb, :ca)"""),
                    dict(
                        lid=lid, at=atype, desc=desc,
                        ov=old_val, nv=new_val,
                        cb=random.choice(user_ids[1:]),
                        ca=datetime.now() - timedelta(days=random.randint(1, 30)),
                    ),
                )
                activity_count += 1

        # Sync last_activity_at
        for lid in lead_ids[:8]:
            await db.execute(
                text("UPDATE leads SET last_activity_at = (SELECT MAX(created_at) FROM lead_activities WHERE lead_id = :lid) WHERE id = :lid"),
                dict(lid=lid),
            )
        await db.commit()
        print(f"  [OK] {activity_count} lead activities created")

        # ── Lead Tasks ─────────────────────────────────────────────────
        print("Creating lead tasks...")
        task_templates = [
            ("Call to discuss proposal", "medium"),
            ("Send follow-up email", "low"),
            ("Prepare custom quote", "high"),
            ("Schedule product demo", "high"),
            ("Share case studies", "low"),
            ("Negotiate pricing terms", "urgent"),
            ("Send contract for signature", "urgent"),
            ("Introduce to technical team", "medium"),
            ("Collect additional requirements", "medium"),
        ]
        task_count = 0
        for lid in lead_ids[:10]:
            num_tasks = random.randint(1, 3)
            selected_tasks = random.sample(task_templates, k=num_tasks)
            for title, priority in selected_tasks:
                is_completed = random.random() > 0.6
                status = "completed" if is_completed else "pending"
                completed_at = datetime.now() - timedelta(days=random.randint(1, 5)) if is_completed else None
                await db.execute(
                    text("""INSERT INTO lead_tasks (lead_id, company_id, title, assigned_to,
                         due_date, priority, status, completed_at, created_by)
                         VALUES (:lid, 1, :t, :ato, :dd, :p, :st, :ca, :cb)"""),
                    dict(
                        lid=lid, t=title,
                        ato=random.choice(user_ids[1:]),
                        dd=datetime.now() + timedelta(days=random.randint(1, 14)),
                        p=priority, st=status,
                        ca=completed_at, cb=user_ids[0],
                    ),
                )
                task_count += 1
        await db.commit()
        print(f"  [OK] {task_count} lead tasks created")

        # ── Lead Assignment Rules ──
        # Rules are created by seed_teams.py (with team-based routing and criteria)
        print("  [SKIP] Assignment rules skipped — use scripts/seed_teams.py for team-based rules with criteria")

        # ── Summary ────────────────────────────────────────────────────
        print("\n" + "=" * 60)
        print("LEAD SEED COMPLETE!")
        print("=" * 60)
        print(f"  Leads:      {len(lead_data)}")
        print(f"  Activities: {activity_count}")
        print(f"  Tasks:      {task_count}")
        print()

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
