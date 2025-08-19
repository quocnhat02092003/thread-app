using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace thread_server.Models;

public class User
{
    public Guid Id { get; set; }

    [Required]
    public string Username { get; set; }

    [Required]
    public string Password { get; set; }

    public string? DisplayName { get; set; }
    public int Follower { get; set; } = 0;
    public string? AvatarURL { get; set; }
    public string? Introduction { get; set; }
    public string? AnotherPath { get; set; }
    public bool Verified { get; set; } = false;
    public bool IsAdmin { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool NeedMoreInfoUser { get; set; } = true;

    public ICollection<Follow> Followings { get; set; }

    public ICollection<Follow> Followers { get; set; }

    public List<RefreshToken> RefreshTokens { get; set; } = new();
    public List<Post> Posts { get; set; } = new();
    public List<Comment> Comments { get; set; } = new();
    public List<PostLike> PostLikes { get; set; } = new();
}

public class RefreshToken
{
    public int Id { get; set; }
    public string Token { get; set; }
    public DateTime ExpiryDate { get; set; }
    public bool IsRevoked { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
}