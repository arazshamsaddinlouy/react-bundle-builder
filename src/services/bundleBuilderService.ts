import { API_ENDPOINTS } from "../constants/api";

import type { BundleBuilderData } from "@/types/builder";

export async function getBundleBuilderData(): Promise<BundleBuilderData> {
  const response = await fetch(API_ENDPOINTS.BUNDLE_BUILDER);

  if (!response.ok) {
    throw new Error(`Failed to fetch bundle builder data: ${response.status}`);
  }

  return response.json() as Promise<BundleBuilderData>;
}
