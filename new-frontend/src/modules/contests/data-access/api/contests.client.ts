import { apiClient } from 'shared/api';
import {
  ApiContestsList200,
  ApiContestsListParams,
  ApiContestsRatingList200,
  ApiContestsRatingListParams,
  ContestsCategory,
} from 'shared/api/orval/generated/endpoints/index.schemas';

export const contestsApiClient = {
  list: (params?: ApiContestsListParams) => apiClient.apiContestsList(params) as Promise<ApiContestsList200>,
  categories: () => apiClient.apiContestsCategoriesList() as Promise<ContestsCategory[]>,
  rating: (params?: ApiContestsRatingListParams) =>
    apiClient.apiContestsRatingList(params) as Promise<ApiContestsRatingList200>,
  ratingChanges: (username: string) =>
    apiClient.apiContestsRatingRatingChanges(username) as Promise<any[]>,
  userStatistics: (username: string) =>
    apiClient.apiContestsRatingStatistics(username) as Promise<any>,
};
