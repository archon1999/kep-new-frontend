import type {
  AuthMessageResponse,
  AuthUser,
  LoginPayload,
  PasswordResetRequest,
  SetPasswordPayload,
  SignupPayload,
} from '../entities/auth.entity';

export interface AuthenticationRepository {
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: SignupPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<AuthUser | null>;
  sendPasswordResetLink: (payload: PasswordResetRequest) => Promise<AuthMessageResponse>;
  setPassword: (payload: SetPasswordPayload) => Promise<AuthMessageResponse>;
}
