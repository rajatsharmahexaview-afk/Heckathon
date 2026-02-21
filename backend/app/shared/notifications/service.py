from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.shared.gifts.models import Notification
from app.shared.gifts.schemas import UserRole
import uuid
from typing import List

class NotificationService:
    @staticmethod
    async def create_notification(
        db: AsyncSession, 
        recipient_id: str, 
        role: UserRole, 
        event_type: str, 
        message: str,
        action_url: str = None
    ) -> Notification:
        notification = Notification(
            id=uuid.uuid4(),
            recipient_id=uuid.UUID(recipient_id),
            role=role,
            event_type=event_type,
            message=message,
            action_url=action_url,
            is_read=False
        )
        db.add(notification)
        await db.commit()
        await db.refresh(notification)
        return notification

    @staticmethod
    async def get_unread_for_user(db: AsyncSession, user_id: str) -> List[Notification]:
        result = await db.execute(
            select(Notification)
            .where(Notification.recipient_id == uuid.UUID(user_id))
            .where(Notification.is_read == False)
            .order_by(Notification.created_at.desc())
        )
        return result.scalars().all()

    @staticmethod
    async def mark_as_read(db: AsyncSession, notification_id: str) -> Notification:
        result = await db.execute(
            select(Notification).where(Notification.id == uuid.UUID(notification_id))
        )
        notification = result.scalar_one_or_none()
        if notification:
            notification.is_read = True
            await db.commit()
            await db.refresh(notification)
        return notification
