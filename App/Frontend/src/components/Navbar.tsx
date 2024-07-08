import { IconLogout } from "@tabler/icons-react";
import { IconButton } from "./IconButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentDay, selectCurrentViewType, setCurrentEmployeeId, setCurrentManagerId, setCurrentTeamId, setCurrentViewType } from "../redux/slices/globalState";
import { DatePicker } from "@mui/x-date-pickers";
import { setCurrentDay } from "../redux/slices/globalState";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { clearUser, selectUser } from "../redux/slices/userSlice";
import { useMsal } from "@azure/msal-react";
import { ViewType } from "../utils/types";

export const Navbar = () => {
	const navigate = useNavigate();

	const dispatch = useAppDispatch();

	const currentDay = useAppSelector(selectCurrentDay);
	const currentViewType = useAppSelector(selectCurrentViewType);

	const user = useAppSelector(selectUser);

	const { instance } = useMsal();

	const logout = () => {
		dispatch(clearUser());

		dispatch(setCurrentEmployeeId(null));
		dispatch(setCurrentTeamId(null));
		dispatch(setCurrentManagerId(null));

		instance.logoutPopup();
	};

	const onTimeRangeClick = () => {
		if (currentViewType === ViewType.Day) {
			dispatch(setCurrentViewType(ViewType.Week));
		} else if (currentViewType === ViewType.Week) {
			dispatch(setCurrentViewType(ViewType.Month));
		} else if (currentViewType === ViewType.Month) {
			dispatch(setCurrentViewType(ViewType.Day));
		}
	}

	return (
		<div
			style={{
				display: "flex",
				height: "100%",
				width: "calc(100% - 20px)",
				padding: "0 10px",
				// borderBottom: "1px solid var(--light-gray)",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-start",
					alignItems: "center",
					height: "100%",
					width: "30%",
					gap: "10px",
				}}
			>
				{user.isAdmin && (
					<Button
						text={"Teams"}
						textColor={"--black"}
						backgroundColor={"--white"}
						hoverBackgroundColor={"--light-gray"}
						onClick={() => {
							navigate("/teams");
						}}
					/>
				)}
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
					width: "40%",
					gap: "30px",
				}}
			>
				<DatePicker
					value={currentDay}
					onChange={(date) => {
						dispatch(setCurrentDay(date));
					}}
					slotProps={{
						textField: {
							sx: {
								width: "200px",
							},
						},
					}}
				/>

				<Button
					text={currentViewType === ViewType.Day ? "Day" : currentViewType === ViewType.Week ? "Week" : "Month"}
					textColor={"--black"}
					backgroundColor={"--white"}
					hoverBackgroundColor={"--light-gray"}
					onClick={onTimeRangeClick}
				/>
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					alignItems: "center",
					height: "100%",
					width: "30%",
					gap: "10px",
				}}
			>
				<div
					style={{
						color: "var(--black)",
						fontSize: "1.5rem",
						cursor: "default",
					}}
				>
					{user.username}
				</div>

				<IconButton onClick={logout}>
					<IconLogout stroke={2} />
				</IconButton>
			</div>
		</div>
	);
};
