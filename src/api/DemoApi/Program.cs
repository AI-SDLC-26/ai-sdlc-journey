using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
var jwtAudience = builder.Configuration["Jwt:Audience"]!;
var jwtExpiresHours = int.Parse(builder.Configuration["Jwt:ExpiresInHours"]!);
var spaOrigin = builder.Configuration["Cors:SpaOrigin"]!;

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

builder.Services.AddOpenApi();

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
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }))
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

app.Run();

record LoginRequest(string Username, string Password);
record LoginResponse(string Token, string Name, string Role);
