using System.ComponentModel.DataAnnotations;

namespace Models;

public class Team
{
    public Guid Id { get; set; }

    [Required, StringLength(256)]
    public string Name { get; set; }

    public Guid ManagerId { get; set; }
    public Manager? Manager { get; set; }
}