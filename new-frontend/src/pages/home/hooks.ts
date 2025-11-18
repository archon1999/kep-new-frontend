import { apiClient } from 'shared/api';
import type {
  ApiBlogListResult,
  ApiNewsListResult,
  ApiContestsListResult,
  ApiArenaListResult,
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

export const useHomeContest = (pageSize = 1) =>
  useHomeSWR<ApiContestsListResult>(['home-contests', pageSize], () =>
    apiClient.apiContestsList({ pageSize }),
  );

export const useHomeArena = (pageSize = 1) =>
  useHomeSWR<ApiArenaListResult>(['home-arena', pageSize], () => apiClient.apiArenaList({ pageSize }));

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
