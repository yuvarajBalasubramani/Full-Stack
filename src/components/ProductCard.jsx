import React from "react";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card animate-fade-in flex flex-col justify-between">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-2xl mb-2"
      />
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="product-title mb-1">{product.name}</h2>
        <p className="product-desc mb-2">{product.description}</p>
        <div className="flex items-center mb-3">
          <span className="rating-stars">★</span>
          <span className="font-semibold text-gray-700 mr-2">{product.rating}</span>
          <span className="text-gray-400 text-xs">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="price">₹{product.price}</span>
          <button
            className="add-btn"
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            + Add to Cart
          </button>
        </div>
        <span className="stock mt-2">Stock: {product.stock}</span>
      </div>
    </div>
  );
}