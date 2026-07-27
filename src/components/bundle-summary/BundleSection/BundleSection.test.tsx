import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BundleSection from "./BundleSection";

import type {
  BundleSummaryItem,
  BundleSummarySection,
  BundleVariantKey,
} from "@/types/bundle";
import type { ProductKey } from "@/types/product";

vi.mock("@/components/bundle-summary/BundleItem/BundleItem", () => ({
  default: ({
    item,
    onIncrement,
    onDecrement,
  }: {
    item: BundleSummaryItem;
    onIncrement: (productId: ProductKey, variantId: BundleVariantKey) => void;
    onDecrement: (productId: ProductKey, variantId: BundleVariantKey) => void;
  }) => (
    <article data-testid={`bundle-item-${item.itemKey}`}>
      <span>{item.name}</span>

      <button
        type="button"
        onClick={() => onIncrement(item.productId, item.variantId)}
        aria-label={`Increment ${item.name}`}
      >
        Increment
      </button>

      <button
        type="button"
        onClick={() => onDecrement(item.productId, item.variantId)}
        aria-label={`Decrement ${item.name}`}
      >
        Decrement
      </button>
    </article>
  ),
}));

describe("BundleSection", () => {
  const items = [
    {
      productId: "indoor-camera" as ProductKey,
      variantId: "white" as BundleVariantKey,
      itemKey: "indoor-camera-white",
      name: "Indoor Camera - White",
      image: "/images/indoor-camera-white.png",
      quantity: 2,
      originalPrice: 120,
      salePrice: 90,
    },
    {
      productId: "outdoor-camera" as ProductKey,
      variantId: "black" as BundleVariantKey,
      itemKey: "outdoor-camera-black",
      name: "Outdoor Camera - Black",
      image: "/images/outdoor-camera-black.png",
      quantity: 1,
      originalPrice: 160,
      salePrice: 130,
    },
  ] as BundleSummaryItem[];

  const section = {
    categoryId: "cameras",
    categoryTitle: "Cameras",
    items,
  } as BundleSummarySection;

  const onIncrement = vi.fn();
  const onDecrement = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the section category title", () => {
    render(
      <BundleSection
        section={section}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Cameras",
      }),
    ).toBeInTheDocument();
  });

  it("renders one BundleItem for each section item", () => {
    render(
      <BundleSection
        section={section}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(
      screen.getByTestId("bundle-item-indoor-camera-white"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("bundle-item-outdoor-camera-black"),
    ).toBeInTheDocument();

    expect(screen.getAllByTestId(/bundle-item-/)).toHaveLength(2);
  });

  it("passes each item to its corresponding BundleItem", () => {
    render(
      <BundleSection
        section={section}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(
      screen.getByTestId("bundle-item-indoor-camera-white"),
    ).toHaveTextContent("Indoor Camera - White");

    expect(
      screen.getByTestId("bundle-item-outdoor-camera-black"),
    ).toHaveTextContent("Outdoor Camera - Black");
  });

  it("renders items in the same order they are provided", () => {
    render(
      <BundleSection
        section={section}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    const renderedItems = screen.getAllByTestId(/bundle-item-/);

    expect(renderedItems[0]).toHaveTextContent("Indoor Camera - White");

    expect(renderedItems[1]).toHaveTextContent("Outdoor Camera - Black");
  });

  it("calls onIncrement with the correct product and variant ids", async () => {
    const user = userEvent.setup();

    render(
      <BundleSection
        section={section}
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

  it("calls onDecrement with the correct product and variant ids", async () => {
    const user = userEvent.setup();

    render(
      <BundleSection
        section={section}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Decrement Outdoor Camera - Black",
      }),
    );

    expect(onDecrement).toHaveBeenCalledOnce();

    expect(onDecrement).toHaveBeenCalledWith("outdoor-camera", "black");
  });

  it("renders no BundleItem components when the section is empty", () => {
    const emptySection = {
      ...section,
      items: [],
    };

    render(
      <BundleSection
        section={emptySection}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Cameras",
      }),
    ).toBeInTheDocument();

    expect(screen.queryByTestId(/bundle-item-/)).not.toBeInTheDocument();
  });
});
