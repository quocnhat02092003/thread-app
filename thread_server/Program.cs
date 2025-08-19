using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using thread_server.Data;
using thread_server.Hubs;
using thread_server.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddScoped<TokenService>();

builder.Services.AddSignalR();

//JWT Service
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.ContainsKey("accessToken"))
                {
                    context.Token = context.Request.Cookies["accessToken"];
                }
                return Task.CompletedTask;
            }
        };
    });

//SQL Service
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString),
        mySqlOptions =>
        {
            // Thêm retry policy cho Docker
            mySqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null
            );
        })
    );

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// ✅ Tự động chạy migrations khi startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();

        logger.LogInformation("🔄 Starting database migration...");

        // Retry logic cho migration
        var retryCount = 0;
        var maxRetries = 10;

        while (retryCount < maxRetries)
        {
            try
            {
                // Kiểm tra kết nối database
                await context.Database.CanConnectAsync();
                logger.LogInformation("✅ Database connection successful!");

                // Chạy migrations
                var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
                if (pendingMigrations.Any())
                {
                    logger.LogInformation($"📋 Found {pendingMigrations.Count()} pending migrations. Applying...");
                    await context.Database.MigrateAsync();
                    logger.LogInformation("✅ Database migrations applied successfully!");
                }
                else
                {
                    logger.LogInformation("✅ Database is up to date. No migrations needed.");
                }

                break; // Thành công, thoát khỏi loop
            }
            catch (Exception ex)
            {
                retryCount++;
                logger.LogWarning($"⚠️ Migration attempt {retryCount}/{maxRetries} failed: {ex.Message}");

                if (retryCount >= maxRetries)
                {
                    logger.LogError($"❌ Failed to apply migrations after {maxRetries} attempts. Error: {ex.Message}");
                    throw;
                }

                // Đợi trước khi retry (exponential backoff)
                var delay = TimeSpan.FromSeconds(Math.Pow(2, retryCount));
                logger.LogInformation($"⏳ Waiting {delay.TotalSeconds} seconds before retry...");
                await Task.Delay(delay);
            }
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "❌ An error occurred while migrating the database.");

        // Có thể comment dòng throw này nếu muốn app vẫn chạy khi migration fail
        throw;
    }
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

// app.UseMiddleware<CookieTokenMiddleware>();

app.MapHub<PostHub>("/postHub");
app.MapHub<NotificationsHub>("/notificationsHub");

app.MapStaticAssets();

app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();