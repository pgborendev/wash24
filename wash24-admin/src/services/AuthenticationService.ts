import type { ApiEndpoints } from '@/config/config';
import { BaseService } from './BaseService';
import { authDataStore } from '@/store/authDataStore';

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
      body: payload
    });
  }

  forgotPassword(payload: any): Promise<void> {
    return this.apiFetch<void>(this.apiEndpoints.auth.forget_password_request, {
      method: 'POST',
      body: payload
    });
  }

  verifyOtp(payload: any): Promise<void> {
    return this.apiFetch<void>(this.apiEndpoints.auth.otp_verify, {
      method: 'POST',
      body: payload
    });
  }

  async signOut(): Promise<void> {
    const respone = await this.apiFetch<void>(this.apiEndpoints.auth.signOut, {
      method: 'GET',
      headers: this.getAuthBearer()
    });
    authDataStore().clearData();
    return respone;
  }

  checkAuth(): Promise<{ isAuthenticated: boolean; userId: string }> {
    return this.apiFetch<{ isAuthenticated: boolean; userId: string }>(this.apiEndpoints.auth.checkAuth, {
      method: 'GET',
      headers: this.getAuthBearer(),
    });
  }

  login(payload: any): Promise<AuthResponse> {
    return this.apiFetch<AuthResponse>(this.apiEndpoints.auth.signIn, {
      method: 'POST',
      body: payload
    });
  }

}

export default AuthenticationService;
