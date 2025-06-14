import type { ApiEndpoints } from '@/config/config';
import { BaseService } from './BaseService';

interface AuthPayload {
    username: string;
    password: string;
    system: string;
    deviceType: string;
    deviceId: string;
}

interface AuthResponse {
    userId: string;
    accessToken: string;
    refreshToken: string;
    jti: string;
    accessTokenExpires?: number;
    refreshTokenExpires?: number;
  }

class AuthenticationService extends BaseService {

  constructor(apiEndpoints: ApiEndpoints) {
    super(apiEndpoints);
  }

  resendOtp(payload: any): Promise<void> {
    return this.apiFetch<void>(this.apiEndpoints.auth.resend_otp, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
  }

  forgotPassword(payload: any): Promise<void> {
    return this.apiFetch<void>(this.apiEndpoints.auth.forget_password_request, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
  }

  verifyOtp(payload: any): Promise<void> {
    return this.apiFetch<void>(this.apiEndpoints.auth.otp_verify, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
  }

  signOut(): Promise<void> {
    return this.apiFetch<void>(this.apiEndpoints.auth.signOut, {
      method: 'GET',
    });
  }

  checkAuth(): Promise<{ isAuthenticated: boolean; userId: string }> {
    return this.apiFetch<{ isAuthenticated: boolean; userId: string }>(this.apiEndpoints.auth.checkAuth, {
      method: 'GET',
    });
  }

  login(payload: any): Promise<AuthResponse> {
    return this.apiFetch<AuthResponse>(this.apiEndpoints.auth.signIn, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
  }

}

export default AuthenticationService;
