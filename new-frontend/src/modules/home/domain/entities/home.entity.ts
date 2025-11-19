import type {
  ApiBlogListResult,
  ApiNewsListResult,
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
export type HomeUserRatings = ApiUsersRatingsResult;

export interface HomeUsersChart {
  newUsersSeries: number[];
  activeUsersSeries: number[];
  total: number;
  activeTotal: number;
}

export interface HomeListParams {
  pageSize?: number;
}
