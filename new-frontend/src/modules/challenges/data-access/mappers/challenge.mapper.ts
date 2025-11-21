import { hydrateQuestion } from 'modules/testing/data-access/mappers/test.mapper.ts';
import { Question, QuestionType } from 'modules/testing/domain';
import { PageResult } from '../../domain/ports/challenges.repository.ts';
import {
  Challenge,
  ChallengeCall,
  ChallengePlayer,
  ChallengeQuestion,
  ChallengeQuestionTimeType,
  ChallengeRatingChange,
  ChallengeRatingRow,
  ChallengeStatus,
} from '../../domain/index.ts';

const normalizePlayer = (payload: any): ChallengePlayer => ({
  username: payload?.username ?? '',
  result: payload?.result ?? 0,
  results: payload?.results ?? [],
  rating: payload?.rating ?? 0,
  newRating: payload?.newRating ?? payload?.new_rating ?? payload?.rating ?? 0,
  rankTitle: payload?.rankTitle ?? payload?.rank_title ?? '',
  newRankTitle: payload?.newRankTitle ?? payload?.new_rank_title ?? payload?.rankTitle ?? payload?.rank_title ?? '',
  delta: payload?.delta ?? 0,
});

const normalizeQuestion = (payload: any): Question => ({
  id: payload?.id,
  number: payload?.number ?? payload?.questionNumber ?? 0,
  type: (payload?.type ?? payload?.questionType) as QuestionType,
  text: payload?.text ?? payload?.title ?? payload?.question ?? '',
  options: (payload?.options ?? payload?.variants ?? []).map((option: any) => ({
    option: option?.option ?? option?.title ?? option?.text ?? '',
    optionMain: option?.optionMain ?? option?.option_main ?? option?.group ?? '',
    optionSecondary: option?.optionSecondary ?? option?.option_secondary ?? option?.value ?? option?.answer ?? '',
    selected: option?.selected ?? Boolean(option?.isSelected),
  })),
  input: payload?.input ?? payload?.answer ?? '',
  answered: payload?.answered ?? false,
});

const mapChallengeQuestion = (payload: any): ChallengeQuestion => ({
  number: payload?.number ?? payload?.questionNumber ?? 0,
  question: hydrateQuestion(normalizeQuestion(payload?.question ?? payload)),
});

export const mapChallenge = (payload: any): Challenge => {
  const challenge: Challenge = {
    id: payload?.id,
    playerFirst: normalizePlayer(payload?.playerFirst ?? payload?.player_first ?? {}),
    playerSecond: normalizePlayer(payload?.playerSecond ?? payload?.player_second ?? {}),
    finished: payload?.finished ?? payload?.finished_at ?? null,
    questionsCount: payload?.questionsCount ?? payload?.questions_count ?? payload?.questions?.length ?? 0,
    timeSeconds: payload?.timeSeconds ?? payload?.time_seconds ?? 0,
    rated: Boolean(payload?.rated ?? payload?.is_rated ?? false),
    questionTimeType: (payload?.questionTimeType ?? payload?.question_time_type ?? ChallengeQuestionTimeType.TimeToOne) as ChallengeQuestionTimeType,
    nextQuestion: payload?.nextQuestion ? mapChallengeQuestion(payload?.nextQuestion) : undefined,
    status: ChallengeStatus.NotStarted,
  };

  if (challenge.finished || (challenge.nextQuestion?.number ?? 0) > challenge.questionsCount) {
    challenge.status = ChallengeStatus.Finished;
  } else if ((challenge.nextQuestion?.number ?? 0) === 0) {
    challenge.status = ChallengeStatus.NotStarted;
  } else {
    challenge.status = ChallengeStatus.Already;
  }

  if (challenge.nextQuestion?.number && challenge.nextQuestion.number > 0) {
    for (let i = challenge.nextQuestion.number - 1; i < challenge.questionsCount; i += 1) {
      if (challenge.playerFirst.results[i] === 1) {
        challenge.playerFirst.result -= 1;
      }
      if (challenge.playerSecond.results[i] === 1) {
        challenge.playerSecond.result -= 1;
      }
      challenge.playerFirst.results[i] = -1;
      challenge.playerSecond.results[i] = -1;
    }
  }

  return challenge;
};

export const mapChallengeCall = (payload: any): ChallengeCall => ({
  id: payload?.id,
  username: payload?.username ?? payload?.user ?? '',
  rankTitle: payload?.rankTitle ?? payload?.rank_title ?? '',
  timeSeconds: payload?.timeSeconds ?? payload?.time_seconds ?? 0,
  questionsCount: payload?.questionsCount ?? payload?.questions_count ?? 0,
  chapters: payload?.chapters ?? [],
  created: payload?.created ?? payload?.created_at ?? '',
});

export const mapChallengeRating = (payload: any): ChallengeRatingRow => ({
  rowIndex: payload?.rowIndex ?? payload?.row_index ?? payload?.rank ?? 0,
  username: payload?.username ?? '',
  rating: payload?.rating ?? 0,
  rankTitle: payload?.rankTitle ?? payload?.rank_title ?? '',
  wins: payload?.wins ?? 0,
  draws: payload?.draws ?? 0,
  losses: payload?.losses ?? 0,
  all: payload?.all ?? payload?.count ?? 0,
});

export const mapChallengeRatingChange = (payload: any): ChallengeRatingChange => ({
  date: payload?.date ?? payload?.created ?? '',
  value: payload?.value ?? payload?.delta ?? payload?.change ?? 0,
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? payload?.current_page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.results?.length ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.total_pages ?? payload?.pages_count ?? 0,
  data: (payload?.data ?? payload?.results ?? []).map(mapItem),
});

export const challengesMappers = {
  mapChallenge,
  mapChallengeCall,
  mapChallengeRating,
  mapChallengeRatingChange,
  mapPageResult,
};
