interface QuantitySelectorProps {
  quantity: number;
  itemName: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function QuantitySelector({
  quantity,
  itemName,
  onIncrement,
  onDecrement,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-[4px]">
      <button
        type="button"
        disabled={quantity === 0}
        aria-label={`Decrease ${itemName} quantity`}
        onClick={onDecrement}
        className="flex size-[20px] cursor-pointer items-center justify-center rounded-[4px] bg-white font-gilroy-medium text-[14px] leading-[14px] text-[#575757] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        −
      </button>

      <span className="flex min-w-[20px] items-center justify-center font-gilroy-medium text-[14px] leading-[20px] text-[#575757]">
        {quantity}
      </span>

      <button
        type="button"
        aria-label={`Increase ${itemName} quantity`}
        onClick={onIncrement}
        className="flex size-[20px] cursor-pointer items-center justify-center rounded-[4px] bg-white font-gilroy-medium text-[14px] leading-[14px] text-[#575757] transition-opacity hover:opacity-80"
      >
        +
      </button>
    </div>
  );
}
