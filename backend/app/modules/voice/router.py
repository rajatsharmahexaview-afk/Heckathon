# backend/app/modules/voice/router.py
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.modules.voice.service import VoiceService
import shutil
import os
import tempfile

router = APIRouter(prefix="/voice", tags=["Voice"])


@router.post("/chat")
async def voice_chat(
    session_id: str = Form(...),
    text: str = Form(None),
    audio: UploadFile = File(None)
):
    """
    Multi-turn voice gift creation. 
    Send session_id + (text OR audio) each turn.
    Bot collects missing fields progressively.
    """
    user_text = None

    # Option 1: Direct text input
    if text:
        user_text = text

    # Option 2: Audio input → transcribe first
    elif audio:
        suffix = os.path.splitext(audio.filename)[1] or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(audio.file, tmp)
            tmp_path = tmp.name
        try:
            user_text = await VoiceService.transcribe_audio(tmp_path)
            if not user_text:
                raise HTTPException(
                    status_code=400,
                    detail="Could not transcribe audio. Please try again."
                )
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    else:
        raise HTTPException(
            status_code=400,
            detail="Provide either 'text' or 'audio'"
        )

    return await VoiceService.chat_with_session(session_id, user_text)


@router.delete("/chat/{session_id}")
async def clear_chat_session(session_id: str):
    """Clears conversation history for a session."""
    await VoiceService.clear_session(session_id)
    return {"message": f"Session {session_id} cleared"}

 