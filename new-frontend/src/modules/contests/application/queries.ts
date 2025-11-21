import useSWR from 'swr';
import { createKeyFactory } from 'shared/api';
import { ApiContestsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { HttpContestsRepository } from '../data-access/repository/http.contests.repository';
import { ContestCategoryEntity, ContestListItem } from '../domain/entities/contest.entity';
import { PageResult } from '../domain/ports/contests.repository';

const contestsRepository = new HttpContestsRepository();

export const contestsKeys = createKeyFactory('contests');

export const useContestsList = (params?: ApiContestsListParams) =>
  useSWR<PageResult<ContestListItem>>(contestsKeys.list(params), () => contestsRepository.list(params), { suspense: false });

export const useContestCategories = () =>
  useSWR<ContestCategoryEntity[]>(contestsKeys.detail('categories'), () => contestsRepository.getCategories(), {
    suspense: false,
  });

export const contestsQueries = {
  contestsRepository,
};
