# Issue #60: Add profile information

## Source and objective

- Issue: [#60 - Add profile information][issue].
- Deliver an authenticated `GET /profile` endpoint and a dashboard profile
  card containing Name `Nikola Tesla`, Role `Engineer`, and Age `86`.
- Return identical mock data to every authenticated user.
- This document is an implementation plan, not an implementation.

[issue]: https://github.com/AI-SDLC-26/ai-sdlc-journey/issues/60

## Confirmed decisions

1. Use `/profile` exactly as requested, not `/api/profile`.
2. Display the card below the items list and above `Generated at:`.
3. Fetch profile and demo data independently. A profile failure must not
   prevent the items, timestamp, navigation, or logout from working.
4. If demo loading fails but profile loading succeeds, show the profile
   alongside the demo error. Do not invent a timestamp or items list.
5. If `/profile` returns 401 for a stored session, show an inline profile
   error. Do not introduce automatic logout or redirect on API errors.
6. Preserve the existing redirect to `/` when no session exists.
7. Keep the existing authenticated heading based on session data. The mock
   profile must not replace the session name or authorization role.
8. Use a simple responsive card, existing system fonts, and no icons or
   component libraries. Use SCSS and BEM for new styling.
9. Show `Loading profile...` while pending and `Failed to load profile`
   on failure. No retry controls, automatic retries, editing, or caching
   are added in this iteration.

Decisions 4 and 5 were explicitly confirmed during requirements clarification.
The loading and error copy are implementation defaults, not issue-mandated
exact wording.

## Current codebase findings

- [Program.cs](../../src/api/DemoApi/Program.cs) registers Minimal API
  endpoints inline and defines response records at the bottom. JWT
  authentication and authorization middleware are already configured.
  `/api/demo` and `/api/users` use `RequireAuthorization()`.
- [DemoEndpointTests.cs](../../src/api/DemoApi.Tests/DemoEndpointTests.cs)
  supplies the existing xUnit and `WebApplicationFactory<Program>` pattern.
  Tests obtain real JWTs through `/auth/login`.
- [api.ts](../../src/spa/src/api.ts) owns the API base URL, response types,
  fetch calls, bearer headers, and rejection of non-success responses.
- [DashboardPage.tsx](../../src/spa/src/pages/DashboardPage.tsx) currently
  loads only demo data. Its items list and timestamp are inside the same
  conditional block, so inserting the card there would incorrectly hide
  it when the demo request fails.
- [AuthContext.tsx](../../src/spa/src/auth/AuthContext.tsx) persists login
  state in `sessionStorage`. The dashboard redirects if no user exists;
  API failures currently do not clear that session.
- [App.tsx](../../src/spa/src/App.tsx) declares three SPA routes.
  Route strings are currently repeated in page components.
- [DashboardPage.test.tsx](../../src/spa/src/__tests__/DashboardPage.test.tsx)
  currently tests only the users link and mocks one fetch response.
  It will need URL-aware mocks for two independent requests.
- [package.json](../../src/spa/package.json) already includes Vitest,
  Testing Library, ESLint, TypeScript, and Vite. It has no Sass compiler.
  Existing page styling is inline; new card styling needs a small,
  explicit SCSS addition rather than a global restyle.
- The instructed `specs/001-users-table/plan.md` is absent from this
  checkout. This plan is grounded in the issue and inspected source.

## Scope and guardrails

- No database, migrations, persistence, profile editing, or per-user data.
- No new account, token claims, authentication mechanism, or permissions.
- No changes to existing endpoint contracts or JWT configuration.
- No controllers, repositories, global state library, or design system.
- No changes to protected paths or unrelated existing worktree changes.
- Keep existing pages and their styling intact except for directly related
  dashboard integration and shared route references.

## Implementation sequence

### 1. Add the authenticated API contract

- [ ] In [Program.cs](../../src/api/DemoApi/Program.cs), add a
  `ProfileResponse` record with `Name`, `Role`, and integer `Age`.
- [ ] Register `GET /profile` inline with the other endpoints. Return a
  typed successful response containing only the three profile fields:

```json
{
  "name": "Nikola Tesla",
  "role": "Engineer",
  "age": 86
}
```

- [ ] Apply `RequireAuthorization()` without role restrictions so any
  valid JWT is accepted. Reuse existing validation and signing settings.
- [ ] Add a `Profile` tag and endpoint summary/description. Make the
  successful response schema and 401 status explicit in OpenAPI metadata
  using the existing ASP.NET Core OpenAPI setup.
- [ ] Keep the handler deterministic and independent of JWT name/role
  claims. Do not modify the existing login response.

### 2. Add API integration coverage

Depends on step 1.

- [ ] Add `ProfileEndpointTests.cs` beside the existing API tests, using
  their primary-constructor fixture and naming conventions.
- [ ] Test `Profile_WithValidToken_ReturnsHardcodedProfile`: log in,
  attach the returned bearer token, call `/profile`, and assert 200,
  JSON content type, exact field names/values, and numeric age.
- [ ] Test missing and malformed tokens return 401, not a redirect.
- [ ] Test an expired, correctly signed token returns 401; set expiry
  beyond the configured/default clock-skew allowance.
- [ ] Test a valid token with different identity and role claims still
  returns the exact same profile. Build it from test-host configuration
  rather than copying signing secrets or changing production accounts.

### 3. Add the SPA profile client

Depends on the contract in step 1.

- [ ] In [api.ts](../../src/spa/src/api.ts), export a `Profile` interface
  with `name: string`, `role: string`, and `age: number`.
- [ ] Add `fetchProfile(token: string): Promise<Profile>` using the
  existing API base URL and bearer-header pattern.
- [ ] Request `/profile`; reject non-2xx responses with a meaningful
  error rather than returning mock data, null, or a success-shaped value.
- [ ] Allow network and JSON-decoding failures to reject normally so
  the dashboard can expose the failure.
- [ ] Extend [api.test.ts](../../src/spa/src/__tests__/api.test.ts) to
  assert the exact URL, authorization header, returned profile, and
  rejection for 401, 500, network failure, and invalid JSON.

### 4. Build the presentational profile card

Depends on the profile type in step 3.

- [ ] Add `src/spa/src/components/ProfileCard.tsx`, receiving the profile
  through typed props. Do not read auth context, call the API, or embed
  mock data inside the card.
- [ ] Use a labelled section, a heading such as `Profile`, and semantic
  name/value pairs for Name, Role, and Age.
- [ ] Keep it read-only; do not introduce callbacks without interactions.
- [ ] Add `src/spa/src/components/ProfileCard.scss` with a
  `profile-card` BEM block and appropriate element classes. Use restrained
  borders, spacing, contrast, and a width that fits narrow viewports.
- [ ] Add a Sass development dependency with
  `npm install --save-dev sass` from `src\spa`, updating both the manifest
  and lockfile. No other UI dependencies are needed.
- [ ] Add `ProfileCard.test.tsx` covering its accessible heading and all
  three labelled values. Rerender with different props to verify that
  values come from props, not hardcoded presentation data.

### 5. Integrate independent dashboard loading

Depends on steps 3 and 4.

- [ ] In [DashboardPage.tsx](../../src/spa/src/pages/DashboardPage.tsx),
  maintain separate profile data/loading/error state from demo state.
- [ ] Start both requests for an authenticated session without awaiting
  one before starting the other. Do not use a fail-fast `Promise.all`
  result that couples their rendering.
- [ ] Reset profile state when the authenticated session changes and
  ignore obsolete effect results after cleanup, logout, or a token
  change. This must also work under the existing React Strict Mode.
- [ ] Keep the no-session guard ahead of network work; unauthenticated
  rendering must issue neither request.
- [ ] Restructure the content so the order is demo message, items,
  profile region, then demo timestamp when those data are available.
  Keep the profile region outside the demo-success conditional.
- [ ] Render the loading message, card, or accessible inline error
  mutually exclusively. Use `role="alert"` for the profile error.
- [ ] Preserve the existing demo error, session heading, users link,
  logout behavior, and session-based redirect.
- [ ] Add a shared `src/spa/src/routes.ts` with the existing SPA paths;
  use it for route declarations and dashboard navigation/redirect
  references rather than adding component-level route literals.
  Do not rename routes or broaden this into a navigation refactor.
- [ ] Put new dashboard styling, if needed, in a small BEM SCSS file;
  do not add new inline styles or restyle unrelated pages.

### 6. Verify dashboard behavior with SPA tests

Depends on step 5.

- [ ] Update existing dashboard fetch mocks to dispatch by URL and fail
  explicitly for unexpected requests, not depend on call order.
- [ ] Assert the successful card displays all exact mock values while
  the existing heading still uses the logged-in session name.
- [ ] Assert actual DOM order: items list before card, card before
  `Generated at:`. Merely checking text presence is insufficient.
- [ ] Hold the profile promise pending to verify its loading state and
  confirm already-loaded demo items/timestamp remain visible.
- [ ] Test profile HTTP failure, network failure, and JSON-decoding
  failure produce the inline error instead of the card without removing
  successful demo content, navigation, or logout.
- [ ] Specifically test a profile 401 leaves the stored session intact
  and does not redirect.
- [ ] Test demo failure with profile success still renders the card and
  the existing demo error, without a fabricated timestamp.
- [ ] Test both requests failing renders both errors.
- [ ] Test an unauthenticated visit redirects to the home route, renders
  no profile card, and makes no fetch calls.
- [ ] Test logout clears the session, redirects, and removes the card.
- [ ] Test an obsolete pending profile response cannot appear after
  logout or replace a newer session's state.
- [ ] Retain the existing users-link test and update route references
  in tests directly affected by the shared constants.

### 7. Document and validate the completed feature

Depends on steps 2 and 6.

- [ ] Update [README.md](../../README.md) with the authenticated
  `/profile` endpoint, exact response example, dashboard placement,
  independent failure behavior, and mock-only limitation.
- [ ] Run the targeted API tests from the repository root:

```powershell
dotnet test src\api\DemoApi.Tests\DemoApi.Tests.csproj --filter "FullyQualifiedName~ProfileEndpointTests"
```

- [ ] Run affected SPA tests, lint, and the production build from
  `src\spa`:

```powershell
npm test -- --run src\__tests__\api.test.ts src\__tests__\DashboardPage.test.tsx src\__tests__\ProfileCard.test.tsx
npm run lint
npm run build
```

- [ ] Include any directly modified routing test files in the same
  targeted Vitest invocation. Escalate to broader regression suites if
  targeted results reveal shared behavior changes.
- [ ] Start the API and SPA using their existing development commands.
  Verify successful responses and 401 behavior against the running API.
  Confirm OpenAPI includes the profile response and authentication
  requirement; inspect generated metadata rather than assuming it.
- [ ] In a browser, log in and confirm exact values and placement at
  desktop and narrow mobile widths. Check no horizontal overflow.
- [ ] Block only `/profile` and reload: confirm the inline error while
  items, timestamp, navigation, and logout remain usable.
- [ ] Block only `/api/demo`: confirm the profile remains visible.
- [ ] Clear the session and navigate directly to `/dashboard`: confirm
  the redirect and absence of profile content.
- [ ] Review the final diff for unrelated files and protected-path
  changes; leave pre-existing worktree changes untouched.

## Acceptance criteria traceability

| Issue criterion | Implementation | Required evidence |
| --- | --- | --- |
| 1: Valid JWT returns exact mock profile | Steps 1 and 3 | API success and client contract tests |
| 2: Missing/invalid token returns 401 | Steps 1 and 2 | Missing, invalid, expired token tests |
| 3: Card between items and timestamp | Steps 4 and 5 | DOM-order assertion and browser check |
| 4: Unauthenticated dashboard blocked | Step 5 | Redirect, no card, no requests test |
| 5: Profile failure preserves dashboard | Step 5 | Isolated failure and interaction tests |

## Completion criteria

- All five issue criteria have passing automated coverage.
- Confirmed independent-loading and inline-401 decisions are tested.
- New card styling uses SCSS/BEM and no excluded UI dependencies.
- Existing login, demo, users navigation, and logout behavior is preserved.
- Targeted tests, lint, build, and the manual checks above pass.
- Documentation reflects the shipped contract and mock-only behavior.
- No application changes are required merely to approve this plan.
