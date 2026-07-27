import { DEFAULT_VARIANT_ID } from "@/constants/bundle";
import type {
  BundleSummaryItem,
  BundleSummarySection,
  SelectedVariants,
} from "@/types/bundle";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

const FALLBACK_PRODUCT_IMAGE = "/images/products/product-placeholder.png";

function getQuantityControls(
  product: Product,
  quantity: number,
  isRequiredDependency: boolean,
) {
  if (isRequiredDependency) {
    return {
      canIncrement: false,
      canDecrement: false,
    };
  }

  const minQuantity = product.quantityRules?.min ?? 0;
  const maxQuantity = product.quantityRules?.max;

  return {
    canIncrement:
      product.supportsQuantity !== false &&
      (maxQuantity === undefined || quantity < maxQuantity),

    canDecrement: product.supportsQuantity !== false && quantity > minQuantity,
  };
}

function getDependencyInfo(product: Product) {
  if (!product.isDependencyOnly) {
    return undefined;
  }

  return {
    required: true,
    label: "Required",
  };
}

export function buildBundleSummary(
  categories: Category[],
  products: Product[],
  selectedVariants: SelectedVariants,
): BundleSummarySection[] {
  return categories
    .map((category): BundleSummarySection => {
      const categoryProducts = products.filter(
        (product) => product.categoryId === category.id,
      );

      const items = categoryProducts.flatMap((product): BundleSummaryItem[] => {
        const productSelection = selectedVariants[product.id];

        if (!productSelection) {
          return [];
        }

        const variants = product.variants ?? [];
        const supportsQuantity = product.supportsQuantity !== false;
        const isRequiredDependency = product.isDependencyOnly === true;
        const dependency = getDependencyInfo(product);

        if (variants.length > 0) {
          return variants.flatMap((variant): BundleSummaryItem[] => {
            const quantity = productSelection.quantities[variant.id] ?? 0;

            if (quantity <= 0) {
              return [];
            }

            const salePrice = variant.price ?? product.price;

            const { canIncrement, canDecrement } = getQuantityControls(
              product,
              quantity,
              isRequiredDependency,
            );

            return [
              {
                productId: product.id,
                variantId: variant.id,
                itemKey: `${product.id}:${variant.id}`,
                name: `${product.title} - ${variant.title}`,
                image: variant.image ?? product.image ?? FALLBACK_PRODUCT_IMAGE,
                quantity,
                originalPrice:
                  variant.compareAtPrice ?? product.compareAtPrice ?? salePrice,
                salePrice,
                supportsQuantity,
                canIncrement,
                canDecrement,
                dependency,
              },
            ];
          });
        }

        const quantities = productSelection.quantities;

        const defaultQuantity =
          quantities[DEFAULT_VARIANT_ID] ??
          quantities[productSelection.activeVariantId] ??
          Object.values(quantities)[0] ??
          0;

        if (defaultQuantity <= 0) {
          return [];
        }

        const { canIncrement, canDecrement } = getQuantityControls(
          product,
          defaultQuantity,
          isRequiredDependency,
        );

        return [
          {
            productId: product.id,
            variantId: DEFAULT_VARIANT_ID,
            itemKey: `${product.id}:${DEFAULT_VARIANT_ID}`,
            name: product.title,
            image: product.image ?? FALLBACK_PRODUCT_IMAGE,
            quantity: defaultQuantity,
            originalPrice: product.compareAtPrice ?? product.price,
            salePrice: product.price,
            supportsQuantity,
            canIncrement,
            canDecrement,
            dependency,
          },
        ];
      });

      return {
        categoryId: category.id,
        categoryTitle: category.summaryTitle,
        items,
      };
    })
    .filter((section) => section.items.length > 0);
}
