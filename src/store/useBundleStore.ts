import { create } from "zustand";

import { DEFAULT_VARIANT_ID } from "@/constants/bundle";

import type { BundleVariantKey, SelectedVariants } from "@/types/bundle";
import type { Product, ProductKey } from "@/types/product";
import type { VariantKey } from "@/types/variant";

interface BundleStoreState {
  products: Product[];
  selectedVariants: SelectedVariants;

  setProducts: (products: Product[]) => void;

  setActiveVariant: (
    productId: ProductKey,
    variantId: BundleVariantKey,
  ) => void;

  incrementQuantity: (
    productId: ProductKey,
    variantId: BundleVariantKey,
  ) => void;

  decrementQuantity: (
    productId: ProductKey,
    variantId: BundleVariantKey,
  ) => void;

  clearBundle: () => void;

  restoreBundle: (selectedVariants: SelectedVariants) => void;
}

function getProductById(
  products: Product[],
  productId: ProductKey,
): Product | undefined {
  return products.find((product) => product.id === productId);
}

function getProductTotalQuantity(
  selectedVariants: SelectedVariants,
  productId: ProductKey,
): number {
  const productSelection = selectedVariants[productId];

  if (!productSelection) {
    return 0;
  }

  return Object.values(productSelection.quantities).reduce<number>(
    (total, quantity) => total + (quantity ?? 0),
    0,
  );
}

function setProductQuantity(
  selectedVariants: SelectedVariants,
  productId: ProductKey,
  quantity: number,
  variantId: BundleVariantKey = DEFAULT_VARIANT_ID,
): SelectedVariants {
  const nextSelectedVariants = structuredClone(selectedVariants);

  if (quantity <= 0) {
    delete nextSelectedVariants[productId];

    return nextSelectedVariants;
  }

  nextSelectedVariants[productId] = {
    activeVariantId: variantId,
    quantities: {
      [variantId]: quantity,
    },
  };

  return nextSelectedVariants;
}

function calculateRequiredDependencyQuantity(
  dependencyProductId: ProductKey,
  products: Product[],
  selectedVariants: SelectedVariants,
): number {
  let totalQuantity = 0;
  let fixedQuantity = 0;
  let hasActiveDependency = false;

  products.forEach((sourceProduct) => {
    const sourceQuantity = getProductTotalQuantity(
      selectedVariants,
      sourceProduct.id,
    );

    if (sourceQuantity <= 0) {
      return;
    }

    sourceProduct.dependencies?.forEach((dependency) => {
      if (
        dependency.type !== "required" ||
        dependency.productId !== dependencyProductId
      ) {
        return;
      }

      hasActiveDependency = true;

      if (dependency.quantity.mode === "match-source") {
        totalQuantity += sourceQuantity;

        return;
      }

      if (dependency.quantity.mode === "fixed") {
        fixedQuantity = Math.max(fixedQuantity, dependency.quantity.value ?? 1);
      }
    });
  });

  if (!hasActiveDependency) {
    return 0;
  }

  return totalQuantity + fixedQuantity;
}

function synchronizeDependencies(
  products: Product[],
  selectedVariants: SelectedVariants,
): SelectedVariants {
  let nextSelectedVariants = structuredClone(selectedVariants);

  const dependencyProductIds = new Set<ProductKey>();

  products.forEach((product) => {
    product.dependencies?.forEach((dependency) => {
      if (dependency.type === "required") {
        dependencyProductIds.add(dependency.productId);
      }
    });
  });

  dependencyProductIds.forEach((dependencyProductId) => {
    const dependencyProduct = getProductById(products, dependencyProductId);

    if (!dependencyProduct) {
      return;
    }

    const requiredQuantity = calculateRequiredDependencyQuantity(
      dependencyProductId,
      products,
      nextSelectedVariants,
    );

    nextSelectedVariants = setProductQuantity(
      nextSelectedVariants,
      dependencyProductId,
      requiredQuantity,
      DEFAULT_VARIANT_ID,
    );
  });

  return nextSelectedVariants;
}

export const useBundleStore = create<BundleStoreState>((set) => ({
  products: [],
  selectedVariants: {},

  setProducts: (products) => {
    set((state) => ({
      products,
      selectedVariants: synchronizeDependencies(
        products,
        state.selectedVariants,
      ),
    }));
  },

  setActiveVariant: (productId, variantId) => {
    set((state) => {
      const product = getProductById(state.products, productId);

      if (!product || product.isDependencyOnly) {
        return state;
      }

      const currentSelection = state.selectedVariants[productId];

      return {
        selectedVariants: {
          ...state.selectedVariants,

          [productId]: {
            activeVariantId: variantId,

            quantities: {
              ...(currentSelection?.quantities ?? {}),
              [variantId]: currentSelection?.quantities?.[variantId] ?? 0,
            },
          },
        },
      };
    });
  },

  incrementQuantity: (productId, variantId) => {
    set((state) => {
      const product = getProductById(state.products, productId);

      if (!product || product.isDependencyOnly) {
        return state;
      }

      const productSelection = state.selectedVariants[productId];

      const currentQuantity = productSelection?.quantities?.[variantId] ?? 0;

      const maxQuantity = product.quantityRules?.max;

      const nextQuantity =
        product.supportsQuantity === false
          ? 1
          : maxQuantity === undefined
            ? currentQuantity + 1
            : Math.min(currentQuantity + 1, maxQuantity);

      if (nextQuantity === currentQuantity) {
        return state;
      }

      const nextSelectedVariants: SelectedVariants = {
        ...state.selectedVariants,

        [productId]: {
          activeVariantId: variantId,

          quantities: {
            ...(productSelection?.quantities ?? {}),
            [variantId]: nextQuantity,
          },
        },
      };

      return {
        selectedVariants: synchronizeDependencies(
          state.products,
          nextSelectedVariants,
        ),
      };
    });
  },

  decrementQuantity: (productId, variantId) => {
    set((state) => {
      const product = getProductById(state.products, productId);

      if (!product || product.isDependencyOnly) {
        return state;
      }

      const productSelection = state.selectedVariants[productId];

      if (!productSelection) {
        return state;
      }

      const currentQuantity = productSelection.quantities[variantId] ?? 0;

      const minQuantity = product.quantityRules?.min ?? 0;

      const nextQuantity = Math.max(currentQuantity - 1, minQuantity);

      if (nextQuantity === currentQuantity) {
        return state;
      }

      const nextQuantities = {
        ...productSelection.quantities,
        [variantId]: nextQuantity,
      };

      if (nextQuantity <= 0) {
        delete nextQuantities[variantId];
      }

      const hasSelectedVariant = Object.values(nextQuantities).some(
        (quantity) => (quantity ?? 0) > 0,
      );

      const nextSelectedVariants = {
        ...state.selectedVariants,
      };

      if (!hasSelectedVariant) {
        delete nextSelectedVariants[productId];
      } else {
        nextSelectedVariants[productId] = {
          activeVariantId:
            productSelection.activeVariantId === variantId
              ? ((Object.keys(nextQuantities)[0] ??
                  DEFAULT_VARIANT_ID) as VariantKey)
              : productSelection.activeVariantId,

          quantities: nextQuantities,
        };
      }

      return {
        selectedVariants: synchronizeDependencies(
          state.products,
          nextSelectedVariants,
        ),
      };
    });
  },

  restoreBundle: (selectedVariants) => {
    set((state) => ({
      selectedVariants: synchronizeDependencies(
        state.products,
        selectedVariants,
      ),
    }));
  },

  clearBundle: () => {
    set({
      selectedVariants: {},
    });
  },
}));
