# Copilot Instructions — AI SDLC Journey

## Repository Overview

Full-stack demo for an AI-powered SDLC workflow presentation. Two independently runnable sub-projects:

- **`src/api/`** — ASP.NET Core 10 Minimal API (`DemoApi` + `DemoApi.Tests`)
- **`src/spa/`** — React 19 + TypeScript + Vite SPA

## Commands

### API

```bash
cd src/api/DemoApi
dotnet run                  # Start API at http://localhost:5000

cd src/api/DemoApi.Tests
dotnet test                 # Run all API tests
dotnet test --filter "Login_ValidCredentials_ReturnsToken"  # Run a single test by name
```

### SPA

```bash
cd src/spa
npm run dev                 # Start dev server at http://localhost:5173
npm run build               # Type-check + production build
npm run lint                # ESLint
npm test                    # Vitest (watch mode)
npm run fetch-api-spec      # Pull OpenAPI JSON from running local API into src/api-spec.json
```

## Architecture

The API is a **single-file Minimal API** (`Program.cs`). There are no controllers — all three endpoints (`GET /health`, `POST /auth/login`, `GET /api/demo`) are registered inline. Request/response types are defined as C# `record`s at the bottom of the same file.

The SPA uses **React Context for auth state**. The context definition (`auth-context.ts`) is separate from the provider component (`auth-context/AuthContext.tsx`). Auth state (JWT token, name, role) is persisted in `sessionStorage`, not `localStorage`. All API calls go through `src/api.ts`, which has the API base URL hardcoded to `http://localhost:5000`.

The SPA routing is two pages: `HomePage` (login form) and `DashboardPage` (protected, calls `/api/demo`).

## Key Conventions

### API
- All endpoints live in `Program.cs` — do not introduce controllers.
- JWT config (`Key`, `Issuer`, `Audience`, `ExpiresInHours`) and CORS origin come from `appsettings.json`.
- API tests use `WebApplicationFactory<Program>` (primary constructor pattern). Tests do **not** use Arrange/Act/Assert comments. Method names follow `Subject_Condition_ExpectedResult` pattern.

### SPA
- API functions (`login`, `fetchDemoData`) are all in `src/api.ts`.
- Auth context is split: `auth-context.ts` exports the raw context and `AuthState` type; `AuthContext.tsx` exports the `AuthProvider` component.
- No global state library — React Context only.

### OpenSpec Workflow
The `openspec/` directory contains spec-driven planning artifacts (specs, changes). `openspec/config.yaml` configures the schema. This is used for AI-assisted SDLC planning and is separate from application source code.

### Scoped Instruction Files
`.github/instructions/csharp.instructions.md` (applies to `**/*.cs`) and `.github/instructions/aspnet-rest-apis.instructions.md` (applies to `**/*.cs, **/*.json`) contain detailed C# and ASP.NET conventions. Copilot applies these automatically — refer to them for language-level style decisions.
