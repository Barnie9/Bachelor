namespace Models;

public class TeamDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<EmployeeDto> Employees { get; set; }
}