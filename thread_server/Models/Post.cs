using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using thread_server.Models;

public class Post
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }

    [Required] public string Content { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<string> Images { get; set; } = new();

    [DefaultValue(0)] public int LikeCount { get; set; } = 0;

    [DefaultValue(0)] public int CommentCount { get; set; } = 0;

    [DefaultValue(0)] public int ShareCount { get; set; } = 0;

    [DefaultValue(0)] public int ReupCount { get; set; } = 0;

    public string Visibility { get; set; } = "Public"; // Public, Friends, Private

    public List<Comment> Comments { get; set; } = new();

    public List<PostLike> Likes { get; set; } = new();
}

