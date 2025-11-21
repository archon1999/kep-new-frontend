import useSWR from 'swr';
import { HttpChallengesRepository } from '../data-access/repository/http.challenges.repository';
import { ChallengesListResponse } from '../domain/entities/challenge.entity';
import { ChallengesRating, ChallengesRatingListResponse } from '../domain/entities/challenges-rating.entity';
import { ChallengeCall } from '../domain/entities/challenge-call.entity';

const repository = new HttpChallengesRepository();

export const useChallengeCalls = () =>
  useSWR<ChallengeCall[]>(['challenge-calls'], () => repository.getChallengeCalls(), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

export const useChallengesList = (params: { page?: number; pageSize?: number; ordering?: string }) =>
  useSWR<ChallengesListResponse>(['challenges', params], () => repository.getChallenges(params), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
  });

export const useChallengesRatingList = (params: { page?: number; pageSize?: number; ordering?: string }) =>
  useSWR<ChallengesRatingListResponse>(['challenges-rating', params], () => repository.getChallengesRatingList(params), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
  });

export const useUserChallengesRating = (username?: string | null) =>
  useSWR<ChallengesRating | null>(
    username ? ['challenges-rating', username] : null,
    () => repository.getUserChallengesRating(username as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
