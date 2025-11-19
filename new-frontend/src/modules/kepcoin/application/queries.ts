import useSWR, { SWRConfiguration } from 'swr';
import { HttpKepcoinRepository } from '../data-access/repository/http.kepcoin.repository';
import type {
  KepcoinEarn,
  KepcoinHistoryPage,
  KepcoinHistoryQueryParams,
  KepcoinSpend,
} from '../domain/entities/kepcoin-history.entity';
import type { KepcoinBalance, KepcoinStreak } from '../domain/entities/kepcoin-streak.entity';

const repository = new HttpKepcoinRepository();

const getHistoryKey = (type: 'earns' | 'spends', params: Required<KepcoinHistoryQueryParams>) => [
  'kepcoin',
  type,
  params.page,
  params.pageSize,
];

const normalizeParams = (params?: KepcoinHistoryQueryParams): Required<KepcoinHistoryQueryParams> => ({
  page: params?.page ?? 1,
  pageSize: params?.pageSize ?? 10,
});

export const useKepcoinBalance = (options?: { enabled?: boolean } & SWRConfiguration<KepcoinBalance>) => {
  const shouldFetch = options?.enabled ?? true;
  return useSWR<KepcoinBalance>(shouldFetch ? ['kepcoin', 'balance'] : null, () => repository.getBalance(), {
    revalidateOnFocus: false,
    ...options,
  });
};

export const useKepcoinStreak = (options?: { enabled?: boolean } & SWRConfiguration<KepcoinStreak>) => {
  const shouldFetch = options?.enabled ?? true;
  return useSWR<KepcoinStreak>(shouldFetch ? ['kepcoin', 'streak'] : null, () => repository.getStreak(), {
    revalidateOnFocus: false,
    ...options,
  });
};

export const useKepcoinEarns = (
  params?: KepcoinHistoryQueryParams,
  options?: { enabled?: boolean } & SWRConfiguration<KepcoinHistoryPage<KepcoinEarn>>,
) => {
  const normalized = normalizeParams(params);
  const shouldFetch = options?.enabled ?? true;

  return useSWR<KepcoinHistoryPage<KepcoinEarn>>(
    shouldFetch ? getHistoryKey('earns', normalized) : null,
    () => repository.getEarns(normalized),
    {
      keepPreviousData: true,
      ...options,
    },
  );
};

export const useKepcoinSpends = (
  params?: KepcoinHistoryQueryParams,
  options?: { enabled?: boolean } & SWRConfiguration<KepcoinHistoryPage<KepcoinSpend>>,
) => {
  const normalized = normalizeParams(params);
  const shouldFetch = options?.enabled ?? true;

  return useSWR<KepcoinHistoryPage<KepcoinSpend>>(
    shouldFetch ? getHistoryKey('spends', normalized) : null,
    () => repository.getSpends(normalized),
    {
      keepPreviousData: true,
      ...options,
    },
  );
};
