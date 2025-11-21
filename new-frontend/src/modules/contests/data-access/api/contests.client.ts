import { apiClient } from 'shared/api';
import {
  ApiContestsList200,
  ApiContestsListParams,
  ContestsCategory,
  ContestsRatingDetail,
} from 'shared/api/orval/generated/endpoints/index.schemas';

export const contestsApiClient = {
  list: (params?: ApiContestsListParams) => apiClient.apiContestsList(params) as Promise<ApiContestsList200>,
  getCategories: () => apiClient.apiContestsCategoriesList() as Promise<ContestsCategory[]>,
  getRating: (username: string) => apiClient.apiContestsRatingRead(username) as Promise<ContestsRatingDetail>,
};
