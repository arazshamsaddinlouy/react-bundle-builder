import BundleItem from "./BundleItem";

interface BundleSectionProps {
  section: {
    categoryId: string;
    categoryTitle: string;
    items: Array<{
      itemKey: string;
      productId: string;
      variantId: string;
      name: string;
      image: string;
      quantity: number;
      originalPrice: number;
      salePrice: number;
    }>;
  };
  onIncrement: (productId: string, variantId: string) => void;
  onDecrement: (productId: string, variantId: string) => void;
}

export default function BundleSection({
  section,
  onIncrement,
  onDecrement,
}: BundleSectionProps) {
  return (
    <section>
      <h3 className="mt-[10px] border-t border-[#CED6DE] py-[15px] font-gilroy-medium text-[12px] leading-[12px] tracking-[0.133em] text-[#484848] uppercase">
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
