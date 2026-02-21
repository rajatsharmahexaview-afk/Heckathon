# GiftForge – Updated Application Requirements & Technical Spec
**Version:** 2.0 | **Type:** Hackathon Prototype | **Prepared By:** Technical Product Management

---

## PART 1 — APPLICATION REQUIREMENTS DOCUMENT

---

### 1. Product Overview

#### 1.1 Product Name
**GiftForge** – Rule-Based Legacy Gifting Platform

#### 1.2 Product Summary
GiftForge is a web-based application that enables grandparents to set up future financial gifts for their grandchildren using rule-based logic (time-based, milestone-based, or behavior-based), with trustee governance (auto-approval mode for demo), NGO fallback logic, emergency withdrawal provisions, voice-assisted setup, multimedia messaging, in-app notifications, and a dynamic portfolio dashboard.

This is a hackathon prototype. Financial integrations are simulated. Governance logic must be functionally consistent even if backed by mock data.

---

### 2. Core User Roles

| Role | Description |
|---|---|
| Grandparent | Primary user. Creates gifts, assigns trustees, approves overrides, adds media. |
| Grandchild | Beneficiary. Views gift progress, submits milestone/behavior proofs, requests withdrawals. |
| Trustee | Oversight authority selected per grandchild. **Auto-approval mode active for hackathon demo** — milestone approvals are automatically approved without manual trustee action. Trustee dashboard remains visible for demo context. |

**Authentication:** Demo accounts only. Role switching permitted for demo.

---

### 3. System Modules

| # | Module | Status |
|---|---|---|
| 1 | User Role Engine | ✅ Core |
| 2 | Gift Rule Engine | ✅ Core |
| 3 | Trustee Governance Engine | ✅ Core (Auto-approval mode for demo) |
| 4 | Emergency Withdrawal Engine | ✅ Core |
| 5 | NGO Redirection Engine | ✅ Core |
| 6 | Investment Simulation Engine | ✅ Core |
| 7 | Currency Engine (INR & USD) | ✅ Core |
| 8 | Voice Command Module | ✅ Core (Expanded scope) |
| 9 | Multimedia Messaging Module | ✅ Core |
| 10 | Grandparent Portfolio Dashboard | ✅ Core |
| 11 | Educational Content Module | ✅ Core |
| 12 | Notification Module | 🆕 Added |
| 13 | UI/UX Accessibility Layer | ✅ Core |

---

### 4. Functional Requirements

#### 4.1 Grandparent Dashboard

##### 4.1.1 Portfolio Overview
Display:
- Total simulated corpus
- Allocated to gifts
- Available balance
- Risk allocation breakdown
- Dynamic growth simulation chart
- Currency toggle (INR / USD) — mock FX rate hardcoded to today's live rate: **1 USD = 83.5 INR** (set in config, consistent across all screens)

##### 4.1.2 Gift Overview List
For each grandchild:
- Name
- Gift type (Time / Milestone / Behavior)
- Investment profile
- Next milestone
- Status: Active | Pending Approval | Under Review | Milestone Missed
- Emergency requests indicator
- Trustee assigned (Yes/No — always auto-approving in demo)

Aggregation view:
- Total exposure across all grandchildren
- Per-grandchild breakdown

---

#### 4.2 Gift Creation Flow (Wizard-Based)

**Step 1 – Select Grandchild**
- Pull from existing grandchild list
- Option to create new grandchild profile (manual, not voice)

**Step 2 – Choose Rule Type**
- Only one type per gift: Time-Based | Milestone-Based | Behavior-Based
- Advanced options hidden under expandable section

---

#### 4.3 Rule Engine

##### 4.3.1 Time-Based Rules
Options:
- At specific age
- After X years
- Specific calendar date
- Installment distribution (e.g., 25% at 18, 25% at 21)

Optional fallback — if milestone not achieved:
- Push to next milestone
- Redirect to pre-selected NGO

##### 4.3.2 Milestone-Based Rules
Selectable milestones:
- Graduation
- First Job
- Marriage
- Home Purchase
- College Admission Fee

Milestone validation:
- Proof upload required

Fallback logic:
- Push to next milestone, OR
- Redirect to NGO

##### 4.3.3 Behavior-Based Rules
Selectable conditions:
- **Maintain GPA above X** — validated via GPA input field + "Simulate Check" button that triggers a mock pass/fail result
- Complete Financial Literacy Course
- Monthly Savings Contribution

