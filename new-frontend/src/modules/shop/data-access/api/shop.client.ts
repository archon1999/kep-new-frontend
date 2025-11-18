import { apiClient } from 'shared/api';

export const shopApiClient = {
  listProducts: () => apiClient.apiProductsList(),
};
