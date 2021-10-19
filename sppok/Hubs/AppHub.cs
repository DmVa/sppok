using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using sppok.Model;
using sppok.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sppok.Hubs
{
    [Authorize]
    public class AppHub : Hub
    {
        private readonly ILogger<AppHub> _logger;
        private readonly RoomService _roomService;

        public AppHub(ILogger<AppHub> logger, RoomService roomService)
        {
            _logger = logger;
            _roomService = roomService;
        }
      
        private string UserName()
        {
            return Context.User.Identity.Name;
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
            var rooms = _roomService.GetUserRoomNames(Context.ConnectionId);
            foreach(var roomName in rooms)
            {
                _roomService.RemoveUser(roomName, Context.ConnectionId);
                await Clients.Group(roomName).SendAsync("userleft", userName, Context.ConnectionId);
            }
           
            await base.OnDisconnectedAsync(exception);
        }
        
        public async Task<string> RegisterConnectionId(string roomName)
        {
            var userName = UserName();
            _roomService.AddUser(roomName, Context.ConnectionId, userName);
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
            await Clients.Group(roomName).SendAsync("userjoined", userName, Context.ConnectionId);
             return  Context.ConnectionId;
        }

        public async Task TopicChanged(string roomName, string topic)
        {
            var room = _roomService.GetRoom(roomName);
            if (room != null)
                room.Topic = topic;
            await Clients.Group(roomName).SendAsync("topicchanged", topic, UserName());
        }

        public async Task VoteStrated(string roomName)
        {
            var room = _roomService.GetRoom(roomName);
            if (room != null)
            {
                room.ClearAllVotes();
                room.IsVoting = true;
            }
            await Clients.Group(roomName).SendAsync("votestarted", UserName());
        }

        public async Task VoteFinished(string roomName)
        {
            var room = _roomService.GetRoom(roomName);
            if (room != null)
                room.IsVoting = false;

            await Clients.Group(roomName).SendAsync("votefinished", UserName());
        }
        public async Task Voted(string roomName, string vote)
        {
            var room = _roomService.GetRoom(roomName);
            if (room != null)
                room.SetVote(Context.ConnectionId, vote);

            await Clients.Group(roomName).SendAsync("voted", vote, UserName(), Context.ConnectionId);
        }
    }
}
