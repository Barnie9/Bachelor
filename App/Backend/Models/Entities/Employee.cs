using System.ComponentModel.DataAnnotations;

namespace Models;

public class Employee
{
    public Guid Id { get; set; }

    [Required, StringLength(64)]
    public string Username { get; set; }

    [Required, EmailAddress, StringLength(256)]
    public string Email { get; set; }

    public Guid TeamId { get; set; }
    public Team? Team { get; set; }
}