namespace DemoApi.Models;

/// <summary>Credentials payload for the login endpoint.</summary>
public record LoginRequest(string Username, string Password);

/// <summary>Successful login response containing the JWT and user info.</summary>
public record LoginResponse(string Token, string Name, string Role);
