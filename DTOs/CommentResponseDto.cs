public class CommentResponseDto
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; }
}