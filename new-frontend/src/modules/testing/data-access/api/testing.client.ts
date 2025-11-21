import { apiClient } from 'shared/api';

export interface TestsListParams {
  page?: number;
  pageSize?: number;
}

export const testingApiClient = {
  list: (params?: TestsListParams) => apiClient.apiTestsList(params),
  getTest: (testId: string) => apiClient.apiTestsRead(testId),
  getTestPass: (testPassId: string) => apiClient.apiTestPassRead(testPassId),
  getBestResults: (testId: string) => apiClient.apiTestsBestResults(testId),
  getLastResults: (testId: string) => apiClient.apiTestsLastResults(testId),
  startTest: (testId: number) => apiClient.apiTestsStart(String(testId)),
  submitAnswer: (testPassId: number, questionNumber: number, answer: unknown) =>
    apiClient.apiTestPassSubmitAnswer(String(testPassId), { questionNumber, answer } as never),
  finishTest: (testPassId: number) => apiClient.apiTestPassFinish(String(testPassId)),
};
