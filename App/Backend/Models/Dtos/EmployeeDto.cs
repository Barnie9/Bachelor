namespace Models;

public class EmployeeDto
{
    public Guid Id { get; set; }
    public string Username { get; set; }

    public static EmployeeDto FromEmployee(Employee employee)
    {
        return new EmployeeDto
        {
            Id = employee.Id,
            Username = employee.Username
        };
    }
}