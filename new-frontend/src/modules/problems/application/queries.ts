import useSWR from 'swr';
import { HttpProblemsRepository } from '../data-access/repository/http.problems.repository.ts';
import { ProblemsListParams } from '../domain';

const repository = new HttpProblemsRepository();

export const useProblemsList = (params: ProblemsListParams) =>
  useSWR(['problems-list', params], () => repository.listProblems(params));

export const useProblemFilters = () => {
  const categories = useSWR('problems-categories', () => repository.listCategories());
  const difficulties = useSWR('problems-difficulties', () => repository.listDifficulties());
  const languages = useSWR('problems-langs', () => repository.listLanguages());

  return { categories, difficulties, languages };
};

export const useProblemsSummary = (username?: string | null) =>
  useSWR(username ? ['problems-summary', username] : null, () => repository.getUserSummary(username));

export const useLastAttempts = (username?: string | null) =>
  useSWR(username ? ['problems-last-attempts', username] : null, () => repository.listUserAttempts(username));

export const useLastContestProblems = () =>
  useSWR('problems-last-contest', () => repository.getLastContestPreview());

export const useMostViewedProblems = () =>
  useSWR('problems-most-viewed', () => repository.listMostViewed());

export const problemsQueries = { repository };
