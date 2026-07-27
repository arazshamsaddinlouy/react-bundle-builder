import { useEffect, useRef } from "react";
import { toast } from "sonner";

import ProductSelector from "@/components/bundle-builder/ProductSelector/ProductSelector";
import BundleSummary from "@/components/bundle-summary/BundleSummary/BundleSummary";
import { initialBundle } from "@/constants/initialBundle";
import { useBundleBuilderData } from "@/hooks/useBundleBuilderData";
import { getSavedBundleFromStorage } from "@/services/bundleStorageService";
import { useBundleStore } from "@/store/useBundleStore";

export default function BundleBuilderPage() {
  const { data, isLoading, error } = useBundleBuilderData();

  const hasInitializedBundle = useRef(false);

  const setProducts = useBundleStore((state) => state.setProducts);
  const restoreBundle = useBundleStore((state) => state.restoreBundle);

  useEffect(() => {
    if (!data || hasInitializedBundle.current) {
      return;
    }

    hasInitializedBundle.current = true;

    setProducts(data.products);

    const savedBundle = getSavedBundleFromStorage();

    const hasSavedProducts = savedBundle
      ? Object.values(savedBundle.selectedVariants).some((selection) =>
          Object.values(selection?.quantities ?? {}).some(
            (quantity) => (quantity ?? 0) > 0,
          ),
        )
      : false;

    if (savedBundle && hasSavedProducts) {
      restoreBundle(savedBundle.selectedVariants);

      toast.success("Saved bundle restored!", {
        description: "Your previously saved products have been added back.",
      });

      return;
    }

    restoreBundle(initialBundle);
  }, [data, setProducts, restoreBundle]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Failed to load products.</div>;
  }

  return (
    <main className="min-h-screen">
      <div className="mb-[-25px] pt-[20px] text-center font-gilroy-bold text-[31.88px] leading-[110%] tracking-[-0.06px] text-[#1F1F1F] min-[768px]:hidden">
        Let’s get started!
      </div>

      <div className="mx-auto flex max-w-[1228px] flex-col gap-[29px] px-4 py-[49px] min-[1228px]:flex-row min-[1228px]:items-start">
        <div className="min-w-0 flex-1">
          <ProductSelector
            categories={data.categories}
            products={data.products}
          />
        </div>

        <div className="w-full min-[1228px]:w-[399px] min-[1228px]:shrink-0">
          <BundleSummary
            categories={data.categories}
            products={data.products}
            summary={data.summary}
          />
        </div>
      </div>
    </main>
  );
}
