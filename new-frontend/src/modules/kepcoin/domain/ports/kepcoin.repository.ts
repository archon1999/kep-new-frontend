import {
  ApiKepcoinEarnsListParams,
  ApiKepcoinSpendsListParams,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  ApiKepcoinEarnsListResult,
  ApiKepcoinSpendsListResult,
  ApiMyKepcoinListResult,
  ApiTodayKepcoinListResult,
} from 'shared/api/orval/generated/endpoints';
import { KepcoinStreak } from '../entities/kepcoin.types';

export interface KepcoinRepository {
  getEarns: (params?: ApiKepcoinEarnsListParams) => Promise<ApiKepcoinEarnsListResult>;
  getSpends: (params?: ApiKepcoinSpendsListParams) => Promise<ApiKepcoinSpendsListResult>;
  getBalance: () => Promise<ApiMyKepcoinListResult>;
  getTodayStats: () => Promise<ApiTodayKepcoinListResult>;
  getStreak: () => Promise<KepcoinStreak>;
  purchaseStreakFreeze: () => Promise<void>;
}
