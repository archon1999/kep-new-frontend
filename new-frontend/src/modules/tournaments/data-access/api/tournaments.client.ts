import { instance } from 'shared/api/http/axiosInstance.ts';
import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';

export const tournamentsApiClient = {
  list: async (params?: ApiTournamentsListParams) => {
    const response = await instance.get('/api/tournaments/', { params });
    return response.data;
  },
  getById: async (id: string | number) => {
    const response = await instance.get(`/api/tournaments/${id}/`);
    return response.data;
  },
  register: async (id: string | number) => {
    const response = await instance.post(`/api/tournaments/${id}/registration/`);
    return response.data;
  },
};
