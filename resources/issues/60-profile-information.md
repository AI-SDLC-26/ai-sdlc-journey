# GitHub Issue #60: [US] Add profile information

- Repository: `AI-SDLC-26/ai-sdlc-journey`
- URL: https://github.com/AI-SDLC-26/ai-sdlc-journey/issues/60
- State: Open
- Author: [@diegoRodriVa](https://github.com/diegoRodriVa)
- Created: 2026-11-03
- Updated: 2026-11-03

## Submission checklist

- [x] I searched for existing related issues / epics first.
- [x] I described the problem clearly.
- [x] I added testable acceptance criteria.
- [x] I defined what is in scope and out of scope.

## Short summary

Show a hardcoded profile card for the authenticated user on the dashboard.

## User story statement

As a registered user, I want to see a profile card (name, role, age) on the dashboard, so that I can see my own account information at a glance.

## Problem

Current situation: The `/dashboard` route shows only backend demo items and a "Generated at:" field. No information about the signed-in user is displayed.

Who is affected: Authenticated users of the SPA.

Why this is a problem: The dashboard cannot yet show user-specific data. This story is a mock that prepares the product for DB-backed profile data later.

Evidence / examples: The dashboard shows no user data today. The mocked profile will be Name "Nikola Tesla", Role "Engineer", Age 86, identical for every authenticated user.

## Dependencies

Depends on: a new authenticated `GET /profile` endpoint in the .NET API (`Program.cs`, existing JWT auth).

Depends on: the existing SPA dashboard and `src/api.ts`.

Assumes: any simple, modern frontend design is acceptable for this first iteration.

## Acceptance criteria

1. Given a valid JWT, when the client calls `GET /profile`, then the API returns 200 with name "Nikola Tesla", role "Engineer" and age 86.
2. Given no token or an invalid token, when the client calls `GET /profile`, then the API returns 401.
3. Given an authenticated user on `/dashboard`, when the page loads, then a profile card showing name, role and age is displayed below the items list and above the "Generated at:" field.
4. Given an unauthenticated visitor, when they navigate to `/dashboard`, then they cannot access it and the profile card is not shown.
5. Given the `/profile` request fails, when the dashboard renders, then an error message is shown instead of the card and the rest of the dashboard still works.

## In scope

- A `GET /profile` endpoint that requires authentication and returns the same hardcoded data for every authenticated user.
- A SPA API call in `src/api.ts` to fetch the profile.
- A basic, modern-looking profile card on the dashboard showing name, role and age.
- API and SPA tests for the behavior above.

## Out of scope

- No databases persistence required.
- Per-user profile data.
- Icons, new fonts, or component libraries.
- Editing the profile.
