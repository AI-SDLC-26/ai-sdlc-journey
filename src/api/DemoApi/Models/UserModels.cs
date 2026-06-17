namespace DemoApi.Models;

/// <summary>Lightweight user projection returned by the users listing endpoint.</summary>
public record UserSummaryResponse(string Name, string Role, string Status);
