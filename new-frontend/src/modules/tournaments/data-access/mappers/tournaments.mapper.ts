import {
  TournamentDetail,
  TournamentList,
  TournamentPlayer as ApiTournamentPlayer,
  TournamentStage as ApiTournamentStage,
  TournamentStageDuel as ApiTournamentStageDuel,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  Tournament,
  TournamentDuel,
  TournamentDuelPlayer,
  TournamentStage,
  TournamentStageDuel,
  TournamentSummary,
} from '../../domain/entities/tournament.entity';
import { PageResult } from '../../domain/ports/tournaments.repository';

const mapTournamentPlayer = (payload: ApiTournamentPlayer): TournamentDuelPlayer => ({
  id: payload?.id ?? 0,
  username: payload?.username ?? '',
  ratingTitle: payload?.ratingTitle ?? payload?.rating_title ?? '',
  status: (payload as any)?.status ?? undefined,
  balls: (payload as any)?.balls ?? undefined,
});

const mapTournamentDuel = (payload: any): TournamentDuel => ({
  id: payload?.id,
  status: payload?.status,
  playerFirst: mapTournamentPlayer(payload?.playerFirst ?? payload?.player_first ?? {}),
  playerSecond: payload?.playerSecond || payload?.player_second ? mapTournamentPlayer(payload?.playerSecond ?? payload?.player_second) : null,
  presetTitle: payload?.preset?.title ?? payload?.duelPreset?.title ?? payload?.presetTitle,
  startTime: payload?.startTime ?? payload?.start_time ?? null,
  finishTime: payload?.finishTime ?? payload?.finish_time ?? null,
});

const mapTournamentStageDuel = (payload: ApiTournamentStageDuel): TournamentStageDuel => ({
  number: payload?.number ?? 0,
  duel: mapTournamentDuel(payload?.duel ?? {}),
});

const mapTournamentStage = (payload: ApiTournamentStage): TournamentStage => ({
  number: payload?.number ?? 0,
  title: payload?.title ?? '',
  startTime: payload?.startTime ?? payload?.start_time ?? null,
  duels: (payload?.duels ?? []).map(mapTournamentStageDuel),
});

export const mapTournamentSummary = (payload: TournamentList): TournamentSummary => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  type: payload?.type ?? '',
  startTime: payload?.startTime ?? payload?.start_time ?? '',
  playersCount: payload?.playersCount ?? payload?.players_count ?? 0,
});

export const mapTournament = (payload: TournamentDetail): Tournament => ({
  ...mapTournamentSummary(payload as any),
  description: payload?.description ?? '',
  isRegistered: Boolean(payload?.isRegistered ?? payload?.is_registered),
  players: (payload?.players ?? []).map(mapTournamentPlayer),
  stages: (payload?.stages ?? []).map(mapTournamentStage),
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  data: (payload?.data ?? payload?.results ?? []).map(mapItem),
  total: payload?.total ?? payload?.count ?? payload?.results?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.pages_count ?? payload?.total_pages ?? 0,
});
