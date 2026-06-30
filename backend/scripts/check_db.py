"""Check database state."""
import sys, asyncio
sys.path.insert(0, '.')
from app.database import engine
from sqlalchemy import text

async def check():
    async with engine.connect() as conn:
        # Check roles table columns
        r = await conn.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'roles'
            ORDER BY ordinal_position
        """))
        print("=== Roles columns ===")
        for row in r:
            print(f"  {row.column_name}: {row.data_type}")

        # Check roles count
        r = await conn.execute(text("SELECT COUNT(*) FROM roles"))
        print(f"\nRoles count: {r.scalar()}")

        # Check if role_name exists, or whatever the name column is
        r = await conn.execute(text("SELECT * FROM roles LIMIT 10"))
        print("\n=== Roles data ===")
        roles = r.fetchall()
        for row in roles:
            print(f"  {row._mapping}")

        # Check users
        r = await conn.execute(text("""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        """))
        print("\n=== Users columns ===")
        for row in r:
            print(f"  {row.column_name}")

        # Count users
        r = await conn.execute(text("SELECT COUNT(*) FROM users"))
        print(f"\nUsers count: {r.scalar()}")

if __name__ == "__main__":
    asyncio.run(check())
