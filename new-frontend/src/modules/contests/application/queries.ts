import useSWR from 'swr';
import {
  ApiContestsListParams,
  ApiContestsRatingListParams,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { HttpContestsRepository } from '../data-access/repository/http.contests.repository';
import { ContestCategoryEntity, ContestListItem, ContestTopContestant } from '../domain/entities/contest.entity';
import { ContestRatingRow } from '../domain/entities/contest-rating.entity';
import {
  ContestRatingChange,
  ContestUserStatistics,
} from '../domain/entities/contest-user-statistics.entity';
import { PageResult } from '../domain/ports/contests.repository';

const contestsRepository = new HttpContestsRepository();

const listKey = (params?: ApiContestsListParams) => [
  'contests-list',
  params?.page,
  params?.pageSize,
  params?.title,
  params?.category,
  params?.type,
  params?.is_participated,
  params?.is_rated,
];

export const useContestsList = (params?: ApiContestsListParams) =>
  useSWR<PageResult<ContestListItem>>(listKey(params), () => contestsRepository.list(params));

export const useContestCategories = () =>
  useSWR<ContestCategoryEntity[]>('contests-categories', () => contestsRepository.categories());

export const useContestsRating = (params?: ApiContestsRatingListParams) =>
  useSWR<PageResult<ContestRatingRow>>(
    ['contests-rating', params?.page, params?.pageSize, params?.ordering],
    () => contestsRepository.rating(params),
  );

export const useContestUserStatistics = (username?: string) =>
  useSWR<ContestUserStatistics | null>(
    username ? ['contest-user-statistics', username] : null,
    () => contestsRepository.userStatistics(username!),
  );

export const useContestRatingChanges = (username?: string) =>
  useSWR<ContestRatingChange[]>(
    username ? ['contest-rating-changes', username] : null,
    () => contestsRepository.ratingChanges(username!),
  );

export const useContestTopContestants = (contestId?: number | string, enabled = true) =>
  useSWR<ContestTopContestant[]>(
    contestId && enabled ? ['contest-top3', contestId] : null,
    () => contestsRepository.top3Contestants(contestId!),
  );

export const contestsQueries = {
  contestsRepository,
};
