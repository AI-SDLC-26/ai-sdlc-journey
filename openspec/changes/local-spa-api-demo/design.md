## Context

This change is a local-only demo application composed of two independently running apps: a React SPA and an ASP.NET Core REST API on .NET 10. The demo must stay intentionally small, avoid any database dependency, and support a fixed `admin / admin` login secured by JWT for repeatable technology showcases.

## Goals / Non-Goals

**Goals:**
- Provide a minimal but real SPA + API architecture that runs locally.
- Support a public health check and a protected authenticated API path.
- Provide a browser-available Swagger page for interactive API exploration during demos.
- Use JWT bearer authentication for a fixed demo account.
- Provide clear unauthenticated and authenticated SPA routes for a simple demo narrative.
- Keep the implementation database-free and easy to reset.
- Keep the codebase small enough to be demo-friendly and testable with unit tests.

**Non-Goals:**
- Persistent storage, migrations, seed data, or ORM setup.
- Cloud deployment, infrastructure provisioning, or production hardening.
- Refresh tokens, role hierarchies, multi-user identity, or external identity providers.
- Background jobs, real-time messaging, or offline sync.

## Decisions

- **Split SPA and API into separate local apps** because the demo specifically benefits from showing a clean client/server boundary while staying simple to run locally. A single-host deployment was considered, but it hides the shape of a modern frontend-backend stack and makes the demo less illustrative.
- **Use JWT bearer auth instead of cookies** because the SPA and API run on different local origins and JWT keeps the integration straightforward. Cookie auth was considered, but it adds SameSite/CORS friction and is less convenient for a split demo setup.
- **Use fixed in-memory credentials and demo data** because the goal is a repeatable showcase, not user management. A database-backed user store was considered, but it adds setup cost with no value for this demo.
- **Expose a public health endpoint** so the audience can verify the API independently of login state. Health checks behind auth were considered, but a public endpoint is more useful for quick sanity checks during a demo.
- **Expose Swagger UI for local demos** so endpoints can be explored and invoked directly in the browser. Omitting Swagger was considered, but it reduces demo discoverability and slows manual verification.
- **Keep the SPA and API contract OpenAPI-driven** so the client can stay aligned with the API surface without manual duplication. A hand-written client was considered, but typed generation reduces drift and makes the demo easier to maintain.
- **Keep demo token persistence lightweight** by storing the access token in browser session storage. Pure in-memory storage was considered, but session storage survives page refreshes and is still bounded to the browser session.
- **Use route-level auth state in the SPA** with a public home page and a protected page that displays Logged in {name}. A single blended page was considered, but route separation makes the login transition obvious in a live demo.
- **Use repository-level ignore rules for generated artifacts** so local SPA and API build/debug outputs do not get committed. Relying on ad hoc developer discipline was considered, but a standard `.gitignore` is safer and repeatable.

## Risks / Trade-offs

- **Token theft via browser storage** → acceptable for a local demo, mitigated by keeping the app local-only and not using long-lived refresh tokens.
- **CORS or port mismatch during local startup** → mitigate with a small, explicit local dev configuration and documented startup order.
- **Demo state resets on restart** → acceptable by design because the application is intentionally stateless and database-free.
- **OpenAPI/client generation drift** → mitigate by making the generated client part of the normal local build or regeneration workflow.
- **Swagger auth confusion for protected endpoints** → mitigate by enabling bearer token support in Swagger UI and documenting quick usage in the demo notes.
- **JWT expiration during a live demo** → mitigate with an 8-hour lifetime and a simple login flow for re-authentication if needed.
- **Accidental commits of generated files (for example `bin`, `obj`, `dist`, `node_modules`)** → mitigate by adding explicit repository ignore patterns for SPA and API outputs.

## Migration Plan

Not applicable. This is a new local demo baseline with no existing data or production users to migrate.

## Open Questions

- None. The demo scope, authentication model, and deployment shape are already defined.