import pytest
from unittest.mock import MagicMock, patch
from app.modules.voice.service import VoiceService

@pytest.mark.asyncio
async def test_parse_text_to_gift():
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(message=MagicMock(content='{"grandchild_name": "Arjun", "corpus": 5000, "currency": "USD", "risk_profile": "Balanced", "release_condition": "Graduation"}'))
    ]
    mock_client.chat.completions.create.return_value = mock_response
    
    with patch("app.modules.voice.service.get_openai_client", return_value=mock_client):
        result = await VoiceService.parse_text_to_gift("Test command")
        
        assert result.grandchild_name == "Arjun"
        assert result.corpus == 5000
        assert result.currency == "USD"
        assert result.risk_profile == "Balanced"
        assert result.release_condition == "Graduation"
        assert result.confidence == 0.95

@pytest.mark.asyncio
async def test_transcribe_audio():
    mock_client = MagicMock()
    mock_whisper_response = MagicMock()
    mock_whisper_response.text = "Transcribed text from whisper"
    mock_client.audio.transcriptions.create.return_value = mock_whisper_response
    
    # We mock open() as well to handle the 'rb' call
    with patch("builtins.open", MagicMock()), \
         patch("app.modules.voice.service.get_openai_client", return_value=mock_client):
        
        result = await VoiceService.transcribe_audio("fake_path.wav")
        assert result == "Transcribed text from whisper"
