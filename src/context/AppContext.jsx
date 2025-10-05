import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { products as mockProducts } from '../data/mockData.js';
import { productAPI, authAPI } from '../services/api.js';

// Helper functions for localStorage
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    const parsed = JSON.parse(item);
    // Validate that the parsed data is not null/undefined for critical keys
    if (key === 'elitestore_currentUser' && parsed && (!parsed.id || !parsed.name)) {
      console.warn('Invalid user data in localStorage, clearing...');
      localStorage.removeItem(key);
      return defaultValue;
    }
    
    return parsed;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem(key);
    return defaultValue;
  }
};

const initialState = {
  products: mockProducts, // Will be replaced with DB data
  users: loadFromLocalStorage('elitestore_users', []),
  orders: loadFromLocalStorage('elitestore_orders', []),
  userActivities: loadFromLocalStorage('elitestore_activities', []),
  cart: loadFromLocalStorage('elitestore_cart', []),
  currentUser: loadFromLocalStorage('elitestore_currentUser', null),
  loading: false,
  error: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGIN':
      return { 
        ...state, 
        currentUser: action.payload,
        userActivities: [
          {
            id: Date.now().toString(),
            userId: action.payload.id,
            userName: action.payload.name,
            type: 'login',
            description: 'User logged in',
            timestamp: new Date().toISOString()
          },
          ...state.userActivities
        ]
      };
    case 'LOGOUT':
      const newState = { 
        ...state, 
        currentUser: null, 
        cart: [],
        userActivities: [
          {
            id: Date.now().toString(),
            userId: state.currentUser?.id || 'unknown',
            userName: state.currentUser?.name || 'Unknown User',
            type: 'logout',
            description: 'User logged out',
            timestamp: new Date().toISOString()
          },
          ...state.userActivities
        ]
      };
      // Clear user-specific data from localStorage
      saveToLocalStorage('elitestore_currentUser', null);
      saveToLocalStorage('elitestore_cart', []);
      return newState;
    case 'REGISTER':
      return { 
        ...state, 
        users: [...state.users, action.payload],
        currentUser: action.payload,
        userActivities: [
          {
            id: Date.now().toString(),
            userId: action.payload.id,
            userName: action.payload.name,
            type: 'login',
            description: 'User registered and logged in',
            timestamp: new Date().toISOString()
          },
          ...state.userActivities
        ]
      };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.productId === action.payload.productId);
      const product = state.products.find(p => p.id === action.payload.productId);
      
      console.log('🛒 ADD_TO_CART action:', {
        productId: action.payload.productId,
        quantity: action.payload.quantity,
        existingItem: existingItem,
        productFound: !!product,
        currentCartLength: state.cart.length
      });
      
      let newCart;
      if (existingItem) {
        newCart = state.cart.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newCart = [...state.cart, { 
          productId: action.payload.productId, 
          quantity: action.payload.quantity,
          addedAt: new Date().toISOString()
        }];
      }
      
      console.log('🛒 New cart length:', newCart.length);

      return {
        ...state,
        cart: newCart,
        userActivities: state.currentUser ? [
          {
            id: Date.now().toString(),
            userId: state.currentUser.id,
            userName: state.currentUser.name,
            type: 'add_to_cart',
            description: `Added ${product?.name} to cart`,
            timestamp: new Date().toISOString()
          },
          ...state.userActivities
        ] : state.userActivities
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.productId !== action.payload)
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        userActivities: [
          {
            id: Date.now().toString(),
            userId: action.payload.userId,
            userName: action.payload.userName,
            type: 'purchase',
            description: `Completed order ${action.payload.id} for ₹${action.payload.total.toFixed(2)}`,
            timestamp: new Date().toISOString()
          },
          ...state.userActivities
        ]
      };
    case 'ADD_ACTIVITY':
      return {
        ...state,
        userActivities: [action.payload, ...state.userActivities]
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser && state.currentUser.id === action.payload.id 
          ? action.payload 
          : state.currentUser
      };
    case 'VIEW_PRODUCT':
      return {
        ...state,
        userActivities: state.currentUser ? [
          {
            id: Date.now().toString(),
            userId: state.currentUser.id,
            userName: state.currentUser.name,
            type: 'view_product',
            description: `Viewed ${action.payload.productName}`,
            timestamp: new Date().toISOString()
          },
          ...state.userActivities
        ] : state.userActivities
      };
    case 'CLEAR_ALL_DATA':
      // Clear all localStorage data
      localStorage.removeItem('elitestore_users');
      localStorage.removeItem('elitestore_orders');
      localStorage.removeItem('elitestore_activities');
      localStorage.removeItem('elitestore_cart');
      localStorage.removeItem('elitestore_currentUser');
      return {
        products,
        users: [],
        orders: [],
        userActivities: [],
        cart: [],
        currentUser: null
      };
    default:
      return state;
  }
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Fetch products from MongoDB on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const data = await productAPI.getAll();
        
        // Transform MongoDB products to match frontend format
        const transformedProducts = data.products.map(product => ({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          description: product.description,
          rating: product.rating || 4.5,
          reviews: product.reviews || 0,
          stock: product.stock,
          inStock: product.stock > 0
        }));
        
        dispatch({ type: 'SET_PRODUCTS', payload: transformedProducts });
        console.log('✅ Products loaded from MongoDB:', transformedProducts.length);
      } catch (error) {
        console.error('❌ Error fetching products:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        // Keep using mock data if API fails
        console.log('⚠️ Using mock data as fallback');
      }
    };

    fetchProducts();
  }, []);

  // Check if user is still logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = loadFromLocalStorage('elitestore_currentUser', null);
      if (savedUser) {
        try {
          // Verify token is still valid
          const data = await authAPI.getProfile();
          // Update user data if needed
          if (data.user) {
            const transformedUser = {
              id: data.user._id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role
            };
            dispatch({ type: 'LOGIN', payload: transformedUser });
          }
        } catch (error) {
          // Token expired or invalid, clear user
          console.log('Session expired, logging out');
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    checkAuth();
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage('elitestore_users', state.users);
    saveToLocalStorage('elitestore_orders', state.orders);
    saveToLocalStorage('elitestore_activities', state.userActivities);
    saveToLocalStorage('elitestore_cart', state.cart);
    saveToLocalStorage('elitestore_currentUser', state.currentUser);
  }, [state.users, state.orders, state.userActivities, state.cart, state.currentUser]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 