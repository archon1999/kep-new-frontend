import { ShopProduct } from '../../domain/entities/product.entity';
import { ShopRepository } from '../../domain/ports/shop.repository';
import { shopApiClient } from '../api/shop.client';
import { mapApiProductToDomain } from '../mappers/product.mapper';

export class HttpShopRepository implements ShopRepository {
  async getProducts(): Promise<ShopProduct[]> {
    const products = await shopApiClient.listProducts();

    return (products ?? []).map(mapApiProductToDomain);
  }
}
