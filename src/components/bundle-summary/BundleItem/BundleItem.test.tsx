import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BundleItem from "./BundleItem";

import type { BundleSummaryItem, BundleVariantKey } from "@/types/bundle";
import type { ProductKey } from "@/types/product";

vi.mock(
  "@/components/bundle-summary/QuantitySelector/QuantitySelector",
  () => ({
    default: ({
      quantity,
      itemName,
      onIncrement,
      onDecrement,
    }: {
      quantity: number;
      itemName: string;
      onIncrement: () => void;
      onDecrement: () => void;
    }) => (
      <div data-testid="quantity-selector">
        <span data-testid="quantity">{quantity}</span>
        <span data-testid="item-name">{itemName}</span>

        <button
          type="button"
          onClick={onIncrement}
          aria-label={`Increment ${itemName}`}
        >
          Increment
        </button>

        <button
          type="button"
          onClick={onDecrement}
          aria-label={`Decrement ${itemName}`}
        >
          Decrement
        </button>
      </div>
    ),
  }),
);

vi.mock("@/components/bundle-summary/ItemPrice/ItemPrice", () => ({
  default: ({
    originalPrice,
    salePrice,
  }: {
    originalPrice: number;
    salePrice: number;
  }) => (
    <div data-testid="item-price">
      <span data-testid="original-price">{originalPrice}</span>
      <span data-testid="sale-price">{salePrice}</span>
    </div>
  ),
}));

describe("BundleItem", () => {
  const item = {
    productId: "indoor-camera" as ProductKey,
    variantId: "white" as BundleVariantKey,
    itemKey: "indoor-camera-white",
    name: "Indoor Camera - White",
    image: "/images/indoor-camera-white.png",
    quantity: 3,
    originalPrice: 120,
    salePrice: 90,
  } as BundleSummaryItem;

  const onIncrement = vi.fn();
  const onDecrement = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the item name and image", () => {
    render(
      <BundleItem
        item={item}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(
      screen.getByRole("img", {
        name: "Indoor Camera - White",
      }),
    ).toHaveAttribute("src", "/images/indoor-camera-white.png");

    const article = screen
      .getByRole("img", {
        name: "Indoor Camera - White",
      })
      .closest("article");

    expect(article).not.toBeNull();

    expect(article?.querySelector("p")).toHaveTextContent(
      "Indoor Camera - White",
    );
  });

  it("passes quantity and item name to QuantitySelector", () => {
    render(
      <BundleItem
        item={item}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(screen.getByTestId("quantity-selector")).toBeInTheDocument();

    expect(screen.getByTestId("quantity")).toHaveTextContent("3");

    expect(screen.getByTestId("item-name")).toHaveTextContent(
      "Indoor Camera - White",
    );
  });

  it("calculates and passes the total original price", () => {
    render(
      <BundleItem
        item={item}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(screen.getByTestId("original-price")).toHaveTextContent("360");
  });

  it("calculates and passes the total sale price", () => {
    render(
      <BundleItem
        item={item}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(screen.getByTestId("sale-price")).toHaveTextContent("270");
  });

  it("calls onIncrement with the item product and variant ids", async () => {
    const user = userEvent.setup();

    render(
      <BundleItem
        item={item}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Increment Indoor Camera - White",
      }),
    );

    expect(onIncrement).toHaveBeenCalledOnce();

    expect(onIncrement).toHaveBeenCalledWith("indoor-camera", "white");
  });

  it("calls onDecrement with the item product and variant ids", async () => {
    const user = userEvent.setup();

    render(
      <BundleItem
        item={item}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Decrement Indoor Camera - White",
      }),
    );

    expect(onDecrement).toHaveBeenCalledOnce();

    expect(onDecrement).toHaveBeenCalledWith("indoor-camera", "white");
  });

  it("calculates totals correctly for quantity one", () => {
    const singleItem = {
      ...item,
      quantity: 1,
    };

    render(
      <BundleItem
        item={singleItem}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(screen.getByTestId("original-price")).toHaveTextContent("120");

    expect(screen.getByTestId("sale-price")).toHaveTextContent("90");
  });

  it("calculates zero totals when quantity is zero", () => {
    const zeroQuantityItem = {
      ...item,
      quantity: 0,
    };

    render(
      <BundleItem
        item={zeroQuantityItem}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(screen.getByTestId("original-price")).toHaveTextContent("0");

    expect(screen.getByTestId("sale-price")).toHaveTextContent("0");
  });

  it("supports decimal prices", () => {
    const decimalItem = {
      ...item,
      quantity: 2,
      originalPrice: 129.99,
      salePrice: 99.5,
    };

    render(
      <BundleItem
        item={decimalItem}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(screen.getByTestId("original-price")).toHaveTextContent("259.98");

    expect(screen.getByTestId("sale-price")).toHaveTextContent("199");
  });
});
