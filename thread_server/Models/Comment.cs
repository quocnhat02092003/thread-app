using System.ComponentModel.DataAnnotations;
using thread_server.Models;

public class Comment
{
    public Guid Id { get; set; }

    public Guid PostId { get; set; }
    public Post Post { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }

    [Required]
    public string Content { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Guid? ParentCommentId { get; set; }
    public Comment ParentComment { get; set; }

    public List<Comment> Replies { get; set; } = new();
}
