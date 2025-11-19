import { apiClient } from 'shared/api';
import type {
  ApiBlogListParams,
  ApiBlogListResult,
  ApiNewsListParams,
  ApiNewsListResult,
  ApiUsersChartStatParams,
  ApiUsersChartStatResult,
  ApiUsersNextBirthdaysParams,
  ApiUsersNextBirthdaysResult,
  ApiUsersOnlineParams,
  ApiUsersOnlineResult,
  ApiUsersRatingsResult,
  ApiUsersTopRatingParams,
  ApiUsersTopRatingResult,
} from 'shared/api/orval/generated/endpoints';

export const homeApiClient = {
  news: (params?: ApiNewsListParams) => apiClient.apiNewsList(params) as Promise<ApiNewsListResult>,
  posts: (params?: ApiBlogListParams) => apiClient.apiBlogList(params) as Promise<ApiBlogListResult>,
  topUsers: (params?: ApiUsersTopRatingParams) => apiClient.apiUsersTopRating(params) as Promise<ApiUsersTopRatingResult>,
  nextBirthdays: (params?: ApiUsersNextBirthdaysParams) =>
    apiClient.apiUsersNextBirthdays(params) as Promise<ApiUsersNextBirthdaysResult>,
  onlineUsers: (params?: ApiUsersOnlineParams) => apiClient.apiUsersOnline(params) as Promise<ApiUsersOnlineResult>,
  usersChart: (params?: ApiUsersChartStatParams) =>
    apiClient.apiUsersChartStat(params) as Promise<ApiUsersChartStatResult>,
  userRatings: (username: string) => apiClient.apiUsersRatings(username) as Promise<ApiUsersRatingsResult>,
};