Validation model:
- GPA: Grandchild enters GPA value → clicks **"Simulate Verification"** button → system shows Pass/Fail badge
- Other conditions: Trustee auto-approves (demo mode)
- All behavior checks route through auto-approval in demo

---

#### 4.4 Emergency Withdrawal Engine

Applicable for:
- College admission
- Medical emergency

Rules:
- Partial withdrawal allowed (up to full gift balance)
- Proof required

Post-withdrawal:
- Future payouts recalculated proportionally
- Rule remains active

---

#### 4.5 Trustee Governance Engine

> **Hackathon Demo Mode: All trustee actions are AUTO-APPROVED.**
> The trustee dashboard is visible and functional for demo narrative purposes, but no manual action is required for milestones or behavior checks to proceed.

Full trustee capability set (visible in UI, auto-executed):
- View gift details
- Approve milestone *(auto)*
- Reject milestone *(not triggered in demo)*
- Push to next milestone
- Initiate NGO redirection
- Pause rule execution

**Override Window (defined):**
- If trustee rejects (non-demo scenario): Grandparent has a **7-day override window**
- After 7 days with no override → gift amount redirects to pre-selected NGO
- Timer displayed in UI as countdown

If grandparent passes away:
- Trustee becomes final authority *(verbal in pitch, not simulated)*

---

#### 4.6 NGO Redirection

- NGO selected at gift setup (pre-selection)
- Redirection triggered after **7-day override window** elapses with no grandparent action
- Redirection is final unless overridden before window ends

---

#### 4.7 Investment Simulation Engine

Modes:
- Mock brokerage integration
- App-managed mutual fund

Risk profiles:
- Conservative | Balanced | Growth

Features:
- Static historical fund charts (mock dataset)
- CAGR projection
- Simulated portfolio growth

Currency:
- INR & USD supported
- Mock FX rate hardcoded: **1 USD = 83.5 INR** (defined once in config, applied globally)

Grandparent selects risk profile. Grandchild view-only.

---

#### 4.8 Voice Command Module *(Expanded)*

**Scope (expanded from v1.0):**
- Time-based gift creation *(primary flow, demo hero)*
- Milestone confirmation — grandparent can verbally confirm a milestone approval notification
- Voice memo recording — grandparent can record a voice message directly from the multimedia messaging panel as an alternative to typing

**Core Voice Flow (Gift Creation):**
1. Grandparent activates microphone
2. Speaks command
3. System parses into structured format
4. System reads back: *"You want to create a gift for [Name] releasing at age [X] in a [Balanced] fund. Is this correct?"*
5. Grandparent confirms verbally
6. Editable confirmation screen displayed

**Voice Memo Flow (Multimedia):**
1. Grandparent taps microphone icon in message panel
2. Records audio message (30-second max for demo)
3. Audio saved and linked to gift timeline
4. Grandchild plays memo upon gift unlock

Pull grandchild name from existing list only. Positioned as a premium AI capability.

---

#### 4.9 Multimedia Messaging Module

Attachable at:
- Gift setup
- Emergency withdrawal approval

Supported formats:
- Text note
- Photo
- Audio *(now also capturable via Voice Module)*
- Video

Storage: Static, not editable, linked to gift timeline.
Grandchild can view message upon unlock or withdrawal.

---

#### 4.10 Grandchild Dashboard

Display:
- Current value
- Growth chart
- Unlock countdown
- Rule transparency
- Submitted proofs
- Withdrawal requests
- Notifications (new)
- Educational content

Interactive but cannot modify investment profile.

---

#### 4.11 Educational Content Module

Static informational modules:
- What is a mutual fund?
- Risk vs return
- Scam awareness
- Tax basics
- Goal planning

---

#### 4.12 Notification Module *(New)*

**Purpose:** Keep all three roles informed of key state changes without requiring them to check dashboards manually.

**Notification Triggers:**

| Event | Recipient(s) |
|---|---|
| Proof submitted by grandchild | Trustee + Grandparent |
| Milestone auto-approved (demo) | Grandchild + Grandparent |
| Emergency withdrawal requested | Grandparent + Trustee |
| Emergency withdrawal approved | Grandchild |
| NGO redirection initiated | Grandparent |
| Override window opened (7 days) | Grandparent |
| Override window expiring (24hr warning) | Grandparent |
| Gift unlocked / payout triggered | Grandchild |
| New multimedia message available | Grandchild |
| Voice gift created successfully | Grandparent |

