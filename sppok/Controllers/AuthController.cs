using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sppok.Model;
using sppok.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sppok.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {


        private readonly ILogger<AuthController> _logger;
        private readonly IAuthService _authService;

        public AuthController(ILogger<AuthController> logger, IAuthService auth)
        {
            _logger = logger;
            _authService = auth; 
        }

        [HttpPost]
        [Route("login")]
        public string  Login([FromBody]LoginModel login)
        {
            var token = _authService.Authenticate(login.Login, login.Password);
            _logger.LogInformation($"created token for {login.Login}");
            return token;
        }
    }
}
