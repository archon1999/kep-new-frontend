import {
  DuelList,
  DuelPlayer,
  TournamentDetail,
  TournamentList,
  TournamentStage,
  TournamentStageDuel,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { PageResult } from '../../domain/ports/tournaments.repository';
import { Tournament, TournamentDuel, TournamentListItem, TournamentPlayer, TournamentStage as DomainStage } from '../../domain/entities/tournament.entity';

const mapPlayer = (payload: DuelPlayer | any): TournamentPlayer => ({
  id: payload?.id ?? 0,
  username: payload?.username ?? '',
  ratingTitle: payload?.ratingTitle ?? payload?.rating_title ?? '',
  status: payload?.status ?? null,
  balls: payload?.balls ?? payload?.score ?? undefined,
});

const mapDuel = (payload: TournamentStageDuel | any): TournamentDuel => {
  const duel: DuelList | any = payload?.duel ?? payload;

  return {
    number: payload?.number ?? duel?.number ?? 0,
    status: duel?.status ?? 0,
    isConfirmed: duel?.isConfirmed ?? duel?.is_confirmed,
    isPlayer: duel?.isPlayer ?? duel?.is_player,
    startTime: duel?.startTime ?? duel?.start_time,
    finishTime: duel?.finishTime ?? duel?.finish_time,
    playerFirst: mapPlayer(duel?.playerFirst ?? duel?.player_first),
    playerSecond: mapPlayer(duel?.playerSecond ?? duel?.player_second),
  };
};

const mapStage = (payload: TournamentStage | any): DomainStage => ({
  title: payload?.title ?? payload?.name,
  number: payload?.number ?? 0,
  startTime: payload?.startTime ?? payload?.start_time,
  duels: Array.isArray(payload?.duels) ? payload.duels.map(mapDuel) : [],
});

export const mapTournamentListItem = (payload: TournamentList | any): TournamentListItem => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  description: payload?.description ?? '',
  startTime: payload?.startTime ?? payload?.start_time ?? '',
  type: payload?.type ?? payload?.tournament_type ?? '',
  playersCount: payload?.playersCount ?? payload?.players_count ?? 0,
});

export const mapTournament = (payload: TournamentDetail | any): Tournament => ({
  ...mapTournamentListItem(payload),
  players: Array.isArray(payload?.players) ? payload.players.map(mapPlayer) : [],
  stages: Array.isArray(payload?.stages) ? payload.stages.map(mapStage) : [],
  isRegistered: Boolean(payload?.isRegistered ?? payload?.is_registered ?? false),
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? payload?.data?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.pages_count ?? payload?.total_pages ?? 0,
  data: (payload?.data ?? []).map(mapItem),
});
