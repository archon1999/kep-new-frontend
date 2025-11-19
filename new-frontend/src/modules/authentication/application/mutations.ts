import { createKeyFactory } from 'shared/api';
import useSWRMutation from 'swr/mutation';
import { HttpAuthenticationRepository } from '../data-access/repository/http.authentication.repository';
import type {
  AuthMessageResponse,
  AuthUser,
  LoginPayload,
  PasswordResetRequest,
  SetPasswordPayload,
  SignupPayload,
} from '../domain/entities/auth.entity';

const repository = new HttpAuthenticationRepository();
const authKeys = createKeyFactory('auth');

export const useLoginUser = () =>
  useSWRMutation<AuthUser, Error, readonly unknown[], LoginPayload>(
    authKeys.detail('login'),
    async (_, { arg }) => repository.login(arg),
  );

export const useRegisterUser = () =>
  useSWRMutation<AuthUser, Error, readonly unknown[], SignupPayload>(
    authKeys.detail('register'),
    async (_, { arg }) => repository.register(arg),
  );

export const useLogOutUser = () =>
  useSWRMutation<void, Error, readonly unknown[], void>(authKeys.detail('logout'), async () => repository.logout());

export const useSendPasswordResetLink = () =>
  useSWRMutation<AuthMessageResponse, Error, readonly unknown[], PasswordResetRequest>(
    authKeys.detail('forgot-password'),
    async (_, { arg }) => repository.sendPasswordResetLink(arg),
  );

export const useSetPassword = () =>
  useSWRMutation<AuthMessageResponse, Error, readonly unknown[], SetPasswordPayload>(
    authKeys.detail('set-password'),
    async (_, { arg }) => repository.setPassword(arg),
  );
