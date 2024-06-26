import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { EmotionPercentage } from "../../utils/types";

type SliceProps = {
	emotionPercentages: EmotionPercentage[];
}

const initialState: SliceProps = {
	emotionPercentages: [],
};

export const emotionPercentageSlice = createSlice({
	name: "emotionPercentageSlice",
	initialState,
	reducers: {
		setEmotionPercentages: (state, action: PayloadAction<EmotionPercentage[]>) => {
            state.emotionPercentages = action.payload;
        },
	},
});

export const { setEmotionPercentages } = emotionPercentageSlice.actions;

export const selectEmotionPercentages = (state: RootState) => state.emotionPercentageSlice.emotionPercentages;
