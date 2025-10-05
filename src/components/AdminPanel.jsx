import React, { useState } from 'react';
import { X, Users, ShoppingBag, Activity, TrendingUp, Eye, ShoppingCart, CreditCard, LogIn, UserCheck, Package } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const AdminPanel = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Helper functions to get dynamic data
  const getLoggedInUsers = () => {
    // For demo purposes, we'll consider users who have recent activity (within last 24 hours) as "logged in"
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return state.users.filter(user => {
      const lastActivity = state.userActivities
        .filter(activity => activity.userId === user.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      return lastActivity && new Date(lastActivity.timestamp) > twentyFourHoursAgo;
    });
  };

  const getCurrentCartItems = () => {
    // Get cart items for all users (in a real app, you'd track this per user)
    if (!state.currentUser) return [];
    
    return state.cart.map(cartItem => {
      const product = state.products.find(p => p.id === cartItem.productId);
      return {
        id: cartItem.productId,
        productName: product?.name || 'Unknown Product',
        productImage: product?.image || '',
        category: product?.category || 'Unknown',
        price: product?.price || 0,
        quantity: cartItem.quantity,
        addedAt: cartItem.addedAt,
        userName: state.currentUser.name,
        userId: state.currentUser.id
      };
    });
  };

  const getPurchasedItems = () => {
    // Get all individual items from all orders
    const purchasedItems = [];
    state.orders.forEach(order => {
      order.items.forEach(item => {
        const product = state.products.find(p => p.id === item.productId);
        purchasedItems.push({
          id: `${order.id}-${item.productId}`,
          orderId: order.id,
          productName: item.productName,
          productImage: product?.image || '',
          category: product?.category || 'Unknown',
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          customerName: order.userName,
          customerId: order.userId,
          orderDate: order.date,
          status: order.status
        });
      });
    });
    return purchasedItems.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  };

  // Check if current user is admin
  if (!state.currentUser || state.currentUser.role !== 'admin') {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'login': return <LogIn size={16} className="text-green-500" />;
      case 'add_to_cart': return <ShoppingCart size={16} className="text-blue-500" />;
      case 'purchase': return <CreditCard size={16} className="text-purple-500" />;
      case 'view_product': return <Eye size={16} className="text-gray-500" />;
      default: return <Activity size={16} className="text-gray-500" />;
    }
  };

  const totalRevenue = state.orders.reduce((sum, order) => sum + order.total, 0);
  const totalUsers = state.users.length;
  const totalOrders = state.orders.length;
  const activeUsers = getLoggedInUsers().length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-6xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-brand-primary-700 via-brand-primary-600 to-brand-secondary-600 text-white shadow-lg">
            <div className="flex items-center space-x-4">
              <h2 className="text-3xl font-bold">🔧 Admin Dashboard</h2>
              <span className="text-brand-accent-200 font-medium">Welcome, {state.currentUser.name}!</span>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to clear all data? This will remove all users, orders, and activities.')) {
                    dispatch({ type: 'CLEAR_ALL_DATA' });
                    onClose();
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-brand-warning-500 to-brand-warning-600 hover:from-brand-warning-600 hover:to-brand-warning-700 text-white rounded-xl transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl"
              >
                🗑️ Clear Data
              </button>
              <button 
                onClick={() => {
                  dispatch({ type: 'LOGOUT' });
                  onClose();
                }}
                className="px-4 py-2 bg-gradient-to-r from-brand-error-500 to-brand-error-600 hover:from-brand-error-600 hover:to-brand-error-700 text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
              >
                🚪 Logout
              </button>
              <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-300 hover:rotate-90">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-72 bg-gradient-to-b from-brand-neutral-50 to-brand-neutral-100 border-r border-brand-neutral-200 overflow-y-auto">
              <nav className="p-6 space-y-3">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, emoji: '📊' },
                  { id: 'users', label: 'All Users', icon: Users, emoji: '👥' },
                  { id: 'logged-users', label: 'Logged-in Users', icon: UserCheck, emoji: '🟢' },
                  { id: 'cart-items', label: 'Cart Items', icon: ShoppingCart, emoji: '🛒' },
                  { id: 'orders', label: 'Orders', icon: ShoppingBag, emoji: '📦' },
                  { id: 'purchased-items', label: 'Purchased Items', icon: Package, emoji: '✅' },
                  { id: 'activities', label: 'User Activities', icon: Activity, emoji: '📈' },
                  { id: 'debug', label: 'Debug Info', icon: Activity, emoji: '🔧' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 font-medium ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 text-white shadow-lg transform scale-105'
                        : 'text-brand-neutral-700 hover:bg-white hover:shadow-md hover:scale-102'
                    }`}
                  >
                    <span className="text-xl">{tab.emoji}</span>
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-3xl font-bold text-brand-primary-800">📊 Dashboard Overview</h3>
                    <div className="h-1 flex-1 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-full"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-brand-primary-600 to-brand-primary-700 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-brand-primary-200 font-medium">👥 Total Users</p>
                          <p className="text-4xl font-bold mt-2">{totalUsers}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-full">
                          <Users size={36} className="text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-brand-secondary-600 to-brand-secondary-700 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-brand-secondary-200 font-medium">🟢 Active Users</p>
                          <p className="text-4xl font-bold mt-2">{activeUsers}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-full">
                          <UserCheck size={36} className="text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-brand-accent-500 to-brand-accent-600 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-brand-accent-100 font-medium">📦 Total Orders</p>
                          <p className="text-4xl font-bold mt-2">{totalOrders}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-full">
                          <ShoppingBag size={36} className="text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-brand-success-500 to-brand-success-600 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-brand-success-100 font-medium">💰 Revenue</p>
                          <p className="text-4xl font-bold mt-2">₹{totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-full">
                          <TrendingUp size={36} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border border-brand-silver-200">
                    <h4 className="text-lg font-semibold mb-4 text-brand-navy-700">Recent Activities</h4>
                    <div className="space-y-3">
                      {state.userActivities.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-3 p-3 bg-brand-silver-50 rounded-lg">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <p className="font-medium text-brand-silver-800">{activity.userName}</p>
                            <p className="text-sm text-brand-silver-600">{activity.description}</p>
                          </div>
                          <span className="text-xs text-brand-silver-500">
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-brand-navy-700">User Management</h3>
                  
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-brand-silver-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Orders</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Total Spent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Last Login</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-brand-silver-200">
                          {state.users.map((user) => (
                            <tr key={user.id} className="hover:bg-brand-silver-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full border-2 border-brand-silver-300"
                                  />
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-brand-silver-900">{user.name}</div>
                                    <div className="text-sm text-brand-silver-500">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-silver-900">
                                {user.orderCount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-brand-navy-700">
                                ₹{user.totalSpent.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-silver-500">
                                {formatDate(user.lastLogin)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-brand-navy-700">Order Management</h3>
                  
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-brand-silver-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-brand-silver-200">
                          {state.orders.map((order) => (
                            <tr key={order.id} className="hover:bg-brand-silver-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-navy-700">
                                {order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-silver-900">
                                {order.userName}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-brand-silver-900">
                                  {order.items.map((item, index) => (
                                    <div key={index}>
                                      {item.productName} x{item.quantity}
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-navy-700">
                                ₹{order.total.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-silver-500">
                                {formatDate(order.date)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'logged-users' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-brand-navy-700">Currently Logged-in Users</h3>
                  
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-brand-silver-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Login Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Cart Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Session Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-brand-silver-200">
                          {getLoggedInUsers().length > 0 ? getLoggedInUsers().map((user) => {
                            const userCartItems = user.id === state.currentUser?.id ? state.cart.length : 0;
                            const lastActivity = state.userActivities
                              .filter(activity => activity.userId === user.id)
                              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                            
                            return (
                              <tr key={user.id} className="hover:bg-brand-silver-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <img
                                      src={user.avatar}
                                      alt={user.name}
                                      className="w-10 h-10 rounded-full border-2 border-brand-silver-300"
                                    />
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-brand-silver-900">{user.name}</div>
                                      <div className="text-sm text-brand-silver-500">{user.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.role === 'admin' 
                                      ? 'bg-brand-accent-100 text-brand-accent-800' 
                                      : 'bg-brand-navy-100 text-brand-navy-800'
                                  }`}>
                                    {user.role}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-silver-900">
                                  {lastActivity ? formatDate(lastActivity.timestamp) : 'No activity'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-silver-900">
                                  {userCartItems} items
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                  </span>
                                </td>
                              </tr>
                            );
                          }) : (
                            <tr>
                              <td colSpan="5" className="px-6 py-4 text-center text-brand-silver-500">
                                No users currently logged in
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cart-items' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-brand-navy-700">Current Cart Items</h3>
                  
                  {getCurrentCartItems().length > 0 ? (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-brand-silver-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Product</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">User</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Quantity</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Price</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Total</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Added</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-brand-silver-200">
                            {getCurrentCartItems().map((cartItem) => (
                              <tr key={cartItem.id} className="hover:bg-brand-silver-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <img
                                      src={cartItem.productImage}
                                      alt={cartItem.productName}
                                      className="w-12 h-12 rounded-lg object-cover border border-brand-silver-300"
                                    />
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-brand-silver-900">{cartItem.productName}</div>
                                      <div className="text-sm text-brand-silver-500">{cartItem.category}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-silver-900">
                                  {cartItem.userName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-silver-900">
                                  {cartItem.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-brand-navy-700">
                                  ₹{cartItem.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-navy-700">
                                  ₹{cartItem.price * cartItem.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-silver-500">
                                  {formatDate(cartItem.addedAt)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-brand-silver-50 px-6 py-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-brand-silver-700">
                            Total Items: {getCurrentCartItems().reduce((sum, item) => sum + item.quantity, 0)}
                          </span>
                          <span className="text-lg font-bold text-brand-navy-700">
                            Cart Total: ₹{getCurrentCartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                      <ShoppingCart size={48} className="mx-auto text-brand-silver-400 mb-4" />
                      <h4 className="text-lg font-medium text-brand-silver-700 mb-2">No Cart Items</h4>
                      <p className="text-brand-silver-500">No users have items in their cart currently.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'purchased-items' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-brand-navy-700">All Purchased Items</h3>
                  
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-brand-silver-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Unit Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-brand-silver-200">
                          {getPurchasedItems().map((item) => (
                              <tr key={item.id} className="hover:bg-brand-silver-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {item.productImage ? (
                                      <img
                                        src={item.productImage}
                                        alt={item.productName}
                                        className="w-12 h-12 rounded-lg object-cover border border-brand-silver-300"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 bg-brand-silver-200 rounded-lg flex items-center justify-center">
                                        <Package size={20} className="text-brand-silver-500" />
                                      </div>
                                    )}
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-brand-silver-900">{item.productName}</div>
                                      <div className="text-sm text-brand-silver-500">{item.category}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-brand-silver-900">{item.customerName}</div>
                                  <div className="text-sm text-brand-silver-500">User ID: {item.customerId}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-navy-700">
                                  {item.orderId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-silver-900">
                                  {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-brand-navy-700">
                                  ₹{item.unitPrice}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-navy-700">
                                  ₹{item.totalPrice}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    item.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    item.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                    item.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-silver-500">
                                  {formatDate(item.orderDate)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-brand-silver-50 px-6 py-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-brand-silver-700">
                          Total Items Sold: {getPurchasedItems().reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                        <span className="text-lg font-bold text-brand-navy-700">
                          Total Revenue: ₹{getPurchasedItems().reduce((sum, item) => sum + item.totalPrice, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activities' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-brand-navy-700">User Activities</h3>
                  
                  <div className="space-y-3">
                    {state.userActivities.map((activity) => (
                      <div key={activity.id} className="bg-white rounded-lg shadow p-4 border border-brand-silver-200">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-brand-silver-800">{activity.userName}</h4>
                              <span className="text-sm text-brand-silver-500">
                                {formatDate(activity.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-brand-silver-600 mt-1">{activity.description}</p>
                            <div className="mt-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                activity.type === 'login' ? 'bg-green-100 text-green-800' :
                                activity.type === 'add_to_cart' ? 'bg-brand-navy-100 text-brand-navy-800' :
                                activity.type === 'purchase' ? 'bg-brand-accent-100 text-brand-accent-800' :
                                'bg-brand-silver-100 text-brand-silver-800'
                              }`}>
                                {activity.type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'debug' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-brand-navy-700">Debug Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-brand-silver-200">
                      <h4 className="text-lg font-semibold mb-4 text-brand-navy-700">Current State</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Current User:</strong> {state.currentUser ? state.currentUser.name : 'None'}</div>
                        <div><strong>Total Users:</strong> {state.users.length}</div>
                        <div><strong>Cart Items:</strong> {state.cart.length}</div>
                        <div><strong>Total Orders:</strong> {state.orders.length}</div>
                        <div><strong>Activities:</strong> {state.userActivities.length}</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-brand-silver-200">
                      <h4 className="text-lg font-semibold mb-4 text-brand-navy-700">LocalStorage Status</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Users Stored:</strong> {localStorage.getItem('elitestore_users') ? 'Yes' : 'No'}</div>
                        <div><strong>Current User Stored:</strong> {localStorage.getItem('elitestore_currentUser') ? 'Yes' : 'No'}</div>
                        <div><strong>Cart Stored:</strong> {localStorage.getItem('elitestore_cart') ? 'Yes' : 'No'}</div>
                        <div><strong>Orders Stored:</strong> {localStorage.getItem('elitestore_orders') ? 'Yes' : 'No'}</div>
                        <div><strong>Activities Stored:</strong> {localStorage.getItem('elitestore_activities') ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border border-brand-silver-200">
                    <h4 className="text-lg font-semibold mb-4 text-brand-navy-700">State Persistence Test</h4>
                    <p className="text-brand-silver-600 mb-4">
                      To test state persistence: Login, add items to cart, then navigate to different pages (About, Contact) 
                      and come back. Your login state and cart should be maintained.
                    </p>
                    <div className="flex space-x-4">
                      <a 
                        href="/about" 
                        className="px-4 py-2 bg-brand-navy-600 text-white rounded-lg hover:bg-brand-navy-700 transition-colors"
                      >
                        Go to About
                      </a>
                      <a 
                        href="/contact" 
                        className="px-4 py-2 bg-brand-silver-600 text-white rounded-lg hover:bg-brand-silver-700 transition-colors"
                      >
                        Go to Contact
                      </a>
                      <a 
                        href="/" 
                        className="px-4 py-2 bg-brand-accent-600 text-white rounded-lg hover:bg-brand-accent-700 transition-colors"
                      >
                        Go to Home
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 