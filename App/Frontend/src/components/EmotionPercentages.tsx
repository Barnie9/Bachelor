import { useAppSelector } from "../redux/hooks";
import { selectEmotionPercentages } from "../redux/slices/emotionPercentageSlice";
import { sortEmotionPercentages } from "../utils/functions";
import { BarChart } from "./BarChart";
import { BarChartLegend } from "./BarChartLegend";

export const EmotionPercentages = () => {
	const emotionPercentages = useAppSelector(selectEmotionPercentages);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				width: "calc(70% - 10px)",
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
				Emotion percentages
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					height: "calc(100% - 40px)",
                    width: "calc(100% - 20px)",
                    padding: "0 10px",
				}}
			>
				<BarChart
					emotionPercentages={sortEmotionPercentages(
						emotionPercentages
					)}
				/>

				<BarChartLegend
					emotionPercentages={sortEmotionPercentages(
						emotionPercentages
					)}
				/>
			</div>
		</div>
	);
};
