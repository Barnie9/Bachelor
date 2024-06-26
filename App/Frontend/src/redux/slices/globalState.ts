import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Emotion, ViewType } from "../../utils/types";
import AngerImage from "../../assets/anger.svg";
import FearImage from "../../assets/fear.svg";
import HappinessImage from "../../assets/happiness.svg";
import DisgustImage from "../../assets/disgust.svg";
import NeutralImage from "../../assets/neutral.svg";
import SadnessImage from "../../assets/sadness.svg";
import SurpriseImage from "../../assets/surprise.svg";
import dayjs, { Dayjs } from "dayjs";

type SliceProps = {
	emotions: Emotion[];
    currentEmotion: Emotion | null;
	currentDay: Dayjs | null;
	currentViewType: ViewType;
	currentStartDate: Date;
	currentEndDate: Date;
	currentEmployeeId: string | null;
	currentTeamId: string | null;
	currentManagerId: string | null;
};

const initialState: SliceProps = {
	emotions: [
		{
			name: "Anger",
			image: AngerImage,
		},
		{
			name: "Fear",
			image: FearImage,
		},
		{
			name: "Happiness",
			image: HappinessImage,
		},
		{
			name: "Disgust",
			image: DisgustImage,
		},
		{
			name: "Neutral",
			image: NeutralImage,
		},
		{
			name: "Sadness",
			image: SadnessImage,
		},
		{
			name: "Surprise",
			image: SurpriseImage,
		},
	],
    currentEmotion: null,
	currentDay: dayjs(),
	currentViewType: ViewType.Day,
	currentStartDate: new Date(),
	currentEndDate: new Date(),
	currentEmployeeId: null,
	currentTeamId: null,
	currentManagerId: null,
};

export const globalState = createSlice({
	name: "globalState",
	initialState,
	reducers: {
		setCurrentEmotion: (state, action: PayloadAction<Emotion>) => {
            state.currentEmotion = action.payload;
        },
		setCurrentDay: (state, action: PayloadAction<Dayjs | null>) => {
			state.currentDay = action.payload;
		},
		setCurrentViewType: (state, action: PayloadAction<ViewType>) => {
			state.currentViewType = action.payload;
		},
		setCurrentStartDate: (state, action: PayloadAction<Date>) => {
			state.currentStartDate = action.payload;
		},
		setCurrentEndDate: (state, action: PayloadAction<Date>) => {
			state.currentEndDate = action.payload;
		},
		setCurrentEmployeeId: (state, action: PayloadAction<string | null>) => {
			state.currentEmployeeId = action.payload;
		},
		setCurrentTeamId: (state, action: PayloadAction<string | null>) => {
			state.currentTeamId = action.payload;
		},
		setCurrentManagerId: (state, action: PayloadAction<string | null>) => {
			state.currentManagerId = action.payload;
		},
	},
});

export const { setCurrentEmotion, setCurrentDay, setCurrentViewType, setCurrentStartDate, setCurrentEndDate, setCurrentEmployeeId, setCurrentTeamId, setCurrentManagerId } = globalState.actions;

export const selectEmotions = (state: RootState) => state.globalState.emotions;
export const selectCurrentEmotion = (state: RootState) => state.globalState.currentEmotion;
export const selectCurrentDay = (state: RootState) => state.globalState.currentDay;
export const selectCurrentViewType = (state: RootState) => state.globalState.currentViewType;
export const selectCurrentStartDate = (state: RootState) => state.globalState.currentStartDate;
export const selectCurrentEndDate = (state: RootState) => state.globalState.currentEndDate;
export const selectCurrentEmployeeId = (state: RootState) => state.globalState.currentEmployeeId;
export const selectCurrentTeamId = (state: RootState) => state.globalState.currentTeamId;
export const selectCurrentManagerId = (state: RootState) => state.globalState.currentManagerId;
