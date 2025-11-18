import { apiClient } from 'shared/api';

import { UsersRepository } from '../../domain/ports/users.repository';
import { UsersListQuery, UsersListResult } from '../../domain/entities/user.entity';
import { mapCountriesResponse, mapUsersListResponse } from '../mappers/users.mapper';

const mapUsersListParams = (params: UsersListQuery) => ({
  page: params.page,
  pageSize: params.pageSize,
  ordering: params.ordering,
  username: params.username || undefined,
  first_name: params.firstName || undefined,
  country: params.country || undefined,
  age_from: params.ageFrom,
  age_to: params.ageTo,
});

class HttpUsersRepository implements UsersRepository {
  async getUsers(params: UsersListQuery): Promise<UsersListResult> {
    const response = await apiClient.apiUsersList(mapUsersListParams(params));

    return mapUsersListResponse(response);
  }

  async getCountries(locale: string) {
    const response = await apiClient.apiUsersCountries({ pageSize: 300 });

    return mapCountriesResponse(response, locale);
  }
}

export default HttpUsersRepository;
