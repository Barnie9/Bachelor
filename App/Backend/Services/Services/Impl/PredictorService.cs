using Models;

namespace Services;

public class PredictorService : IPredictorService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IEmotionRepository _emotionRepository;
    private readonly IResultRepository _resultRepository;

    public PredictorService(IEmployeeRepository employeeRepository, IEmotionRepository emotionRepository, IResultRepository resultRepository)
    {
        _employeeRepository = employeeRepository;
        _emotionRepository = emotionRepository;
        _resultRepository = resultRepository;
    }

    public async Task<bool> PredictAsync(ImageDetailsDto imageDetailsDto)
    {
        var employee = await _employeeRepository.GetEmployeeByUsernameAsync(imageDetailsDto.Username);
        if (employee == null)
        {
            return false;
        }

        var predictedEmotion = Predictor.Predict(imageDetailsDto.ImagePixels.ToArray());
        var emotion = await _emotionRepository.GetEmotionByNameAsync(predictedEmotion);
        if (emotion == null)
        {
            return false;
        }

        Console.WriteLine($"Predicted emotion for {employee.Username}: {emotion.Name}");

        var result = new Result
        {
            Employee = employee,
            Emotion = emotion,
            Timestamp = imageDetailsDto.Timestamp
        };
        var createdResult = await _resultRepository.CreateAsync(result);
        if (createdResult == null)
        {
            return false;
        }

        return true;
    }
}