import type { buildBundleSummary } from "@/utils/buildBundleSummary";

export type ReturnTypeOfBuildBundleSummary = ReturnType<
  typeof buildBundleSummary
>;

export interface BundleTotals {
  originalPrice: number;
  salePrice: number;
  itemsCount: number;
}

export const EMPTY_BUNDLE_TOTALS: BundleTotals = {
  originalPrice: 0,
  salePrice: 0,
  itemsCount: 0,
};

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number) =>
  currencyFormatter.format(value);

export const calculateBundleTotals = (
  sections: ReturnTypeOfBuildBundleSummary,
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
