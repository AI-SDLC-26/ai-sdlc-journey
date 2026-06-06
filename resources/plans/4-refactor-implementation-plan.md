# Refactor Plan: `Program.cs` Decomposition

## Current State

All API logic lives in a single `Program.cs` (~130 lines): JWT config extraction, mock data, service registration, middleware pipeline, 4 endpoint handlers, and 3 record types.

## Target State

A clean `Program.cs` that only orchestrates the application startup — delegating service registration, middleware configuration, and route mapping to dedicated, focused files.

---

## Why Break Up `Program.cs`?

The current single-file structure works fine at small scale, but violates the **Single Responsibility Principle (SRP)**: `Program.cs` currently owns service registration, security config, CORS config, OpenAPI config, 4 endpoint implementations, and data model definitions all at once.

As the API grows, this becomes a maintenance problem:
- **Merge conflicts** are more frequent because unrelated changes land in the same file
- **Discoverability suffers** — a new developer has no obvious place to look for "where is the users endpoint?"
- **Testability is limited** — endpoint logic inlined in lambdas cannot be unit-tested in isolation
- **Reuse is impossible** — service registration patterns can't be shared or composed

The ASP.NET Minimal API pattern explicitly supports extension methods on `IEndpointRouteBuilder` and `IServiceCollection` to keep `Program.cs` slim. This refactor adopts that convention.

---

## Affected Files

| File | Change Type | Notes |
|------|-------------|-------|
| `Program.cs` | Modify | Reduced to orchestration only |
| `Models/AuthModels.cs` | Create | `LoginRequest`, `LoginResponse` records |
| `Models/UserModels.cs` | Create | `UserSummaryResponse` record |
| `Endpoints/AuthEndpoints.cs` | Create | `POST /auth/login` handler |
| `Endpoints/DemoEndpoints.cs` | Create | `GET /api/demo` handler |
| `Endpoints/UsersEndpoints.cs` | Create | `GET /api/users` handler |
| `Endpoints/HealthEndpoints.cs` | Create | `GET /health` handler |
| `Extensions/ServiceExtensions.cs` | Create | JWT, CORS, OpenAPI registration |

---

## Execution Plan

### Phase 1 — Models

**Goal:** Extract the `record` types out of `Program.cs` first, before touching any logic.

Records are the safest thing to move because they have no behavior — they're pure data shapes. Moving them first means the compiler will immediately tell us if anything else breaks, giving us a clean baseline before we touch endpoint logic.

- [ ] Create `Models/AuthModels.cs` with `LoginRequest` and `LoginResponse`
- [ ] Create `Models/UserModels.cs` with `UserSummaryResponse`
- [ ] Remove the record declarations from the bottom of `Program.cs`
- [ ] Verify: `dotnet build` — all references resolve correctly

### Phase 2 — Endpoint classes

**Goal:** Move each endpoint handler into its own static class using the `IEndpointRouteBuilder` extension method pattern.

The pattern looks like this:

```csharp
// Endpoints/HealthEndpoints.cs
public static class HealthEndpoints
{
    public static IEndpointRouteBuilder MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/health", () => Results.Ok(new { status = "healthy" }))
           .WithTags("Health");
        return app;
    }
}
```

This pattern is the idiomatic Minimal API way to group related routes. It keeps `Program.cs` readable as a table of contents (`app.MapHealthEndpoints(); app.MapAuthEndpoints(); ...`) rather than a wall of implementation details.

- [ ] Create `Endpoints/HealthEndpoints.cs`
- [ ] Create `Endpoints/AuthEndpoints.cs` (receives `IConfiguration` or typed options via DI)
- [ ] Create `Endpoints/DemoEndpoints.cs`
- [ ] Create `Endpoints/UsersEndpoints.cs`
- [ ] Verify: `dotnet build` passes

### Phase 3 — Service extensions

**Goal:** Move `builder.Services.Add*` calls into named extension methods on `IServiceCollection`.

Currently, `Program.cs` contains ~20 lines of JWT Bearer setup, ~8 lines of CORS setup, and OpenAPI setup. Each of these is a distinct concern. Grouping them into named extension methods (`AddJwtAuthentication`, `AddSpaPolicy`, `AddApiDocumentation`) means:
- `Program.cs` reads like a checklist of what the app does, not how it does it
- Configuration concerns are co-located with the code that uses them
- Changes to CORS policy don't require scrolling through JWT code

```csharp
// Extensions/ServiceExtensions.cs
public static class ServiceExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration config) { ... }
    public static IServiceCollection AddSpaPolicy(this IServiceCollection services, string origin) { ... }
}
```

- [ ] Create `Extensions/ServiceExtensions.cs` with `AddJwtAuthentication`, `AddSpaPolicy`, `AddApiDocumentation`
- [ ] Verify: `dotnet build` passes

### Phase 4 — Slim down `Program.cs`

**Goal:** Replace all inline logic in `Program.cs` with calls to the new extension methods.

The final `Program.cs` should read like a configuration manifest — easy to scan and understand in under 30 seconds. A reader should be able to tell what the app does without knowing how anything is implemented.

- [ ] Replace inline service registrations with `builder.Services.AddJwtAuthentication(...)`, etc.
- [ ] Replace inline `app.MapGet/Post` calls with `app.MapHealthEndpoints()`, etc.
- [ ] Verify: `dotnet build` passes and `dotnet test` is all green

