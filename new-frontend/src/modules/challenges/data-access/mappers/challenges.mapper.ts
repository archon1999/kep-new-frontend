import {
  ApiChallengesList200,
  ApiChallengesRatingList200,
  Challenge as ApiChallenge,
  ChallengeCall as ApiChallengeCall,
  ChallengesRating as ApiChallengesRating,
} from 'shared/api/orval/generated/endpoints';
import { Challenge, ChallengeParticipant, ChallengesListResponse } from '../../domain/entities/challenge.entity';
import { ChallengeCall, ChallengeCallChapter } from '../../domain/entities/challenge-call.entity';
import { ChallengesRating, ChallengesRatingListResponse } from '../../domain/entities/challenges-rating.entity';

const mapChallengeParticipant = (participant: ApiChallenge['playerFirst']): ChallengeParticipant => ({
  username: participant.username,
  rating: Number(participant.rating),
  rankTitle: participant.rankTitle,
  result: participant.result,
  delta: participant.delta ? Number(participant.delta) : undefined,
  newRating: participant.newRating,
  newRankTitle: participant.newRankTitle,
});

export const mapApiChallengeToDomain = (challenge: ApiChallenge): Challenge => ({
  id: Number(challenge.id),
  finished: challenge.finished,
  questionsCount: challenge.questionsCount,
  timeSeconds: challenge.timeSeconds,
  rated: challenge.rated,
  questionTimeType: challenge.questionTimeType,
  playerFirst: mapChallengeParticipant(challenge.playerFirst),
  playerSecond: mapChallengeParticipant(challenge.playerSecond),
});

export const mapApiChallengeCallToDomain = (challengeCall: ApiChallengeCall): ChallengeCall => ({
  id: Number(challengeCall.id),
  username: challengeCall.username,
  rankTitle: challengeCall.rankTitle,
  timeSeconds: challengeCall.timeSeconds,
  questionsCount: challengeCall.questionsCount,
  chapters: (challengeCall.chapters || []).map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
  })) as ChallengeCallChapter[],
  created: challengeCall.created,
});

export const mapApiChallengesListToDomain = (response: ApiChallengesList200): ChallengesListResponse => ({
  data: response.data.map(mapApiChallengeToDomain),
  page: response.page,
  pageSize: response.pageSize,
  count: response.count,
  total: response.total,
  pagesCount: response.pagesCount,
});

export const mapApiChallengesRatingToDomain = (
  rating: ApiChallengesRating,
): ChallengesRating => ({
  username: rating.username,
  rankTitle: rating.rankTitle,
  rating: rating.rating ? Number(rating.rating) : undefined,
  wins: rating.wins,
  draws: rating.draws,
  losses: rating.losses,
});

export const mapApiChallengesRatingListToDomain = (
  response: ApiChallengesRatingList200,
): ChallengesRatingListResponse => ({
  data: response.data.map(mapApiChallengesRatingToDomain),
  page: response.page,
  pageSize: response.pageSize,
  count: response.count,
  total: response.total,
  pagesCount: response.pagesCount,
});
