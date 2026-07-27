import type { Category } from "./category";
import type { Product } from "./product";

export interface BundleSummaryShipping {
  title: string;
  price: number;
  compareAtPrice?: number;
  image: string;
}

export interface BundleSummaryFinancing {
  installmentCount: number;
  label: string;
}

export interface BundleSummaryGuarantee {
  title: string;
  image: string;
}

export interface BundleSummaryData {
  shipping: BundleSummaryShipping;
  financing: BundleSummaryFinancing;
  guarantee: BundleSummaryGuarantee;
}

export interface BundleBuilderData {
  categories: Category[];
  products: Product[];
  summary: BundleSummaryData;
}
