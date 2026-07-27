import { DEFAULT_VARIANT_ID } from "@/constants/bundle";
import type {
  BundleSummaryItem,
  BundleSummarySection,
  SelectedVariants,
} from "@/types/bundle";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

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

        const hasVariants =
          Array.isArray(product.variants) && product.variants.length > 0;

        if (hasVariants) {
          return product.variants.flatMap((variant): BundleSummaryItem[] => {
            const quantity = productSelection.quantities[variant.id] ?? 0;

            if (quantity <= 0) {
              return [];
            }

            const salePrice = variant.price ?? product.price;

            return [
              {
                productId: product.id,
                variantId: variant.id,
                itemKey: `${product.id}:${variant.id}`,
                name: `${product.title} - ${variant.title}`,
                image: variant.image ?? product.image,
                quantity,
                originalPrice:
                  variant.compareAtPrice ?? product.compareAtPrice ?? salePrice,
                salePrice,
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

        return [
          {
            productId: product.id,
            variantId: DEFAULT_VARIANT_ID,
            itemKey: `${product.id}:${DEFAULT_VARIANT_ID}`,
            name: product.title,
            image: product.image,
            quantity: defaultQuantity,
            originalPrice: product.compareAtPrice ?? product.price,
            salePrice: product.price,
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
