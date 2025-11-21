import { Challenge } from '../entities/challenge.entity';
import { ChallengeCall } from '../entities/challenge-call.entity';
import { ChallengesRating, ChallengesRatingListResponse } from '../entities/challenges-rating.entity';
import { ChallengesListResponse } from '../entities/challenge.entity';

export interface ChallengesRepository {
  getChallengeCalls(): Promise<ChallengeCall[]>;
  getChallenges(params: { page?: number; pageSize?: number; ordering?: string }): Promise<ChallengesListResponse>;
  getChallengesRatingList(params: { page?: number; pageSize?: number; ordering?: string }): Promise<ChallengesRatingListResponse>;
  getUserChallengesRating(username: string): Promise<ChallengesRating | null>;
}
