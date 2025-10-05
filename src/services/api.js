// API Service for Backend Communication
// Use environment variable in production, fallback to localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Helper function to make API calls with credentials
const apiCall = async (endpoint, options = {}) => {
  const config = {
    ...options,
    credentials: 'include', // Important: Include cookies for authentication
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    
    // Provide more specific error messages
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and backend server.');
    }
    
    throw error;
  }
};

// ============================================
// AUTHENTICATION APIs
// ============================================

export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Logout user
  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },

  // Get current user profile
  getProfile: async () => {
    return apiCall('/auth/profile');
  },

  // Update user profile
  updateProfile: async (userData) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// ============================================
// PRODUCT APIs
// ============================================

export const productAPI = {
  // Get all products
  getAll: async () => {
    return apiCall('/products');
  },

  // Get single product by ID
  getById: async (id) => {
    return apiCall(`/products/${id}`);
  },

  // Create new product (Admin only)
  create: async (productData) => {
    return apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update product (Admin only)
  update: async (id, productData) => {
    return apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete product (Admin only)
  delete: async (id) => {
    return apiCall(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// CART APIs
// ============================================

export const cartAPI = {
  // Get user's cart
  get: async () => {
    return apiCall('/cart');
  },

  // Add item to cart
  addItem: async (productId, quantity = 1) => {
    return apiCall('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  // Update cart item quantity
  updateItem: async (productId, quantity) => {
    return apiCall('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  // Remove item from cart
  removeItem: async (productId) => {
    return apiCall('/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  },

  // Clear entire cart
  clear: async () => {
    return apiCall('/cart/clear', {
      method: 'DELETE',
    });
  },
};

// ============================================
// ORDER APIs
// ============================================

export const orderAPI = {
  // Get all orders for current user
  getAll: async () => {
    return apiCall('/orders');
  },

  // Get single order by ID
  getById: async (id) => {
    return apiCall(`/orders/${id}`);
  },

  // Create new order
  create: async (orderData) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Update order status (Admin only)
  updateStatus: async (id, status) => {
    return apiCall(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Cancel order
  cancel: async (id) => {
    return apiCall(`/orders/${id}/cancel`, {
      method: 'PUT',
    });
  },
};

// ============================================
// ADDRESS APIs
// ============================================

export const addressAPI = {
  // Get all addresses for current user
  getAll: async () => {
    return apiCall('/addresses');
  },

  // Get single address by ID
  getById: async (id) => {
    return apiCall(`/addresses/${id}`);
  },

  // Create new address
  create: async (addressData) => {
    return apiCall('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  // Update address
  update: async (id, addressData) => {
    return apiCall(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  // Delete address
  delete: async (id) => {
    return apiCall(`/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  // Set default address
  setDefault: async (id) => {
    return apiCall(`/addresses/${id}/default`, {
      method: 'PUT',
    });
  },
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error', message: error.message };
  }
};

export default {
  auth: authAPI,
  products: productAPI,
  cart: cartAPI,
  orders: orderAPI,
  addresses: addressAPI,
  healthCheck,
};