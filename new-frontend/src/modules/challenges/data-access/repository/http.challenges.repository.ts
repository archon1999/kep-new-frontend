import type { ChallengesListRequest, ChallengesListResponse } from '../../domain/entities/challenge.entity';
import type { ChallengesRepository } from '../../domain/ports/challenges.repository';
import { challengesApiClient } from '../api/challenges.client';
import { mapChallengesList } from '../mappers/challenges.mapper';

export class HttpChallengesRepository implements ChallengesRepository {
  async getChallenges(params: ChallengesListRequest): Promise<ChallengesListResponse> {
    const response = await challengesApiClient.list({
      page: params.page,
      pageSize: params.pageSize,
      username: params.username,
      arena_id: params.arenaId,
    });

    return mapChallengesList(response);
  }
}
