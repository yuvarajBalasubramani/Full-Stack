import React, { useState } from 'react';
import { Menu, X, ShoppingBag, User, Package } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import OrderHistory from './OrderHistory.jsx';

const Navigation = ({ onCartOpen, onAuthOpen }) => {
  const { state, dispatch } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-gradient-to-r from-brand-primary-600 via-brand-primary-700 to-brand-primary-800 shadow-xl sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white hover:text-brand-accent-200 transition-colors duration-300">
              ✨ EliteStore
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive ? 'text-brand-accent-300 bg-white bg-opacity-10' : 'text-white hover:text-brand-accent-300 hover:bg-white hover:bg-opacity-10'}`}
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive ? 'text-brand-accent-300 bg-white bg-opacity-10' : 'text-white hover:text-brand-accent-300 hover:bg-white hover:bg-opacity-10'}`}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive ? 'text-brand-accent-300 bg-white bg-opacity-10' : 'text-white hover:text-brand-accent-300 hover:bg-white hover:bg-opacity-10'}`}
              >
                Contact
              </NavLink>
              {state.currentUser?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg ${isActive ? 'bg-brand-secondary-600 text-white' : 'bg-gradient-to-r from-brand-secondary-500 to-brand-secondary-600 text-white hover:from-brand-secondary-600 hover:to-brand-secondary-700 hover:shadow-xl'}`}
                >
                  Admin Panel
                </NavLink>
              )}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Order History button - only show if user is logged in */}
            {state.currentUser && (
              <button
                onClick={() => setShowOrderHistory(true)}
                className="relative p-2 text-white hover:text-brand-accent-300 transition-all duration-300 hover:bg-white hover:bg-opacity-10 rounded-lg"
                title="Order History"
              >
                <Package size={20} />
                {state.orders.filter(order => order.userId === state.currentUser.id).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-brand-secondary-500 to-brand-secondary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                    {state.orders.filter(order => order.userId === state.currentUser.id).length}
                  </span>
                )}
              </button>
            )}

            {/* Cart button */}
            <button
              onClick={onCartOpen}
              className="relative p-2 text-white hover:text-brand-accent-300 transition-all duration-300 hover:bg-white hover:bg-opacity-10 rounded-lg"
            >
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-gentle shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User/Auth button */}
            {state.currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 p-2 text-white bg-white bg-opacity-10 rounded-lg backdrop-blur-sm border border-white border-opacity-20">
                  <img
                    src={state.currentUser.avatar}
                    alt={state.currentUser.name}
                    className="w-8 h-8 rounded-full border-2 border-white border-opacity-30"
                  />
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-white">{state.currentUser.name}</div>
                    <div className="text-xs text-brand-accent-200">
                      {state.currentUser.orderCount} orders • ₹{state.currentUser.totalSpent.toFixed(2)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => dispatch({ type: 'LOGOUT' })}
                  className="px-3 py-1 text-sm bg-gradient-to-r from-brand-error-500 to-brand-error-600 text-white rounded-lg hover:from-brand-error-600 hover:to-brand-error-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthOpen}
                className="flex items-center space-x-2 p-2 text-white hover:text-brand-accent-300 transition-all duration-300 hover:bg-white hover:bg-opacity-10 rounded-lg"
              >
                <User size={20} />
                <span className="hidden sm:block text-sm font-medium">Login</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-brand-accent-300 transition-all duration-300 hover:bg-white hover:bg-opacity-10 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-brand-primary-700 to-brand-primary-800 border-t border-white border-opacity-20">
            <NavLink
              to="/"
              className={({ isActive }) => `block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${isActive ? 'text-brand-accent-300 bg-white bg-opacity-10' : 'text-white hover:text-brand-accent-300 hover:bg-white hover:bg-opacity-10'}`}
              onClick={() => setIsMobileMenuOpen(false)}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${isActive ? 'text-brand-accent-300 bg-white bg-opacity-10' : 'text-white hover:text-brand-accent-300 hover:bg-white hover:bg-opacity-10'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${isActive ? 'text-brand-accent-300 bg-white bg-opacity-10' : 'text-white hover:text-brand-accent-300 hover:bg-white hover:bg-opacity-10'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </NavLink>
            {state.currentUser?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${isActive ? 'text-brand-accent-300 bg-white bg-opacity-10' : 'text-white hover:text-brand-accent-300 hover:bg-white hover:bg-opacity-10'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Panel
              </NavLink>
            )}
          </div>
        </div>
      )}

      {/* Order History Modal */}
      <OrderHistory 
        isOpen={showOrderHistory}
        onClose={() => setShowOrderHistory(false)}
      />
    </nav>
  );
};

export default Navigation;