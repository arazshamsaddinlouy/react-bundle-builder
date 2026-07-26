import { Toaster } from "sonner";

import BundleBuilderPage from "@/pages/BundleBuilderPage";

export default function App() {
  return (
    <>
      <BundleBuilderPage />

      <Toaster
        position="bottom-right"
        richColors
        closeButton
        duration={3000}
        expand={false}
        visibleToasts={3}
      />
    </>
  );
}
