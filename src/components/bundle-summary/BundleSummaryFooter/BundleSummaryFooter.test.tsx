import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BundleSummaryFooter from "./BundleSummaryFooter";

const { clearBundleMock, toastSuccessMock } = vi.hoisted(() => ({
  clearBundleMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock("@/store/useBundleStore", () => ({
  useBundleStore: (
    selector: (state: { clearBundle: typeof clearBundleMock }) => unknown,
  ) =>
    selector({
      clearBundle: clearBundleMock,
    }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessMock,
  },
}));

vi.mock("@/components/bundle-summary/ShippingRow/ShippingRow", () => ({
  default: ({
    shippingPrice,
    variant,
  }: {
    shippingPrice: number;
    variant: "mobile" | "desktop";
  }) => (
    <div data-testid="shipping-row">
      <span data-testid="shipping-price">{shippingPrice}</span>
      <span data-testid="shipping-variant">{variant}</span>
    </div>
  ),
}));

vi.mock("@/components/bundle-summary/BundleOffer/BundleOffer", () => ({
  default: ({
    originalPrice,
    finalPrice,
    monthlyPrice,
    installmentMonths,
    hasDiscount,
  }: {
    originalPrice: number;
    finalPrice: number;
    monthlyPrice: number;
    installmentMonths: number;
    hasDiscount: boolean;
  }) => (
    <div data-testid="bundle-offer">
      <span data-testid="offer-original-price">{originalPrice}</span>

      <span data-testid="offer-final-price">{finalPrice}</span>

      <span data-testid="offer-monthly-price">{monthlyPrice}</span>

      <span data-testid="offer-installment-months">{installmentMonths}</span>

      <span data-testid="offer-has-discount">{String(hasDiscount)}</span>
    </div>
  ),
}));

describe("BundleSummaryFooter", () => {
  const onSaveMock = vi.fn();

  const defaultProps = {
    shippingPrice: 5.99,
    installmentMonths: 12,
    originalPrice: 480,
    finalPrice: 360,
    monthlyPrice: 30,
    savings: 120,
    hasDiscount: true,
    onSave: onSaveMock,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders ShippingRow with desktop variant", () => {
    render(<BundleSummaryFooter {...defaultProps} />);

    expect(screen.getByTestId("shipping-row")).toBeInTheDocument();

    expect(screen.getByTestId("shipping-price")).toHaveTextContent("5.99");

    expect(screen.getByTestId("shipping-variant")).toHaveTextContent("desktop");
  });

  it("passes pricing props to BundleOffer", () => {
    render(<BundleSummaryFooter {...defaultProps} />);

    expect(screen.getByTestId("bundle-offer")).toBeInTheDocument();

    expect(screen.getByTestId("offer-original-price")).toHaveTextContent("480");

    expect(screen.getByTestId("offer-final-price")).toHaveTextContent("360");

    expect(screen.getByTestId("offer-monthly-price")).toHaveTextContent("30");

    expect(screen.getByTestId("offer-installment-months")).toHaveTextContent(
      "12",
    );

    expect(screen.getByTestId("offer-has-discount")).toHaveTextContent("true");
  });

  it("renders the savings message when a discount exists", () => {
    render(<BundleSummaryFooter {...defaultProps} />);

    expect(
      screen.getByText(
        /Congrats! You’re saving \$120\.00 on your security bundle!/i,
      ),
    ).toBeInTheDocument();
  });

  it("does not render the savings message when there is no discount", () => {
    render(
      <BundleSummaryFooter {...defaultProps} hasDiscount={false} savings={0} />,
    );

    expect(
      screen.queryByText(/Congrats! You’re saving/i),
    ).not.toBeInTheDocument();
  });

  it("calls onSave when the save button is clicked", async () => {
    const user = userEvent.setup();

    render(<BundleSummaryFooter {...defaultProps} />);

    await user.click(
      screen.getByRole("button", {
        name: "Save my system for later",
      }),
    );

    expect(onSaveMock).toHaveBeenCalledOnce();
  });

  it("shows a checkout success toast", async () => {
    const user = userEvent.setup();

    render(<BundleSummaryFooter {...defaultProps} />);

    await user.click(
      screen.getByRole("button", {
        name: "Checkout",
      }),
    );

    expect(toastSuccessMock).toHaveBeenCalledOnce();

    expect(toastSuccessMock).toHaveBeenCalledWith(
      "Your security system is ready",
      expect.objectContaining({
        description:
          "Checkout is not included in this prototype. Total: $360.00",
      }),
    );
  });

  it("adds a Start over action to the checkout toast", async () => {
    const user = userEvent.setup();

    render(<BundleSummaryFooter {...defaultProps} />);

    await user.click(
      screen.getByRole("button", {
        name: "Checkout",
      }),
    );

    expect(toastSuccessMock).toHaveBeenCalledWith(
      "Your security system is ready",
      expect.objectContaining({
        action: expect.objectContaining({
          label: "Start over",
          onClick: clearBundleMock,
        }),
      }),
    );
  });

  it("clears the bundle when the toast action is executed", async () => {
    const user = userEvent.setup();

    render(<BundleSummaryFooter {...defaultProps} />);

    await user.click(
      screen.getByRole("button", {
        name: "Checkout",
      }),
    );

    const toastOptions = toastSuccessMock.mock.calls[0][1];

    toastOptions.action.onClick();

    expect(clearBundleMock).toHaveBeenCalledOnce();
  });

  it("formats the final price in the checkout toast", async () => {
    const user = userEvent.setup();

    render(<BundleSummaryFooter {...defaultProps} finalPrice={349.5} />);

    await user.click(
      screen.getByRole("button", {
        name: "Checkout",
      }),
    );

    expect(toastSuccessMock).toHaveBeenCalledWith(
      "Your security system is ready",
      expect.objectContaining({
        description:
          "Checkout is not included in this prototype. Total: $349.50",
      }),
    );
  });

  it("formats decimal savings in the savings message", () => {
    render(<BundleSummaryFooter {...defaultProps} savings={99.5} />);

    expect(
      screen.getByText(
        /Congrats! You’re saving \$99\.50 on your security bundle!/i,
      ),
    ).toBeInTheDocument();
  });
});
