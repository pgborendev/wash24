import type { ApiEndpoints } from '@/config/config';
import { useUserStore } from '@/store/user'; 

export class BaseService {
  protected config = {
    headers: {
      'x-access-token': useUserStore().currentUser.accessToken,
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  protected config_formdata = {
    headers: {
      'x-access-token': useUserStore().currentUser.accessToken,
      'Content-Type': 'multipart/form-data',
    },
  };

  protected apiEndpoints: ApiEndpoints;

  constructor(apiEndpoints: ApiEndpoints) {
    this.apiEndpoints = apiEndpoints;
  }

  protected async apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        statusText: response.statusText,
        ...errorData,
      };
    }

    return response.json() as Promise<T>;
  }
}