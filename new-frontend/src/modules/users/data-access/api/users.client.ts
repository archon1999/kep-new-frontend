import { apiClient } from 'shared/api';
import type { ApiUsersCountriesResult, ApiUsersListResult } from 'shared/api/orval/generated/endpoints';
import type { ApiUsersListParams, UserDetail } from 'shared/api/orval/generated/endpoints/index.schemas';


interface UsersChartStatisticsApiResponse {
  total: number;
  series: number[];
}

export interface UserRatingsApiResponse {
  skillsRating?: RatingInfoApiResponse;
  activityRating?: RatingInfoApiResponse;
  contestsRating?: RatingInfoApiResponse;
  challengesRating?: RatingInfoApiResponse;
  skills_rating?: RatingInfoApiResponse;
  activity_rating?: RatingInfoApiResponse;
  contests_rating?: RatingInfoApiResponse;
  challenges_rating?: RatingInfoApiResponse;
}

export interface RatingInfoApiResponse {
  value?: number | string;
  rank?: number;
  percentile?: number;
  title?: string;
}

export const usersApiClient = {
  list: (params?: ApiUsersListParams) =>
    apiClient.apiUsersList(params) as Promise<ApiUsersListResult>,
  countries: () => apiClient.apiUsersCountries() as Promise<ApiUsersCountriesResult>,
  chartStatistics: () =>
    apiClient.apiUsersChartStat() as unknown as Promise<UsersChartStatisticsApiResponse>,
  details: (username: string) => apiClient.apiUsersRead(username) as Promise<UserDetail>,
  ratings: (username: string) =>
    apiClient.apiUsersRatings(username) as unknown as Promise<UserRatingsApiResponse>,
  info: (username: string) => apiClient.apiUsersInfoRead(username) as Promise<Record<string, unknown>>, 
  generalInfo: (username: string) =>
    apiClient.apiUsersGeneralInfoRead(username) as Promise<Record<string, unknown>>,
  social: (username: string) => apiClient.apiUsersSocialRead(username) as Promise<Record<string, unknown>>,
  skills: (username: string) => apiClient.apiUsersSkillsRead(username) as Promise<Record<string, unknown>>, 
  technologies: (username: string) =>
    apiClient.apiUsersTechnologiesRead(username) as Promise<Record<string, unknown>[]>,
  educations: (username: string) =>
    apiClient.apiUsersEducationsList(username) as Promise<Record<string, unknown>[]>,
  workExperiences: (username: string) =>
    apiClient.apiUsersWorkExperiencesList(username) as Promise<Record<string, unknown>[]>,
  achievements: (username: string) =>
    apiClient.apiUsersAchievementsList(username) as Promise<Record<string, unknown>[]>,
  followers: (username: string, params?: { page?: number; pageSize?: number }) =>
    apiClient.apiUsersFollowersList(username, {
      page: params?.page,
      pageSize: params?.pageSize,
    }) as Promise<Record<string, unknown>>,
};
