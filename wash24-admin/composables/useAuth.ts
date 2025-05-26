
interface User {
  id: number;
  username: string;
  // Add other user properties as needed
}

interface LoginPayload {
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

  export const useAuth = () => {

  
  const userId = useState<string>('userId', () => '');
  const accessToken = useState<string>('accessToken', () => '');
  const refreshToken = useState<string>('refreshToken', () => '');
  const jti  = useState<string>('jti', () => '');
  
  const isAuthenticated = computed(() => !!accessToken.value);
  const config = useRuntimeConfig();

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      'Content-Type': 'application/json'
    },
  });

  const login = async (payload: LoginPayload) => {
    try {
        const data = await apiFetch<AuthResponse>('/auth/signin', {
          method: 'POST',
          body: payload
        });

        userId.value = data.userId;
        accessToken.value = data.accessToken;
        refreshToken.value = data.refreshToken;
        jti.value = data.jti;
      
        const accessTokenCookie = useCookie('access_token', {
          maxAge: data.accessTokenExpires || 86400,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        accessTokenCookie.value = data.accessToken;

        const refreshTokenCookie = useCookie('refresh_token', {
          maxAge: data.refreshTokenExpires || 86400,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        refreshTokenCookie.value = data.refreshToken;

        const jtiCookie = useCookie('jti');
        jtiCookie.value = jti.value;
        
        const userIdCookie = useCookie('user_id');
        userIdCookie.value = userId.value;

        return data;
    } catch (error: any) {
        throw new Error(error.data?.message || 'Login failed');
    }
  };
  
  const logout = async () => {
    try {
      await $fetch('/auth/logout', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        // @ts-ignore
        agent: getAgent()
      });
    } finally {
      userId.value = '';
      accessToken.value = '';
      refreshToken.value = '';
      jti.value = '';
      useCookie('access_token').value = null;
      useCookie('refresh_token').value = null;
      useCookie('jti').value = null;
      useCookie('user_id').value = null;
      navigateTo('/login');
    }
  };

  const initAuth = () => {
    const accessTokenCookie = useCookie('access_token') ?? '';
    if (accessTokenCookie.value) {
      accessToken.value = accessTokenCookie.value;
    }

    const refreshTokenCookie = useCookie('refresh_token');
    if (refreshTokenCookie) {
      refreshToken.value = refreshTokenCookie.value ?? '';
    }

    const jtiCookie = useCookie('jti');
    if (jtiCookie) {
        jti.value = jtiCookie.value ?? '';
    }

    const userIdCookie = useCookie('user_id');
    if (userIdCookie) {
      userId.value = userIdCookie.value ?? '';
    }
    
  };

  return {
    userId,
    accessToken,
    refreshToken,
    jti,
    isAuthenticated,
    login,
    logout,
    initAuth
  };
};