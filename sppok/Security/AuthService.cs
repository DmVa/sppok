using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sppok.Security
{
    public class AuthService : IAuthService
    {
        private IJwtTokenService _jwtTokenService;
        public AuthService(IJwtTokenService jwtTokenService )
        {
            _jwtTokenService = jwtTokenService;
        }

        public string Authenticate(string username, string password)
        {
            var token = _jwtTokenService.GetToken(username);
            return token;
        }
    }
}
