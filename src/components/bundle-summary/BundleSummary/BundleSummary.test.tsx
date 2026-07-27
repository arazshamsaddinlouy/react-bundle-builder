import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BundleSummary from "./BundleSummary";

import type { BundleSummaryData } from "@/types/builder";
import type { BundleSummarySection, BundleVariantKey } from "@/types/bundle";
import type { Category } from "@/types/category";
import type { Product, ProductKey } from "@/types/product";

const {
  buildBundleSummaryMock,
  calculateBundleTotalsMock,
  saveBundleToStorageMock,
  incrementQuantityMock,
  decrementQuantityMock,
  toastErrorMock,
  toastSuccessMock,
} = vi.hoisted(() => ({
  buildBundleSummaryMock: vi.fn(),
  calculateBundleTotalsMock: vi.fn(),
  saveBundleToStorageMock: vi.fn(),
  incrementQuantityMock: vi.fn(),
  decrementQuantityMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

const selectedVariantsMock = {
  "indoor-camera": {
    white: 2,
  },
};

vi.mock("@/utils/buildBundleSummary", () => ({
  buildBundleSummary: buildBundleSummaryMock,
}));

vi.mock("@/utils/calculateBundleTotals", () => ({
  calculateBundleTotals: calculateBundleTotalsMock,
}));

vi.mock("@/services/bundleStorageService", () => ({
  saveBundleToStorage: saveBundleToStorageMock,
}));

vi.mock("sonner", () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

vi.mock("@/store/useBundleStore", () => ({
  useBundleStore: (
    selector: (state: {
      selectedVariants: typeof selectedVariantsMock;
      incrementQuantity: typeof incrementQuantityMock;
      decrementQuantity: typeof decrementQuantityMock;
    }) => unknown,
  ) =>
    selector({
      selectedVariants: selectedVariantsMock,
      incrementQuantity: incrementQuantityMock,
      decrementQuantity: decrementQuantityMock,
    }),
}));

vi.mock(
  "@/components/bundle-summary/BundleSummaryHeader/BundleSummaryHeader",
  () => ({
    default: () => (
      <header data-testid="bundle-summary-header">Bundle Summary Header</header>
    ),
  }),
);

vi.mock("@/components/bundle-summary/BundleSection/BundleSection", () => ({
  default: ({
    section,
    onIncrement,
    onDecrement,
  }: {
    section: BundleSummarySection;
    onIncrement: (productId: ProductKey, variantId: BundleVariantKey) => void;
    onDecrement: (productId: ProductKey, variantId: BundleVariantKey) => void;
  }) => (
    <section data-testid={`bundle-section-${section.categoryId}`}>
      <span>{section.categoryTitle}</span>

      <button
        type="button"
        onClick={() =>
          onIncrement(
            "indoor-camera" as ProductKey,
            "white" as BundleVariantKey,
          )
        }
      >
        Increment item
      </button>

      <button
        type="button"
        onClick={() =>
          onDecrement(
            "indoor-camera" as ProductKey,
            "white" as BundleVariantKey,
          )
        }
      >
        Decrement item
      </button>
    </section>
  ),
}));

vi.mock("@/components/bundle-summary/ShippingRow/ShippingRow", () => ({
  default: ({
    shippingPrice,
    variant,
  }: {
    shippingPrice: number;
    variant: "mobile" | "desktop";
  }) => <div data-testid={`shipping-row-${variant}`}>{shippingPrice}</div>,
}));

vi.mock(
  "@/components/bundle-summary/BundleSummaryFooter/BundleSummaryFooter",
  () => ({
    default: ({
      shippingPrice,
      installmentMonths,
      originalPrice,
      finalPrice,
      monthlyPrice,
      savings,
      hasDiscount,
      onSave,
    }: {
      shippingPrice: number;
      installmentMonths: number;
      originalPrice: number;
      finalPrice: number;
      monthlyPrice: number;
      savings: number;
      hasDiscount: boolean;
      onSave: () => void;
    }) => (
      <footer data-testid="bundle-summary-footer">
        <span data-testid="footer-shipping-price">{shippingPrice}</span>

        <span data-testid="footer-installment-months">{installmentMonths}</span>

        <span data-testid="footer-original-price">{originalPrice}</span>

        <span data-testid="footer-final-price">{finalPrice}</span>

        <span data-testid="footer-monthly-price">{monthlyPrice}</span>

        <span data-testid="footer-savings">{savings}</span>

        <span data-testid="footer-has-discount">{String(hasDiscount)}</span>

        <button type="button" onClick={onSave}>
          Save bundle
        </button>
      </footer>
    ),
  }),
);

describe("BundleSummary", () => {
  const categories = [
    {
      id: "cameras",
      title: "Cameras",
    },
  ] as Category[];

  const products = [
    {
      id: "indoor-camera",
      categoryId: "cameras",
      title: "Indoor Camera",
    },
  ] as Product[];

  const summaryMock: BundleSummaryData = {
    shipping: {
      title: "Shipping",
      price: 5.99,
      compareAtPrice: 5.99,
      image: "/images/shipping.png",
    },
    financing: {
      installmentCount: 12,
      label: "or",
    },
    guarantee: {
      title: "Money-back guarantee",
      image: "/images/guarantee.png",
    },
  };

  const sections = [
    {
      categoryId: "cameras",
      categoryTitle: "Cameras",
      items: [
        {
          itemKey: "indoor-camera-white",
          productId: "indoor-camera",
          variantId: "white",
          name: "Indoor Camera - White",
          image: "/images/indoor-camera.png",
          quantity: 2,
          originalPrice: 120,
          salePrice: 90,
        },
      ],
    },
  ] as BundleSummarySection[];

  const renderBundleSummary = (summary: BundleSummaryData = summaryMock) =>
    render(
      <BundleSummary
        categories={categories}
        products={products}
        summary={summary}
      />,
    );

  beforeEach(() => {
    vi.clearAllMocks();

    buildBundleSummaryMock.mockReturnValue(sections);

    calculateBundleTotalsMock.mockReturnValue({
      originalPrice: 240,
      salePrice: 180,
      itemsCount: 2,
    });

    saveBundleToStorageMock.mockReturnValue(true);
  });

  it("renders the summary header", () => {
    renderBundleSummary();

    expect(screen.getByTestId("bundle-summary-header")).toBeInTheDocument();
  });

  it("builds summary sections from categories, products, and selected variants", () => {
    renderBundleSummary();

    expect(buildBundleSummaryMock).toHaveBeenCalledWith(
      categories,
      products,
      selectedVariantsMock,
    );
  });

  it("calculates totals from the generated sections", () => {
    renderBundleSummary();

    expect(calculateBundleTotalsMock).toHaveBeenCalledWith(sections);
  });

  it("renders one BundleSection for each generated section", () => {
    renderBundleSummary();

    expect(screen.getByTestId("bundle-section-cameras")).toBeInTheDocument();

    expect(screen.getByText("Cameras")).toBeInTheDocument();
  });

  it("passes the store increment callback to BundleSection", async () => {
    const user = userEvent.setup();

    renderBundleSummary();

    await user.click(
      screen.getByRole("button", {
        name: "Increment item",
      }),
    );

    expect(incrementQuantityMock).toHaveBeenCalledOnce();

    expect(incrementQuantityMock).toHaveBeenCalledWith(
      "indoor-camera",
      "white",
    );
  });

  it("passes the store decrement callback to BundleSection", async () => {
    const user = userEvent.setup();

    renderBundleSummary();

    await user.click(
      screen.getByRole("button", {
        name: "Decrement item",
      }),
    );

    expect(decrementQuantityMock).toHaveBeenCalledOnce();

    expect(decrementQuantityMock).toHaveBeenCalledWith(
      "indoor-camera",
      "white",
    );
  });

  it("passes the original shipping price to ShippingRow", () => {
    renderBundleSummary();

    const shippingRow = screen.getByTestId("shipping-row-mobile");

    expect(shippingRow).toHaveTextContent("5.99");
  });

  it("passes a custom shipping price to ShippingRow", () => {
    renderBundleSummary({
      ...summaryMock,
      shipping: {
        ...summaryMock.shipping,
        price: 5.99,
      },
    });

    expect(screen.getByTestId("shipping-row-mobile")).toHaveTextContent("5.99");
  });

  it("passes the original shipping price to BundleSummaryFooter", () => {
    renderBundleSummary();

    const shippingPrice = screen.getByTestId("footer-shipping-price");

    expect(shippingPrice).toHaveTextContent("5.99");
  });

  it("passes calculated pricing values to BundleSummaryFooter", () => {
    renderBundleSummary();

    expect(screen.getByTestId("footer-original-price")).toHaveTextContent(
      "240",
    );

    expect(screen.getByTestId("footer-final-price")).toHaveTextContent("180");

    expect(screen.getByTestId("footer-savings")).toHaveTextContent("60");

    expect(screen.getByTestId("footer-has-discount")).toHaveTextContent("true");
  });

  it("calculates the monthly price using the installment months", () => {
    renderBundleSummary({
      ...summaryMock,
      financing: {
        ...summaryMock.financing,
        installmentCount: 12,
      },
    });

    expect(screen.getByTestId("footer-monthly-price")).toHaveTextContent("15");

    expect(screen.getByTestId("footer-installment-months")).toHaveTextContent(
      "12",
    );
  });

  it("uses the final price as monthly price when installment months is zero", () => {
    renderBundleSummary({
      ...summaryMock,
      financing: {
        ...summaryMock.financing,
        installmentCount: 0,
      },
    });

    expect(screen.getByTestId("footer-monthly-price")).toHaveTextContent("180");
  });

  it("prevents negative savings", () => {
    calculateBundleTotalsMock.mockReturnValue({
      originalPrice: 150,
      salePrice: 180,
      itemsCount: 2,
    });

    renderBundleSummary();

    expect(screen.getByTestId("footer-savings")).toHaveTextContent("0");

    expect(screen.getByTestId("footer-has-discount")).toHaveTextContent(
      "false",
    );
  });

  it("renders the empty state when there are no sections", () => {
    buildBundleSummaryMock.mockReturnValue([]);

    calculateBundleTotalsMock.mockReturnValue({
      originalPrice: 0,
      salePrice: 0,
      itemsCount: 0,
    });

    renderBundleSummary();

    expect(
      screen.getByText("No products have been added yet."),
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId("bundle-summary-footer"),
    ).not.toBeInTheDocument();

    expect(screen.queryByTestId("shipping-row-mobile")).not.toBeInTheDocument();
  });

  it("shows an error toast when saving an empty bundle", async () => {
    const user = userEvent.setup();

    calculateBundleTotalsMock.mockReturnValue({
      originalPrice: 0,
      salePrice: 0,
      itemsCount: 0,
    });

    renderBundleSummary();

    await user.click(
      screen.getByRole("button", {
        name: "Save bundle",
      }),
    );

    expect(toastErrorMock).toHaveBeenCalledWith("Your bundle is empty", {
      description: "Add at least one product before saving.",
    });

    expect(saveBundleToStorageMock).not.toHaveBeenCalled();
  });

  it("shows an error toast when saving to storage fails", async () => {
    const user = userEvent.setup();

    saveBundleToStorageMock.mockReturnValue(false);

    renderBundleSummary();

    await user.click(
      screen.getByRole("button", {
        name: "Save bundle",
      }),
    );

    expect(saveBundleToStorageMock).toHaveBeenCalledOnce();

    expect(toastErrorMock).toHaveBeenCalledWith("Couldn't save your bundle", {
      description: "Please try again.",
    });

    expect(toastSuccessMock).not.toHaveBeenCalled();
  });

  it("saves the selected variants and shows a success toast", async () => {
    const user = userEvent.setup();

    renderBundleSummary();

    await user.click(
      screen.getByRole("button", {
        name: "Save bundle",
      }),
    );

    expect(saveBundleToStorageMock).toHaveBeenCalledOnce();

    expect(saveBundleToStorageMock).toHaveBeenCalledWith({
      selectedVariants: selectedVariantsMock,
      savedAt: expect.any(String),
    });

    expect(toastSuccessMock).toHaveBeenCalledWith("Bundle saved for later!", {
      description: "Your selected products have been saved on this device.",
    });
  });

  it("saves a valid ISO timestamp", async () => {
    const user = userEvent.setup();

    renderBundleSummary();

    await user.click(
      screen.getByRole("button", {
        name: "Save bundle",
      }),
    );

    const savedPayload = saveBundleToStorageMock.mock.calls[0][0];

    expect(Number.isNaN(Date.parse(savedPayload.savedAt))).toBe(false);
  });
});
