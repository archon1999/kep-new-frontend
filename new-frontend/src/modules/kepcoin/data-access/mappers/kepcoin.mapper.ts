import {
  EarnType,
  KepcoinEarn,
  KepcoinSpend,
  KepcoinSummary,
  KepcoinTransactionsResult,
  SpendType,
} from '../../domain/entities/kepcoin.entity';
import {
  KepcoinEarnResponse,
  KepcoinSpendResponse,
  KepcoinSummaryResponse,
  KepcoinTransactionsApiResponse,
} from '../api/kepcoin.client';

const coerceNumber = (value?: number | string | null) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const ensureId = (prefix: string, id?: number | string, datetime?: string) => {
  if (id !== undefined && id !== null && id !== '') {
    return id;
  }
  return `${prefix}-${datetime ?? Date.now()}`;
};

const normalizeEarnType = (type?: EarnType | number) => {
  const normalized = coerceNumber(type ?? EarnType.BonusFromAdmin);
  return (normalized || EarnType.BonusFromAdmin) as EarnType;
};

const normalizeSpendType = (type?: SpendType | number) => {
  const normalized = coerceNumber(type ?? SpendType.Project);
  return (normalized || SpendType.Project) as SpendType;
};

export const mapSummaryToDomain = (payload?: KepcoinSummaryResponse): KepcoinSummary => ({
  kepcoin: coerceNumber(payload?.kepcoin),
  streak: coerceNumber(payload?.streak),
  streakFreeze: coerceNumber(payload?.streakFreeze),
});

export const mapEarnToDomain = (payload: KepcoinEarnResponse): KepcoinEarn => ({
  id: ensureId('earn', payload.id, payload.datetime),
  kepcoin: coerceNumber(payload.kepcoin),
  datetime: payload.datetime ?? '',
  earnType: normalizeEarnType(payload.earnType),
  detail: payload.detail ?? null,
});

export const mapSpendToDomain = (payload: KepcoinSpendResponse): KepcoinSpend => ({
  id: ensureId('spend', payload.id, payload.datetime),
  kepcoin: coerceNumber(payload.kepcoin),
  datetime: payload.datetime ?? '',
  type: normalizeSpendType(payload.type),
  detail: payload.detail ?? null,
});

const getTotal = (response?: KepcoinTransactionsApiResponse<any>) =>
  coerceNumber(response?.total ?? response?.meta?.total ?? response?.data?.length ?? 0);

const getPerPage = (response?: KepcoinTransactionsApiResponse<any>) =>
  coerceNumber(response?.perPage ?? response?.per_page ?? response?.meta?.per_page ?? 10) || 10;

const getPage = (response?: KepcoinTransactionsApiResponse<any>) =>
  coerceNumber(response?.page ?? response?.current_page ?? response?.meta?.current_page ?? 1) || 1;

export const mapTransactionsToDomain = <T, R>(
  response: KepcoinTransactionsApiResponse<T> | undefined,
  mapper: (item: T) => R,
): KepcoinTransactionsResult<R> => ({
  items: (response?.data ?? []).map(mapper),
  total: getTotal(response),
  page: getPage(response),
  perPage: getPerPage(response),
});
