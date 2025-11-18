import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { HttpKepcoinRepository } from '../data-access/repository/http.kepcoin.repository';
import { KepcoinListParams } from '../domain/ports/kepcoin.repository';

const repository = new HttpKepcoinRepository();

export const useKepcoinBalance = () =>
  useSWR(['kepcoin', 'balance'], () => repository.getBalance(), {
    suspense: false,
    revalidateOnFocus: false,
  });

export const useKepcoinStreak = () =>
  useSWR(['kepcoin', 'streak'], () => repository.getStreak(), {
    suspense: false,
    revalidateOnFocus: false,
  });

export const useKepcoinEarns = (params?: KepcoinListParams | null) =>
  useSWR(params ? ['kepcoin', 'earns', params] : null, () => repository.getEarns(params || {}), {
    suspense: false,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

export const useKepcoinSpends = (params?: KepcoinListParams | null) =>
  useSWR(params ? ['kepcoin', 'spends', params] : null, () => repository.getSpends(params || {}), {
    suspense: false,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

export const usePurchaseStreakFreeze = () =>
  useSWRMutation(['kepcoin', 'purchase-streak-freeze'], () => repository.purchaseStreakFreeze());
