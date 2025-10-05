import React, { useState } from "react";
import ProductGrid from "./CartItems";

const initialProducts = [
  // Products will be loaded from the database
];

export default function AdminCart() {
  const [cart, setCart] = useState([]);
  const [products] = useState(initialProducts);

  // This function must be passed to ProductGrid
  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <div>
      <ProductGrid
        products={products}
        onAdd={handleAddToCart} // <-- Make sure this is a function!
        categories={["All"]}
        selected={"All"}
        onSelect={() => {}}
      />
      <div className="mt-8 p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item, idx) => (
              <li key={idx} className="mb-2">
                {item.name} - ₹{item.price}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}