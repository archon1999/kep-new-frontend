import type { KepcoinRepository, KepcoinHistoryParams } from '../../domain/ports/kepcoin.repository';
import type {
  KepcoinHistoryResponse,
  KepcoinEarnHistoryItem,
  KepcoinSpendHistoryItem,
  KepcoinSummary,
} from '../../domain/entities/kepcoin.entity';
import { kepcoinApiClient } from '../api/kepcoin.client';
import { mapApiEarnHistoryToDomain, mapApiSpendHistoryToDomain } from '../mappers/kepcoin.mapper';

export class HttpKepcoinRepository implements KepcoinRepository {
  async getSummary(): Promise<KepcoinSummary> {
    const summary = await kepcoinApiClient.getSummary();

    return {
      balance: summary?.kepcoin ?? 0,
      streak: summary?.streak ?? 0,
      streakFreeze: summary?.streakFreeze ?? 0,
    };
  }

  async getEarnHistory(params: KepcoinHistoryParams): Promise<KepcoinHistoryResponse<KepcoinEarnHistoryItem>> {
    const response = await kepcoinApiClient.listEarns(params);
    return mapApiEarnHistoryToDomain(response);
  }

  async getSpendHistory(params: KepcoinHistoryParams): Promise<KepcoinHistoryResponse<KepcoinSpendHistoryItem>> {
    const response = await kepcoinApiClient.listSpends(params);
    return mapApiSpendHistoryToDomain(response);
  }
}
