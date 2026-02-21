from fastapi import APIRouter, UploadFile, File, HTTPException
from app.modules.voice.service import VoiceService
from app.shared.gifts.schemas import VoiceParseResponse
import shutil
import os
import tempfile

router = APIRouter(prefix="/voice", tags=["Voice"])

@router.post("/parse-gift", response_model=VoiceParseResponse)
async def parse_voice_gift(text: str = None, audio: UploadFile = File(None)):
    """
    Parses either direct text or an audio file into a structured gift model.
    """
    if text:
        return await VoiceService.parse_text_to_gift(text)
    
    if audio:
        # Save audio to temp file for Whisper
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(audio.filename)[1]) as tmp:
            shutil.copyfileobj(audio.file, tmp)
            tmp_path = tmp.name
        
        try:
            transcribed_text = await VoiceService.transcribe_audio(tmp_path)
            if not transcribed_text:
                raise HTTPException(status_code=400, detail="Failed to transcribe audio")
            return await VoiceService.parse_text_to_gift(transcribed_text)
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    raise HTTPException(status_code=400, detail="Either 'text' or 'audio' must be provided")
