import useSWR from 'swr';
import type {
  KepcoinEarn,
  KepcoinSpend,
  KepcoinSummary,
  KepcoinTransactionsQuery,
  KepcoinTransactionsResult,
} from '../domain/entities/kepcoin.entity';
import { HttpKepcoinRepository } from '../data-access/repository/http.kepcoin.repository';

const repository = new HttpKepcoinRepository();

export const KEP_COIN_PAGE_SIZE = 10;

const normalizeParams = (params?: KepcoinTransactionsQuery) => ({
  page: params?.page ?? 1,
  perPage: params?.perPage ?? KEP_COIN_PAGE_SIZE,
});

export const useKepcoinSummary = () =>
  useSWR<KepcoinSummary>(['kepcoin', 'summary'], () => repository.getSummary(), {
    suspense: false,
    revalidateOnFocus: false,
  });

const useTransactions = <T extends KepcoinEarn | KepcoinSpend>(
  key: 'earns' | 'spends',
  params: KepcoinTransactionsQuery | null | undefined,
  fetcher: (normalized: KepcoinTransactionsQuery) => Promise<KepcoinTransactionsResult<T>>,
) => {
  const normalized = params ? normalizeParams(params) : null;

  return useSWR<KepcoinTransactionsResult<T>>(
    normalized ? ['kepcoin', key, normalized.page, normalized.perPage] : null,
    normalized ? () => fetcher(normalized) : undefined,
    {
      suspense: false,
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );
};

export const useKepcoinEarns = (params?: KepcoinTransactionsQuery | null) =>
  useTransactions<KepcoinEarn>('earns', params, (normalized) => repository.getEarns(normalized));

export const useKepcoinSpends = (params?: KepcoinTransactionsQuery | null) =>
  useTransactions<KepcoinSpend>('spends', params, (normalized) => repository.getSpends(normalized));
