import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectEmotionDayLevels } from "../redux/slices/emotionDayLevelSlice";
import { selectCurrentEmotion } from "../redux/slices/globalState";
import { generateHeatmapData } from "../utils/functions";
import { DayHeatmapHeader, HeatmapCell, MonthHeatmapHeader } from "../utils/types";

export const EmotionHeatmap = () => {
	const currentEmotion = useAppSelector(selectCurrentEmotion);

	const emotionDayLevels = useAppSelector(selectEmotionDayLevels);

	const [dayHeatmapHeaders, setDayHeatmapHeaders] = useState<DayHeatmapHeader[]>([]);
	const [monthHeatmapHeaders, setMonthHeatmapHeaders] = useState<MonthHeatmapHeader[]>([]);
	const [heatmapCells, setHeatmapCells] = useState<HeatmapCell[]>([]);

	useEffect(() => {
		if (emotionDayLevels.length === 0) return;

		const { dayHeatmapHeaders, monthHeatmapHeaders, heatmapCells } =
			generateHeatmapData(emotionDayLevels);

		setDayHeatmapHeaders(dayHeatmapHeaders);
		setMonthHeatmapHeaders(monthHeatmapHeaders);
		setHeatmapCells(heatmapCells);
	}, [emotionDayLevels]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				width: "calc(50% - 20px)",
				borderRadius: "10px",
				boxShadow: "0px 0px 10px 0px var(--gray)",
			}}
		>
			<div
				style={{
					height: "20px",
					width: "100%",
					display: "flex",
					fontSize: "20px",
					padding: "10px 30px",
					color: "var(--gray)",
				}}
			>
				Current emotion heatmap
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-around",
					alignItems: "center",
					height: "calc(100% - 40px)",
				}}
			>
				{currentEmotion === null ? (
					<div style={{ color: "var(--gray)", textAlign: "center" }}>
						No emotion selected
					</div>
				) : [
					<div
						style={{
							display: "grid",
							gridTemplateRows: "repeat(9, 16px)",
							gridTemplateColumns: "repeat(30, 16px)",
							gap: "4px",
						}}
					>
						{dayHeatmapHeaders.map((dayHeatmapHeader) => (
							<div
								key={dayHeatmapHeader.day}
								style={{
									gridRow: dayHeatmapHeader.row,
									gridColumnStart: 1,
									gridColumnEnd: 4,
									display: "flex",
									justifyContent: "flex-end",
								}}
							>
								{dayHeatmapHeader.day}
							</div>
						))}
						{monthHeatmapHeaders.map((monthHeatmapHeader) => (
							<div
								key={monthHeatmapHeader.month}
								style={{
									gridRowStart: 1,
									gridRowEnd: 3,
									gridColumnStart:
										monthHeatmapHeader.columnStart + 1,
									gridColumnEnd: monthHeatmapHeader.columnEnd,
									display: "flex",
									alignItems: "center",
								}}
							>
								{monthHeatmapHeader.month}
							</div>
						))}
						{heatmapCells.map((heatmapCell) => (
							<div
								key={heatmapCell.date.toString()}
								style={{
									gridRow: heatmapCell.row,
									gridColumn: heatmapCell.column,
									height: "100%",
									width: "100%",
									backgroundColor: `var(--${currentEmotion.name.toLowerCase()}-level)`,
									opacity: heatmapCell.level === 4 ? 1 :
										heatmapCell.level === 3 ? 0.8 :
										heatmapCell.level === 2 ? 0.6 :
										heatmapCell.level === 1 ? 0.4 :
										heatmapCell.level === 0 ? 0.2 : 0,
								}}
								title={heatmapCell.date.toDateString()}
							/>
						))}
					</div>,
					<div
						style={{
							display: "grid",
							gridTemplateRows: "16px",
							gridTemplateColumns: "repeat(9, 16px)",
							gap: "4px",
						}}
					>
						<div
							style={{
								gridRow: 1,
								gridColumnStart: 1,
								gridColumnEnd: 3,
								textAlign: "center",
							}}
						>
							Less
						</div>
						{[0, 1, 2, 3, 4].map((level) => (
							<div
								key={level}
								style={{
									gridRow: 1,
									gridColumn: level + 3,
									height: "100%",
									width: "100%",
									backgroundColor: `var(--${currentEmotion.name.toLowerCase()}-level)`,
									opacity: level === 4 ? 1 :
										level === 3 ? 0.8 :
										level === 2 ? 0.6 :
										level === 1 ? 0.4 :
										level === 0 ? 0.2 : 0,
								}}
							/>
						))}
						<div
							style={{
								gridRow: 1,
								gridColumnStart: 8,
								gridColumnEnd: 10,
								textAlign: "center",
							}}
						>
							More
						</div>
					</div>,
				]}
			</div>
		</div>
	);
};
