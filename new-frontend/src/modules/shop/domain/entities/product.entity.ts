export interface ShopProductImage {
  name?: string;
  url: string;
}

export interface ShopProductSize {
  name: string;
  stock: number;
}

export interface ShopProductColor {
  name: string;
  color: string;
  sizes: ShopProductSize[];
}

export interface ShopProduct {
  title: string;
  description: string;
  kepcoin: number;
  images: ShopProductImage[];
  colors: ShopProductColor[];
}
