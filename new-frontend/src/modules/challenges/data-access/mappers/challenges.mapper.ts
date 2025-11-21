import type {
  ApiChallengesList200,
  Challenge as ApiChallenge,
  ChallengePlayer as ApiChallengePlayer,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import type {
  Challenge,
  ChallengePlayer,
  ChallengesListResponse,
} from '../../domain/entities/challenge.entity';

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const mapChallengePlayer = (player: ApiChallengePlayer): ChallengePlayer => ({
  username: player.username,
  rating: parseNumber(player.rating),
  newRating: parseNumber(player.newRating),
  result: parseNumber(player.result),
  results: player.results,
  rankTitle: player.rankTitle,
  newRankTitle: player.newRankTitle,
  delta: parseNumber(player.delta),
});

export const mapChallenge = (challenge: ApiChallenge): Challenge => ({
  id: challenge.id,
  playerFirst: mapChallengePlayer(challenge.playerFirst),
  playerSecond: mapChallengePlayer(challenge.playerSecond),
  finished: challenge.finished ?? undefined,
  questionsCount: challenge.questionsCount,
  timeSeconds: challenge.timeSeconds,
  rated: challenge.rated,
  questionTimeType: challenge.questionTimeType,
});

export const mapChallengesList = (response: ApiChallengesList200): ChallengesListResponse => ({
  page: response.page,
  pageSize: response.pageSize,
  count: response.count,
  total: response.total,
  pagesCount: response.pagesCount,
  data: response.data.map(mapChallenge),
});
