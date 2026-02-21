from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.shared.notifications.service import NotificationService
from app.shared.gifts.schemas import NotificationSchema
from typing import List

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/{user_id}", response_model=List[NotificationSchema])
async def get_notifications(user_id: str, db: AsyncSession = Depends(get_db)):
    return await NotificationService.get_unread_for_user(db, user_id)

@router.patch("/{notification_id}/read", response_model=NotificationSchema)
async def mark_read(notification_id: str, db: AsyncSession = Depends(get_db)):
    notification = await NotificationService.mark_as_read(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification
