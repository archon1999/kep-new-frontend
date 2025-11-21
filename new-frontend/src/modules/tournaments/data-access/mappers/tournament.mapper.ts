import dayjs from 'dayjs';
import {
  TournamentDetail as TournamentDetailDto,
  TournamentList as TournamentListDto,
  TournamentStage as TournamentStageDto,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { Tournament, TournamentDuel, TournamentListItem, TournamentPlayer, TournamentStage } from '../../domain/entities/tournament.entity';
import { PageResult } from '../../domain/ports/tournaments.repository';

const mapPlayer = (payload: any): TournamentPlayer => ({
  id: payload?.id ?? 0,
  username: payload?.username ?? '',
  ratingTitle: payload?.ratingTitle ?? payload?.rating_title ?? '',
  status: payload?.status ?? null,
  balls: payload?.balls ?? null,
});

const mapDuel = (payload: any): TournamentDuel => ({
  id: payload?.duel?.id ?? payload?.id,
  status: payload?.duel?.status ?? payload?.status,
  playerFirst: mapPlayer(payload?.duel?.playerFirst ?? payload?.playerFirst),
  playerSecond: payload?.duel?.playerSecond ? mapPlayer(payload?.duel?.playerSecond) : undefined,
  presetTitle: payload?.duel?.preset?.title ?? payload?.preset?.title,
  startTime: payload?.duel?.startTime ?? payload?.start_time ?? payload?.duel?.start_time ?? null,
  finishTime: payload?.duel?.finishTime ?? payload?.finish_time ?? payload?.duel?.finish_time ?? null,
});

const mapStage = (payload: TournamentStageDto): TournamentStage => ({
  number: payload?.number ?? 0,
  title: payload?.title ?? '',
  startTime: payload?.startTime ?? (payload as any)?.start_time ?? null,
  duels: (payload?.duels ?? []).map(mapDuel),
});

export const mapTournamentListItem = (payload: TournamentListDto): TournamentListItem => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  type: payload?.type ?? '',
  startTime: payload?.startTime ?? (payload as any)?.start_time ?? '',
  playersCount: payload?.playersCount ?? (payload as any)?.players_count ?? 0,
});

export const mapTournamentDetail = (payload: TournamentDetailDto): Tournament => ({
  ...mapTournamentListItem(payload as any),
  description: payload?.description ?? '',
  players: (payload?.players ?? []).map(mapPlayer),
  stages: (payload?.stages ?? []).map(mapStage).sort((a, b) => a.number - b.number),
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

export const getRoundLabel = (roundIndex: number, totalRounds: number) => {
  if (roundIndex === totalRounds - 1) return { key: 'tournaments.final' } as const;
  if (roundIndex === totalRounds - 2) return { key: 'tournaments.semifinals' } as const;
  if (roundIndex === totalRounds - 3) return { key: 'tournaments.quarterfinals' } as const;

  const denominator = 2 ** (totalRounds - roundIndex - 1);
  return { key: 'tournaments.roundOf', value: denominator } as const;
};

export const normalizePlayersToPairs = (players: TournamentPlayer[], pairSize = 2) => {
  const paddedPlayers = [...players];
  while (paddedPlayers.length % pairSize !== 0) {
    paddedPlayers.push({ id: -1 * (paddedPlayers.length + 1), username: '', ratingTitle: '' });
  }

  const pairs: TournamentDuel[] = [];
  for (let i = 0; i < paddedPlayers.length; i += pairSize) {
    pairs.push({
      playerFirst: paddedPlayers[i],
      playerSecond: paddedPlayers[i + 1],
    });
  }
  return pairs;
};

export const buildInitialStagesFromPlayers = (players: TournamentPlayer[]) => {
  const pairs = normalizePlayersToPairs(players, 2);
  return [
    {
      number: 1,
      title: '',
      startTime: dayjs().toISOString(),
      duels: pairs,
    },
  ];
};
