import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app
from unittest.mock import patch, MagicMock

@pytest.mark.asyncio
async def test_parse_gift_endpoint():
    # Use ASGITransport for modern httpx versions
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        mock_response = MagicMock()
        mock_response.grandchild_name = "Arjun"
        mock_response.corpus = 5000
        mock_response.currency = "USD"
        mock_response.risk_profile = "Balanced"
        mock_response.release_condition = "Graduation"
        mock_response.confidence = 0.95
        
        with patch("app.modules.voice.router.VoiceService.parse_text_to_gift", return_value=mock_response):
            response = await ac.post("/voice/parse-gift?text=test%20command")
            
            assert response.status_code == 200
            data = response.json()
            assert data["grandchild_name"] == "Arjun"
            assert float(data["corpus"]) == 5000
            assert data["confidence"] == 0.95
