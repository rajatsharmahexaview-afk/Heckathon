# Quickstart: GiftForge Development

## Backend Setup (Python/FastAPI)

1. **Prerequisites**: Python 3.11+, PostgreSQL instance (Aiven).
2. **Environment**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```
3. **Configuration**: Create `.env` in `backend/`:
   ```env
   DATABASE_URL=postgresql+asyncpg://user:pass@host:port/dbname?ssl=require
   OPENAI_API_KEY=your_key_here
   ```
4. **Database Migrations**:
   ```bash
   alembic upgrade head
   ```
5. **Run**:
   ```bash
   make run
   ```

## Frontend Setup (TypeScript/React)

1. **Prerequisites**: Node.js 18+.
2. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## Testing

- **Backend**: `pytest`
- **Frontend**: `npm test`
- **Linting**: `make lint` (Backend) or `npm run lint` (Frontend)

## Demo Scenarios

1. **Grandparent Persona**: Login as grandparent, use "Voice Gift" button, speak "Gift for Arjun $1000", confirm and see dashboard update.
2. **Grandchild Persona**: Login as grandchild, upload "graduation_photo.jpg" for milestone submission, check notification panel for auto-approval.
3. **Trustee Persona**: Check notification feed for activity logs and auto-approval events.
