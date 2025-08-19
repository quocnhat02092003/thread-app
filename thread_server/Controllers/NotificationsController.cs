using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using thread_server.Data;

[Route("/api/[controller]")]
[ApiController]

public class NotificationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NotificationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("get-notifications")]
    [Authorize]
    public async Task<IActionResult> GetNotifications()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var parsedUserId))
        {
            return BadRequest("Invalid user ID.");
        }

        var notifications = await _context.Notifications.Include(n => n.Sender)
            .Where(n => n.ReceiverId == parsedUserId).Select(n => new
            {
                n.Id,
                n.Content,
                n.Type,
                user = new
                {
                    n.Sender.DisplayName,
                    n.Sender.Username,
                    n.Sender.AvatarURL
                },
                n.IsRead,
                n.CreatedAt,
                n.PostPreview
            })
            .ToListAsync();

        return Ok(notifications);
    }

    [HttpPut("mark-as-read")]
    [Authorize]
    public async Task<IActionResult> MarkAsRead()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var parsedUserId))
        {
            return BadRequest("Invalid user ID.");
        }

        var notifications = await _context.Notifications
            .Where(n => n.ReceiverId == parsedUserId).ToListAsync();

        if (notifications == null || notifications.Count == 0)
        {
            return NotFound("No notifications found.");
        }

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
        }

        _context.Notifications.UpdateRange(notifications);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Notification marked as read." });
    }
}