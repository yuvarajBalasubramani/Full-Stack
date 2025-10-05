import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Checking connection...');

  const checkConnection = async () => {
    setStatus('checking');
    setMessage('Checking connection...');
    
    try {
      const response = await fetch('http://localhost:5000/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus('connected');
        setMessage('Backend server is running');
      } else {
        setStatus('error');
        setMessage(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      setStatus('disconnected');
      setMessage('Cannot connect to backend server. Please start the server on port 5000.');
      console.error('Connection check failed:', error);
    }
  };

  useEffect(() => {
    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'connected') {
    return null; // Don't show anything when connected
  }

  return (
    <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      status === 'checking' ? 'bg-blue-50 border-2 border-blue-300' :
      status === 'disconnected' ? 'bg-red-50 border-2 border-red-300' :
      'bg-yellow-50 border-2 border-yellow-300'
    }`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {status === 'checking' ? (
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
          ) : status === 'disconnected' ? (
            <WifiOff className="w-5 h-5 text-red-600" />
          ) : (
            <Wifi className="w-5 h-5 text-yellow-600" />
          )}
        </div>
        <div className="flex-1">
          <h4 className={`font-bold text-sm mb-1 ${
            status === 'checking' ? 'text-blue-800' :
            status === 'disconnected' ? 'text-red-800' :
            'text-yellow-800'
          }`}>
            {status === 'checking' ? 'Checking Connection' :
             status === 'disconnected' ? 'Backend Disconnected' :
             'Connection Issue'}
          </h4>
          <p className={`text-xs ${
            status === 'checking' ? 'text-blue-700' :
            status === 'disconnected' ? 'text-red-700' :
            'text-yellow-700'
          }`}>
            {message}
          </p>
          {status === 'disconnected' && (
            <div className="mt-3 space-y-2">
              <button
                onClick={checkConnection}
                className="w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
              >
                Retry Connection
              </button>
              <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
                <strong>To start backend:</strong>
                <br />
                1. Open terminal
                <br />
                2. Navigate to server folder
                <br />
                3. Run: <code className="bg-red-200 px-1 rounded">npm start</code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;