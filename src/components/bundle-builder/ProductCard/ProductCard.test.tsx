import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProductCard from "./ProductCard";

import { DEFAULT_VARIANT_ID } from "@/constants/bundle";
import type { SelectedVariants } from "@/types/bundle";
import type { Product } from "@/types/product";

const setActiveVariantMock = vi.fn();
const incrementQuantityMock = vi.fn();
const decrementQuantityMock = vi.fn();

let selectedVariantsMock: SelectedVariants = {};

vi.mock("@/store/useBundleStore", () => ({
  useBundleStore: vi.fn(
    (
      selector: (state: {
        selectedVariants: SelectedVariants;
        setActiveVariant: typeof setActiveVariantMock;
        incrementQuantity: typeof incrementQuantityMock;
        decrementQuantity: typeof decrementQuantityMock;
      }) => unknown,
    ) =>
      selector({
        selectedVariants: selectedVariantsMock,
        setActiveVariant: setActiveVariantMock,
        incrementQuantity: incrementQuantityMock,
        decrementQuantity: decrementQuantityMock,
      }),
  ),
}));

describe("ProductCard", () => {
  const productWithVariants = {
    id: "indoor-camera",
    categoryId: "cameras",
    title: "Indoor Camera",
    description: "Monitor your home from anywhere.",
    image: "/images/indoor-camera.png",
    price: 100,
    compareAtPrice: 130,
    badge: "Best Seller",
    variants: [
      {
        id: "white",
        title: "White",
        image: "/images/indoor-camera-white.png",
        price: 90,
        compareAtPrice: 120,
      },
      {
        id: "black",
        title: "Black",
        image: "/images/indoor-camera-black.png",
        price: 95,
        compareAtPrice: 125,
      },
    ],
  } as Product;

  const productWithoutVariants = {
    id: "motion-sensor",
    categoryId: "sensors",
    title: "Motion Sensor",
    description: "Detect movement inside your home.",
    image: "/images/motion-sensor.png",
    price: 50,
    compareAtPrice: 70,
    variants: [],
  } as Product;

  beforeEach(() => {
    selectedVariantsMock = {};

    setActiveVariantMock.mockClear();
    incrementQuantityMock.mockClear();
    decrementQuantityMock.mockClear();
  });

  it("renders the product information", () => {
    render(<ProductCard product={productWithVariants} />);

    expect(
      screen.getByRole("heading", {
        name: "Indoor Camera",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Monitor your home from anywhere."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("img", {
        name: "Indoor Camera",
      }),
    ).toHaveAttribute("src", "/images/indoor-camera.png");

    expect(screen.getByText("Learn More")).toBeInTheDocument();
    expect(screen.getByText("Best Seller")).toBeInTheDocument();
  });

  it("uses the first variant as the active variant by default", () => {
    render(<ProductCard product={productWithVariants} />);

    expect(
      screen.getByRole("button", {
        name: /white/i,
      }),
    ).toHaveAttribute("aria-pressed", "true");

    expect(
      screen.getByRole("button", {
        name: /black/i,
      }),
    ).toHaveAttribute("aria-pressed", "false");

    expect(screen.getByText("$90.00")).toBeInTheDocument();
    expect(screen.getByText("$120.00")).toBeInTheDocument();
  });

  it("uses the active variant stored in the bundle store", () => {
    selectedVariantsMock = {
      "indoor-camera": {
        activeVariantId: "black",
        quantities: {
          white: 0,
          black: 2,
        },
      },
    } as SelectedVariants;

    render(<ProductCard product={productWithVariants} />);

    expect(
      screen.getByRole("button", {
        name: /black/i,
      }),
    ).toHaveAttribute("aria-pressed", "true");

    expect(
      screen.getByRole("button", {
        name: /white/i,
      }),
    ).toHaveAttribute("aria-pressed", "false");

    expect(screen.getByText("$95.00")).toBeInTheDocument();
    expect(screen.getByText("$125.00")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("changes the active variant when a variant is clicked", async () => {
    const user = userEvent.setup();

    render(<ProductCard product={productWithVariants} />);

    await user.click(
      screen.getByRole("button", {
        name: /black/i,
      }),
    );

    expect(setActiveVariantMock).toHaveBeenCalledOnce();

    expect(setActiveVariantMock).toHaveBeenCalledWith("indoor-camera", "black");
  });

  it("increments the active variant quantity", async () => {
    const user = userEvent.setup();

    selectedVariantsMock = {
      "indoor-camera": {
        activeVariantId: "black",
        quantities: {
          black: 2,
        },
      },
    } as SelectedVariants;

    render(<ProductCard product={productWithVariants} />);

    await user.click(
      screen.getByRole("button", {
        name: "Increase Indoor Camera quantity",
      }),
    );

    expect(incrementQuantityMock).toHaveBeenCalledOnce();

    expect(incrementQuantityMock).toHaveBeenCalledWith(
      "indoor-camera",
      "black",
    );
  });

  it("decrements the active variant quantity", async () => {
    const user = userEvent.setup();

    selectedVariantsMock = {
      "indoor-camera": {
        activeVariantId: "white",
        quantities: {
          white: 3,
        },
      },
    } as SelectedVariants;

    render(<ProductCard product={productWithVariants} />);

    await user.click(
      screen.getByRole("button", {
        name: "Decrease Indoor Camera quantity",
      }),
    );

    expect(decrementQuantityMock).toHaveBeenCalledOnce();

    expect(decrementQuantityMock).toHaveBeenCalledWith(
      "indoor-camera",
      "white",
    );
  });

  it("disables the decrease button when quantity is zero", () => {
    render(<ProductCard product={productWithVariants} />);

    expect(
      screen.getByRole("button", {
        name: "Decrease Indoor Camera quantity",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Increase Indoor Camera quantity",
      }),
    ).toBeEnabled();

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("does not display compare-at price when it is not greater than sale price", () => {
    const product = {
      ...productWithoutVariants,
      price: 50,
      compareAtPrice: 50,
    } as Product;

    render(<ProductCard product={product} />);

    expect(screen.getByText("$50.00")).toBeInTheDocument();

    expect(screen.queryByText("$70.00")).not.toBeInTheDocument();
  });

  it("uses product prices for a product without variants", () => {
    render(<ProductCard product={productWithoutVariants} />);

    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.getByText("$70.00")).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /white/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("uses the default variant id for products without variants", async () => {
    const user = userEvent.setup();

    selectedVariantsMock = {
      "motion-sensor": {
        activeVariantId: DEFAULT_VARIANT_ID,
        quantities: {
          [DEFAULT_VARIANT_ID]: 1,
        },
      },
    } as SelectedVariants;

    render(<ProductCard product={productWithoutVariants} />);

    await user.click(
      screen.getByRole("button", {
        name: "Increase Motion Sensor quantity",
      }),
    );

    expect(incrementQuantityMock).toHaveBeenCalledWith(
      "motion-sensor",
      DEFAULT_VARIANT_ID,
    );
  });

  it("displays the quantity of the active variant only", () => {
    selectedVariantsMock = {
      "indoor-camera": {
        activeVariantId: "black",
        quantities: {
          white: 4,
          black: 2,
        },
      },
    } as SelectedVariants;

    render(<ProductCard product={productWithVariants} />);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.queryByText("4")).not.toBeInTheDocument();
  });

  it("treats the product as selected when any variant has a positive quantity", () => {
    selectedVariantsMock = {
      "indoor-camera": {
        activeVariantId: "black",
        quantities: {
          white: 2,
          black: 0,
        },
      },
    } as SelectedVariants;

    const { container } = render(<ProductCard product={productWithVariants} />);

    const article = container.querySelector("article");

    expect(article).toHaveClass("border-[rgba(78,47,210,0.7)]");

    // Quantity shown belongs to the active black variant.
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("shows a placeholder when a variant has no image", () => {
    const product = {
      ...productWithVariants,
      variants: [
        {
          id: "white",
          title: "White",
          image: undefined,
          price: 90,
        },
      ],
    } as Product;

    render(<ProductCard product={product} />);

    expect(
      screen.queryByRole("img", {
        name: "White",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /white/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows a placeholder after a variant image fails to load", () => {
    render(<ProductCard product={productWithVariants} />);

    const whiteVariantImage = screen.getByRole("img", {
      name: "White",
    });

    fireEvent.error(whiteVariantImage);

    expect(
      screen.queryByRole("img", {
        name: "White",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /white/i,
      }),
    ).toBeInTheDocument();
  });

  it("does not render a badge when the product has no badge", () => {
    render(<ProductCard product={productWithoutVariants} />);

    expect(screen.queryByText("Best Seller")).not.toBeInTheDocument();
  });
});
