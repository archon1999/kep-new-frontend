import { createKeyFactory } from 'shared/api';
import useSWR from 'swr';
import { HttpHomeRepository } from '../data-access/repository/http.home.repository';
import type {
  HomeListParams,
  HomeNewsList,
  HomeNextBirthdays,
  HomeOnlineUsers,
  HomePostsList,
  HomeTopUsers,
  HomeUserActivityHistory,
  HomeUserRatings,
  HomeUsersChart,
} from '../domain/entities/home.entity';

const repository = new HttpHomeRepository();
const homeKeys = createKeyFactory('home');

const useHomeSWR = <T>(key: readonly unknown[] | null, fetcher: () => Promise<T>) =>
  useSWR<T>(key, fetcher, { suspense: false });

const mapListParams = (pageSize?: number, ordering?: string): HomeListParams => ({ pageSize, ordering });

export const useHomeNews = (pageSize = 3) =>
  useHomeSWR<HomeNewsList>(homeKeys.detail(`news-${pageSize}`), () => repository.getNews(mapListParams(pageSize)));

export const useHomePosts = (pageSize = 6) =>
  useHomeSWR<HomePostsList>(homeKeys.detail(`posts-${pageSize}`), () => repository.getPosts(mapListParams(pageSize)));

export const useTopUsers = (pageSize = 3, ordering?: string) =>
  useHomeSWR<HomeTopUsers>(homeKeys.detail(`top-users-${pageSize}-${ordering ?? 'default'}`), () =>
    repository.getTopUsers(mapListParams(pageSize, ordering)),
  );

export const useNextBirthdays = (pageSize = 5) =>
  useHomeSWR<HomeNextBirthdays>(homeKeys.detail(`birthdays-${pageSize}`), () =>
    repository.getNextBirthdays(mapListParams(pageSize)),
  );

export const useOnlineUsers = (pageSize = 8) =>
  useHomeSWR<HomeOnlineUsers>(homeKeys.detail(`online-${pageSize}`), () =>
    repository.getOnlineUsers(mapListParams(pageSize)),
  );

export const useUsersChart = () =>
  useHomeSWR<HomeUsersChart>(homeKeys.detail('users-chart'), () => repository.getUsersChart());

export const useUserRatings = (username?: string | null) =>
  useHomeSWR<HomeUserRatings | null>(username ? homeKeys.detail(`ratings-${username}`) : null, () =>
    repository.getUserRatings(username as string),
  );

export const useUserActivityHistory = (username?: string | null, pageSize = 4) =>
  useHomeSWR<HomeUserActivityHistory | null>(
    username ? homeKeys.detail(`activity-history-${username}-${pageSize}`) : null,
    () => repository.getUserActivityHistory(username as string, { pageSize }),
  );
