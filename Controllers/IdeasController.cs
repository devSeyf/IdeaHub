using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

using Microsoft.EntityFrameworkCore;
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class IdeasController : ControllerBase
{
    private readonly AppDbContext _context;
    public IdeasController(AppDbContext context)
    {
        _context = context;
    }




    [HttpGet]
    public IActionResult GetIdeas()
    {

        var userId = Guid.Parse(
    User.FindFirst(ClaimTypes.NameIdentifier)!.Value
);
        var ideas = _context.Ideas
    .Include(i => i.User).Select(i => new IdeaResponseDto
    {
        IsLikedByCurrentUser = _context.Likes.Any(l =>
        l.IdeaId == i.Id &&
        l.UserId == userId
),

        CommentsCount = _context.Comments.Count(c => c.IdeaId == i.Id),
        Id = i.Id,
        Title = i.Title,
        Description = i.Description,
        Category = i.Category,
        CreatedAt = i.CreatedAt,
        UserId = i.UserId,
        UserName = i.User != null ? i.User.Name : null,
        LikesCount = _context.Likes.Count(l => l.IdeaId == i.Id)
    })


    .ToList();

        return Ok(ideas);
    }


    [HttpPost]
    public IActionResult CreateIdea(CreateIdeaDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var idea = new Idea
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Category = dto.Category,
            CreatedAt = DateTime.UtcNow,
            UserId = Guid.Parse(userId!)
        };


        _context.Ideas.Add(idea);
        _context.SaveChanges();

        return Ok(idea);
    }

    [HttpGet("{id}")]
    public IActionResult GetIdea(Guid id)
    {
        var idea = _context.Ideas.Find(id);

        if (idea == null)
            return NotFound();

        return Ok(idea);
    }


    [HttpDelete("{id}")]
    public IActionResult DeleteIdea(Guid id)
    {
        var idea = _context.Ideas.Find(id);

        if (idea == null)
            return NotFound();

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (idea.UserId != Guid.Parse(userId!))
            return Forbid();

        _context.Ideas.Remove(idea);
        _context.SaveChanges();

        return NoContent();
    }




    [HttpPut("{id}")]
    public IActionResult UpdateIdea(Guid id, UpdateIdeaDto dto)
    {
        var idea = _context.Ideas.Find(id);

        if (idea == null)
            return NotFound();

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (idea.UserId != Guid.Parse(userId!))
            return Forbid();

        idea.Title = dto.Title;
        idea.Description = dto.Description;
        idea.Category = dto.Category;

        _context.SaveChanges();

        return Ok(idea);
    }


}