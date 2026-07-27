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
      canIncrement,
      canDecrement,
      onIncrement,
      onDecrement,
    }: {
      quantity: number;
      itemName: string;
      canIncrement: boolean;
      canDecrement: boolean;
      onIncrement: () => void;
      onDecrement: () => void;
    }) => (
      <div data-testid="quantity-selector">
        <span data-testid="quantity">{quantity}</span>
        <span data-testid="item-name">{itemName}</span>
        <span data-testid="can-increment">{String(canIncrement)}</span>
        <span data-testid="can-decrement">{String(canDecrement)}</span>

        <button
          type="button"
          disabled={!canIncrement}
          onClick={onIncrement}
          aria-label={`Increment ${itemName}`}
        >
          Increment
        </button>

        <button
          type="button"
          disabled={!canDecrement}
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
  const item: BundleSummaryItem = {
    productId: "indoor-camera" as ProductKey,
    variantId: "white" as BundleVariantKey,
    itemKey: "indoor-camera:white",
    name: "Indoor Camera - White",
    image: "/images/indoor-camera-white.png",
    quantity: 3,
    originalPrice: 120,
    salePrice: 90,
    supportsQuantity: true,
    canIncrement: true,
    canDecrement: true,
  };

  const onIncrement = vi.fn();
  const onDecrement = vi.fn();

  const renderBundleItem = (
    currentItem: BundleSummaryItem = item,
    showQuantitySelector = true,
  ) =>
    render(
      <BundleItem
        item={currentItem}
        showQuantitySelector={showQuantitySelector}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the item name and image", () => {
    const { container } = renderBundleItem();

    expect(
      screen.getByRole("img", {
        name: "Indoor Camera - White",
      }),
    ).toHaveAttribute("src", "/images/indoor-camera-white.png");

    const title = container.querySelector("p");

    expect(title).toHaveTextContent("Indoor Camera - White");
  });

  it("renders QuantitySelector when showQuantitySelector is true", () => {
    renderBundleItem();

    expect(screen.getByTestId("quantity-selector")).toBeInTheDocument();
  });

  it("does not render QuantitySelector when showQuantitySelector is false", () => {
    renderBundleItem(item, false);

    expect(screen.queryByTestId("quantity-selector")).not.toBeInTheDocument();
  });

  it("passes quantity and item name to QuantitySelector", () => {
    renderBundleItem();

    expect(screen.getByTestId("quantity")).toHaveTextContent("3");
    expect(screen.getByTestId("item-name")).toHaveTextContent(
      "Indoor Camera - White",
    );
  });

  it("passes canIncrement and canDecrement to QuantitySelector", () => {
    renderBundleItem();

    expect(screen.getByTestId("can-increment")).toHaveTextContent("true");
    expect(screen.getByTestId("can-decrement")).toHaveTextContent("true");
  });

  it("passes false control states to QuantitySelector", () => {
    renderBundleItem({
      ...item,
      canIncrement: false,
      canDecrement: false,
    });

    expect(screen.getByTestId("can-increment")).toHaveTextContent("false");
    expect(screen.getByTestId("can-decrement")).toHaveTextContent("false");
  });

  it("calculates and passes the total original price", () => {
    renderBundleItem();

    expect(screen.getByTestId("original-price")).toHaveTextContent("360");
  });

  it("calculates and passes the total sale price", () => {
    renderBundleItem();

    expect(screen.getByTestId("sale-price")).toHaveTextContent("270");
  });

  it("calls onIncrement with the product and variant ids", async () => {
    const user = userEvent.setup();

    renderBundleItem();

    await user.click(
      screen.getByRole("button", {
        name: "Increment Indoor Camera - White",
      }),
    );

    expect(onIncrement).toHaveBeenCalledOnce();
    expect(onIncrement).toHaveBeenCalledWith("indoor-camera", "white");
  });

  it("calls onDecrement with the product and variant ids", async () => {
    const user = userEvent.setup();

    renderBundleItem();

    await user.click(
      screen.getByRole("button", {
        name: "Decrement Indoor Camera - White",
      }),
    );

    expect(onDecrement).toHaveBeenCalledOnce();
    expect(onDecrement).toHaveBeenCalledWith("indoor-camera", "white");
  });

  it("does not call onIncrement when canIncrement is false", async () => {
    const user = userEvent.setup();

    renderBundleItem({
      ...item,
      canIncrement: false,
    });

    await user.click(
      screen.getByRole("button", {
        name: "Increment Indoor Camera - White",
      }),
    );

    expect(onIncrement).not.toHaveBeenCalled();
  });

  it("does not call onDecrement when canDecrement is false", async () => {
    const user = userEvent.setup();

    renderBundleItem({
      ...item,
      canDecrement: false,
    });

    await user.click(
      screen.getByRole("button", {
        name: "Decrement Indoor Camera - White",
      }),
    );

    expect(onDecrement).not.toHaveBeenCalled();
  });

  it("calculates totals correctly for quantity one", () => {
    renderBundleItem({
      ...item,
      quantity: 1,
    });

    expect(screen.getByTestId("original-price")).toHaveTextContent("120");
    expect(screen.getByTestId("sale-price")).toHaveTextContent("90");
  });

  it("calculates zero totals when quantity is zero", () => {
    renderBundleItem({
      ...item,
      quantity: 0,
    });

    expect(screen.getByTestId("original-price")).toHaveTextContent("0");
    expect(screen.getByTestId("sale-price")).toHaveTextContent("0");
  });

  it("supports decimal prices", () => {
    renderBundleItem({
      ...item,
      quantity: 2,
      originalPrice: 129.99,
      salePrice: 99.5,
    });

    expect(screen.getByTestId("original-price")).toHaveTextContent("259.98");
    expect(screen.getByTestId("sale-price")).toHaveTextContent("199");
  });
});
