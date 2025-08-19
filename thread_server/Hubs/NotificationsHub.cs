using Microsoft.AspNetCore.SignalR;

namespace thread_server.Hubs;

public class NotificationsHub : Hub
{
    public async Task SendNotification(string userId, object message)
    {
        await Clients.User(userId).SendAsync("ReceiveNotification", message);
    }

}