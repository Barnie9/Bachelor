using System.ComponentModel.DataAnnotations;

namespace Models;

public class Result
{
    public Guid Id { get; set; }

    [Required]
    public DateTime Timestamp { get; set; }

    public Guid EmployeeId { get; set; }
    public Employee? Employee { get; set; }

    public Guid EmotionId { get; set; }
    public Emotion? Emotion { get; set; }
}