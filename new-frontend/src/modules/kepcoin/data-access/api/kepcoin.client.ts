import { apiClient } from 'shared/api';
import {
  ApiKepcoinEarnsList200,
  ApiKepcoinEarnsListParams,
  ApiKepcoinSpendsList200,
  ApiKepcoinSpendsListParams,
  KepCoinBalance,
} from 'shared/api/orval/generated/endpoints';

export const kepcoinApiClient = {
  listEarns: (params?: ApiKepcoinEarnsListParams) => apiClient.apiKepcoinEarnsList(params),
  listSpends: (params?: ApiKepcoinSpendsListParams) => apiClient.apiKepcoinSpendsList(params),
  getBalance: () => apiClient.apiMyKepcoinList(),
  getStreak: () => apiClient.apiStreakList(),
  purchaseStreakFreeze: () => apiClient.apiPurchaseStreakFreezeCreate(),
};

export type ApiEarnsResponse = ApiKepcoinEarnsList200;
export type ApiSpendsResponse = ApiKepcoinSpendsList200;
export type ApiBalanceResponse = KepCoinBalance;
