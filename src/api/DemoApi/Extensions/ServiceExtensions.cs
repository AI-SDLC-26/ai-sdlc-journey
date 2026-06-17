using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

namespace DemoApi.Extensions;

/// <summary>Extension methods for registering cross-cutting services on the DI container.</summary>
public static class ServiceExtensions
{
    /// <summary>Registers JWT Bearer authentication using values from the <c>Jwt</c> configuration section.</summary>
    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services,
        IConfiguration config)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = config["Jwt:Issuer"],
                    ValidAudience = config["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(config["Jwt:Key"]!))
                };
            });

        services.AddAuthorization();

        return services;
    }

    /// <summary>Registers the CORS policy that allows the SPA origin.</summary>
    public static IServiceCollection AddSpaPolicy(
        this IServiceCollection services,
        string origin)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("SpaPolicy", policy =>
                policy.WithOrigins(origin)
                      .AllowAnyHeader()
                      .AllowAnyMethod());
        });

        return services;
    }

    /// <summary>Registers OpenAPI generation and the Scalar UI reference page.</summary>
    public static WebApplication MapApiDocumentation(this WebApplication app)
    {
        app.MapOpenApi();
        app.MapScalarApiReference(options =>
        {
            options.WithTitle("Demo API");
            options.Authentication = new ScalarAuthenticationOptions
            {
                PreferredSecuritySchemes = ["Bearer"]
            };
        });

        return app;
    }
}
