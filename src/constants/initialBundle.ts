import { DEFAULT_VARIANT_ID } from "@/constants/bundle";
import type { SelectedVariants } from "@/types/bundle";

export const initialBundle: SelectedVariants = {
  "wyze-cam-v4": {
    activeVariantId: "wyze-cam-v4-white",
    quantities: {
      "wyze-cam-v4-white": 1,
    },
  },

  "wyze-cam-pan-v3": {
    activeVariantId: "wyze-cam-pan-v3-white",
    quantities: {
      "wyze-cam-pan-v3-white": 2,
    },
  },

  "wyze-sense-motion-sensor": {
    activeVariantId: DEFAULT_VARIANT_ID,
    quantities: {
      [DEFAULT_VARIANT_ID]: 2,
    },
  },

  "wyze-sense-hub": {
    activeVariantId: DEFAULT_VARIANT_ID,
    quantities: {
      [DEFAULT_VARIANT_ID]: 1,
    },
  },

  "wyze-micro-sd-card": {
    activeVariantId: "wyze-micro-sd-card-256gb",
    quantities: {
      "wyze-micro-sd-card-256gb": 2,
    },
  },

  "cam-unlimited": {
    activeVariantId: DEFAULT_VARIANT_ID,
    quantities: {
      [DEFAULT_VARIANT_ID]: 1,
    },
  },
};
