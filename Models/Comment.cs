public class Comment
{
    public Guid Id { get; set; }

    public string Content { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid IdeaId { get; set; }
    public Idea Idea { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }
}