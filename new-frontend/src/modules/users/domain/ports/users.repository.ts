import { UsersListRequest, UsersListResponse } from '../entities/user.entity';

export interface UsersRepository {
  getUsers: (params: UsersListRequest) => Promise<UsersListResponse>;
  getCountries: () => Promise<string[]>;
}
