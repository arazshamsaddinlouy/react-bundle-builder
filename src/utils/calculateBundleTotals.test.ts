import { describe, expect, it } from "vitest";

import { calculateBundleTotals } from "./calculateBundleTotals";
import type { BundleSummaryItem, BundleSummarySection } from "@/types/bundle";

describe("calculateBundleTotals", () => {
  const createItem = (
    overrides: Partial<BundleSummaryItem> = {},
  ): BundleSummaryItem => ({
    productId: "camera-1",
    variantId: "default",
    itemKey: "camera-1-default",
    name: "Indoor Camera",
    image: "/camera.png",
    quantity: 1,
    originalPrice: 120,
    salePrice: 100,
    supportsQuantity: true,
    canIncrement: true,
    canDecrement: true,
    ...overrides,
  });

  it("calculates totals for multiple sections", () => {
    const sections: BundleSummarySection[] = [
      {
        categoryId: "cameras",
        categoryTitle: "Cameras",
        items: [
          createItem({
            quantity: 2,
          }),
        ],
      },
      {
        categoryId: "plan",
        categoryTitle: "Plan",
        items: [
          createItem({
            productId: "premium-plan",
            variantId: "default",
            itemKey: "premium-plan-default",
            name: "Premium Plan",
            quantity: 1,
            originalPrice: 40,
            salePrice: 30,
          }),
        ],
      },
    ];

    expect(calculateBundleTotals(sections)).toEqual({
      originalPrice: 280,
      salePrice: 230,
      itemsCount: 3,
    });
  });

  it("returns zero totals for an empty array", () => {
    expect(calculateBundleTotals([])).toEqual({
      originalPrice: 0,
      salePrice: 0,
      itemsCount: 0,
    });
  });

  it("returns zero totals for empty sections", () => {
    const sections: BundleSummarySection[] = [
      {
        categoryId: "cameras",
        categoryTitle: "Cameras",
        items: [],
      },
    ];

    expect(calculateBundleTotals(sections)).toEqual({
      originalPrice: 0,
      salePrice: 0,
      itemsCount: 0,
    });
  });

  it("handles items with zero quantity", () => {
    const sections: BundleSummarySection[] = [
      {
        categoryId: "cameras",
        categoryTitle: "Cameras",
        items: [
          createItem({
            quantity: 0,
          }),
        ],
      },
    ];

    expect(calculateBundleTotals(sections)).toEqual({
      originalPrice: 0,
      salePrice: 0,
      itemsCount: 0,
    });
  });

  it("calculates mixed quantities correctly", () => {
    const sections: BundleSummarySection[] = [
      {
        categoryId: "cameras",
        categoryTitle: "Cameras",
        items: [
          createItem({
            quantity: 3,
            originalPrice: 200,
            salePrice: 150,
          }),
          createItem({
            productId: "camera-2",
            variantId: "black",
            itemKey: "camera-2-black",
            name: "Outdoor Camera",
            quantity: 1,
            originalPrice: 50,
            salePrice: 40,
          }),
        ],
      },
    ];

    expect(calculateBundleTotals(sections)).toEqual({
      originalPrice: 650,
      salePrice: 490,
      itemsCount: 4,
    });
  });
});
