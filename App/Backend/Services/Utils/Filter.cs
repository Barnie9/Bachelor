using Models;

namespace Services;

public class Filter
{
    public static IEnumerable<Result> FilterResultsByTimeRange(IEnumerable<Result> results, TimeRangeDto timeRangeDto)
    {
        var filteredResults = results;

        var startDate = timeRangeDto.StartDate.Date;
        var endDate = timeRangeDto.EndDate.Date;
        if (startDate == endDate)
        {
            filteredResults = filteredResults.Where(r => r.Timestamp.Date == startDate);
        }
        else
        {
            filteredResults = filteredResults.Where(r => startDate <= r.Timestamp.Date && r.Timestamp.Date < endDate);
        }

        return filteredResults;
    }

    public static IEnumerable<Result> FilterResultsByTimeRangeAndEmotionName(IEnumerable<Result> results, TimeRangeDto timeRangeDto, string emotionName)
    {
        var filteredResults = FilterResultsByTimeRange(results, timeRangeDto);
        return filteredResults.Where(r => r.Emotion!.Name == emotionName);
    }
}