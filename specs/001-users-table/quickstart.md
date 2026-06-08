# Quickstart: Show Users Table

## Prerequisites
- .NET 10 SDK installed
- Node.js 20+ and npm installed

## Run the API
```bash
cd src/api/DemoApi
dotnet restore
dotnet run
```
API default URL: `http://localhost:5000`

## Run the SPA
```bash
cd src/spa
npm install
npm run dev
```
SPA default URL: `http://localhost:5173`

## Demo Validation Flow
1. Open SPA home page.
2. Sign in with demo credentials (`admin` / `admin`).
3. Navigate to `/users` using in-app navigation.
4. Confirm native table renders Name, Role, Status columns with user rows.
5. Refresh `/users` and confirm rows are still returned from default mock data behavior.

## Empty-State Validation
1. Open `/users?empty=true` after logging in.
2. Re-open or refresh users page with the same query.
3. Confirm exact text `No available users` is displayed.

## Authorization Validation
1. Sign out.
2. Navigate directly to `/users`.
3. Confirm redirect to `/` and protected users content is not displayed.

## Quality Gate Commands
### API tests
```bash
cd src/api/DemoApi.Tests
dotnet test
```

### SPA tests
```bash
cd src/spa
npm test
```

If your environment has worker-thread startup issues with Vitest, use:

```bash
cd src/spa
npm test -- --run --pool=forks
```

### Lint and build
```bash
cd src/spa
npm run lint
npm run build
```

## Quality-Gate Validation Notes
- Date: 2026-05-31
- API tests: `dotnet test` in `src/api/DemoApi.Tests` passed (9/9)
- SPA tests: `npm test -- --run --pool=forks` in `src/spa` passed (13/13)
- SPA lint: `npx eslint src` in `src/spa` passed
- SPA build: `npm run build` in `src/spa` passed
