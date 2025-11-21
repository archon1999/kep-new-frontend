import { apiClient } from 'shared/api';
import { instance } from 'shared/api/http/axiosInstance.ts';
import type {
  ApiTestsListParams,
  ApiTestsListResult,
  TestDetail as ApiTestDetail,
  TestList,
} from 'shared/api/orval/generated/endpoints/index.schemas';

export const testsApiClient = {
  list: (params?: ApiTestsListParams) => apiClient.apiTestsList(params) as Promise<ApiTestsListResult>,
  getById: (id: string) => apiClient.apiTestsRead(id) as Promise<ApiTestDetail>,
  getBestResults: (id: string) => apiClient.apiTestsBestResults(id) as Promise<TestList[]>,
  getLastResults: (id: string) => apiClient.apiTestsLastResults(id) as Promise<TestList[]>,
  start: (id: string) => apiClient.apiTestsStart(id) as Promise<any>,
  // Manual client to keep flexibility for future extensions like purchase/pass pages
  getTestPass: (id: string) => apiClient.apiTestPassRead(id),
  finishTestPass: (id: string) => apiClient.apiTestPassFinish(id),
  submitAnswer: (id: string, payload: unknown) =>
    instance.post(`/api/test-pass/${id}/submit-answer/`, payload, {
      headers: { 'Content-Type': 'application/json' },
    }),
};
