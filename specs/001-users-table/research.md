# Research: Show Users Table

## Decision 1: API Contract Path
- Decision: Use `GET /api/users` as the users-list endpoint.
- Rationale: Keeps consistency with existing API namespacing (`/api/demo`) and avoids mixed public paths.
- Alternatives considered:
  - `/users`: Rejected due to contract inconsistency with current API prefixing.
  - Both `/users` and `/api/users`: Rejected to avoid duplicate contract surface for a demo feature.

## Decision 2: Authentication and Unauthenticated Behavior
- Decision: Keep users list protected and redirect unauthenticated SPA navigation from `/users` to `/`.
- Rationale: Aligns with current auth flow and explicit security posture in constitution.
- Alternatives considered:
  - Public `/users` page: Rejected due to requirement for protected user list visibility.
  - Dedicated unauthorized page: Rejected as unnecessary complexity for demo-first scope.

## Decision 3: Empty-State Validation Strategy
- Decision: Add explicit API-controlled empty mode for deterministic validation.
- Rationale: Reliable testing and live demo coverage for "No available users" acceptance scenario.
- Alternatives considered:
  - Fixed populated mock list only: Rejected because it prevents deterministic empty-state testing.
  - Separate empty endpoint: Rejected because it expands API surface unnecessarily.

## Decision 4: Table Rendering Approach
- Decision: Render with native HTML `<table>` elements inside existing React TSX, no new UI/table library.
- Rationale: Meets user constraint and keeps implementation minimal and explainable.
- Alternatives considered:
  - Third-party table library: Rejected due to added complexity and dependency overhead.
  - Non-tabular custom list layout: Rejected because requirement explicitly asks for table presentation.

## Decision 5: Data Source and Persistence
- Decision: Use in-memory mock users in API only; no database changes.
- Rationale: Matches issue scope and local-first demo constraints.
- Alternatives considered:
  - Persisted database model: Rejected as out-of-scope and unnecessary for workshop baseline.
  - External API source: Rejected due to cloud dependency and reproducibility risk.
