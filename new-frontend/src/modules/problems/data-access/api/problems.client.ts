import { instance } from 'shared/api/http/axiosInstance.ts';

export const problemsApiClient = {
  listProblems: async (params?: Record<string, unknown>) => {
    const response = await instance.get('/api/problems/', { params });
    return response.data;
  },
  listCategories: async () => {
    const response = await instance.get('/api/categories/');
    return response.data;
  },
  listDifficulties: async () => {
    const response = await instance.get('/api/problems/difficulties/');
    return response.data;
  },
  listLanguages: async () => {
    const response = await instance.get('/api/problems/langs/');
    return response.data;
  },
  getLastContest: async () => {
    const response = await instance.get('/api/problems/last-contest/');
    return response.data;
  },
  listMostViewed: async () => {
    const response = await instance.get('/api/problems/most-viewed/');
    return response.data;
  },
  listUserAttempts: async (username: string, pageSize = 10) => {
    const response = await instance.get('/api/attempts/', {
      params: { username, page_size: pageSize },
    });
    return response.data;
  },
  getUserRating: async (username: string) => {
    const response = await instance.get(`/api/problems-rating/${username}/`);
    return response.data;
  },
};
