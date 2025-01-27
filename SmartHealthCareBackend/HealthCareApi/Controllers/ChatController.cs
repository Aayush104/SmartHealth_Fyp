using HealthCareApplication.Contract.IService;
using HealthCareDomain.Contract.ContractDto.ChatDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthCareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet("GetUserForChat")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetUserForChat()
        {
           
            var userIdClaim = HttpContext.User.FindFirst("userId");
            var roleClaim = HttpContext.User.FindFirst("Role");

            if (userIdClaim == null || roleClaim == null)
            {
                return Unauthorized("User ID or Role claim is missing.");
            }

            var userId = userIdClaim.Value;
            var role = roleClaim.Value;

         
            var response = await _chatService.GetUserListAsync(userId, role);

            if (response == null)
            {
                return NotFound("No users found for the given criteria.");
            }

            return Ok(response);
        }

       

        [HttpGet("GetMessages/{receiverId}")]
        [Authorize(AuthenticationSchemes = "Bearer")]


        public async Task<IActionResult> GetMessages([FromRoute] string receiverId)
        {
            var userIdClaim = HttpContext.User.FindFirst("userId");
            var senderId = userIdClaim.Value;

            var conversation = await _chatService.GetMessagesAsync(senderId, receiverId);
            if (conversation == null)
            {
                return NotFound("No Messages Found");
            }

            return Ok(conversation.Data);

        }

    }

}
