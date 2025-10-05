import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Navigation from './components/Navigation.jsx';
import Hero from './components/Hero.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Cart from './components/Cart.jsx';
import AuthModal from './components/AuthModal.jsx';
import DatabaseTest from './pages/DatabaseTest.jsx';
import OrderHistory from './components/OrderHistory.jsx';
import OrderTracking from './components/OrderTracking.jsx';

// Admin dashboard (full-page)
import AdminLayout from './layout/AdminLayout.jsx';
import { Dashboard, Users, Orders, CartItems, Activities, PurchasedItems, LoggedUsers, RequireAdmin } from './pages/admin';
import AdminMetrics from './pages/admin/AdminMetrics'; // Adjust path as needed

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-brand-neutral-50 via-white to-brand-primary-50">
          <Navigation 
            onCartOpen={() => setIsCartOpen(true)}
            onAuthOpen={() => setIsAuthOpen(true)}
          />
          
          <Routes>
            <Route path="/" element={
              <main>
                <Hero />
                <ProductGrid />
              </main>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/db-test" element={<DatabaseTest />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:orderId" element={<OrderTracking />} />

            {/* Admin - protected full-page dashboard with nested routes */}
            <Route element={<RequireAdmin />}> 
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="orders" element={<Orders />} />
                <Route path="cart-items" element={<CartItems />} />
                <Route path="activities" element={<Activities />} />
                <Route path="purchased-items" element={<PurchasedItems />} />
                <Route path="logged-users" element={<LoggedUsers />} />
                <Route path="metrics" element={<AdminMetrics />} />
              </Route>
            </Route>
          </Routes>

          <Cart 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />
          
          <AuthModal 
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;