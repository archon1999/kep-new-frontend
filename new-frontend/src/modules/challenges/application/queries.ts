import useSWR from 'swr';
import type { ChallengesListRequest, ChallengesListResponse } from '../domain/entities/challenge.entity';
import { HttpChallengesRepository } from '../data-access/repository/http.challenges.repository';

export const DEFAULT_CHALLENGES_PAGE_SIZE = 7;

const repository = new HttpChallengesRepository();

export const useChallengesList = (params?: ChallengesListRequest) => {
  const normalizedParams: ChallengesListRequest = {
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? DEFAULT_CHALLENGES_PAGE_SIZE,
    username: params?.username,
    arenaId: params?.arenaId,
  };

  return useSWR<ChallengesListResponse>(['challenges-list', normalizedParams], () => repository.getChallenges(normalizedParams), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });
};
