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
        var ideas = _context.Ideas
    .Include(i => i.User).Select(i => new IdeaResponseDto
{
    Id = i.Id,
    Title = i.Title,
    Description = i.Description,
    Category = i.Category,
    CreatedAt = i.CreatedAt,
    UserId = i.UserId,
    UserName = i.User != null ? i.User.Name : null
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