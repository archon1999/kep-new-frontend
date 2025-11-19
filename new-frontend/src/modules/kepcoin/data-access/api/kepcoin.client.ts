import { apiClient } from 'shared/api';
import type {
  ApiKepcoinEarnsListParams,
  ApiKepcoinSpendsListParams,
} from 'shared/api/orval/generated/endpoints';

export const kepcoinApiClient = {
  listEarns: (params?: ApiKepcoinEarnsListParams) => apiClient.apiKepcoinEarnsList(params),
  listSpends: (params?: ApiKepcoinSpendsListParams) => apiClient.apiKepcoinSpendsList(params),
  getBalance: () => apiClient.apiMyKepcoinList(),
  getStreak: () => apiClient.apiStreakList(),
  purchaseStreakFreeze: () => apiClient.apiPurchaseStreakFreezeCreate(),
};
