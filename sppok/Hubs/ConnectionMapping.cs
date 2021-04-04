using sppok.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace sppok.Hubs
{
    public class ConnectionMapping
    {
        private readonly Dictionary<string, UserModel> _connections =  new Dictionary<string, UserModel>(); //key - connectionId, value user 
        public ConnectionMapping() { }
        public int Count
        {
            get
            {
                return _connections.Count;
            }
        }

        public List<UserModel> GetUsers()
        {
            lock (_connections)
            {
                var users = _connections.Values.ToList();
                return users;
            }
        }

        public void Add(string connectionId, string userName)
        {
            lock (_connections)
            {
                if (!_connections.ContainsKey(connectionId))
                    _connections.Add(connectionId, new UserModel(connectionId, userName));
                else
                    _connections[connectionId] = new UserModel(connectionId, userName);
            }
        }

        
        public void Remove(string connectionId)
        {
            lock (_connections)
            {
                if (_connections.ContainsKey(connectionId))
                    _connections.Remove(connectionId);
            }
        }

        public string GetUserName(string connectionId)
        {
            UserModel user;
            if (_connections.TryGetValue(connectionId, out user))
            {
                return user.Name;
            }

            return string.Empty;
        }

        public void ClearVote()
        {
            lock (_connections)
            {
                foreach(var user in _connections.Values)
                {
                    user.Vote = null;
                }
            }
        }

        public UserModel GetUser(string connectionId)
        {
            UserModel user;
            if (_connections.TryGetValue(connectionId, out user))
            {
                return user;
            }
            return null;
        }
    }
}
