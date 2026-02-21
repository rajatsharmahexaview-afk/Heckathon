from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.shared.gifts.models import User
from app.shared.gifts.schemas import UserRole
import uuid
from typing import List

class UserService:
    @staticmethod
    async def get_all_users(db: AsyncSession) -> List[User]:
        result = await db.execute(select(User))
        users = result.scalars().all()
        
        # Seed demo users if empty
        if not users:
            demo_users = [
                User(id=uuid.UUID("11111111-1111-1111-1111-111111111111"), name="Grandma Shanti", role="grandparent"),
                User(id=uuid.UUID("22222222-2222-2222-2222-222222222222"), name="Arjun", role="grandchild"),
                User(id=uuid.UUID("33333333-3333-3333-3333-333333333333"), name="Trustee Sahil", role="trustee"),
            ]
            for u in demo_users:
                db.add(u)
            await db.commit()
            result = await db.execute(select(User))
            users = result.scalars().all()
            
        return users

    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: str) -> User:
        result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
        return result.scalar_one_or_none()
