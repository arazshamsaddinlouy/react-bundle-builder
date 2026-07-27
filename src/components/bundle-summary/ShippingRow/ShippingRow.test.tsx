import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ShippingRow from "./ShippingRow";

describe("ShippingRow", () => {
  it("renders the shipping icon", () => {
    const { container } = render(<ShippingRow shippingPrice={5.99} />);

    const image = container.querySelector(
      'img[src="/icons/shipping-delivery.svg"]',
    );

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the original shipping price when shipping is discounted", () => {
    render(<ShippingRow shippingPrice={5.99} />);

    expect(screen.getByText("$5.99")).toBeInTheDocument();
  });

  it("renders FREE when shipping price is greater than zero", () => {
    render(<ShippingRow shippingPrice={5.99} />);

    expect(screen.getByText("FREE")).toBeInTheDocument();
  });

  it("does not render the original price when shipping is already free", () => {
    render(<ShippingRow shippingPrice={0} />);

    expect(
      screen.queryByText("$0.00", {
        selector: ".line-through",
      }),
    ).not.toBeInTheDocument();
  });

  it("renders FREE when shipping price is zero", () => {
    render(<ShippingRow shippingPrice={0} />);

    expect(screen.getByText("FREE")).toBeInTheDocument();
  });

  it("renders the mobile layout by default", () => {
    const { container } = render(
      <ShippingRow shippingPrice={5.99} variant="mobile" />,
    );

    expect(container.firstChild).toHaveClass("flex");
    expect(container.firstChild).toHaveClass("min-[1228px]:hidden");
  });

  it("renders the desktop layout", () => {
    const { container } = render(
      <ShippingRow shippingPrice={5.99} variant="desktop" />,
    );

    expect(container.firstChild).toHaveClass("hidden");
    expect(container.firstChild).toHaveClass("min-[1228px]:flex");
  });

  it("uses desktop as the default variant", () => {
    const { container } = render(<ShippingRow shippingPrice={5.99} />);

    expect(container.firstChild).toHaveClass("hidden");
    expect(container.firstChild).toHaveClass("min-[1228px]:flex");
  });

  it("formats decimal shipping prices", () => {
    render(<ShippingRow shippingPrice={12.5} />);

    expect(screen.getByText("$12.50")).toBeInTheDocument();
  });
});
