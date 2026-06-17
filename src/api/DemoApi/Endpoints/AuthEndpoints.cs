using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DemoApi.Models;
using Microsoft.IdentityModel.Tokens;

namespace DemoApi.Endpoints;

/// <summary>Maps the authentication endpoints (login).</summary>
public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/auth/login", (LoginRequest request, IConfiguration config) =>
        {
            if (request.Username != "admin" || request.Password != "admin")
            {
                return Results.Unauthorized();
            }

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, "admin"),
                new Claim(JwtRegisteredClaimNames.Name, "Admin"),
                new Claim("role", "admin")
            };

            var jwtKey = config["Jwt:Key"]!;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],
                audience: config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(int.Parse(config["Jwt:ExpiresInHours"]!)),
                signingCredentials: creds);

            return Results.Ok(new LoginResponse(
                new JwtSecurityTokenHandler().WriteToken(token),
                "Admin",
                "admin"));
        })
        .WithTags("Auth")
        .AllowAnonymous();

        return app;
    }
}
