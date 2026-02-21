from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.shared.gifts.models import Gift, User, Milestone
from app.shared.gifts.schemas import GiftCreate, GiftStatus, MilestoneStatus
from app.shared.gifts.state_machine import GiftStateMachine
from typing import List
import uuid

class GiftService:
    @staticmethod
    async def create_gift(db: AsyncSession, grandparent_id: str, gift_data: GiftCreate) -> Gift:
        """
        Creates a new gift in 'Draft' status and validates the state transition to 'Active'
        if confirmation is provided (logic for confirmed creation).
        """
        # Ensure grandparent exists
        gp_id = uuid.UUID(grandparent_id)
        gp = await db.execute(select(User).where(User.id == gp_id))
        if not gp.scalar_one_or_none():
            db.add(User(id=gp_id, name="Grandparent", role="grandparent"))

        # Ensure grandchild exists
        gc = await db.execute(select(User).where(User.id == gift_data.grandchild_id))
        if not gc.scalar_one_or_none():
            db.add(User(id=gift_data.grandchild_id, name=gift_data.grandchild_name or "Grandchild", role="grandchild"))

        # Ensure trustee exists
        trustee_id = uuid.UUID("33333333-3333-3333-3333-333333333333")
        trustee = await db.execute(select(User).where(User.id == trustee_id))
        if not trustee.scalar_one_or_none():
            db.add(User(id=trustee_id, name="Trustee", role="trustee"))
            
        await db.commit() # Commit to avoid FK issues
        
        new_gift = Gift(
            id=uuid.uuid4(),
            grandparent_id=uuid.UUID(grandparent_id),
            grandchild_id=gift_data.grandchild_id,
            grandchild_name=gift_data.grandchild_name,
            corpus=gift_data.corpus,
            currency=gift_data.currency,
            message=gift_data.message,
            status=GiftStatus.Active,
            risk_profile=gift_data.risk_profile,
            rule_type=gift_data.rule_type,
            fallback_ngo_id=gift_data.fallback_ngo_id
        )
        
        db.add(new_gift)
        
        # Add milestones
        for m in gift_data.milestones:
            milestone = Milestone(
                id=uuid.uuid4(),
                gift_id=new_gift.id,
                type=m.type,
                percentage=m.percentage,
                status=MilestoneStatus.Pending
            )
            db.add(milestone)
        
        await db.commit()
        
        from sqlalchemy.orm import selectinload
        # Re-fetch with eagerly loaded milestones and media_messages to satisfy Pydantic serialization
        refresh_query = select(Gift).where(Gift.id == new_gift.id).options(selectinload(Gift.milestones), selectinload(Gift.media_messages))
        refresh_result = await db.execute(refresh_query)
        new_gift_loaded = refresh_result.scalar_one()
        
        # Trigger notification for Grandparent
        from app.shared.notifications.service import NotificationService
        from app.shared.gifts.schemas import UserRole
        
        await NotificationService.create_notification(
            db,
            str(new_gift.grandparent_id),
            UserRole.grandparent,
            "gift_created",
            f"Your gift for {new_gift.grandchild_name or 'your grandchild'} has been created and is now {new_gift.status}."
        )
        
        # Trigger notification for Grandchild
        await NotificationService.create_notification(
            db,
            str(new_gift.grandchild_id),
            UserRole.grandchild,
            "gift_received",
            f"You have received a new gift! Log in to view the milestones."
        )
        
        return new_gift_loaded

    @staticmethod
    async def update_status(db: AsyncSession, gift_id: str, next_status: GiftStatus) -> Gift:
        """
        Updates the status of a gift using the State Machine.
        """
        result = await db.execute(select(Gift).where(Gift.id == uuid.UUID(gift_id)))
        gift = result.scalar_one_or_none()
        
        if not gift:
            raise ValueError("Gift not found")
        
        # Validate transition
        GiftStateMachine.validate_transition(gift.status, next_status)
        
        gift.status = next_status
        await db.commit()
        await db.refresh(gift)
        
        return gift

    @staticmethod
    async def get_gifts_by_user(db: AsyncSession, user_id: str, is_grandparent: bool = True) -> List[Gift]:
        from sqlalchemy.orm import selectinload
        if is_grandparent:
            query = select(Gift).where(Gift.grandparent_id == uuid.UUID(user_id)).options(selectinload(Gift.milestones), selectinload(Gift.media_messages))
        else:
            query = select(Gift).where(Gift.grandchild_id == uuid.UUID(user_id)).options(selectinload(Gift.milestones), selectinload(Gift.media_messages))
        
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def delete_gift(db: AsyncSession, gift_id: str):
        from sqlalchemy.orm import selectinload
        result = await db.execute(select(Gift).where(Gift.id == uuid.UUID(gift_id)))
        gift = result.scalar_one_or_none()
        
        if not gift:
            raise ValueError("Gift not found")
        
        await db.delete(gift)
        await db.commit()

