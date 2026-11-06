using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace DemoApi.Tests;

public class ProfileEndpointTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory = factory;
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Profile_WithValidToken_ReturnsHardcodedProfile()
    {
        var loginResponse = await _client.PostAsJsonAsync("/auth/login", new { username = "admin", password = "admin" });
        var loginJson = await loginResponse.Content.ReadFromJsonAsync<JsonElement>();
        var token = loginJson.GetProperty("token").GetString()!;

        using var request = new HttpRequestMessage(HttpMethod.Get, "/profile");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(3, json.EnumerateObject().Count());
        Assert.Equal("Nikola Tesla", json.GetProperty("name").GetString());
        Assert.Equal("Engineer", json.GetProperty("role").GetString());
        Assert.Equal(JsonValueKind.Number, json.GetProperty("age").ValueKind);
        Assert.Equal(86, json.GetProperty("age").GetInt32());
    }

    [Fact]
    public async Task Profile_WithoutToken_ReturnsUnauthorized()
    {
        var response = await _client.GetAsync("/profile");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Profile_WithMalformedToken_ReturnsUnauthorized()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/profile");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", "not-a-jwt");
        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Profile_WithExpiredToken_ReturnsUnauthorized()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/profile");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            CreateToken(DateTime.UtcNow.AddMinutes(-10)));
        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Profile_WithDifferentIdentityAndRole_ReturnsSameProfile()
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/profile");
        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            CreateToken(DateTime.UtcNow.AddMinutes(30), "Different User", "viewer"));
        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("Nikola Tesla", json.GetProperty("name").GetString());
        Assert.Equal("Engineer", json.GetProperty("role").GetString());
        Assert.Equal(86, json.GetProperty("age").GetInt32());
    }

    [Fact]
    public async Task Profile_OpenApiDocumentsResponseAndBearerRequirement()
    {
        var document = await _client.GetFromJsonAsync<JsonElement>("/openapi/v1.json");
        var profileOperation = document.GetProperty("paths").GetProperty("/profile").GetProperty("get");

        Assert.True(profileOperation.GetProperty("responses").TryGetProperty("200", out _));
        Assert.True(profileOperation.GetProperty("responses").TryGetProperty("401", out _));
        Assert.Equal("ProfileResponse", profileOperation
            .GetProperty("responses")
            .GetProperty("200")
            .GetProperty("content")
            .GetProperty("application/json")
            .GetProperty("schema")
            .GetProperty("$ref")
            .GetString()?
            .Split('/')
            .Last());
        Assert.Equal("Bearer", profileOperation
            .GetProperty("security")[0]
            .EnumerateObject()
            .First()
            .Name);
        Assert.Equal("http", document
            .GetProperty("components")
            .GetProperty("securitySchemes")
            .GetProperty("Bearer")
            .GetProperty("type")
            .GetString());
    }

    private string CreateToken(DateTime expiresAt, string name = "Other User", string role = "viewer")
    {
        var configuration = _factory.Services.GetRequiredService<IConfiguration>();
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, "other-user"),
            new Claim(JwtRegisteredClaimNames.Name, name),
            new Claim("role", role)
        };
        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
