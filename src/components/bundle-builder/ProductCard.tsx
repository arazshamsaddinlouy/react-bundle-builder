import { useState } from "react";
import clsx from "clsx";

import { useBundleStore } from "@/store/useBundleStore";
import type { ProductVariant } from "@/types";
import type { Product } from "@/types/product";
import { DEFAULT_VARIANT_ID } from "@/utils/buildBundleSummary";

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

  const activeVariantId: string = hasVariants
    ? (productSelection?.activeVariantId ??
      firstVariantId ??
      DEFAULT_VARIANT_ID)
    : DEFAULT_VARIANT_ID;

  const quantity = productSelection?.quantities?.[activeVariantId] ?? 0;

  const handleIncreaseQuantity = () => {
    incrementQuantity(product.id, activeVariantId);
  };

  const handleDecreaseQuantity = () => {
    decrementQuantity(product.id, activeVariantId);
  };

  const isProductSelected = Object.values(
    productSelection?.quantities ?? {},
  ).some((variantQuantity) => variantQuantity > 0);

  return (
    <article
      className={clsx(
        "relative h-full rounded-xl border-[2px] bg-white p-[11px] transition-colors",
        isProductSelected ? "border-[rgba(78,47,210,0.7)]" : "border-white",
      )}
    >
      <div className="flex gap-4">
        <div className="flex h-[137px] w-[101px] items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="h-24 w-24 rounded-lg object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col items-start justify-between gap-[8px]">
            <h3 className="font-gilroy-semibold text-[16px] leading-none tracking-[0.6px] text-[#1F1F1F]">
              {product.title}
            </h3>

            <p className="font-gilroy-medium text-[12px] leading-[130%] tracking-[0.6px] text-[#1F1F1F]/75">
              {product.description}{" "}
              <a href="/" className="text-[rgba(0,0,238,1)] underline">
                Learn More
              </a>
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
                        "flex h-[26px] cursor-pointer min-w-[65px] items-center justify-center gap-[2px] rounded-[2px] border bg-[rgba(29,240,187,0.04)] px-[3px] transition-colors",
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

            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity === 0}
                  aria-label={`Decrease ${product.title} quantity`}
                  className={clsx(
                    "flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border-[2px]",
                    quantity === 0
                      ? "cursor-not-allowed border-[#E6EBF0] bg-white text-[#E6EBF0]"
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
                  className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-[4px] border-[2px] border-[#F0F4F7] bg-[#F0F4F7] text-[#525963]"
                >
                  <span className="font-gilroy-medium">+</span>
                </button>
              </div>

              <div className="flex flex-col items-center leading-[20px]">
                {product.compareAtPrice &&
                  product.compareAtPrice > product.price && (
                    <span className="text-[16px] text-[#D8392B] line-through">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                  )}

                <span className="text-[#575757]">
                  ${product.price.toFixed(2)}
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
