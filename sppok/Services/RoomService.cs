using sppok.Hubs;
using sppok.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sppok.Services
{
    public class RoomService
    {
        private readonly object _lockObj = new object();
        private Dictionary<string, RoomState> _rooms = new Dictionary<string, RoomState>(); 

        internal List<string> GetUserRoomNames(string connectionId)
        {
            List<string> result = new List<string>();
            foreach(var room in _rooms)
            {
                var user = room.Value.GetUser(connectionId);
                if (user != null)
                    result.Add(room.Key);
            }

            return result;
        }

        internal RoomState GetRoom(string roomName)
        {
            if (string.IsNullOrEmpty(roomName))
                return null;

            if (_rooms.ContainsKey(roomName))
                return _rooms[roomName];
            else
                return null;
        }

        internal void RemoveUser(string roomName, string connectionId)
        {
            var room = GetRoom(roomName);
            if (room == null)
                return;
            room.RemoveUser(connectionId);
            lock(_lockObj)
            {
                if (room.Users == null || room.Users.Count == 0)
                    _rooms.Remove(roomName);
            }
        }

        internal void AddUser(string roomName, string connectionId, string userName)
        {
            RoomState room;
            lock (_lockObj)
            {
                room = GetRoom(roomName);
                if (room == null)
                {
                    room = new RoomState();
                    room.Users = new List<UserModel>();
                    _rooms.Add(roomName, room);
                }
            }
            room.AddUser(connectionId, userName);
        }
    }
}
