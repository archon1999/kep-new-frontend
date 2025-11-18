import { apiClient } from 'shared/api';
import type {
  ApiArenaListResult,
  ApiContestsListResult,
  ApiBlogListResult,
  ApiNewsListResult,
  ApiUsersChartStatResult,
  ApiUsersNextBirthdaysResult,
  ApiUsersOnlineResult,
  ApiUsersRatingsResult,
  ApiUsersTopRatingResult,
} from 'shared/api/orval/generated/endpoints';
import useSWR from 'swr';

const useHomeSWR = <T>(key: readonly unknown[] | null, fetcher: () => Promise<T>) =>
  useSWR<T>(key, fetcher, { suspense: false });

export const useHomeNews = (pageSize = 3) =>
  useHomeSWR<ApiNewsListResult>(['home-news', pageSize], () => apiClient.apiNewsList({ pageSize }));

export const useHomePosts = (pageSize = 6) =>
  useHomeSWR<ApiBlogListResult>(['home-posts', pageSize], () =>
    apiClient.apiBlogList({ pageSize, not_news: '1' }),
  );

export const useTopUsers = (pageSize = 3) =>
  useHomeSWR<ApiUsersTopRatingResult>(['home-top-users', pageSize], () =>
    apiClient.apiUsersTopRating({ pageSize }),
  );

export const useNextBirthdays = (pageSize = 5) =>
  useHomeSWR<ApiUsersNextBirthdaysResult>(['home-birthdays', pageSize], () =>
    apiClient.apiUsersNextBirthdays({ pageSize }),
  );

export const useOnlineUsers = (pageSize = 8) =>
  useHomeSWR<ApiUsersOnlineResult>(['home-online-users', pageSize], () =>
    apiClient.apiUsersOnline({ pageSize }),
  );

export const useUsersChart = () =>
  useHomeSWR<ApiUsersChartStatResult>(['home-users-chart'], () => apiClient.apiUsersChartStat());

export const useUserRatings = (username?: string | null) =>
  useHomeSWR<ApiUsersRatingsResult | null>(username ? ['home-user-ratings', username] : null, () =>
    apiClient.apiUsersRatings(username as string),
  );

export const useLatestContest = () =>
  useHomeSWR<ApiContestsListResult>(['home-latest-contest'], () => apiClient.apiContestsList({ pageSize: 1 }));

export const useLatestArena = () =>
  useHomeSWR<ApiArenaListResult>(['home-latest-arena'], () => apiClient.apiArenaList({ pageSize: 1 }));
