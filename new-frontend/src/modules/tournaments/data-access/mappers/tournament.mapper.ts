import {
  DuelList,
  DuelPlayer,
  TournamentDetail,
  TournamentList,
  TournamentStage,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  Tournament,
  TournamentDuel,
  TournamentDuelPlayer,
  TournamentListItem,
  TournamentStage as TournamentStageEntity,
} from '../../domain/entities/tournament.entity';
import { PageResult } from '../../domain/ports/tournaments.repository';

const mapPlayer = (payload: DuelPlayer): TournamentDuelPlayer => ({
  id: payload?.id ?? 0,
  username: payload?.username ?? '',
  ratingTitle: payload?.ratingTitle ?? (payload as any)?.rating_title ?? '',
  status: payload?.status ?? (payload as any)?.status ?? null,
  balls: payload?.balls ?? (payload as any)?.balls,
});

const mapDuel = (payload: DuelList): TournamentDuel => ({
  number: (payload as any)?.number ?? 0,
  startTime: payload?.startTime ?? (payload as any)?.start_time ?? null,
  finishTime: payload?.finishTime ?? (payload as any)?.finish_time ?? null,
  status: payload?.status ?? (payload as any)?.status ?? 0,
  isConfirmed: payload?.isConfirmed ?? (payload as any)?.is_confirmed ?? false,
  presetDifficulty: (payload as any)?.preset?.difficulty ?? null,
  playerFirst: mapPlayer(payload?.playerFirst ?? (payload as any)?.player_first ?? (payload as any)?.player1 ?? {}),
  playerSecond: mapPlayer(payload?.playerSecond ?? (payload as any)?.player_second ?? (payload as any)?.player2 ?? {}),
});

const mapStage = (payload: TournamentStage): TournamentStageEntity => ({
  title: payload?.title ?? (payload as any)?.title ?? '',
  number: payload?.number ?? (payload as any)?.number ?? 0,
  startTime: payload?.startTime ?? (payload as any)?.start_time ?? null,
  duels: (payload as any)?.duels?.map((stageDuel: any) =>
    mapDuel(stageDuel?.duel ?? stageDuel),
  ) ?? [],
});

export const mapTournamentListItem = (payload: TournamentList): TournamentListItem => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  type: payload?.type ?? (payload as any)?.type ?? '',
  startTime: payload?.startTime ?? (payload as any)?.start_time ?? '',
  playersCount: payload?.playersCount ?? (payload as any)?.players_count ?? 0,
});

export const mapTournament = (payload: TournamentDetail): Tournament => ({
  ...mapTournamentListItem(payload as any),
  description: payload?.description ?? (payload as any)?.description ?? '',
  players: (payload?.players as any[])?.map(mapPlayer) ?? [],
  stages: (payload?.stages as any[])?.map(mapStage) ?? [],
  isRegistered: Boolean(payload?.isRegistered ?? (payload as any)?.is_registered ?? false),
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? payload?.data?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.pages_count ?? payload?.total_pages ?? 0,
  data: (payload?.data ?? []).map(mapItem),
});
