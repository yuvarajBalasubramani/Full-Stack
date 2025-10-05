import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard.jsx';
import { useApp } from '../context/AppContext';
import { cartAPI } from '../services/api.js';
import { Filter, SortAsc, SortDesc, Grid, List } from 'lucide-react';

const ProductGrid = () => {
  const { state, dispatch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(state.products.map(product => product.category))];
    return ['All', ...uniqueCategories.sort()];
  }, [state.products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = state.products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'reviews':
          aValue = a.reviews;
          bValue = b.reviews;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [state.products, selectedCategory, sortBy, sortOrder]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await cartAPI.addItem(product.id, 1);

      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          productId: product.id,
          quantity: 1
        }
      });

      // Show a success message (optional)
      console.log(`✅ Added ${product.name} to cart`);

      // You can also add a toast notification here if you have one
      alert(`✅ ${product.name} added to cart!`);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-brand-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-brand-primary-800 mb-6">
            🛍️ Our Premium Collection
          </h2>
          <p className="text-xl text-brand-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Discover our carefully curated collection of premium products, designed to enhance your lifestyle and meet your needs with exceptional quality and style.
          </p>
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-brand-accent-500 to-brand-secondary-500 mx-auto rounded-full"></div>
        </div>

        {/* Filter and Sort Controls */}
        <div className="mb-12 animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <span className="text-sm font-semibold text-brand-primary-700 flex items-center gap-2 mb-2 lg:mb-0">
                <Filter size={16} />
                Categories:
              </span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-brand-primary-700 border-2 border-brand-primary-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {category === 'All' ? '🌟 All Products' : `${getCategoryEmoji(category)} ${category}`}
                  {selectedCategory === category && (
                    <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                      {category === 'All' ? state.products.length : state.products.filter(p => p.category === category).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-brand-primary-700 flex items-center gap-2">
                {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                Sort by:
              </span>
              <div className="flex gap-2">
                {[
                  { key: 'name', label: '📝 Name' },
                  { key: 'price', label: '💰 Price' },
                  { key: 'rating', label: '⭐ Rating' },
                  { key: 'reviews', label: '💬 Reviews' },
                  { key: 'stock', label: '📦 Stock' }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleSortChange(option.key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      sortBy === option.key
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white text-brand-primary-700 border border-brand-primary-200 hover:border-purple-400 hover:bg-purple-50'
                    }`}
                  >
                    {option.label}
                    {sortBy === option.key && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-6 text-center">
            <p className="text-brand-neutral-600">
              Showing <span className="font-bold text-brand-primary-700">{filteredAndSortedProducts.length}</span> products
              {selectedCategory !== 'All' && (
                <span> in <span className="font-bold text-brand-primary-700">{selectedCategory}</span></span>
              )}
              {sortBy !== 'name' && (
                <span> sorted by <span className="font-bold text-brand-primary-700">{sortBy}</span> ({sortOrder === 'asc' ? 'ascending' : 'descending'})</span>
              )}
            </p>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedProducts.map((product, index) => (
            <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard product={product} onAdd={handleAddToCart} />
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-brand-primary-800 mb-4">No products found</h3>
            <p className="text-brand-neutral-600 mb-6">
              No products match your current filters. Try selecting a different category or adjusting your search.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSortBy('name');
                setSortOrder('asc');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// Helper function to get category emojis
const getCategoryEmoji = (category) => {
  const emojiMap = {
    'Electronics': '🔌',
    'Clothing': '👕',
    'Home': '🏠',
    'Sports': '🏃',
    'Food': '🍯',
    'Accessories': '👜',
    'Beauty': '💄',
    'Books': '📚'
  };
  return emojiMap[category] || '📦';
};

export default ProductGrid; 