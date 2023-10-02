"use client";
import ProductCreator from "@/components/ProductCreator";

export default function Products() {
  return (
    <main className="p-2">
      <div className="max-w-xs p-2 border rounded-xl">
        <p className="pb-1 mb-1 border-b opacity-80">Add a product</p>
        <ProductCreator />
      </div>
    </main>
  );
}
