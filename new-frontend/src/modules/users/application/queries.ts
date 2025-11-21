import useSWR from 'swr';
import { HttpUsersRepository } from '../data-access/repository/http.users.repository';
import {
  UserDetails,
  UserRatings,
  UsersChartStatistics,
  UsersListRequest,
  UsersListResponse,
} from '../domain/entities/user.entity';

const repository = new HttpUsersRepository();

export const useUsersList = (params: UsersListRequest) =>
  useSWR<UsersListResponse>(['users-list', params], () => repository.getUsers(params), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useTopUsersByOrdering = (ordering?: string, pageSize = 3) =>
  useSWR<UsersListResponse>(
    ordering ? ['users-top-rating', ordering, pageSize] : null,
    () =>
      repository.getTopUsers({
        page: 1,
        pageSize,
        ordering,
      }),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

export const useUsersCountries = () =>
  useSWR<string[]>(['users-countries'], () => repository.getCountries(), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUsersChartStatistics = () =>
  useSWR<UsersChartStatistics>(['users-chart-statistics'], () => repository.getChartStatistics(), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUserDetails = (username?: string | null) =>
  useSWR<UserDetails>(username ? ['user-details', username] : null, () => repository.getUser(username!), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

export const useUserRatings = (username?: string | null) =>
  useSWR<UserRatings>(username ? ['user-ratings', username] : null, () => repository.getUserRatings(username!), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });
