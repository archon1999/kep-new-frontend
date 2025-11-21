import { apiClient } from 'shared/api';
import {
  ApiTournamentsList200,
  ApiTournamentsListParams,
  TournamentDetail,
} from 'shared/api/orval/generated/endpoints/index.schemas.ts';

export const tournamentsApiClient = {
  list: (params?: ApiTournamentsListParams) => apiClient.apiTournamentsList(params) as Promise<ApiTournamentsList200>,
  getById: (id: number | string) => apiClient.apiTournamentsRead(String(id)) as Promise<TournamentDetail>,
  register: (id: number | string) => apiClient.apiTournamentsRegistration(String(id), {} as TournamentDetail),
};
