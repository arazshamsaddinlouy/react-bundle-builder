import type { BundleBuilderData } from "@/types/bundle-builder";
import { API } from "./config";

export async function getBundleBuilderData(): Promise<BundleBuilderData> {
  const response = await fetch(API.PRODUCTS);

  if (!response.ok) {
    throw new Error(`Failed to fetch bundle builder data: ${response.status}`);
  }

  return response.json() as Promise<BundleBuilderData>;
}
