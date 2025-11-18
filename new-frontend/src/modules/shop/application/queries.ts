import useSWR from 'swr';
import { ShopProduct } from '../domain/entities/product.entity';
import { HttpShopRepository } from '../data-access/repository/http.shop.repository';

const repository = new HttpShopRepository();

export const useShopProducts = () =>
  useSWR<ShopProduct[]>(['shop-products'], () => repository.getProducts(), {
    suspense: false,
  });
