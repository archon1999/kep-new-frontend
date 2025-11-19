import { apiClient } from 'shared/api';
import type {
  ApiKepcoinEarnsList200,
  ApiKepcoinEarnsListParams,
  ApiKepcoinSpendsList200,
  ApiKepcoinSpendsListParams,
  KepCoinBalance,
} from 'shared/api/orval/generated/endpoints/index.schemas';

export interface ApiKepcoinSummaryResponse {
  kepcoin?: number;
  streak?: number;
  streakFreeze?: number;
}

interface ApiStreakResponse {
  streak?: number;
  streakFreeze?: number;
}

export const kepcoinApiClient = {
  getSummary: async (): Promise<ApiKepcoinSummaryResponse> => {
    const [balanceResponse, streakResponse] = await Promise.all([
      apiClient.apiMyKepcoinList() as Promise<KepCoinBalance>,
      apiClient.apiStreakList() as unknown as Promise<ApiStreakResponse>,
    ]);

    return {
      kepcoin: balanceResponse?.kepcoin,
      streak: streakResponse?.streak,
      streakFreeze: streakResponse?.streakFreeze,
    };
  },
  listEarns: (params: ApiKepcoinEarnsListParams) => apiClient.apiKepcoinEarnsList(params) as Promise<ApiKepcoinEarnsList200>,
  listSpends: (params: ApiKepcoinSpendsListParams) =>
    apiClient.apiKepcoinSpendsList(params) as Promise<ApiKepcoinSpendsList200>,
};
