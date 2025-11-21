import { apiClient } from 'shared/api';
import {
  ApiChallengesListParams,
  ApiChallengesRatingListParams,
  ChallengeCall,
  ChallengeCallBody,
} from 'shared/api/orval/generated/endpoints';

export const challengesApiClient = {
  challengeCalls: () => apiClient.apiChallengeCallsList(),
  challenges: (params?: ApiChallengesListParams) => apiClient.apiChallengesList(params),
  challengesRating: (params?: ApiChallengesRatingListParams) => apiClient.apiChallengesRatingList(params),
  challengeRatingByUsername: (username: string) => apiClient.apiChallengesRatingRead(username),
  createChallengeCall: (payload: ChallengeCallBody) => apiClient.apiChallengeCallsNew(payload),
};
