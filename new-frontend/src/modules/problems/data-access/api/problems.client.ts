import {
  ApiAttemptsListParams,
  ApiProblemsLastContestParams,
  ApiProblemsListParams,
  ProblemsCategory,
  ProblemsRating,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { apiClient } from 'shared/api';

export const problemsApiClient = {
  list: (params: ApiProblemsListParams) => apiClient.apiProblemsList(params),
  listLanguages: () => apiClient.apiProblemsLangs(),
  listCategories: () => apiClient.apiCategoriesList() as Promise<ProblemsCategory[]>,
  listMostViewed: () => apiClient.apiProblemsMostViewed(),
  getLastContest: (params?: ApiProblemsLastContestParams) => apiClient.apiProblemsLastContest(params),
  listUserAttempts: (params: ApiAttemptsListParams) => apiClient.apiAttemptsList(params),
  getUserRating: (username: string) => apiClient.apiProblemsRatingRead(username) as Promise<ProblemsRating>,
};
