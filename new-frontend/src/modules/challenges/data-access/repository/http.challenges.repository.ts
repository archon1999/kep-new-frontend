import { challengesApiClient } from '../api/challenges.client';
import {
  mapApiChallengeCallToDomain,
  mapApiChallengesListToDomain,
  mapApiChallengesRatingListToDomain,
  mapApiChallengesRatingToDomain,
} from '../mappers/challenges.mapper';
import { ChallengesRepository } from '../../domain/ports/challenges.repository';
import { ChallengeCall } from '../../domain/entities/challenge-call.entity';
import { ChallengesListResponse } from '../../domain/entities/challenge.entity';
import { ChallengesRating, ChallengesRatingListResponse } from '../../domain/entities/challenges-rating.entity';

export class HttpChallengesRepository implements ChallengesRepository {
  async getChallengeCalls(): Promise<ChallengeCall[]> {
    const response = await challengesApiClient.challengeCalls();

    return response.map(mapApiChallengeCallToDomain);
  }

  async getChallenges(params: { page?: number; pageSize?: number; ordering?: string }): Promise<ChallengesListResponse> {
    const response = await challengesApiClient.challenges({
      page: params.page,
      pageSize: params.pageSize,
      ordering: params.ordering,
    });

    return mapApiChallengesListToDomain(response);
  }

  async getChallengesRatingList(params: {
    page?: number;
    pageSize?: number;
    ordering?: string;
  }): Promise<ChallengesRatingListResponse> {
    const response = await challengesApiClient.challengesRating({
      page: params.page,
      pageSize: params.pageSize,
      ordering: params.ordering,
    });

    return mapApiChallengesRatingListToDomain(response);
  }

  async getUserChallengesRating(username: string): Promise<ChallengesRating | null> {
    if (!username) {
      return null;
    }

    const response = await challengesApiClient.challengeRatingByUsername(username);

    return mapApiChallengesRatingToDomain(response);
  }
}
