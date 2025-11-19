import type { AxiosRequestConfig } from 'axios';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import type { EarnType, SpendType, KepcoinTransactionsQuery } from '../../domain/entities/kepcoin.entity';

export interface KepcoinSummaryResponse {
  kepcoin?: number;
  streak?: number;
  streakFreeze?: number;
}

export interface KepcoinEarnResponse {
  id?: number | string;
  kepcoin?: number;
  datetime?: string;
  earnType?: EarnType | number;
  detail?: Record<string, unknown> | null;
}

export interface KepcoinSpendResponse {
  id?: number | string;
  kepcoin?: number;
  datetime?: string;
  type?: SpendType | number;
  detail?: Record<string, unknown> | null;
}

export interface KepcoinTransactionsApiResponse<T> {
  data?: T[];
  total?: number;
  page?: number;
  perPage?: number;
  per_page?: number;
  current_page?: number;
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
  };
}

const withParams = (params?: KepcoinTransactionsQuery): AxiosRequestConfig => ({
  params,
});

export const kepcoinApiClient = {
  getSummary: () => axiosFetcher(['/api/streak', { method: 'get' }]) as Promise<KepcoinSummaryResponse>,
  getEarns: (params?: KepcoinTransactionsQuery) =>
    axiosFetcher(['/api/kepcoin-earns', { method: 'get', ...withParams(params) }]) as Promise<
      KepcoinTransactionsApiResponse<KepcoinEarnResponse>
    >,
  getSpends: (params?: KepcoinTransactionsQuery) =>
    axiosFetcher(['/api/kepcoin-spends', { method: 'get', ...withParams(params) }]) as Promise<
      KepcoinTransactionsApiResponse<KepcoinSpendResponse>
    >,
};
