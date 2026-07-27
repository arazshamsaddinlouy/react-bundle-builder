import type { Category } from "./category";
import type { Product } from "./product";

export interface BundleBuilderData {
  categories: Category[];
  products: Product[];
}
