import { instance } from 'shared/api/http/axiosInstance';
import { ApiTournamentsListParams, TournamentDetail } from 'shared/api/orval/generated/endpoints/index.schemas';

export const tournamentsApiClient = {
  list: async (params?: ApiTournamentsListParams) => {
    const response = await instance.get('/api/tournaments/', { params });
    return response.data;
  },
  getById: async (id: number | string) => {
    const response = await instance.get(`/api/tournaments/${id}/`);
    return response.data as TournamentDetail;
  },
};
