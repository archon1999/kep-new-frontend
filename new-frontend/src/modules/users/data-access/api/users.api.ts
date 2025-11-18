import type {
  ApiUsersCountriesParams,
  ApiUsersCountriesResult,
  ApiUsersListParams,
  ApiUsersListResult,
} from 'shared/api/orval/generated/endpoints';
import { apiClient } from 'shared/api';

export const fetchUsersList = (params: ApiUsersListParams) => apiClient.apiUsersList(params);

export const fetchUserCountries = (params?: ApiUsersCountriesParams) => apiClient.apiUsersCountries(params);

export type { ApiUsersListParams, ApiUsersListResult, ApiUsersCountriesResult };
