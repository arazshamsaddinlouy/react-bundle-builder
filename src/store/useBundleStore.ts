import { create } from "zustand";

type ProductVariantSelection = {
  activeVariantId: string;
  quantities: Record<string, number>;
};

type BundleStore = {
  selectedVariants: Record<string, ProductVariantSelection>;

  setSelectedVariant: (productId: string, variantId: string) => void;

  increaseQuantity: (productId: string, variantId: string) => void;

  decreaseQuantity: (productId: string, variantId: string) => void;

  resetProductSelection: (productId: string) => void;
  resetSelectedVariants: () => void;
};

export const useBundleStore = create<BundleStore>((set) => ({
  selectedVariants: {},

  setSelectedVariant: (productId, variantId) =>
    set((state) => {
      const currentProductSelection = state.selectedVariants[productId];

      return {
        selectedVariants: {
          ...state.selectedVariants,
          [productId]: {
            activeVariantId: variantId,
            quantities: {
              ...currentProductSelection?.quantities,
              [variantId]: currentProductSelection?.quantities[variantId] ?? 0,
            },
          },
        },
      };
    }),

  increaseQuantity: (productId, variantId) =>
    set((state) => {
      const currentProductSelection = state.selectedVariants[productId];

      const currentQuantity =
        currentProductSelection?.quantities[variantId] ?? 0;

      return {
        selectedVariants: {
          ...state.selectedVariants,
          [productId]: {
            activeVariantId: variantId,
            quantities: {
              ...currentProductSelection?.quantities,
              [variantId]: currentQuantity + 1,
            },
          },
        },
      };
    }),

  decreaseQuantity: (productId, variantId) =>
    set((state) => {
      const currentProductSelection = state.selectedVariants[productId];

      if (!currentProductSelection) {
        return state;
      }

      const currentQuantity =
        currentProductSelection.quantities[variantId] ?? 0;

      return {
        selectedVariants: {
          ...state.selectedVariants,
          [productId]: {
            ...currentProductSelection,
            activeVariantId: variantId,
            quantities: {
              ...currentProductSelection.quantities,
              [variantId]: Math.max(0, currentQuantity - 1),
            },
          },
        },
      };
    }),

  resetProductSelection: (productId) =>
    set((state) => {
      const selectedVariants = {
        ...state.selectedVariants,
      };

      delete selectedVariants[productId];

      return {
        selectedVariants,
      };
    }),

  resetSelectedVariants: () =>
    set({
      selectedVariants: {},
    }),
}));
