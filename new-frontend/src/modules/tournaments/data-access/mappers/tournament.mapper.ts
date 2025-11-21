import {
  ApiTournamentsList200,
  TournamentDetail as TournamentDetailDto,
  TournamentList,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  TournamentBracketData,
  TournamentBracketMatch,
  TournamentDetail,
  TournamentListItem,
  TournamentPlayer,
  TournamentStage,
} from '../../domain/entities/tournament.entity';
import { PageResult } from '../../domain/ports/tournaments.repository';

export const mapTournamentListItem = (payload: TournamentList): TournamentListItem => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  type: payload?.type ?? 'LessCode',
  startTime: payload?.startTime ?? '',
  playersCount: payload?.playersCount ?? 0,
});

export const mapTournamentDetail = (payload: TournamentDetailDto): TournamentDetail => ({
  ...mapTournamentListItem({
    id: payload?.id,
    playersCount: (payload?.players ?? []).length,
    startTime: payload?.startTime,
    title: payload?.title,
    type: payload?.type,
  }),
  description: payload?.description ?? '',
  players: (payload?.players ?? []) as TournamentPlayer[],
  stages: (payload?.stages ?? []) as TournamentStage[],
  isRegistered: Boolean(payload?.isRegistered ?? false),
});

export const mapPageResult = <T>(payload: ApiTournamentsList200, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? 1,
  pageSize: payload?.pageSize ?? (payload as any)?.page_size ?? (payload as any)?.per_page ?? 0,
  count: payload?.count ?? (payload as any)?.count ?? 0,
  total: payload?.total ?? payload?.count ?? (payload as any)?.total ?? 0,
  pagesCount: payload?.pagesCount ?? (payload as any)?.pages_count ?? (payload as any)?.total_pages ?? 0,
  data: Array.isArray((payload as any)?.results ?? payload?.results ?? [])
    ? ((payload as any)?.results ?? payload?.results ?? []).map(mapItem)
    : [],
});

const getNearestPowTwo = (value: number) => {
  let size = 1;
  while (size < value) {
    size *= 2;
  }
  return size;
};

export const buildBracketMatches = (stages: TournamentStage[]): TournamentBracketMatch[][] => {
  if (!stages?.length) return [];
  const sortedStages = [...stages].sort((a, b) => a.number - b.number);
  const stageCount = sortedStages.length;

  return sortedStages.map((stage, index) => {
    const roundIndex = stageCount - index;
    return stage.duels.map((duel) => ({
      id: `${stage.number}-${duel.number}`,
      round: roundIndex,
      status: duel.duel?.status ?? null,
      opponents: [
        {
          id: duel.duel?.playerFirst?.id ?? null,
          name: duel.duel?.playerFirst?.username ?? 'TBD',
          ratingTitle: duel.duel?.playerFirst?.ratingTitle,
          score: duel.duel?.playerFirst?.balls ?? null,
          result: duel.duel?.playerFirst?.status != null
            ? ['loss', 'draw', 'win'][(duel.duel.playerFirst.status as number) + 1]
            : undefined,
          status: duel.duel?.playerFirst?.status,
        },
        {
          id: duel.duel?.playerSecond?.id ?? null,
          name: duel.duel?.playerSecond?.username ?? 'TBD',
          ratingTitle: duel.duel?.playerSecond?.ratingTitle,
          score: duel.duel?.playerSecond?.balls ?? null,
          result: duel.duel?.playerSecond?.status != null
            ? ['loss', 'draw', 'win'][(duel.duel.playerSecond.status as number) + 1]
            : undefined,
          status: duel.duel?.playerSecond?.status,
        },
      ],
    }));
  });
};

export const buildParticipantImages = (players: TournamentPlayer[]): TournamentBracketData['participantImages'] =>
  players.map((player) => ({
    participantId: player.id,
    imageUrl: `/assets/images/contests/ratings/${player.ratingTitle.toLowerCase()}.png`,
  }));

export const normalizeBracketRounds = (
  matches: TournamentBracketMatch[][],
  playersCount: number,
): TournamentBracketMatch[][] => {
  const size = Math.max(16, getNearestPowTwo(playersCount || 16));
  const roundCount = Math.log2(size);
  const normalized = Array.from({ length: roundCount }, () => [] as TournamentBracketMatch[]);

  matches.forEach((roundMatches, index) => {
    const targetIndex = Math.min(roundCount - 1, index);
    normalized[targetIndex].push(...roundMatches);
  });

  return normalized.map((round, index) => {
    const neededMatches = size / Math.pow(2, index + 1);
    if (round.length >= neededMatches) return round;

    const filled = [...round];
    for (let i = round.length; i < neededMatches; i += 1) {
      filled.push({
        id: `placeholder-${index}-${i}`,
        round: roundCount - index,
        status: null,
        opponents: [
          { id: null, name: 'TBD' },
          { id: null, name: 'TBD' },
        ],
      });
    }
    return filled;
  });
};
