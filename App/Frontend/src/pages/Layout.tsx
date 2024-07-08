import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import {
	useGetEmotionCategoriesByEmployeeIdMutation,
	useGetEmotionCategoriesByManagerIdMutation,
	useGetEmotionCategoriesByTeamIdMutation,
	useGetEmotionDayLevelsByEmployeeIdMutation,
	useGetEmotionDayLevelsByManagerIdMutation,
	useGetEmotionDayLevelsByTeamIdMutation,
	useGetEmotionPercentagesByEmployeeIdMutation,
	useGetEmotionPercentagesByManagerIdMutation,
	useGetEmotionPercentagesByTeamIdMutation,
} from "../redux/serverApi";
import { useAppSelector } from "../redux/hooks";
import {
	selectCurrentDay,
	selectCurrentEmotion,
	selectCurrentEmployeeId,
	selectCurrentEndDate,
	selectCurrentManagerId,
	selectCurrentStartDate,
	selectCurrentTeamId,
	selectCurrentViewType,
	setCurrentEndDate,
	setCurrentStartDate,
} from "../redux/slices/globalState";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setEmotionPercentages } from "../redux/slices/emotionPercentageSlice";
import { setEmotionCategories } from "../redux/slices/emotionCategorySlice";
import { ViewType } from "../utils/types";
import {
	getMonthBounds,
	getThreeMonthsBounds,
	getWeekBounds,
} from "../utils/functions";
import { setEmotionDayLevels } from "../redux/slices/emotionDayLevelSlice";

