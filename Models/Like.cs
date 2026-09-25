public class Like
{
    public Guid Id { get; set; }

    public Guid IdeaId { get; set; }
    public Idea Idea { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }
}
