import { apiClient } from 'shared/api';
import type {
  ApiBlogListResult,
  ApiNewsListResult,
  ApiUsersNextBirthdaysResult,
  ApiUsersOnlineResult,
  ApiUsersRatingsResult,
  ApiUsersTopRatingResult,
} from 'shared/api/orval/generated/endpoints';
import type {
  ApiBlogListParams,
  ApiNewsListParams,
  ApiUsersChartStatParams,
  ApiUsersNextBirthdaysParams,
  ApiUsersOnlineParams,
  ApiUsersTopRatingParams,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import type { HomeUsersChart } from '../../domain/entities/home.entity';

export const homeApiClient = {
  news: (params?: ApiNewsListParams) => apiClient.apiNewsList(params) as Promise<ApiNewsListResult>,
  posts: (params?: ApiBlogListParams) => apiClient.apiBlogList(params) as Promise<ApiBlogListResult>,
  topUsers: (params?: ApiUsersTopRatingParams) => apiClient.apiUsersTopRating(params) as Promise<ApiUsersTopRatingResult>,
  nextBirthdays: (params?: ApiUsersNextBirthdaysParams) =>
    apiClient.apiUsersNextBirthdays(params) as Promise<ApiUsersNextBirthdaysResult>,
  onlineUsers: (params?: ApiUsersOnlineParams) => apiClient.apiUsersOnline(params) as Promise<ApiUsersOnlineResult>,
  usersChart: (params?: ApiUsersChartStatParams) =>
    apiClient.apiUsersChartStat(params) as unknown as Promise<HomeUsersChart>,
  userRatings: (username: string) => apiClient.apiUsersRatings(username) as Promise<ApiUsersRatingsResult>,
};
