import { apiClient } from 'shared/api';
import { ApiUsersCountriesResult, ApiUsersListResult } from 'shared/api/orval/generated/endpoints';
import { ApiUsersListParams } from 'shared/api/orval/generated/endpoints/index.schemas.ts';

interface UsersChartStatisticsApiResponse {
  total: number;
  series: number[];
}

export const usersApiClient = {
  list: (params?: ApiUsersListParams) => apiClient.apiUsersList(params) as Promise<ApiUsersListResult>,
  countries: () => apiClient.apiUsersCountries() as Promise<ApiUsersCountriesResult>,
  chartStatistics: () => apiClient.apiUsersChartStat() as Promise<UsersChartStatisticsApiResponse>,
};
