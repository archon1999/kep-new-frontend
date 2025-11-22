import {
  ApiAttemptsListParams,
  ApiProblemsLastContestParams,
  ApiProblemsListParams,
  ApiProblemsRatingListParams,
  AttemptListBody,
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
  listRating: (params: ApiProblemsRatingListParams) => apiClient.apiProblemsRatingList(params),
  listPeriodRating: (period: 'today' | 'week' | 'month') => {
    if (period === 'today') return apiClient.apiProblemsRatingToday();
    if (period === 'week') return apiClient.apiProblemsRatingWeek();
    return apiClient.apiProblemsRatingMonth();
  },
  listAttempts: (params: ApiAttemptsListParams) => apiClient.apiAttemptsList(params),
  listVerdicts: () => apiClient.apiAttemptsVerdicts(),
  rerunAttempt: (attemptId: number) => apiClient.apiAttemptsRerun(attemptId.toString(), {} as AttemptListBody),
};
