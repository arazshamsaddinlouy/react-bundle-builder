import { useState } from "react";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

import CategoryAccordion from "./CategoryAccordion";

interface ProductSelectorProps {
  products: Product[];
  categories: Category[];
}

export default function ProductSelector({
  products,
  categories,
}: ProductSelectorProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const hasActiveCategory = categories.some(
    (category) => category.id === activeCategoryId,
  );

  const selectedCategoryId = hasActiveCategory
    ? activeCategoryId
    : (categories[0]?.id ?? null);

  return (
    <section className="flex-1">
      <CategoryAccordion
        categories={categories}
        products={products}
        activeCategoryId={selectedCategoryId}
        onCategoryChange={setActiveCategoryId}
      />
    </section>
  );
}
