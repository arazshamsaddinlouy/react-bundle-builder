import { useQuery } from "@tanstack/react-query";

import { getBundleBuilderData } from "@/services/bundleBuilderService";

export function useBundleBuilderData() {
  return useQuery({
    queryKey: ["bundle-builder-data"],
    queryFn: getBundleBuilderData,
  });
}
