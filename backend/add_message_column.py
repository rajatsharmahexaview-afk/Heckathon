import asyncio
from app.database import AsyncSessionLocal
from sqlalchemy import text

async def main():
    async with AsyncSessionLocal() as session:
        try:
            await session.execute(text("ALTER TABLE gifts ADD COLUMN message TEXT;"))
            await session.commit()
            print("Successfully added message column to gifts table.")
        except Exception as e:
            print(f"Error (column might already exist): {e}")

if __name__ == "__main__":
    asyncio.run(main())
