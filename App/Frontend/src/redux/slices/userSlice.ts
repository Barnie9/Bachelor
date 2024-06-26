import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { User } from "../../utils/types";

type SliceProps = {
	user: User;
}

const initialState: SliceProps = {
	user: {
		username: "",
		email: "",
		token: "",
		id: undefined,
		isAdmin: false,
	},
};

export const userSlice = createSlice({
	name: "userSlice",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
		clearUser: (state) => {
			state.user = initialState.user;
		},
	},
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.userSlice.user;
export const selectToken = (state: RootState) => state.userSlice.user.token;
