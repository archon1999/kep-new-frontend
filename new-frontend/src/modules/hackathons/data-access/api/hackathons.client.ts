import { apiClient } from 'shared/api';
import { ApiHackathonsList200, ApiHackathonsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';

export const hackathonsApiClient = {
  list: (params?: ApiHackathonsListParams) => apiClient.apiHackathonsList(params) as Promise<ApiHackathonsList200>,
};
