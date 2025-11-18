import useSWR from 'swr';

import HttpUsersRepository from '../data-access/repository/http.users.repository';
import { CountryOption, UsersListQuery, UsersListResult } from '../domain/entities/user.entity';

const repository = new HttpUsersRepository();

export const useUsersList = (params: UsersListQuery) =>
  useSWR<UsersListResult>(['users-list', params], () => repository.getUsers(params), {
    keepPreviousData: true,
  });

export const useUserCountries = (locale: string) =>
  useSWR<CountryOption[]>(['users-countries', locale], () => repository.getCountries(locale), {
    revalidateOnFocus: false,
  });
