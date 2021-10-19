using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sppok.Model
{
    public class RoomState
    {
        public string Topic { get; set; }
        public bool IsVoting { get; set; }
        public List<UserModel> Users { get; set; }
        private readonly object _lockObj = new object();

        internal void ClearAllVotes()
        {
            if (Users == null)
                return;

            lock (_lockObj)
            {
                Users.ForEach((user) => user.Vote = "");
            }
        }

        internal UserModel GetUser(string connectionId)
        {
            if (Users == null)
                return null;

            lock (_lockObj)
            {
                var user = Users.FirstOrDefault(user => user.ConnectionId == connectionId);
                return user;
            }
        }

        internal void RemoveUser(string connectionId)
        {
            if (Users == null)
                return;

            lock (_lockObj)
            {
                var user = Users.FirstOrDefault(user => user.ConnectionId == connectionId);
                if (user != null)
                {
                    Users.Remove(user);
                }
            }
        }

        internal void AddUser(string connectionId, string userName)
        {
            lock (_lockObj)
            {
                if (Users == null)
                    Users = new List<UserModel>();
                var user = Users.FirstOrDefault(user => user.ConnectionId == connectionId);
                if (user != null)
                {
                    user.Name = userName;
                    user.Vote = "";
                }
                else
                {
                    user = new UserModel();
                    user.ConnectionId = connectionId;
                    user.Name = userName;
                    Users.Add(user);
                }
            }
        }

        internal void SetVote(string connectionId, string vote)
        {
            if (Users == null)
                return;

            lock (_lockObj)
            {
                var user = Users.FirstOrDefault(user => user.ConnectionId == connectionId);
                if (user != null)
                    user.Vote = vote;
            }
        }
    }
}