**Notification Types:**
- In-app notification bell (badge count)
- Notification feed panel (slide-in drawer)
- Each notification includes: icon, message text, timestamp, and a deep-link action button

**Notification States:**
- Unread (highlighted)
- Read
- Actioned (e.g., override submitted)

**Scope for Demo:**
- In-app only (no email/SMS)
- Notifications are mock-triggered based on user actions within the session
- Persist within session (not across sessions)

---

### 5. Non-Functional Requirements

#### 5.1 UI/UX Accessibility
- Large default font
- High-contrast large buttons
- Rounded corners
- Wizard-based navigation
- Maximum 2 navigation levels
- Advanced options hidden under expandable section
- Warm & reassuring language
- Avoid financial jargon
- Notification bell icon in top navigation bar (always visible)

#### 5.2 Performance
- Page load under 2 seconds (mock data)
- Voice recognition response under 3 seconds
- Notification panel render under 500ms

#### 5.3 Security (Prototype-Level)
- Role-based access control
- Mock authentication
- File upload size limits
- No real financial data

---

### 6. Data Model (High-Level)

**Entities:**

- **User** — id, role, name
- **Grandchild** — id, linked_grandparent_id
- **Gift** — id, grandparent_id, grandchild_id, rule_type, investment_profile, currency, corpus, status
- **Milestone** — id, gift_id, type, percentage, status
- **Proof** — id, milestone_id, file_url, verification_status
- **Trustee** — id, linked_grandchild_id, auto_approval_mode (boolean, true for demo)
- **Transaction** — id, gift_id, type (deposit / withdrawal / redirection), amount
- **MediaMessage** — id, gift_id, type (text / photo / audio / video)
- **Notification** — id, recipient_id, recipient_role, event_type, message, is_read, created_at, action_url
- **OverrideWindow** — id, gift_id, opened_at, expires_at (opened_at + 7 days), status (open / overridden / expired)

---

### 7. Event & State Flow

**Gift States:**
`Draft → Active → Under Review → Approved → Rejected → Redirected to NGO → Completed`

**Event Triggers:**
- Proof submission
- Trustee action (auto in demo)
- Override action
- Emergency request
- Milestone reached
- Override window expiry (7 days)
- Notification read/actioned

---

### 8. Demo Focus Flow

**Primary demo path:**
1. Grandparent activates voice → creates time-based gift → adds emotional multimedia message (voice memo)
2. Grandchild views unlock countdown + receives notification
3. Milestone auto-approved → grandchild and grandparent receive notification
4. Grandparent views portfolio dashboard with INR/USD toggle

**Advanced features accessible but not demo hero:**
- NGO redirection
- Emergency withdrawal
- Behavior-based GPA check flow
- Override window countdown

---

### 9. Out of Scope (Hackathon)

- Real banking APIs
- Real KYC / compliance workflows
- Real verification vendor integration
- Mortality lifecycle automation
- Rule editing after creation
- Top-up flow
- Email / SMS notifications
- Cross-session notification persistence

---
---

## PART 2 — TECHNICAL SPECIFICATION

---

### 1. Backend Folder Structure

