import { CountryOption, UsersListQuery, UsersListResult } from '../entities/user.entity';

export interface UsersRepository {
  getUsers(params: UsersListQuery): Promise<UsersListResult>;
  getCountries(locale: string): Promise<CountryOption[]>;
}
