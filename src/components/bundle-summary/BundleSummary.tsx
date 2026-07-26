import { useMemo } from "react";
import { toast } from "sonner";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { buildBundleSummary } from "@/utils/buildBundleSummary";
import { useBundleStore } from "@/store/useBundleStore";
import { saveBundleToStorage } from "@/constants/bundleStorage";

interface BundleSummaryProps {
  categories: Category[];
  products: Product[];
  shippingPrice?: number;
  installmentMonths?: number;
  onCheckout?: () => void;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

export function BundleSummary({
  categories,
  products,
  shippingPrice = 5.99,
  installmentMonths = 12,
  onCheckout,
}: BundleSummaryProps) {
  const selectedVariants = useBundleStore((state) => state.selectedVariants);

  const incrementQuantity = useBundleStore((state) => state.incrementQuantity);

  const decrementQuantity = useBundleStore((state) => state.decrementQuantity);

  const sections = useMemo(
    () => buildBundleSummary(categories, products, selectedVariants),
    [categories, products, selectedVariants],
  );

  const totals = useMemo(() => {
    return sections.reduce(
      (summary, section) => {
        section.items.forEach((item) => {
          summary.originalPrice += item.originalPrice * item.quantity;
          summary.salePrice += item.salePrice * item.quantity;
          summary.itemsCount += item.quantity;
        });

        return summary;
      },
      {
        originalPrice: 0,
        salePrice: 0,
        itemsCount: 0,
      },
    );
  }, [sections]);

  const savings = Math.max(0, totals.originalPrice - totals.salePrice);

  const hasDiscount = savings > 0;

  const finalPrice = totals.salePrice;

  const monthlyPrice =
    installmentMonths > 0 ? finalPrice / installmentMonths : finalPrice;

  const handleIncrement = (productId: string, variantId: string) => {
    incrementQuantity(productId, variantId);
  };

  const handleDecrement = (productId: string, variantId: string) => {
    decrementQuantity(productId, variantId);
  };

  const handleSaveBundle = () => {
    if (totals.itemsCount === 0) {
      toast.error("Your bundle is empty", {
        description: "Add at least one product before saving.",
      });

      return;
    }

    const wasSaved = saveBundleToStorage({
      selectedVariants,
      totals: {
        originalPrice: totals.originalPrice,
        salePrice: totals.salePrice,
        savings,
        itemsCount: totals.itemsCount,
      },
      savedAt: new Date().toISOString(),
    });

    if (!wasSaved) {
      toast.error("Couldn't save your bundle", {
        description: "Please try again.",
      });

      return;
    }

    toast.success("Bundle saved for later!", {
      description: "Your selected products have been saved on this device.",
    });
  };

  const handleCheckout = () => {
    onCheckout?.();
  };

  const header = (
    <header className="w-1/2 min-[1228px]:w-full">
      <p className="hidden min-[1228px]:block font-gilroy-medium text-[12px] leading-[12px] tracking-[0.133em] text-[#484848] uppercase">
        Review
      </p>

      <h2 className="pt-[20px] font-gilroy-semibold text-[22px] leading-[22px] tracking-[0.027em] text-[#1F1F1F]">
        Your security system
      </h2>

      <p className="pt-[5px] font-gilroy-medium text-[14px] leading-[18.2px] tracking-[0.043em] text-[rgba(31,31,31,0.75)]">
        Review your personalized protection system designed to keep what matters
        most safe.
      </p>
    </header>
  );

  if (sections.length === 0) {
    return (
      <aside className="w-full rounded-[10px] bg-[#EDF4FF] px-[15px] pb-[15px] pt-[0px] min-[1228px]:p-[15px]">
        {header}
        <div className="mt-[10px] border-t border-[#E4E7EB] pt-[15px]">
          <p className="font-gilroy-medium text-center text-[16px] leading-[20px] text-[#6F7882]">
            No products have been added yet.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full rounded-[10px] bg-[#EDF4FF] px-[15px] pb-[15px] pt-[0px] min-[1228px]:p-[15px]">
      {header}
      <div className="flex flex-row gap-[30px] min-[1228px]:flex-col min-[1228px]:gap-0">
        <div className="flex-1 pb-[10px]">
          {sections.map((section) => (
            <section key={section.categoryId}>
              <h3 className="mt-[10px] border-t border-[#CED6DE] py-[15px] font-gilroy-medium text-[12px] leading-[12px] tracking-[0.133em] text-[#484848] uppercase">
                {section.categoryTitle}
              </h3>

              <div className="space-y-[10px]">
                {section.items.map((item) => {
                  const itemOriginalTotal = item.originalPrice * item.quantity;

                  const itemSaleTotal = item.salePrice * item.quantity;

                  const itemHasDiscount = item.originalPrice > item.salePrice;

                  return (
                    <article
                      key={item.itemKey}
                      className="flex items-center gap-[8px]"
                    >
                      <div className="flex size-[41px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-white p-[4px]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-gilroy-medium text-[14px] leading-[16px] tracking-[0.005em] text-[#0B0D10]">
                          {item.name}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-[8px]">
                        <div className="flex items-center gap-[4px]">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.name} quantity`}
                            onClick={() =>
                              handleDecrement(item.productId, item.variantId)
                            }
                            className="flex size-[20px] cursor-pointer items-center justify-center rounded-[4px] bg-white font-gilroy-medium text-[14px] leading-[14px] text-[#575757] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>

                          <span className="flex min-w-[20px] items-center justify-center font-gilroy-medium text-[14px] leading-[20px] text-[#575757]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            aria-label={`Increase ${item.name} quantity`}
                            onClick={() =>
                              handleIncrement(item.productId, item.variantId)
                            }
                            className="flex cursor-pointer size-[20px] items-center justify-center rounded-[4px] bg-white font-gilroy-medium text-[14px] leading-[14px] text-[#575757] transition-opacity hover:opacity-80"
                          >
                            +
                          </button>
                        </div>

                        <div className="w-[58px] shrink-0 text-right">
                          {itemHasDiscount && (
                            <p className="font-gilroy-medium text-[14px] leading-[16px] tracking-[0.005em] text-[#6F7882] line-through">
                              {formatCurrency(itemOriginalTotal)}
                            </p>
                          )}

                          <p className="font-gilroy-semibold text-[14px] leading-[16px] tracking-[0.005em] text-[#4E2FD2]">
                            {formatCurrency(itemSaleTotal)}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
          <div className="flex items-center border-t-[1px] border-t-[#CED6DE] -mb-[10px] justify-between pt-[10px] mt-[10px] min-[1228px]:hidden">
            <div className="flex size-[41px] items-center justify-center rounded-[5px] bg-white">
              <img
                src="/icons/shipping-delivery.svg"
                alt=""
                aria-hidden="true"
                className="size-[26px] object-contain"
              />
            </div>

            <div className="w-[58px] shrink-0 text-right">
              {shippingPrice > 0 && (
                <p className="font-gilroy-medium text-[14px] leading-[16px] tracking-[0.005em] text-[#6F7882] line-through">
                  {formatCurrency(shippingPrice)}
                </p>
              )}

              <p className="font-gilroy-semibold text-[14px] leading-[16px] tracking-[0.005em] text-[#4E2FD2]">
                {shippingPrice > 0 ? "FREE" : formatCurrency(0)}
              </p>
            </div>
          </div>
        </div>
        <footer className="flex-1 -mt-[60px] min-[1228px]:mt-0 min-[1228px]:border-t min-[1228px]:border-[#CED6DE]">
          <div className="hidden min-[1228px]:flex items-center justify-between py-[10px]">
            <div className="flex size-[41px] items-center justify-center rounded-[5px] bg-white">
              <img
                src="/icons/shipping-delivery.svg"
                alt=""
                aria-hidden="true"
                className="size-[26px] object-contain"
              />
            </div>

            <div className="w-[58px] shrink-0 text-right">
              {shippingPrice > 0 && (
                <p className="font-gilroy-medium text-[14px] leading-[16px] tracking-[0.005em] text-[#6F7882] line-through">
                  {formatCurrency(shippingPrice)}
                </p>
              )}

              <p className="font-gilroy-semibold text-[14px] leading-[16px] tracking-[0.005em] text-[#4E2FD2]">
                {shippingPrice > 0 ? "FREE" : formatCurrency(0)}
              </p>
            </div>
          </div>
          <div className="flex items-end justify-between pb-[15px]">
            <div className="w-[78px] shrink-0">
              <img
                src="/images/layout/summary-badge.png"
                alt="Bundle offer"
                className="w-full object-contain"
              />
            </div>

            <div className="flex shrink-0 flex-col items-end text-right">
              {installmentMonths > 0 && (
                <div className="flex h-[18px] items-center justify-center rounded-[3px] bg-[#4E2FD2] px-[8px]">
                  <span className="font-gilroy-medium text-[12px] leading-[12px] tracking-[-0.05em] text-white">
                    as low as {formatCurrency(monthlyPrice)}/mo
                  </span>
                </div>
              )}

              <div className="flex items-center gap-[10px] pt-[8px]">
                {hasDiscount && (
                  <p className="font-gilroy-medium text-[18px] leading-[20px] tracking-[0.0025em] text-[#6F7882] line-through">
                    {formatCurrency(totals.originalPrice)}
                  </p>
                )}

                <p className="font-gilroy-bold text-[24px] leading-[32px] tracking-[-0.0013em] text-[#4E2FD2]">
                  {formatCurrency(finalPrice)}
                </p>
              </div>
            </div>
          </div>
          {hasDiscount && (
            <p className="font-gilroy-semibold text-center text-[12px] leading-[12px] tracking-[-0.06px] text-[#0AA288]">
              Congrats! You’re saving {formatCurrency(savings)} on your security
              bundle!
            </p>
          )}
          <button
            type="button"
            onClick={handleCheckout}
            className="mt-[15px] flex h-[48px] cursor-pointer w-full items-center justify-center gap-[8px] rounded-[4px] bg-[#4E2FD2] px-[16px] font-gilroy-semibold text-[17px] leading-[22px] text-white transition-opacity hover:opacity-90"
          >
            Checkout
          </button>
          <button
            type="button"
            onClick={handleSaveBundle}
            className="w-full pt-[10px] pb-[15px] cursor-pointer font-gilroy-regular-italic text-center text-[14px] leading-[16.8px] tracking-[-0.02px] text-[#484848] underline"
          >
            Save my system for later
          </button>
        </footer>
      </div>
    </aside>
  );
}
