import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BundlePricing from "./BundlePricing";

describe("BundlePricing", () => {
  const defaultProps = {
    originalPrice: 450,
    finalPrice: 320,
    monthlyPrice: 26.67,
    installmentMonths: 12,
    hasDiscount: true,
    variant: "desktop" as const,
  };

  it("renders the final price", () => {
    render(<BundlePricing {...defaultProps} />);

    expect(screen.getByText("$320.00")).toBeInTheDocument();
  });

  it("renders the original price when a discount exists", () => {
    render(<BundlePricing {...defaultProps} />);

    expect(screen.getByText("$450.00")).toBeInTheDocument();
  });

  it("does not render the original price when there is no discount", () => {
    render(<BundlePricing {...defaultProps} hasDiscount={false} />);

    expect(screen.queryByText("$450.00")).not.toBeInTheDocument();

    expect(screen.getByText("$320.00")).toBeInTheDocument();
  });

  it("renders the monthly installment label", () => {
    render(<BundlePricing {...defaultProps} />);

    expect(screen.getByText("as low as $26.67/mo")).toBeInTheDocument();
  });

  it("does not render the installment label when installmentMonths is zero", () => {
    render(<BundlePricing {...defaultProps} installmentMonths={0} />);

    expect(screen.queryByText(/as low as/i)).not.toBeInTheDocument();
  });

  it("renders desktop layout classes", () => {
    const { container } = render(
      <BundlePricing {...defaultProps} variant="desktop" />,
    );

    expect(container.firstChild).toHaveClass("flex", "flex-col", "items-end");

    expect(container.firstChild).not.toHaveClass("justify-between");
  });

  it("renders tablet layout classes", () => {
    const { container } = render(
      <BundlePricing {...defaultProps} variant="tablet" />,
    );

    expect(container.firstChild).toHaveClass("items-end", "justify-between");
  });

  it("formats all displayed prices", () => {
    render(<BundlePricing {...defaultProps} />);

    expect(screen.getByText("$450.00")).toBeInTheDocument();
    expect(screen.getByText("$320.00")).toBeInTheDocument();
    expect(screen.getByText("as low as $26.67/mo")).toBeInTheDocument();
  });

  it("renders only the final price when there is no discount and no installment", () => {
    render(
      <BundlePricing
        originalPrice={450}
        finalPrice={320}
        monthlyPrice={0}
        installmentMonths={0}
        hasDiscount={false}
        variant="desktop"
      />,
    );

    expect(screen.getByText("$320.00")).toBeInTheDocument();

    expect(screen.queryByText("$450.00")).not.toBeInTheDocument();

    expect(screen.queryByText(/as low as/i)).not.toBeInTheDocument();
  });

  it("supports decimal prices", () => {
    render(
      <BundlePricing
        originalPrice={499.99}
        finalPrice={349.5}
        monthlyPrice={29.125}
        installmentMonths={12}
        hasDiscount
        variant="desktop"
      />,
    );

    expect(screen.getByText("$499.99")).toBeInTheDocument();
    expect(screen.getByText("$349.50")).toBeInTheDocument();
    expect(screen.getByText("as low as $29.13/mo")).toBeInTheDocument();
  });
});
