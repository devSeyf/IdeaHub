using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LikesController : ControllerBase
{
    private readonly AppDbContext _context;

    public LikesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("{ideaId}")]
    public IActionResult LikeIdea(Guid ideaId)
    {
        var idea = _context.Ideas.Find(ideaId);

        if (idea == null)
            return NotFound("Idea not found.");

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var alreadyLiked = _context.Likes.Any(l =>
            l.IdeaId == ideaId &&
            l.UserId == Guid.Parse(userId!)
        );

        if (alreadyLiked)
            return BadRequest("You already liked this idea.");

        var like = new Like
        {
            Id = Guid.NewGuid(),
            IdeaId = ideaId,
            UserId = Guid.Parse(userId!)
        };

        _context.Likes.Add(like);
        _context.SaveChanges();

        return Ok();
    }




    [HttpDelete("{ideaId}")]
    public IActionResult UnlikeIdea(Guid ideaId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var like = _context.Likes.FirstOrDefault(l =>
            l.IdeaId == ideaId &&
            l.UserId == Guid.Parse(userId!)
        );

        if (like == null)
            return NotFound("Like not found.");

        _context.Likes.Remove(like);
        _context.SaveChanges();

        return NoContent();
    }


}