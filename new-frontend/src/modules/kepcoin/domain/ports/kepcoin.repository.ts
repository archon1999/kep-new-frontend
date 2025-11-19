import { KepcoinBalance, KepcoinStreak } from '../entities/kepcoin-streak.entity';
import {
  KepcoinEarn,
  KepcoinHistoryPage,
  KepcoinHistoryQueryParams,
  KepcoinSpend,
} from '../entities/kepcoin-history.entity';

export interface KepcoinRepository {
  getBalance(): Promise<KepcoinBalance>;
  getStreak(): Promise<KepcoinStreak>;
  getEarns(params: KepcoinHistoryQueryParams): Promise<KepcoinHistoryPage<KepcoinEarn>>;
  getSpends(params: KepcoinHistoryQueryParams): Promise<KepcoinHistoryPage<KepcoinSpend>>;
  purchaseStreakFreeze(): Promise<void>;
}
