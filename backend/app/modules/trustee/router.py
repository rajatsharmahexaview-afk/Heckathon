from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.modules.trustee.service import TrusteeService

router = APIRouter(prefix="/trustee", tags=["Trustee"])

@router.post("/approve-milestone/{milestone_id}")
async def approve_milestone(milestone_id: str, db: AsyncSession = Depends(get_db)):
    return await TrusteeService.process_milestone_submission(db, milestone_id)
