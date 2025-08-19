using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using thread_server.Data;
namespace thread_server.Controllers;


[Route("/api/[controller]")]
[ApiController]

public class SearchController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SearchController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("{username}")]
    public async Task<IActionResult> SearchUserByUsername(string username)
    {
        if (string.IsNullOrEmpty(username))
        {
            return BadRequest("Username is required");
        }

        var getUsers = await _context.Users.Where(u => u.Username.ToLower().Contains(username)).Select(u => new
        {
            u.DisplayName,
            u.Follower,
            u.AvatarURL,
            u.Introduction,
            u.Username,
            u.Id,
        }).ToListAsync();

        if (getUsers == null || !getUsers.Any()) return NotFound("User not found");

        return Ok(getUsers);

    }

}


