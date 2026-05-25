## 1. Project Setup

- [ ] 1.1 Create the local demo solution with separate React SPA and ASP.NET Core API projects targeting .NET 10
- [ ] 1.2 Add shared local development configuration for ports, environment settings, and CORS origin
- [ ] 1.3 Add OpenAPI and typed-client generation wiring for the SPA-to-API contract

## 2. API Baseline

- [ ] 2.1 Implement the public health endpoint
- [ ] 2.2 Add Swagger UI with bearer token support for calling public and protected endpoints
- [ ] 2.3 Implement fixed `admin / admin` JWT login with 8-hour token lifetime
- [ ] 2.4 Implement a protected demo endpoint that returns in-memory demo data
- [ ] 2.5 Add API authentication, authorization, and local CORS configuration

## 3. SPA Baseline

- [ ] 3.1 Build the default main route that shows hello and a login button when unauthenticated
- [ ] 3.2 Build a protected authenticated route that shows Logged in {name} after successful login
- [ ] 3.3 Store the JWT in session storage and attach it to API requests
- [ ] 3.4 Render authenticated demo data from the protected API endpoint

## 4. Tests and Verification

- [ ] 4.1 Add API unit tests for health, login success/failure, and protected access
- [ ] 4.2 Add client-side unit tests for login state and protected request handling
- [ ] 4.3 Verify the local demo runs end-to-end without a database or cloud dependencies