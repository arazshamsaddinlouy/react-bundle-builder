import type { BundleSummarySection as BundleSummarySectionType } from "@/types/bundle";

import { BundleSummaryItem } from "./BundleSummaryItem";

interface BundleSummarySectionProps {
  section: BundleSummarySectionType;
}

export function BundleSummarySection({ section }: BundleSummarySectionProps) {
  return (
    <section className="p-6">
      <h3 className="mb-4 font-gilroy-medium text-[12px] leading-none tracking-[1.6px] uppercase text-[#484848]">
        {section.categoryTitle}
      </h3>

      <div className="space-y-4">
        {section.items.map((item) => (
          <BundleSummaryItem key={item.itemKey} item={item} />
        ))}
      </div>
    </section>
  );
}
