import type { DefaultVariantId } from "@/constants/bundle";

import type { ProductKey } from "./product";
import type { VariantKey } from "./variant";

export type BundleVariantKey = VariantKey | DefaultVariantId;

export type BundleItemKey = string;

export interface BundleItem {
  productId: ProductKey;
  variantId?: BundleVariantKey;
  quantity: number;
}

export interface ProductVariantSelection {
  activeVariantId: BundleVariantKey;
  quantities: Record<BundleVariantKey, number>;
}

export type SelectedVariants = Record<ProductKey, ProductVariantSelection>;

export interface BundleStoreState {
  selectedVariants: SelectedVariants;
}

export interface BundleStoreActions {
  setActiveVariant(productId: ProductKey, variantId?: BundleVariantKey): void;

  setQuantity(
    productId: ProductKey,
    variantId: BundleVariantKey,
    quantity: number,
  ): void;

  incrementQuantity(productId: ProductKey, variantId: BundleVariantKey): void;

  decrementQuantity(productId: ProductKey, variantId: BundleVariantKey): void;

  removeVariant(productId: ProductKey, variantId: BundleVariantKey): void;

  restoreBundle(selectedVariants: SelectedVariants): void;

  clearBundle(): void;
}

export interface BundleStore extends BundleStoreState, BundleStoreActions {}

export interface BundleSummaryItem {
  productId: ProductKey;
  variantId: BundleVariantKey;
  itemKey: BundleItemKey;
  name: string;
  image: string;
  quantity: number;
  originalPrice: number;
  salePrice: number;
}

export interface BundleSummarySection {
  categoryId: string;
  categoryTitle: string;
  items: BundleSummaryItem[];
}
