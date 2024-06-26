using Models;

namespace Services;

public interface IPredictorService
{
    Task<bool> PredictAsync(ImageDetailsDto imageDetailsDto);
}