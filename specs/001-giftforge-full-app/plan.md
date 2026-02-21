# Implementation Plan: GiftForge Full-Stack Application

**Branch**: `001-giftforge-full-app` | **Date**: 2026-02-21 | **Spec**: [specs/001-giftforge-full-app/spec.md](spec.md)
**Input**: Feature specification from `specs/001-giftforge-full-app/spec.md`

## Summary

Build a comprehensive legacy gifting platform (GiftForge) enabling grandparents to setup rule-based financial gifts for grandchildren. The implementation includes a FastAPI backend (Python) and a React frontend (TypeScript/Vite) following the "Grandparent-Friendly" design system. Key features include OpenAI-driven voice gift creation, milestone-based auto-approval (demo mode), and Aiven Postgres synchronization for notifications.

## Technical Context

**Language/Version**: Python 3.11+, Node.js (TypeScript)
**Primary Dependencies**: FastAPI, SQLAlchemy (Async), Pydantic, OpenAI API, React, Vite, Tailwind CSS, shadcn/ui, TanStack Query
**Storage**: Aiven PostgreSQL (SSL mandatory)
**Testing**: pytest (Backend), vitest (Frontend)
**Target Platform**: Web (Desktop/Tablet optimized for accessibility)
**Project Type**: Web application (Frontend + Backend)
**Performance Goals**: Page load < 2s, Voice recognition < 3s, Notification render < 500ms
**Constraints**: Hardcoded FX rate (1 USD = 83.5 INR), Simulated CAGR profiles (6%, 10%, 14%), 7-day override window for NGO redirection
**Scale/Scope**: Hackathon prototype with simulated financial integrations but functional governance logic

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1.  **Domain-Driven Code Quality**: Backend must follow Router -> Service -> Repository pattern in `app/modules/`. **[VERIFIED]**
2.  **State Machine Integrity**: All status changes MUST go through `shared/gifts/state_machine.py`. No direct DB updates. **[VERIFIED]**
3.  **Accessible UX**: Grandparent interfaces must have large fonts, high contrast, and < 2 navigation levels. **[VERIFIED]**
4.  **Rigorous Testing**: Unit tests for all business logic and 100% coverage for state machine. **[VERIFIED]**
5.  **Type Safety**: Mandatory Pydantic schemas for all API inputs/outputs. **[VERIFIED]**
6.  **Secure DB**: SSL mandatory for Aiven Postgres connection. **[VERIFIED]**
7.  **Auto-Approval Logic**: Demo mode flag MUST be implemented to allow auto-approval of trustee gates. **[VERIFIED]**

## Project Structure

### Documentation (this feature)

```text
specs/001-giftforge-full-app/
├── plan.md              # This file
├── research.md          # Implementation research
├── data-model.md        # DB schema and entity relationships
├── quickstart.md        # Setup and run guide
├── contracts/           # OpenAPI specs
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── main.py
│   ├── modules/ (grandparent, grandchild, trustee, voice, notifications, media)
│   ├── shared/ (gifts, simulation, events)
│   ├── core/
│   └── database.py
├── alembic/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   ├── hooks/
│   ├── types/
│   └── data/ (mockData.ts)
└── tests/
```

**Structure Decision**: Web application structure detected. Frontend and Backend will be maintained as separate top-level directories within the repository.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
