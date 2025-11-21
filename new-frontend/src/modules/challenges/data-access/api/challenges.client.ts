import { apiClient } from 'shared/api';
import type {
  ApiChallengesList200,
  ApiChallengesListParams,
} from 'shared/api/orval/generated/endpoints/index.schemas';

export const challengesApiClient = {
  list: (params?: ApiChallengesListParams) =>
    apiClient.apiChallengesList(params) as Promise<ApiChallengesList200>,
};