```
backend/
├── requirements.txt                  ← All Python dependencies
├── requirements-dev.txt              ← Dev deps (pytest, black, ruff, etc.)
├── .env                              ← Environment variables
├── Makefile                          ← make run, make test, make lint, make export-spec
│
├── app/
│   ├── main.py                       ← FastAPI app entry, mounts all routers, sets tags metadata
│   ├── config.py                     ← Settings via pydantic BaseSettings
│   │                                    Includes: FX_RATE_USD_TO_INR = 83.5
│   ├── database.py                   ← Async DB session (SQLAlchemy + asyncpg → Aiven Postgres)
│   │
│   ├── modules/
│   │   │
│   │   ├── grandparent/              ← 🔒 GRANDPARENT DEV ONLY
│   │   │   ├── __init__.py
│   │   │   ├── router.py             ← APIRouter(prefix="/grandparent", tags=["Grandparent"])
│   │   │   ├── service.py            ← Business logic
│   │   │   ├── repository.py         ← DB queries (no logic)
│   │   │   ├── models.py             ← SQLAlchemy ORM models
│   │   │   ├── schemas.py            ← Pydantic schemas with response_model
│   │   │   └── exceptions.py         ← Module-specific exceptions
│   │   │
│   │   ├── grandchild/               ← 🔒 GRANDCHILD DEV ONLY
│   │   │   ├── __init__.py
│   │   │   ├── router.py             ← APIRouter(prefix="/grandchild", tags=["Grandchild"])
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   └── exceptions.py
│   │   │
│   │   ├── trustee/                  ← 🆕 TRUSTEE MODULE
│   │   │   ├── __init__.py
│   │   │   ├── router.py             ← APIRouter(prefix="/trustee", tags=["Trustee"])
│   │   │   │                            Endpoints: GET gift details, GET notifications,
│   │   │   │                            POST auto-approve milestone (demo mode),
│   │   │   │                            POST initiate NGO redirect, POST pause rule
│   │   │   ├── service.py            ← Auto-approval logic, override window trigger
│   │   │   ├── repository.py
│   │   │   ├── models.py             ← Trustee model: auto_approval_mode flag
│   │   │   ├── schemas.py
│   │   │   └── exceptions.py
│   │   │
│   │   ├── notifications/            ← 🆕 NOTIFICATION MODULE
│   │   │   ├── __init__.py
│   │   │   ├── router.py             ← APIRouter(prefix="/notifications", tags=["Notifications"])
│   │   │   │                            Endpoints: GET /notifications/{user_id},
│   │   │   │                            PATCH /notifications/{id}/read,
│   │   │   │                            POST /notifications/trigger (internal)
│   │   │   ├── service.py            ← Notification creation, mark-read logic
│   │   │   ├── repository.py
│   │   │   ├── models.py             ← Notification: id, recipient_id, role, event_type,
│   │   │   │                            message, is_read, created_at, action_url
│   │   │   ├── schemas.py
│   │   │   └── exceptions.py
│   │   │
│   │   ├── voice/                    ← 🆕 VOICE MODULE
│   │   │   ├── __init__.py
│   │   │   ├── router.py             ← APIRouter(prefix="/voice", tags=["Voice"])
│   │   │   │                            Endpoints:
│   │   │   │                            POST /voice/parse-gift    ← audio → structured gift object
│   │   │   │                            POST /voice/confirm-gift  ← confirmed gift → create gift
│   │   │   │                            POST /voice/memo          ← audio blob → saved MediaMessage
│   │   │   ├── service.py            ← Mock speech parsing, readback string generation
│   │   │   │                            parse_voice_to_gift_schema()
│   │   │   │                            generate_readback_text(gift_schema) → str
│   │   │   │                            save_voice_memo(audio_blob, gift_id) → MediaMessage
│   │   │   ├── repository.py
│   │   │   ├── schemas.py            ← VoiceGiftParseRequest, VoiceGiftConfirmRequest,
│   │   │   │                            VoiceMemoRequest, ParsedGiftResponse
│   │   │   └── exceptions.py
│   │   │
│   │   └── media/                    ← 🆕 MEDIA MODULE
│   │       ├── __init__.py
│   │       ├── router.py             ← APIRouter(prefix="/media", tags=["Media"])
│   │       │                            Endpoints:
│   │       │                            POST /media/upload         ← multipart upload → stored ref
│   │       │                            GET  /media/{gift_id}      ← list all media for gift
│   │       │                            GET  /media/item/{id}      ← retrieve single media item
│   │       ├── service.py            ← File type validation, static storage handler
│   │       │                            Accepted types: text, image/jpeg, image/png,
│   │       │                            audio/*, video/mp4 | Max size: 10MB
│   │       ├── repository.py
│   │       ├── models.py             ← MediaMessage: id, gift_id, uploader_id, type,
│   │       │                            file_path, created_at
│   │       ├── schemas.py
│   │       └── exceptions.py
│   │
│   ├── shared/
│   │   ├── gifts/                    ← 🆕 SHARED GIFTS MODULE (core domain)
│   │   │   ├── __init__.py
│   │   │   ├── router.py             ← APIRouter(prefix="/gifts", tags=["Gifts"])
│   │   │   │                            Endpoints:
│   │   │   │                            POST   /gifts/              ← create gift
│   │   │   │                            GET    /gifts/{id}          ← get gift detail
│   │   │   │                            GET    /gifts/grandchild/{id}
│   │   │   │                            GET    /gifts/grandparent/{id}
│   │   │   │                            PATCH  /gifts/{id}/status
│   │   │   ├── service.py            ← Gift creation, rule resolution, status transitions
│   │   │   │                            All modules import from here — no duplication
│   │   │   ├── repository.py         ← All gift + milestone DB queries
│   │   │   ├── models.py             ← Gift, Milestone, Proof, OverrideWindow models
│   │   │   ├── schemas.py            ← GiftCreate, GiftResponse, MilestoneResponse, etc.
│   │   │   ├── state_machine.py      ← 🆕 Gift state transition validator
│   │   │   │                            VALID_TRANSITIONS dict
│   │   │   │                            transition(gift, event) → new_state | raises InvalidTransition
│   │   │   └── exceptions.py
│   │   │
│   │   ├── simulation/               ← 🆕 SIMULATION MODULE
│   │   │   ├── __init__.py
│   │   │   ├── router.py             ← APIRouter(prefix="/simulation", tags=["Simulation"])
│   │   │   │                            Endpoints:
│   │   │   │                            GET /simulation/growth/{gift_id}   ← CAGR projection data
│   │   │   │                            GET /simulation/chart/{gift_id}    ← mock historical chart
│   │   │   │                            GET /simulation/profiles           ← risk profile list
│   │   │   ├── service.py            ← Mock CAGR calculator, chart data generator
│   │   │   │                            CAGR rates: Conservative=6%, Balanced=10%, Growth=14%
│   │   │   │                            apply_fx(amount, from_currency, to_currency) utility
│   │   │   │                            FX_RATE pulled from config (83.5 hardcoded)
│   │   │   ├── schemas.py            ← GrowthProjectionResponse, ChartDataResponse
│   │   │   └── exceptions.py
│   │   │
│   │   ├── events/                   ← 🆕 EVENT BUS (state change coordination)
│   │   │   ├── __init__.py
│   │   │   ├── dispatcher.py         ← dispatch(event_type, payload) → triggers handlers
│   │   │   ├── handlers.py           ← on_proof_submitted(), on_milestone_approved(),
│   │   │   │                            on_emergency_requested(), on_override_expired()
│   │   │   │                            Each handler: updates gift state + fires notification
│   │   │   └── event_types.py        ← Enum: PROOF_SUBMITTED, MILESTONE_APPROVED,
│   │   │                                EMERGENCY_REQUESTED, OVERRIDE_EXPIRED,
│   │   │                                NGO_REDIRECTED, GIFT_UNLOCKED, MEMO_ADDED
│   │   │
│   │   ├── dependencies.py           ← Auth, pagination deps (FastAPI Depends)
│   │   ├── middleware.py             ← CORS, logging, rate limiting
│   │   ├── exceptions.py             ← Global exception handlers
│   │   └── utils.py                  ← Shared helpers (date utils, currency formatter, etc.)
│   │
│   └── core/
│       ├── security.py               ← Mock accounts + role-based access
│       └── logging.py
│
├── tests/
│   ├── grandparent/
│   │   ├── test_router.py
│   │   └── test_service.py
│   ├── grandchild/
│   │   ├── test_router.py
│   │   └── test_service.py
│   ├── trustee/
│   │   ├── test_router.py
│   │   └── test_service.py
│   ├── gifts/
│   │   ├── test_state_machine.py     ← Unit tests for all state transitions
│   │   └── test_service.py
│   ├── notifications/
│   │   └── test_service.py
│   └── simulation/
│       └── test_service.py
│
└── alembic/
    ├── env.py
    └── versions/
        └── 001_initial_schema.py     ← 🆕 Base migration: all tables created from Day 1
                                         Tables: users, grandchildren, gifts, milestones,
                                         proofs, trustees, transactions, media_messages,
                                         notifications, override_windows
```

