import { describe, expect, it } from "vitest";

import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("formats a positive number as USD currency", () => {
    expect(formatCurrency(399)).toBe("$399.00");
  });

  it("formats zero as FREE", () => {
    expect(formatCurrency(0)).toBe("FREE");
  });
});
