import React, { useState } from 'react';
import { X, CreditCard, Truck, Shield, CheckCircle, ArrowLeft, MapPin, Phone, Mail, Calendar, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { orderAPI } from '../services/api.js';

const Checkout = ({ isOpen, onClose, onBack }) => {
  const { state, dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: state.currentUser?.name || '',
    email: state.currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: '',
    walletType: 'paytm'
  });

  const getTotalPrice = () => {
    return state.cart.reduce((total, item) => {
      const product = state.products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getShippingCost = () => {
    const total = getTotalPrice();
    return total >= 500 ? 0 : 50; // Free shipping above ₹500
  };

  const getTaxAmount = () => {
    return Math.round(getTotalPrice() * 0.18); // 18% GST
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost() + getTaxAmount();
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [field]: value }));
    } else if (section === 'payment') {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateStep = (step) => {
    if (step === 1) {
      const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
      return required.every(field => shippingInfo[field].trim() !== '');
    } else if (step === 2) {
      if (paymentInfo.method === 'card') {
        return paymentInfo.cardNumber && paymentInfo.expiryDate && paymentInfo.cvv && paymentInfo.cardName;
      } else if (paymentInfo.method === 'upi') {
        return paymentInfo.upiId.trim() !== '';
      }
      return true;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(2)) {
      alert('Please fill all payment details');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: state.cart.map(item => {
          const product = state.products.find(p => p.id === item.productId);
          return {
            product: item.productId, // Backend expects 'product' field with ObjectId
            quantity: item.quantity,
            price: product ? product.price : 0
          };
        }),
        total: getFinalTotal(),
        subtotal: getTotalPrice(),
        shipping: getShippingCost(),
        tax: getTaxAmount(),
        shippingAddress: shippingInfo,
        paymentInfo: {
          method: paymentInfo.method,
          ...(paymentInfo.method === 'card' && {
            cardLast4: paymentInfo.cardNumber.slice(-4)
          }),
          ...(paymentInfo.method === 'upi' && {
            upiId: paymentInfo.upiId
          })
        }
      };

      const data = await orderAPI.create(orderData);

      const newOrder = {
        id: data.order._id,
        userId: state.currentUser?.id || 'guest',
        userName: shippingInfo.fullName,
        items: state.cart.map(item => {
          const product = state.products.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            productName: product ? product.name : 'Unknown Product',
            quantity: item.quantity,
            price: product ? product.price : 0,
            image: product ? product.image : ''
          };
        }),
        shippingInfo,
        paymentInfo: orderData.paymentInfo,
        subtotal: getTotalPrice(),
        shipping: getShippingCost(),
        tax: getTaxAmount(),
        total: getFinalTotal(),
        status: data.order.status || 'confirmed',
        paymentStatus: data.order.paymentStatus || 'paid',
        date: data.order.createdAt || new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        cancellationInfo: {
          canCancel: true,
          cancelDeadline: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour from now
        },
        deliveryTracking: {
          currentLocation: { lat: 28.6139, lng: 77.2090 }, // Mock delivery location (Delhi)
          deliveryPersonName: 'Rajesh Kumar',
          deliveryPersonPhone: '+91 98765 43210'
        },
        shippingAddress: {
          ...shippingInfo,
          coordinates: { lat: 28.7041, lng: 77.1025 } // Mock destination (Delhi NCR)
        },
        statusHistory: [
          {
            status: 'confirmed',
            timestamp: new Date().toISOString(),
            note: 'Your order has been confirmed and is being prepared'
          }
        ]
      };

      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      dispatch({ type: 'CLEAR_CART' });

      setOrderDetails(newOrder);
      setOrderPlaced(true);
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (!isOpen) return null;

  if (orderPlaced && orderDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-green-600 mb-2">🎉 Order Placed Successfully!</h2>
              <p className="text-gray-600">Thank you for shopping with EliteStore</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-bold text-lg">{orderDetails.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-bold text-lg text-green-600">₹{orderDetails.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-bold text-green-600">✅ Paid</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-bold">{new Date(orderDetails.estimatedDelivery).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="text-left mb-6">
              <h3 className="font-bold text-lg mb-3">📦 Order Items</h3>
              <div className="space-y-3">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      📱
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <p className="font-bold">₹{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-left mb-6">
              <h3 className="font-bold text-lg mb-3">🚚 Shipping Address</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold">{orderDetails.shippingInfo.fullName}</p>
                <p>{orderDetails.shippingInfo.address}</p>
                <p>{orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state} - {orderDetails.shippingInfo.pincode}</p>
                <p>📞 {orderDetails.shippingInfo.phone}</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 text-white py-3 rounded-xl font-bold hover:from-brand-primary-700 hover:to-brand-primary-800 transition-all duration-300"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 border-2 border-brand-primary-600 text-brand-primary-600 py-3 rounded-xl font-bold hover:bg-brand-primary-50 transition-all duration-300"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex h-full">
          {/* Left Panel - Order Summary */}
          <div className="w-1/3 bg-gradient-to-br from-brand-primary-50 to-brand-secondary-50 p-6 border-r">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-brand-primary-800">📋 Order Summary</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {state.cart.map(item => {
                const product = state.products.find(p => p.id === item.productId);
                return (
                  <div key={item.productId} className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      📱
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{product?.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">₹{product ? (product.price * item.quantity).toFixed(2) : '0.00'}</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className={getShippingCost() === 0 ? 'text-green-600 font-semibold' : ''}>
                  {getShippingCost() === 0 ? 'FREE' : `₹${getShippingCost().toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (GST 18%):</span>
                <span>₹{getTaxAmount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-brand-primary-600">₹{getFinalTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Checkout Form */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-brand-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-brand-primary-600 text-white' : 'bg-gray-200'}`}>
                    {currentStep > 1 ? <CheckCircle size={16} /> : '1'}
                  </div>
                  <span className="font-semibold">Shipping</span>
                </div>
                <div className={`w-12 h-1 ${currentStep >= 2 ? 'bg-brand-primary-600' : 'bg-gray-200'} rounded`}></div>
                <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-brand-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-brand-primary-600 text-white' : 'bg-gray-200'}`}>
                    {currentStep > 2 ? <CheckCircle size={16} /> : '2'}
                  </div>
                  <span className="font-semibold">Payment</span>
                </div>
              </div>
            </div>

            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Truck className="text-brand-primary-600" size={24} />
                  <h2 className="text-2xl font-bold text-brand-primary-800">🚚 Shipping Information</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => handleInputChange('shipping', 'fullName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                  <textarea
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      value={shippingInfo.state}
                      onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                    <input
                      type="text"
                      value={shippingInfo.pincode}
                      onChange={(e) => handleInputChange('shipping', 'pincode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                      placeholder="Pincode"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    onClick={onBack}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                  >
                    <ArrowLeft size={20} />
                    <span>Back to Cart</span>
                  </button>
                  <button
                    onClick={() => {
                      if (validateStep(1)) {
                        setCurrentStep(2);
                      } else {
                        alert('Please fill all required fields');
                      }
                    }}
                    className="bg-gradient-to-r from-brand-primary-600 to-brand-primary-700 text-white px-8 py-3 rounded-xl font-bold hover:from-brand-primary-700 hover:to-brand-primary-800 transition-all duration-300"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="text-brand-primary-600" size={24} />
                  <h2 className="text-2xl font-bold text-brand-primary-800">💳 Payment Information</h2>
                </div>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={() => handleInputChange('payment', 'method', 'card')}
                    className={`p-4 border-2 rounded-xl text-center transition-all duration-300 ${
                      paymentInfo.method === 'card' 
                        ? 'border-brand-primary-600 bg-brand-primary-50 text-brand-primary-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard size={24} className="mx-auto mb-2" />
                    <p className="font-semibold">Credit/Debit Card</p>
                  </button>
                  <button
                    onClick={() => handleInputChange('payment', 'method', 'upi')}
                    className={`p-4 border-2 rounded-xl text-center transition-all duration-300 ${
                      paymentInfo.method === 'upi' 
                        ? 'border-brand-primary-600 bg-brand-primary-50 text-brand-primary-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Phone size={24} className="mx-auto mb-2" />
                    <p className="font-semibold">UPI Payment</p>
                  </button>
                  <button
                    onClick={() => handleInputChange('payment', 'method', 'wallet')}
                    className={`p-4 border-2 rounded-xl text-center transition-all duration-300 ${
                      paymentInfo.method === 'wallet' 
                        ? 'border-brand-primary-600 bg-brand-primary-50 text-brand-primary-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Shield size={24} className="mx-auto mb-2" />
                    <p className="font-semibold">Digital Wallet</p>
                  </button>
                </div>

                {/* Card Payment Form */}
                {paymentInfo.method === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number *</label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handleInputChange('payment', 'cardNumber', formatCardNumber(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name *</label>
                      <input
                        type="text"
                        value={paymentInfo.cardName}
                        onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                        placeholder="Name as on card"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.substring(0, 2) + '/' + value.substring(2, 4);
                            }
                            handleInputChange('payment', 'expiryDate', value);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">CVV *</label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => handleInputChange('payment', 'cvv', e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Payment Form */}
                {paymentInfo.method === 'upi' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID *</label>
                    <input
                      type="text"
                      value={paymentInfo.upiId}
                      onChange={(e) => handleInputChange('payment', 'upiId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                      placeholder="yourname@paytm"
                    />
                  </div>
                )}

                {/* Wallet Payment Form */}
                {paymentInfo.method === 'wallet' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Wallet</label>
                    <select
                      value={paymentInfo.walletType}
                      onChange={(e) => handleInputChange('payment', 'walletType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
                    >
                      <option value="paytm">Paytm</option>
                      <option value="phonepe">PhonePe</option>
                      <option value="googlepay">Google Pay</option>
                      <option value="amazonpay">Amazon Pay</option>
                    </select>
                  </div>
                )}

                {/* Security Notice */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start space-x-3">
                  <Shield className="text-green-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-green-800">🔒 Secure Payment</p>
                    <p className="text-sm text-green-700">Your payment information is encrypted and secure. We never store your card details.</p>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                  >
                    <ArrowLeft size={20} />
                    <span>Back to Shipping</span>
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                      isProcessing
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `🛒 Place Order - ₹${getFinalTotal().toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;