import { instance } from 'shared/api/http/axiosInstance.ts';
import { ProblemsListParams } from '../../domain';

const normalizeListParams = (params: ProblemsListParams) => {
  const payload: Record<string, any> = { ...params };

  if (payload.status === 1) {
    payload.hasSolved = 1;
  } else if (payload.status === 2) {
    payload.hasSolved = 0;
    payload.hasAttempted = 1;
  } else if (payload.status === 3) {
    payload.hasSolved = 0;
    payload.hasAttempted = 0;
  }

  if (payload.tags?.length) {
    payload.tags = payload.tags.join(',');
  } else {
    delete payload.tags;
  }

  if (!payload.favorites) {
    delete payload.favorites;
  }

  return payload;
};

export const problemsApiClient = {
  listProblems: async (params: ProblemsListParams) => {
    const response = await instance.get('/api/problems', { params: normalizeListParams(params) });
    return response.data;
  },
  listCategories: async () => {
    const response = await instance.get('/api/categories');
    return response.data;
  },
  listDifficulties: async () => {
    const response = await instance.get('/api/problems/difficulties');
    return response.data;
  },
  listLanguages: async () => {
    const response = await instance.get('/api/problems/langs');
    return response.data;
  },
  listTags: async () => {
    const response = await instance.get('/api/tags');
    return response.data;
  },
  getUserRating: async (username: string) => {
    const response = await instance.get(`/api/problems-rating/${username}`);
    return response.data;
  },
  listUserAttempts: async (params: { username?: string; pageSize?: number }) => {
    const response = await instance.get('/api/attempts', { params });
    return response.data;
  },
  getLastContest: async () => {
    const response = await instance.get('/api/problems/last-contest');
    return response.data;
  },
  listMostViewed: async () => {
    const response = await instance.get('/api/problems/most-viewed');
    return response.data;
  },
};
