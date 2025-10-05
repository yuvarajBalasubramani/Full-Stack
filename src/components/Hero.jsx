import React from 'react';
import { ShoppingBag, Star, Users } from 'lucide-react';

const Hero = ({ onAdd }) => {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Simple background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-40">
        <div className="text-center animate-fade-in">
          <div className="mb-6">
            <span className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide shadow-lg">
              🔥 Premium Shopping Experience
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            Welcome to{' '}
            <span className="text-blue-400">
              ✨ EliteStore
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover <span className="text-blue-400 font-semibold">premium products</span> with exceptional quality and unbeatable prices. 
            Your shopping journey starts here with <span className="text-purple-400 font-semibold">curated collections</span> and amazing deals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              🛍️ Shop Now
            </button>
            <button className="border-2 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              📖 Learn More
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="bg-green-600 p-3 rounded-lg">
                <ShoppingBag size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg text-white">🚚 Free Shipping</p>
                <p className="text-gray-300 text-sm">On orders over ₹50</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="bg-yellow-600 p-3 rounded-lg">
                <Star size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg text-white">⭐ Top Quality</p>
                <p className="text-gray-300 text-sm">Premium products</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="bg-purple-600 p-3 rounded-lg">
                <Users size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg text-white">🎧 24/7 Support</p>
                <p className="text-gray-300 text-sm">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;