import React, { useState } from 'react';
import { X, Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import OrderTracking from './OrderTracking.jsx';

const OrderHistory = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const [trackingOrder, setTrackingOrder] = useState(null);

  if (!isOpen) return null;

  const userOrders = state.orders.filter(order => 
    order.userId === state.currentUser?.id || order.userId === 'guest'
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'processing':
        return <Package className="text-blue-500" size={20} />;
      case 'shipped':
        return <Truck className="text-purple-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />;
      default:
        return <Clock className="text-yellow-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'shipped':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'delivered':
        return 'text-green-700 bg-green-100 border-green-300';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[80vw] lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 text-white flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold">📦 Order History</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto flex-1">
          {userOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
              <p className="text-gray-500">Start shopping to see your orders here!</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {userOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-brand-primary-800 break-all">Order #{order.id}</h3>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)} w-fit`}>
                        {getStatusIcon(order.status)}
                        <span className="text-xs sm:text-sm font-semibold capitalize">{order.status}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm text-gray-600">Order Date</p>
                      <p className="text-sm sm:text-base font-semibold">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">📋 Order Details</h4>
                      <div className="space-y-1 text-xs sm:text-sm">
                        <p><span className="text-gray-600">Items:</span> {order.items.length} item(s)</p>
                        <p><span className="text-gray-600">Total:</span> <span className="font-bold text-brand-primary-600">₹{order.total.toFixed(2)}</span></p>
                        <p><span className="text-gray-600">Payment:</span> <span className="text-green-600 font-semibold">✅ {order.paymentStatus || 'Paid'}</span></p>
                        {order.estimatedDelivery && (
                          <p><span className="text-gray-600">Est. Delivery:</span> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>

                    {order.shippingInfo && (
                      <div>
                        <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">🚚 Shipping Address</h4>
                        <div className="text-xs sm:text-sm text-gray-600">
                          <p className="font-semibold text-gray-800">{order.shippingInfo.fullName}</p>
                          <p className="break-words">{order.shippingInfo.address}</p>
                          <p>{order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}</p>
                          <p>📞 {order.shippingInfo.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">🛍️ Items Ordered</h4>
                    <div className="grid gap-2 sm:gap-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 sm:gap-4 bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <span className="text-xl sm:text-2xl">📱</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm sm:text-base font-semibold text-gray-800 truncate">{item.productName}</h5>
                            <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</p>
                            <p className="text-xs sm:text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm sm:text-base font-bold text-brand-primary-600">₹{(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.paymentInfo && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">💳 Payment Information</h4>
                      <div className="text-xs sm:text-sm text-gray-600">
                        <p><span className="text-gray-800">Method:</span> {order.paymentInfo.method.toUpperCase()}</p>
                        {order.paymentInfo.cardLast4 && (
                          <p><span className="text-gray-800">Card:</span> **** **** **** {order.paymentInfo.cardLast4}</p>
                        )}
                        {order.paymentInfo.upiId && (
                          <p className="break-all"><span className="text-gray-800">UPI ID:</span> {order.paymentInfo.upiId}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <button 
                        onClick={() => setTrackingOrder(order)}
                        className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-brand-primary-600 text-brand-primary-600 rounded-lg hover:bg-brand-primary-50 transition-colors duration-300 text-sm"
                      >
                        <Eye size={16} />
                        <span>Track Order</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm">
                        <Package size={16} />
                        <span>Reorder</span>
                      </button>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm text-gray-600">Need help?</p>
                      <button className="text-brand-primary-600 hover:text-brand-primary-700 font-semibold text-xs sm:text-sm">
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Tracking Modal */}
      <OrderTracking 
        isOpen={!!trackingOrder} 
        onClose={() => setTrackingOrder(null)} 
        order={trackingOrder} 
      />
    </div>
  );
};

export default OrderHistory;