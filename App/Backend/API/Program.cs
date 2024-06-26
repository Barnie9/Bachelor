using Models;
using Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// Add services to the container.
builder.Services.AddTransient<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddTransient<IEmotionRepository, EmotionRepository>();
builder.Services.AddTransient<IResultRepository, ResultRepository>();
builder.Services.AddTransient<ITeamRepository, TeamRepository>();
builder.Services.AddTransient<IManagerRepository, ManagerRepository>();

builder.Services.AddTransient<IPredictorService, PredictorService>();
builder.Services.AddTransient<IEmotionPercentageService, EmotionPercentageService>();
builder.Services.AddTransient<IEmotionCategoryService, EmotionCategoryService>();
builder.Services.AddTransient<IEmotionDayLevelService, EmotionDayLevelService>();
builder.Services.AddTransient<IManagerService, ManagerService>();
builder.Services.AddTransient<ITeamService, TeamService>();

builder.Services.AddDbContext<MyDbContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
