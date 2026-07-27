import BundleItem from "@/components/bundle-summary/BundleItem/BundleItem";

import type { BundleSummarySection, BundleVariantKey } from "@/types/bundle";
import type { ProductKey } from "@/types/product";

interface BundleSectionProps {
  section: BundleSummarySection;
  onIncrement: (productId: ProductKey, variantId: BundleVariantKey) => void;
  onDecrement: (productId: ProductKey, variantId: BundleVariantKey) => void;
}

export default function BundleSection({
  section,
  onIncrement,
  onDecrement,
}: BundleSectionProps) {
  return (
    <section>
      <h3 className="mt-[10px] border-t border-[#CED6DE] py-[15px] font-gilroy-medium text-[12px] leading-[12px] tracking-[0.133em] uppercase text-[#484848]">
        {section.categoryTitle}
      </h3>

      <div className="space-y-[10px]">
        {section.items.map((item) => (
          <BundleItem
            key={item.itemKey}
            item={item}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        ))}
      </div>
    </section>
  );
}
