import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CategoryAccordion from "./CategoryAccordion";

import type { Category, CategoryKey } from "@/types/category";
import type { Product } from "@/types/product";

vi.mock(
  "@/components/bundle-builder/CategoryAccordionItem/CategoryAccordionItem",
  () => ({
    default: ({
      category,
      products,
      step,
      totalSteps,
      isActive,
      nextStepTitle,
      onToggle,
      onNext,
    }: {
      category: Category;
      products: Product[];
      step: number;
      totalSteps: number;
      isActive: boolean;
      nextStepTitle?: string;
      onToggle: () => void;
      onNext: () => void;
    }) => (
      <section data-testid={`accordion-item-${category.id}`}>
        <h2>{category.title}</h2>

        <span data-testid={`step-${category.id}`}>
          {step} of {totalSteps}
        </span>

        <span data-testid={`active-${category.id}`}>{String(isActive)}</span>

        <span data-testid={`products-count-${category.id}`}>
          {products.length}
        </span>

        {nextStepTitle && (
          <span data-testid={`next-title-${category.id}`}>{nextStepTitle}</span>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={`Toggle ${category.title}`}
        >
          Toggle
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label={`Next from ${category.title}`}
        >
          Next
        </button>
      </section>
    ),
  }),
);

describe("CategoryAccordion", () => {
  const categories: Category[] = [
    {
      id: "cameras" as CategoryKey,
      title: "Cameras",
      summaryTitle: "Cameras",
    } as Category,
    {
      id: "plan" as CategoryKey,
      title: "Plan",
      summaryTitle: "Plan",
    } as Category,
    {
      id: "sensors" as CategoryKey,
      title: "Sensors",
      summaryTitle: "Sensors",
    } as Category,
  ];

  const products: Product[] = [
    {
      id: "indoor-camera",
      categoryId: "cameras" as CategoryKey,
      title: "Indoor Camera",
    } as Product,
    {
      id: "outdoor-camera",
      categoryId: "cameras" as CategoryKey,
      title: "Outdoor Camera",
    } as Product,
    {
      id: "basic-plan",
      categoryId: "plan" as CategoryKey,
      title: "Basic Plan",
    } as Product,
  ];

  const onCategoryChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders one accordion item for each category", () => {
    render(
      <CategoryAccordion
        categories={categories}
        products={products}
        activeCategoryId={null}
        onCategoryChange={onCategoryChange}
      />,
    );

    expect(screen.getByTestId("accordion-item-cameras")).toBeInTheDocument();

    expect(screen.getByTestId("accordion-item-plan")).toBeInTheDocument();

    expect(screen.getByTestId("accordion-item-sensors")).toBeInTheDocument();
  });

  it("passes the correct step and total steps to each item", () => {
    render(
      <CategoryAccordion
        categories={categories}
        products={products}
        activeCategoryId={null}
        onCategoryChange={onCategoryChange}
      />,
    );

    expect(screen.getByTestId("step-cameras")).toHaveTextContent("1 of 3");
    expect(screen.getByTestId("step-plan")).toHaveTextContent("2 of 3");
    expect(screen.getByTestId("step-sensors")).toHaveTextContent("3 of 3");
  });

  it("marks only the active category as active", () => {
    render(
      <CategoryAccordion
        categories={categories}
        products={products}
        activeCategoryId={"plan" as CategoryKey}
        onCategoryChange={onCategoryChange}
      />,
    );

    expect(screen.getByTestId("active-cameras")).toHaveTextContent("false");
    expect(screen.getByTestId("active-plan")).toHaveTextContent("true");
    expect(screen.getByTestId("active-sensors")).toHaveTextContent("false");
  });

  it("filters products by category before passing them to each item", () => {
    render(
      <CategoryAccordion
        categories={categories}
        products={products}
        activeCategoryId={null}
        onCategoryChange={onCategoryChange}
      />,
    );

    expect(screen.getByTestId("products-count-cameras")).toHaveTextContent("2");

    expect(screen.getByTestId("products-count-plan")).toHaveTextContent("1");

    expect(screen.getByTestId("products-count-sensors")).toHaveTextContent("0");
  });

  it("opens an inactive category when its toggle is clicked", async () => {
    const user = userEvent.setup();

    render(
      <CategoryAccordion
        categories={categories}
        products={products}
        activeCategoryId={"cameras" as CategoryKey}
        onCategoryChange={onCategoryChange}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Toggle Plan",
      }),
    );

    expect(onCategoryChange).toHaveBeenCalledOnce();
    expect(onCategoryChange).toHaveBeenCalledWith("plan");
  });

  it("closes the active category when its toggle is clicked", async () => {
    const user = userEvent.setup();

    render(
      <CategoryAccordion
        categories={categories}
        products={products}
        activeCategoryId={"cameras" as CategoryKey}
        onCategoryChange={onCategoryChange}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Toggle Cameras",
      }),
    );

    expect(onCategoryChange).toHaveBeenCalledOnce();
    expect(onCategoryChange).toHaveBeenCalledWith(null);
  });

  it("moves to the next category when next is clicked", async () => {
    const user = userEvent.setup();

    render(
      <CategoryAccordion
        categories={categories}
        products={products}
        activeCategoryId={"cameras" as CategoryKey}
        onCategoryChange={onCategoryChange}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Next from Cameras",
      }),
    );

    expect(onCategoryChange).toHaveBeenCalledOnce();
    expect(onCategoryChange).toHaveBeenCalledWith("plan");
  });

  it("passes the next category title to each item", () => {
    render(
      <CategoryAccordion
        categories={categories}
        products={products}
        activeCategoryId={null}
        onCategoryChange={onCategoryChange}
      />,
    );

    expect(screen.getByTestId("next-title-cameras")).toHaveTextContent("Plan");

    expect(screen.getByTestId("next-title-plan")).toHaveTextContent("Sensors");

    expect(screen.queryByTestId("next-title-sensors")).not.toBeInTheDocument();
  });

  it("does not change the category when next is clicked on the final item", async () => {
    const user = userEvent.setup();

    render(
      <CategoryAccordion
        categories={categories}
        products={products}
        activeCategoryId={"sensors" as CategoryKey}
        onCategoryChange={onCategoryChange}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Next from Sensors",
      }),
    );

    expect(onCategoryChange).not.toHaveBeenCalled();
  });

  it("renders nothing when categories are empty", () => {
    const { container } = render(
      <CategoryAccordion
        categories={[]}
        products={products}
        activeCategoryId={null}
        onCategoryChange={onCategoryChange}
      />,
    );

    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
