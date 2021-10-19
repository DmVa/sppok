using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sppok.Security
{
    public interface  IJwtTokenService
    {
        string GetToken(string username);
    }
}
