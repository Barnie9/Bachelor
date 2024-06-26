using Models;

namespace Services;

public interface IEmotionRepository
{
    Task<Emotion?> GetEmotionByNameAsync(string name);
}