import React, { useState, useEffect } from 'react';
import { productAPI, authAPI, healthCheck } from '../services/api';
import { useApp } from '../context/AppContext';

const DatabaseTest = () => {
  const { state } = useApp();
  const [apiStatus, setApiStatus] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState({});

  // Check API health
  const checkAPIHealth = async () => {
    try {
      const result = await healthCheck();
      setApiStatus(result);
      setTestResults(prev => ({ ...prev, health: '✅ API is running' }));
    } catch (err) {
      setApiStatus({ status: 'error', message: err.message });
      setTestResults(prev => ({ ...prev, health: '❌ API is down' }));
    }
  };

  // Fetch products from database
  const fetchDBProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productAPI.getAll();
      setDbProducts(data.products);
      setTestResults(prev => ({ 
        ...prev, 
        products: `✅ Loaded ${data.products.length} products from MongoDB` 
      }));
    } catch (err) {
      setError(err.message);
      setTestResults(prev => ({ 
        ...prev, 
        products: `❌ Failed to load products: ${err.message}` 
      }));
    } finally {
      setLoading(false);
    }
  };

  // Test login
  const testLogin = async () => {
    try {
      const result = await authAPI.login({
        email: 'admin@example.com',
        password: 'admin123'
      });
      setTestResults(prev => ({ 
        ...prev, 
        login: `✅ Login successful: ${result.user.name} (${result.user.role})` 
      }));
    } catch (err) {
      setTestResults(prev => ({ 
        ...prev, 
        login: `❌ Login failed: ${err.message}` 
      }));
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setTestResults({});
    await checkAPIHealth();
    await fetchDBProducts();
    await testLogin();
  };

  useEffect(() => {
    checkAPIHealth();
    fetchDBProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🗄️ MongoDB Database Test Dashboard
          </h1>
          <p className="text-gray-600 mb-6">
            View and test data from your MongoDB database
          </p>
          
          <button
            onClick={runAllTests}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🔄 Run All Tests
          </button>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📡 API Status</h2>
          {apiStatus ? (
            <div className={`p-4 rounded-lg ${apiStatus.status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p className="font-semibold">Status: {apiStatus.status}</p>
              <p>Message: {apiStatus.message}</p>
              {apiStatus.timestamp && (
                <p className="text-sm mt-2">Timestamp: {new Date(apiStatus.timestamp).toLocaleString()}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Checking API status...</p>
          )}
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🧪 Test Results</h2>
            <div className="space-y-3">
              {Object.entries(testResults).map(([key, value]) => (
                <div key={key} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-mono text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Context Products (Frontend State) */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📦 Products in Frontend State
          </h2>
          <p className="text-gray-600 mb-4">
            These products are loaded from MongoDB into your React context
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="font-semibold text-blue-800">
              Total Products: {state.products.length}
            </p>
            {state.loading && <p className="text-blue-600">Loading...</p>}
            {state.error && <p className="text-red-600">Error: {state.error}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="text-lg font-bold text-blue-600">₹{product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                <p className="text-xs text-gray-400 mt-2">ID: {product.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Raw Database Products */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🗄️ Raw Database Products
          </h2>
          <p className="text-gray-600 mb-4">
            Direct data from MongoDB API
          </p>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products from database...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg">
              <p className="font-semibold">Error loading products:</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && dbProducts.length > 0 && (
            <>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-green-800">
                  ✅ Successfully loaded {dbProducts.length} products from MongoDB
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        MongoDB ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dbProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="h-16 w-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                          {product._id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* JSON View */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📄 Raw JSON Data
          </h2>
          <div className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              {JSON.stringify(dbProducts, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;