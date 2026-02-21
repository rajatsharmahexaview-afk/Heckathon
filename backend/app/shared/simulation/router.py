from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.shared.gifts.models import Gift
from app.shared.simulation.service import SimulationService
from sqlalchemy.future import select
import uuid

router = APIRouter(prefix="/simulation", tags=["Simulation"])

@router.get("/growth/{gift_id}")
async def get_growth_projection(gift_id: str, db: AsyncSession = Depends(get_db)):
    """
    Returns wealth projection for a specific gift based on its risk profile and corpus.
    """
    result = await db.execute(select(Gift).where(Gift.id == uuid.UUID(gift_id)))
    gift = result.scalar_one_or_none()
    
    if not gift:
        raise HTTPException(status_code=404, detail="Gift not found")
        
    return await SimulationService.get_growth_projection(
        gift.corpus, 
        gift.risk_profile,
        years=15 # Standard 15 year projection
    )
