import { PieChart } from "@mui/x-charts";
import { getPieChartDataFromEmotionCategories } from "../utils/functions";
import { useAppSelector } from "../redux/hooks";
import { selectEmotionCategories } from "../redux/slices/emotionCategorySlice";

export const EmotionCategories = () => {
	const emotionCategories = useAppSelector(selectEmotionCategories);

	const data = getPieChartDataFromEmotionCategories(emotionCategories);

	return (
		<div
			style={{
				height: "100%",
				width: "calc(30% - 10px)",
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
				Emotion categories with percentages
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "calc(100% - 40px)",
				}}
			>
				<PieChart
					series={[
						{
							data,
							highlightScope: {
								faded: "global",
								highlighted: "item",
							},
							faded: {
								innerRadius: 30,
								additionalRadius: -30,
								color: "gray",
							},
						},
					]}
					height={200}
				/>
			</div>
		</div>
	);
};
