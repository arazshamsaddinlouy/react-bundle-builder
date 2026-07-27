import type { BundleVariantKey, SelectedVariants } from "@/types/bundle";
import type { ProductKey } from "@/types/product";

export function removeVariantFromSelection(
  selectedVariants: SelectedVariants,
  productId: ProductKey,
  variantId: BundleVariantKey,
): SelectedVariants {
  const currentSelection = selectedVariants[productId];

  if (!currentSelection) {
    return selectedVariants;
  }

  const nextQuantities = {
    ...currentSelection.quantities,
  };

  delete nextQuantities[variantId];

  const remainingVariantIds = Object.keys(nextQuantities) as BundleVariantKey[];

  if (remainingVariantIds.length === 0) {
    const nextSelectedVariants = {
      ...selectedVariants,
    };

    delete nextSelectedVariants[productId];

    return nextSelectedVariants;
  }

  const nextActiveVariantId =
    currentSelection.activeVariantId === variantId
      ? remainingVariantIds[0]
      : currentSelection.activeVariantId;

  return {
    ...selectedVariants,
    [productId]: {
      activeVariantId: nextActiveVariantId,
      quantities: nextQuantities,
    },
  };
}
