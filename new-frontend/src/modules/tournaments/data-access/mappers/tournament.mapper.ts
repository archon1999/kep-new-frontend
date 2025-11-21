import {
  ApiTournamentsList200,
  DuelList,
  TournamentDetail,
  TournamentList,
  TournamentPlayer as ApiTournamentPlayer,
  TournamentStage,
  TournamentStageDuel,
} from 'shared/api/orval/generated/endpoints/index.schemas.ts';
import {
  Tournament,
  TournamentDuel,
  TournamentDuelPlayer,
  TournamentListItem,
  TournamentPlayer,
} from '../../domain/entities/tournament.entity.ts';
import { PageResult } from '../../domain/ports/tournaments.repository.ts';

const toBoolean = (value: unknown) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  if (typeof value === 'number') return value === 1;
  return Boolean(value);
};

const mapDuelPlayer = (player?: ApiTournamentPlayer | null): TournamentDuelPlayer | null => {
  if (!player) return null;

  return {
    id: player.id,
    username: player.username,
    ratingTitle: player.ratingTitle,
    status: typeof player.status === 'number' || player.status === null ? player.status : null,
    balls: player.balls,
  };
};

const mapDuel = (duel?: DuelList | null): TournamentDuel | null => {
  if (!duel) return null;

  return {
    id: duel.id ?? 0,
    status: duel.status,
    startTime: duel.startTime ?? null,
    finishTime: duel.finishTime ?? null,
    playerFirst: mapDuelPlayer(duel.playerFirst)!,
    playerSecond: mapDuelPlayer(duel.playerSecond),
  };
};

const mapTournamentPlayer = (player: ApiTournamentPlayer): TournamentPlayer => ({
  id: player.id,
  username: player.username,
  ratingTitle: player.ratingTitle,
});

const mapStageDuel = (stageDuel: TournamentStageDuel) => ({
  number: stageDuel.number,
  duel: mapDuel(stageDuel.duel),
});

const mapStage = (stage: TournamentStage) => ({
  number: stage.number,
  title: stage.title ?? '',
  startTime: stage.startTime ?? null,
  duels: stage.duels?.map(mapStageDuel) ?? [],
});

export const mapTournamentListItem = (tournament: TournamentList): TournamentListItem => ({
  id: tournament.id ?? 0,
  title: tournament.title,
  type: tournament.type,
  startTime: tournament.startTime,
  playersCount: tournament.playersCount,
});

export const mapTournament = (tournament: TournamentDetail): Tournament => ({
  id: tournament.id ?? 0,
  title: tournament.title,
  description: tournament.description,
  type: tournament.type,
  startTime: tournament.startTime,
  isRegistered: toBoolean(tournament.isRegistered),
  players: (tournament.players ?? []).map(mapTournamentPlayer),
  stages: (tournament.stages ?? []).map(mapStage),
});

export const mapPageResult = <T>(data: ApiTournamentsList200, mapItem: (item: TournamentList) => T): PageResult<T> => ({
  page: data.page,
  pageSize: data.pageSize,
  count: data.count,
  total: data.total,
  pagesCount: data.pagesCount,
  data: data.data?.map(mapItem) ?? [],
});
