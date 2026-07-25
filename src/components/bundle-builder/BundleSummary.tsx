export default function BundleSummary() {
  return (
    <aside className="sticky top-6 w-full shrink-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:max-w-[399px]">
      <h2 className="text-xl font-semibold">Bundle Summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Products</span>
          <span className="font-medium">0</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">$0.00</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Discount</span>
          <span className="font-medium text-green-600">-$0.00</span>
        </div>

        <hr className="border-gray-200" />

        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>$0.00</span>
        </div>
      </div>

      <button
        type="button"
        disabled
        className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-medium text-white opacity-50"
      >
        Add Bundle to Cart
      </button>
    </aside>
  );
}
