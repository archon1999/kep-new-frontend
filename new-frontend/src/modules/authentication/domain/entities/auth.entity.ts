import type { UserAuth } from 'shared/api/orval/generated/endpoints/index.schemas';

export type AuthUser = UserAuth & {
  id?: number | string;
  name?: string;
  email?: string;
  avatar?: string | null;
  designation?: string;
};

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface SetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface AuthMessageResponse {
  message: string;
}
