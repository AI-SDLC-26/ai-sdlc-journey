using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace DemoApi.Tests;

public class UsersEndpointTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task Users_WithoutToken_ReturnsUnauthorized()
    {
        var response = await _client.GetAsync("/api/users");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Users_WithToken_ReturnsPredefinedMockUsers()
    {
        var token = await LoginAndGetTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.GetAsync("/api/users");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var users = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.True(users.ValueKind == JsonValueKind.Array);
        Assert.Equal(3, users.GetArrayLength());
        Assert.Equal("Admin", users[0].GetProperty("name").GetString());
        Assert.Equal("admin", users[0].GetProperty("role").GetString());
        Assert.Equal("active", users[0].GetProperty("status").GetString());
    }

    [Fact]
    public async Task Users_WithTokenAndEmptyQuery_ReturnsEmptyArray()
    {
        var token = await LoginAndGetTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.GetAsync("/api/users?empty=true");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var users = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.True(users.ValueKind == JsonValueKind.Array);
        Assert.Equal(0, users.GetArrayLength());
    }

    private async Task<string> LoginAndGetTokenAsync()
    {
        var loginResponse = await _client.PostAsJsonAsync("/auth/login", new { username = "admin", password = "admin" });
        var loginJson = await loginResponse.Content.ReadFromJsonAsync<JsonElement>();

        return loginJson.GetProperty("token").GetString()!;
    }
}
