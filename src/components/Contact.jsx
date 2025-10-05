import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageCircle, Headphones, ShoppingBag, Users, Star, Globe, Shield, Zap } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    priority: 'medium',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setIsLoading(false);
    setFormData({ name: '', email: '', phone: '', subject: '', priority: 'medium', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-neutral-50 via-white to-brand-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-pink-500/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <span className="inline-block text-6xl sm:text-7xl lg:text-8xl mb-4 animate-bounce">💬</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-pink-100">
              Let's Connect!
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
              🌟 We're here to help you with anything you need! Whether it's a question, feedback, or just saying hello - 
              we'd love to hear from you and will respond faster than you can say "EliteStore"! ⚡
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Zap size={16} className="text-yellow-300" />
                <span>Lightning Fast Response</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield size={16} className="text-green-300" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star size={16} className="text-yellow-300" />
                <span>5-Star Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Stats */}
      <div className="bg-white shadow-lg -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Customer Support</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-bold text-green-600 mb-2">&lt;2hrs</div>
              <div className="text-sm text-gray-600">Average Response</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl font-bold text-pink-600 mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Methods Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">🚀 Multiple Ways to Reach Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your preferred way to connect with our amazing support team!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Live Chat */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">💬 Live Chat</h3>
                <p className="text-blue-600 text-sm mb-4">Instant help, real-time solutions</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  Start Chat
                </button>
              </div>
            </div>

            {/* Phone Support */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">📞 Call Us</h3>
                <p className="text-green-600 text-sm mb-2">+91 98765 43210</p>
                <p className="text-green-600 text-xs mb-4">24/7 Available</p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  Call Now
                </button>
              </div>
            </div>

            {/* Email Support */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">📧 Email Us</h3>
                <p className="text-purple-600 text-sm mb-2">support@elitestore.com</p>
                <p className="text-purple-600 text-xs mb-4">Response in &lt;2 hours</p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  Send Email
                </button>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-pink-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-pink-800 mb-2">💬 WhatsApp</h3>
                <p className="text-pink-600 text-sm mb-2">+91 98765 43210</p>
                <p className="text-pink-600 text-xs mb-4">Quick & Personal</p>
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Enhanced Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span>📍</span> Contact Information
            </h2>
            
            <div className="space-y-6">
              {/* Headquarters */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg border border-indigo-200">
                <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                  <MapPin size={20} />
                  🏢 Headquarters
                </h3>
                <div className="space-y-3">
                  <div className="text-indigo-700">
                    <p className="font-semibold">EliteStore Global HQ</p>
                    <p>123 Innovation Drive, Tech Park Phase 2</p>
                    <p>Chennai, Tamil Nadu 600019, India</p>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Globe size={16} />
                    <span className="text-sm">Serving customers worldwide</span>
                  </div>
                </div>
              </div>

              {/* Customer Support */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl shadow-lg border border-emerald-200">
                <h3 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                  <Headphones size={20} />
                  🎧 Customer Support
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-emerald-600" />
                    <span className="text-emerald-700">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-emerald-600" />
                    <span className="text-emerald-700">support@elitestore.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-emerald-600" />
                    <span className="text-emerald-700">24/7 Support Available</span>
                  </div>
                </div>
              </div>

              {/* Business Departments */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl shadow-lg border border-amber-200">
                <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center gap-2">
                  <Users size={20} />
                  🏢 Departments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={14} className="text-amber-600" />
                      <span className="text-sm text-amber-700 font-medium">Sales: sales@elitestore.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Headphones size={14} className="text-amber-600" />
                      <span className="text-sm text-amber-700 font-medium">Support: help@elitestore.com</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-amber-600" />
                      <span className="text-sm text-amber-700 font-medium">HR: careers@elitestore.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-amber-600" />
                      <span className="text-sm text-amber-700 font-medium">Press: media@elitestore.com</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-2xl shadow-lg border border-rose-200">
                <h3 className="text-xl font-semibold text-rose-800 mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  ⏰ Business Hours
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-rose-700">
                    <div>
                      <p className="font-medium">Monday - Friday</p>
                      <p className="text-sm">9:00 AM - 8:00 PM</p>
                    </div>
                    <div>
                      <p className="font-medium">Saturday</p>
                      <p className="text-sm">10:00 AM - 6:00 PM</p>
                    </div>
                    <div>
                      <p className="font-medium">Sunday</p>
                      <p className="text-sm">12:00 PM - 4:00 PM</p>
                    </div>
                    <div>
                      <p className="font-medium">Holidays</p>
                      <p className="text-sm">Limited Hours</p>
                    </div>
                  </div>
                  <div className="bg-rose-200 p-3 rounded-lg">
                    <p className="text-sm text-rose-800 font-medium">
                      🌟 Online support & chat available 24/7!
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-6 rounded-2xl shadow-lg border border-violet-200">
                <h3 className="text-xl font-semibold text-violet-800 mb-4">🌐 Connect With Us</h3>
                <div className="flex flex-wrap gap-3">
                  <a href="#" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <span className="font-semibold">📘</span>
                    <span>Facebook</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
                    <span className="font-semibold">🐦</span>
                    <span>Twitter</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <span className="font-semibold">📷</span>
                    <span>Instagram</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors">
                    <span className="font-semibold">💼</span>
                    <span>LinkedIn</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <span className="font-semibold">📺</span>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span>✉️</span> Send us a Message
            </h2>
            
            {isSubmitted ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl p-8 text-center shadow-lg">
                <div className="animate-bounce mb-4">
                  <CheckCircle size={64} className="text-green-600 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">🎉 Message Sent Successfully!</h3>
                <p className="text-green-700 mb-4 text-lg">
                  Thank you for reaching out to us! We've received your message and our team will get back to you within 2 hours.
                </p>
                <div className="bg-green-200 p-4 rounded-lg">
                  <p className="text-green-800 font-semibold">
                    📧 Confirmation sent to: {formData.email || 'your email'}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-200">
                <div className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span>👤</span> Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white hover:border-blue-300"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span>📧</span> Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white hover:border-blue-300"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span>📱</span> Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white hover:border-blue-300"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  {/* Subject and Priority Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span>📝</span> Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white hover:border-blue-300"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">🤔 General Inquiry</option>
                        <option value="support">🛠️ Technical Support</option>
                        <option value="sales">💰 Sales Question</option>
                        <option value="returns">📦 Returns & Refunds</option>
                        <option value="partnership">🤝 Business Partnership</option>
                        <option value="feedback">💭 Feedback & Suggestions</option>
                        <option value="complaint">⚠️ Complaint</option>
                        <option value="other">🔧 Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="priority" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span>⚡</span> Priority Level
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white hover:border-blue-300"
                      >
                        <option value="low">🟢 Low - General inquiry</option>
                        <option value="medium">🟡 Medium - Standard request</option>
                        <option value="high">🟠 High - Urgent matter</option>
                        <option value="critical">🔴 Critical - Emergency</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span>💬</span> Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 resize-none bg-white hover:border-blue-300"
                      placeholder="Tell us how we can help you... Be as detailed as possible so we can provide the best assistance! 😊"
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {formData.message.length}/1000 characters
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white transform hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={24} />
                        <span>🚀 Send Message</span>
                      </>
                    )}
                  </button>

                  {/* Form Footer */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-800 text-sm">
                      <Shield size={16} />
                      <span className="font-semibold">Your privacy is protected.</span>
                    </div>
                    <p className="text-blue-700 text-sm mt-1">
                      We'll never share your information and will respond within 2 hours during business hours.
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Enhanced FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">🤔 Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Got questions? We've got answers! Here are the most common questions our customers ask.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Order & Shipping */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">📦</span>
                </div>
                <h3 className="text-lg font-bold text-blue-800 mb-3">How can I track my order?</h3>
              </div>
              <p className="text-blue-700 text-sm leading-relaxed">
                Easy! Log into your account and visit "My Orders" for real-time tracking. You'll also receive SMS and email updates at every step - from order confirmation to delivery! 📱
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🔄</span>
                </div>
                <h3 className="text-lg font-bold text-green-800 mb-3">What's your return policy?</h3>
              </div>
              <p className="text-green-700 text-sm leading-relaxed">
                We offer a hassle-free 30-day return policy! Items must be unused and in original packaging. Free return pickup available for orders above ₹1,000. 🚚
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🌍</span>
                </div>
                <h3 className="text-lg font-bold text-purple-800 mb-3">Do you ship internationally?</h3>
              </div>
              <p className="text-purple-700 text-sm leading-relaxed">
                Currently shipping across India with same-day delivery in major cities! International shipping coming soon to 50+ countries. Stay tuned! ✈️
              </p>
            </div>

            {/* Support & Service */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-200">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🎧</span>
                </div>
                <h3 className="text-lg font-bold text-pink-800 mb-3">How to contact support?</h3>
              </div>
              <p className="text-pink-700 text-sm leading-relaxed">
                24/7 support via live chat, phone, email, or WhatsApp! Average response time: under 2 hours. Our team speaks Hindi, English, and Tamil! 💬
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-200">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">💳</span>
                </div>
                <h3 className="text-lg font-bold text-amber-800 mb-3">What payment methods do you accept?</h3>
              </div>
              <p className="text-amber-700 text-sm leading-relaxed">
                All major cards, UPI, net banking, wallets, EMI options, and cash on delivery! Plus, get 2% cashback on UPI payments and special discounts! 💰
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-200">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🛡️</span>
                </div>
                <h3 className="text-lg font-bold text-indigo-800 mb-3">Is my data secure?</h3>
              </div>
              <p className="text-indigo-700 text-sm leading-relaxed">
                Absolutely! We use bank-grade SSL encryption, secure payment gateways, and never store your card details. Your privacy is our top priority! 🔒
              </p>
            </div>

            {/* Product & Quality */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-200">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">⭐</span>
                </div>
                <h3 className="text-lg font-bold text-emerald-800 mb-3">Are products authentic?</h3>
              </div>
              <p className="text-emerald-700 text-sm leading-relaxed">
                100% authentic products with manufacturer warranty! We source directly from brands and authorized distributors. Fake product? Full refund guaranteed! ✅
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-200">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🚚</span>
                </div>
                <h3 className="text-lg font-bold text-rose-800 mb-3">How fast is delivery?</h3>
              </div>
              <p className="text-rose-700 text-sm leading-relaxed">
                Same-day delivery in metro cities, 1-2 days for other locations! Express delivery available for urgent orders. Free shipping on orders above ₹500! ⚡
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-teal-200">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🎁</span>
                </div>
                <h3 className="text-lg font-bold text-teal-800 mb-3">Do you offer gift wrapping?</h3>
              </div>
              <p className="text-teal-700 text-sm leading-relaxed">
                Yes! Beautiful gift wrapping available for ₹99. Includes premium box, ribbon, and personalized message card. Perfect for special occasions! 🎀
              </p>
            </div>
          </div>

          {/* Still Have Questions Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">🤷‍♀️ Still Have Questions?</h3>
            <p className="text-blue-100 mb-6 text-lg">
              Can't find what you're looking for? Our friendly support team is here to help!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
                <MessageCircle size={20} />
                Start Live Chat
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2">
                <Phone size={20} />
                Call Us Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 