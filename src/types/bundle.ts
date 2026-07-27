import type { DefaultVariantId } from "@/constants/bundle";

import type { ProductKey } from "./product";
import type { VariantKey } from "./variant";
import type { CategoryKey } from "./category";

export type BundleVariantKey = VariantKey | DefaultVariantId;

export interface ProductVariantSelection {
  activeVariantId: BundleVariantKey;
  quantities: Partial<Record<BundleVariantKey, number>>;
}

export type SelectedVariants = Partial<
  Record<ProductKey, ProductVariantSelection>
>;

export interface BundleStoreState {
  selectedVariants: SelectedVariants;
}

export interface BundleStoreActions {
  setActiveVariant(productId: ProductKey, variantId?: BundleVariantKey): void;

  incrementQuantity(productId: ProductKey, variantId: BundleVariantKey): void;

  decrementQuantity(productId: ProductKey, variantId: BundleVariantKey): void;

  restoreBundle(selectedVariants: SelectedVariants): void;

  clearBundle(): void;
}

export interface BundleStore extends BundleStoreState, BundleStoreActions {}

export interface BundleSummaryItem {
  productId: ProductKey;
  variantId: BundleVariantKey;
  itemKey: string;
  name: string;
  image: string;
  quantity: number;
  originalPrice: number;
  salePrice: number;
}

export interface BundleSummarySection {
  categoryId: CategoryKey;
  categoryTitle: string;
  items: BundleSummaryItem[];
}
