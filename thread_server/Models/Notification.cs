using thread_server.Models;

public class Notification
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public User Sender { get; set; }
    public Guid ReceiverId { get; set; }
    public User Receiver { get; set; }
    public string Content { get; set; }
    public string? PostPreview { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
    public NotificationType Type { get; set; }
    public Guid? PostId { get; set; }
    public Post Post { get; set; }
}


public enum NotificationType
{
    Like,
    Comment,
    Follow,
    Mention,
    Repost,
    System
}