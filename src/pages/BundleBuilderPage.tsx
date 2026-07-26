import { useEffect, useRef } from "react";
import { toast } from "sonner";

import ProductSelector from "@/components/bundle-builder/ProductSelector";
import { BundleSummary } from "@/components/bundle-summary";
import { useProducts } from "@/hooks/use-product";
import { useBundleStore } from "@/store/useBundleStore";
import { getSavedBundleFromStorage } from "@/constants/bundleStorage";

export default function BundleBuilderPage() {
  const { data, isLoading, error } = useProducts();

  const hasRestoredBundle = useRef(false);

  const restoreBundle = useBundleStore((state) => state.restoreBundle);

  useEffect(() => {
    if (hasRestoredBundle.current) {
      return;
    }

    hasRestoredBundle.current = true;

    const savedBundle = getSavedBundleFromStorage();

    if (!savedBundle) {
      return;
    }

    const hasSavedProducts = Object.values(savedBundle.selectedVariants).some(
      (selection) =>
        Object.values(selection.quantities).some((quantity) => quantity > 0),
    );

    if (!hasSavedProducts) {
      return;
    }

    restoreBundle(savedBundle.selectedVariants);

    toast.success("Saved bundle restored!", {
      description: "Your previously saved products have been added back.",
    });
  }, [restoreBundle]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Failed to load products.</div>;
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-[1228px] flex-col gap-[29px] px-4 py-[49px] min-[1228px]:flex-row min-[1228px]:items-start">
        <div className="min-w-0 flex-1">
          <ProductSelector
            categories={data.categories}
            products={data.products}
          />
        </div>
        <div className="w-full max-w-[380px] shrink-0">
          <BundleSummary
            categories={data.categories}
            products={data.products}
          />
        </div>
      </div>
    </main>
  );
}
