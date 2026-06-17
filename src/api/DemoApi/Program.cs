using DemoApi.Endpoints;
using DemoApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddJwtAuthentication(builder.Configuration)
    .AddSpaPolicy(builder.Configuration["Cors:SpaOrigin"]!)
    .AddOpenApi();

var app = builder.Build();

app.MapApiDocumentation();
app.UseCors("SpaPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapHealthEndpoints();
app.MapAuthEndpoints();
app.MapDemoEndpoints();
app.MapUsersEndpoints();

app.Run();
