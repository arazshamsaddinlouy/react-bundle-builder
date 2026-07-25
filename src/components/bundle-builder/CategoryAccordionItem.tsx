import clsx from "clsx";

import ProductList from "./ProductList";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

interface CategoryAccordionItemProps {
  category: Category;
  products: Product[];
  step: number;
  totalSteps: number;
  isActive: boolean;
  onToggle: () => void;
}

export default function CategoryAccordionItem({
  category,
  products,
  step,
  totalSteps,
  isActive,
  onToggle,
}: CategoryAccordionItemProps) {
  return (
    <article
      className={clsx(
        "pt-[15px] transition-colors duration-300",
        isActive && "rounded-[10px] bg-[#F0EDFF]",
        !isActive && "border-b-[1px] border-b-[rgba(31,31,31,1)]",
      )}
    >
      <div className="border-b-[1px] border-b-[rgba(31,31,31,1)] px-[15px] pb-[5px]">
        <p
          className={clsx(
            "font-gilroy-medium uppercase leading-none tracking-[1.6px] text-[rgba(72,72,72,1)]",
            isActive ? "text-[12px]" : "text-[10px]",
          )}
        >
          Step {step} of {totalSteps}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        className="flex w-full items-center justify-between p-[20px_15px] text-left"
      >
        <div className="flex flex-1 items-center gap-[10px]">
          <img src={category.icon} alt="" aria-hidden="true" />

          <h3 className="font-gilroy-semibold text-[22px] font-normal leading-none tracking-[0]">
            {category.title}
          </h3>
        </div>

        <div className="flex items-center gap-[5px]">
          {isActive && (
            <span className="font-gilroy-medium text-center text-[14px] leading-[16px] text-[#4E2FD2]">
              {products.length} products
            </span>
          )}

          <img
            src="/icons/stepper-caret.svg"
            alt=""
            aria-hidden="true"
            className={clsx(
              "transition-transform duration-300 ease-in-out",
              isActive && "rotate-180",
            )}
          />
        </div>
      </button>

      {isActive && (
        <div className="px-[15px] pb-[15px]">
          <ProductList products={products} />
        </div>
      )}
    </article>
  );
}
