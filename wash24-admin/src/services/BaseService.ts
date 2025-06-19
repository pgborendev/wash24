import type { ApiEndpoints } from '@/config/config';
import { authDataStore } from '@/store/authDataStore';

export class BaseService {


  // protected config_formdata = {
  //   headers: {
  //     'Authorization': 'Bearer ' + authDataStore().accessToken,
  //     'Content-Type': 'multipart/form-data',
  //   },
  // };

  protected apiEndpoints: ApiEndpoints;

  constructor(apiEndpoints: ApiEndpoints) {
    this.apiEndpoints = apiEndpoints;
  }

  protected getAuthBearer(): HeadersInit {
    return { Authorization: `Bearer ${authDataStore().accessToken}` };
  }

  protected async apiFetch<T>(
    url: string,
    options: RequestInit = {},
    isFormData: boolean = false
  ): Promise<T> {
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }), // Only set for non-FormData
        ...options.headers,
      },
      credentials: 'include',
      body: isFormData ? options.body : JSON.stringify(options.body),
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