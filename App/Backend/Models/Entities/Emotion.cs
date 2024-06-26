using System.ComponentModel.DataAnnotations;

namespace Models;

public class Emotion
{
    public Guid Id { get; set; }

    [Required, StringLength(31)]
    public string Name { get; set; }
}