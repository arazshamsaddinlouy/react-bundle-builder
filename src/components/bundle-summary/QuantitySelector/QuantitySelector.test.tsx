import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import QuantitySelector from "./QuantitySelector";

describe("QuantitySelector", () => {
  const onIncrement = vi.fn();
  const onDecrement = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the current quantity", () => {
    render(
      <QuantitySelector
        quantity={3}
        itemName="Indoor Camera"
        canIncrement
        canDecrement
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders accessible increment and decrement buttons", () => {
    render(
      <QuantitySelector
        quantity={1}
        itemName="Indoor Camera"
        canIncrement
        canDecrement
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Increase Indoor Camera quantity",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Decrease Indoor Camera quantity",
      }),
    ).toBeInTheDocument();
  });

  it("calls onIncrement when the increase button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <QuantitySelector
        quantity={2}
        itemName="Indoor Camera"
        canIncrement
        canDecrement
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Increase Indoor Camera quantity",
      }),
    );

    expect(onIncrement).toHaveBeenCalledOnce();
  });

  it("calls onDecrement when the decrease button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <QuantitySelector
        quantity={2}
        itemName="Indoor Camera"
        canIncrement
        canDecrement
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Decrease Indoor Camera quantity",
      }),
    );

    expect(onDecrement).toHaveBeenCalledOnce();
  });

  it("disables the decrease button when canDecrement is false", () => {
    render(
      <QuantitySelector
        quantity={0}
        itemName="Indoor Camera"
        canIncrement
        canDecrement={false}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Decrease Indoor Camera quantity",
      }),
    ).toBeDisabled();
  });

  it("enables the decrease button when canDecrement is true", () => {
    render(
      <QuantitySelector
        quantity={1}
        itemName="Indoor Camera"
        canIncrement
        canDecrement
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Decrease Indoor Camera quantity",
      }),
    ).toBeEnabled();
  });

  it("disables the increase button when canIncrement is false", () => {
    render(
      <QuantitySelector
        quantity={5}
        itemName="Indoor Camera"
        canIncrement={false}
        canDecrement
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Increase Indoor Camera quantity",
      }),
    ).toBeDisabled();
  });

  it("enables the increase button when canIncrement is true", () => {
    render(
      <QuantitySelector
        quantity={5}
        itemName="Indoor Camera"
        canIncrement
        canDecrement
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Increase Indoor Camera quantity",
      }),
    ).toBeEnabled();
  });

  it("does not call onDecrement when the decrease button is disabled", async () => {
    const user = userEvent.setup();

    render(
      <QuantitySelector
        quantity={0}
        itemName="Indoor Camera"
        canIncrement
        canDecrement={false}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Decrease Indoor Camera quantity",
      }),
    );

    expect(onDecrement).not.toHaveBeenCalled();
  });

  it("does not call onIncrement when the increase button is disabled", async () => {
    const user = userEvent.setup();

    render(
      <QuantitySelector
        quantity={5}
        itemName="Indoor Camera"
        canIncrement={false}
        canDecrement
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Increase Indoor Camera quantity",
      }),
    );

    expect(onIncrement).not.toHaveBeenCalled();
  });
});
