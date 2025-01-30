using HealthCareDomain.Entity.UserEntity;
using HealthCarePersistence;
using HealthCareApplication;
using HealthCarePersistence.DatabaseContext;
using Microsoft.AspNetCore.Identity;
using DotNetEnv;
using HealthCareInfrastructure;
using Microsoft.OpenApi.Models;
using HealthCareApi.Chathub;
using HealthCareApi.VideoCallHub;
using HealthCareApplication.AppointmentHub;


Env.Load(); // Load environment variables
var builder = WebApplication.CreateBuilder(args);


// Add controllers and configure JSON serialization options
builder.Services.AddControllers()

    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.MaxDepth = 64;
    });

builder.Services.AddSignalR(); // Adding SignalR services

// Register HttpClient for Dependency Injection
builder.Services.AddHttpClient();

// Register CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        corsBuilder => corsBuilder
        .WithOrigins("http://localhost:5173") // Add your frontend URL here
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});


// Add authorization and authentication
builder.Services.AddAuthorization();

// Register services from various layers
builder.Services.AddHealthCarePersistence(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureService();

// Configure Identity with application-specific user type and database context
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Register Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HealthCare API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Enter JWT with Bearer prefix",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Exception: {ex.Message}");
        throw; // Re-throw the exception to ensure it's not swallowed
    }
});

app.UseStaticFiles();
app.UseCors("AllowSpecificOrigin"); // Apply the CORS policy globally
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/hub");
app.MapHub<Appointmenthub>("/apppointmenthub");

app.MapHub<VideocallHub>("/videocallhub");

// Run the application
app.Run();
