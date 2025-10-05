import React from "react";
import ProductCard from "../../components/ProductCard";

export default function ProductGrid({
  products = [],
  onAdd,
  categories = [],
  selected,
  onSelect
}) {
  return (
    <div>
      <div className="flex gap-4 mb-6 px-8">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map(cat => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selected === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => onSelect(cat)}
            >
              {cat}
            </button>
          ))
        ) : (
          <div className="text-gray-400 text-sm">No categories available.</div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
        {Array.isArray(products) && products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            No products in cart.
          </div>
        )}
      </div>
    </div>
  );
}

// Usage example
// <ProductGrid products={products} onAdd={handleAddToCart} />