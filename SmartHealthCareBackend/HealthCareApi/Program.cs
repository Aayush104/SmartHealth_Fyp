using HealthCareDomain.Entity.UserEntity;
using HealthCarePersistence;
using HealthCareApplication;
using HealthCarePersistence.DatabaseContext;
using Microsoft.AspNetCore.Identity;
using DotNetEnv;
using HealthCareInfrastructure;
using Microsoft.OpenApi.Models;

Env.Load(); // Load environment variables
var builder = WebApplication.CreateBuilder(args);

// Add controllers and configure JSON serialization options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.MaxDepth = 64;
    });

// Register HttpClient for Dependency Injection
builder.Services.AddHttpClient();

// Register CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
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
app.UseStaticFiles();
app.UseCors("AllowAll"); // Apply the CORS policy globally
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Run the application
app.Run();
