import dayjs, { Dayjs } from "dayjs";
import { DayHeatmapHeader, EmotionCategory, EmotionDayLevel, EmotionPercentage, HeatmapCell, MonthHeatmapHeader } from "./types";

export const generateBarChartPercentages = (
	emotionPercentages: EmotionPercentage[]
) => {
	let maxPercentage = Math.max(
		...emotionPercentages.map(
			(emotionPercentage) => emotionPercentage.percentage
		)
	);

	let barChartPercentages = [];
	for (let i = 0; i <= maxPercentage; i += 10) {
		barChartPercentages.push(i);
	}

	return barChartPercentages;
};

export const sortEmotionPercentages = (
	emotionPercentages: EmotionPercentage[]
) => {
	let newEmotionPercentages = [...emotionPercentages];

	return newEmotionPercentages.sort((a, b) => b.percentage - a.percentage);
};

export const getPieChartDataFromEmotionCategories = (
    emotionCategories: EmotionCategory[]
) => {
    return emotionCategories.map((emotionCategory, index) => {
        return {
            id: index,
            value: emotionCategory.percentage,
            label: emotionCategory.name,
            color: `var(--${emotionCategory.name.toLowerCase()}-category)`,
        };
    });
};

export const generateHeatmapData = (emotionDayLevels: EmotionDayLevel[]) => {
	let dayHeatmapHeaders = [] as DayHeatmapHeader[];
	dayHeatmapHeaders.push({
		day: "Mon",
		row: 4,
	});
	dayHeatmapHeaders.push({
		day: "Wed",
		row: 6,
	});
	dayHeatmapHeaders.push({
		day: "Fri",
		row: 8,
	});

	let monthHeatmapHeaders = [] as MonthHeatmapHeader[];
	let heatmapCells = [] as HeatmapCell[];

	let newEmotionDayLevels = [...emotionDayLevels];
	newEmotionDayLevels.sort((a, b) => {
		return dayjs(a.date).diff(dayjs(b.date));
	});

	let currentColumn = 4;
	let monthColumnStart = 4;
	let monthColumnEnd = 4;
	let currentMonth = dayjs(newEmotionDayLevels[0].date).format("MMM");
	newEmotionDayLevels.forEach((emotionDayLevel) => {
		let date = dayjs(emotionDayLevel.date);
		let day = date.day();
		let month = date.format("MMM");

		if (month !== currentMonth) {
			monthColumnEnd = currentColumn;
			monthHeatmapHeaders.push({
				month: currentMonth,
				columnStart: monthColumnStart,
				columnEnd: monthColumnEnd,
			});

			currentColumn++;
			currentMonth = month;
			monthColumnStart = currentColumn;
		}

		heatmapCells.push({
			date: date.toDate(),
			level: emotionDayLevel.level,
			row: day + 3,
			column: currentColumn,
		});

		if (day === 6) {
			currentColumn++;
		}
	});

	monthColumnEnd = currentColumn;
	monthHeatmapHeaders.push({
		month: currentMonth,
		columnStart: monthColumnStart,
		columnEnd: monthColumnEnd,
	});

	return {
		dayHeatmapHeaders,
		monthHeatmapHeaders,
		heatmapCells,
	};
};

export const getWeekBounds = (day: Dayjs) => {
	let startOfWeek = day.startOf("week");
	let endOfWeek = day.endOf("week").add(1, "day");

	return {
		startOfWeek,
		endOfWeek,
	};
};

export const getMonthBounds = (day: Dayjs) => {
	let startOfMonth = day.startOf("month");
	let endOfMonth = day.endOf("month").add(1, "day");

	return {
		startOfMonth,
		endOfMonth,
	};
};

export const getThreeMonthsBounds = (day: Dayjs) => {
	let startOfThreeMonths = day.subtract(1, "month").startOf("month").add(1, "day");
	let endOfThreeMonths = day.add(2, "month").endOf("month").add(1, "day");

	return {
		startOfThreeMonths,
		endOfThreeMonths,
	};
}
