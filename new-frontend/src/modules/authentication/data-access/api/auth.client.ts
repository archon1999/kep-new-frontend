import { apiEndpoints } from 'app/routes/paths';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import type {
  AuthMessageResponse,
  AuthUser,
  LoginPayload,
  PasswordResetRequest,
  SetPasswordPayload,
  SignupPayload,
} from '../../domain/entities/auth.entity';

export const authApiClient = {
  login: (payload: LoginPayload) =>
    axiosFetcher([apiEndpoints.login, { method: 'post' }], { arg: payload }) as Promise<AuthUser>,
  register: (payload: SignupPayload) =>
    axiosFetcher([apiEndpoints.register, { method: 'post' }], { arg: payload }) as Promise<AuthUser>,
  logout: () => axiosFetcher([apiEndpoints.logout, { method: 'post' }]) as Promise<void>,
  currentUser: () =>
    axiosFetcher([apiEndpoints.profile, {}, { disableThrowError: true }]) as Promise<AuthUser | null>,
  sendPasswordResetLink: (payload: PasswordResetRequest) =>
    axiosFetcher([apiEndpoints.forgotPassword, { method: 'post' }], { arg: payload }) as Promise<AuthMessageResponse>,
  setPassword: (payload: SetPasswordPayload) =>
    axiosFetcher([apiEndpoints.setPassword, { method: 'post' }], { arg: payload }) as Promise<AuthMessageResponse>,
};
