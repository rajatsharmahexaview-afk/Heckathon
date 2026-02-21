import asyncio
from app.database import AsyncSessionLocal
from app.shared.gifts.models import Gift
from sqlalchemy import select

async def main():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Gift))
        gifts = result.scalars().all()
        for g in gifts:
            print(f"ID: {g.id}, GC_ID: {g.grandchild_id}, GC_Name: {g.grandchild_name}, Status: {g.status}")

if __name__ == "__main__":
    asyncio.run(main())
