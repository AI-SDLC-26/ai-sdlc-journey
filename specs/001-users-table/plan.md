# Implementation Plan: Show Users Table

**Branch**: `001-prepare-speckit-specify` | **Date**: 2026-05-31 | **Spec**: `specs/001-users-table/spec.md`

**Input**: Feature specification from `/specs/001-users-table/spec.md`

## Summary

Add a protected users listing flow to the existing demo stack by introducing a new authenticated API endpoint (`/api/users`) and a new authenticated SPA route (`/users`) that renders a plain native HTML table in React TSX. Preserve demo-first simplicity by using in-memory mock data only, no database changes, and no new UI/table libraries. The default endpoint behavior returns a predefined mock users list on every call, while deterministic empty-state validation is supported through an explicit API-controlled empty mode.

## Technical Context

**Language/Version**: C# (.NET 10 Minimal API), TypeScript (~6.0), React 19 (TSX)

**Primary Dependencies**: ASP.NET Core Minimal API + JWT Bearer, React Router, Vitest + Testing Library, xUnit + WebApplicationFactory

**Storage**: N/A (in-memory mock list only)

**Testing**: `dotnet test` for API, `npm test` for SPA, `npm run lint`, `npm run build`

**Target Platform**: Local-first development environment (`http://localhost:5000` API, `http://localhost:5173` SPA)

**Project Type**: Web application with independently runnable SPA and API projects

**Performance Goals**: Local demo response remains near-instant for mock list; users page renders without noticeable UI delay under normal local conditions

**Constraints**: No new table/UI libraries; native HTML `<table>` in React TSX; authenticated access required; preserve existing auth flow and redirect unauthenticated `/users` to `/`

**Scale/Scope**: Demo-scale list presentation (small in-memory dataset) for workshop scenarios

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate Review

- [x] Demo-first simplicity: solution uses existing stack and avoids additional framework complexity.
- [x] Local-first reliability: no cloud dependency introduced; API and SPA remain separately runnable.
- [x] Explicit security posture: users list remains protected; unauthenticated users are redirected.
- [x] Contract discipline: API contract change is paired with SPA integration and test updates.
- [x] Test-backed behavior: plan includes success, empty, and authorization behavior tests.
- [x] Explicit non-goals: persistence, advanced interactions, and advanced table controls remain out of scope.
- [x] Spec-driven change management: work is grounded in `spec.md` with explicit clarifications.
- [x] Reproducibility and hygiene: local run commands remain valid; no generated artifact changes required.

### Post-Design Re-Check

- [x] Design artifacts preserve demo-first constraints and avoid added libraries.
- [x] API contract and SPA expectations are explicitly synchronized in `contracts/users-api.yaml`.
- [x] Quickstart validates reproducible local demo flow for both populated and empty scenarios.

## Project Structure

### Documentation (this feature)

```text
specs/001-users-table/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── users-api.yaml
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── DemoApi/
│   │   └── Program.cs
│   └── DemoApi.Tests/
│       └── *.cs
└── spa/
    └── src/
        ├── api.ts
        ├── App.tsx
        ├── pages/
        │   ├── DashboardPage.tsx
        │   ├── HomePage.tsx
        │   └── UsersPage.tsx
        └── __tests__/
            ├── api.test.ts
            └── UsersPage.test.tsx
```

**Structure Decision**: Keep the existing split architecture (`src/api` + `src/spa`) and add only feature-targeted files/edits in currently established modules.

## Phase 0: Research Output

Research decisions are documented in `specs/001-users-table/research.md` and resolve contract, security, and rendering approach choices, including no-new-library table rendering and deterministic empty-mode behavior.

## Phase 1: Design & Contracts Output

- Data model: `specs/001-users-table/data-model.md`
- API contract: `specs/001-users-table/contracts/users-api.yaml`
- Validation guide: `specs/001-users-table/quickstart.md`
- Agent context updated: `.github/copilot-instructions.md` SPECKIT marker now points to this plan file.

## Phase 2 Preview (for `/speckit.tasks`)

1. Backend endpoint update in `Program.cs` for authenticated `GET /api/users` that returns predefined mock users on every default call, plus deterministic empty mode.
2. API integration tests for unauthorized, populated, and empty responses.
3. SPA API client extension for users fetch contract.
4. `UsersPage` with native HTML table in TSX and auth redirect behavior.
5. Route and navigation wiring for discoverability.
6. SPA tests for populated/empty/auth redirect behavior.

## Complexity Tracking

No constitutional violations or complexity waivers are required for this feature.
