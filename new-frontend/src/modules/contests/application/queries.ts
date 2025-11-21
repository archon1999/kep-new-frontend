import useSWR from 'swr';
import { ApiContestsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { HttpContestsRepository } from '../data-access/repository/http.contests.repository';
import { Contest, ContestCategory, ContestRatingSummary } from '../domain/entities/contest.entity';
import { PageResult } from '../domain/ports/contests.repository';

const contestsRepository = new HttpContestsRepository();

export const useContestsList = (params?: ApiContestsListParams) =>
  useSWR<PageResult<Contest>>(
    ['contests-list', params?.page, params?.pageSize, params?.category, params?.type, params?.is_participated, params?.title],
    () => contestsRepository.list(params),
    { suspense: false },
  );

export const useContestCategories = () =>
  useSWR<ContestCategory[]>(['contests-categories'], () => contestsRepository.getCategories(), { suspense: false });

export const useContestRating = (username?: string) =>
  useSWR<ContestRatingSummary | null>(
    username ? ['contests-rating', username] : null,
    () => contestsRepository.getRating(username!),
    { suspense: false },
  );

export const contestsQueries = {
  contestsRepository,
};
