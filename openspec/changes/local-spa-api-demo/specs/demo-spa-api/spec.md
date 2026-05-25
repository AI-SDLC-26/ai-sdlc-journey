## ADDED Requirements

### Requirement: Local demo runs without a database
The system MUST run the demo with in-memory state only and MUST NOT require a database, migrations, or external persistence services.

#### Scenario: Start demo without persistence setup
- **WHEN** a developer starts the SPA and API locally
- **THEN** the demo starts successfully without configuring any database connection

#### Scenario: Restart clears demo state
- **WHEN** the API restarts
- **THEN** any in-memory demo state is reset

### Requirement: Public health endpoint
The API MUST expose a public health endpoint that can be called without authentication and returns a successful health response.

#### Scenario: Health check succeeds
- **WHEN** a client sends a request to the health endpoint
- **THEN** the API returns a successful response indicating the service is healthy

#### Scenario: Health check does not require login
- **WHEN** an unauthenticated client requests the health endpoint
- **THEN** the API responds successfully without requiring a JWT

### Requirement: Swagger UI supports local demo API exploration
The API MUST expose a Swagger UI page in local development that allows users to discover and invoke public and protected endpoints from the browser.

#### Scenario: Swagger page is reachable
- **WHEN** a user opens the Swagger route in a browser while the API is running locally
- **THEN** the API documentation page is displayed with the available endpoints

#### Scenario: Swagger can call protected endpoints
- **WHEN** a user provides a valid bearer token in the Swagger authorization control and invokes a protected endpoint
- **THEN** the request is authenticated and the protected endpoint responds successfully

### Requirement: Fixed admin login issues JWT
The API MUST authenticate the fixed demo account `admin / admin` and issue a JWT access token with an 8-hour lifetime.

#### Scenario: Admin logs in successfully
- **WHEN** a client submits the username `admin` and password `admin`
- **THEN** the API returns a JWT access token and basic user identity information

#### Scenario: Invalid credentials are rejected
- **WHEN** a client submits any username or password other than `admin / admin`
- **THEN** the API rejects the login request

### Requirement: Protected demo endpoint requires bearer token
The API MUST protect demo data endpoints with JWT bearer authentication and MUST reject requests that do not include a valid access token.

#### Scenario: Authenticated request succeeds
- **WHEN** a client sends a request to a protected demo endpoint with a valid bearer token
- **THEN** the API returns the requested demo data

#### Scenario: Unauthenticated request is rejected
- **WHEN** a client sends a request to a protected demo endpoint without a bearer token
- **THEN** the API rejects the request with an authorization failure

### Requirement: SPA consumes the API from a separate local origin
The SPA MUST call the API as a separate local application and MUST be able to authenticate, call protected endpoints, and display the returned demo data.

#### Scenario: User signs in from the SPA
- **WHEN** a user submits the fixed demo credentials in the SPA
- **THEN** the SPA obtains an access token from the API and can use it for subsequent requests

#### Scenario: User accesses protected content from the SPA
- **WHEN** a signed-in user opens the demo page in the SPA
- **THEN** the SPA calls the protected API endpoint and renders the returned data

### Requirement: SPA has explicit anonymous and authenticated routes
The SPA MUST expose a default anonymous main page and a protected authenticated page.

#### Scenario: Anonymous user sees welcome view
- **WHEN** a user opens the SPA without being authenticated
- **THEN** the SPA shows a default main page with a hello message and a login button

#### Scenario: Authenticated user sees logged-in route
- **WHEN** a user logs in successfully
- **THEN** the SPA navigates to the authenticated route and displays Logged in {name}

### Requirement: Repository ignores generated SPA and API artifacts
The repository MUST define ignore rules that exclude generated build and debug artifacts from both the SPA and API projects.

#### Scenario: API build artifacts are ignored
- **WHEN** API build outputs are produced locally (for example in `bin` and `obj` folders)
- **THEN** those generated files are excluded from version control by repository ignore rules

#### Scenario: SPA build artifacts are ignored
- **WHEN** SPA dependency and build outputs are produced locally (for example `node_modules` and `dist`)
- **THEN** those generated files are excluded from version control by repository ignore rules