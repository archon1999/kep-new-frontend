import { Product, ProductImage } from 'shared/api/orval/generated/endpoints/index.schemas';
import {
  ShopProduct,
  ShopProductColor,
  ShopProductImage,
  ShopProductSize,
} from '../../domain/entities/product.entity';

const normalizeImages = (images?: readonly ProductImage[]): ShopProductImage[] => {
  if (!images?.length) {
    return [];
  }

  return images
    .map((image) => {
      if (!image?.url) {
        return null;
      }

      return {
        url: image.url,
        name: (image as { name?: string }).name,
      };
    })
    .filter(Boolean) as ShopProductImage[];
};

const normalizeSizes = (sizes: unknown): ShopProductSize[] => {
  if (!Array.isArray(sizes)) {
    return [];
  }

  return sizes
    .map((size) => {
      if (!size || typeof size !== 'object') {
        return null;
      }

      const { name, stock } = size as Record<string, unknown>;

      if (typeof name !== 'string') {
        return null;
      }

      return {
        name,
        stock: typeof stock === 'number' ? stock : 0,
      };
    })
    .filter(Boolean) as ShopProductSize[];
};

const normalizeColors = (colors: Product['colors']): ShopProductColor[] => {
  if (!colors) {
    return [];
  }

  let normalized: unknown = colors;

  if (typeof colors === 'string') {
    try {
      normalized = JSON.parse(colors);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(normalized)) {
    return [];
  }

  return normalized
    .map((color) => {
      if (!color || typeof color !== 'object') {
        return null;
      }

      const { name, color: colorCode, sizes } = color as Record<string, unknown>;

      if (typeof name !== 'string' || typeof colorCode !== 'string') {
        return null;
      }

      return {
        name,
        color: colorCode,
        sizes: normalizeSizes(sizes),
      };
    })
    .filter(Boolean) as ShopProductColor[];
};

export const mapApiProductToDomain = (product: Product): ShopProduct => ({
  title: product.title,
  description: product.description,
  kepcoin: product.kepcoin,
  images: normalizeImages(product.images),
  colors: normalizeColors(product.colors),
});
