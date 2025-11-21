import {
  Duel,
  DuelPlayer,
  DuelReadyPlayer,
  DuelResults,
  DuelStatus,
  DuelProblem,
  DuelPreset,
} from '../../domain/entities/duel.entity.ts';
import { DuelsRatingRow } from '../../domain/entities/duels-rating.entity.ts';
import { PageResult } from '../../domain/ports/duels.repository.ts';

const mapPlayer = (payload: any): DuelPlayer => ({
  id: payload?.id ?? 0,
  username: payload?.username ?? '',
  status: payload?.status ?? 0,
  ratingTitle: payload?.ratingTitle ?? payload?.rating_title,
  balls: payload?.balls ?? 0,
});

const mapProblem = (payload: any): DuelProblem => ({
  symbol: payload?.symbol ?? '',
  ball: payload?.ball ?? 0,
  playerFirstBall: payload?.playerFirstBall ?? payload?.player_first_ball ?? 0,
  playerSecondBall: payload?.playerSecondBall ?? payload?.player_second_ball ?? 0,
  problem: payload?.problem ?? {},
});

const mapPreset = (payload: any): DuelPreset => ({
  id: payload?.id ?? 0,
  type: payload?.type ?? '',
  typeInfo: payload?.typeInfo ?? payload?.type_info ?? {},
  difficulty: payload?.difficulty ?? 0,
  difficultyDisplay: payload?.difficultyDisplay ?? payload?.difficulty_display ?? '',
  title: payload?.title ?? '',
  description: payload?.description ?? '',
  duration: payload?.duration ?? '',
  category: payload?.category ?? {},
  problemsCount: payload?.problemsCount ?? payload?.problems_count ?? 0,
  problems: payload?.problems ?? [],
});

export const mapDuel = (payload: any): Duel => ({
  id: payload?.id ?? 0,
  startTime: payload?.startTime ?? payload?.start_time ?? '',
  finishTime: payload?.finishTime ?? payload?.finish_time ?? null,
  status: (payload?.status as DuelStatus) ?? -1,
  isPlayer: Boolean(payload?.isPlayer ?? payload?.is_player ?? false),
  isConfirmed: payload?.isConfirmed ?? payload?.is_confirmed,
  playerFirst: mapPlayer(payload?.playerFirst ?? payload?.player_first ?? {}),
  playerSecond: payload?.playerSecond || payload?.player_second ? mapPlayer(payload?.playerSecond ?? payload?.player_second) : null,
  problems: (payload?.problems ?? []).map(mapProblem),
  duelPreset: payload?.duelPreset || payload?.duel_preset ? mapPreset(payload?.duelPreset ?? payload?.duel_preset) : null,
});

export const mapReadyStatus = (payload: any) => ({
  ready: Boolean(payload?.ready ?? false),
});

export const mapReadyPlayer = (payload: any): DuelReadyPlayer => ({
  username: payload?.username ?? '',
  fullName: payload?.fullName ?? payload?.full_name ?? '',
  avatar: payload?.avatar ?? '',
  wins: payload?.wins ?? 0,
  draws: payload?.draws ?? 0,
  losses: payload?.losses ?? 0,
});

export const mapDuelResults = (payload: any): DuelResults => ({
  playerFirst: payload?.playerFirst ?? payload?.player_first ?? [],
  playerSecond: payload?.playerSecond ?? payload?.player_second ?? [],
});

export const mapDuelsRatingRow = (payload: any): DuelsRatingRow => ({
  rowIndex: payload?.rowIndex ?? payload?.row_index,
  user: payload?.user ?? {},
  duels: payload?.duels ?? 0,
  wins: payload?.wins ?? 0,
  draws: payload?.draws ?? 0,
  losses: payload?.losses ?? 0,
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? payload?.data?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.pages_count ?? payload?.total_pages ?? 0,
  data: (payload?.data ?? []).map(mapItem),
});
