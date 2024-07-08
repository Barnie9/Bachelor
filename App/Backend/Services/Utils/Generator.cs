using Models;

namespace Services;

public class Generator
{
    private static readonly string[] EmotionNames = { "Anger", "Disgust", "Fear", "Happiness", "Sadness", "Surprise", "Neutral" };
    private static readonly string[] PositiveEmotionNames = { "Happiness" };
    private static readonly string[] NeutralEmotionNames = { "Neutral", "Surprise" };
    private static readonly string[] NegativeEmotionNames = { "Anger", "Disgust", "Fear", "Sadness" };

    public static IEnumerable<EmotionPercentageDto> GenerateEmotionPercentages(IEnumerable<Result> results)
    {
        var emotionPercentages = new List<EmotionPercentageDto>();

        var totalEmotionCount = results.Count();

        for (var i = 0; i < 7; i++)
        {
            var emotionCount = results.Count(r => r.Emotion!.Name == EmotionNames[i]);

            var emotionPercentage = new EmotionPercentageDto
            {
                Name = EmotionNames[i],
                Percentage = (long)Math.Round((double) emotionCount / totalEmotionCount * 100) < 0 ? 0 : (long)Math.Round((double) emotionCount / totalEmotionCount * 100)
            };

            emotionPercentages.Add(emotionPercentage);
        }

        return emotionPercentages;
    }

    public static IEnumerable<EmotionCategoryDto> GenerateEmotionCategories(IEnumerable<Result> results)
    {
        var emotionCategories = new List<EmotionCategoryDto>();

        var totalEmotionCount = results.Count();

        var positiveEmotionCount = results.Count(r => PositiveEmotionNames.Contains(r.Emotion!.Name));
        var neutralEmotionCount = results.Count(r => NeutralEmotionNames.Contains(r.Emotion!.Name));
        var negativeEmotionCount = results.Count(r => NegativeEmotionNames.Contains(r.Emotion!.Name));

        var positiveEmotionCategory = new EmotionCategoryDto
        {
            Name = "Positive",
            Percentage = (long)Math.Round((double) positiveEmotionCount / totalEmotionCount * 100) < 0 ? 0 : (long)Math.Round((double) positiveEmotionCount / totalEmotionCount * 100)
        };
        var neutralEmotionCategory = new EmotionCategoryDto
        {
            Name = "Neutral",
            Percentage = (long)Math.Round((double) neutralEmotionCount / totalEmotionCount * 100) < 0 ? 0 : (long)Math.Round((double) neutralEmotionCount / totalEmotionCount * 100)
        };
        var negativeEmotionCategory = new EmotionCategoryDto
        {
            Name = "Negative",
            Percentage = (long)Math.Round((double) negativeEmotionCount / totalEmotionCount * 100) < 0 ? 0 : (long)Math.Round((double) negativeEmotionCount / totalEmotionCount * 100)
        };

        emotionCategories.Add(positiveEmotionCategory);
        emotionCategories.Add(neutralEmotionCategory);
        emotionCategories.Add(negativeEmotionCategory);

        return emotionCategories;
    }

    public static IEnumerable<EmotionDayLevelDto> GenerateEmotionDayLevels(IEnumerable<Result> results, TimeRangeDto timeRangeDto)
    {
        var emotionDayLevels = new List<EmotionDayLevelDto>();

        var startDate = timeRangeDto.StartDate.Date;
        var endDate = timeRangeDto.EndDate.Date;

        var groupedResults = results.GroupBy(r => r.Timestamp.Date);
        if (!groupedResults.Any())
        {
            for (var date = startDate; date < endDate; date = date.AddDays(1))
            {
                var emotionDayLevel = new EmotionDayLevelDto
                {
                    Date = date,
                    Level = 0
                };

                emotionDayLevels.Add(emotionDayLevel);
            }

            return emotionDayLevels;
        }
        var maxEmotions = groupedResults.Max(g => g.Count());

        if (startDate == endDate)
        {
            var group = results.Where(r => r.Timestamp.Date == startDate);

            var level = (long)((double)group.Count() / maxEmotions * 100) / 20;
            level = level == 5 ? 4 : level;

            var emotionDayLevel = new EmotionDayLevelDto
            {
                Date = startDate,
                Level = level
            };

            emotionDayLevels.Add(emotionDayLevel);
        }
        else
        {
            for (var date = startDate; date < endDate; date = date.AddDays(1))
            {
                var group = results.Where(r => r.Timestamp.Date == date.Date);

                var level = (long)((double)group.Count() / maxEmotions * 100) / 20;
                level = level == 5 ? 4 : level;

                var emotionDayLevel = new EmotionDayLevelDto
                {
                    Date = date,
                    Level = level
                };

                emotionDayLevels.Add(emotionDayLevel);
            }
        }

        return emotionDayLevels;
    }
}