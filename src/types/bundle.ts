import type { ProductKey } from "./product";
import type { VariantKey } from "./variant";

export type BundleItemKey = string;

export interface BundleItem {
  productId: ProductKey;
  variantId?: VariantKey;
  quantity: number;
}

export interface BundleStoreState {
  activeStep: number;
  activeVariants: Record<ProductKey, VariantKey>;
  quantities: Record<BundleItemKey, number>;
}

export interface BundleStoreActions {
  setActiveStep(step: number): void;
  setActiveVariant(productId: ProductKey, variantId: VariantKey): void;
  setQuantity(itemKey: BundleItemKey, quantity: number): void;
  incrementQuantity(itemKey: BundleItemKey): void;
  decrementQuantity(itemKey: BundleItemKey): void;
  resetBundle(): void;
}

export interface BundleStore extends BundleStoreState, BundleStoreActions {}
