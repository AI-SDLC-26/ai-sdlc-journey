using DemoApi.Models;

namespace DemoApi.Endpoints;

/// <summary>Maps the protected users listing endpoint.</summary>
public static class UsersEndpoints
{
    private static readonly UserSummaryResponse[] MockUsers =
    [
        new("Admin", "admin", "active"),
        new("Ana", "member", "active"),
        new("Marco", "member", "inactive")
    ];

    public static IEndpointRouteBuilder MapUsersEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users", (bool? empty) =>
        {
            if (empty is true)
            {
                return Results.Ok(Array.Empty<UserSummaryResponse>());
            }

            return Results.Ok(MockUsers);
        })
        .RequireAuthorization()
        .WithTags("Users");

        return app;
    }
}
