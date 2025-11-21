import { apiClient } from 'shared/api';
import {
  ApiTournamentsList200,
  ApiTournamentsListParams,
  TournamentDetail,
} from 'shared/api/orval/generated/endpoints/index.schemas';

export const tournamentsApiClient = {
  list: (params?: ApiTournamentsListParams) => apiClient.apiTournamentsList(params) as Promise<ApiTournamentsList200>,
  getById: (id: string | number) => apiClient.apiTournamentsRead(String(id)) as Promise<TournamentDetail>,
  register: (id: string | number) => apiClient.apiTournamentsRegistration(String(id), {} as TournamentDetail),
};
