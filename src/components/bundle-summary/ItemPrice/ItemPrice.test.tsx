import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ItemPrice from "./ItemPrice";

describe("ItemPrice", () => {
  it("renders both original and sale prices when a discount exists", () => {
    render(<ItemPrice originalPrice={120} salePrice={90} />);

    expect(screen.getByText("$120.00")).toBeInTheDocument();
    expect(screen.getByText("$90.00")).toBeInTheDocument();
  });

  it("does not render the original price when there is no discount", () => {
    render(<ItemPrice originalPrice={90} salePrice={90} />);

    expect(
      screen.queryByText("$90.00", {
        selector: ".line-through",
      }),
    ).not.toBeInTheDocument();

    expect(screen.getByText("$90.00")).toBeInTheDocument();
  });

  it("does not render the original price when it is lower than the sale price", () => {
    render(<ItemPrice originalPrice={80} salePrice={90} />);

    expect(screen.queryByText("$80.00")).not.toBeInTheDocument();

    expect(screen.getByText("$90.00")).toBeInTheDocument();
  });

  it("formats decimal prices correctly", () => {
    render(<ItemPrice originalPrice={129.99} salePrice={99.5} />);

    expect(screen.getByText("$129.99")).toBeInTheDocument();
    expect(screen.getByText("$99.50")).toBeInTheDocument();
  });

  it("renders only one price when there is no discount", () => {
    render(<ItemPrice originalPrice={75} salePrice={75} />);

    expect(screen.getAllByText("$75.00")).toHaveLength(1);
  });
});
