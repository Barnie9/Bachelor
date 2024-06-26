import { configureStore } from "@reduxjs/toolkit";
import { serverApi } from "./serverApi";
import { globalState } from "./slices/globalState";
import { userSlice } from "./slices/userSlice";
import { emotionPercentageSlice } from "./slices/emotionPercentageSlice";
import { emotionCategorySlice } from "./slices/emotionCategorySlice";
import { emotionDayLevelSlice } from "./slices/emotionDayLevelSlice";

export const store = configureStore({
	reducer: {
		globalState: globalState.reducer,
		userSlice: userSlice.reducer,
		emotionPercentageSlice: emotionPercentageSlice.reducer,
		emotionCategorySlice: emotionCategorySlice.reducer,
		emotionDayLevelSlice: emotionDayLevelSlice.reducer,
		[serverApi.reducerPath]: serverApi.reducer,
	},

	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(serverApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
