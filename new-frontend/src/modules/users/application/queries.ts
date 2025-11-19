import useSWR from 'swr';
import { HttpUsersRepository } from '../data-access/repository/http.users.repository';
import { UsersChartStatistics, UsersListRequest, UsersListResponse } from '../domain/entities/user.entity';

const repository = new HttpUsersRepository();

export const useUsersList = (params: UsersListRequest) =>
  useSWR<UsersListResponse>(['users-list', params], () => repository.getUsers(params), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

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
