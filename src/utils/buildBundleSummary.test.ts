import { describe, expect, it } from "vitest";

import { DEFAULT_VARIANT_ID } from "@/constants/bundle";
import type { SelectedVariants } from "@/types/bundle";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

import { buildBundleSummary } from "./buildBundleSummary";

describe("buildBundleSummary", () => {
  const createCategory = (overrides: Partial<Category> = {}): Category =>
    ({
      id: "cameras",
      title: "Cameras",
      summaryTitle: "Your Cameras",
      ...overrides,
    }) as Category;

  const createProduct = (overrides: Partial<Product> = {}): Product =>
    ({
      id: "indoor-camera",
      categoryId: "cameras",
      title: "Indoor Camera",
      image: "/images/indoor-camera.png",
      price: 100,
      compareAtPrice: 120,
      variants: [],
      ...overrides,
    }) as Product;

  it("builds a summary item for a product without variants", () => {
    const categories = [createCategory()];
    const products = [createProduct()];

    const selectedVariants: SelectedVariants = {
      "indoor-camera": {
        activeVariantId: DEFAULT_VARIANT_ID,
        quantities: {
          [DEFAULT_VARIANT_ID]: 2,
        },
      },
    };

    expect(buildBundleSummary(categories, products, selectedVariants)).toEqual([
      {
        categoryId: "cameras",
        categoryTitle: "Your Cameras",
        items: [
          {
            productId: "indoor-camera",
            variantId: DEFAULT_VARIANT_ID,
            itemKey: `indoor-camera:${DEFAULT_VARIANT_ID}`,
            name: "Indoor Camera",
            image: "/images/indoor-camera.png",
            quantity: 2,
            originalPrice: 120,
            salePrice: 100,
          },
        ],
      },
    ]);
  });

  it("builds a summary item for a selected product variant", () => {
    const categories = [createCategory()];

    const products = [
      createProduct({
        variants: [
          {
            id: "white",
            title: "White",
            image: "/images/indoor-camera-white.png",
            price: 90,
            compareAtPrice: 110,
          },
          {
            id: "black",
            title: "Black",
            image: "/images/indoor-camera-black.png",
            price: 95,
            compareAtPrice: 115,
          },
        ],
      }),
    ];

    const selectedVariants: SelectedVariants = {
      "indoor-camera": {
        activeVariantId: "black",
        quantities: {
          white: 0,
          black: 3,
        },
      },
    };

    expect(buildBundleSummary(categories, products, selectedVariants)).toEqual([
      {
        categoryId: "cameras",
        categoryTitle: "Your Cameras",
        items: [
          {
            productId: "indoor-camera",
            variantId: "black",
            itemKey: "indoor-camera:black",
            name: "Indoor Camera - Black",
            image: "/images/indoor-camera-black.png",
            quantity: 3,
            originalPrice: 115,
            salePrice: 95,
          },
        ],
      },
    ]);
  });

  it("includes multiple selected variants of the same product", () => {
    const categories = [createCategory()];

    const products = [
      createProduct({
        variants: [
          {
            id: "white",
            title: "White",
            image: "/images/white.png",
            price: 90,
            compareAtPrice: 110,
          },
          {
            id: "black",
            title: "Black",
            image: "/images/black.png",
            price: 95,
            compareAtPrice: 115,
          },
        ],
      }),
    ];

    const selectedVariants: SelectedVariants = {
      "indoor-camera": {
        activeVariantId: "white",
        quantities: {
          white: 2,
          black: 1,
        },
      },
    };

    const result = buildBundleSummary(categories, products, selectedVariants);

    expect(result[0]?.items).toHaveLength(2);

    expect(result[0]?.items).toEqual([
      expect.objectContaining({
        variantId: "white",
        quantity: 2,
      }),
      expect.objectContaining({
        variantId: "black",
        quantity: 1,
      }),
    ]);
  });

  it("uses product values when variant price or image is missing", () => {
    const categories = [createCategory()];

    const products = [
      createProduct({
        price: 100,
        compareAtPrice: 130,
        image: "/images/default-camera.png",
        variants: [
          {
            id: "white",
            title: "White",
          },
        ],
      }),
    ];

    const selectedVariants: SelectedVariants = {
      "indoor-camera": {
        activeVariantId: "white",
        quantities: {
          white: 1,
        },
      },
    };

    const result = buildBundleSummary(categories, products, selectedVariants);

    expect(result[0]?.items[0]).toEqual({
      productId: "indoor-camera",
      variantId: "white",
      itemKey: "indoor-camera:white",
      name: "Indoor Camera - White",
      image: "/images/default-camera.png",
      quantity: 1,
      originalPrice: 130,
      salePrice: 100,
    });
  });

  it("uses sale price as original price when compare-at prices are missing", () => {
    const categories = [createCategory()];

    const products = [
      createProduct({
        price: 100,
        compareAtPrice: undefined,
        variants: [
          {
            id: "white",
            title: "White",
            price: 90,
            compareAtPrice: undefined,
          },
        ],
      }),
    ];

    const selectedVariants: SelectedVariants = {
      "indoor-camera": {
        activeVariantId: "white",
        quantities: {
          white: 1,
        },
      },
    };

    const result = buildBundleSummary(categories, products, selectedVariants);

    expect(result[0]?.items[0]).toEqual(
      expect.objectContaining({
        salePrice: 90,
        originalPrice: 90,
      }),
    );
  });

  it("excludes variants with zero or negative quantities", () => {
    const categories = [createCategory()];

    const products = [
      createProduct({
        variants: [
          {
            id: "white",
            title: "White",
            price: 90,
          },
          {
            id: "black",
            title: "Black",
            price: 95,
          },
        ],
      }),
    ];

    const selectedVariants: SelectedVariants = {
      "indoor-camera": {
        activeVariantId: "white",
        quantities: {
          white: 0,
          black: -1,
        },
      },
    };

    expect(buildBundleSummary(categories, products, selectedVariants)).toEqual(
      [],
    );
  });

  it("excludes products that have no selection", () => {
    const categories = [createCategory()];
    const products = [createProduct()];

    const selectedVariants: SelectedVariants = {};

    expect(buildBundleSummary(categories, products, selectedVariants)).toEqual(
      [],
    );
  });

  it("removes categories that have no selected items", () => {
    const categories = [
      createCategory({
        id: "cameras",
        summaryTitle: "Your Cameras",
      }),
      createCategory({
        id: "sensors",
        title: "Sensors",
        summaryTitle: "Your Sensors",
      }),
    ];

    const products = [
      createProduct({
        id: "indoor-camera",
        categoryId: "cameras",
      }),
      createProduct({
        id: "motion-sensor",
        categoryId: "sensors",
        title: "Motion Sensor",
      }),
    ];

    const selectedVariants: SelectedVariants = {
      "indoor-camera": {
        activeVariantId: DEFAULT_VARIANT_ID,
        quantities: {
          [DEFAULT_VARIANT_ID]: 1,
        },
      },
    };

    const result = buildBundleSummary(categories, products, selectedVariants);

    expect(result).toHaveLength(1);
    expect(result[0]?.categoryId).toBe("cameras");
  });

  it("uses the active variant quantity as fallback for products without variants", () => {
    const categories = [createCategory()];
    const products = [createProduct()];

    const selectedVariants: SelectedVariants = {
      "indoor-camera": {
        activeVariantId: "legacy-selection",
        quantities: {
          "legacy-selection": 4,
        },
      },
    };

    const result = buildBundleSummary(categories, products, selectedVariants);

    expect(result[0]?.items[0]).toEqual(
      expect.objectContaining({
        variantId: DEFAULT_VARIANT_ID,
        quantity: 4,
      }),
    );
  });

  it("uses the first available quantity as the final fallback", () => {
    const categories = [createCategory()];
    const products = [createProduct()];

    const selectedVariants: SelectedVariants = {
      "indoor-camera": {
        activeVariantId: "missing-variant",
        quantities: {
          "old-key": 2,
        },
      },
    };

    const result = buildBundleSummary(categories, products, selectedVariants);

    expect(result[0]?.items[0]).toEqual(
      expect.objectContaining({
        quantity: 2,
      }),
    );
  });

  it("does not mutate the input arrays", () => {
    const categories = [createCategory()];
    const products = [createProduct()];

    const selectedVariants: SelectedVariants = {
      "indoor-camera": {
        activeVariantId: DEFAULT_VARIANT_ID,
        quantities: {
          [DEFAULT_VARIANT_ID]: 1,
        },
      },
    };

    const categoriesSnapshot = structuredClone(categories);
    const productsSnapshot = structuredClone(products);
    const selectionsSnapshot = structuredClone(selectedVariants);

    buildBundleSummary(categories, products, selectedVariants);

    expect(categories).toEqual(categoriesSnapshot);
    expect(products).toEqual(productsSnapshot);
    expect(selectedVariants).toEqual(selectionsSnapshot);
  });
});
