import { create } from "zustand";

import { DEFAULT_VARIANT_ID } from "@/constants/bundle";
import type {
  BundleStore,
  BundleVariantKey,
  SelectedVariants,
} from "@/types/bundle";
import type { ProductKey } from "@/types/product";

import {
  cloneSelectedVariants,
  removeVariantFromSelection,
} from "./bundleStore.utils";
import { SAVED_BUNDLE_STORAGE_KEY } from "@/services/bundleStorageService";

export const useBundleStore = create<BundleStore>((set) => ({
  selectedVariants: {},

  setActiveVariant: (
    productId: ProductKey,
    variantId: BundleVariantKey = DEFAULT_VARIANT_ID,
  ) => {
    set((state) => {
      const currentSelection = state.selectedVariants[productId];

      return {
        selectedVariants: {
          ...state.selectedVariants,

          [productId]: {
            activeVariantId: variantId,

            quantities: {
              ...currentSelection?.quantities,
            },
          },
        },
      };
    });
  },

  incrementQuantity: (productId: ProductKey, variantId: BundleVariantKey) => {
    set((state) => {
      const currentSelection = state.selectedVariants[productId];
      const currentQuantity = currentSelection?.quantities[variantId] ?? 0;

      return {
        selectedVariants: {
          ...state.selectedVariants,
          [productId]: {
            activeVariantId: currentSelection?.activeVariantId ?? variantId,
            quantities: {
              ...currentSelection?.quantities,
              [variantId]: currentQuantity + 1,
            },
          },
        },
      };
    });
  },

  decrementQuantity: (productId: ProductKey, variantId: BundleVariantKey) => {
    set((state) => {
      const currentSelection = state.selectedVariants[productId];

      if (!currentSelection) {
        return state;
      }

      const currentQuantity = currentSelection.quantities[variantId] ?? 0;

      if (currentQuantity <= 1) {
        return {
          selectedVariants: removeVariantFromSelection(
            state.selectedVariants,
            productId,
            variantId,
          ),
        };
      }

      return {
        selectedVariants: {
          ...state.selectedVariants,
          [productId]: {
            activeVariantId: currentSelection.activeVariantId,
            quantities: {
              ...currentSelection.quantities,
              [variantId]: currentQuantity - 1,
            },
          },
        },
      };
    });
  },

  restoreBundle: (selectedVariants: SelectedVariants) => {
    set({
      selectedVariants: cloneSelectedVariants(selectedVariants),
    });
  },

  clearBundle: () => {
    localStorage.removeItem(SAVED_BUNDLE_STORAGE_KEY);
    set({
      selectedVariants: {},
    });
  },
}));
