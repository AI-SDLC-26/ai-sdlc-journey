namespace DemoApi.Endpoints;

/// <summary>Maps the public health-check endpoint.</summary>
public static class HealthEndpoints
{
    public static IEndpointRouteBuilder MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/health", () => Results.Ok(new { status = "healthy" }))
           .WithTags("Health");

        return app;
    }
}
