import BundlePricing from "@/components/bundle-summary/BundlePricing/BundlePricing";

interface BundleOfferProps {
  originalPrice: number;
  finalPrice: number;
  monthlyPrice: number;
  installmentMonths: number;
  hasDiscount: boolean;
}

export default function BundleOffer({
  originalPrice,
  finalPrice,
  monthlyPrice,
  installmentMonths,
  hasDiscount,
}: BundleOfferProps) {
  return (
    <>
      <div className="flex flex-1 items-end justify-between gap-0 pb-[15px] min-[768px]:items-start min-[768px]:gap-[30px] min-[1228px]:items-end min-[1228px]:gap-0">
        <div className="w-[78px] shrink-0">
          <img
            src="/images/layout/summary-badge.png"
            alt="Bundle offer"
            className="w-full object-contain"
          />
        </div>

        <div className="hidden min-[768px]:block min-[1228px]:hidden">
          <h3 className="font-gilroy-semibold text-[18px] leading-[110%] tracking-[0.6px] text-[#1F1F1F]">
            30-day hassle-free returns
          </h3>

          <p className="pt-[10px] font-gilroy-regular">
            If you're not totally in love with the product, we will refund you
            100%.
          </p>
        </div>

        <BundlePricing
          variant="desktop"
          originalPrice={originalPrice}
          finalPrice={finalPrice}
          monthlyPrice={monthlyPrice}
          installmentMonths={installmentMonths}
          hasDiscount={hasDiscount}
        />
      </div>

      <BundlePricing
        variant="tablet"
        originalPrice={originalPrice}
        finalPrice={finalPrice}
        monthlyPrice={monthlyPrice}
        installmentMonths={installmentMonths}
        hasDiscount={hasDiscount}
      />
    </>
  );
}
