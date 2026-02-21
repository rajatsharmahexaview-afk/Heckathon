# Feature Specification: GiftForge Full-Stack Application

**Feature Branch**: `001-giftforge-full-app`  
**Created**: 2026-02-21  
**Status**: Draft  
**Input**: User description: "Build GiftForge app using GiftForge_Updated_Spec.md requirements and bright-path-frontend-main assets"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Grandparent Voice-Assisted Setup (Priority: P1)

As a Grandparent, I want to use a dedicated voice interface to set up financial gifts for my grandchildren, so that the experience feels personal and accessible.

**Why this priority**: Differentiating "hero" feature of the platform.

**Independent Test**: Grandparent navigates to the Voice Gift Creation page, records a command, confirms the read-back summary, and sees the new gift in their dashboard.

**Acceptance Scenarios**:
1. **Given** the Grandparent is logged in, **When** they navigate to `/grandparent/voice-gift` and speak "Create a gift for Arjun", **Then** the UI should display a structured confirmation of the gift details.
2. **Given** a voice-created gift, **When** the "Confirm" action is taken, **Then** a persistent record is created in the system and a success notification is triggered.

---

### User Story 2 - Grandchild Milestone Redemption (Priority: P1)

As a Grandchild, I want to view my progress and submit proof for milestones (like graduation), so that my legacy funds are unlocked per my grandparent's rules.

**Why this priority**: Essential for the value exchange of the platform.

**Independent Test**: Grandchild uploads a document to an active milestone and receives an immediate approval notification (demo mode).

**Acceptance Scenarios**:
1. **Given** the Grandchild is on `/grandchild`, **When** they upload a photo for a "Graduation" milestone, **Then** the status should immediately update to "Approved" and reflect the auto-approval mode.
2. **Given** an approved milestone, **When** the Grandchild checks their value, **Then** the funds for that milestone should be shown as "Unlocked" or "Disbursed".

---

### User Story 3 - Portfolio Management & Currency Toggle (Priority: P2)

As a Grandparent, I want to see my total corpus across all grandchildren and toggle between INR and USD, so that I can monitor my legacy in my preferred currency.

**Why this priority**: core utility for financial oversight.

**Independent Test**: Grandparent flips the currency switch on the dashboard; all growth charts and balances update instantly.

**Acceptance Scenarios**:
1. **Given** the dashboard is set to USD, **When** the toggle is clicked, **Then** all values (including simulated growth) are converted using the 83.5 FX rate.

---

### User Story 4 - Trustee Governance Visibility (Priority: P3)

As a Trustee, I want to see notifications for milestone submissions, even though the demo auto-approves them, so that I can understand my oversight role.

**Why this priority**: Important for demo narrative context.

**Independent Test**: Trustee logs in and sees a feed of auto-approved milestones in their notification drawer.

**Acceptance Scenarios**:
1. **Given** a grandchild has submitted proof, **When** the Trustee opens `/trustee`, **Then** they should see the auto-approved event in their activity log.

---

### Edge Cases

- **7-Day Window Expiry**: If a rejection occurs and no override is provided within 7 days, the system MUST redirect the specific gift amount to the pre-selected NGO.
- **Voice Parsing Error**: The system SHOULD fall back to a manual correction screen if the voice command cannot be parsed into a structured gift model.
- **Emergency Withdrawal Proof**: Requests for medical or educational emergencies MUST require a multimedia attachment.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **Multi-Role Dashboards**: System MUST provide distinct, accessible interfaces for Grandparents, Grandchildren, and Trustees.
- **FR-002**: **Voice Command Interface**: System MUST parse audio commands using OpenAI Natural Language Processing into structured gift agreements (including recipient, release conditions, and risk profile).
- **FR-003**: **State Machine Lifecycle**: Gifts MUST progress through defined lifecycle states (Draft through to Completion) with all transitions validated against governance rules, including a selectable fallback destination from a list of 5 mock NGOs.
- **FR-004**: **Auto-Approval Logic**: In "Demo Mode", all trustee approval gates MUST be bypassed and marked as auto-approved.
- **FR-005**: **Notification System**: In-app notifications MUST be persisted in Aiven Postgres and synchronized to the frontend for all state changes, including 24-hour expiration warnings for override windows.
- **FR-006**: **Currency Conversion**: System MUST support a global toggle for INR/USD using a hardcoded rate of 1 USD = 83.5 INR.
- **FR-007**: **Investment Simulation**: System MUST project corpus growth based on hardcoded CAGR rates (6%, 10%, 14%) for simulated historical and future charts.
- **FR-008**: **Multimedia Messages**: System MUST support text, photo, audio (voice memos), and video attachments linked to gift milestones or emergency requests.

### Key Entities

- **User**: Profile with id, role (grandparent, grandchild, trustee), and name.
- **Gift**: Portfolio entry with id, corpus amount, status, investment profile, and linked rules.
- **Notification**: Event log with recipient, message, timestamp, and deep-link URL.
- **MediaMessage**: Attachment object with file path, type, and source (e.g., voice memo or graduation proof).
- **OverrideWindow**: Timer tracking the 7-day period for grandparent intervention.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All primary user journeys are functional and reflect persistent state changes across different user roles.
- **SC-002**: OpenAI-driven voice recognition to a confirmed, editable summary takes less than 3 seconds.
- **SC-003**: All monetary calculations (Portfolio totals, FX conversions, CAGR projections) are accurate to 2 decimal places.
- **SC-004**: Dashboard page loads (including dynamic charts) complete in under 2 seconds.

## Assumptions

- **Mock Backend Integration**: The existing `AppContext` mock data will be replaced by API calls to the FastAPI backend.
- **Static Assets**: Multimedia files (images/audio) will be stored in a mockable static directory or simulated cloud storage.
- **Demo-Friendly Auth**: Authentication will be handled via the provided `LoginPage.tsx` with defined role-swapping capabilities.


