import { apiClient } from 'shared/api';
import type {
  ApiUsersAchievementsResult,
  ApiUsersCompetitionPrizesResult,
  ApiUsersCountriesResult,
  ApiUsersEducationsReadResult,
  ApiUsersInfoReadResult,
  ApiUsersListResult,
  ApiUsersSkillsReadResult,
  ApiUsersSocialReadResult,
  ApiUsersTechnologiesReadResult,
  ApiUsersWorkExperiencesReadResult,
} from 'shared/api/orval/generated/endpoints';
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
  info: (username: string) => apiClient.apiUsersInfoRead(username) as Promise<ApiUsersInfoReadResult>,
  social: (username: string) => apiClient.apiUsersSocialRead(username) as Promise<ApiUsersSocialReadResult>,
  skills: (username: string) => apiClient.apiUsersSkillsRead(username) as Promise<ApiUsersSkillsReadResult>,
  technologies: (username: string) =>
    apiClient.apiUsersTechnologiesRead(username) as Promise<ApiUsersTechnologiesReadResult>,
  educations: (username: string) =>
    apiClient.apiUsersEducationsRead(username) as Promise<ApiUsersEducationsReadResult>,
  workExperiences: (username: string) =>
    apiClient.apiUsersWorkExperiencesRead(username) as Promise<ApiUsersWorkExperiencesReadResult>,
  achievements: (username: string) =>
    apiClient.apiUsersAchievements(username) as Promise<ApiUsersAchievementsResult>,
  competitionPrizes: (username: string) =>
    apiClient.apiUsersCompetitionPrizes(username) as Promise<ApiUsersCompetitionPrizesResult>,
};
