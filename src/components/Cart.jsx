import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import CheckoutEnhanced from './CheckoutEnhanced.jsx';

const Cart = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const [showCheckout, setShowCheckout] = useState(false);

  const getTotalPrice = () => {
    return state.cart.reduce((total, item) => {
      const product = state.products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } else {
      dispatch({ 
        type: 'UPDATE_CART_QUANTITY', 
        payload: { productId, quantity: newQuantity } 
      });
    }
  };

  const handleCheckout = () => {
    if (state.cart.length === 0) return;
    
    if (!state.currentUser) {
      alert('Please login to proceed with checkout');
      return;
    }
    
    setShowCheckout(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-900/80 to-brand-secondary-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl animate-slide-up">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-brand-neutral-200 bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 text-white">
            <div className="flex items-center space-x-3">
              <ShoppingBag size={24} />
              <h2 className="text-xl font-bold">🛒 Shopping Cart</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-300 hover:rotate-90">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {state.cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-brand-neutral-500">
                <div className="bg-gradient-to-br from-brand-neutral-100 to-brand-neutral-200 p-8 rounded-full mb-6">
                  <ShoppingBag size={64} className="text-brand-neutral-400" />
                </div>
                <h3 className="text-xl font-bold text-brand-neutral-700 mb-2">Your cart is empty</h3>
                <p className="text-brand-neutral-500">Add some amazing products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.cart.map((item) => {
                  const product = state.products.find(p => p.id === item.productId);
                  
                  // Debug logging
                  if (!product) {
                    console.warn('⚠️ Product not found for cart item:', item.productId);
                    console.log('Available product IDs:', state.products.map(p => p.id));
                    return null;
                  }

                  return (
                    <div key={item.productId} className="flex items-center space-x-4 bg-gradient-to-r from-brand-neutral-50 to-white p-4 rounded-2xl border border-brand-neutral-200 hover:shadow-lg transition-all duration-300">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-xl border-2 border-brand-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-brand-primary-800 truncate text-lg">
                          {product.name}
                        </h4>
                        <p className="text-blue-600 font-semibold">
                          ₹{product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {state.cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={!state.currentUser}
                className="w-full bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 hover:from-brand-accent-600 hover:to-brand-accent-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {state.currentUser ? '🛒 Proceed to Checkout' : '🔐 Login to Checkout'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Checkout Modal */}
      <CheckoutEnhanced 
        isOpen={showCheckout}
        onClose={() => {
          setShowCheckout(false);
          onClose();
        }}
        onBack={() => setShowCheckout(false)}
      />
    </div>
  );
};

export default Cart; 