using System.Security.Claims;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using thread_server.Data;
using thread_server.Models;

[Route("api/setting-account")]
[ApiController]
public class SettingAccountController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SettingAccountController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPut("update-data")]
    [Authorize]
    public async Task<IActionResult> UpdateDataUser([FromBody] UpdateDataUserRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized("User not authenticated");

        if (!Guid.TryParse(userId, out var GuidUserId))
            return BadRequest("ID người dùng không hợp lệ.");

        var user = await _context.Users.FindAsync(GuidUserId);
        if (user == null)
            return NotFound("User not found");

        var existingUsername = await _context.Users
            .Where(u => u.Username == request.Username && u.Id != user.Id)
            .FirstOrDefaultAsync();

        if (existingUsername != null)
            return BadRequest("Username already exists");

        if (string.IsNullOrEmpty(request.DisplayName) || string.IsNullOrEmpty(request.Username))
            return BadRequest("Display name and username cannot be empty");

        user.DisplayName = request.DisplayName;
        user.AvatarURL = request.AvatarURL;
        user.Introduction = request.Introduction;
        user.Username = request.Username;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Update user data successfully" });
    }


    [HttpPut("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized("User not authenticated");

        if (!Guid.TryParse(userId, out var GuidUserId))
            return BadRequest("ID người dùng không hợp lệ.");

        var user = await _context.Users.FindAsync(GuidUserId);
        if (user == null)
            return NotFound("User not found");

        if (request.CurrentPassword == request.NewPassword)
            return BadRequest("Mật khẩu mới không được trùng với mật khẩu hiện tại");

        if (string.IsNullOrEmpty(request.CurrentPassword) || string.IsNullOrEmpty(request.NewPassword) || string.IsNullOrEmpty(request.ConfirmPassword))
            return BadRequest("Vui lòng nhập đầy đủ thông tin mật khẩu!");

        if (request.NewPassword != request.ConfirmPassword)
            return BadRequest("Mật khẩu xác nhận không khớp");

        bool checkPassword = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password);
        if (checkPassword == false)
            return BadRequest("Mật khẩu hiện tại không đúng");

        user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đổi mật khẩu thành công" });
    }


}
public class UpdateDataUserRequest
{
    public string DisplayName { get; set; }
    public string AvatarURL { get; set; }
    public string Introduction { get; set; }
    public string Username { get; set; }
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; }
    public string NewPassword { get; set; }
    public string ConfirmPassword { get; set; }
}
