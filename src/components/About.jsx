import React from 'react';
import { Users, Award, Shield, Heart, ShoppingBag, Star, Target, Eye } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-neutral-50 via-white to-brand-primary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-primary-800 via-brand-secondary-700 to-brand-accent-600 text-white bg-hero-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8">
              ✨ About EliteStore
            </h1>
            <p className="text-xl sm:text-2xl text-brand-primary-100 max-w-4xl mx-auto leading-relaxed">
              Your destination for curated premium products and a seamless shopping experience—every time.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="mb-20 animate-slide-up">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-primary-800 mb-6">📖 Our Story</h2>
            <div className="w-32 h-2 bg-gradient-to-r from-brand-accent-500 to-brand-secondary-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Building Excellence Since 2020
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                EliteStore was born from a simple vision: to create an online marketplace that combines 
                the convenience of e-commerce with the quality assurance of premium retail. What started 
                as a small startup has grown into a trusted platform serving thousands of satisfied customers.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our journey has been driven by customer feedback, continuous innovation, and an unwavering 
                commitment to excellence. Every product, every feature, and every interaction is designed 
                with our customers in mind.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl">
              <div className="text-center">
                <ShoppingBag size={64} className="text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">10,000+</h4>
                <p className="text-gray-600">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mission & Vision</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-center mb-6">
                <Target size={48} className="text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Our Mission</h3>
              </div>
              <p className="text-gray-600 text-center leading-relaxed">
                To provide our customers with access to the highest quality products, exceptional service, 
                and a seamless shopping experience that exceeds expectations at every touchpoint.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-center mb-6">
                <Eye size={48} className="text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Our Vision</h3>
              </div>
              <p className="text-gray-600 text-center leading-relaxed">
                To become the leading online marketplace for premium products, setting industry standards 
                for quality, customer service, and innovation in e-commerce.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <Award size={40} className="text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Quality</h3>
              <p className="text-gray-600 text-sm">
                We never compromise on quality, ensuring every product meets our high standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <Heart size={40} className="text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer First</h3>
              <p className="text-gray-600 text-sm">
                Our customers are at the heart of everything we do, driving every decision we make.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <Shield size={40} className="text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Trust</h3>
              <p className="text-gray-600 text-sm">
                Building lasting relationships through transparency, honesty, and reliability.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <Star size={40} className="text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Excellence</h3>
              <p className="text-gray-600 text-sm">
                Striving for excellence in every aspect of our business and customer experience.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Leadership Team</h3>
              <p className="text-gray-600">
                Experienced professionals guiding our company's strategic direction and growth.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Product Team</h3>
              <p className="text-gray-600">
                Dedicated experts curating and quality-checking every product in our catalog.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Support Team</h3>
              <p className="text-gray-600">
                Customer service champions ensuring your satisfaction at every step.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">EliteStore by the Numbers</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Products Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">1000+</div>
              <div className="text-gray-600">Brand Partners</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 