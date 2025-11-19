import { apiClient } from 'shared/api';
import type {
  ApiKepcoinEarnsList200,
  ApiKepcoinEarnsListParams,
  ApiKepcoinSpendsList200,
  ApiKepcoinSpendsListParams,
} from 'shared/api/orval/generated/endpoints';

export interface ApiKepcoinSummaryResponse {
  kepcoin?: number;
  streak?: number;
  streakFreeze?: number;
}

export const kepcoinApiClient = {
  getSummary: () => apiClient.apiStreakList() as Promise<ApiKepcoinSummaryResponse>,
  listEarns: (params: ApiKepcoinEarnsListParams) => apiClient.apiKepcoinEarnsList(params) as Promise<ApiKepcoinEarnsList200>,
  listSpends: (params: ApiKepcoinSpendsListParams) =>
    apiClient.apiKepcoinSpendsList(params) as Promise<ApiKepcoinSpendsList200>,
};
