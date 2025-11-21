import { apiClient } from 'shared/api';
import type { ApiHackathonsList200, Hackathon as ApiHackathon } from 'shared/api/orval/generated/endpoints/index.schemas';

export const hackathonsApiClient = {
  list: () => apiClient.apiHackathonsList() as Promise<ApiHackathonsList200>,
  getById: (id: string) => apiClient.apiHackathonsRead(id) as Promise<ApiHackathon>,
};
