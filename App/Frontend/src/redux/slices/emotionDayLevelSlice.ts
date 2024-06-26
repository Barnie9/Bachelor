import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { EmotionDayLevel } from "../../utils/types";

type SliceProps = {
	emotionDayLevels: EmotionDayLevel[];
}

const initialState: SliceProps = {
	emotionDayLevels: [],
};

export const emotionDayLevelSlice = createSlice({
	name: "emotionDayLevelSlice",
	initialState,
	reducers: {
		setEmotionDayLevels: (state, action: PayloadAction<EmotionDayLevel[]>) => {
            state.emotionDayLevels = action.payload;
        },
	},
});

export const { setEmotionDayLevels } = emotionDayLevelSlice.actions;

export const selectEmotionDayLevels = (state: RootState) => state.emotionDayLevelSlice.emotionDayLevels;
