# Data Model: Show Users Table

## Entity: UserSummary
- Purpose: Lightweight row-level representation for users list rendering.
- Fields:
  - `name` (string, required): Display name shown in table.
  - `role` (string, required): Role label (for example `admin`, `member`).
  - `status` (string, required): Current state label (for example `active`, `inactive`).
- Validation rules:
  - All fields are required and non-empty strings.
  - `name` is display text only; duplicates are allowed and rendered as separate rows.

## Entity: UsersQuery
- Purpose: Request-shaping input for deterministic response mode.
- Fields:
  - `empty` (boolean, optional): When `true`, return an empty array for validation scenarios.
- Validation rules:
  - Omitted or `false` returns default mock list.
  - `true` returns an empty list while preserving `200 OK` response shape.

## Entity: UsersViewState (SPA)
- Purpose: Captures rendering state for users page.
- States:
  - `loading`: data fetch in progress.
  - `ready`: users list available and rendered in native HTML table.
  - `empty`: no rows available; display `No available users`.
  - `error`: request failed.
- Transition rules:
  - Initial -> `loading` on page mount (authenticated flow).
  - `loading` -> `ready` when response contains one or more users.
  - `loading` -> `empty` when response array is empty.
  - `loading` -> `error` when fetch fails.
