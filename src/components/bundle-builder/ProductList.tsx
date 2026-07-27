import clsx from "clsx";

import type { Product } from "@/types/product";

import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <p className="px-[15px] py-[20px] text-[14px]">No products available.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-[15px] min-[768px]:grid-cols-3 min-[990px]:grid-cols-4 min-[1024px]:grid-cols-5 min-[1228px]:grid-cols-2">
      {products.map((product, index) => {
        const isLastSingleItem =
          products.length % 2 !== 0 && index === products.length - 1;

        return (
          <div
            key={product.id}
            className={clsx(
              "h-full",
              isLastSingleItem &&
                "min-[1228px]:col-span-2 min-[1228px]:mx-auto min-[1228px]:w-[calc(50%-7.5px)]",
            )}
          >
            <ProductCard product={product} />
          </div>
        );
      })}
    </div>
  );
}
