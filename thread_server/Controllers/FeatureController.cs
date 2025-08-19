using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using thread_server.Data;
using thread_server.Hubs;
namespace thread_server.Controllers;

[Route("/api/[controller]")]
[ApiController]

public class FeatureController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<NotificationsHub> _notificationsHub;

    public FeatureController(ApplicationDbContext context, IHubContext<NotificationsHub> notificationsHub)
    {
        _context = context;
        _notificationsHub = notificationsHub;
    }

    [HttpGet("profile/{username}")]
    public async Task<IActionResult> GetFeature(string username)
    {
        if (string.IsNullOrEmpty(username))
        {
            return BadRequest("Username is required.");
        }

        Guid? currentUserId = null;
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (Guid.TryParse(userIdClaim, out var parsedUserId))
        {
            currentUserId = parsedUserId;
        }

        var userQuery = await _context.Users
        .Where(u => u.Username == username)
        .Select(u => new
        {
            u.Id,
            u.Username,
            u.Verified,
            isFollowing = currentUserId.HasValue && _context.Follows.Any(f => f.FollowerId == currentUserId && f.FollowingId == u.Id),
            u.AvatarURL,
            u.AnotherPath,
            u.Introduction,
            u.DisplayName,
            u.Follower,
            Post = u.Posts.Select(p => new
            {
                p.Id,
                p.Content,
                p.CreatedAt,
                p.UpdatedAt,
                p.Images,
                p.LikeCount,
                CommentCount = p.Comments.Count,
                p.ShareCount,
                p.ReupCount,
                IsLiked = currentUserId.HasValue && p.Likes.Any(l => l.UserId == currentUserId),
                p.Visibility,
                User = new
                {
                    isFollowing = currentUserId.HasValue && _context.Follows.Any(f => f.FollowerId == currentUserId && f.FollowingId == p.User.Id),
                    p.User.Id,
                    p.User.DisplayName,
                    p.User.AvatarURL,
                    p.User.Follower,
                    p.User.Introduction,
                    p.User.Verified,
                    p.User.Username,
                }
            }).ToList(),
        })
        .FirstOrDefaultAsync();

        if (userQuery == null)
        {
            return NotFound("User not found");
        }

        // gộp lại để trả về
        return Ok(userQuery);
    }

    [HttpGet("all-posts")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllPostsFromUser([FromQuery] int _page, [FromQuery] int _limit)
    {
        if (_page < 1 || _limit < 1)
        {
            return BadRequest("Invalid page or limit parameters.");
        }

        Guid? currentUserId = null;
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (Guid.TryParse(userIdClaim, out var parsedUserId))
        {
            currentUserId = parsedUserId;
        }

        var posts = await _context.Posts
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((_page - 1) * _limit)
            .Take(_limit)
            .Select(p => new
            {
                p.Id,
                p.Content,
                p.CreatedAt,
                p.UpdatedAt,
                p.Images,
                p.LikeCount,
                IsLiked = currentUserId.HasValue && p.Likes.Any(l => l.UserId == currentUserId.Value),
                CommentCount = p.Comments.Count,
                p.ShareCount,
                p.ReupCount,
                p.Visibility,
                User = new
                {
                    isFollowing = currentUserId.HasValue && _context.Follows.Any(f => f.FollowerId == currentUserId && f.FollowingId == p.User.Id),
                    p.User.Id,
                    p.User.DisplayName,
                    p.User.AvatarURL,
                    p.User.Username,
                    p.User.Verified,
                    p.User.Introduction,
                    p.User.Follower,
                }
            })
            .ToListAsync();

        if (posts == null || !posts.Any())
        {
            return NotFound("No posts found");
        }

        return Ok(posts);
    }

    [HttpGet("post/{postId}")]
    public async Task<IActionResult> GetPostById(string postId)
    {
        if (!Guid.TryParse(postId, out Guid postGuid))
        {
            return Unauthorized("ID bài viết không hợp lệ.");
        }

        Guid? currentUserId = null;
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (Guid.TryParse(userIdClaim, out var parsedUserId))
        {
            currentUserId = parsedUserId;
        }

        var post = await _context.Posts
            .Include(p => p.User)
            .Where(p => p.Id == postGuid)
            .Select(p => new
            {
                p.Id,
                p.Content,
                p.CreatedAt,
                p.UpdatedAt,
                p.Images,
                p.LikeCount,
                isFollowing = currentUserId.HasValue && _context.Follows.Any(f => f.FollowerId == currentUserId && f.FollowingId == p.User.Id),
                IsLiked = currentUserId.HasValue && p.Likes.Any(l => l.UserId == currentUserId.Value),
                CommentCount = p.Comments.Count,
                p.ShareCount,
                p.ReupCount,
                Comments = p.Comments.Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    c.UpdatedAt,
                    User = new
                    {
                        isFollowing = currentUserId.HasValue && _context.Follows.Any(f => f.FollowerId == currentUserId && f.FollowingId == c.User.Id),
                        c.User.Id,
                        c.User.DisplayName,
                        c.User.AvatarURL,
                        c.User.Username,
                        c.User.Verified,
                        c.User.Introduction,
                        c.User.Follower
                    }
                }).ToList(),
                p.Visibility,
                User = new
                {
                    p.User.Id,
                    p.User.DisplayName,
                    p.User.AvatarURL,
                    p.User.Username,
                    p.User.Verified,
                    p.User.Introduction,
                    p.User.Follower
                }
            })
            .FirstOrDefaultAsync();

        if (post == null)
        {
            return NotFound("Post not found");
        }

        return Ok(post);
    }

    [HttpGet("is-liked-post")]
    [Authorize]
    public async Task<IActionResult> IsLikedPost()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("You must be logged in to check if a post is liked.");
        }

        var isLiked = await _context.PostLikes.Where(pl => pl.UserId == Guid.Parse(userId)).Select(pl => pl.PostId.ToString()).ToListAsync();
        return Ok(isLiked);
    }

    [HttpGet("following-ids")]
    [Authorize]
    public async Task<IActionResult> GetFollowingIds()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
            return Unauthorized("You must be logged in to get following IDs.");

        var ids = await _context.Follows
            .Where(f => f.FollowerId == Guid.Parse(userId))
            .Select(f => f.FollowingId.ToString())
            .ToListAsync();

        return Ok(ids);
    }

    //Follow user
    [HttpPost("follow/{userId}")]
    [Authorize]
    public async Task<IActionResult> FollowUser(string userId)
    {
        // Validate userId format
        if (!Guid.TryParse(userId, out Guid userGuid))
        {
            return BadRequest("Invalid user ID format.");
        }

        // Get current user ID
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == null)
        {
            return Unauthorized("You must be logged in to follow users.");
        }

        if (!Guid.TryParse(currentUserId, out Guid currentUserGuid))
        {
            return BadRequest("Invalid current user ID.");
        }

        // Check if trying to follow yourself
        if (userGuid == currentUserGuid)
        {
            return BadRequest("You cannot follow yourself.");
        }

        //Check information current user
        var currentUser = await _context.Users.FindAsync(currentUserGuid);
        if (currentUser == null)
        {
            return NotFound("Current user not found.");
        }

        // Check if target user exists
        var targetUser = await _context.Users.FindAsync(userGuid);
        if (targetUser == null)
        {
            return NotFound("User not found.");
        }

        var existing = await _context.Follows
            .AnyAsync(f => f.FollowerId == currentUserGuid && f.FollowingId == userGuid);

        if (existing)
            return BadRequest("Already following.");

        _context.Follows.Add(new Follow
        {
            FollowerId = currentUserGuid,
            FollowingId = userGuid,
            CreatedAt = DateTime.UtcNow
        });

        targetUser.Follower += 1; // Increment follower count

        var newNotificationFollow = new Notification
        {
            SenderId = currentUserGuid,
            ReceiverId = userGuid,
            Type = NotificationType.Follow,
            Content = " đã theo dõi bạn.",
            CreatedAt = DateTime.UtcNow,
        };
        _context.Notifications.Add(newNotificationFollow);
        await _context.SaveChangesAsync();


        await _notificationsHub.Clients.User(userGuid.ToString()).SendAsync("SendNotification", new
        {
            id = newNotificationFollow.Id,
            type = newNotificationFollow.Type,
            content = newNotificationFollow.Content,
            postPreview = newNotificationFollow.PostPreview,
            createdAt = newNotificationFollow.CreatedAt,
            isRead = newNotificationFollow.IsRead,
            user = new
            {
                displayName = currentUser.DisplayName,
                username = currentUser.Username,
                avatarURL = currentUser.AvatarURL
            }
        });

        await _context.SaveChangesAsync();

        return Ok(new { message = "Followed successfully.", isFollowing = true });
    }

    //Unfollow user
    [HttpDelete("follow/{userId}")]
    [Authorize]
    public async Task<IActionResult> UnfollowUser(string userId)
    {
        // Validate userId format
        if (!Guid.TryParse(userId, out Guid userGuid))
        {
            return BadRequest("Invalid user ID format.");
        }

        // Get current user ID
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == null)
        {
            return Unauthorized("You must be logged in to follow users.");
        }

        if (!Guid.TryParse(currentUserId, out Guid currentUserGuid))
        {
            return BadRequest("Invalid current user ID.");
        }

        // Check if trying to follow yourself
        if (userGuid == currentUserGuid)
        {
            return BadRequest("You cannot follow yourself.");
        }

        // Check if target user exists
        var targetUser = await _context.Users.FindAsync(userGuid);
        if (targetUser == null)
        {
            return NotFound("User not found.");
        }

        targetUser.Follower = Math.Max(0, targetUser.Follower - 1);

        var follow = await _context.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == currentUserGuid && f.FollowingId == userGuid);

        if (follow == null)
            return NotFound("Not following this user.");

        var existingFollowNotification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.SenderId == currentUserGuid && n.ReceiverId == userGuid && n.Type == NotificationType.Follow);
        if (existingFollowNotification != null)
        {
            _context.Notifications.Remove(existingFollowNotification);
        }

        _context.Follows.Remove(follow);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Unfollowed successfully.", isFollowing = false });
    }

}