import { EmotionPercentage } from "../utils/types";

const barChartNumbers = [7, 6, 5, 4, 3, 2, 1];
const barChartPercentages = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

type Props = {
	emotionPercentages: EmotionPercentage[];
};

export const BarChart = (props: Props) => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateRows: "repeat(8, 35px)",
				gridTemplateColumns: `repeat(${barChartPercentages[barChartPercentages.length - 1] + 10}, 6px)`,
			}}
		>
			{barChartNumbers.map((number, index) => (
				<div
					key={index + "-y-axis"}
					style={{
						gridColumnStart: 1,
						gridColumnEnd: 5,
						gridRow: index + 1,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
						width: "100%",
						color: "var(--gray)",
					}}
				>
					{number}
				</div>
			))}

			{barChartPercentages.map((percentage, index) => (
				<div
					key={index + "-x-axis"}
					style={{
						gridRow: 8,
						gridColumnStart: index * 10 + 1,
						gridColumnEnd: (index + 1) * 10,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
						width: "100%",
						color: "var(--gray)",
					}}
				>
					{percentage}%
				</div>
			))}

			{props.emotionPercentages.map((emotionPercentage, index) => (
				<div
					key={index + "-barchart-emotion"}
					style={{
						gridRow: index + 1,
						gridColumnStart: 5,
						gridColumnEnd: 5 + emotionPercentage.percentage,
						display: "flex",
						alignItems: "center",
						height: "100%",
						width: "100%",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "85%",
                            width: "100%",
							backgroundColor: `var(--${emotionPercentage.name.toLowerCase()})`,
							borderRadius: "0 5px 5px 0",
							color: "var(--black)",
						}}
					>
						{emotionPercentage.percentage >= 15 ? emotionPercentage.name : ""}
					</div>
				</div>
			))}
		</div>
	);
};
