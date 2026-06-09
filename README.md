# AI SDLC Journey

Local full-stack demo used for an AI-powered SDLC workflow presentation.

This repository contains:

- A minimal ASP.NET Core API with JWT authentication.
- A React + Vite SPA that logs in and calls a protected endpoint.
- Basic automated tests for both API and SPA.

## Tech Stack

- Backend: ASP.NET Core Minimal API (.NET 10), JWT Bearer auth, OpenAPI, Scalar
- Frontend: React 19, TypeScript, Vite, React Router
- Testing: - API: xUnit + WebApplicationFactory - SPA: Vitest + Testing Library

## Repository Layout

- `src/api/DemoApi`: API project
- `src/api/DemoApi.Tests`: API tests
- `src/spa`: React SPA
- `resources`: demo notes/materials
- `openspec`: spec-driven planning artifacts

## Prerequisites

- .NET SDK 10.0+
- Node.js 20+
- npm

## Run Locally

Use two terminals.

1. Start the API

```bash
cd src/api/DemoApi
dotnet restore
dotnet run
```

API default URL: `http://localhost:5000`

1. Start the SPA

```bash
cd src/spa
npm install
npm run dev
```

SPA default URL: `http://localhost:5173`

## Demo Credentials

- Username: `admin`
- Password: `admin`

## API Endpoints

- `GET /health` - Returns `{ "status": "healthy" }`
- `POST /auth/login` - Request body: `{ "username": "admin", "password": "admin"
    }` - Returns JWT token payload: `{ token, name, role }`
- `GET /api/demo` - Requires `Authorization: Bearer <token>` - Returns demo
    message, items, and generation timestamp
- `GET /api/users` - Requires `Authorization: Bearer <token>` - Returns
    predefined mock users on default calls - Supports `?empty=true` for
    deterministic empty-state validation

OpenAPI JSON: `http://localhost:5000/openapi/v1.json`

## Run Tests

API tests:

```bash
cd src/api/DemoApi.Tests
dotnet test
```

SPA tests:

```bash
cd src/spa
npm test
```

## Useful SPA Commands

From `src/spa`:

- `npm run dev` - start dev server
- `npm run build` - type-check and build
- `npm run lint` - run ESLint
- `npm run test` - run Vitest
- `npm run fetch-api-spec` - fetch OpenAPI JSON from local API

## Users Flow

- Sign in with demo credentials.
- Open `/users` to view the native HTML table with `Name`, `Role`, and `Status`
  columns.
- Open `/users?empty=true` to validate the exact empty-state message: `No
  available users`.
- If not authenticated, navigation to `/users` redirects to `/`.

## Configuration Notes

- CORS allows `http://localhost:5173` by default.
- JWT and CORS settings are in `src/api/DemoApi/appsettings.json`.
- Settings are meant for local demo use.
