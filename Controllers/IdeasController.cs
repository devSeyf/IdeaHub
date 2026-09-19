using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;



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
        var ideas = _context.Ideas.ToList();
        return Ok(ideas);
    }


[HttpPost]
public IActionResult CreateIdea(CreateIdeaDto dto)
{
    var idea = new Idea
    {
        Id = Guid.NewGuid(),
        Title = dto.Title,
        Description = dto.Description,
        Category = dto.Category,
        CreatedAt = DateTime.UtcNow
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

    idea.Title = dto.Title;
    idea.Description = dto.Description;
    idea.Category = dto.Category;

    _context.SaveChanges();

    return Ok(idea);
}


}