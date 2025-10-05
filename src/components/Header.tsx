import React from 'react';
import { ShoppingCart, User, LogOut, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onAdminOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartOpen, onAuthOpen, onAdminOpen }) => {
  const { state, dispatch } = useApp();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-brand-silver-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-brand-navy-700">EliteStore</h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-brand-silver-700 hover:text-brand-navy-600 transition-colors">Home</a>
            <a href="#" className="text-brand-silver-700 hover:text-brand-navy-600 transition-colors">Products</a>
            <a href="#" className="text-brand-silver-700 hover:text-brand-navy-600 transition-colors">Categories</a>
            <a href="#" className="text-brand-silver-700 hover:text-brand-navy-600 transition-colors">About</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCartOpen}
              className="relative p-2 text-brand-silver-700 hover:text-brand-navy-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {state.cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {state.currentUser ? (
              <div className="flex items-center space-x-3">
                <img
                  src={state.currentUser.avatar}
                  alt={state.currentUser.name}
                  className="w-8 h-8 rounded-full border-2 border-brand-silver-300"
                />
                <span className="text-brand-silver-700 font-medium hidden sm:block">
                  {state.currentUser.name}
                </span>
                <button
                  onClick={onAdminOpen}
                  className="p-2 text-brand-silver-700 hover:text-brand-navy-600 transition-colors"
                  title="Admin Panel"
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-brand-silver-700 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthOpen}
                className="flex items-center space-x-2 bg-brand-navy-600 text-white px-4 py-2 rounded-lg hover:bg-brand-navy-700 transition-colors shadow-md"
              >
                <User size={20} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;