import { apiEndpoints } from 'app/routes/paths';
import { Product } from 'app/types/shop';
import useSWR, { SWRConfiguration } from 'swr';

export const useGetProducts = (config?: SWRConfiguration<Product[]>) => {
  const result = useSWR<Product[]>(apiEndpoints.products, undefined, {
    revalidateIfStale: true,
    ...config,
  });

  return result;
};
