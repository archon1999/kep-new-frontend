import { apiClient } from 'shared/api';
import { ApiUsersCountriesResult, ApiUsersListParams, ApiUsersListResult } from 'shared/api/orval/generated/endpoints';

export const usersApiClient = {
  list: (params?: ApiUsersListParams) => apiClient.apiUsersList(params) as Promise<ApiUsersListResult>,
  countries: () => apiClient.apiUsersCountries() as Promise<ApiUsersCountriesResult>,
};
