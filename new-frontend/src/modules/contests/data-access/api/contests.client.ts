import { apiClient } from 'shared/api';
import { instance } from 'shared/api/http/axiosInstance';
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
  userStatistics: async (username: string) => {
    const response = await instance.get(`/api/contests-rating/${username}/statistics/`);
    return response.data;
  },
};
