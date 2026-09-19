public class Idea
{

    public Guid Id { get; set; }

    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string Category { get; set; }
    public DateTime CreatedAt { get; set; }

    public Guid? UserId {get;set;}
    public User? User {get;set;}


    

}