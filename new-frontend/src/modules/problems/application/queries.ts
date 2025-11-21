import useSWR from 'swr';
import { HttpProblemsRepository } from '../data-access/repository/http.problems.repository.ts';
import { LastContest, Problem, ProblemAttempt, ProblemTag, ProblemsPageResult, ProblemsRatingRow } from '../domain/entities/problem.entity.ts';
import { ProblemsListParams } from '../domain/ports/problems.repository.ts';

const problemsRepository = new HttpProblemsRepository();

export const useProblemsList = (params?: ProblemsListParams) =>
  useSWR<ProblemsPageResult<Problem>>(
    ['problems-list', params?.page, params?.pageSize, params?.ordering, params?.difficulty, params?.status, params?.favorites, params?.search, (params?.tags ?? []).join(',')],
    () => problemsRepository.listProblems(params),
  );

export const useProblemTags = () => useSWR<ProblemTag[]>('problem-tags', () => problemsRepository.listTags());

export const useProblemDifficulties = () =>
  useSWR<Array<{ value: number; name: string }>>('problem-difficulties', () => problemsRepository.listDifficulties());

export const useProblemsRating = (username?: string) =>
  useSWR<ProblemsRatingRow | null>(username ? ['problems-rating', username] : null, () => problemsRepository.getUserRating(username!));

export const useProblemAttempts = (username?: string, pageSize = 10) =>
  useSWR<ProblemAttempt[] | null>(
    username ? ['problem-attempts', username, pageSize] : null,
    () => problemsRepository.listAttempts({ username: username!, pageSize }),
  );

export const useMostViewedProblems = () => useSWR<Problem[]>('most-viewed-problems', () => problemsRepository.listMostViewed());

export const useLastContest = () => useSWR<LastContest | null>('last-contest-problems', () => problemsRepository.getLastContest());

export const problemsQueries = { problemsRepository };
