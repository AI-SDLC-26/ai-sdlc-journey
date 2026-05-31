# Tasks: Show Users Table

**Input**: Design documents from `/specs/001-users-table/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are required for this feature. Include success, failure, and authorization behavior coverage where relevant.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create feature-level implementation and test scaffolding.

- [ ] T001 Create API users endpoint test scaffold in src/api/DemoApi.Tests/UsersEndpointTests.cs
- [ ] T002 Create SPA users page test scaffold in src/spa/src/__tests__/UsersPage.test.tsx
- [ ] T003 [P] Align contract examples for populated and empty responses in specs/001-users-table/contracts/users-api.yaml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core primitives required before user story implementation.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [ ] T004 Add shared API user DTO and predefined in-memory mock users collection in src/api/DemoApi/Program.cs
- [ ] T005 [P] Add shared SPA `UserSummary` type and `fetchUsers` function signature in src/spa/src/api.ts
- [ ] T006 [P] Register `/users` route placeholder in src/spa/src/App.tsx

**Checkpoint**: Foundation is ready for user story execution.

---

## Phase 3: User Story 1 - View Community User List (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can view a populated users table with name, role, and status.

**Independent Test**: Sign in, open `/users`, and verify native table columns plus predefined user rows render.

### Tests for User Story 1

- [ ] T007 [P] [US1] Add API integration test for authorized `GET /api/users` returning predefined mock users in src/api/DemoApi.Tests/UsersEndpointTests.cs
- [ ] T008 [P] [US1] Add SPA API test for `fetchUsers` success behavior in src/spa/src/__tests__/api.test.ts
- [ ] T009 [P] [US1] Add SPA page test for loading-to-table render and Name/Role/Status columns in src/spa/src/__tests__/UsersPage.test.tsx

### Implementation for User Story 1

- [ ] T010 [US1] Implement authenticated `GET /api/users` default behavior returning predefined mock users on every default call in src/api/DemoApi/Program.cs
- [ ] T011 [US1] Implement `fetchUsers` bearer request to `/api/users` in src/spa/src/api.ts
- [ ] T012 [US1] Implement `UsersPage` populated-state rendering with native HTML table elements in src/spa/src/pages/UsersPage.tsx
- [ ] T013 [US1] Wire `/users` route to `UsersPage` in src/spa/src/App.tsx

**Checkpoint**: User Story 1 is functional and demo-ready as MVP.

---

## Phase 4: User Story 2 - Understand Empty State (Priority: P2)

**Goal**: Authenticated users see exact empty-state text when no users are returned.

**Independent Test**: Trigger empty mode and verify users page shows exactly `No available users`.

### Tests for User Story 2

- [ ] T014 [P] [US2] Add API integration test for `GET /api/users?empty=true` returning empty array in src/api/DemoApi.Tests/UsersEndpointTests.cs
- [ ] T015 [P] [US2] Add SPA API test for `fetchUsers` empty-mode query behavior in src/spa/src/__tests__/api.test.ts
- [ ] T016 [P] [US2] Add SPA page test for exact empty-state text `No available users` in src/spa/src/__tests__/UsersPage.test.tsx

### Implementation for User Story 2

- [ ] T017 [US2] Implement `empty` query handling while preserving default mock-data-on-every-call behavior in src/api/DemoApi/Program.cs
- [ ] T018 [US2] Extend `fetchUsers` options to send empty-mode query parameter in src/spa/src/api.ts
- [ ] T019 [US2] Update `UsersPage` empty-state rendering for exact message match in src/spa/src/pages/UsersPage.tsx

**Checkpoint**: User Stories 1 and 2 are independently testable and stable.

---

## Phase 5: User Story 3 - Reach the Users Page Easily (Priority: P3)

**Goal**: Users can discover `/users` from authenticated UI and unauthenticated access redirects to `/`.

**Independent Test**: Verify authenticated navigation links exist and direct `/users` access when signed out redirects to `/`.

### Tests for User Story 3

- [ ] T020 [P] [US3] Add API integration test for unauthorized `GET /api/users` returning `401` in src/api/DemoApi.Tests/UsersEndpointTests.cs
- [ ] T021 [P] [US3] Add SPA route test for unauthenticated `/users` redirect to `/` in src/spa/src/__tests__/UsersPage.test.tsx
- [ ] T022 [P] [US3] Add authenticated home link test for `/users` navigation in src/spa/src/__tests__/HomePage.test.tsx
- [ ] T023 [P] [US3] Add dashboard navigation test for `/users` link in src/spa/src/__tests__/DashboardPage.test.tsx

### Implementation for User Story 3

- [ ] T024 [US3] Enforce unauthenticated redirect behavior in `UsersPage` in src/spa/src/pages/UsersPage.tsx
- [ ] T025 [US3] Add authenticated navigation link to `/users` in src/spa/src/pages/HomePage.tsx
- [ ] T026 [US3] Add authenticated navigation link to `/users` in src/spa/src/pages/DashboardPage.tsx

**Checkpoint**: All user stories are independently functional with discoverability and authorization behavior covered.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cross-story cleanup, validation, and documentation consistency.

- [ ] T027 [P] Update users-flow documentation for local demo in README.md and resources/DEMO.md
- [ ] T028 [P] Reconcile quickstart steps with final implementation and test paths in specs/001-users-table/quickstart.md
- [ ] T029 Record final quality-gate validation notes in specs/001-users-table/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2
- **Phase 4 (US2)**: Depends on Phase 2 (recommended after US1 due shared endpoint/page files)
- **Phase 5 (US3)**: Depends on Phase 2 (recommended after US1 route/page baseline)
- **Phase 6 (Polish)**: Depends on completion of desired user stories

### User Story Dependencies

- **US1 (P1)**: Can start immediately after Phase 2
- **US2 (P2)**: Can start after Phase 2, but safest sequence is after US1 because it extends the same endpoint and page
- **US3 (P3)**: Can start after Phase 2, but safest sequence is after US1 because it depends on users route/page behavior

### Within Each User Story

- Tests first, then implementation
- API contract behavior before SPA integration
- Page rendering before navigation polish

### Parallel Opportunities

- T003, T005, T006 can run in parallel after T001-T002
- US1 tests T007-T009 can run in parallel
- US2 tests T014-T016 can run in parallel
- US3 tests T020-T023 can run in parallel
- Polish tasks T027-T029 can run in parallel after implementation stabilizes

---

## Parallel Example: User Story 1

```bash
# Parallel test work
Task: T007 Add API integration test for authorized GET /api/users in src/api/DemoApi.Tests/UsersEndpointTests.cs
Task: T008 Add SPA API success test in src/spa/src/__tests__/api.test.ts
Task: T009 Add SPA table render test in src/spa/src/__tests__/UsersPage.test.tsx
```

## Parallel Example: User Story 2

```bash
# Parallel test work
Task: T014 Add API empty-mode test in src/api/DemoApi.Tests/UsersEndpointTests.cs
Task: T015 Add SPA API empty-mode test in src/spa/src/__tests__/api.test.ts
Task: T016 Add SPA empty-state message test in src/spa/src/__tests__/UsersPage.test.tsx
```

## Parallel Example: User Story 3

```bash
# Parallel test work
Task: T020 Add API unauthorized test in src/api/DemoApi.Tests/UsersEndpointTests.cs
Task: T022 Add HomePage users-link test in src/spa/src/__tests__/HomePage.test.tsx
Task: T023 Add Dashboard users-link test in src/spa/src/__tests__/DashboardPage.test.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete US1 tests and implementation (T007-T013).
3. Validate local demo for populated users table.

### Incremental Delivery

1. Deliver MVP with US1.
2. Add deterministic empty state with US2.
3. Add discoverability and auth redirect hardening with US3.
4. Finish with cross-cutting polish and quality-gate confirmation.
