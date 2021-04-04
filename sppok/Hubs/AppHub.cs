using Microsoft.AspNetCore.SignalR;
using sppok.Model;
using sppok.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sppok.Hubs
{
    public class AppHub : Hub
    {
        private readonly static ConnectionMapping _connections = new ConnectionMapping();
        public static List<UserModel> GetUsers()
        {
            return _connections.GetUsers();
        }
        public string UserName()
        {
            return _connections.GetUserName(Context.ConnectionId);
        }
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }
        public void Ping()
        {
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userName = UserName();
            _connections.Remove(Context.ConnectionId);
            await Clients.All.SendAsync("userleft", userName, Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
        
        public async Task<string> RegisterConnectionId(string userName)
        {
            _connections.Add(Context.ConnectionId, userName);
            await Clients.All.SendAsync("userjoined", userName, Context.ConnectionId);
             return  Context.ConnectionId;
        }

        public async Task TopicChanged(string topic)
        {
            RoomStateService.Current.Topic = topic;
            await Clients.All.SendAsync("topicchanged", topic, UserName());
        }

        public async Task VoteStrated()
        {
            RoomStateService.Current.IsVoting = true;
            _connections.ClearVote();
            await Clients.All.SendAsync("votestarted", UserName());
        }

        public async Task VoteFinished()
        {
            RoomStateService.Current.IsVoting = false;
            await Clients.All.SendAsync("votefinished", UserName());
        }
        public async Task Voted(string vote)
        {
            var user = _connections.GetUser(Context.ConnectionId);
            if (user != null)
            {
                user.Vote = vote;
                await Clients.All.SendAsync("voted", vote, UserName(), Context.ConnectionId);
            }
        }
    }
}
