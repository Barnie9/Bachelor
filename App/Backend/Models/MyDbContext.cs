using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Models;

public class MyDbContext : DbContext
{
    public MyDbContext()
    {
    }

    public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Server=localhost;Database=Bachelor;Trusted_Connection=True;Encrypt=false");
    }

    public virtual DbSet<Emotion> Emotions { get; set; }
    public virtual DbSet<Employee> Employees { get; set; }
    public virtual DbSet<Result> Results { get; set; }
    public virtual DbSet<Manager> Managers { get; set; }
    public virtual DbSet<Team> Teams { get; set; }
}