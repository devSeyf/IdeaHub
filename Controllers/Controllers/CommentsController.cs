using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CommentsController(AppDbContext context)
    {
        _context = context;
    }




[HttpPost("idea/{ideaId}")]
public IActionResult CreateComment(Guid ideaId, CreateCommentDto dto)
{
    var idea = _context.Ideas.Find(ideaId);

    if (idea == null)
        return NotFound("Idea not found.");

    var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

    var comment = new Comment
    {
        Id = Guid.NewGuid(),
        Content = dto.Content,
        CreatedAt = DateTime.UtcNow,
        IdeaId = ideaId,
        UserId = Guid.Parse(userId!)
    };

    _context.Comments.Add(comment);
    _context.SaveChanges();

    return Ok(comment);
}






[HttpGet("idea/{ideaId}")]
public IActionResult GetComments(Guid ideaId)
{
    var comments = _context.Comments
        .Include(c => c.User)
        .Where(c => c.IdeaId == ideaId)
        .Select(c => new CommentResponseDto
        {
            Id = c.Id,
            Content = c.Content,
            CreatedAt = c.CreatedAt,
            UserId = c.UserId,
            UserName = c.User.Name
        })
        .ToList();

    return Ok(comments);
}


}