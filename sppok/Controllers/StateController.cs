using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using sppok.Model;
using sppok.Services;
using System.Threading.Tasks;

namespace sppok.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StateController : ControllerBase
    {
      

        private readonly ILogger<StateController> _logger;

        public StateController(ILogger<StateController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("GetState")]
        public RoomState GetState()
        {
            return RoomStateService.GetFullState();
        }
    }
}
