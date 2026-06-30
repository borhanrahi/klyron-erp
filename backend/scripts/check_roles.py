"""Check DB connectivity, roles, and permissions."""
import sys, asyncio, json
sys.path.insert(0, '.')
from app.database import engine
from sqlalchemy import text

async def check():
    async with engine.connect() as conn:
        r = await conn.execute(text("SELECT role_name, permissions_json FROM roles"))
        rows = r.fetchall()
        for row in rows:
            print(f"Role: {row.role_name}")
            perms = row.permissions_json
            if perms:
                p = json.loads(perms) if isinstance(perms, str) else perms
                for mod in p:
                    print(f"  Module: {mod}")
            else:
                print("  No permissions")
            print()

        # Check user count
        r = await conn.execute(text("SELECT COUNT(*) FROM users"))
        print(f"\nUsers: {r.scalar()}")

if __name__ == "__main__":
    asyncio.run(check())
