import useSWR from 'swr';
import { HttpProblemsRepository } from '../data-access/repository/http.problems.repository.ts';
import { AttemptsListParams, ProblemsListParams, ProblemsRatingParams } from '../domain/ports/problems.repository.ts';

const problemsRepository = new HttpProblemsRepository();

export const useProblemsList = (params: ProblemsListParams) =>
  useSWR(['problems-list', params], () => problemsRepository.list(params));

export const useProblemLanguages = () =>
  useSWR(['problems-languages'], () => problemsRepository.listLanguages());

export const useProblemCategories = () =>
  useSWR(['problems-categories'], () => problemsRepository.listCategories());

export const useMostViewedProblems = () =>
  useSWR(['problems-most-viewed'], () => problemsRepository.listMostViewed());

export const useLastContestProblems = () =>
  useSWR(['problems-last-contest'], () => problemsRepository.getLastContest());

export const useUserProblemsAttempts = (username?: string, pageSize = 10) =>
  useSWR(username ? ['problems-user-attempts', username, pageSize] : null, () =>
    problemsRepository.listUserAttempts(username!, pageSize),
  );

export const useUserProblemsRating = (username?: string) =>
  useSWR(username ? ['problems-user-rating', username] : null, () => problemsRepository.getUserRating(username!));

export const useProblemsRating = (params: ProblemsRatingParams) =>
  useSWR(['problems-rating', params], () => problemsRepository.listRating(params));

export const useProblemsPeriodRating = (period: 'today' | 'week' | 'month') =>
  useSWR(['problems-period-rating', period], () => problemsRepository.listPeriodRating(period));

export const useAttemptsList = (params: AttemptsListParams) =>
  useSWR(['problems-attempts', params], () => problemsRepository.listAttempts(params));

export const useAttemptVerdicts = () => useSWR(['attempts-verdicts'], () => problemsRepository.listVerdicts());

export const problemsQueries = {
  problemsRepository,
};
