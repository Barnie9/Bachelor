import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { EmotionCategory } from "../../utils/types";

type SliceProps = {
	emotionCategories: EmotionCategory[];
}

const initialState: SliceProps = {
	emotionCategories: [],
};

export const emotionCategorySlice = createSlice({
	name: "EmotionCategorySlice",
	initialState,
	reducers: {
		setEmotionCategories: (state, action: PayloadAction<EmotionCategory[]>) => {
            state.emotionCategories = action.payload;
        },
	},
});

export const { setEmotionCategories } = emotionCategorySlice.actions;

export const selectEmotionCategories = (state: RootState) => state.emotionCategorySlice.emotionCategories;
