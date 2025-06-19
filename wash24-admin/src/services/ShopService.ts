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
  
}

export default ShopService;
