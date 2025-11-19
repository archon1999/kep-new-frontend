import {
  KepcoinEarn,
  KepcoinPaginatedResponse,
  KepcoinQueryParams,
  KepcoinSpend,
  KepcoinStreakInfo,
  PurchaseResponse,
} from '../entities/kepcoin.entity';

export interface KepcoinRepository {
  getUserKepcoinEarns(params: KepcoinQueryParams): Promise<KepcoinPaginatedResponse<KepcoinEarn>>;
  getUserKepcoinSpends(params: KepcoinQueryParams): Promise<KepcoinPaginatedResponse<KepcoinSpend>>;
  getStreakInfo(): Promise<KepcoinStreakInfo>;
  purchaseStreakFreeze(): Promise<PurchaseResponse | null>;
}
