import type {
  ApiBlogListResult,
  ApiNewsListResult,
  ApiUserActivityHistoryReadResult,
  ApiUsersChartStatResult,
  ApiUsersNextBirthdaysResult,
  ApiUsersOnlineResult,
  ApiUsersRatingsResult,
  ApiUsersTopRatingResult,
} from 'shared/api/orval/generated/endpoints';

export type HomeNewsList = ApiNewsListResult;
export type HomePostsList = ApiBlogListResult;
export type HomeTopUsers = ApiUsersTopRatingResult;
export type HomeNextBirthdays = ApiUsersNextBirthdaysResult;
export type HomeOnlineUsers = ApiUsersOnlineResult;
export type HomeUsersChart = ApiUsersChartStatResult;
export type HomeUserRatings = ApiUsersRatingsResult;
export type HomeUserActivityHistory = ApiUserActivityHistoryReadResult;
export type HomeUserActivityHistoryItem = HomeUserActivityHistory['data'][number];

export interface HomeListParams {
  pageSize?: number;
  page?: number;
  ordering?: string;
}
