import { kepcoinApiClient } from '../api/kepcoin.client';
import { mapBalance, mapEarnsResponse, mapSpendsResponse, mapStreak } from '../mappers/kepcoin.mapper';
import { KepcoinRepository, KepcoinListParams } from '../../domain/ports/kepcoin.repository';
import { KepcoinBalance, KepcoinEarn, KepcoinListResponse, KepcoinSpend, StreakInfo } from '../../domain/entities/kepcoin.entity';

export class HttpKepcoinRepository implements KepcoinRepository {
  async getBalance(): Promise<KepcoinBalance> {
    const balance = await kepcoinApiClient.getBalance();
    return mapBalance(balance || {});
  }

  async getEarns(params?: KepcoinListParams): Promise<KepcoinListResponse<KepcoinEarn>> {
    const earns = await kepcoinApiClient.listEarns(params);
    return mapEarnsResponse(earns);
  }

  async getSpends(params?: KepcoinListParams): Promise<KepcoinListResponse<KepcoinSpend>> {
    const spends = await kepcoinApiClient.listSpends(params);
    return mapSpendsResponse(spends);
  }

  async getStreak(): Promise<StreakInfo> {
    const streak = await kepcoinApiClient.getStreak();
    return mapStreak(streak);
  }

  async purchaseStreakFreeze(): Promise<void> {
    await kepcoinApiClient.purchaseStreakFreeze();
  }
}
