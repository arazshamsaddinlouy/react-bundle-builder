import type { ReturnTypeOfBuildBundleSummary } from "@/utils/formatCurrency";

export interface BundleTotals {
  originalPrice: number;
  salePrice: number;
  itemsCount: number;
}

export interface BundlePricingData extends BundleTotals {
  savings: number;
  finalPrice: number;
  monthlyPrice: number;
  hasDiscount: boolean;
}

export type BundleSummarySection = ReturnTypeOfBuildBundleSummary[number];
