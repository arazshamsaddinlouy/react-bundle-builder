import { useState } from "react";
import clsx from "clsx";

import { DEFAULT_VARIANT_ID } from "@/constants/bundle";
import { useBundleStore } from "@/store/useBundleStore";
import type { BundleVariantKey } from "@/types/bundle";
import type { Product } from "@/types/product";
import type { ProductVariant } from "@/types/variant";
import { formatCurrency } from "@/utils/formatCurrency";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const productSelection = useBundleStore(
    (state) => state.selectedVariants[product.id],
  );

  const setSelectedVariant = useBundleStore((state) => state.setActiveVariant);

  const incrementQuantity = useBundleStore((state) => state.incrementQuantity);

  const decrementQuantity = useBundleStore((state) => state.decrementQuantity);

  const hasVariants = Boolean(product.variants?.length);
  const firstVariantId = product.variants?.[0]?.id;

  const activeVariantId: BundleVariantKey = hasVariants
    ? (productSelection?.activeVariantId ??
      firstVariantId ??
      DEFAULT_VARIANT_ID)
    : DEFAULT_VARIANT_ID;

  const activeVariant = product.variants?.find(
    (variant) => variant.id === activeVariantId,
  );

  const displayedPrice = activeVariant?.price ?? product.price;

  const displayedCompareAtPrice =
    activeVariant?.compareAtPrice ?? product.compareAtPrice;

  const quantity = productSelection?.quantities?.[activeVariantId] ?? 0;

  const isProductSelected = Object.values(
    productSelection?.quantities ?? {},
  ).some((variantQuantity) => (variantQuantity ?? 0) > 0);

  const handleIncreaseQuantity = () => {
    incrementQuantity(product.id, activeVariantId);
  };

  const handleDecreaseQuantity = () => {
    decrementQuantity(product.id, activeVariantId);
  };

  const supportsQuantity = product.supportsQuantity !== false;

  const handleToggleSelection = () => {
    if (isProductSelected) {
      handleDecreaseQuantity();
    } else {
      handleIncreaseQuantity();
    }
  };

  return (
    <article
      className={clsx(
        "relative h-full overflow-hidden rounded-xl border-[2px] bg-white p-[11px] transition-colors",
        isProductSelected ? "border-[rgba(78,47,210,0.7)]" : "border-white",
      )}
    >
      <div className="flex h-full flex-col gap-4 min-[1228px]:flex-row">
        <div className="flex h-[180px] w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F7F7F7] min-[1228px]:h-[137px] min-[1228px]:w-[101px] min-[1228px]:rounded-none min-[1228px]:bg-transparent">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover min-[1228px]:h-24 min-[1228px]:w-24 min-[1228px]:rounded-lg"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex h-full flex-col items-start justify-between gap-[8px]">
            <h3 className="font-gilroy-semibold text-[16px] leading-none tracking-[0.6px] text-[#1F1F1F]">
              {product.title}
            </h3>

            <p className="font-gilroy-medium text-[12px] leading-[130%] tracking-[0.6px] text-[#1F1F1F]/75">
              {product.description}{" "}
              <span className="text-[rgba(0,0,238,1)] underline">
                Learn More
              </span>
            </p>

            {hasVariants && (
              <div className="flex flex-wrap gap-[6px]">
                {product.variants?.map((variant: ProductVariant) => {
                  const hasImageError = imageErrors[variant.id];
                  const isSelected = activeVariantId === variant.id;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(product.id, variant.id)}
                      aria-pressed={isSelected}
                      className={clsx(
                        "flex h-[26px] min-w-[65px] cursor-pointer items-center justify-center gap-[2px] rounded-[2px] border bg-[rgba(29,240,187,0.04)] px-[3px] transition-colors",
                        isSelected ? "border-[#0AA288]" : "border-[#CCCCCC]",
                      )}
                    >
                      <div className="flex h-[22px] w-[22px] items-center justify-center">
                        {hasImageError || !variant.image ? (
                          <div className="h-5 w-5 rounded bg-gray-200" />
                        ) : (
                          <img
                            src={variant.image}
                            alt={variant.title}
                            onError={() =>
                              setImageErrors((previous) => ({
                                ...previous,
                                [variant.id]: true,
                              }))
                            }
                            className="h-full w-full object-contain"
                          />
                        )}
                      </div>

                      <span className="font-gilroy-medium text-[10px] leading-none tracking-[0.6px] text-[#1F1F1F]">
                        {variant.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-auto flex w-full items-center justify-between pt-[4px]">
              {supportsQuantity ? (
                <div className="flex items-center gap-[10px]">
                  <button
                    type="button"
                    onClick={handleDecreaseQuantity}
                    disabled={quantity === 0}
                    aria-label={`Decrease ${product.title} quantity`}
                    className={clsx(
                      "flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border-[2px] transition-colors",
                      quantity === 0
                        ? "cursor-not-allowed border-[#E6EBF0] bg-[#ECEFF3] text-[#A5ADB7]"
                        : "cursor-pointer border-[#F0F4F7] bg-[#F0F4F7] text-[#525963]",
                    )}
                  >
                    <span className="font-gilroy-medium">−</span>
                  </button>

                  <div className="min-w-[16px] text-center font-gilroy-medium text-[16px] leading-[20px] text-[#0B0D10]">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={handleIncreaseQuantity}
                    aria-label={`Increase ${product.title} quantity`}
                    className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-[4px] border-[2px] border-[#F0F4F7] bg-[#F0F4F7] text-[#525963] transition-colors hover:bg-[#E6EBF0]"
                  >
                    <span className="font-gilroy-medium">+</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleToggleSelection}
                  aria-label={
                    isProductSelected
                      ? `Remove ${product.title} from bundle`
                      : `Add ${product.title} to bundle`
                  }
                  className={clsx(
                    "flex min-h-[28px] items-center justify-center rounded-[6px] px-[14px] font-gilroy-medium text-[12px] transition-colors",
                    isProductSelected
                      ? "cursor-pointer bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA]"
                      : "cursor-pointer bg-[#4E2FD2] text-white hover:bg-[#4024BA]",
                  )}
                >
                  {isProductSelected ? "Remove" : "Add"}
                </button>
              )}

              <div className="flex flex-row items-center gap-[6px] leading-[20px] min-[1228px]:flex-col min-[1228px]:items-end min-[1228px]:gap-0">
                {displayedCompareAtPrice &&
                  displayedCompareAtPrice > displayedPrice && (
                    <span className="text-[16px] text-[#D8392B] line-through">
                      {formatCurrency(displayedCompareAtPrice)}
                    </span>
                  )}

                <span className="text-[16px] text-[#575757]">
                  {formatCurrency(displayedPrice)}
                </span>
              </div>
            </div>

            {product.badge && (
              <span className="absolute left-[11px] top-[11px] flex min-h-[19px] items-center justify-center rounded-[10px] bg-[#4E2FD2] px-[6px] py-[2px] font-gilroy-semibold text-[12px] leading-none text-white">
                {product.badge}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
