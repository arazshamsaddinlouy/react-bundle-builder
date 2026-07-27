import type { ProductVariant } from "./variant";

export type DependencyQuantityMode = "fixed" | "match-source";

export type ProductKey = string;

export interface ProductDependency {
  productId: string;
  type: "required";
  quantity: {
    mode: DependencyQuantityMode;
    value?: number;
  };
  locked?: boolean;
  label?: string;
}

export interface QuantityRules {
  min?: number;
  max?: number;
}

export interface Product {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;

  compareAtPrice?: number;
  image?: string;
  badge?: string;
  billingPeriod?: string;

  supportsQuantity?: boolean;
  selectionMode?: "single" | "multiple";

  isDependencyOnly?: boolean;
  quantityRules?: QuantityRules;
  dependencies?: ProductDependency[];

  variants?: ProductVariant[];
}
