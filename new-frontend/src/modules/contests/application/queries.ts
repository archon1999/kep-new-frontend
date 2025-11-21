import useSWR from 'swr';
import { ApiContestsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { HttpContestsRepository } from '../data-access/repository/http.contests.repository';
import { ContestCategoryEntity, ContestListItem, PageResult } from '../domain/entities/contest.entity';

const contestsRepository = new HttpContestsRepository();

export const useContestsList = (params?: ApiContestsListParams) =>
  useSWR<PageResult<ContestListItem>>(
    [
      'contests-list',
      params?.page,
      params?.pageSize,
      params?.category,
      params?.type,
      params?.title,
      params?.is_participated,
    ],
    () => contestsRepository.list(params),
  );

export const useContestCategories = () =>
  useSWR<ContestCategoryEntity[]>('contest-categories', () => contestsRepository.categories());

export const contestsQueries = {
  contestsRepository,
};
