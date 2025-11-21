import { instance } from 'shared/api/http/axiosInstance.ts';

export const hackathonsApiClient = {
  list: async () => {
    const { data } = await instance.get('/api/hackathons/');
    return data;
  },
  getById: async (id: number | string) => {
    const { data } = await instance.get(`/api/hackathons/${id}/`);
    return data;
  },
  getProjects: async (id: number | string) => {
    const { data } = await instance.get(`/api/hackathons/${id}/projects/`);
    return data;
  },
  getProject: async (id: number | string, symbol: string) => {
    const { data } = await instance.get(`/api/hackathons/${id}/projects/${symbol}/`);
    return data;
  },
  register: async (id: number | string) => {
    await instance.post(`/api/hackathons/${id}/registration/`);
  },
  unregister: async (id: number | string) => {
    await instance.delete(`/api/hackathons/${id}/registration/`);
  },
  getStandings: async (id: number | string) => {
    const { data } = await instance.get(`/api/hackathons/${id}/standings/`);
    return data;
  },
  getRegistrants: async (id: number | string) => {
    const { data } = await instance.get(`/api/hackathons/${id}/registrants/`);
    return data;
  },
  getAttempts: async (id: number | string, params?: { page?: number; username?: string }) => {
    const { data } = await instance.get(`/api/hackathons/${id}/attempts/`, { params });
    return data;
  },
};
