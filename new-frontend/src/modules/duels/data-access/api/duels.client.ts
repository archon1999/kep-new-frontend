import { instance } from 'shared/api/http/axiosInstance.ts';
import { DuelCreatePayload, DuelListFilters, DuelReadyPlayersFilters } from '../../domain/ports/duels.repository.ts';

const buildPaginationParams = (filters?: DuelListFilters | DuelReadyPlayersFilters) => ({
  page: filters?.page,
  page_size: filters?.pageSize,
  username: (filters as DuelListFilters | undefined)?.username,
});

export const duelsApiClient = {
  getDuel: async (duelId: number | string) => {
    const response = await instance.get(`/api/duels/${duelId}/`);
    return response.data;
  },
  getDuelResults: async (duelId: number | string) => {
    const response = await instance.get(`/api/duels/${duelId}/results/`);
    return response.data;
  },
  getProblemAttempts: async (duelId: number, duelProblem: string) => {
    const response = await instance.get('/api/attempts/', {
      params: {
        duel_problem: duelProblem,
        duel_id: duelId,
        page_size: 20,
      },
    });
    return response.data;
  },
  getReadyStatus: async () => {
    const response = await instance.get('/api/duels/ready-status/');
    return response.data;
  },
  updateReadyStatus: async (ready: boolean) => {
    const response = await instance.put('/api/duels/ready-status/', { ready });
    return response.data;
  },
  listReadyPlayers: async (filters?: DuelReadyPlayersFilters) => {
    const response = await instance.get('/api/duels/ready-users/', {
      params: buildPaginationParams(filters),
    });
    return response.data;
  },
  listDuelPresets: async (username: string) => {
    const response = await instance.get('/api/duels/duel-presets/', {
      params: { username },
    });
    return response.data;
  },
  createDuel: async (payload: DuelCreatePayload) => {
    await instance.post('/api/duels/duel-create/', {
      duel_username: payload.duelUsername,
      duel_preset: payload.duelPreset,
      start_time: payload.startTime,
    });
  },
  listDuels: async (filters?: DuelListFilters) => {
    const response = await instance.get('/api/duels/', {
      params: buildPaginationParams(filters),
    });
    return response.data;
  },
  listMyDuels: async (filters?: DuelListFilters) => {
    const response = await instance.get('/api/duels/my/', {
      params: buildPaginationParams(filters),
    });
    return response.data;
  },
  confirmDuel: async (duelId: number) => {
    await instance.post(`/api/duels/${duelId}/confirm/`);
  },
  listDuelsRating: async (filters?: DuelListFilters) => {
    const response = await instance.get('/api/duels-rating/', {
      params: buildPaginationParams(filters),
    });
    return response.data;
  },
};

export default duelsApiClient;
