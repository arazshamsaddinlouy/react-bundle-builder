import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProductList from "./ProductList";

import type { Product } from "@/types/product";

vi.mock("@/components/bundle-builder/ProductCard/ProductCard", () => ({
  default: ({ product }: { product: Product }) => (
    <article data-testid={`product-card-${product.id}`}>
      {product.title}
    </article>
  ),
}));

describe("ProductList", () => {
  const products = [
    {
      id: "indoor-camera",
      categoryId: "cameras",
      title: "Indoor Camera",
    },
    {
      id: "outdoor-camera",
      categoryId: "cameras",
      title: "Outdoor Camera",
    },
    {
      id: "doorbell-camera",
      categoryId: "cameras",
      title: "Doorbell Camera",
    },
  ] as Product[];

  it("renders an empty state when no products are available", () => {
    render(<ProductList products={[]} />);

    expect(screen.getByText("No products available.")).toBeInTheDocument();

    expect(screen.queryByTestId(/product-card-/)).not.toBeInTheDocument();
  });

  it("renders one ProductCard for each product", () => {
    render(<ProductList products={products} />);

    expect(
      screen.getByTestId("product-card-indoor-camera"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("product-card-outdoor-camera"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("product-card-doorbell-camera"),
    ).toBeInTheDocument();

    expect(screen.getAllByTestId(/product-card-/)).toHaveLength(3);
  });

  it("passes each product to its corresponding ProductCard", () => {
    render(<ProductList products={products} />);

    expect(screen.getByTestId("product-card-indoor-camera")).toHaveTextContent(
      "Indoor Camera",
    );

    expect(screen.getByTestId("product-card-outdoor-camera")).toHaveTextContent(
      "Outdoor Camera",
    );

    expect(
      screen.getByTestId("product-card-doorbell-camera"),
    ).toHaveTextContent("Doorbell Camera");
  });

  it("applies the single-item layout classes to the last product when the product count is odd", () => {
    const { container } = render(<ProductList products={products} />);

    const productCards = screen.getAllByTestId(/product-card-/);

    const firstWrapper = productCards[0].parentElement;
    const secondWrapper = productCards[1].parentElement;
    const lastWrapper = productCards[2].parentElement;

    expect(firstWrapper).not.toHaveClass("min-[1228px]:col-span-2");

    expect(secondWrapper).not.toHaveClass("min-[1228px]:col-span-2");

    expect(lastWrapper).toHaveClass(
      "min-[1228px]:col-span-2",
      "min-[1228px]:mx-auto",
      "min-[1228px]:w-[calc(50%-7.5px)]",
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it("does not apply the single-item layout classes when the product count is even", () => {
    render(<ProductList products={products.slice(0, 2)} />);

    const productCards = screen.getAllByTestId(/product-card-/);

    productCards.forEach((card) => {
      expect(card.parentElement).not.toHaveClass(
        "min-[1228px]:col-span-2",
        "min-[1228px]:mx-auto",
        "min-[1228px]:w-[calc(50%-7.5px)]",
      );
    });
  });

  it("applies the single-item layout classes when there is only one product", () => {
    render(<ProductList products={[products[0]]} />);

    const wrapper = screen.getByTestId(
      "product-card-indoor-camera",
    ).parentElement;

    expect(wrapper).toHaveClass(
      "min-[1228px]:col-span-2",
      "min-[1228px]:mx-auto",
      "min-[1228px]:w-[calc(50%-7.5px)]",
    );
  });

  it("renders products in the same order they are provided", () => {
    render(<ProductList products={products} />);

    const cards = screen.getAllByTestId(/product-card-/);

    expect(cards[0]).toHaveTextContent("Indoor Camera");
    expect(cards[1]).toHaveTextContent("Outdoor Camera");
    expect(cards[2]).toHaveTextContent("Doorbell Camera");
  });
});
