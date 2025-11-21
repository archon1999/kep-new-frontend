import {
  DuelList,
  DuelPlayer,
  TournamentDetail as ApiTournamentDetail,
  TournamentList,
  TournamentPlayer as ApiTournamentPlayer,
  TournamentStage as ApiTournamentStage,
  TournamentStageDuel as ApiTournamentStageDuel,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  TournamentDetail,
  TournamentDuel,
  TournamentListItem,
  TournamentPlayer,
  TournamentStage,
  TournamentStageDuel,
} from '../../domain/entities/tournament.entity';
import { PageResult } from '../../domain/ports/tournaments.repository';

const mapPlayer = (player?: ApiTournamentPlayer | DuelPlayer | null): TournamentPlayer => ({
  id: player?.id ?? 0,
  username: player?.username ?? '---',
  ratingTitle: player?.ratingTitle ?? '',
  status: (player as DuelPlayer | undefined)?.status ?? null,
  balls: (player as DuelPlayer | undefined)?.balls ?? undefined,
});

const mapDuel = (duel?: DuelList | null): TournamentDuel => ({
  id: duel?.id,
  startTime: duel?.startTime ?? duel?.start_time,
  finishTime: duel?.finishTime ?? duel?.finish_time,
  status: duel?.status ?? 0,
  playerFirst: mapPlayer(duel?.playerFirst ?? (duel as any)?.player_first),
  playerSecond: duel?.playerSecond ? mapPlayer(duel.playerSecond) : null,
});

const mapStageDuel = (stageDuel: ApiTournamentStageDuel): TournamentStageDuel => ({
  number: stageDuel?.number ?? 0,
  duel: mapDuel(stageDuel?.duel),
});

const mapStage = (stage: ApiTournamentStage): TournamentStage => ({
  title: stage?.title,
  number: stage?.number ?? 0,
  startTime: stage?.startTime ?? stage?.start_time,
  duels: Array.isArray(stage?.duels) ? stage.duels.map(mapStageDuel) : [],
});

export const mapTournament = (payload: TournamentList): TournamentListItem => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  type: payload?.type ?? '',
  startTime: payload?.startTime ?? payload?.start_time ?? '',
  playersCount: payload?.playersCount ?? payload?.players_count ?? 0,
});

export const mapTournamentDetail = (payload: ApiTournamentDetail): TournamentDetail => ({
  ...mapTournament(payload as any),
  description: payload?.description ?? '',
  players: Array.isArray(payload?.players) ? payload.players.map(mapPlayer) : [],
  stages: Array.isArray(payload?.stages) ? payload.stages.map(mapStage) : [],
  isRegistered: Boolean(payload?.isRegistered ?? payload?.is_registered),
});

export const mapPageResult = <T>(data: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: data?.page ?? 1,
  pageSize: data?.pageSize ?? data?.page_size ?? 0,
  count: data?.count ?? data?.results?.length ?? 0,
  total: data?.total ?? data?.count ?? 0,
  pagesCount: data?.pagesCount ?? data?.pages_count ?? 0,
  data: Array.isArray(data?.data)
    ? data.data.map(mapItem)
    : Array.isArray(data?.results)
      ? data.results.map(mapItem)
      : [],
});
