using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

public class CookieTokenMiddleware
{
    private readonly RequestDelegate _next;

    public CookieTokenMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Check if the request has a cookie named "access_token"
        if (context.Request.Cookies.TryGetValue("accessToken", out var token))
        {
            // If the cookie exists, set it as a header for further processing
            context.Request.Headers["Authorization"] = $"Bearer {token}";
        }

        // Call the next middleware in the pipeline
        await _next(context);
    }
}