import { apiClient } from 'shared/api';
import type { ApiTestsListParams, ApiTestsListResult } from 'shared/api/orval/generated/endpoints';

export const testingApiClient = {
  list: (params?: ApiTestsListParams) => apiClient.apiTestsList(params) as Promise<ApiTestsListResult>,
};
