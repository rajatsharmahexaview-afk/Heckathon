<!--
<sync_impact_report>
- Version change: Initial → 1.0.0
- List of modified principles: (Initial creation)
- Added sections: Technical Specification Alignment, Hackathon Development Workflow
- Templates requiring updates:
    - .specify/templates/plan-template.md: ✅ Updated alignment with "Constitution Check" gates.
    - .specify/templates/spec-template.md: ✅ Aligned with "Grandparent-Friendly" requirements.
    - .specify/templates/tasks-template.md: ✅ Aligned with "State Integrity" and "Domain-Driven" tasks.
- Follow-up TODOs: None.
</sync_impact_report>
-->

# GiftForge Constitution

## Core Principles

### I. Domain-Driven Code Quality
Code must follow the Domain-Driven Design (DDD) module structure as defined in the Technical Specification (Router → Service → Repository). Shared logic MUST reside in `app/shared/` to prevent circular imports. Type safety is mandatory; Pydantic schemas MUST be used for all API inputs and outputs.

### II. Rigorous Testing Standards
Every business logic transition and API endpoint must be accompanied by unit tests. The central `Gift State Machine` requires 100% path coverage. Automated tests must be run via `make test` before any deployment or task completion.

### III. Accessible & Consistent UX
Interfaces must adhere to "Grandparent-Friendly" design: large default fonts, high-contrast interactive elements, and wizard-based navigation with a maximum of 2 levels. Warm and reassuring language MUST be used, avoiding technical or financial jargon (e.g., use "Approval Required" instead of "Transaction Pending").

### IV. Performance & Responsiveness Requirements
The system must be optimized for immediate feedback: pages must load under 2 seconds, voice recognition parsing must complete under 3 seconds, and the notification drawer must render within 500ms.

### V. State Machine Integrity (NON-NEGOTIABLE)
All gift lifecycle changes MUST pass through the `shared/gifts/state_machine.py`. Direct database status updates are strictly forbidden. This ensures all rules (Time, Milestone, Behavior) and fallback logic (NGO Redirection) are applied consistently and auditably.

## Technical Specification Alignment

This constitution enforces the requirements laid out in the GiftForge v2.0 Technical Spec:
- **Backend Architecture**: FastAPI-based modular monolith.
- **Data Layer**: Async SQLAlchemy with `asyncpg` for Aiven Postgres. SSL is mandatory.
- **Currency & Simulation**: Follow the hardcoded FX rate (1 USD = 83.5 INR) and risk profile CAGRs (6%, 10%, 14%) exactly.
- **Voice Module**: Implement voice commands as a premium AI capability with read-back verification for gift creation.

## Hackathon Development Workflow

- **Automation-First**: Use `make` commands (`make run`, `make test`, `make lint`) for all lifecycle tasks.
- **Spec-Driven**: Implementation plans MUST include a "Constitution Check" gate.
- **Schema Safety**: All database changes require an Alembic migration file (`001_initial_schema.py` is the baseline).
- **OpenAPI**: Do not manually edit Swagger documentation; use FastAPI auto-generation via docstrings and Pydantic schemas.

## Governance

This Constitution is the primary authority for all architectural and design decisions in the GiftForge project.
- **Amendments**: Require a formal update to this document and a corresponding version bump in the metadata below.
- **Compliance**: Every implementation plan and task must verify alignment with these principles.
- **Standard**: "Should" is interpreted as RECOMMENDED; "Must" is interpreted as REQUIRED.

**Version**: 1.0.0 | **Ratified**: 2026-02-21 | **Last Amended**: 2026-02-21
