import type { SelectedVariants } from "@/types/bundle";

export const SAVED_BUNDLE_STORAGE_KEY = "saved-security-bundle";

export interface SavedBundle {
  selectedVariants: SelectedVariants;
  totals: {
    originalPrice: number;
    salePrice: number;
    savings: number;
    itemsCount: number;
  };
  savedAt: string;
}

export const saveBundleToStorage = (bundle: SavedBundle) => {
  try {
    localStorage.setItem(SAVED_BUNDLE_STORAGE_KEY, JSON.stringify(bundle));

    return true;
  } catch (error) {
    console.error("Failed to save bundle:", error);

    return false;
  }
};

export const getSavedBundleFromStorage = (): SavedBundle | null => {
  try {
    const savedBundle = localStorage.getItem(SAVED_BUNDLE_STORAGE_KEY);

    if (!savedBundle) {
      return null;
    }

    const parsedBundle = JSON.parse(savedBundle) as SavedBundle;

    if (
      !parsedBundle ||
      typeof parsedBundle !== "object" ||
      !parsedBundle.selectedVariants
    ) {
      return null;
    }

    return parsedBundle;
  } catch (error) {
    console.error("Failed to restore bundle:", error);

    return null;
  }
};
