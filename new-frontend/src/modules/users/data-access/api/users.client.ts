import { apiClient } from 'shared/api';
import { ApiUsersCountriesResult, ApiUsersListResult, UserDetail } from 'shared/api/orval/generated/endpoints';
import { ApiUsersListParams } from 'shared/api/orval/generated/endpoints/index.schemas.ts';


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
};
