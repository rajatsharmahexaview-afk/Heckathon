# Tasks: GiftForge Full-Stack Application

**Input**: Design documents from `specs/001-giftforge-full-app/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Create backend project structure and requirements in backend/app/
- [x] T002 [P] Create frontend project structure and package.json in frontend/
- [x] T003 [P] Configure backend linting (Ruff/Black) and frontend (ESLint/Prettier)
- [x] T004 [P] Configure environment files (.env) with OpenAI and Database URL placeholders

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T005 Setup Aiven Postgres database connection in backend/app/database.py
- [x] T006 [P] Implement base SQLAlchemy models in backend/app/shared/gifts/models.py (User, Gift, Milestone)
- [x] T007 [P] Implement Pydantic schemas for API validation in backend/app/shared/gifts/schemas.py
- [x] T008 [P] Setup FastAPI application and tag metadata in backend/app/main.py
- [x] T009 [P] Create initial Alembic migration for all tables in backend/alembic/versions/
- [x] T010 Implement central Gift State Machine in backend/app/shared/gifts/state_machine.py
- [x] T011 [P] Configure frontend API client (Axios/Fetch) and React Query client in frontend/src/lib/api.ts
- [x] T012 [P] Implement shared types from data-model in frontend/src/types/gift.ts
- [x] T012a [P] Implement unit tests for Gift State Machine (100% target coverage) in `backend/tests/shared/test_state_machine.py`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Voice-Assisted Setup (Priority: P1) 🎯 MVP

**Goal**: Enable grandparents to create gifts via natural language audio/text commands

- [x] T013 [P] [US1] Create OpenAI transcription and parsing service in backend/app/modules/voice/service.py
- [x] T014 [US1] Implement POST /voice/parse-gift endpoint in backend/app/modules/voice/router.py
- [x] T015 [US1] Implement gift creation service with state machine validation in backend/app/shared/gifts/service.py
- [x] T016 [US1] Integrate voice creation page UI in frontend/src/pages/VoiceGiftCreation.tsx
- [x] T017 [US1] Implement voice recording hook and backend connection in frontend/src/hooks/useVoiceGift.ts
- [x] T017a [P] [US1] Implement unit tests for OpenAI transcription and parsing logic in `backend/tests/voice/test_service.py`
- [x] T017b [P] [US1] Implement integration test for the parsing endpoint in `backend/tests/voice/test_router.py`

**Checkpoint**: User Story 1 complete - MVP core functional with verified parsing accuracy

---

## Phase 4: User Story 2 - Grandchild Milestone Redemption (Priority: P1)

**Goal**: Allow grandchildren to view progress and submit proof for auto-approval

- [x] T018 [P] [US2] Create multimedia upload service in backend/app/modules/media/service.py
- [x] T019 [US2] Implement POST /media/upload and GET /media/{gift_id} in backend/app/modules/media/router.py
- [x] T020 [US2] Implement auto-approval logic for milestones in backend/app/modules/trustee/service.py (demo mode)
- [x] T021 [US2] Create grandchild dashboard UI for progress and proof submission in frontend/src/pages/GrandchildDashboard.tsx
- [x] T022 [US2] Implement milestone submission mutation in frontend/src/hooks/useGifts.ts
- [x] T022a [P] [US2] Implement unit tests for auto-approval service logic in `backend/tests/trustee/test_service.py`

**Checkpoint**: User Story 2 complete - End-to-end gift lifecycle functional with auto-approval tests

---

## Phase 5: User Story 3 - Portfolio Oversight & Currency Toggle (Priority: P2)

**Goal**: Provide financial visibility with INR/USD conversion and growth simulations

- [x] T023 [P] [US3] Implement simulation calculations (CAGR/Growth) in backend/app/shared/simulation/service.py
- [x] T024 [US3] Implement FX conversion utility (1 USD = 83.5 INR) in backend/app/shared/utils.py
- [x] T025 [US3] Create GET /simulation/growth/{gift_id} in backend/app/shared/simulation/router.py
- [x] T026 [US3] Implement Grandparent dashboard with charts and currency toggle in frontend/src/pages/GrandparentDashboard.tsx
- [x] T027 [US3] Integrate chart simulation data in frontend/src/components/dashboard/GrowthChart.tsx
- [x] T027a [P] [US3] Implement unit tests for simulation growth and FX conversion math in `backend/tests/simulation/test_service.py`

**Checkpoint**: User Story 3 complete - Financial dashboard functional with verified math logic

---

## Phase 6: User Story 4 - Trustee Visibility & Notifications (Priority: P3)

**Goal**: Provide shared oversight via persistent notifications and activity logs

- [x] T028 [P] [US4] Implement notification persistence service in backend/app/modules/notifications/service.py
- [x] T029 [US4] Implement GET /notifications/{user_id} and PATCH /notifications/{id}/read in backend/app/modules/notifications/router.py
- [x] T030 [US4] Add notification event dispatchers to State Machine transitions in backend/app/shared/events/dispatcher.py
- [x] T031 [US4] Implement notification drawer and polling logic in frontend/src/components/layout/NotificationFeed.tsx
- [x] T032 [US4] Build Trustee dashboard UI with activity feed in frontend/src/pages/TrusteeDashboard.tsx
- [x] T032a [P] [US4] Implement unit tests for notification dispatch and persistence logic in `backend/tests/notifications/test_service.py`

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T033 [P] Implement 7-day override window expiry background task in backend/app/shared/events/handlers.py
- [ ] T034 [P] Update quickstart.md with final environment variables and demo accounts
- [ ] T035 Final UI styling for "Grandparent-Friendly" accessibility compliance (font sizes/contrast)
- [ ] T036 Run full end-to-end validation of Gift Stage Machine transitions
- [ ] T037 [P] Perform performance benchmarking to verify page load (<2s) and voice parsing (<3s) requirements

---

## Dependencies & Execution Order

1.  **Phase 1 & 2** are critical path blockers.
2.  **US1 (Voice)** can proceed immediately after Foundation.
3.  **US2 (Milestones)** depends on US1 models (Gifts/Milestones) being stable.
4.  **US3 (Portfolio)** and **US4 (Notifications)** can be developed in parallel with US1/US2 implementation tasks mark [P].

## Implementation Strategy

- **MVP First**: T001-T017b completes the Setup, Foundation, and the "Hero" Voice Creation feature with full test coverage.
- **Quality Gate**: Each user story is considered complete ONLY after associated unit tests in backend/tests/ pass with 100% success rate.
- **Performance Gate**: Final validation (T037) must confirm 2-second load times before prototype delivery.
- **Incremental**: Add Milestone proofs (US2), then Simulation analytics (US3), and finally Notification sync (US4).
- **Quality**: Validate each checkpoint before proceeding to the next story.
