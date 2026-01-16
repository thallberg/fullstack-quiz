using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/friendship")]
[Authorize]
public class FriendshipController : ControllerBase
{
    private readonly IFriendshipService _friendshipService;

    public FriendshipController(IFriendshipService friendshipService)
    {
        _friendshipService = friendshipService;
    }

    [HttpPost("invite")]
    public async Task<ActionResult<FriendshipResponseDto>> SendInvite([FromBody] FriendshipInviteDto inviteDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var friendship = await _friendshipService.SendInviteAsync(userId, inviteDto.Email);
            return Ok(friendship);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/accept")]
    public async Task<ActionResult<FriendshipResponseDto>> AcceptInvite(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var friendship = await _friendshipService.AcceptInviteAsync(userId, id);
            if (friendship == null)
            {
                return NotFound(new { message = "Inbjudan hittades inte" });
            }
            return Ok(friendship);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/decline")]
    public async Task<ActionResult> DeclineInvite(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var success = await _friendshipService.DeclineInviteAsync(userId, id);
        if (!success)
        {
            return NotFound(new { message = "Inbjudan hittades inte" });
        }

        return NoContent();
    }

    [HttpGet("pending")]
    public async Task<ActionResult<IEnumerable<FriendshipResponseDto>>> GetPendingInvites()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var invites = await _friendshipService.GetPendingInvitesAsync(userId);
        return Ok(invites);
    }

    [HttpGet("friends")]
    public async Task<ActionResult<IEnumerable<FriendshipResponseDto>>> GetFriends()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var friends = await _friendshipService.GetFriendsAsync(userId);
        return Ok(friends);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> RemoveFriend(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var success = await _friendshipService.RemoveFriendAsync(userId, id);
        if (!success)
        {
            return NotFound(new { message = "Vänskap hittades inte" });
        }

        return NoContent();
    }
}
