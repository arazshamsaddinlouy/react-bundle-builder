import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ProductSelector from "./ProductSelector";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

vi.mock("../CategoryAccordion/CategoryAccordion", () => ({
  default: ({
    categories,
    products,
    activeCategoryId,
    onCategoryChange,
  }: {
    categories: Category[];
    products: Product[];
    activeCategoryId: string | null;
    onCategoryChange: (categoryId: string | null) => void;
  }) => (
    <div data-testid="category-accordion">
      <span data-testid="active-category">{activeCategoryId ?? "none"}</span>

      <span data-testid="categories-count">{categories.length}</span>

      <span data-testid="products-count">{products.length}</span>

      <button type="button" onClick={() => onCategoryChange("plan")}>
        Select Plan
      </button>

      <button type="button" onClick={() => onCategoryChange(null)}>
        Close Category
      </button>

      <button
        type="button"
        onClick={() => onCategoryChange("unknown-category")}
      >
        Select Unknown
      </button>
    </div>
  ),
}));

describe("ProductSelector", () => {
  const categories = [
    {
      id: "cameras",
      title: "Cameras",
      icon: "/icons/camera.svg",
    },
    {
      id: "plan",
      title: "Plan",
      icon: "/icons/plan.svg",
    },
    {
      id: "sensors",
      title: "Sensors",
      icon: "/icons/sensor.svg",
    },
  ] as Category[];

  const products = [
    {
      id: "indoor-camera",
      categoryId: "cameras",
      title: "Indoor Camera",
    },
    {
      id: "basic-plan",
      categoryId: "plan",
      title: "Basic Plan",
    },
  ] as Product[];

  it("renders CategoryAccordion", () => {
    render(<ProductSelector categories={categories} products={products} />);

    expect(screen.getByTestId("category-accordion")).toBeInTheDocument();
  });

  it("passes categories and products to CategoryAccordion", () => {
    render(<ProductSelector categories={categories} products={products} />);

    expect(screen.getByTestId("categories-count")).toHaveTextContent("3");

    expect(screen.getByTestId("products-count")).toHaveTextContent("2");
  });

  it("selects the first category by default", () => {
    render(<ProductSelector categories={categories} products={products} />);

    expect(screen.getByTestId("active-category")).toHaveTextContent("cameras");
  });

  it("changes the active category through CategoryAccordion callback", async () => {
    const user = userEvent.setup();

    render(<ProductSelector categories={categories} products={products} />);

    await user.click(
      screen.getByRole("button", {
        name: "Select Plan",
      }),
    );

    expect(screen.getByTestId("active-category")).toHaveTextContent("plan");
  });

  it("falls back to the first category when the active category is closed", async () => {
    const user = userEvent.setup();

    render(<ProductSelector categories={categories} products={products} />);

    await user.click(
      screen.getByRole("button", {
        name: "Select Plan",
      }),
    );

    expect(screen.getByTestId("active-category")).toHaveTextContent("plan");

    await user.click(
      screen.getByRole("button", {
        name: "Close Category",
      }),
    );

    expect(screen.getByTestId("active-category")).toHaveTextContent("cameras");
  });

  it("falls back to the first category when the selected category does not exist", async () => {
    const user = userEvent.setup();

    render(<ProductSelector categories={categories} products={products} />);

    await user.click(
      screen.getByRole("button", {
        name: "Select Unknown",
      }),
    );

    expect(screen.getByTestId("active-category")).toHaveTextContent("cameras");
  });

  it("passes null as activeCategoryId when categories are empty", () => {
    render(<ProductSelector categories={[]} products={products} />);

    expect(screen.getByTestId("active-category")).toHaveTextContent("none");

    expect(screen.getByTestId("categories-count")).toHaveTextContent("0");
  });

  it("uses the new first category when categories change", () => {
    const { rerender } = render(
      <ProductSelector categories={categories} products={products} />,
    );

    expect(screen.getByTestId("active-category")).toHaveTextContent("cameras");

    const updatedCategories = [
      {
        id: "protection",
        title: "Protection",
        icon: "/icons/protection.svg",
      },
      {
        id: "extras",
        title: "Extras",
        icon: "/icons/extras.svg",
      },
    ] as Category[];

    rerender(
      <ProductSelector categories={updatedCategories} products={products} />,
    );

    expect(screen.getByTestId("active-category")).toHaveTextContent(
      "protection",
    );
  });

  it("falls back to the first category when the active category is removed", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <ProductSelector categories={categories} products={products} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Select Plan",
      }),
    );

    expect(screen.getByTestId("active-category")).toHaveTextContent("plan");

    const updatedCategories = [
      {
        id: "cameras",
        title: "Cameras",
        icon: "/icons/camera.svg",
      },
      {
        id: "sensors",
        title: "Sensors",
        icon: "/icons/sensor.svg",
      },
    ] as Category[];

    rerender(
      <ProductSelector categories={updatedCategories} products={products} />,
    );

    expect(screen.getByTestId("active-category")).toHaveTextContent("cameras");
  });
});
