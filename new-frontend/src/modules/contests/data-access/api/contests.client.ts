import { apiClient } from 'shared/api';
import {
  ApiContestsList200,
  ApiContestsListParams,
  ContestsCategory,
} from 'shared/api/orval/generated/endpoints/index.schemas';

export const contestsApiClient = {
  list: (params?: ApiContestsListParams) => apiClient.apiContestsList(params) as Promise<ApiContestsList200>,
  categories: () => apiClient.apiContestsCategoriesList() as Promise<ContestsCategory[]>,
};
