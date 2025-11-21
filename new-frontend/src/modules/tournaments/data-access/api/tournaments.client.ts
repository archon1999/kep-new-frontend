import { apiClient } from 'shared/api';
import {
  ApiTournamentsList200,
  ApiTournamentsListParams,
  TournamentDetail,
} from 'shared/api/orval/generated/endpoints/index.schemas';

export const tournamentsApiClient = {
  list: (params?: ApiTournamentsListParams) =>
    apiClient.apiTournamentsList(params) as Promise<ApiTournamentsList200>,
  getById: (id: string) => apiClient.apiTournamentsRead(id) as Promise<TournamentDetail>,
  register: (id: string) => apiClient.apiTournamentsRegistration(id, {} as TournamentDetail) as Promise<TournamentDetail>,
};
