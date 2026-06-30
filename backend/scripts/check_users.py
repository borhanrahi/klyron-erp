"""Check user/employee counts in database."""
import sys, os, asyncio
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.database import engine
from sqlalchemy import text

async def main():
    async with engine.connect() as conn:
        for table in ["users", "employees", "leads", "companies"]:
            r = await conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
            print(f"  {table}: {r.scalar()}")
    await engine.dispose()

asyncio.run(main())
