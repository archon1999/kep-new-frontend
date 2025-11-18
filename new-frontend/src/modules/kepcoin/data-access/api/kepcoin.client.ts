import { apiClient } from 'shared/api';
import {
  ApiKepcoinEarnsListParams,
  ApiKepcoinSpendsListParams,
} from 'shared/api/orval/generated/endpoints/index.schemas';

export const kepcoinApiClient = {
  getEarns: (params?: ApiKepcoinEarnsListParams) => apiClient.apiKepcoinEarnsList(params),
  getSpends: (params?: ApiKepcoinSpendsListParams) => apiClient.apiKepcoinSpendsList(params),
  getBalance: () => apiClient.apiMyKepcoinList(),
  getTodayStats: () => apiClient.apiTodayKepcoinList(),
  getStreak: () => apiClient.apiStreakList() as unknown as Promise<{ streak: number; streakFreeze: number }>,
  purchaseStreakFreeze: () => apiClient.apiPurchaseStreakFreezeCreate(),
};
