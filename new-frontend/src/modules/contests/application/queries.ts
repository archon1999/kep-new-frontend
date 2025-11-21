import useSWR from 'swr';
import { ApiContestsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { HttpContestsRepository } from '../data-access/repository/http.contests.repository';
import { Contest, ContestCategory } from '../domain/entities/contest.entity';
import { PageResult } from '../domain/ports/contests.repository';

const contestsRepository = new HttpContestsRepository();

export const useContestsList = (params?: ApiContestsListParams) =>
  useSWR<PageResult<Contest>>(
    ['contests-list', params?.page, params?.pageSize, params?.title, params?.type, params?.category, params?.is_participated],
    () => contestsRepository.list(params),
    { suspense: false },
  );

export const useContestCategories = () =>
  useSWR<ContestCategory[]>(['contests-categories'], () => contestsRepository.getCategories(), { suspense: false });

export const contestsQueries = {
  contestsRepository,
};
