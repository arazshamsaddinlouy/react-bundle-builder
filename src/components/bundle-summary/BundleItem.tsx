import type { BundleSummaryItem, BundleVariantKey } from "@/types/bundle";
import type { ProductKey } from "@/types/product";

import ItemPrice from "./ItemPrice";
import QuantitySelector from "./QuantitySelector";

interface BundleItemProps {
  item: BundleSummaryItem;
  onIncrement: (productId: ProductKey, variantId: BundleVariantKey) => void;
  onDecrement: (productId: ProductKey, variantId: BundleVariantKey) => void;
}

export default function BundleItem({
  item,
  onIncrement,
  onDecrement,
}: BundleItemProps) {
  const originalTotal = item.originalPrice * item.quantity;
  const saleTotal = item.salePrice * item.quantity;

  return (
    <article className="flex items-center gap-[8px]">
      <div className="flex size-[41px] shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-white p-[4px]">
        <img
          src={item.image}
          alt={item.name}
          className="size-full object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-gilroy-medium text-[14px] leading-[16px] tracking-[0.005em] text-[#0B0D10] break-words">
          {item.name}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-[8px]">
        <QuantitySelector
          quantity={item.quantity}
          itemName={item.name}
          onIncrement={() => onIncrement(item.productId, item.variantId)}
          onDecrement={() => onDecrement(item.productId, item.variantId)}
        />

        <ItemPrice originalPrice={originalTotal} salePrice={saleTotal} />
      </div>
    </article>
  );
}
