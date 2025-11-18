export interface ProductImage {
  name: string;
  url: string;
}

export interface ProductSize {
  name: string;
  stock: number;
}

export interface ProductColor {
  name: string;
  color: string;
  sizes: ProductSize[];
}

export interface Product {
  title: string;
  description: string;
  kepcoin: number;
  images: ProductImage[];
  colors: ProductColor[];
}
