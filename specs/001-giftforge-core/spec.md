# Feature Specification: GiftForge Core Engine

**Feature Branch**: `001-giftforge-core`  
**Created**: 2026-02-21  
**Status**: Draft  
**Input**: User description: "Build an application with the requirements mentioned in GiftForge_Updated_Spec.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Voice-Assisted Gift Creation (Priority: P1)

As a Grandparent, I want to create a future financial gift for my grandchild using my voice, so that the process is accessible and emotionally meaningful without navigating complex menus.

**Why this priority**: Core "hero" feature of the application providing immediate accessibility for the primary user.

**Independent Test**: Grandparent activates voice module, speaks gift details, confirms the parsed summary, and successful gift creation is reflected in the dashboard.

**Acceptance Scenarios**:
1. **Given** the Grandparent is on the dashboard, **When** they activate the microphone and say "Create a balanced gift for Aryan releasing at age 18," **Then** the system should read back the parsed details for confirmation.
2. **Given** the voice summary is read back, **When** the Grandparent says "Confirm," **Then** a new gift record should appear in the Portfolio Dashboard.

---

### User Story 2 - Milestone-Based Distribution & Auto-Approval (Priority: P1)

As a Grandchild, I want to see my gift progress and submit proof for milestones, so that I can receive the funds as intended by my grandparent.

**Why this priority**: Critical functionality for the beneficiary and demonstrates the "Auto-approval" logic defined for the hackathon.

**Independent Test**: Grandchild submits a graduation certificate; the system automatically approves it (demo mode) and updates the gift status.

**Acceptance Scenarios**:
1. **Given** an active milestone-based gift, **When** the Grandchild uploads a photo as proof of graduation, **Then** the status should immediately change to "Approved" due to auto-approval mode.
2. **Given** an approved milestone, **When** the payout date is reached, **Then** the funds should be simulated as released to the grandchild.

---

### User Story 3 - Portfolio Oversight & Currency Toggle (Priority: P2)

As a Grandparent, I want to view my total capital and individual gift performance in both INR and USD, so that I can manage the legacy corpus effectively.

**Why this priority**: Essential for the "financial management" aspect of the platform.

**Independent Test**: User toggles between INR and USD on the dashboard; all values update using the 83.5 FX rate.

**Acceptance Scenarios**:
1. **Given** the Grandparent Dashboard is open with a balance of $1,000, **When** the currency toggle is switched to INR, **Then** the total balance should display as ₹83,500.

---

### Edge Cases

- **Milestone Missed & NGO Fallback**: If a milestone is rejected (manual override) or the 7-day override window expires, the system MUST trigger redirection to the pre-selected NGO.
- **Voice Parsing Failure**: If the voice command is not understood, the system SHOULD provide a helpful prompt to rephrase or offer the manual Wizard-based creation flow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support three gift types: Time-Based, Milestone-Based, and Behavior-Based.
- **FR-002**: System MUST implement a "Demo Mode" for Trustee Governance where actions are auto-approved.
- **FR-003**: System MUST provide a voice command interface for primary gift creation flows.
- **FR-004**: System MUST support multimedia attachments (voice, text, photo, video) for gifts.
- **FR-005**: System MUST implement a 7-day override window for rejected or pending governance actions before NGO redirection.
- **FR-006**: System MUST simulate portfolio growth using three risk profiles: Conservative (6%), Balanced (10%), and Growth (14%).
- **FR-007**: System MUST provide an in-app notification system for status changes, proof submissions, and expiration warnings.

### Key Entities

- **Gift**: Core entity representing the legacy agreement (type, amount, status, investment profile).
- **Rule**: Logic attached to a gift (age threshold, milestone event, or behavioral GPA check).
- **Notification**: Alerts delivered to users based on system events (trigger, recipient, message).
- **MediaMessage**: Multimedia greetings or proof documents linked to specific gifts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Primary gift creation via voice/wizard is completed in under 5 minutes by target demographic.
- **SC-002**: Dashboard load time remains under 2 seconds with mock data.
- **SC-003**: 100% of gift state transitions follow the defined lifecycle rules.
- **SC-004**: System correctly calculates and displays currency conversions across all views with 100% accuracy.

## Assumptions

- **Mock Data**: No actual banking or verification APIs will be used; all financial and verification logic is simulated for the hackathon prototype.
- **User Personas**: Users are pre-authenticated or switch roles via a demo-specific role selector.
