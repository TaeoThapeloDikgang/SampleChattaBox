using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs
{

    public interface IChatClient
    {
        Task ReceivedMessage(string username, string message);
        Task JoinedChannel(string username);
     
        Task LeftChannel(string username);
    }

    public class ChatHub : Hub<IChatClient>
    {
        public async Task JoinChannel(string channelName, string username)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, username);
            await Clients.Groups(channelName).JoinedChannel(username);

           
        }

        public async Task GetChannels()
        {
            throw new NotImplementedException();
            //return new List();
        }

        

        public Task SendMessageToChannel(string channelName, string username, string messsage)
        {
            return Clients.Group(channelName).ReceivedMessage(username,  messsage);
        }
        
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception ex) //username
        {
            // TODO: remove from groups and notify group members
            //Context
            //await Groups.RemoveFromGroupAsync(Context.ConnectionId);
            //await Clients.Groups(channelName).LeftChannel(username);
            await base.OnDisconnectedAsync(ex);
        }
 
    }
}
