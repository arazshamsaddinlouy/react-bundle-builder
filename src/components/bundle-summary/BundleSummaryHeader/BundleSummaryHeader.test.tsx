import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BundleSummaryHeader from "./BundleSummaryHeader";

describe("BundleSummaryHeader", () => {
  it("renders the review label", () => {
    render(<BundleSummaryHeader />);

    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    render(<BundleSummaryHeader />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Your security system",
      }),
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<BundleSummaryHeader />);

    expect(
      screen.getByText(
        "Review your personalized protection system designed to keep what matters most safe.",
      ),
    ).toBeInTheDocument();
  });

  it("renders exactly one heading", () => {
    render(<BundleSummaryHeader />);

    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });
});
