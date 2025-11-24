import { apiEndpoints } from 'app/routes/route-config';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import type { AuthUser, LoginPayload } from '../../domain/entities/auth.entity';

export const authApiClient = {
  login: (payload: LoginPayload) =>
    axiosFetcher([apiEndpoints.login, { method: 'post' }], { arg: payload }) as Promise<AuthUser>,
  logout: () => axiosFetcher([apiEndpoints.logout, { method: 'post' }]) as Promise<void>,
  currentUser: () =>
    axiosFetcher([
      apiEndpoints.profile,
      {},
      { disableThrowError: true },
    ]) as Promise<AuthUser | null>,
};
