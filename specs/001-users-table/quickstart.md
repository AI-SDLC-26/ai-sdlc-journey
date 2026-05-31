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
1. Trigger deterministic empty mode by calling users API with empty flag from the SPA integration path.
2. Re-open or refresh users page.
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

### Lint and build
```bash
cd src/spa
npm run lint
npm run build
```
