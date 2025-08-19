using Microsoft.AspNetCore.SignalR;

namespace thread_server.Hubs;

public class PostHub : Hub
{
    public async Task JoinPost(string postId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, postId);
    }

    public async Task LeavePost(string postId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, postId);
    }
}