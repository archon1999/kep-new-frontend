import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  KepcoinEarn,
  KepcoinPaginatedResponse,
  KepcoinQueryParams,
  KepcoinSpend,
  KepcoinStreakInfo,
  PurchaseResponse,
} from '../domain/entities/kepcoin.entity';
import { HttpKepcoinRepository } from '../data-access/repository/http.kepcoin.repository';

const repository = new HttpKepcoinRepository();

interface UseKepcoinEntriesParams extends KepcoinQueryParams {
  enabled?: boolean;
}

const createKey = (prefix: string, params: KepcoinQueryParams) => [prefix, params.page ?? 1, params.pageSize ?? 10];

export const useKepcoinEarns = ({ enabled = true, ...params }: UseKepcoinEntriesParams) =>
  useSWR<KepcoinPaginatedResponse<KepcoinEarn>>(
    enabled ? createKey('kepcoin-earns', params) : null,
    () => repository.getUserKepcoinEarns(params),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

export const useKepcoinSpends = ({ enabled = true, ...params }: UseKepcoinEntriesParams) =>
  useSWR<KepcoinPaginatedResponse<KepcoinSpend>>(
    enabled ? createKey('kepcoin-spends', params) : null,
    () => repository.getUserKepcoinSpends(params),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

export const useKepcoinStreak = () =>
  useSWR<KepcoinStreakInfo>(
    ['kepcoin-streak'],
    () => repository.getStreakInfo(),
    {
      revalidateOnFocus: false,
    },
  );

export const usePurchaseStreakFreeze = () =>
  useSWRMutation<PurchaseResponse | null, any, string>(
    'purchase-streak-freeze',
    () => repository.purchaseStreakFreeze(),
  );
