using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SignalRChat.DataAccess;

namespace SignalRChat.Hubs
{
    
    public interface IChatClient
    {

        Task ReceivedMessage(string username, string message);
        Task JoinedChannel(string username);
        Task LeftChannel(string username);
    }

    public class ChannelUser
    {
        public string ChannelName { get; set; }
        public string Username { get; set; }
        public string ConnectionId { get; set; }
    }

    public class ChatHub : Hub<IChatClient>
    {
        private static readonly Dictionary<string, List<ChannelUser>> _channelUserMap = new Dictionary<string, List<ChannelUser>>();
        private readonly IChatSystemStore _store;

        public ChatHub(IChatSystemStore store)
        {
            _store = store;
        }

        public async Task JoinChannel(string channelName, string username)
        {
            await RemoveFromAllChannelsAsync();

            ChannelUser channelUser = new ChannelUser
            {
                Username = username,
                ChannelName = channelName,
                ConnectionId = Context.ConnectionId
            };

            await Groups.AddToGroupAsync(Context.ConnectionId, channelUser.ChannelName);

            if (!_channelUserMap.TryGetValue(channelName, out List<ChannelUser> list))
            {
                list = new List<ChannelUser>();
                _channelUserMap.Add(channelName, list);
            }
            else
            {
                _channelUserMap.TryGetValue(channelName, out List<ChannelUser> userList);
                //_channelUserMap.userList.Add(channelUser);
            }

            list.Add(channelUser);

            await Clients.Groups(channelName).JoinedChannel(channelUser.Username);
        }

        private async Task RemoveFromAllChannelsAsync()
        {
            foreach(Channel channel in _store.GetChannels())
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, channel.Name);
            }

            foreach (KeyValuePair<string, List<ChannelUser>> kvp in _channelUserMap)
            {
                List<ChannelUser> userList = kvp.Value;
                var toRemove = new List<ChannelUser>();
                foreach (ChannelUser user in userList)
                {
                    if (user.ConnectionId == Context.ConnectionId)
                    {
                        toRemove.Add(user);
                    }
                }

                foreach(ChannelUser user in toRemove)
                {
                    userList.Remove(user);
                }
            }
        }

        //public async Task LeftChannel()
        //{
        //    ChannelUser channelUser = GetUserFromConnection(Context.ConnectionId);
        //    await Groups.RemoveFromGroupAsync(Context.ConnectionId, channelUser.ChannelName);
        //    await Clients.Groups(channelUser.ChannelName).LeftChannel(channelUser.Username);
        //}

        public Task<List<Channel>> GetChannels()
        {
            var channels = _store.GetChannels();
            return Task.FromResult(channels);
        }

        public Task<List<ChannelUser>> GetUsersInAChannel(string channelName)
        {
            if(_channelUserMap.TryGetValue(channelName, out List<ChannelUser> userList))
            {
                return Task.FromResult(userList);
            }
            return Task.FromResult(new List<ChannelUser>());

        }

        //public async Task RemovedUserFromChannel(string username)
        //{

        //}

        public async Task SendMessageToChannel(string message)
        {
            ChannelUser channelUser = GetUserFromConnection(Context.ConnectionId);
            if (channelUser != null)
            {
                await Clients.Group(channelUser.ChannelName).ReceivedMessage(channelUser.Username, message);
            }
        }

        //public async Task UpdateUserList(string channelName)
        //{
        //    await
        //}

        private ChannelUser GetUserFromConnection(string connectionId)
        {
            foreach (KeyValuePair<string, List<ChannelUser>> kvp in _channelUserMap)
            {
                List<ChannelUser> userList = kvp.Value;
                foreach (ChannelUser user in userList)
                {
                    if (user.ConnectionId == Context.ConnectionId)
                    {
                        return user;
                    }
                }
            }

            return null;
        }

        public override async Task OnConnectedAsync()
        {
            
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception ex) //username
        {
            await RemoveFromAllChannelsAsync();
            await base.OnDisconnectedAsync(ex);
        }
 
    }
}
