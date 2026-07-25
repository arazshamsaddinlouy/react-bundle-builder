import type { CategoryKey } from "./category";
import type { ProductVariant } from "./variant";

export type ProductKey = string;

export interface Product {
  id: ProductKey;
  categoryId: CategoryKey;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  badge?: string;
  variants: ProductVariant[];
}
