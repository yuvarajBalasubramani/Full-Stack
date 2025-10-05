import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Package, Truck, CheckCircle, Clock, Phone, User, AlertCircle } from 'lucide-react';
import { loadGoogleMapsScript, initializeMap, addCustomMarker, drawRoute, calculateDistance } from '../services/googleMaps.js';

const OrderTracking = ({ isOpen, onClose, order }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [distance, setDistance] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (isOpen && order && order.deliveryTracking) {
      initializeGoogleMap();
    }
  }, [isOpen, order]);

  const initializeGoogleMap = async () => {
    try {
      await loadGoogleMapsScript();
      
      // Default locations (you can replace with actual coordinates)
      const deliveryLocation = order.deliveryTracking.currentLocation || { lat: 28.6139, lng: 77.2090 };
      const destinationLocation = order.shippingAddress.coordinates || { lat: 28.7041, lng: 77.1025 };

      // Initialize map
      const map = initializeMap('order-tracking-map', {
        center: deliveryLocation,
        zoom: 13
      });

      mapInstanceRef.current = map;

      // Add delivery person marker
      addCustomMarker(
        map,
        deliveryLocation,
        'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        'Delivery Person'
      );

      // Add destination marker
      addCustomMarker(
        map,
        destinationLocation,
        'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        'Delivery Address'
      );

      // Draw route
      try {
        await drawRoute(map, deliveryLocation, destinationLocation);
        const dist = calculateDistance(deliveryLocation, destinationLocation);
        setDistance(dist);
      } catch (error) {
        console.error('Route drawing error:', error);
      }

      setMapLoaded(true);
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Unable to load map. Please check your internet connection.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'confirmed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'preparing':
        return <Package className="text-blue-500" size={20} />;
      case 'shipped':
        return <Truck className="text-purple-500" size={20} />;
      case 'out_for_delivery':
        return <Truck className="text-orange-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'cancelled':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'delivered':
        return 'bg-green-200 text-green-900 border-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Order Pending',
      confirmed: 'Order Confirmed',
      preparing: 'Preparing Your Order',
      shipped: 'Order Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const canCancelOrder = () => {
    if (!order || !order.cancellationInfo) return false;
    if (order.status === 'cancelled' || order.status === 'delivered') return false;
    
    const cancelDeadline = new Date(order.cancellationInfo.cancelDeadline);
    return new Date() < cancelDeadline;
  };

  const getTimeRemaining = () => {
    if (!order || !order.cancellationInfo) return null;
    
    const cancelDeadline = new Date(order.cancellationInfo.cancelDeadline);
    const now = new Date();
    const diff = cancelDeadline - now;
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex h-full max-h-[95vh]">
          {/* Left Panel - Map */}
          <div className="w-1/2 bg-gray-100 relative">
            <div className="absolute top-4 left-4 right-4 z-10 bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-800">📍 Live Tracking</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="font-semibold text-sm">{getStatusText(order.status)}</span>
              </div>
              {distance && (
                <div className="mt-2 text-sm text-gray-600">
                  <MapPin size={14} className="inline mr-1" />
                  Distance: <span className="font-semibold">{distance} km</span>
                </div>
              )}
            </div>

            <div id="order-tracking-map" ref={mapRef} className="w-full h-full">
              {!mapLoaded && !mapError && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
              {mapError && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-semibold mb-2">Map Loading Error</p>
                    <p className="text-gray-600 text-sm">{mapError}</p>
                  </div>
                </div>
              )}
            </div>

            {order.deliveryTracking?.deliveryPersonName && (
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">🚚 Delivery Partner</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand-primary-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-brand-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{order.deliveryTracking.deliveryPersonName}</p>
                      {order.deliveryTracking.deliveryPersonPhone && (
                        <p className="text-xs text-gray-600 flex items-center">
                          <Phone size={12} className="mr-1" />
                          {order.deliveryTracking.deliveryPersonPhone}
                        </p>
                      )}
                    </div>
                  </div>
                  {order.deliveryTracking.deliveryPersonPhone && (
                    <a
                      href={`tel:${order.deliveryTracking.deliveryPersonPhone}`}
                      className="bg-brand-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-primary-700 transition-colors"
                    >
                      Call
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Order Details */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Order #{order.id}</h2>
              <p className="text-sm text-gray-600">Placed on {new Date(order.date || order.createdAt).toLocaleString()}</p>
            </div>

            {/* Cancellation Info */}
            {canCancelOrder() && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="text-amber-600 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-800">⏰ Cancellation Available</p>
                    <p className="text-sm text-amber-700">You can cancel this order within: <span className="font-bold">{getTimeRemaining()}</span></p>
                    <button className="mt-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors">
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Order Status Timeline */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4">📦 Order Timeline</h3>
              <div className="space-y-4">
                {order.statusHistory && order.statusHistory.length > 0 ? (
                  order.statusHistory.map((history, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="mt-1">{getStatusIcon(history.status)}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{getStatusText(history.status)}</p>
                        <p className="text-xs text-gray-600">{new Date(history.timestamp).toLocaleString()}</p>
                        {history.note && <p className="text-xs text-gray-500 mt-1">{history.note}</p>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">{getStatusIcon(order.status)}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{getStatusText(order.status)}</p>
                      <p className="text-xs text-gray-600">{new Date(order.date || order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">🛍️ Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-xl">📱</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.productName}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <p className="font-bold text-sm">₹{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">🚚 Delivery Address</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold">{order.shippingInfo.fullName}</p>
                <p className="text-sm text-gray-600">{order.shippingInfo.address}</p>
                <p className="text-sm text-gray-600">
                  {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <Phone size={14} className="inline mr-1" />
                  {order.shippingInfo.phone}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">💳 Payment Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <span className="font-semibold uppercase">{order.paymentInfo.method}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Payment Status:</span>
                  <span className={`font-semibold ${order.paymentInfo.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                    {order.paymentInfo.status === 'completed' ? '✅ Paid' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg text-brand-primary-600">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            {order.deliveryTracking?.estimatedDelivery && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Estimated Delivery</p>
                    <p className="text-sm text-blue-700">
                      {new Date(order.deliveryTracking.estimatedDelivery).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;