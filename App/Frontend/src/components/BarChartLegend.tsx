import { EmotionPercentage } from "../utils/types";

type Props = {
	emotionPercentages: EmotionPercentage[];
};

export const BarChartLegend = (props: Props) => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateRows: "repeat(4, 70px)",
				gridTemplateColumns: "repeat(2, 150px)",
			}}
		>
			{props.emotionPercentages.map((emotionPercentage, index) => (
				<div
					key={index + "-barchart-legend"}
					style={{
						display: "flex",
						height: "100%",
						width: "100%",
					}}
				>
					<div
						style={{
							height: "18px",
							width: "18px",
							borderRadius: "50%",
							backgroundColor: `var(--${emotionPercentage.name.toLowerCase()})`,
						}}
					/>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "8px",
							height: "100%",
							width: "calc(100% - 40px)",
							padding: "0 10px",
						}}
					>
						<div
							style={{
								fontSize: "16px",
								color: "var(--gray)",
							}}
						>
							{emotionPercentage.name}
						</div>

						<div
							style={{
								fontSize: "18px",
								color: "var(--black)",
							}}
						>
							{emotionPercentage.percentage}%
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
