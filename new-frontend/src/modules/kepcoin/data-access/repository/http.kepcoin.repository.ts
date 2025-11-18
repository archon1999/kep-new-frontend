import { kepcoinApiClient } from '../api/kepcoin.client';
import { KepcoinRepository } from '../../domain/ports/kepcoin.repository';
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
import { KepcoinStreak } from '../../domain/entities/kepcoin.types';

export class HttpKepcoinRepository implements KepcoinRepository {
  async getEarns(params?: ApiKepcoinEarnsListParams): Promise<ApiKepcoinEarnsListResult> {
    return kepcoinApiClient.getEarns(params);
  }

  async getSpends(params?: ApiKepcoinSpendsListParams): Promise<ApiKepcoinSpendsListResult> {
    return kepcoinApiClient.getSpends(params);
  }

  async getBalance(): Promise<ApiMyKepcoinListResult> {
    return kepcoinApiClient.getBalance();
  }

  async getTodayStats(): Promise<ApiTodayKepcoinListResult> {
    return kepcoinApiClient.getTodayStats();
  }

  async getStreak(): Promise<KepcoinStreak> {
    return kepcoinApiClient.getStreak();
  }

  async purchaseStreakFreeze(): Promise<void> {
    await kepcoinApiClient.purchaseStreakFreeze();
  }
}
