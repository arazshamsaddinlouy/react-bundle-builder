import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import CategoryAccordionItem from "./CategoryAccordionItem";
interface CategoryAccordionProps {
  categories: Category[];
  products: Product[];
  activeCategoryId: string | null;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryAccordion({
  categories,
  products,
  activeCategoryId,
  onCategoryChange,
}: CategoryAccordionProps) {
  return (
    <div>
      {categories.map((category, index) => (
        <CategoryAccordionItem
          key={category.id}
          category={category}
          products={products.filter(
            (product) => product.categoryId === category.id,
          )}
          step={index + 1}
          totalSteps={categories.length}
          isActive={activeCategoryId === category.id}
          onToggle={() => onCategoryChange(category.id)}
        />
      ))}
    </div>
  );
}
