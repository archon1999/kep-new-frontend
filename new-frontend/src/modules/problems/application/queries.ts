import useSWR from 'swr';
import { ProblemsFilter } from '../domain/entities/problems-filter.entity.ts';
import { Problem } from '../domain/entities/problem.entity.ts';
import { ProblemsRatingSummary } from '../domain/entities/problems-rating.entity.ts';
import {
  PageResult,
  ProblemCategory,
  ProblemDifficultyOption,
  ProblemLanguage,
  ProblemListItem,
} from '../domain/ports/problems.repository.ts';
import { HttpProblemsRepository } from '../data-access/repository/http.problems.repository.ts';

const problemsRepository = new HttpProblemsRepository();

export const useProblemsList = (filter?: ProblemsFilter) =>
  useSWR<PageResult<Problem>>(['problems-list', JSON.stringify(filter ?? {})], () =>
    problemsRepository.listProblems(filter),
  );

export const useProblemCategories = () =>
  useSWR<ProblemCategory[]>(['problems-categories'], () => problemsRepository.listCategories());

export const useProblemDifficulties = () =>
  useSWR<ProblemDifficultyOption[]>(['problems-difficulties'], () => problemsRepository.listDifficulties());

export const useProblemLanguages = () =>
  useSWR<ProblemLanguage[]>(['problems-langs'], () => problemsRepository.listLanguages());

export const useProblemsSummary = (username?: string | null) =>
  useSWR<ProblemsRatingSummary | null>(username ? ['problems-summary', username] : null, () =>
    problemsRepository.getUserRatingSummary(username!),
  );

export const useMostViewedProblems = () =>
  useSWR<ProblemListItem[]>(['problems-most-viewed'], () => problemsRepository.listMostViewed());

export const useLastContestProblems = () =>
  useSWR<{ id: number; title: string; problems: ProblemListItem[] } | null>(['problems-last-contest'], () =>
    problemsRepository.getLastContestProblems(),
  );

export const useLastAttempts = (username?: string | null) =>
  useSWR<ProblemListItem[] | null>(username ? ['problems-last-attempts', username] : null, () =>
    problemsRepository.listLastAttempts(username!),
  );

export const problemsQueries = { problemsRepository };
