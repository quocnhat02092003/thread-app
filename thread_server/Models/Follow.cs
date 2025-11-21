using thread_server.Models;

public class Follow
{
    public Guid FollowerId { get; set; }
    public User Follower { get; set; }

    public Guid FollowingId { get; set; }
    public User Following { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
