import { formatCurrency } from "../../utils/formatCurrency";
import BundleOffer from "./BundleOffer";
import ShippingRow from "./ShippingRow";

interface BundleSummaryFooterProps {
  shippingPrice: number;
  installmentMonths: number;
  originalPrice: number;
  finalPrice: number;
  monthlyPrice: number;
  savings: number;
  hasDiscount: boolean;
  onCheckout: () => void;
  onSave: () => void;
}

export default function BundleSummaryFooter({
  shippingPrice,
  installmentMonths,
  originalPrice,
  finalPrice,
  monthlyPrice,
  savings,
  hasDiscount,
  onCheckout,
  onSave,
}: BundleSummaryFooterProps) {
  return (
    <footer className="-mt-[60px] max-[768px]:mt-[20px] flex-1 min-[1228px]:mt-0 min-[1228px]:border-t min-[1228px]:border-[#CED6DE]">
      <ShippingRow shippingPrice={shippingPrice} variant="desktop" />

      <BundleOffer
        originalPrice={originalPrice}
        finalPrice={finalPrice}
        monthlyPrice={monthlyPrice}
        installmentMonths={installmentMonths}
        hasDiscount={hasDiscount}
      />

      {hasDiscount && (
        <p className="text-center font-gilroy-semibold text-[12px] leading-[12px] tracking-[-0.06px] text-[#0AA288]">
          Congrats! You’re saving {formatCurrency(savings)} on your security
          bundle!
        </p>
      )}

      <button
        type="button"
        onClick={onCheckout}
        className="mt-[15px] flex h-[48px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[4px] bg-[#4E2FD2] px-[16px] font-gilroy-semibold text-[17px] leading-[22px] text-white transition-opacity hover:opacity-90"
      >
        Checkout
      </button>

      <button
        type="button"
        onClick={onSave}
        className="w-full cursor-pointer pt-[10px] pb-[15px] text-center font-gilroy-regular-italic text-[14px] leading-[16.8px] tracking-[-0.02px] text-[#484848] underline"
      >
        Save my system for later
      </button>
    </footer>
  );
}
