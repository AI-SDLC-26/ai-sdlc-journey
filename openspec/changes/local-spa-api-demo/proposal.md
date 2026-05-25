## Why

This change establishes a minimal local demo stack for showing a React SPA talking to an ASP.NET Core REST API without the overhead of a database or cloud deployment. It gives a fast, reliable baseline for technology showcasing while keeping the implementation small enough to understand in one sitting.

## What Changes

- Add a local-only React SPA and ASP.NET Core REST API split into separate apps.
- Add a public health endpoint for quick verification of the API.
- Add Swagger UI to browse and invoke the API endpoints from the browser during demos.
- Add JWT-based login for a fixed `admin / admin` account with an 8-hour token lifetime.
- Add a protected API surface for demo data and authenticated requests.
- Add explicit SPA route behavior for unauthenticated and authenticated states.
- Keep all demo state in memory with no database, migrations, or background jobs.
- Add unit tests for the authentication and core API behavior.
- Add repository-level ignore rules for common SPA and API build/debug artifacts to prevent accidental commits.

## Capabilities

### New Capabilities
- `demo-spa-api`: Minimal local React SPA plus .NET 10 REST API demo baseline, including health check, Swagger API page, fixed-account JWT auth, protected demo endpoints, and explicit auth-state SPA routes.

### Modified Capabilities


## Impact

- New React frontend project and ASP.NET Core API project.
- Swagger/OpenAPI UI configuration in the API for interactive browser-based calls.
- JWT authentication middleware and auth endpoints in the API.
- CORS configuration for local SPA-to-API calls.
- OpenAPI/typed client generation for the SPA.
- SPA route guard and page states for anonymous home versus authenticated page.
- Unit test projects for API behavior.
- Repository hygiene updates via `.gitignore` to exclude generated build outputs.