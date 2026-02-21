from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.shared.gifts.models import Milestone, Gift
from app.shared.gifts.schemas import MilestoneStatus, GiftStatus
from app.shared.gifts.state_machine import GiftStateMachine
import uuid

class TrusteeService:
    @staticmethod
    async def process_milestone_submission(db: AsyncSession, milestone_id: str) -> Milestone:
        """
        Handles milestone submission and auto-approves in demo mode.
        """
        result = await db.execute(select(Milestone).where(Milestone.id == uuid.UUID(milestone_id)))
        milestone = result.scalar_one_or_none()
        
        if not milestone:
            raise ValueError("Milestone not found")
            
        # In real app, status would become 'Submitted' first.
        # In Demo Mode, we auto-approve.
        milestone.status = MilestoneStatus.Approved
        
        # Check if all milestones are approved to complete the gift
        gift_result = await db.execute(select(Gift).where(Gift.id == milestone.gift_id))
        gift = gift_result.scalar_one()
        
        all_milestones_result = await db.execute(select(Milestone).where(Milestone.gift_id == gift.id))
        all_milestones = all_milestones_result.scalars().all()
        
        if all(m.status == MilestoneStatus.Approved for m in all_milestones):
            GiftStateMachine.validate_transition(gift.status, GiftStatus.Completed)
            gift.status = GiftStatus.Completed
            
        await db.commit()
        await db.refresh(milestone)

        # Trigger notifications
        from app.shared.notifications.service import NotificationService
        from app.shared.gifts.schemas import UserRole
        
        # Notify grandchild
        await NotificationService.create_notification(
            db,
            str(gift.grandchild_id),
            UserRole.grandchild,
            "milestone_approved",
            f"Congratulations! Your milestone '{milestone.type}' has been approved and funds disbursed."
        )

        # Notify grandparent
        await NotificationService.create_notification(
            db,
            str(gift.grandparent_id),
            UserRole.grandparent,
            "milestone_approved",
            f"Your grandchild has successfully reached the '{milestone.type}' milestone."
        )

        return milestone
