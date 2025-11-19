import type {
  KepcoinEarn,
  KepcoinSpend,
  KepcoinSummary,
  KepcoinTransactionsQuery,
  KepcoinTransactionsResult,
} from '../entities/kepcoin.entity';

export interface KepcoinRepository {
  getSummary: () => Promise<KepcoinSummary>;
  getEarns: (params?: KepcoinTransactionsQuery) => Promise<KepcoinTransactionsResult<KepcoinEarn>>;
  getSpends: (params?: KepcoinTransactionsQuery) => Promise<KepcoinTransactionsResult<KepcoinSpend>>;
}
