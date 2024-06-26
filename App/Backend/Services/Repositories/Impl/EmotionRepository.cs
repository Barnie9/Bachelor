using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;

public class EmotionRepository : IEmotionRepository
{
    private readonly MyDbContext _context;
    private readonly DbSet<Emotion> _emotions;

    public EmotionRepository(MyDbContext context)
    {
        _context = context;
        _emotions = context.Emotions;
    }

    public async Task<Emotion?> GetEmotionByNameAsync(string name)
    {
        return await _emotions.FirstOrDefaultAsync(e => e.Name == name);
    }
}