import { ShopProduct } from '../entities/product.entity';

export interface ShopRepository {
  getProducts: () => Promise<ShopProduct[]>;
}
