using HealthCareDomain.Entity.UserEntity;

using HealthCarePersistence;
using HealthCareApplication;

using HealthCarePersistence.DatabaseContext;
using Microsoft.AspNetCore.Identity;
using DotNetEnv;
using HealthCareInfrastructure;



Env.Load();
var builder = WebApplication.CreateBuilder(args);



builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {

        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
      
        options.JsonSerializerOptions.MaxDepth = 64;
    });


builder.Services.AddHttpClient(); // Register HttpClient for Dependency Injection

//Services Regsitrations 
builder.Services.AddHealthCarePersistence(builder.Configuration);
builder.Services.AddApplicationServices();  
builder.Services.AddInfrastructureService();

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
             .AddEntityFrameworkStores<AppDbContext>()
             .AddDefaultTokenProviders();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
