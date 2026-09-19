using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;



[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {


        var emailExists = _context.Users.Any(u => u.Email == dto.Email);
        if (emailExists)
            return BadRequest("Email already exists.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email
        };
        var passwordHasher = new PasswordHasher<User>();

        user.PasswordHash =
      passwordHasher.HashPassword(user, dto.Password);
        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok();

    }





   [HttpPost("login")]
public IActionResult Login(LoginDto dto)
{
    var user = _context.Users
        .FirstOrDefault(u => u.Email == dto.Email);

    if (user == null)
        return Unauthorized("Invalid email or password.");

    var passwordHasher = new PasswordHasher<User>();

    var result = passwordHasher.VerifyHashedPassword(
        user,
        user.PasswordHash,
        dto.Password
    );

    if (result == PasswordVerificationResult.Failed)
        return Unauthorized("Invalid email or password.");

    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Email, user.Email)
    };

    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
    );

    var credentials = new SigningCredentials(
        key,
        SecurityAlgorithms.HmacSha256
    );

    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddHours(2),
        signingCredentials: credentials
    );

    var tokenString = new JwtSecurityTokenHandler()
        .WriteToken(token);

    return Ok(new
    {
        token = tokenString
    });
}

}