import { ApiEarnsResponse, ApiSpendsResponse } from '../api/kepcoin.client';
import { KepcoinBalance, KepcoinDetail, KepcoinEarn, KepcoinListResponse, KepcoinSpend, StreakInfo } from '../../domain/entities/kepcoin.entity';
import { UserKepcoinEarn, UserKepcoinSpend } from 'shared/api/orval/generated/endpoints';

const parseDetail = (detail: unknown): KepcoinDetail | undefined => {
  if (!detail) return undefined;

  if (typeof detail === 'object' && !Array.isArray(detail)) {
    return detail as KepcoinDetail;
  }

  if (typeof detail === 'string') {
    try {
      const parsed = JSON.parse(detail);
      if (parsed && typeof parsed === 'object') {
        return parsed as KepcoinDetail;
      }
    } catch {
      return { description: detail } as KepcoinDetail;
    }
  }

  return undefined;
};

const mapEarn = (earn: UserKepcoinEarn): KepcoinEarn => ({
  amount: earn.kepcoin,
  type: earn.earnType,
  datetime: earn.datetime,
  detail: parseDetail(earn.detail),
  note: earn.note,
});

const mapSpend = (spend: UserKepcoinSpend): KepcoinSpend => ({
  amount: spend.kepcoin,
  type: spend.type,
  datetime: spend.datetime,
  detail: parseDetail(spend.detail),
  note: spend.note,
});

export const mapEarnsResponse = (response: ApiEarnsResponse): KepcoinListResponse<KepcoinEarn> => ({
  data: (response.data ?? []).map(mapEarn),
  page: response.page,
  pageSize: response.pageSize,
  total: response.total,
  pagesCount: response.pagesCount,
});

export const mapSpendsResponse = (response: ApiSpendsResponse): KepcoinListResponse<KepcoinSpend> => ({
  data: (response.data ?? []).map(mapSpend),
  page: response.page,
  pageSize: response.pageSize,
  total: response.total,
  pagesCount: response.pagesCount,
});

export const mapBalance = (balance: { kepcoin?: number }): KepcoinBalance => ({
  value: balance.kepcoin ?? 0,
});

export const mapStreak = (streakResponse: unknown): StreakInfo => {
  if (!streakResponse || typeof streakResponse !== 'object') {
    return {};
  }

  const streakData = streakResponse as Record<string, unknown>;

  return {
    streak: typeof streakData.streak === 'number' ? streakData.streak : undefined,
    streakFreeze: typeof streakData.streakFreeze === 'number' ? streakData.streakFreeze : undefined,
  };
};
