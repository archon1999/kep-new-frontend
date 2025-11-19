import axiosInstance from 'shared/services/axios/axiosInstance';
import { KepcoinEarn, KepcoinPaginatedResponse, KepcoinQueryParams, KepcoinSpend, KepcoinStreakInfo, PurchaseResponse } from '../../domain/entities/kepcoin.entity';
import { KepcoinRepository } from '../../domain/ports/kepcoin.repository';
import { ApiKepcoinEarn, ApiKepcoinSpend, ApiPaginatedResponse, ApiPurchaseResponse, ApiStreakResponse } from '../dto/kepcoin.dto';

const ENDPOINTS = {
  earns: '/api/kepcoin-earns',
  spends: '/api/kepcoin-spends',
  streak: '/api/streak',
  purchaseStreakFreeze: '/api/purchase-streak-freeze',
};

const mapEarn = (earn: ApiKepcoinEarn): KepcoinEarn => ({
  id: earn.id,
  kepcoin: earn.kepcoin,
  datetime: earn.datetime,
  earnType: earn.earnType,
  detail: earn.detail ?? null,
});

const mapSpend = (spend: ApiKepcoinSpend): KepcoinSpend => ({
  id: spend.id,
  kepcoin: spend.kepcoin,
  datetime: spend.datetime,
  type: spend.type,
  detail: spend.detail ?? null,
});

export class HttpKepcoinRepository implements KepcoinRepository {
  async getUserKepcoinEarns(params: KepcoinQueryParams): Promise<KepcoinPaginatedResponse<KepcoinEarn>> {
    const { data } = await axiosInstance.get<ApiPaginatedResponse<ApiKepcoinEarn>>(ENDPOINTS.earns, {
      params,
    });

    return {
      data: (data?.data ?? []).map(mapEarn),
      total: data?.total ?? 0,
    };
  }

  async getUserKepcoinSpends(params: KepcoinQueryParams): Promise<KepcoinPaginatedResponse<KepcoinSpend>> {
    const { data } = await axiosInstance.get<ApiPaginatedResponse<ApiKepcoinSpend>>(ENDPOINTS.spends, {
      params,
    });

    return {
      data: (data?.data ?? []).map(mapSpend),
      total: data?.total ?? 0,
    };
  }

  async getStreakInfo(): Promise<KepcoinStreakInfo> {
    const { data } = await axiosInstance.get<ApiStreakResponse>(ENDPOINTS.streak);

    return {
      streak: data?.streak ?? 0,
      streakFreeze: data?.streakFreeze ?? 0,
      maxStreak: data?.maxStreak,
    };
  }

  async purchaseStreakFreeze(): Promise<PurchaseResponse | null> {
    const { data } = await axiosInstance.post<ApiPurchaseResponse>(ENDPOINTS.purchaseStreakFreeze);

    return data ?? null;
  }
}
