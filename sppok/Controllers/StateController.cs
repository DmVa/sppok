using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using sppok.Model;
using sppok.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace sppok.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StateController : ControllerBase
    {
      

        private readonly ILogger<StateController> _logger;
        private readonly RoomService _roomService;
        public StateController(ILogger<StateController> logger, RoomService roomService)
        {
            _logger = logger;
            _roomService = roomService;
        }

        [HttpGet]
        [Route("GetState")]
        public RoomState GetState(string roomName)
        {
            var room = _roomService.GetRoom(roomName);
            if (room == null)
                return new RoomState() { Users = new List<UserModel>() };
            return room;
        }
    }
}
