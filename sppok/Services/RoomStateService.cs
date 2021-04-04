using sppok.Hubs;
using sppok.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sppok.Services
{
    public class RoomStateService
    {
        public static RoomState Current { get; } = new RoomState();
        public static RoomState GetFullState()
        {
            var state = new RoomState();
            state.Topic = Current.Topic;
            state.IsVoting = Current.IsVoting;
            state.Users = AppHub.GetUsers();
            return state;
        }
    }
}
