import useSWR from 'swr';
import { createKeyFactory } from 'shared/api';
import type { ApiUsersCountriesResult, ApiUsersListParams, ApiUsersListResult } from '../data-access/api/users.api';
import { fetchUserCountries, fetchUsersList } from '../data-access/api/users.api';

const usersKeys = createKeyFactory('users');
const userCountriesKeys = createKeyFactory('user-countries');

const normalizeCountries = (data: ApiUsersCountriesResult | string[]) => {
  if (Array.isArray(data)) {
    return data as string[];
  }

  const rawData = (data as ApiUsersCountriesResult & { data?: unknown }).data;

  if (Array.isArray(rawData) && rawData.every((item) => typeof item === 'string')) {
    return rawData as string[];
  }

  return [];
};

export const useUsersList = (params: ApiUsersListParams | null) =>
  useSWR<ApiUsersListResult>(params ? usersKeys.list(params) : null, () => fetchUsersList(params as ApiUsersListParams), {
    keepPreviousData: true,
  });

export const useUserCountries = () =>
  useSWR<string[]>(userCountriesKeys.lists(), async () => {
    const response = await fetchUserCountries();

    return normalizeCountries(response);
  });
