using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace DemoApi.Endpoints;

/// <summary>Maps the protected demo data endpoint.</summary>
public static class DemoEndpoints
{
    public static IEndpointRouteBuilder MapDemoEndpoints(this IEndpointRouteBuilder app)
    {
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

        return app;
    }
}
