import { instance } from 'shared/api/http/axiosInstance.ts';
import { DuelListParams, DuelsRatingParams, ReadyPlayersParams } from '../../domain/ports/duels.repository.ts';

export const duelsApiClient = {
  getReadyStatus: async () => {
    const response = await instance.get('/api/duels/ready-status/');
    return response.data;
  },
  updateReadyStatus: async (ready: boolean) => {
    const response = await instance.put('/api/duels/ready-status/', { ready });
    return response.data;
  },
  listReadyPlayers: async (params?: ReadyPlayersParams) => {
    const response = await instance.get('/api/duels/ready-users/', {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
      },
    });
    return response.data;
  },
  listDuels: async (params?: DuelListParams) => {
    const response = await instance.get('/api/duels/', {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
        username: params?.username,
      },
    });
    return response.data;
  },
  listMyDuels: async (params?: DuelListParams) => {
    const response = await instance.get('/api/duels/my/', {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
      },
    });
    return response.data;
  },
  confirmDuel: async (duelId: number) => {
    const response = await instance.post(`/api/duels/${duelId}/confirm/`);
    return response.data;
  },
  getDuel: async (duelId: number | string) => {
    const response = await instance.get(`/api/duels/${duelId}/`);
    return response.data;
  },
  listDuelsRating: async (params?: DuelsRatingParams) => {
    const response = await instance.get('/api/duels-rating/', {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
        ordering: params?.ordering,
      },
    });
    return response.data;
  },
};
