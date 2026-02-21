from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.shared.gifts.service import GiftService
from app.shared.gifts.schemas import GiftCreate, GiftSchema, GiftStatus
from typing import List

router = APIRouter(prefix="/gifts", tags=["Gifts"])

@router.post("/", response_model=GiftSchema, status_code=201)
async def create_gift(gift: GiftCreate, grandparent_id: str, db: AsyncSession = Depends(get_db)):
    """
    Endpoint to create a new gift from the wizard.
    """
    try:
        return await GiftService.create_gift(db, grandparent_id, gift)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/grandparent/{user_id}", response_model=List[GiftSchema])
async def get_grandparent_dashboard(user_id: str, db: AsyncSession = Depends(get_db)):
    return await GiftService.get_gifts_by_user(db, user_id, is_grandparent=True)

@router.get("/grandchild/{user_id}", response_model=List[GiftSchema])
async def get_grandchild_dashboard(user_id: str, db: AsyncSession = Depends(get_db)):
    return await GiftService.get_gifts_by_user(db, user_id, is_grandparent=False)

@router.patch("/{gift_id}/status", response_model=GiftSchema)
async def update_gift_status(gift_id: str, next_status: GiftStatus, db: AsyncSession = Depends(get_db)):
    try:
        return await GiftService.update_status(db, gift_id, next_status)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{gift_id}", status_code=204)
async def delete_gift(gift_id: str, db: AsyncSession = Depends(get_db)):
    try:
        await GiftService.delete_gift(db, gift_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
