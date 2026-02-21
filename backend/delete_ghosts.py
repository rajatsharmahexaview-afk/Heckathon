import asyncio
from app.database import AsyncSessionLocal
from app.shared.gifts.models import Gift
from sqlalchemy import delete
import uuid

async def main():
    async with AsyncSessionLocal() as session:
        # Delete all gifts where grandchild_id is NOT the original Arjun UUID
        await session.execute(
            delete(Gift).where(Gift.grandchild_id != uuid.UUID("22222222-2222-2222-2222-222222222222"))
        )
        await session.commit()
    print("Deleted ghost gifts successfully.")

if __name__ == "__main__":
    asyncio.run(main())