---

### 2. FastAPI OpenAPI / Swagger Strategy

**Do not maintain hand-written YAML files.** FastAPI auto-generates the OpenAPI spec. Use the following approach:

**In `main.py`:** Define tag metadata for grouped, readable docs:
```python
tags_metadata = [
    {"name": "Grandparent", "description": "Gift creation, dashboard, portfolio"},
    {"name": "Grandchild",  "description": "Gift view, proof submission, withdrawals"},
    {"name": "Trustee",     "description": "Milestone oversight (auto-approval in demo)"},
    {"name": "Gifts",       "description": "Core gift domain — shared across all roles"},
    {"name": "Simulation",  "description": "CAGR projections, mock fund charts"},
    {"name": "Voice",       "description": "Voice gift creation and voice memo recording"},
    {"name": "Media",       "description": "Multimedia message upload and retrieval"},
    {"name": "Notifications","description": "In-app notification feed"},
]

app = FastAPI(title="GiftForge API", version="2.0.0", openapi_tags=tags_metadata)
```

**In every router:** Use `response_model` on all endpoints:
```python
@router.get("/{gift_id}", response_model=GiftResponse, tags=["Gifts"])
async def get_gift(gift_id: UUID, db: AsyncSession = Depends(get_db)):
    ...
```

**Export spec programmatically** via Makefile:
```makefile
export-spec:
    python -c "
import json
from app.main import app
from fastapi.openapi.utils import get_openapi
spec = get_openapi(title=app.title, version=app.version, routes=app.routes)
open('openapi_export.json','w').write(json.dumps(spec, indent=2))
    "
```
Run `make export-spec` to generate `openapi_export.json` for team reference. This replaces the `swagger/` folder entirely.

