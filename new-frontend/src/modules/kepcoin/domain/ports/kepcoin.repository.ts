import type {
  KepcoinEarnHistoryItem,
  KepcoinHistoryResponse,
  KepcoinSpendHistoryItem,
  KepcoinSummary,
} from '../entities/kepcoin.entity';

export interface KepcoinHistoryParams {
  page: number;
  pageSize: number;
}

export interface KepcoinRepository {
  getSummary: () => Promise<KepcoinSummary>;
  getEarnHistory: (params: KepcoinHistoryParams) => Promise<KepcoinHistoryResponse<KepcoinEarnHistoryItem>>;
  getSpendHistory: (params: KepcoinHistoryParams) => Promise<KepcoinHistoryResponse<KepcoinSpendHistoryItem>>;
}
