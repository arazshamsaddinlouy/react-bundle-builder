import clsx from "clsx";
import { formatCurrency } from "@/utils/formatCurrency";

interface BundlePricingProps {
  originalPrice: number;
  finalPrice: number;
  monthlyPrice: number;
  installmentMonths: number;
  hasDiscount: boolean;
  variant: "desktop" | "tablet";
}

export default function BundlePricing({
  originalPrice,
  finalPrice,
  monthlyPrice,
  installmentMonths,
  hasDiscount,
  variant,
}: BundlePricingProps) {
  const isTablet = variant === "tablet";

  return (
    <div
      className={clsx(
        "shrink-0 text-right",
        isTablet
          ? "-mt-[20px] mb-[20px] hidden items-end justify-between min-[768px]:flex min-[1228px]:hidden"
          : "flex flex-col items-end min-[768px]:hidden min-[1228px]:flex",
      )}
    >
      {installmentMonths > 0 && (
        <div className="flex h-[18px] items-center justify-center rounded-[3px] bg-[#4E2FD2] px-[8px]">
          <span className="font-gilroy-medium text-[12px] leading-[12px] tracking-[-0.05em] text-white">
            as low as {formatCurrency(monthlyPrice)}/mo
          </span>
        </div>
      )}

      <div className="flex items-center gap-[10px] pt-[8px]">
        {hasDiscount && (
          <p className="font-gilroy-medium text-[18px] leading-[20px] tracking-[0.0025em] text-[#6F7882] line-through">
            {formatCurrency(originalPrice)}
          </p>
        )}

        <p className="font-gilroy-bold text-[24px] leading-[32px] tracking-[-0.0013em] text-[#4E2FD2]">
          {formatCurrency(finalPrice)}
        </p>
      </div>
    </div>
  );
}
