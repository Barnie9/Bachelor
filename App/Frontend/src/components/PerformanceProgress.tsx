import { CircularProgress } from "@mui/material";

type Props = {
	percentage: number;
	color: string;
};

export const PerformanceProgress = (props: Props) => {
	return (
		<div
			style={{
				position: "absolute",
				right: "20px",
				bottom: "30px",
				height: "250px",
				width: "250px",
			}}
		>
			<CircularProgress
				variant="determinate"
				value={100}
				thickness={2}
				style={{
					position: "absolute",
					height: "100%",
					width: "100%",
					color: "var(--light-gray)",
				}}
			/>

			<CircularProgress
				variant="determinate"
				value={props.percentage}
				thickness={2}
				style={{
					position: "absolute",
					height: "100%",
					width: "100%",
					color: `var(--${props.color}-category)`,
				}}
			/>

			<div
				style={{
					position: "absolute",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
					width: "100%",
				}}
			>
				<span
					style={{
						fontSize: "26px",
						fontWeight: "bold", 
					}}
				>
					{props.percentage}%
				</span>

				<span
					style={{
						fontSize: "18px",
						color: "var(--gray)",
					}}
				>
					performance score
				</span>
			</div>
		</div>
	);
};
