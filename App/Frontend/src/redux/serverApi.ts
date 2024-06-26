import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EmotionCategory, EmotionDayLevel, EmotionPercentage, Team, TimeRange, User } from "../utils/types";

export const serverApi = createApi({
	reducerPath: "serverApi",

	baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7156/api/" }),

	endpoints: (builder) => ({
		getManagerByEmail: builder.mutation<User, string>({
			query: (email) => ({
				url: `Manager/${email}`,
				method: "POST",
			}),
		}),
		getTeams: builder.query<Team[], void>({
			query: () => "Team",
		}),

		getEmotionPercentagesByEmployeeId: builder.mutation<EmotionPercentage[], { employeeId: string, timeRange: TimeRange }>({
			query: ({ employeeId, timeRange }) => ({
				url: `EmotionPercentage/employee/${employeeId}`,
				method: "POST",
				body: timeRange,
			}),
		}),
		getEmotionPercentagesByTeamId: builder.mutation<EmotionPercentage[], { teamId: string, timeRange: TimeRange }>({
			query: ({ teamId, timeRange }) => ({
				url: `EmotionPercentage/team/${teamId}`,
				method: "POST",
				body: timeRange,
			}),
		}),
		getEmotionPercentagesByManagerId: builder.mutation<EmotionPercentage[], { managerId: string, timeRange: TimeRange }>({
			query: ({ managerId, timeRange }) => ({
				url: `EmotionPercentage/manager/${managerId}`,
				method: "POST",
				body: timeRange,
			}),
		}),

		getEmotionCategoriesByEmployeeId: builder.mutation<EmotionCategory[], { employeeId: string, timeRange: TimeRange }>({
			query: ({ employeeId, timeRange }) => ({
				url: `EmotionCategory/employee/${employeeId}`,
				method: "POST",
				body: timeRange,
			}),
		}),
		getEmotionCategoriesByTeamId: builder.mutation<EmotionCategory[], { teamId: string, timeRange: TimeRange }>({
			query: ({ teamId, timeRange }) => ({
				url: `EmotionCategory/team/${teamId}`,
				method: "POST",
				body: timeRange,
			}),
		}),
		getEmotionCategoriesByManagerId: builder.mutation<EmotionCategory[], { managerId: string, timeRange: TimeRange }>({
			query: ({ managerId, timeRange }) => ({
				url: `EmotionCategory/manager/${managerId}`,
				method: "POST",
				body: timeRange,
			}),
		}),

		getEmotionDayLevelsByEmployeeId: builder.mutation<EmotionDayLevel[], { employeeId: string, emotionName: string, timeRange: TimeRange }>({
			query: ({ employeeId, emotionName, timeRange }) => ({
				url: `EmotionDayLevel/${emotionName}/employee/${employeeId}`,
				method: "POST",
				body: timeRange,
			}),
		}),
		getEmotionDayLevelsByTeamId: builder.mutation<EmotionDayLevel[], { teamId: string, emotionName: string, timeRange: TimeRange }>({
			query: ({ teamId, emotionName, timeRange }) => ({
				url: `EmotionDayLevel/${emotionName}/team/${teamId}`,
				method: "POST",
				body: timeRange,
			}),
		}),
		getEmotionDayLevelsByManagerId: builder.mutation<EmotionDayLevel[], { managerId: string, emotionName: string, timeRange: TimeRange }>({
			query: ({ managerId, emotionName, timeRange }) => ({
				url: `EmotionDayLevel/${emotionName}/manager/${managerId}`,
				method: "POST",
				body: timeRange,
			}),
		}),
	}),
});

type GetManagerByEmailMutation = typeof serverApi.endpoints.getManagerByEmail.useMutation;
type GetTeamsQuery = typeof serverApi.endpoints.getTeams.useQuery;
type GetEmotionPercentagesByEmployeeIdMutation = typeof serverApi.endpoints.getEmotionPercentagesByEmployeeId.useMutation;
type GetEmotionPercentagesByTeamIdMutation = typeof serverApi.endpoints.getEmotionPercentagesByTeamId.useMutation;
type GetEmotionPercentagesByManagerIdMutation = typeof serverApi.endpoints.getEmotionPercentagesByManagerId.useMutation;
type GetEmotionCategoriesByEmployeeIdMutation = typeof serverApi.endpoints.getEmotionCategoriesByEmployeeId.useMutation;
type GetEmotionCategoriesByTeamIdMutation = typeof serverApi.endpoints.getEmotionCategoriesByTeamId.useMutation;
type GetEmotionCategoriesByManagerIdMutation = typeof serverApi.endpoints.getEmotionCategoriesByManagerId.useMutation;
type GetEmotionDayLevelsByEmployeeIdMutation = typeof serverApi.endpoints.getEmotionDayLevelsByEmployeeId.useMutation;
type GetEmotionDayLevelsByTeamIdMutation = typeof serverApi.endpoints.getEmotionDayLevelsByTeamId.useMutation;
type GetEmotionDayLevelsByManagerIdMutation = typeof serverApi.endpoints.getEmotionDayLevelsByManagerId.useMutation;

export const useGetManagerByEmailMutation: GetManagerByEmailMutation = serverApi.endpoints.getManagerByEmail.useMutation;
export const useGetTeamsQuery: GetTeamsQuery = serverApi.endpoints.getTeams.useQuery;
export const useGetEmotionPercentagesByEmployeeIdMutation: GetEmotionPercentagesByEmployeeIdMutation = serverApi.endpoints.getEmotionPercentagesByEmployeeId.useMutation;
export const useGetEmotionPercentagesByTeamIdMutation: GetEmotionPercentagesByTeamIdMutation = serverApi.endpoints.getEmotionPercentagesByTeamId.useMutation;
export const useGetEmotionPercentagesByManagerIdMutation: GetEmotionPercentagesByManagerIdMutation = serverApi.endpoints.getEmotionPercentagesByManagerId.useMutation;
export const useGetEmotionCategoriesByEmployeeIdMutation: GetEmotionCategoriesByEmployeeIdMutation = serverApi.endpoints.getEmotionCategoriesByEmployeeId.useMutation;
export const useGetEmotionCategoriesByTeamIdMutation: GetEmotionCategoriesByTeamIdMutation = serverApi.endpoints.getEmotionCategoriesByTeamId.useMutation;
export const useGetEmotionCategoriesByManagerIdMutation: GetEmotionCategoriesByManagerIdMutation = serverApi.endpoints.getEmotionCategoriesByManagerId.useMutation;
export const useGetEmotionDayLevelsByEmployeeIdMutation: GetEmotionDayLevelsByEmployeeIdMutation = serverApi.endpoints.getEmotionDayLevelsByEmployeeId.useMutation;
export const useGetEmotionDayLevelsByTeamIdMutation: GetEmotionDayLevelsByTeamIdMutation = serverApi.endpoints.getEmotionDayLevelsByTeamId.useMutation;
export const useGetEmotionDayLevelsByManagerIdMutation: GetEmotionDayLevelsByManagerIdMutation = serverApi.endpoints.getEmotionDayLevelsByManagerId.useMutation;
