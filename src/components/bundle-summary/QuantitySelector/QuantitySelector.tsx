import clsx from "clsx";

interface QuantitySelectorProps {
  quantity: number;
  itemName: string;
  canIncrement: boolean;
  canDecrement: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function QuantitySelector({
  quantity,
  itemName,
  canIncrement,
  canDecrement,
  onIncrement,
  onDecrement,
}: QuantitySelectorProps) {
  const buttonClass = (enabled: boolean) =>
    clsx(
      "flex size-[20px] items-center justify-center rounded-[4px] font-gilroy-medium text-[14px] leading-[14px] transition-colors",
      enabled
        ? "cursor-pointer bg-white text-[#575757] hover:bg-[#F7F8FA]"
        : "cursor-not-allowed border border-[#CED6DE] bg-[#F1F1F2] text-[#A5ADB7]",
    );

  return (
    <div className="flex items-center gap-[4px]">
      <button
        type="button"
        disabled={!canDecrement}
        aria-label={`Decrease ${itemName} quantity`}
        onClick={onDecrement}
        className={buttonClass(canDecrement)}
      >
        −
      </button>

      <span className="flex min-w-[20px] items-center justify-center font-gilroy-medium text-[14px] leading-[20px] text-[#575757]">
        {quantity}
      </span>

      <button
        type="button"
        disabled={!canIncrement}
        aria-label={`Increase ${itemName} quantity`}
        onClick={onIncrement}
        className={buttonClass(canIncrement)}
      >
        +
      </button>
    </div>
  );
}
