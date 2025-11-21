import { instance } from 'shared/api/http/axiosInstance.ts';
import { ProblemsListParams } from '../../domain/ports/problems.repository.ts';

const mapListParams = (params?: ProblemsListParams) => {
  if (!params) return undefined;

  return {
    page: params.page,
    page_size: params.pageSize,
    ordering: params.ordering,
    difficulty: params.difficulty,
    status: params.status,
    favorites: params.favorites,
    search: params.search,
    tags: params.tags && params.tags.length ? params.tags.join(',') : undefined,
  };
};

export const problemsApiClient = {
  listProblems: async (params?: ProblemsListParams) => {
    const response = await instance.get('/api/problems/', { params: mapListParams(params) });
    return response.data;
  },
  listTags: async () => {
    const response = await instance.get('/api/tags/');
    return response.data;
  },
  listDifficulties: async () => {
    const response = await instance.get('/api/problems/difficulties/');
    return response.data;
  },
  getUserRating: async (username: string) => {
    const response = await instance.get(`/api/problems-rating/${username}/`);
    return response.data;
  },
  listAttempts: async (params: { username: string; pageSize?: number }) => {
    const response = await instance.get('/api/attempts/', {
      params: {
        username: params.username,
        page_size: params.pageSize ?? 10,
      },
    });
    return response.data;
  },
  listMostViewed: async () => {
    const response = await instance.get('/api/problems/most-viewed/');
    return response.data;
  },
  getLastContest: async () => {
    const response = await instance.get('/api/problems/last-contest/');
    return response.data;
  },
};
