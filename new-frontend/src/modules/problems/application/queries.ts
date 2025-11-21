import useSWR from 'swr';
import { HttpProblemsRepository } from '../data-access/repository/http.problems.repository.ts';
import { PageResult } from '../domain/ports/problems.repository.ts';
import { Problem } from '../domain/entities/problem.entity.ts';
import { DifficultiesBreakdown, ProblemAttemptPreview, ProblemHighlight, ProblemsSummary } from '../domain/entities/stats.entity.ts';

const problemsRepository = new HttpProblemsRepository();

export const useProblemsList = (params?: { page?: number; pageSize?: number; filters?: Record<string, unknown> }) =>
  useSWR<PageResult<Problem>>(
    ['problems-list', params?.page, params?.pageSize, params?.filters],
    () =>
      problemsRepository.listProblems({
        page: params?.page,
        pageSize: params?.pageSize,
        ...(params?.filters ?? {}),
      }),
  );

export const useProblemsSummary = (username?: string | null) =>
  useSWR<ProblemsSummary>(username ? ['problems-summary', username] : ['problems-summary'], () =>
    problemsRepository.getSummary(username),
  );

export const useDifficulties = (username?: string | null) =>
  useSWR<DifficultiesBreakdown>(username ? ['problems-difficulties', username] : ['problems-difficulties'], () =>
    problemsRepository.getDifficulties(username),
  );

export const useLastAttempts = (params?: { page?: number; pageSize?: number }) =>
  useSWR<ProblemAttemptPreview[]>(['problems-last-attempts', params?.page, params?.pageSize], () =>
    problemsRepository.getLastAttempts(params),
  );

export const useLastContestProblems = (params?: { page?: number; pageSize?: number }) =>
  useSWR<ProblemHighlight[]>(['problems-last-contest', params?.page, params?.pageSize], () =>
    problemsRepository.getLastContestProblems(params),
  );

export const useMostViewedProblems = (params?: { page?: number; pageSize?: number }) =>
  useSWR<ProblemHighlight[]>(['problems-most-viewed', params?.page, params?.pageSize], () =>
    problemsRepository.getMostViewed(params),
  );

export const problemsQueries = { problemsRepository };
