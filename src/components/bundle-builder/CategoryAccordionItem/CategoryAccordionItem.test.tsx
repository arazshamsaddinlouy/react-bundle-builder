import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CategoryAccordionItem from "./CategoryAccordionItem";

import type { SelectedVariants } from "@/types/bundle";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

let mockedSelectedVariants: SelectedVariants = {};

vi.mock("@/store/useBundleStore", () => ({
  useBundleStore: vi.fn(
    (selector: (state: { selectedVariants: SelectedVariants }) => unknown) =>
      selector({
        selectedVariants: mockedSelectedVariants,
      }),
  ),
}));

vi.mock("@/components/bundle-builder/ProductList/ProductList", () => ({
  default: ({ products }: { products: Product[] }) => (
    <div data-testid="product-list">
      {products.map((product) => (
        <span key={product.id}>{product.title}</span>
      ))}
    </div>
  ),
}));

describe("CategoryAccordionItem", () => {
  const category = {
    id: "cameras",
    title: "Cameras",
    summaryTitle: "Your Cameras",
    icon: "/icons/camera.svg",
  } as Category;

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
  ] as Product[];

  const defaultProps = {
    category,
    products,
    step: 1,
    totalSteps: 4,
    isActive: false,
    nextStepTitle: "Plan",
    onToggle: vi.fn(),
    onNext: vi.fn(),
  };

  beforeEach(() => {
    mockedSelectedVariants = {};
    vi.clearAllMocks();
  });

  it("renders the step information and category title", () => {
    render(<CategoryAccordionItem {...defaultProps} />);

    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Cameras" }),
    ).toBeInTheDocument();
  });

  it("renders the accordion trigger with correct accessibility attributes", () => {
    render(<CategoryAccordionItem {...defaultProps} />);

    const trigger = screen.getByRole("button", {
      name: "Cameras",
    });

    expect(trigger).toHaveAttribute("id", "category-trigger-cameras");
    expect(trigger).toHaveAttribute(
      "aria-controls",
      "category-content-cameras",
    );
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onToggle when the category trigger is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<CategoryAccordionItem {...defaultProps} onToggle={onToggle} />);

    await user.click(
      screen.getByRole("button", {
        name: "Cameras",
      }),
    );

    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("hides category content when inactive", () => {
    render(<CategoryAccordionItem {...defaultProps} isActive={false} />);

    const region = screen.getByRole("region", {
      hidden: true,
    });

    expect(region).toHaveAttribute("id", "category-content-cameras");
    expect(region).toHaveAttribute("aria-hidden", "true");

    expect(screen.getByTestId("product-list")).toBeInTheDocument();

    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();
  });

  it("renders category content when active", () => {
    render(<CategoryAccordionItem {...defaultProps} isActive />);

    const region = screen.getByRole("region");

    expect(region).toHaveAttribute("id", "category-content-cameras");
    expect(region).toHaveAttribute(
      "aria-labelledby",
      "category-trigger-cameras",
    );
    expect(region).toHaveAttribute("aria-hidden", "false");

    expect(screen.getByTestId("product-list")).toBeInTheDocument();
    expect(screen.getByText("Indoor Camera")).toBeInTheDocument();
    expect(screen.getByText("Outdoor Camera")).toBeInTheDocument();
  });

  it("sets aria-expanded to true when active", () => {
    render(<CategoryAccordionItem {...defaultProps} isActive />);

    expect(
      screen.getByRole("button", {
        name: /cameras/i,
      }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("shows zero selected when no products have positive quantities", () => {
    mockedSelectedVariants = {};

    render(<CategoryAccordionItem {...defaultProps} isActive />);

    expect(screen.getByText("0 selected")).toBeInTheDocument();
  });

  it("counts selected products rather than total quantity", () => {
    mockedSelectedVariants = {
      "indoor-camera": {
        activeVariantId: "white",
        quantities: {
          white: 3,
          black: 0,
        },
      },
      "outdoor-camera": {
        activeVariantId: "default",
        quantities: {
          default: 2,
        },
      },
    };

    render(<CategoryAccordionItem {...defaultProps} isActive />);

    expect(screen.getByText("2 selected")).toBeInTheDocument();
  });

  it("does not count a product when all variant quantities are zero", () => {
    mockedSelectedVariants = {
      "indoor-camera": {
        activeVariantId: "white",
        quantities: {
          white: 0,
          black: 0,
        },
      },
      "outdoor-camera": {
        activeVariantId: "default",
        quantities: {
          default: 1,
        },
      },
    };

    render(<CategoryAccordionItem {...defaultProps} isActive />);

    expect(screen.getByText("1 selected")).toBeInTheDocument();
  });

  it("counts a product once when multiple variants are selected", () => {
    mockedSelectedVariants = {
      "indoor-camera": {
        activeVariantId: "white",
        quantities: {
          white: 2,
          black: 4,
        },
      },
    };

    render(<CategoryAccordionItem {...defaultProps} isActive />);

    expect(screen.getByText("1 selected")).toBeInTheDocument();
  });

  it("renders the next button for a non-final step", () => {
    render(
      <CategoryAccordionItem
        {...defaultProps}
        isActive
        step={1}
        totalSteps={4}
        nextStepTitle="Plan"
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Next: Plan",
      }),
    ).toBeInTheDocument();
  });

  it("calls onNext when the next button is clicked", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();

    render(
      <CategoryAccordionItem {...defaultProps} isActive onNext={onNext} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Next: Plan",
      }),
    );

    expect(onNext).toHaveBeenCalledOnce();
  });

  it("uses Continue when nextStepTitle is missing", () => {
    render(
      <CategoryAccordionItem
        {...defaultProps}
        isActive
        nextStepTitle={undefined}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Next: Continue",
      }),
    ).toBeInTheDocument();
  });

  it("does not render the next button on the last step", () => {
    render(
      <CategoryAccordionItem
        {...defaultProps}
        isActive
        step={4}
        totalSteps={4}
      />,
    );

    expect(
      screen.queryByRole("button", {
        name: /next:/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("does not render the next button when the final step is inactive", () => {
    render(
      <CategoryAccordionItem
        {...defaultProps}
        isActive={false}
        step={4}
        totalSteps={4}
      />,
    );

    expect(
      screen.queryByRole("button", {
        name: /next:/i,
      }),
    ).not.toBeInTheDocument();
  });
});
