import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ShoppingBag, ShoppingCart, Activity, Package, TrendingUp, LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? 'bg-brand-primary-600 text-white shadow-lg'
          : 'text-brand-neutral-700 hover:bg-white hover:shadow'
      }`
    }
    end
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

const AdminLayout = () => {
  const { state, dispatch } = useApp();

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] grid-rows-[64px_1fr] bg-brand-neutral-50">
      {/* Top bar */}
      <header className="col-span-2 h-16 bg-white/80 backdrop-blur border-b border-brand-silver-200 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="text-xl font-extrabold text-brand-primary-700">Elite Admin</div>
          <span className="text-sm text-brand-silver-600 hidden sm:block">Professional Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          {state.currentUser && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-brand-neutral-100 rounded-lg border border-brand-silver-200">
              <img src={state.currentUser.avatar} alt={state.currentUser.name} className="w-7 h-7 rounded-full" />
              <div className="text-sm">
                <div className="font-medium text-brand-navy-700">{state.currentUser.name}</div>
                <div className="text-xs text-brand-silver-600 capitalize">{state.currentUser.role}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-brand-error-500 to-brand-error-600 text-white hover:from-brand-error-600 hover:to-brand-error-700"
            title="Logout"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="row-span-1 row-start-2 h-[calc(100vh-64px)] bg-gradient-to-b from-brand-neutral-50 to-brand-neutral-100 border-r border-brand-neutral-200 p-4 overflow-y-auto">
        <div className="space-y-1">
          <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/admin/users" icon={Users} label="Users" />
          <NavItem to="/admin/logged-users" icon={Users} label="Logged-in Users" />
          <NavItem to="/admin/cart-items" icon={ShoppingCart} label="Cart Items" />
          <NavItem to="/admin/orders" icon={ShoppingBag} label="Orders" />
          <NavItem to="/admin/purchased-items" icon={Package} label="Purchased Items" />
          <NavItem to="/admin/activities" icon={Activity} label="Activities" />
          <NavItem to="/admin/metrics" icon={TrendingUp} label="Metrics" />
        </div>
      </aside>

      {/* Content */}
      <main className="row-start-2 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;