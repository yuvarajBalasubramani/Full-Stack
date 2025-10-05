import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Mail, Lock, Calendar, Camera, Shield, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const AuthModal = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const user = state.users.find(u => 
      u.email.toLowerCase() === loginForm.email.toLowerCase() && 
      u.password === loginForm.password &&
      u.role === loginForm.role
    );

    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
      setSuccess(`Login successful! Welcome back, ${user.name} (${user.role})`);
      setTimeout(() => {
        onClose();
        setLoginForm({ email: '', password: '', role: 'user' });
        setSuccess('');
      }, 1500);
    } else {
      setError('Invalid email, password, or role selection');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (state.users.find(u => u.email.toLowerCase() === registerForm.email.toLowerCase())) {
      setError('Email already exists');
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(registerForm.name)}&background=random`,
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString(),
      totalSpent: 0,
      orderCount: 0,
      status: 'active',
      role: registerForm.role
    };

    dispatch({ type: 'REGISTER', payload: newUser });
    setSuccess('Registration successful! Welcome to EliteStore!');
    setTimeout(() => {
      onClose();
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
      setSuccess('');
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setLoginForm({ email: '', password: '', role: 'user' });
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-900/80 to-brand-secondary-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-brand-neutral-200 animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary-700 to-brand-secondary-600">
              {isLogin ? '👋 Welcome Back!' : '🎉 Join EliteStore'}
            </h2>
            <p className="text-brand-neutral-600 mt-2">
              {isLogin ? 'Sign in to your account' : 'Create your account today'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-neutral-100 rounded-full transition-all duration-300 hover:rotate-90">
            <X size={24} className="text-brand-neutral-600" />
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-brand-error-50 to-brand-error-100 border border-brand-error-200 rounded-2xl">
            <p className="text-brand-error-700 text-sm font-medium">❌ {error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-brand-success-50 to-brand-success-100 border border-brand-success-200 rounded-2xl">
            <p className="text-brand-success-700 text-sm font-medium">✅ {success}</p>
          </div>
        )}

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="login-email" className="block text-sm font-bold text-brand-primary-700 mb-3">
                📧 Email Address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-neutral-400" />
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                  className="w-full pl-12 pr-4 py-4 border-2 border-brand-neutral-200 rounded-2xl focus:ring-4 focus:ring-brand-primary-200 focus:border-brand-primary-500 transition-all duration-300 bg-brand-neutral-50 hover:bg-white"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-bold text-brand-primary-700 mb-3">
                🔒 Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                  className="w-full pl-12 pr-14 py-4 border-2 border-brand-neutral-200 rounded-2xl focus:ring-4 focus:ring-brand-primary-200 focus:border-brand-primary-500 transition-all duration-300 bg-brand-neutral-50 hover:bg-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="login-role" className="block text-sm font-bold text-brand-primary-700 mb-3">
                🎯 Login As
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  loginForm.role === 'user' 
                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-cyan-50 text-emerald-700 shadow-lg shadow-emerald-200' 
                    : 'border-gray-300 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={loginForm.role === 'user'}
                    onChange={handleLoginChange}
                    className="sr-only"
                  />
                  <UserCheck size={20} className="mr-2" />
                  <span className="font-bold">👤 User</span>
                </label>
                <label className={`flex items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  loginForm.role === 'admin' 
                    ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-lg shadow-purple-200' 
                    : 'border-gray-300 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={loginForm.role === 'admin'}
                    onChange={handleLoginChange}
                    className="sr-only"
                  />
                  <Shield size={20} className="mr-2" />
                  <span className="font-bold">🛡️ Admin</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50 animate-gradient-x"
            >
              ✨ Sign In to EliteStore
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="register-name" className="block text-sm font-bold text-brand-primary-700 mb-3">
                👤 Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="register-name"
                  name="name"
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-bold text-brand-primary-700 mb-3">
                📧 Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-bold text-brand-primary-700 mb-3">
                🔒 Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="register-password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-bold text-brand-primary-700 mb-3">
                🔐 Confirm Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="register-confirm-password"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="register-role" className="block text-sm font-bold text-brand-primary-700 mb-3">
                🎯 Register As
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  registerForm.role === 'user' 
                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-cyan-50 text-emerald-700 shadow-lg shadow-emerald-200' 
                    : 'border-gray-300 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={registerForm.role === 'user'}
                    onChange={handleRegisterChange}
                    className="sr-only"
                  />
                  <UserCheck size={20} className="mr-2" />
                  <span className="font-bold">👤 User</span>
                </label>
                <label className={`flex items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  registerForm.role === 'admin' 
                    ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-lg shadow-purple-200' 
                    : 'border-gray-300 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={registerForm.role === 'admin'}
                    onChange={handleRegisterChange}
                    className="sr-only"
                  />
                  <Shield size={20} className="mr-2" />
                  <span className="font-bold">🛡️ Admin</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/50 animate-gradient-x"
            >
              🎉 Create Your Account
            </button>
          </form>
        )}

        {/* Toggle between Login and Register */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-bold transition-all duration-300 hover:scale-105 inline-block"
            >
              {isLogin ? '🚀 Sign up now!' : '👋 Sign in here!'}
            </button>
          </p>
        </div>

        {/* Getting Started Info */}
        <div className="mt-6 p-4 bg-brand-silver-50 rounded-lg border border-brand-silver-200">
          <h4 className="text-sm font-medium text-brand-navy-700 mb-2">Getting Started:</h4>
          <div className="text-xs text-brand-silver-600 space-y-1">
            <p>• <strong>New User?</strong> Register with your preferred role</p>
            <p>• <strong>Admin Access:</strong> Select "Admin" role during registration</p>
            <p>• <strong>User Access:</strong> Select "User" role for shopping</p>
            <p>• All data is generated from your actual interactions!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 