---

## Rollback Plan
1. The original `Program.cs` is preserved in git — `git checkout src/api/DemoApi/Program.cs` restores it instantly
2. All new files added in Phases 1–3 are additive and do not change behavior, so they can be deleted at any point before Phase 4 is applied without risk

## Risks

- **`WebApplicationFactory<Program>`** in tests references the `Program` class by name. This stays valid as long as `Program.cs` remains the entry point (it will — top-level statements still compile to a `Program` class).
- **JWT config locals** are currently captured as top-level variables. When moved into endpoint/extension classes, they must be obtained from injected `IConfiguration` or from typed options (see Improvement #1 below).

---

## Additional Improvement Opportunities

### #1 — Strongly-typed configuration via `IOptions<T>` *(High impact)*

#### The Problem

The current code reads JWT settings like this:

```csharp
var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtExpiresHours = int.Parse(builder.Configuration["Jwt:ExpiresInHours"]!);
```

This has several issues:
- The `!` (null-forgiving) operator suppresses the compiler's null warning but does nothing at runtime — if `Jwt:Key` is missing, you get a `NullReferenceException` or an empty string being used as a signing key with no clear error message
- `int.Parse(...)` throws a `FormatException` if the value is missing or malformed — again with no helpful context
- The config key string `"Jwt:Key"` is duplicated across the codebase (here and potentially in tests), making it fragile to rename
- There is no IDE support: you can't `F12` to see what properties are available

#### The Solution

Register a strongly-typed POCO using ASP.NET's Options pattern with startup validation:

```csharp
// Settings/JwtSettings.cs
public sealed class JwtSettings
{
    [Required] public string Key { get; init; } = "";
    [Required] public string Issuer { get; init; } = "";
    [Required] public string Audience { get; init; } = "";
    public int ExpiresInHours { get; init; } = 1;
}

// In ServiceExtensions.cs (or Program.cs):
builder.Services
    .AddOptions<JwtSettings>()
    .BindConfiguration("Jwt")
    .ValidateDataAnnotations()
    .ValidateOnStart(); // fail fast at startup, not at first request
```

#### Why This Matters

- **Fail-fast at startup:** if `Jwt:Key` is missing in production, the app refuses to start with a clear error — instead of silently accepting tokens with a broken key
- **Refactor-safe:** rename `Key` in one place and the compiler tells you everywhere it's used
- **Testable:** in unit tests you can construct a `JwtSettings` directly with `new JwtSettings { Key = "test-key", ... }` instead of mocking `IConfiguration`
- **IDE-friendly:** full IntelliSense, go-to-definition, and rename support

---

### #2 — Extract JWT token generation into a `TokenService` *(Medium-high impact)*

#### The Problem

The `JwtSecurityToken` construction is inlined inside the login endpoint lambda:

```csharp
app.MapPost("/auth/login", (LoginRequest request) =>
{
    // ... validate credentials ...
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var token = new JwtSecurityToken(issuer: ..., audience: ..., ...);
    return Results.Ok(new LoginResponse(new JwtSecurityTokenHandler().WriteToken(token), ...));
});
```

This has two structural problems:

1. **It cannot be unit-tested.** To test that the generated token contains the correct claims, you must fire an HTTP request through the full web stack via `WebApplicationFactory`. That is an integration test — slow, heavy, and brittle. Token generation is pure business logic that should be testable with a simple `new TokenService(...).GenerateToken(user)` call.

2. **It cannot be reused.** If the API later adds a refresh-token endpoint, an OAuth callback, or a "login as" admin feature, the token generation code must be copy-pasted. Copy-paste is how security bugs spread.

#### The Solution

Extract to a service with a focused interface:

```csharp
// Services/ITokenService.cs
public interface ITokenService
{
    string GenerateToken(string username, string name, string role);
}

// Services/TokenService.cs
public sealed class TokenService(IOptions<JwtSettings> options) : ITokenService
{
    public string GenerateToken(string username, string name, string role)
    {
        var settings = options.Value;
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, username),
            new Claim(JwtRegisteredClaimNames.Name, name),
            new Claim("role", role)
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: settings.Issuer,
            audience: settings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(settings.ExpiresInHours),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

The login endpoint then becomes a thin orchestrator:

```csharp
app.MapPost("/auth/login", (LoginRequest req, ITokenService tokens) =>
{
    if (req.Username != "admin" || req.Password != "admin")
        return Results.Unauthorized();

    var token = tokens.GenerateToken("admin", "Admin", "admin");
    return Results.Ok(new LoginResponse(token, "Admin", "admin"));
});
```

#### Why This Matters

- **Unit-testable in isolation:** `TokenService` tests run in milliseconds without any HTTP infrastructure
- **Single source of truth for token shape:** all token-generating paths go through one class; changing claim names or the signing algorithm is a one-line change
- **Open/Closed Principle:** adding a new login strategy (e.g., OAuth, LDAP) means adding a new caller of `ITokenService`, not modifying existing token logic
- **Interface as seam:** in tests that exercise the login endpoint, `ITokenService` can be replaced with a fake that returns a fixed token string, removing the JWT dependency from those tests entirely
