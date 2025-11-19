import type { KepcoinRepository } from '../../domain/ports/kepcoin.repository';
import type {
  KepcoinEarn,
  KepcoinSpend,
  KepcoinSummary,
  KepcoinTransactionsQuery,
  KepcoinTransactionsResult,
} from '../../domain/entities/kepcoin.entity';
import { kepcoinApiClient } from '../api/kepcoin.client';
import { mapEarnToDomain, mapSpendToDomain, mapSummaryToDomain, mapTransactionsToDomain } from '../mappers/kepcoin.mapper';

export class HttpKepcoinRepository implements KepcoinRepository {
  async getSummary(): Promise<KepcoinSummary> {
    const data = await kepcoinApiClient.getSummary();
    return mapSummaryToDomain(data);
  }

  async getEarns(params?: KepcoinTransactionsQuery): Promise<KepcoinTransactionsResult<KepcoinEarn>> {
    const response = await kepcoinApiClient.getEarns(params);
    return mapTransactionsToDomain(response, mapEarnToDomain);
  }

  async getSpends(params?: KepcoinTransactionsQuery): Promise<KepcoinTransactionsResult<KepcoinSpend>> {
    const response = await kepcoinApiClient.getSpends(params);
    return mapTransactionsToDomain(response, mapSpendToDomain);
  }
}
