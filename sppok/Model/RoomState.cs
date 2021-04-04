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
    }
}
