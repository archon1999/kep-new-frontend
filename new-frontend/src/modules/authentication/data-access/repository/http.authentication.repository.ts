import { authApiClient } from '../api/auth.client';
import type { AuthenticationRepository } from '../../domain/ports/authentication.repository';
import type {
  AuthMessageResponse,
  AuthUser,
  LoginPayload,
  PasswordResetRequest,
  SetPasswordPayload,
  SignupPayload,
} from '../../domain/entities/auth.entity';

export class HttpAuthenticationRepository implements AuthenticationRepository {
  login(payload: LoginPayload): Promise<AuthUser> {
    return authApiClient.login(payload);
  }

  register(payload: SignupPayload): Promise<AuthUser> {
    return authApiClient.register(payload);
  }

  logout(): Promise<void> {
    return authApiClient.logout();
  }

  getCurrentUser(): Promise<AuthUser | null> {
    return authApiClient.currentUser();
  }

  sendPasswordResetLink(payload: PasswordResetRequest): Promise<AuthMessageResponse> {
    return authApiClient.sendPasswordResetLink(payload);
  }

  setPassword(payload: SetPasswordPayload): Promise<AuthMessageResponse> {
    return authApiClient.setPassword(payload);
  }
}
