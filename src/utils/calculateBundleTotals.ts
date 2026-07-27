import type { BundleSummarySection } from "@/types/bundle";

export interface BundleTotals {
  originalPrice: number;
  salePrice: number;
  itemsCount: number;
}

const EMPTY_BUNDLE_TOTALS: BundleTotals = {
  originalPrice: 0,
  salePrice: 0,
  itemsCount: 0,
};

export const calculateBundleTotals = (
  sections: BundleSummarySection[],
): BundleTotals =>
  sections.reduce<BundleTotals>(
    (totals, section) => {
      section.items.forEach((item) => {
        totals.originalPrice += item.originalPrice * item.quantity;
        totals.salePrice += item.salePrice * item.quantity;
        totals.itemsCount += item.quantity;
      });

      return totals;
    },
    { ...EMPTY_BUNDLE_TOTALS },
  );
