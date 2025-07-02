import type { ApiEndpoints } from '@/config/config';
import { BaseService } from './BaseService';
import ShopModel from '@/models/ShopModel';

class ShopService extends BaseService {

  constructor(apiEndpoints: ApiEndpoints) {
    super(apiEndpoints);
  }

  public async create(shop: ShopModel): Promise<any> {
    return this.apiFetch<any>(this.apiEndpoints.shope, {
        method: 'POST',
        headers: this.getAuthBearer(),
        body: shop.toFormData(),
    }, true);
  }

  public async save(shop: ShopModel): Promise<any> {
    const endpoint = shop.id 
      ? `${this.apiEndpoints.shope}/${shop.id}`
      : this.apiEndpoints.shope;
      
    return this.apiFetch<any>(endpoint, {
      method: shop.id ? 'PATCH' : 'POST',
      headers: this.getAuthBearer(),
      body: shop.toFormData(),
    }, true);
  }

  public async list(): Promise<any> {
    return await this.apiFetch<any>(this.apiEndpoints.shope, {
        method: 'GET',
        headers: this.getAuthBearer(),
    });
  }

  public async get(id: string): Promise<any> {
    return await this.apiFetch<any>(this.apiEndpoints.shope + '/' + id, {
        method: 'GET',
        headers: this.getAuthBearer(),
    });
  }

}

export default ShopService;
