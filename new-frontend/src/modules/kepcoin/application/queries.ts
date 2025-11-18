import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { HttpKepcoinRepository } from '../data-access/repository/http.kepcoin.repository';
import {
  ApiKepcoinEarnsListParams,
  ApiKepcoinSpendsListParams,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { normalizeError, notifyError } from 'shared/api';

const repository = new HttpKepcoinRepository();

export const useKepcoinBalance = () =>
  useSWR(['kepcoin', 'balance'], () => repository.getBalance(), {
    suspense: false,
    revalidateOnFocus: false,
  });

export const useKepcoinTodayStats = () =>
  useSWR(['kepcoin', 'today'], () => repository.getTodayStats(), {
    suspense: false,
    revalidateOnFocus: false,
  });

export const useKepcoinStreak = () =>
  useSWR(['kepcoin', 'streak'], () => repository.getStreak(), {
    suspense: false,
    revalidateOnFocus: false,
  });

export const useKepcoinEarns = (params?: ApiKepcoinEarnsListParams | null) =>
  useSWR(
    params ? ['kepcoin', 'earns', params?.page ?? 1, params?.pageSize ?? 10] : null,
    () => repository.getEarns(params ?? undefined),
    {
      suspense: false,
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

export const useKepcoinSpends = (params?: ApiKepcoinSpendsListParams | null) =>
  useSWR(
    params ? ['kepcoin', 'spends', params?.page ?? 1, params?.pageSize ?? 10] : null,
    () => repository.getSpends(params ?? undefined),
    {
      suspense: false,
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

export const usePurchaseStreakFreeze = () =>
  useSWRMutation(['kepcoin', 'purchase-streak-freeze'], () => repository.purchaseStreakFreeze(), {
    throwOnError: false,
    onError: (error) => notifyError(normalizeError(error)),
  });
