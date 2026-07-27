import { create } from "zustand";

import { DEFAULT_VARIANT_ID } from "@/constants/bundle";
import type { BundleStore, SelectedVariants } from "@/types/bundle";

import { removeVariantFromSelection } from "./bundleStore.utils";

const normalizeQuantity = (quantity: number): number =>
  Math.max(0, Math.floor(quantity));

const cloneSelectedVariants = (
  selectedVariants: SelectedVariants,
): SelectedVariants =>
  Object.fromEntries(
    Object.entries(selectedVariants).map(([productId, selection]) => [
      productId,
      {
        activeVariantId: selection.activeVariantId,
        quantities: {
          ...selection.quantities,
        },
      },
    ]),
  ) as SelectedVariants;

export const useBundleStore = create<BundleStore>((set) => ({
  selectedVariants: {},

  setActiveVariant: (productId, variantId = DEFAULT_VARIANT_ID) => {
    set((state) => {
      const currentSelection = state.selectedVariants[productId];

      return {
        selectedVariants: {
          ...state.selectedVariants,
          [productId]: {
            activeVariantId: variantId,
            quantities: {
              ...currentSelection?.quantities,
              [variantId]: currentSelection?.quantities[variantId] ?? 1,
            },
          },
        },
      };
    });
  },

  setQuantity: (productId, variantId, quantity) => {
    const normalizedQuantity = normalizeQuantity(quantity);

    set((state) => {
      if (normalizedQuantity === 0) {
        return {
          selectedVariants: removeVariantFromSelection(
            state.selectedVariants,
            productId,
            variantId,
          ),
        };
      }

      const currentSelection = state.selectedVariants[productId];

      return {
        selectedVariants: {
          ...state.selectedVariants,
          [productId]: {
            activeVariantId: currentSelection?.activeVariantId ?? variantId,
            quantities: {
              ...currentSelection?.quantities,
              [variantId]: normalizedQuantity,
            },
          },
        },
      };
    });
  },

  incrementQuantity: (productId, variantId) => {
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

  decrementQuantity: (productId, variantId) => {
    set((state) => {
      const currentSelection = state.selectedVariants[productId];

      const currentQuantity = currentSelection?.quantities[variantId] ?? 0;

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
            ...currentSelection,
            quantities: {
              ...currentSelection.quantities,
              [variantId]: currentQuantity - 1,
            },
          },
        },
      };
    });
  },

  removeVariant: (productId, variantId) => {
    set((state) => ({
      selectedVariants: removeVariantFromSelection(
        state.selectedVariants,
        productId,
        variantId,
      ),
    }));
  },

  restoreBundle: (selectedVariants) => {
    set({
      selectedVariants: cloneSelectedVariants(selectedVariants),
    });
  },

  clearBundle: () => {
    set({
      selectedVariants: {},
    });
  },
}));
