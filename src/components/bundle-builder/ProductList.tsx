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
    <div className="grid grid-cols-2 items-stretch gap-[15px]">
      {products.map((product, index) => {
        const isLastSingleItem =
          products.length % 2 !== 0 && index === products.length - 1;

        return (
          <div
            key={product.id}
            className={clsx(
              "h-full",
              isLastSingleItem && "col-span-2 mx-auto w-[calc(50%-7.5px)]",
            )}
          >
            <ProductCard product={product} />
          </div>
        );
      })}
    </div>
  );
}
