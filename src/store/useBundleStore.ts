import { create } from "zustand";

import type { SelectedVariants } from "@/types/bundle";
import { DEFAULT_VARIANT_ID } from "@/utils/buildBundleSummary";

interface BundleStore {
  selectedVariants: SelectedVariants;

  setActiveVariant: (productId: string, variantId?: string) => void;

  setQuantity: (productId: string, variantId: string, quantity: number) => void;

  incrementQuantity: (productId: string, variantId: string) => void;

  decrementQuantity: (productId: string, variantId: string) => void;

  removeVariant: (productId: string, variantId: string) => void;

  restoreBundle: (selectedVariants: SelectedVariants) => void;

  clearBundle: () => void;
}

export const useBundleStore = create<BundleStore>((set) => ({
  selectedVariants: {},

  setActiveVariant: (productId, variantId = DEFAULT_VARIANT_ID) => {
    set((state) => {
      const currentSelection = state.selectedVariants[productId];

      const currentQuantity = currentSelection?.quantities?.[variantId] ?? 0;

      return {
        selectedVariants: {
          ...state.selectedVariants,
          [productId]: {
            activeVariantId: variantId,
            quantities: {
              ...currentSelection?.quantities,
              [variantId]: currentQuantity > 0 ? currentQuantity : 1,
            },
          },
        },
      };
    });
  },

  setQuantity: (productId, variantId, quantity) => {
    set((state) => {
      const currentSelection = state.selectedVariants[productId];

      if (quantity <= 0) {
        const nextQuantities = {
          ...currentSelection?.quantities,
        };

        delete nextQuantities[variantId];

        if (Object.keys(nextQuantities).length === 0) {
          const nextSelectedVariants = {
            ...state.selectedVariants,
          };

          delete nextSelectedVariants[productId];

          return {
            selectedVariants: nextSelectedVariants,
          };
        }

        const nextActiveVariantId =
          currentSelection?.activeVariantId === variantId
            ? Object.keys(nextQuantities)[0]
            : currentSelection?.activeVariantId;

        return {
          selectedVariants: {
            ...state.selectedVariants,
            [productId]: {
              activeVariantId:
                nextActiveVariantId ?? Object.keys(nextQuantities)[0],
              quantities: nextQuantities,
            },
          },
        };
      }

      return {
        selectedVariants: {
          ...state.selectedVariants,
          [productId]: {
            activeVariantId: variantId,
            quantities: {
              ...currentSelection?.quantities,
              [variantId]: quantity,
            },
          },
        },
      };
    });
  },

  incrementQuantity: (productId, variantId) => {
    set((state) => {
      const currentSelection = state.selectedVariants[productId];

      const currentQuantity = currentSelection?.quantities?.[variantId] ?? 0;

      return {
        selectedVariants: {
          ...state.selectedVariants,
          [productId]: {
            activeVariantId: variantId,
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

      if (!currentSelection) {
        return state;
      }

      const currentQuantity = currentSelection.quantities?.[variantId] ?? 0;

      if (currentQuantity <= 1) {
        const nextQuantities = {
          ...currentSelection.quantities,
        };

        delete nextQuantities[variantId];

        if (Object.keys(nextQuantities).length === 0) {
          const nextSelectedVariants = {
            ...state.selectedVariants,
          };

          delete nextSelectedVariants[productId];

          return {
            selectedVariants: nextSelectedVariants,
          };
        }

        const nextActiveVariantId =
          currentSelection.activeVariantId === variantId
            ? Object.keys(nextQuantities)[0]
            : currentSelection.activeVariantId;

        return {
          selectedVariants: {
            ...state.selectedVariants,
            [productId]: {
              activeVariantId: nextActiveVariantId,
              quantities: nextQuantities,
            },
          },
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
    set((state) => {
      const currentSelection = state.selectedVariants[productId];

      if (!currentSelection) {
        return state;
      }

      const nextQuantities = {
        ...currentSelection.quantities,
      };

      delete nextQuantities[variantId];

      if (Object.keys(nextQuantities).length === 0) {
        const nextSelectedVariants = {
          ...state.selectedVariants,
        };

        delete nextSelectedVariants[productId];

        return {
          selectedVariants: nextSelectedVariants,
        };
      }

      const nextActiveVariantId =
        currentSelection.activeVariantId === variantId
          ? Object.keys(nextQuantities)[0]
          : currentSelection.activeVariantId;

      return {
        selectedVariants: {
          ...state.selectedVariants,
          [productId]: {
            activeVariantId: nextActiveVariantId,
            quantities: nextQuantities,
          },
        },
      };
    });
  },

  restoreBundle: (selectedVariants) => {
    set({
      selectedVariants,
    });
  },

  clearBundle: () => {
    set({
      selectedVariants: {},
    });
  },
}));
