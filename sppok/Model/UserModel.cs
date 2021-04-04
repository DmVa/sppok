using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sppok.Model
{
    public class UserModel
    {
        public string ConnectionId { get; set; }
        public string Name { get; set; }
        public string Vote { get; set; }
        public UserModel() { }
        public UserModel(string connectionId, string name)
        {
            ConnectionId = connectionId;
            Name = name;
        }
    }
}
