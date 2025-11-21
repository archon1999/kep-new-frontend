import useSWR from 'swr';
import { duelsRepository } from '../data-access/repository/http.duels.repository.ts';
import { Duel, DuelReadyPlayer, DuelReadyStatus, DuelsRatingRow } from '../domain';
import {
  DuelListParams,
  DuelsRatingParams,
  PageResult,
  ReadyPlayersParams,
} from '../domain/ports/duels.repository.ts';

export const useDuelReadyStatus = () =>
  useSWR<DuelReadyStatus>('duels-ready-status', () => duelsRepository.getReadyStatus());

export const useReadyPlayers = (params?: ReadyPlayersParams) =>
  useSWR<PageResult<DuelReadyPlayer>>(
    ['duels-ready-players', params?.page, params?.pageSize],
    () => duelsRepository.listReadyPlayers(params),
  );

export const useDuels = (params?: DuelListParams) =>
  useSWR<PageResult<Duel>>(['duels', params?.page, params?.pageSize, params?.username], () =>
    duelsRepository.listDuels(params),
  );

export const useMyDuels = (params?: DuelListParams) =>
  useSWR<PageResult<Duel>>(['duels-my', params?.page, params?.pageSize], () =>
    duelsRepository.listMyDuels(params),
  );

export const useDuelsRating = (params?: DuelsRatingParams) =>
  useSWR<PageResult<DuelsRatingRow>>(
    ['duels-rating', params?.page, params?.pageSize, params?.ordering],
    () => duelsRepository.listDuelsRating(params),
  );

export const useDuelDetail = (duelId?: number | string) =>
  useSWR<Duel>(duelId ? ['duels-detail', duelId] : null, () => duelsRepository.getDuel(duelId!));

export const duelsQueries = {
  duelsRepository,
};
