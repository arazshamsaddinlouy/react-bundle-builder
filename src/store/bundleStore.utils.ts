import type { SelectedVariants } from "@/types/bundle";

export function removeVariantFromSelection(
  selectedVariants: SelectedVariants,
  productId: string,
  variantId: string,
): SelectedVariants {
  const productSelection = selectedVariants[productId];

  if (!productSelection) {
    return selectedVariants;
  }

  const nextQuantities = { ...productSelection.quantities };

  delete nextQuantities[variantId];

  const nextSelectedVariants = { ...selectedVariants };
  const remainingVariantIds = Object.keys(nextQuantities);

  if (remainingVariantIds.length === 0) {
    delete nextSelectedVariants[productId];

    return nextSelectedVariants;
  }

  nextSelectedVariants[productId] = {
    activeVariantId:
      productSelection.activeVariantId === variantId
        ? remainingVariantIds[0]
        : productSelection.activeVariantId,
    quantities: nextQuantities,
  };

  return nextSelectedVariants;
}
