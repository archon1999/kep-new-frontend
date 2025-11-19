import { kepcoinApiClient } from '../api/kepcoin.client';
import {
  mapBalance,
  mapEarnsResponse,
  mapSpendsResponse,
  mapStreak,
  normalizeHistoryParams,
} from '../mappers/kepcoin-history.mapper';
import type { KepcoinRepository } from '../../domain/ports/kepcoin.repository';
import type { KepcoinHistoryQueryParams } from '../../domain/entities/kepcoin-history.entity';
import type { KepcoinBalance, KepcoinStreak } from '../../domain/entities/kepcoin-streak.entity';

export class HttpKepcoinRepository implements KepcoinRepository {
  async getBalance(): Promise<KepcoinBalance> {
    const response = await kepcoinApiClient.getBalance();
    return mapBalance(response ?? null);
  }

  async getStreak(): Promise<KepcoinStreak> {
    const response = await (kepcoinApiClient.getStreak() as Promise<unknown>);
    return mapStreak(response ?? null);
  }

  async getEarns(params: KepcoinHistoryQueryParams) {
    const normalized = normalizeHistoryParams(params);
    const response = await kepcoinApiClient.listEarns({
      page: normalized.page,
      pageSize: normalized.pageSize,
    });

    return mapEarnsResponse(response ?? null);
  }

  async getSpends(params: KepcoinHistoryQueryParams) {
    const normalized = normalizeHistoryParams(params);
    const response = await kepcoinApiClient.listSpends({
      page: normalized.page,
      pageSize: normalized.pageSize,
    });

    return mapSpendsResponse(response ?? null);
  }

  async purchaseStreakFreeze(): Promise<void> {
    await kepcoinApiClient.purchaseStreakFreeze();
  }
}
