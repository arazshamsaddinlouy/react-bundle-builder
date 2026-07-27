import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import BundleOffer from "./BundleOffer";

vi.mock("@/components/bundle-summary/BundlePricing/BundlePricing", () => ({
  default: ({
    variant,
    originalPrice,
    finalPrice,
    monthlyPrice,
    installmentMonths,
    hasDiscount,
  }: {
    variant: "desktop" | "tablet";
    originalPrice: number;
    finalPrice: number;
    monthlyPrice: number;
    installmentMonths: number;
    hasDiscount: boolean;
  }) => (
    <div data-testid={`bundle-pricing-${variant}`}>
      <span>{variant}</span>
      <span>{originalPrice}</span>
      <span>{finalPrice}</span>
      <span>{monthlyPrice}</span>
      <span>{installmentMonths}</span>
      <span>{String(hasDiscount)}</span>
    </div>
  ),
}));

describe("BundleOffer", () => {
  const props = {
    originalPrice: 450,
    finalPrice: 320,
    monthlyPrice: 26.67,
    installmentMonths: 12,
    hasDiscount: true,
  };

  it("renders the bundle offer badge image", () => {
    render(<BundleOffer {...props} />);

    expect(
      screen.getByRole("img", {
        name: "Bundle offer",
      }),
    ).toHaveAttribute("src", "/images/layout/summary-badge.png");
  });

  it("renders the promotional text", () => {
    render(<BundleOffer {...props} />);

    expect(
      screen.getByRole("heading", {
        name: "30-day hassle-free returns",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/If you're not totally in love with the product/i),
    ).toBeInTheDocument();
  });

  it("renders the desktop BundlePricing", () => {
    render(<BundleOffer {...props} />);

    expect(screen.getByTestId("bundle-pricing-desktop")).toBeInTheDocument();
  });

  it("renders the tablet BundlePricing", () => {
    render(<BundleOffer {...props} />);

    expect(screen.getByTestId("bundle-pricing-tablet")).toBeInTheDocument();
  });

  it("passes the correct props to the desktop BundlePricing", () => {
    render(<BundleOffer {...props} />);

    const desktop = screen.getByTestId("bundle-pricing-desktop");

    expect(desktop).toHaveTextContent("desktop");
    expect(desktop).toHaveTextContent("450");
    expect(desktop).toHaveTextContent("320");
    expect(desktop).toHaveTextContent("26.67");
    expect(desktop).toHaveTextContent("12");
    expect(desktop).toHaveTextContent("true");
  });

  it("passes the correct props to the tablet BundlePricing", () => {
    render(<BundleOffer {...props} />);

    const tablet = screen.getByTestId("bundle-pricing-tablet");

    expect(tablet).toHaveTextContent("tablet");
    expect(tablet).toHaveTextContent("450");
    expect(tablet).toHaveTextContent("320");
    expect(tablet).toHaveTextContent("26.67");
    expect(tablet).toHaveTextContent("12");
    expect(tablet).toHaveTextContent("true");
  });

  it("renders exactly two BundlePricing components", () => {
    render(<BundleOffer {...props} />);

    expect(screen.getAllByTestId(/bundle-pricing-/)).toHaveLength(2);
  });
});
