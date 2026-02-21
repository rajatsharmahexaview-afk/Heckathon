# Research: GiftForge Core Implementation Patterns

## Decision: OpenAI NLP for Voice Gift Creation
- **Rationale**: Utilizing OpenAI's `gpt-4o` or `gpt-3.5-turbo` to parse transcribed text into structured JSON models (Grandchild, Release Condition, Risk Profile).
- **Implementation**: FastAPI `/voice/parse-gift` endpoint will take a text transcription (or audio blob via Whisper), use a system prompt with JSON-schema enforcement to extract gift parameters.
- **Alternatives considered**: Rule-based regex parsing (too brittle), Dialogflow (too much overhead for hackathon).

## Decision: Aiven Postgres with SSL Requirements
- **Rationale**: Aiven requires `ssl=require` in the connection string.
- **Implementation**: Using `asyncpg` with `create_async_engine`. The `.env` variable `DATABASE_URL` must include `?ssl=require`.
- **Alternatives considered**: Disabling SSL (Rejected by Constitution).

## Decision: Notification Sync via Polling
- **Rationale**: For a hackathon demo, Short-Polling via TanStack Query (`staleTime: 5000`) is more stable and faster to implement than WebSockets.
- **Implementation**: `useApp` context or a dedicated `useNotifications` hook will poll `GET /notifications/{user_id}`.
- **Alternatives considered**: WebSockets (rejected due to deployment complexity), Server-Sent Events (SSE).

## Decision: Multimedia Storage Handler
- **Rationale**: Local static storage for the prototype.
- **Implementation**: FastAPI `UploadFile` handled via `shutil` to a persistent `media/` folder. DB stores the relative path.
- **Alternatives considered**: S3/Cloudinary (rejected for prototype simplicity).

## Decision: Gift State Machine Implementation
- **Rationale**: Centralized logic in `shared/gifts/state_machine.py` prevents status drift.
- **Implementation**: A dictionary-based transition validator called before any `repository.update_status()` call.
- **Alternatives considered**: Distributed state logic across service files (rejected by Constitution principle V).
