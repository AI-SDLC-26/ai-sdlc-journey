using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace DemoApi.Tests;

public class HealthTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Health_ReturnsOk()
    {
        var response = await _client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Health_ReturnsHealthyStatus()
    {
        var response = await _client.GetAsync("/health");
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("healthy", json.GetProperty("status").GetString());
    }
}

public class AuthTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Login_ValidCredentials_ReturnsToken()
    {
        var response = await _client.PostAsJsonAsync("/auth/login", new { username = "admin", password = "admin" });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.False(string.IsNullOrEmpty(json.GetProperty("token").GetString()));
        Assert.Equal("Admin", json.GetProperty("name").GetString());
        Assert.Equal("admin", json.GetProperty("role").GetString());
    }

    [Fact]
    public async Task Login_InvalidCredentials_ReturnsUnauthorized()
    {
        var response = await _client.PostAsJsonAsync("/auth/login", new { username = "admin", password = "wrong" });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}

public class DemoEndpointTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Demo_WithoutToken_ReturnsUnauthorized()
    {
        var response = await _client.GetAsync("/api/demo");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Demo_WithToken_ReturnsData()
    {
        // Login first
        var loginResponse = await _client.PostAsJsonAsync("/auth/login", new { username = "admin", password = "admin" });
        var loginJson = await loginResponse.Content.ReadFromJsonAsync<JsonElement>();
        var token = loginJson.GetProperty("token").GetString()!;

        // Call protected endpoint
        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        var response = await _client.GetAsync("/api/demo");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.True(json.GetProperty("items").GetArrayLength() > 0);
    }
}
