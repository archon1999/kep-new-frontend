import useSWR from 'swr';
import { HttpDuelsRepository } from '../data-access/repository/http.duels.repository.ts';
import { Duel, DuelReadyPlayer, DuelReadyStatus, DuelResults } from '../domain/entities/duel.entity.ts';
import { DuelsRatingRow } from '../domain/entities/duels-rating.entity.ts';
import { DuelListFilters, DuelReadyPlayersFilters, PageResult } from '../domain/ports/duels.repository.ts';

const duelsRepository = new HttpDuelsRepository();

export const useDuelDetails = (duelId?: number | string) =>
  useSWR<Duel>(duelId ? ['duel-details', duelId] : null, () => duelsRepository.getDuel(duelId!));

export const useDuelResults = (duelId?: number | string, enabled = true) =>
  useSWR<DuelResults>(duelId && enabled ? ['duel-results', duelId] : null, () => duelsRepository.getDuelResults(duelId!), {
    refreshInterval: 5000,
  });

export const useDuelsList = (filters?: DuelListFilters) =>
  useSWR<PageResult<Duel>>(
    filters ? ['duels-list', filters] : ['duels-list'],
    () => (filters?.my ? duelsRepository.listMyDuels(filters) : duelsRepository.listDuels(filters)),
    { keepPreviousData: true },
  );

export const useDuelsRating = (filters?: DuelListFilters) =>
  useSWR<PageResult<DuelsRatingRow>>(
    filters ? ['duels-rating', filters] : ['duels-rating'],
    () => duelsRepository.listDuelsRating(filters),
    { keepPreviousData: true },
  );

export const useReadyStatus = () => useSWR<DuelReadyStatus>('duels-ready-status', () => duelsRepository.getReadyStatus());

export const useReadyPlayers = (filters?: DuelReadyPlayersFilters) =>
  useSWR<PageResult<DuelReadyPlayer>>(
    filters ? ['duels-ready-players', filters] : ['duels-ready-players'],
    () => duelsRepository.listReadyPlayers(filters),
    { keepPreviousData: true },
  );

export const duelsQueries = {
  duelsRepository,
};
