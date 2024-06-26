import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectEmotionCategories } from "../redux/slices/emotionCategorySlice";
import { selectCurrentEmployeeId } from "../redux/slices/globalState";
import { PerformanceProgress } from "./PerformanceProgress";

export const PerformanceCard = () => {
    const currentEmployeeId = useAppSelector(selectCurrentEmployeeId);

    const emotionCategories = useAppSelector(selectEmotionCategories);

    const [word, setWord] = useState("");
    const [message, setMessage] = useState("");
    const [color, setColor] = useState("");

    const percentage = emotionCategories.length !== 0 ? emotionCategories[0].percentage + emotionCategories[1].percentage / 2 : 0;

    useEffect(() => {
        if (emotionCategories.length === 0) return;

        if (currentEmployeeId) {
            if (percentage < 30) {
                setWord("Poor");
                setMessage("Your employee is not doing well and is in a bad mood.");
                setColor("negative");
            } else if (percentage < 60) {
                setWord("Average");
                setMessage("Your employee is doing okay and is in a neutral mood.");
                setColor("neutral");
            } else {
                setWord("Good");
                setMessage("Your employee is doing a great job and is in a good mood.");
                setColor("positive");
            }
        } else {
            if (percentage < 30) {
                setWord("Poor");
                setMessage("Your team is not doing well and is in a bad mood.");
                setColor("negative");
            } else if (percentage < 60) {
                setWord("Average");
                setMessage("Your team is doing okay and is in a neutral mood.");
                setColor("neutral");
            } else {
                setWord("Good");
                setMessage("Your team is doing a great job and is in a good mood.");
                setColor("positive");
            }
        }
    }, [emotionCategories]);

	return (
		<div
			style={{
                display: "flex",
                flexDirection: "column",
				height: "100%",
				width: "calc(30% - 10px)",
				borderRadius: "10px",
				boxShadow: "0px 0px 10px 0px var(--gray)",
			}}
		>
            <div
                style={{
                    width: "200px",
                    padding: "20px 10px",
                    fontSize: "30px",
                }}
            >
                <span style={{ color: `var(--${color}-category)`, fontWeight: "bold" }}>
                    {word}&nbsp;
                </span>

                {currentEmployeeId ? "employee performance" : "team performance"}
            </div>

            <div
                style={{
                    width: "150px",
                    padding: "0 10px",
                    fontSize: "16px",
                    color: "var(--gray)",
                }}
            >
                {message}
            </div>

			<PerformanceProgress percentage={emotionCategories.length !== 0 ? percentage : 0} color={color} />
		</div>
	);
};
