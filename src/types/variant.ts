export type VariantKey = string;

export interface ProductVariant {
  id: VariantKey;
  title: string;
  price?: number;
  compareAtPrice?: number;
  image?: string;
}
