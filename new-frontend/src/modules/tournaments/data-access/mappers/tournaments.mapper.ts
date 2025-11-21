import { ApiTournamentsList200, TournamentDetail } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  Tournament,
  TournamentListItem,
  TournamentPlayer,
  TournamentStage,
  TournamentStageDuel,
} from '../../domain/entities/tournament.entity';
import { PageResult } from '../../domain/ports/tournaments.repository';

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

const mapTournamentPlayer = (player?: any): TournamentPlayer => ({
  id: player?.id ?? 0,
  username: player?.username ?? '',
  ratingTitle: player?.ratingTitle ?? '',
  status: player?.status ?? undefined,
  balls: player?.balls ?? undefined,
});

const mapStageDuel = (stageDuel?: any): TournamentStageDuel => ({
  number: stageDuel?.number ?? 0,
  duel: stageDuel?.duel
    ? {
      playerFirst: mapTournamentPlayer(stageDuel.duel.playerFirst),
      playerSecond: stageDuel.duel.playerSecond ? mapTournamentPlayer(stageDuel.duel.playerSecond) : undefined,
      status: stageDuel.duel.status,
    }
    : undefined,
});

const mapStage = (stage: any, index: number): TournamentStage => ({
  number: stage?.number ?? index,
  title: stage?.title ?? undefined,
  startTime: stage?.startTime ?? stage?.start_time ?? null,
  duels: Array.isArray(stage?.duels) ? stage.duels.map(mapStageDuel) : [],
});

const mapTournamentListItem = (item: any): TournamentListItem => ({
  id: item?.id ?? 0,
  title: item?.title ?? '',
  type: item?.type ?? '',
  startTime: item?.startTime ?? item?.start_time ?? '',
  playersCount: item?.playersCount ?? item?.players_count ?? 0,
});

export const mapTournament = (detail: TournamentDetail): Tournament => ({
  ...mapTournamentListItem(detail),
  description: detail.description,
  players: Array.isArray(detail.players) ? detail.players.map(mapTournamentPlayer) : [],
  stages: Array.isArray(detail.stages) ? detail.stages.map(mapStage) : [],
  isRegistered: detail.isRegistered === true || detail.isRegistered === 'true',
});

export const mapTournamentsPage = (data: ApiTournamentsList200): PageResult<TournamentListItem> =>
  mapPageResult<TournamentListItem>(data, mapTournamentListItem);
