import { useBundleStore } from "@/store/useBundleStore";

interface QuantityControlProps {
  productId: string;
  variantId: string;
  quantity: number;
  productName: string;
}

export function QuantityControl({
  productId,
  variantId,
  quantity,
  productName,
}: QuantityControlProps) {
  const increaseQuantity = useBundleStore((state) => state.incrementQuantity);

  const decreaseQuantity = useBundleStore((state) => state.decrementQuantity);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => decreaseQuantity(productId, variantId)}
        aria-label={`Decrease quantity of ${productName}`}
        className="flex size-7 items-center justify-center rounded-full border border-[#D8DDE3] font-gilroy-semibold text-[16px] text-[#1F1F1F] transition hover:bg-[#F5F6F8]"
      >
        −
      </button>

      <span className="min-w-5 text-center font-gilroy-medium text-[14px] leading-[16px] text-[#0B0D10]">
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => increaseQuantity(productId, variantId)}
        aria-label={`Increase quantity of ${productName}`}
        className="flex size-7 items-center justify-center rounded-full border border-[#D8DDE3] font-gilroy-semibold text-[16px] text-[#1F1F1F] transition hover:bg-[#F5F6F8]"
      >
        +
      </button>
    </div>
  );
}
