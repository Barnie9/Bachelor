using System.ComponentModel.DataAnnotations;

namespace Models;

public class Manager
{
    public Guid Id { get; set; }

    [Required, StringLength(256)]
    public string Username { get; set; }

    [Required, EmailAddress, StringLength(256)]
    public string Email { get; set; }

    [Required]
    public bool IsAdmin { get; set; }
}