import type { Category, CategoryKey } from "@/types/category";
import type { Product } from "@/types/product";

import CategoryAccordionItem from "@/components/bundle-builder/CategoryAccordionItem/CategoryAccordionItem";

interface CategoryAccordionProps {
  categories: Category[];
  products: Product[];
  activeCategoryId: CategoryKey | null;
  onCategoryChange: (categoryId: CategoryKey | null) => void;
}

export default function CategoryAccordion({
  categories,
  products,
  activeCategoryId,
  onCategoryChange,
}: CategoryAccordionProps) {
  return (
    <div>
      {categories.map((category, index) => {
        const nextCategory = categories[index + 1];
        const isActive = activeCategoryId === category.id;

        const categoryProducts = products.filter(
          (product) => product.categoryId === category.id,
        );

        const handleToggle = () => {
          onCategoryChange(isActive ? null : category.id);
        };

        const handleNext = () => {
          if (nextCategory) {
            onCategoryChange(nextCategory.id);
          }
        };

        return (
          <CategoryAccordionItem
            key={category.id}
            category={category}
            products={categoryProducts}
            step={index + 1}
            totalSteps={categories.length}
            isActive={isActive}
            nextStepTitle={nextCategory?.title}
            onToggle={handleToggle}
            onNext={handleNext}
          />
        );
      })}
    </div>
  );
}
