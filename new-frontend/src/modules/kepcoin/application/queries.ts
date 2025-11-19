import useSWR from 'swr';
import { HttpKepcoinRepository } from '../data-access/repository/http.kepcoin.repository';
import type {
  KepcoinEarnHistoryItem,
  KepcoinHistoryResponse,
  KepcoinSpendHistoryItem,
  KepcoinSummary,
} from '../domain/entities/kepcoin.entity';

const repository = new HttpKepcoinRepository();

export const useKepcoinSummary = () =>
  useSWR<KepcoinSummary>(['kepcoin-summary'], () => repository.getSummary(), {
    revalidateOnFocus: false,
  });

export const useKepcoinEarnHistory = (page: number, pageSize: number, enabled = true) =>
  useSWR<KepcoinHistoryResponse<KepcoinEarnHistoryItem>>(
    enabled ? ['kepcoin-earns', page, pageSize] : null,
    () => repository.getEarnHistory({ page, pageSize }),
    { keepPreviousData: true },
  );

export const useKepcoinSpendHistory = (page: number, pageSize: number, enabled = true) =>
  useSWR<KepcoinHistoryResponse<KepcoinSpendHistoryItem>>(
    enabled ? ['kepcoin-spends', page, pageSize] : null,
    () => repository.getSpendHistory({ page, pageSize }),
    { keepPreviousData: true },
  );
