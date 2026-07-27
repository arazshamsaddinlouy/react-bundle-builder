import clsx from "clsx";

import { formatCurrency } from "@/utils/formatCurrency";

interface ShippingRowProps {
  shippingPrice: number;
  variant?: "mobile" | "desktop";
}

export default function ShippingRow({
  shippingPrice,
  variant = "desktop",
}: ShippingRowProps) {
  return (
    <div
      className={clsx(
        "items-center justify-between",
        variant === "mobile"
          ? "-mb-[10px] mt-[10px] flex border-t border-[#CED6DE] pt-[10px] min-[1228px]:hidden"
          : "hidden py-[10px] min-[1228px]:flex",
      )}
    >
      <div className="flex size-[41px] items-center justify-center rounded-[5px] bg-white">
        <img
          src="/icons/shipping-delivery.svg"
          alt=""
          aria-hidden="true"
          className="size-[26px] object-contain"
        />
      </div>

      <div className="w-[58px] shrink-0 text-right">
        {shippingPrice > 0 && (
          <p className="font-gilroy-medium text-[14px] leading-[16px] tracking-[0.005em] text-[#6F7882] line-through">
            {formatCurrency(shippingPrice)}
          </p>
        )}

        <p className="font-gilroy-semibold text-[14px] leading-[16px] tracking-[0.005em] text-[#4E2FD2]">
          {shippingPrice > 0 ? "FREE" : formatCurrency(0)}
        </p>
      </div>
    </div>
  );
}
