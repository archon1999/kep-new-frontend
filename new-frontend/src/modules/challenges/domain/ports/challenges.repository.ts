import type { ChallengesListRequest, ChallengesListResponse } from '../entities/challenge.entity';

export interface ChallengesRepository {
  getChallenges(params: ChallengesListRequest): Promise<ChallengesListResponse>;
}
