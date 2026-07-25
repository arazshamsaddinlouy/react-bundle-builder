import { useProducts } from "@/hooks/use-product";

import ProductSelector from "@/components/bundle-builder/ProductSelector";
import BundleSummary from "@/components/bundle-builder/BundleSummary";

export default function BundleBuilderPage() {
  const { data, isLoading, error } = useProducts();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Failed to load products.</div>;
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-[1228px] items-start gap-[29px] px-4 py-[49px]">
        <ProductSelector
          categories={data.categories}
          products={data.products}
        />

        <BundleSummary />
      </div>
    </main>
  );
}
