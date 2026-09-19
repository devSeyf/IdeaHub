using System.ComponentModel.DataAnnotations;

public class CreateCommentDto
{
    [Required]
    [StringLength(500)]
    public string Content { get; set; }
}