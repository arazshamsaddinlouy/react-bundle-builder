import type { BundleSummaryItem as BundleSummaryItemType } from "@/types/bundle";
import { QuantityControl } from "./QuantityControl";

interface BundleSummaryItemProps {
  item: BundleSummaryItemType;
}

export function BundleSummaryItem({ item }: BundleSummaryItemProps) {
  const variantId = item.variantId ?? "__default__";

  const originalTotal = item.originalPrice * item.quantity;

  const saleTotal = item.salePrice * item.quantity;

  return (
    <div className="flex items-center gap-4">
      <img
        src={item.image}
        alt={item.name}
        className="size-16 shrink-0 rounded-[8px] object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="font-gilroy-medium text-[14px] leading-[16px] tracking-[0.005em] text-[#0B0D10]">
          {item.name}
        </p>

        <div className="mt-3">
          <QuantityControl
            productId={item.productId}
            variantId={variantId}
            quantity={item.quantity}
            productName={item.name}
          />
        </div>
      </div>

      <div className="shrink-0 text-right">
        {originalTotal > saleTotal && (
          <p className="font-gilroy-medium text-right text-[14px] leading-[16px] tracking-[0.005em] text-[#6F7882] line-through">
            ${originalTotal.toFixed(2)}
          </p>
        )}

        <p className="mt-1 font-gilroy-semibold text-right text-[14px] leading-[16px] tracking-[0.005em] text-[#4E2FD2]">
          ${saleTotal.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
