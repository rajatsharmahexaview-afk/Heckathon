import os
import shutil
import uuid
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.shared.gifts.models import MediaMessage
from typing import List

UPLOAD_DIR = "static/media"

class MediaService:
    @staticmethod
    async def upload_file(db: AsyncSession, gift_id: str, uploader_id: str, file: UploadFile, type: str) -> MediaMessage:
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR, exist_ok=True)
            
        file_ext = os.path.splitext(file.filename)[1]
        file_name = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, file_name)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        media = MediaMessage(
            id=uuid.uuid4(),
            gift_id=uuid.UUID(gift_id),
            uploader_id=uuid.UUID(uploader_id),
            type=type,
            file_path=file_path
        )
        
        db.add(media)
        await db.commit()
        await db.refresh(media)
        return media

    @staticmethod
    async def get_media_for_gift(db: AsyncSession, gift_id: str) -> List[MediaMessage]:
        result = await db.execute(select(MediaMessage).where(MediaMessage.gift_id == uuid.UUID(gift_id)))
        return result.scalars().all()
