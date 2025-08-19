using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using thread_server.Data;
using thread_server.Hubs;
using thread_server.Models;

namespace thread_server.Controllers;


[Route("/api/[controller]")]
[ApiController]

public class PostController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<PostHub> _postHub;
    private readonly IHubContext<NotificationsHub> _notificationsHub;

    public PostController(ApplicationDbContext context, IHubContext<PostHub> postHub, IHubContext<NotificationsHub> notificationsHub)
    {
        _context = context;
        _postHub = postHub;
        _notificationsHub = notificationsHub;
    }

    // Upload post
    [HttpPost("upload")]
    [Authorize]
    public async Task<IActionResult> PostUpload(PostUploadRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.Content) || request.UserId == null)
        {
            return BadRequest("Invalid post data.");
        }

        if (!Guid.TryParse(request.UserId, out var userId))
            return BadRequest("ID người dùng không hợp lệ.");

        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        var post = new Post
        {
            Content = request.Content,
            Images = request.Images,
            Visibility = request.Visibility,
            UserId = user.Id
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        var result = await _context.Posts.Where(p => p.Id == post.Id).Include(p => p.User).Select(p => new
        {
            p.Id,
            p.Content,
            p.CreatedAt,
            p.UpdatedAt,
            p.Images,
            p.LikeCount,
            IsLiked = p.Likes.Any(l => l.UserId == userId),
            CommentCount = p.Comments.Count,
            p.ShareCount,
            p.ReupCount,
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

        return Ok(result);
    }

    //Like or unlike post with postId
    [HttpPost("like/{postId}")]
    [Authorize]
    public async Task<IActionResult> LikePost(Guid postId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized("You must be logged in to like posts.");

        var post = await _context.Posts.Include(p => p.Likes).FirstOrDefaultAsync(p => p.Id == postId);

        if (post == null) return NotFound("Post not found.");

        var guidUserId = Guid.Parse(userId);
        var existingLike = post.Likes.FirstOrDefault(l => l.UserId == guidUserId);

        if (existingLike == null)
        {
            var newLike = new PostLike
            {
                PostId = post.Id,
                UserId = guidUserId
            };
            _context.PostLikes.Add(newLike);
            post.LikeCount += 1;

            var newNotification = new Notification
            {
                SenderId = guidUserId,
                ReceiverId = post.UserId,
                PostId = post.Id,
                Type = NotificationType.Like,
                Content = " đã thích bài viết của bạn.",
                CreatedAt = DateTime.UtcNow,
                PostPreview = post.Content.Length > 100 ? post.Content.Substring(0, 100) + "..." : post.Content
            };
            _context.Notifications.Add(newNotification);
            await _context.SaveChangesAsync();

            var notificationWithSender = await _context.Notifications
            .Include(n => n.Sender)
            .FirstOrDefaultAsync(n => n.Id == newNotification.Id && n.SenderId == guidUserId);

            if (notificationWithSender != null)
            {
                await _notificationsHub.Clients.User(post.UserId.ToString()).SendAsync("SendNotification", new
                {
                    id = newNotification.Id,
                    type = newNotification.Type,
                    content = newNotification.Content,
                    postId = newNotification.PostId,
                    postPreview = newNotification.PostPreview,
                    createdAt = newNotification.CreatedAt,
                    isRead = newNotification.IsRead,
                    user = new
                    {
                        displayName = notificationWithSender.Sender.DisplayName,
                        username = notificationWithSender.Sender.Username,
                        avatarURL = notificationWithSender.Sender.AvatarURL
                    }
                });
            }
        }
        await _context.SaveChangesAsync();

        await _postHub.Clients.Group(post.Id.ToString()).SendAsync("PostLikedChanged", post.Id, post.LikeCount);

        return Ok(new { likeCount = post.LikeCount, isLiked = true });
    }

    [HttpDelete("unlike/{postId}")]
    [Authorize]
    public async Task<IActionResult> UnlikePost(Guid postId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized("You must be logged in to unlike posts.");

        var post = await _context.Posts.Include(p => p.Likes).FirstOrDefaultAsync(p => p.Id == postId);
        if (post == null) return NotFound("Post not found.");

        var guidUserId = Guid.Parse(userId);

        var existingLike = post.Likes.FirstOrDefault(l => l.UserId == guidUserId);

        if (existingLike != null)
        {
            _context.PostLikes.Remove(existingLike);
            post.LikeCount = Math.Max(0, post.LikeCount - 1);
        }

        var existingLikeNotification = await _context.Notifications.FirstOrDefaultAsync(n =>
            n.SenderId == guidUserId && n.ReceiverId == post.UserId && n.PostId == post.Id && n.Type == NotificationType.Like);

        if (existingLikeNotification != null)
        {
            _context.Notifications.Remove(existingLikeNotification);
        }

        await _context.SaveChangesAsync();

        await _postHub.Clients.Group(post.Id.ToString()).SendAsync("PostLikedChanged", post.Id, post.LikeCount);

        return Ok(new { likeCount = post.LikeCount, isLiked = false });
    }

    //Comment to a post with postId
    [HttpPost("comment/{postId}")]
    [Authorize]
    public async Task<IActionResult> CommentPost(Guid postId, [FromBody] string commentContent)
    {
        if (string.IsNullOrEmpty(commentContent))
        {
            return BadRequest("Comment content cannot be empty.");
        }

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();


        var post = await _context.Posts.Include(p => p.Comments).FirstOrDefaultAsync(p => p.Id == postId);
        if (post == null) return NotFound("Post not found.");

        var newComment = new Comment
        {
            Content = commentContent,
            PostId = post.Id,
            UserId = Guid.Parse(userId)
        };

        _context.Comments.Add(newComment);
        post.CommentCount += 1;

        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(Guid.Parse(userId));

        var newNotificationComment = new Notification
        {
            SenderId = Guid.Parse(userId),
            ReceiverId = post.UserId,
            PostId = post.Id,
            Type = NotificationType.Comment,
            Content = $" đã bình luận: \"{commentContent}\"",
            CreatedAt = DateTime.UtcNow,
            PostPreview = post.Content.Length > 100 ? post.Content.Substring(0, 100) + "..." : post.Content,
            IsRead = false
        };

        _context.Notifications.Add(newNotificationComment);
        await _context.SaveChangesAsync();

        await _notificationsHub.Clients.User(post.UserId.ToString()).SendAsync("SendNotification", new
        {
            id = newNotificationComment.Id,
            type = NotificationType.Comment,
            content = $" đã bình luận: \"{commentContent}\"",
            postId = post.Id,
            postPreview = post.Content.Length > 100 ? post.Content.Substring(0, 100) + "..." : post.Content,
            createdAt = DateTime.UtcNow,
            isRead = false,
            user = new
            {
                displayName = user.DisplayName,
                username = user.Username,
                avatarURL = user.AvatarURL
            }
        });

        await _postHub.Clients.Group(post.Id.ToString()).SendAsync("PostCommented", new
        {
            postId = post.Id,
            commentId = newComment.Id,
            commentContent = newComment.Content,
            commentCount = post.Comments.Count,
            parentCommentId = newComment.ParentCommentId,
            createdAt = newComment.CreatedAt,
            user = new
            {
                id = user.Id,
                displayName = user.DisplayName,
                username = user.Username,
                avatarURL = user.AvatarURL
            }
        });

        return Ok(new { commentId = newComment.Id, commentContent = newComment.Content, commentCount = post.Comments.Count });
    }
}

public class PostUploadRequest
{
    public string Content { get; set; }
    public List<string> Images { get; set; }
    public string Visibility { get; set; } // Public, Private, Friends
    public string UserId { get; set; } // ID of the user uploading the post
}
