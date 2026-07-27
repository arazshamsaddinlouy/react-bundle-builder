import { formatCurrency } from "@/utils/formatCurrency";

interface ItemPriceProps {
  originalPrice: number;
  salePrice: number;
}

export default function ItemPrice({
  originalPrice,
  salePrice,
}: ItemPriceProps) {
  const hasDiscount = originalPrice > salePrice;

  return (
    <div className="w-[58px] shrink-0 text-right">
      {hasDiscount && (
        <p className="font-gilroy-medium text-[14px] leading-[16px] tracking-[0.005em] text-[#6F7882] line-through">
          {formatCurrency(originalPrice)}
        </p>
      )}

      <p className="font-gilroy-semibold text-[14px] leading-[16px] tracking-[0.005em] text-[#4E2FD2]">
        {formatCurrency(salePrice)}
      </p>
    </div>
  );
}