---

### 3. Aiven Postgres — Connection Notes

```python
# database.py
DATABASE_URL = settings.DATABASE_URL  # from .env
# Format: postgresql+asyncpg://user:pass@host:port/dbname?ssl=require
# Aiven requires ssl=require — do not omit

engine = create_async_engine(DATABASE_URL, pool_size=5, max_overflow=10)
```

SSL is mandatory for Aiven. Ensure `DATABASE_URL` in `.env` includes `?ssl=require`.

---

### 4. Key Config Values (`config.py`)

```python
class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str = "hackathon-mock-secret"

    # Currency
    FX_RATE_USD_TO_INR: float = 83.5   # Hardcoded — today's rate

    # Simulation CAGR rates
    CAGR_CONSERVATIVE: float = 0.06
    CAGR_BALANCED: float = 0.10
    CAGR_GROWTH: float = 0.14

    # Trustee
    TRUSTEE_AUTO_APPROVAL: bool = True   # Demo mode flag

    # Override window
    OVERRIDE_WINDOW_DAYS: int = 7

    class Config:
        env_file = ".env"
```

---

### 5. State Machine (`shared/gifts/state_machine.py`)

```python
VALID_TRANSITIONS = {
    "Draft":          ["Active"],
    "Active":         ["Under Review", "Completed"],
    "Under Review":   ["Approved", "Rejected"],
    "Approved":       ["Completed"],
    "Rejected":       ["Redirected to NGO"],  # after 7-day override window
    "Redirected to NGO": [],
    "Completed":      [],
}

def transition(current_state: str, event: str) -> str:
    allowed = VALID_TRANSITIONS.get(current_state, [])
    if event not in allowed:
        raise InvalidGiftTransition(current_state, event)
    return event
```

All state changes across all modules must call `transition()` — no direct status string assignments.

---

### 6. Notification Dispatch Pattern

Every service that changes gift state fires a notification via the event dispatcher:

```python
# In gifts/service.py — example: after milestone auto-approval
from app.shared.events.dispatcher import dispatch
from app.shared.events.event_types import EventType

await dispatch(EventType.MILESTONE_APPROVED, payload={
    "gift_id": gift.id,
    "grandchild_id": gift.grandchild_id,
    "grandparent_id": gift.grandparent_id,
})
```

`handlers.py` picks this up, calls `notifications/service.py` to create the notification record, which the frontend polls via `GET /notifications/{user_id}`.

---

### 7. Alembic Base Migration (`001_initial_schema.py`)

This file must be committed on Day 1. It creates all tables:
- `users`
- `grandchildren`
- `gifts`
- `milestones`
- `proofs`
- `trustees` (includes `auto_approval_mode` boolean column)
- `transactions`
- `media_messages`
- `notifications`
- `override_windows`

Run on fresh Aiven DB: `alembic upgrade head`

---

### 8. Module Ownership Summary

| Module | Owner Team | Imports From |
|---|---|---|
| `grandparent/` | Grandparent Dev | `shared/gifts/`, `simulation/`, `notifications/` |
| `grandchild/` | Grandchild Dev | `shared/gifts/`, `notifications/`, `media/` |
| `trustee/` | Trustee Dev | `shared/gifts/`, `notifications/`, `events/` |
| `shared/gifts/` | Shared / Lead | `events/`, `notifications/` |
| `voice/` | Voice Dev | `shared/gifts/`, `media/` |
| `media/` | Shared | — |
| `simulation/` | Shared | `config.py` (FX rate, CAGR) |
| `notifications/` | Shared | — |
| `shared/events/` | Shared / Lead | `notifications/` |

> **Rule:** No module imports from a sibling module's internal files. All cross-module access goes through `shared/`. This prevents circular imports and keeps the build clean.

---

*GiftForge v2.0 — Hackathon Build Ready*
