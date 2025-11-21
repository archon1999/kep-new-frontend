import { instance } from 'shared/api/http/axiosInstance.ts';
import { ProblemsPageFilters } from '../../domain/entities/problem.entity.ts';

export interface ProblemsListParams extends ProblemsPageFilters {
  page?: number;
  pageSize?: number;
}

export const problemsApiClient = {
  list: async (params?: ProblemsListParams) => {
    const response = await instance.get('/api/problems', { params });
    return response.data;
  },
  getSummary: async (username?: string | null) => {
    const response = await instance.get(`/api/problems-rating/${username ?? ''}`);
    return response.data;
  },
  getLastAttempts: async (params?: { page?: number; pageSize?: number }) => {
    const response = await instance.get('/api/attempts', { params });
    return response.data;
  },
  getLastContestProblems: async (params?: { page?: number; pageSize?: number }) => {
    const response = await instance.get('/api/problems/last-contest', { params });
    return response.data;
  },
  getMostViewed: async (params?: { page?: number; pageSize?: number }) => {
    const response = await instance.get('/api/problems/most-viewed', { params });
    return response.data;
  },
};
