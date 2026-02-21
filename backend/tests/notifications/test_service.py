import pytest
from unittest.mock import AsyncMock, MagicMock
from app.shared.notifications.service import NotificationService
from app.shared.gifts.schemas import UserRole
import uuid

@pytest.mark.asyncio
async def test_notification_persistence():
    mock_db = AsyncMock()
    recipient_id = str(uuid.uuid4())
    
    # Mock create
    result = await NotificationService.create_notification(
        mock_db,
        recipient_id,
        UserRole.grandchild,
        "test_event",
        "Test message"
    )
    
    assert str(result.recipient_id) == recipient_id
    assert result.event_type == "test_event"
    assert mock_db.commit.called

@pytest.mark.asyncio
async def test_mark_as_read():
    mock_db = AsyncMock()
    notif_id = str(uuid.uuid4())
    
    mock_notif = MagicMock()
    mock_notif.id = uuid.UUID(notif_id)
    mock_notif.is_read = False
    
    mock_db.execute.return_value = MagicMock(scalar_one_or_none=lambda: mock_notif)
    
    result = await NotificationService.mark_as_read(mock_db, notif_id)
    
    assert result.is_read == True
    assert mock_db.commit.called
