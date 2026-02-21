import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.modules.trustee.service import TrusteeService
from app.shared.gifts.schemas import MilestoneStatus, GiftStatus
import uuid

@pytest.mark.asyncio
@patch("app.shared.notifications.service.NotificationService.create_notification", new_callable=AsyncMock)
async def test_auto_approval_logic(mock_notify):
    mock_db = AsyncMock()
    milestone_id = str(uuid.uuid4())
    gift_id = str(uuid.uuid4())
    grandchild_id = uuid.uuid4()
    grandparent_id = uuid.uuid4()
    
    mock_milestone = MagicMock()
    mock_milestone.id = uuid.UUID(milestone_id)
    mock_milestone.gift_id = uuid.UUID(gift_id)
    mock_milestone.status = MilestoneStatus.Pending
    mock_milestone.type = "Graduation"
    
    mock_gift = MagicMock()
    mock_gift.id = uuid.UUID(gift_id)
    mock_gift.status = GiftStatus.Active
    mock_gift.grandchild_id = grandchild_id
    mock_gift.grandparent_id = grandparent_id
    
    # Mock database results
    mock_db.execute.side_effect = [
        MagicMock(scalar_one_or_none=lambda: mock_milestone), # Milestone
        MagicMock(scalar_one=lambda: mock_gift),             # Gift
        MagicMock(scalars=lambda: MagicMock(all=lambda: [mock_milestone])) # All milestones
    ]
    
    result = await TrusteeService.process_milestone_submission(mock_db, milestone_id)
    
    assert result.status == MilestoneStatus.Approved
    assert mock_gift.status == GiftStatus.Completed
    assert mock_db.commit.called
    assert mock_notify.call_count == 2
