import clsx from "clsx";

import ProductList from "@/components/bundle-builder/ProductList/ProductList";

import { useBundleStore } from "@/store/useBundleStore";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

interface CategoryAccordionItemProps {
  category: Category;
  products: Product[];
  step: number;
  totalSteps: number;
  isActive: boolean;
  nextStepTitle?: string;
  onToggle: () => void;
  onNext: () => void;
}

export default function CategoryAccordionItem({
  category,
  products,
  step,
  totalSteps,
  isActive,
  nextStepTitle,
  onToggle,
  onNext,
}: CategoryAccordionItemProps) {
  const selectedVariants = useBundleStore((state) => state.selectedVariants);

  const isLastStep = step === totalSteps;

  const selectedCount = products.reduce((count, product) => {
    const productSelection = selectedVariants[product.id];

    const isSelected = Object.values(productSelection?.quantities ?? {}).some(
      (quantity) => (quantity ?? 0) > 0,
    );

    return isSelected ? count + 1 : count;
  }, 0);

  const contentId = `category-content-${category.id}`;
  const triggerId = `category-trigger-${category.id}`;

  return (
    <article
      className={clsx(
        "pt-[15px] transition-colors duration-300",
        isActive
          ? "rounded-[10px] bg-[#F0EDFF]"
          : "border-b border-b-[#1F1F1F]",
        isActive && step > 1 && "mt-[15px]",
      )}
    >
      <div className="border-b border-b-[#1F1F1F] px-[15px] pb-[5px]">
        <p
          className={clsx(
            "font-gilroy-medium uppercase leading-none tracking-[1.6px] text-[#484848]",
            isActive ? "text-[12px]" : "text-[10px]",
          )}
        >
          Step {step} of {totalSteps}
        </p>
      </div>

      <button
        id={triggerId}
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        aria-controls={contentId}
        className="flex w-full items-center justify-between p-[20px_15px] text-left"
      >
        <div className="flex min-w-0 flex-1 items-center gap-[10px]">
          <img src={category.icon} alt="" aria-hidden="true" />

          <h3 className="font-gilroy-semibold text-[22px] leading-none">
            {category.title}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-[5px]">
          {isActive && (
            <span className="text-center font-gilroy-medium text-[14px] leading-[16px] text-[#4E2FD2]">
              {selectedCount} selected
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
        <div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          className="px-[15px] pb-[16px]"
        >
          <ProductList products={products} />

          {!isLastStep && (
            <div className="mt-[16px] flex justify-center">
              <button
                type="button"
                onClick={onNext}
                className="flex h-[39px] items-center justify-center gap-[10px] rounded-[7px] border border-[#4E2FD2] px-[24px] py-[5px] font-gilroy-semibold text-[#4E2FD2] transition-colors hover:bg-[#4E2FD2] hover:text-white"
              >
                Next: {nextStepTitle ?? "Continue"}
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
