from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from app.modules.voice.router import router as voice_router
from app.shared.gifts.router import router as gifts_router
from app.modules.media.router import router as media_router
from app.modules.trustee.router import router as trustee_router
from app.shared.simulation.router import router as simulation_router
from app.shared.notifications.router import router as notifications_router
from app.modules.users.router import router as users_router

app = FastAPI(
    title="GiftForge API",
    description="Full-stack Legacy Gifting Platform",
    version="2.0.0",
    openapi_tags=[
        {"name": "Gifts", "description": "Gift management and lifecycle"},
        {"name": "Grandparent", "description": "Grandparent specific actions"},
        {"name": "Grandchild", "description": "Grandchild specific actions"},
        {"name": "Trustee", "description": "Trustee governance actions"},
        {"name": "Voice", "description": "Voice command parsing"},
        {"name": "Notifications", "description": "In-app and push notifications"},
        {"name": "Media", "description": "Multimedia messaging and proofs"},
    ]
)

app.include_router(voice_router)
app.include_router(gifts_router)
app.include_router(media_router)
app.include_router(trustee_router)
app.include_router(simulation_router)
app.include_router(notifications_router)
app.include_router(users_router)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to GiftForge API", "version": "2.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
