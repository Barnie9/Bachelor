import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectEmotions, setCurrentEmotion } from "../redux/slices/globalState";
import { Emotion } from "../utils/types";
import { EmotionCard } from "./EmotionCard";

export const EmotionSelector = () => {
    const dispatch = useAppDispatch();

    const emotions = useAppSelector(selectEmotions);

    const changeEmotion = (emotion: Emotion) => {
        dispatch(setCurrentEmotion(emotion));
    };

	return (
		<div
			style={{
                display: "flex",
                flexDirection: "column",
                padding: "5px",
				height: "calc(100% - 10px)",
				width: "calc(20% - 10px)",
                gap: "5px",
				borderRadius: "10px",
				boxShadow: "0px 0px 10px 0px var(--gray)",
                overflowY: "auto",
			}}
		>
			{emotions.map((emotion) => (
                <EmotionCard
                    key={emotion.name + "-card"}
                    emotionName={emotion.name}
                    image={emotion.image}
                    onClick={() => changeEmotion(emotion)}
                />
            ))}
		</div>
	);
};
