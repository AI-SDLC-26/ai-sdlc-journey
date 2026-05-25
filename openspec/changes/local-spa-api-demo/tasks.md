## 1. Project Setup

- [x] 1.1 Create the local demo solution with separate React SPA and ASP.NET Core API projects targeting .NET 10
- [x] 1.2 Add shared local development configuration for ports, environment settings, and CORS origin
- [x] 1.3 Add OpenAPI and typed-client generation wiring for the SPA-to-API contract

## 2. API Baseline

- [x] 2.1 Implement the public health endpoint
- [x] 2.2 Add Swagger UI with bearer token support for calling public and protected endpoints
- [x] 2.3 Implement fixed `admin / admin` JWT login with 8-hour token lifetime
- [x] 2.4 Implement a protected demo endpoint that returns in-memory demo data
- [x] 2.5 Add API authentication, authorization, and local CORS configuration

## 3. SPA Baseline

- [x] 3.1 Build the default main route that shows hello and a login button when unauthenticated
- [x] 3.2 Build a protected authenticated route that shows Logged in {name} after successful login
- [x] 3.3 Store the JWT in session storage and attach it to API requests
- [x] 3.4 Render authenticated demo data from the protected API endpoint

## 4. Tests and Verification

- [x] 4.1 Add API unit tests for health, login success/failure, and protected access
- [x] 4.2 Add client-side unit tests for login state and protected request handling
- [x] 4.3 Verify the local demo runs end-to-end without a database or cloud dependencies

## 5. Repository Hygiene

- [x] 5.1 Add repository ignore rules for common SPA and API generated build/debug files (for example `node_modules`, `dist`, `bin`, and `obj`)