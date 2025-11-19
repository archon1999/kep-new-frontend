import type {
  ApiKepcoinEarnsList200,
  ApiKepcoinSpendsList200,
  KepCoinBalance,
  UserKepcoinEarn,
  UserKepcoinSpend,
} from 'shared/api/orval/generated/endpoints';
import type { KepcoinBalance as DomainBalance, KepcoinStreak } from '../../domain/entities/kepcoin-streak.entity';
import {
  KepcoinEarn,
  KepcoinEarnType,
  KepcoinHistoryPage,
  KepcoinHistoryQueryParams,
  KepcoinSpend,
  KepcoinSpendType,
} from '../../domain/entities/kepcoin-history.entity';

const parseDetail = (detail: UserKepcoinEarn['detail'] | UserKepcoinSpend['detail']) => {
  if (!detail) {
    return null;
  }

  if (typeof detail === 'object') {
    return detail as Record<string, any>;
  }

  if (typeof detail === 'string') {
    try {
      const parsed = JSON.parse(detail);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as Record<string, any>;
      }
    } catch (error) {
      return { text: detail };
    }
  }

  return null;
};

const mapEarn = (earn: UserKepcoinEarn): KepcoinEarn => ({
  amount: earn.kepcoin,
  datetime: earn.datetime ?? null,
  earnType: earn.earnType as KepcoinEarnType,
  detail: parseDetail(earn.detail),
  note: earn.note ?? null,
});

const mapSpend = (spend: UserKepcoinSpend): KepcoinSpend => ({
  amount: spend.kepcoin,
  datetime: spend.datetime ?? null,
  type: spend.type as KepcoinSpendType,
  detail: parseDetail(spend.detail),
  note: spend.note ?? null,
});

export const mapEarnsResponse = (
  response: ApiKepcoinEarnsList200 | null | undefined,
): KepcoinHistoryPage<KepcoinEarn> => ({
  items: response?.data?.map(mapEarn) ?? [],
  total: response?.total ?? 0,
  page: response?.page ?? 1,
  pageSize: response?.pageSize ?? (response?.data?.length || 10),
});

export const mapSpendsResponse = (
  response: ApiKepcoinSpendsList200 | null | undefined,
): KepcoinHistoryPage<KepcoinSpend> => ({
  items: response?.data?.map(mapSpend) ?? [],
  total: response?.total ?? 0,
  page: response?.page ?? 1,
  pageSize: response?.pageSize ?? (response?.data?.length || 10),
});

export const mapBalance = (response: KepCoinBalance | null | undefined): DomainBalance => ({
  amount: response?.kepcoin ?? 0,
});

export const normalizeHistoryParams = (params: KepcoinHistoryQueryParams): Required<KepcoinHistoryQueryParams> => ({
  page: params.page ?? 1,
  pageSize: params.pageSize ?? 10,
});

export const mapStreak = (payload: unknown): KepcoinStreak => {
  if (typeof payload === 'object' && payload !== null) {
    const data = payload as Record<string, any>;
    return {
      streak: typeof data.streak === 'number' ? data.streak : 0,
      streakFreeze: typeof data.streakFreeze === 'number' ? data.streakFreeze : 0,
    };
  }

  return { streak: 0, streakFreeze: 0 };
};
