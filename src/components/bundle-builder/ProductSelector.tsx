import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!activeCategoryId && categories.length > 0) {
      setActiveCategoryId(categories[0].id);
    }
  }, [activeCategoryId, categories]);

  return (
    <section className="flex-1">
      <CategoryAccordion
        categories={categories}
        products={products}
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategoryId}
      />
    </section>
  );
}