export const Layout = () => {
	const dispatch = useDispatch();

	const currentEmployeeId = useAppSelector(selectCurrentEmployeeId);
	const currentTeamId = useAppSelector(selectCurrentTeamId);
	const currentManagerId = useAppSelector(selectCurrentManagerId);

	const currentEmotion = useAppSelector(selectCurrentEmotion);

	const currentStartDate = useAppSelector(selectCurrentStartDate);
	const currentEndDate = useAppSelector(selectCurrentEndDate);

	const currentViewType = useAppSelector(selectCurrentViewType);
	const currentDay = useAppSelector(selectCurrentDay);

	const [
		getEmotionPercentagesByEmployeeId,
		{
			data: emotionPercentagesByEmployeeId,
			isSuccess: isEmotionPercentagesByEmployeeIdSuccess,
		},
	] = useGetEmotionPercentagesByEmployeeIdMutation();

	const [
		getEmotionPercentagesByTeamId,
		{
			data: emotionPercentagesByTeamId,
			isSuccess: isEmotionPercentagesByTeamIdSuccess,
		},
	] = useGetEmotionPercentagesByTeamIdMutation();

	const [
		getEmotionPercentagesByManagerId,
		{
			data: emotionPercentagesByManagerId,
			isSuccess: isEmotionPercentagesByManagerIdSuccess,
		},
	] = useGetEmotionPercentagesByManagerIdMutation();

	const [
		getEmotionCategoriesByEmployeeId,
		{
			data: emotionCategoriesByEmployeeId,
			isSuccess: isEmotionCategoriesByEmployeeIdSuccess,
		},
	] = useGetEmotionCategoriesByEmployeeIdMutation();

	const [
		getEmotionCategoriesByTeamId,
		{
			data: emotionCategoriesByTeamId,
			isSuccess: isEmotionCategoriesByTeamIdSuccess,
		},
	] = useGetEmotionCategoriesByTeamIdMutation();

	const [
		getEmotionCategoriesByManagerId,
		{
			data: emotionCategoriesByManagerId,
			isSuccess: isEmotionCategoriesByManagerIdSuccess,
		},
	] = useGetEmotionCategoriesByManagerIdMutation();

	const [
		getEmotionDayLevelsByEmployeeId,
		{
			data: emotionDayLevelsByEmployeeId,
			isSuccess: isEmotionDayLevelsByEmployeeIdSuccess,
		},
	] = useGetEmotionDayLevelsByEmployeeIdMutation();

	const [
		getEmotionDayLevelsByTeamId,
		{
			data: emotionDayLevelsByTeamId,
			isSuccess: isEmotionDayLevelsByTeamIdSuccess,
		},
	] = useGetEmotionDayLevelsByTeamIdMutation();

	const [
		getEmotionDayLevelsByManagerId,
		{
			data: emotionDayLevelsByManagerId,
			isSuccess: isEmotionDayLevelsByManagerIdSuccess,
		},
	] = useGetEmotionDayLevelsByManagerIdMutation();

	useEffect(() => {
		const { startOfThreeMonths, endOfThreeMonths } = getThreeMonthsBounds(
			currentDay!
		);

		if (currentEmployeeId != null) {
			getEmotionPercentagesByEmployeeId({
				employeeId: currentEmployeeId,
				timeRange: {
					startDate: currentStartDate,
					endDate: currentEndDate,
				},
			});
			getEmotionCategoriesByEmployeeId({
				employeeId: currentEmployeeId,
				timeRange: {
					startDate: currentStartDate,
					endDate: currentEndDate,
				},
			});
			getEmotionDayLevelsByEmployeeId({
				employeeId: currentEmployeeId,
				emotionName: currentEmotion?.name || "",
				timeRange: {
					startDate: startOfThreeMonths.toDate(),
					endDate: endOfThreeMonths.toDate(),
				},
			});
		} else if (currentTeamId != null) {
			getEmotionPercentagesByTeamId({
				teamId: currentTeamId,
				timeRange: {
					startDate: currentStartDate,
					endDate: currentEndDate,
				},
			});
			getEmotionCategoriesByTeamId({
				teamId: currentTeamId,
				timeRange: {
					startDate: currentStartDate,
					endDate: currentEndDate,
				},
			});
			getEmotionDayLevelsByTeamId({
				teamId: currentTeamId,
				emotionName: currentEmotion?.name || "",
				timeRange: {
					startDate: startOfThreeMonths.toDate(),
					endDate: endOfThreeMonths.toDate(),
				},
			});
		} else if (currentManagerId != null) {
			getEmotionPercentagesByManagerId({
				managerId: currentManagerId,
				timeRange: {
					startDate: currentStartDate,
					endDate: currentEndDate,
				},
			});
			getEmotionCategoriesByManagerId({
				managerId: currentManagerId,
				timeRange: {
					startDate: currentStartDate,
					endDate: currentEndDate,
				},
			});
			getEmotionDayLevelsByManagerId({
				managerId: currentManagerId,
				emotionName: currentEmotion?.name || "",
				timeRange: {
					startDate: startOfThreeMonths.toDate(),
					endDate: endOfThreeMonths.toDate(),
				},
			});
		}
	}, [
		currentDay,
		currentEmotion,
		currentStartDate,
		currentEndDate,
		currentEmployeeId,
		currentTeamId,
		currentManagerId,
	]);

	useEffect(() => {
		if (currentEmployeeId != null) {
			if (isEmotionPercentagesByEmployeeIdSuccess) {
				dispatch(setEmotionPercentages(emotionPercentagesByEmployeeId));
			}
			if (isEmotionCategoriesByEmployeeIdSuccess) {
				dispatch(setEmotionCategories(emotionCategoriesByEmployeeId));
			}
			if (isEmotionDayLevelsByEmployeeIdSuccess) {
				dispatch(setEmotionDayLevels(emotionDayLevelsByEmployeeId));
			}
		} else if (currentTeamId != null) {
			if (isEmotionPercentagesByTeamIdSuccess) {
				dispatch(setEmotionPercentages(emotionPercentagesByTeamId));
			}
			if (isEmotionCategoriesByTeamIdSuccess) {
				dispatch(setEmotionCategories(emotionCategoriesByTeamId));
			}
			if (isEmotionDayLevelsByTeamIdSuccess) {
				dispatch(setEmotionDayLevels(emotionDayLevelsByTeamId));
			}
		} else if (currentManagerId != null) {
			if (isEmotionPercentagesByManagerIdSuccess) {
				dispatch(setEmotionPercentages(emotionPercentagesByManagerId));
			}
			if (isEmotionCategoriesByManagerIdSuccess) {
				dispatch(setEmotionCategories(emotionCategoriesByManagerId));
			}
			if (isEmotionDayLevelsByManagerIdSuccess) {
				dispatch(setEmotionDayLevels(emotionDayLevelsByManagerId));
			}
		}
	}, [
		isEmotionPercentagesByEmployeeIdSuccess,
		isEmotionPercentagesByTeamIdSuccess,
		isEmotionPercentagesByManagerIdSuccess,
		isEmotionCategoriesByEmployeeIdSuccess,
		isEmotionCategoriesByTeamIdSuccess,
		isEmotionCategoriesByManagerIdSuccess,
		isEmotionDayLevelsByEmployeeIdSuccess,
		isEmotionDayLevelsByTeamIdSuccess,
		isEmotionDayLevelsByManagerIdSuccess,
	]);

	useEffect(() => {
		if (currentViewType === ViewType.Day) {
			dispatch(setCurrentStartDate(currentDay!.toDate()));
			dispatch(setCurrentEndDate(currentDay!.toDate()));
		} else if (currentViewType === ViewType.Week) {
			const { startOfWeek, endOfWeek } = getWeekBounds(currentDay!);

			dispatch(setCurrentStartDate(startOfWeek.toDate()));
			dispatch(setCurrentEndDate(endOfWeek.toDate()));
		} else if (currentViewType === ViewType.Month) {
			const { startOfMonth, endOfMonth } = getMonthBounds(currentDay!);

			dispatch(setCurrentStartDate(startOfMonth.toDate()));
			dispatch(setCurrentEndDate(endOfMonth.toDate()));
		}
	}, [currentViewType, currentDay]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100vh",
				width: "100%",
			}}
		>
			<div
				style={{
					height: "60px",
					width: "100%",
				}}
			>
				<Navbar />
			</div>

			<div
				style={{
					height: "calc(100% - 60px)",
					width: "100%",
				}}
			>
				<Outlet />
			</div>
		</div>
	);
};
