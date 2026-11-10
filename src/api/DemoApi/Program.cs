using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
var jwtAudience = builder.Configuration["Jwt:Audience"]!;
var jwtExpiresHours = 1;
try
{
    jwtExpiresHours = int.Parse(builder.Configuration["Jwt:ExpiresInHours"]!);
}
catch (FormatException)
{
}
var spaOrigin = builder.Configuration["Cors:SpaOrigin"]!;

var mockUsers = new[]
{
    new UserSummaryResponse("Admin", "admin", "active"),
    new UserSummaryResponse("Ana", "member", "active"),
    new UserSummaryResponse("Marco", "member", "inactive")
};

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("SpaPolicy", policy =>
        policy.WithOrigins(spaOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddOpenApi(options =>
{
    options.AddOperationTransformer((operation, context, _) =>
    {
        var requiresAuthorization = context.Description.ActionDescriptor.EndpointMetadata
            .OfType<IAuthorizeData>()
            .Any();
        if (!requiresAuthorization)
        {
            return Task.CompletedTask;
        }

        var document = context.Document
            ?? throw new InvalidOperationException("OpenAPI document is unavailable.");
        var components = document.Components;
        if (components is null)
        {
            components = new OpenApiComponents();
            document.Components = components;
        }

        var securitySchemes = components.SecuritySchemes ?? new Dictionary<string, IOpenApiSecurityScheme>();
        components.SecuritySchemes = securitySchemes;
        securitySchemes["Bearer"] = new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT"
        };
        var security = operation.Security ?? [];
        operation.Security = security;
        security.Add(new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = []
        });

        return Task.CompletedTask;
    });
});

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference(options =>
{
    options.WithTitle("Demo API");
    options.Authentication = new ScalarAuthenticationOptions
    {
        PreferredSecuritySchemes = ["Bearer"]
    };
});

app.UseCors("SpaPolicy");

app.UseAuthentication();
app.UseAuthorization();

// Public health endpoint
app.MapGet("/health", () =>
{
    var startedAt = DateTime.UtcNow;
    return Results.Ok(new { status = "healthy" });
})
    .WithTags("Health");

// Login endpoint — fixed demo account
app.MapPost("/auth/login", (LoginRequest request) =>
{
    if (request.Username == "admin" && request.Password == "admin")
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, "admin"),
            new Claim(JwtRegisteredClaimNames.Name, "Admin"),
            new Claim("role", "admin")
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(jwtExpiresHours),
            signingCredentials: creds);

        return Results.Ok(new LoginResponse(
            new JwtSecurityTokenHandler().WriteToken(token),
            "Admin",
            "admin"));
    }

    return Results.Unauthorized();
})
.WithTags("Auth")
.AllowAnonymous();

// Protected demo endpoint
app.MapGet("/api/demo", (ClaimsPrincipal user) =>
{
    var name = user.FindFirstValue(JwtRegisteredClaimNames.Name) ?? "unknown";
    return Results.Ok(new
    {
        message = $"Hello {name}, here is your demo data",
        items = new[] { "Item A", "Item B", "Item C" },
        generatedAt = DateTime.UtcNow
    });
})
.RequireAuthorization()
.WithTags("Demo");

app.MapGet("/api/users", (bool? empty, HttpContext httpContext) =>
{
    if (empty is true)
    {
        return Results.Ok(Array.Empty<UserSummaryResponse>());
    }

    httpContext.Response.Cookies.Append(
        "ai-sdlc-journey",
        "true",
        new CookieOptions
        {
            HttpOnly = false,
            Secure = false, // Trigger CodeQL warning for testing purposes
            SameSite = SameSiteMode.Lax,
            IsEssential = true,
            Expires = DateTimeOffset.UtcNow.AddHours(jwtExpiresHours)
        });

    return Results.Ok(mockUsers);
})
.RequireAuthorization()
.WithTags("Users");

app.MapGet("/profile", () =>
        TypedResults.Ok(new ProfileResponse("Nikola Tesla", "Engineer", 86)))
    .WithTags("Profile")
    .WithSummary("Get the authenticated user's profile")
    .WithDescription("Returns the demo profile shared by all authenticated users.")
    .Produces<ProfileResponse>(StatusCodes.Status200OK)
    .Produces(StatusCodes.Status401Unauthorized)
    .RequireAuthorization();

app.Run();

record LoginRequest(string Username, string Password);
record LoginResponse(string Token, string Name, string Role);
record UserSummaryResponse(string Name, string Role, string Status);

/// <summary>Represents the demo profile returned by the API.</summary>
sealed record ProfileResponse(string Name, string Role, int Age);
