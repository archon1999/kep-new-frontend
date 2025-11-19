import { usersApiClient } from '../api/users.client';
import { mapApiUsersListToDomain, mapCountriesToCodes } from '../mappers/user.mapper';
import { UsersRepository } from '../../domain/ports/users.repository';
import { UsersListRequest, UsersListResponse } from '../../domain/entities/user.entity';

export class HttpUsersRepository implements UsersRepository {
  async getUsers(params: UsersListRequest): Promise<UsersListResponse> {
    const response = await usersApiClient.list({
      // @ts-ignore
      full: true,
      page: params.page,
      pageSize: params.pageSize,
      ordering: params.ordering,
      search: params.search,
      country: params.country,
      age_from: params.ageFrom ? String(params.ageFrom) : undefined,
      age_to: params.ageTo ? String(params.ageTo) : undefined,
    });

    return mapApiUsersListToDomain(response);
  }

  async getCountries(): Promise<string[]> {
    const response = await usersApiClient.countries();

    return mapCountriesToCodes(response);
  }
}
