using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using thread_server.Data;
using thread_server.Models;
using thread_server.Service;

namespace thread_server.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly TokenService _tokenService;
    private readonly ApplicationDbContext _context;

    public AuthController(TokenService tokenService, ApplicationDbContext context)
    {
        _tokenService = tokenService;
        _context = context;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] UserRegistrationRequest request)
    {
        if (_context.Users.Any(u => u.Username == request.Username))
        {
            return BadRequest("Username đã tồn tại.");
        }

        var user = new User
        {
            Username = request.Username,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok(new
        {
            Message = $"Đăng ký thành công tài khoản {request.Username}"
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (existingUser == null) return Unauthorized("Tài khoản không hợp lệ");

        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, existingUser.Password);
        if (!isPasswordValid) return Unauthorized("Sai mật khẩu");

        var accessToken = _tokenService.GenerateAccessToken(new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, existingUser.Id.ToString()),
            new Claim(ClaimTypes.Name, existingUser.Username),
            new Claim(ClaimTypes.Role, existingUser.IsAdmin ? "Admin" : "User")
        });

        var refreshToken = _tokenService.GenerateRefreshToken();

        existingUser.RefreshTokens.Add(new RefreshToken
        {
            Token = refreshToken,
            ExpiryDate = DateTime.UtcNow.AddDays(7)
        });

        await _context.SaveChangesAsync();

        Response.Cookies.Append("accessToken", accessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddHours(1)
        });

        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return Ok(new
        {
            Message = "Đăng nhập thành công",
            needMoreInfoUser = existingUser.NeedMoreInfoUser,
            username = existingUser.Username,
            id = existingUser.Id
        });
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized("Không tìm thấy refreshToken");
        }

        var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (storedToken == null || storedToken.IsRevoked || storedToken.ExpiryDate < DateTime.UtcNow)
        {
            return Unauthorized("RefreshToken không hợp lệ hoặc đã hết hạn");
        }

        var user = await _context.Users.FindAsync(storedToken.UserId);

        if (user == null)
        {
            return Unauthorized("Người dùng không tồn tại");
        }

        var newAccessToken = _tokenService.GenerateAccessToken(new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User"),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        });

        Response.Cookies.Append("accessToken", newAccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddHours(1)
        });

        return Ok(new { accessToken = newAccessToken });
    }

    [HttpGet("check")]
    [Authorize]
    public IActionResult CheckAuth()
    {
        return Ok(new { isAuthenticated = true });
    }

    [HttpPost("add-information")]
    [Authorize]
    public async Task<IActionResult> AddInformation([FromBody] InfomationRequest request)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdString))
            return Unauthorized("Không tìm thấy thông tin người dùng.");

        if (!Guid.TryParse(userIdString, out var userId))
            return BadRequest("ID người dùng không hợp lệ.");

        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            return NotFound("Người dùng không tồn tại.");

        if (!user.NeedMoreInfoUser)
            return BadRequest("Bạn đã cập nhật thông tin trước đó.");

        user.DisplayName = request.DisplayName;
        user.AvatarURL = request.AvatarURL;
        user.Introduction = request.Introduction;
        user.AnotherPath = request.AnotherPath;
        user.NeedMoreInfoUser = false;

        await _context.SaveChangesAsync();

        return Ok(new { Message = "Cập nhật hồ sơ thành công." });
    }


    [HttpGet("info-user")]
    [Authorize]

    public async Task<IActionResult> GetInformation()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null) return Unauthorized("Không tìm thấy thông tin người dùng.");

        if (!Guid.TryParse(userId, out Guid userGuid))
        {
            return Unauthorized("ID người dùng không hợp lệ.");
        }

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == userGuid);

        if (existingUser == null) return NotFound("Người dùng không tồn tại");

        return Ok(new
        {
            id = existingUser.Id,
            username = existingUser.Username,
            displayName = existingUser.DisplayName,
            avatarURL = existingUser.AvatarURL,
            introduction = existingUser.Introduction,
            anotherPath = existingUser.AnotherPath,
            follower = existingUser.Follower,
            verified = existingUser.Verified,
            createdAt = existingUser.CreatedAt,
            needMoreInfoUser = existingUser.NeedMoreInfoUser,
        });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
            return Unauthorized("Không tìm thấy thông tin người dùng.");

        if (!Guid.TryParse(userId, out var userGuid))
            return BadRequest("ID người dùng không hợp lệ.");

        var user = await _context.Users.FindAsync(userGuid);
        if (user == null) return NotFound("Người dùng không tồn tại.");

        var userTokens = await _context.RefreshTokens.Where(t => t.UserId == userGuid).ToListAsync();
        _context.RefreshTokens.RemoveRange(userTokens);
        await _context.SaveChangesAsync();

        Response.Cookies.Delete("accessToken");
        Response.Cookies.Delete("refreshToken");

        return Ok(new { Message = "Đăng xuất thành công." });
    }
}



public class UserRegistrationRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

public class UserLoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

public class InfomationRequest
{
    public string DisplayName { get; set; }
    public string AvatarURL { get; set; }
    public string Introduction { get; set; }
    public string AnotherPath { get; set; }
}

public class RequestInformation
{
    public int Id { get; set; }
}