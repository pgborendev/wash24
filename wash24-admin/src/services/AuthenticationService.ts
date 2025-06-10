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

  login(payload: any): Promise<AuthResponse> {
    return this.apiFetch<AuthResponse>(this.apiEndpoints.auth.signIn, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
}

 
}

export default AuthenticationService;
