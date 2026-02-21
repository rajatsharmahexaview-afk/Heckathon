from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.modules.media.service import MediaService
from typing import List

router = APIRouter(prefix="/media", tags=["Media"])

@router.post("/upload")
async def upload_media(
    gift_id: str = Form(...),
    uploader_id: str = Form(...),
    type: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    return await MediaService.upload_file(db, gift_id, uploader_id, file, type)

@router.get("/{gift_id}")
async def get_gift_media(gift_id: str, db: AsyncSession = Depends(get_db)):
    return await MediaService.get_media_for_gift(db, gift_id)
