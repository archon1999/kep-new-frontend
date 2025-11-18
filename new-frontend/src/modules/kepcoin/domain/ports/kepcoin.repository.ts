import { KepcoinBalance, KepcoinEarn, KepcoinListResponse, KepcoinSpend, StreakInfo } from '../entities/kepcoin.entity';

export interface KepcoinListParams {
  page?: number;
  pageSize?: number;
}

export interface KepcoinRepository {
  getBalance: () => Promise<KepcoinBalance>;
  getEarns: (params?: KepcoinListParams) => Promise<KepcoinListResponse<KepcoinEarn>>;
  getSpends: (params?: KepcoinListParams) => Promise<KepcoinListResponse<KepcoinSpend>>;
  getStreak: () => Promise<StreakInfo>;
  purchaseStreakFreeze: () => Promise<void>;
}
