import { useMemo } from "react";
import { toast } from "sonner";

import { saveBundleToStorage } from "@/services/bundleStorageService";
import { useBundleStore } from "@/store/useBundleStore";
import type { BundleSummaryData } from "@/types/builder";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { buildBundleSummary } from "@/utils/buildBundleSummary";
import { calculateBundleTotals } from "@/utils/calculateBundleTotals";

import BundleSection from "@/components/bundle-summary/BundleSection/BundleSection";
import BundleSummaryFooter from "@/components/bundle-summary/BundleSummaryFooter/BundleSummaryFooter";
import BundleSummaryHeader from "@/components/bundle-summary/BundleSummaryHeader/BundleSummaryHeader";
import ShippingRow from "@/components/bundle-summary/ShippingRow/ShippingRow";

interface BundleSummaryProps {
  categories: Category[];
  products: Product[];
  summary: BundleSummaryData;
  onCheckout?: () => void;
}

export default function BundleSummary({
  categories,
  products,
  summary,
}: BundleSummaryProps) {
  const selectedVariants = useBundleStore((state) => state.selectedVariants);

  const incrementQuantity = useBundleStore((state) => state.incrementQuantity);

  const decrementQuantity = useBundleStore((state) => state.decrementQuantity);

  const sections = useMemo(
    () => buildBundleSummary(categories, products, selectedVariants),
    [categories, products, selectedVariants],
  );

  const totals = useMemo(() => calculateBundleTotals(sections), [sections]);

  const shippingPrice = summary.shipping.compareAtPrice ?? 0;
  const installmentMonths = summary.financing.installmentCount;

  const savings = Math.max(0, totals.originalPrice - totals.salePrice);

  const hasDiscount = savings > 0;
  const finalPrice = totals.salePrice;

  const monthlyPrice =
    installmentMonths > 0 ? finalPrice / installmentMonths : finalPrice;

  const handleSaveBundle = () => {
    if (totals.itemsCount === 0) {
      toast.error("Your bundle is empty", {
        description: "Add at least one product before saving.",
      });

      return;
    }

    const wasSaved = saveBundleToStorage({
      selectedVariants,
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

  return (
    <aside className="w-full rounded-[10px] bg-[#EDF4FF] px-[15px] pt-0 pb-[15px] min-[1228px]:p-[15px]">
      <BundleSummaryHeader />

      {sections.length === 0 ? (
        <div className="mt-[10px] border-t border-[#E4E7EB] pt-[15px]">
          <p className="text-center font-gilroy-medium text-[16px] leading-[20px] text-[#6F7882]">
            No products have been added yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-0 min-[768px]:flex-row min-[768px]:gap-[30px] min-[1228px]:flex-col min-[1228px]:gap-0">
          <div className="flex-1 pb-[10px]">
            {sections.map((section) => (
              <BundleSection
                key={section.categoryId}
                section={section}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
              />
            ))}

            <ShippingRow shippingPrice={shippingPrice} variant="mobile" />
          </div>

          <BundleSummaryFooter
            shippingPrice={shippingPrice}
            installmentMonths={installmentMonths}
            originalPrice={totals.originalPrice}
            finalPrice={finalPrice}
            monthlyPrice={monthlyPrice}
            savings={savings}
            hasDiscount={hasDiscount}
            onSave={handleSaveBundle}
          />
        </div>
      )}
    </aside>
  );
}
