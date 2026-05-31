# Issue 2 - User Table Implementation Plan

## Source
- GitHub issue: #2 "[US] Show all users in a table"
- URL: https://github.com/AI-SDLC-26/ai-sdlc-journey/issues/2

## Clarified Requirements
- `/users` page access: authenticated users only.
- Backend endpoint path: `/api/users`.
- Empty-state validation: include a simple way to return an empty list for testing/demo.
- Testing scope: both API integration tests and SPA tests.

## Current Codebase Snapshot
- Backend already exposes `/health`, `/auth/login`, and protected `/api/demo` in `src/api/DemoApi/Program.cs`.
- SPA currently has routes for `/` and `/dashboard` in `src/spa/src/App.tsx`.
- SPA already has API wrapper patterns in `src/spa/src/api.ts` and auth gate patterns in `src/spa/src/pages/DashboardPage.tsx`.
- Existing test foundations:
  - API integration tests under `src/api/DemoApi.Tests`.
  - SPA tests under `src/spa/src/__tests__` with Vitest + Testing Library.

## Implementation Plan (Step by Step)

### 1. Define the users response contract and sample data
1. Add a lightweight users response shape in the backend (name, role, status).
2. Define a fixed in-memory default list (mock data), no persistence/database.
3. Keep status as a simple string for this scope (no enum migration needed).

Deliverable:
- Agreed response structure for `/api/users` and static mock list.

### 2. Implement backend endpoint `/api/users`
1. Add a new endpoint in `src/api/DemoApi/Program.cs` under a `Users` tag.
2. Require authentication (same security model as `/api/demo`).
3. Return the default users list as `200 OK`.
4. Add an empty-list switch for testing/demo (for example query param `?empty=true`), still returning `200 OK` with `[]`.

Deliverable:
- Protected endpoint `/api/users` with normal and empty-list behavior.

### 3. Add backend integration tests
1. Create/update API tests in `src/api/DemoApi.Tests` to cover:
   - Unauthorized request to `/api/users` returns `401`.
   - Authorized request returns `200` and list entries include `name`, `role`, `status`.
   - Empty mode returns `200` and an empty array.
2. Reuse existing login flow helper pattern from current tests.

Deliverable:
- Test coverage proving endpoint auth and response behavior.

### 4. Extend SPA API client
1. Add `UserSummary` interface in `src/spa/src/api.ts`.
2. Add `fetchUsers(token: string, options?)` function calling `/api/users`.
3. Keep failure handling aligned with existing API functions.

Deliverable:
- Typed client function for retrieving users list.

### 5. Create Users page UI
1. Add `src/spa/src/pages/UsersPage.tsx`.
2. Gate page with authentication (redirect to `/` when no auth).
3. Fetch users on mount.
4. Render states:
   - Loading state while request is in-flight.
   - Error text for failed request (simple message is enough).
   - Empty state text exactly: `No available users`.
   - Basic table with columns: Name, Role, Status.
5. Keep styling simple and consistent with current inline-style approach.

Deliverable:
- Functional authenticated `/users` screen with required states.

### 6. Register route and add navigation affordances
1. Add route in `src/spa/src/App.tsx` for `/users`.
2. Add a navigation link to `/users` from authenticated surfaces:
   - `src/spa/src/pages/HomePage.tsx` (already-authenticated view).
   - `src/spa/src/pages/DashboardPage.tsx`.

Deliverable:
- Users can discover and reach `/users` from existing app flow.

### 7. Add SPA tests
1. Add `src/spa/src/__tests__/UsersPage.test.tsx` covering:
   - Redirect behavior when unauthenticated.
   - Loading then table render with user rows.
   - Empty list shows `No available users`.
2. Update/add API tests in `src/spa/src/__tests__/api.test.ts` for `fetchUsers`.

Deliverable:
- Frontend behavior verified for auth, populated data, and empty state.

### 8. Validate end-to-end behavior locally
1. Run backend tests.
2. Run SPA tests.
3. Manual smoke test:
   - Login as demo user.
   - Navigate to `/users` and verify table.
   - Trigger empty mode and verify empty-state text.

Deliverable:
- Confirmed implementation aligned with acceptance criteria.

## Acceptance Criteria Mapping
- "Given a user enters `/users`, they see list with name, status, role":
  - Covered by Steps 2, 5, 6, 7, 8.
- "Given no users, they see `No available users` text":
  - Covered by Steps 2 (empty mode), 5 (empty rendering), 7 (test), 8 (manual verification).

## Out of Scope Guardrails
- No database/persistence changes.
- No pagination/filter/sorting controls.
- No design-system overhaul.
- No advanced API error modeling beyond current simple handling pattern.

## Suggested Execution Order
1. Step 1 -> Step 2 -> Step 3
2. Step 4 -> Step 5 -> Step 6
3. Step 7 -> Step 8
