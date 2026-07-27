import { useEffect, useRef } from "react";
import { toast } from "sonner";

import ProductSelector from "@/components/bundle-builder/ProductSelector";
import BundleSummary from "@/components/bundle-summary/BundleSummary";
import { useBundleBuilderData } from "@/hooks/useBundleBuilderData";
import { useBundleStore } from "@/store/useBundleStore";
import { getSavedBundleFromStorage } from "@/services/bundleStorageService";

export default function BundleBuilderPage() {
  const { data, isLoading, error } = useBundleBuilderData();

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
        Object.values(selection?.quantities ?? {}).some(
          (quantity) => quantity > 0,
        ),
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
      <div className="font-gilroy-bold pt-[20px] mb-[-25px] min-[768px]:hidden text-[31.88px] leading-[110%] tracking-[-0.06px] text-center text-[#1F1F1F]">
        Let’s get started!
      </div>
      <div className="mx-auto flex max-w-[1228px] flex-col gap-[29px] px-4 py-[49px] min-[1228px]:flex-row min-[1228px]:items-start">
        <div className="min-w-0 flex-1">
          <ProductSelector
            categories={data.categories}
            products={data.products}
          />
        </div>
        <div className="w-full min-[1228px]:max-w-[380px] min-[1228px]:shrink-0">
          <BundleSummary
            categories={data.categories}
            products={data.products}
          />
        </div>
      </div>
    </main>
  );
}
