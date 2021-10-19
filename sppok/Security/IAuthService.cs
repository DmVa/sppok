using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sppok.Security
{
    public interface  IAuthService
    {
        string Authenticate(string username, string password);
    }
}
