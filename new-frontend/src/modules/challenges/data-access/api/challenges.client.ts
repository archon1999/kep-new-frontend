import { apiClient } from 'shared/api';

export interface ChallengeListParams {
  page?: number;
  pageSize?: number;
  username?: string;
  arenaId?: number;
  ordering?: string;
}

export const challengesApiClient = {
  getChallengeCalls: () => apiClient.apiChallengeCallsList(),
  createChallengeCall: (payload: { timeSeconds: number; questionsCount: number; chapters?: number[] }) =>
    apiClient.apiChallengeCallsNew({
      time_seconds: payload.timeSeconds,
      questions_count: payload.questionsCount,
      chapters: payload.chapters ?? [],
    }),
  deleteChallengeCall: (challengeCallId: number) => apiClient.apiChallengeCallsDelete(String(challengeCallId)),
  acceptChallengeCall: (challengeCallId: number) => apiClient.apiChallengeCallsAccept(String(challengeCallId), {} as never),
  listChallenges: (params?: ChallengeListParams) =>
    apiClient.apiChallengesList({
      page: params?.page,
      pageSize: params?.pageSize,
      username: params?.username,
      arena_id: params?.arenaId ? String(params.arenaId) : undefined,
      ordering: params?.ordering,
    }),
  getChallenge: (challengeId: number | string) => apiClient.apiChallengesRead(String(challengeId)),
  startChallenge: (challengeId: number) => apiClient.apiChallengesStart(String(challengeId), {} as never),
  submitAnswer: (challengeId: number, body: { answer: unknown; finish?: boolean }) =>
    apiClient.apiChallengesCheckAnswer(String(challengeId), { ...body } as never),
  listRating: (params?: ChallengeListParams) =>
    apiClient.apiChallengesRatingList({
      page: params?.page,
      pageSize: params?.pageSize,
      ordering: params?.ordering,
    }),
  listRatingChanges: (username: string) => apiClient.apiChallengesRatingRatingChanges(username),
  getUserRating: (username: string) => apiClient.apiChallengesRatingRead(username),
  listUserChallenges: (params: { username: string; page?: number; pageSize?: number }) =>
    apiClient.apiChallengesList({
      username: params.username,
      page: params.page,
      pageSize: params.pageSize,
    }),
  listChapters: () => apiClient.apiChaptersList(),
};
