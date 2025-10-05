import React from 'react';
import { Users, ShoppingBag, TrendingUp, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <div className={`p-6 rounded-2xl text-white shadow-lg bg-gradient-to-br ${gradient}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-brand-primary-100/90 text-sm">{title}</p>
        <p className="text-3xl font-extrabold mt-1">{value}</p>
      </div>
      <div className="bg-white/20 p-3 rounded-xl">
        <Icon size={28} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { state } = useApp();
  const totalRevenue = state.orders.reduce((sum, o) => sum + o.total, 0);
  const activeUsers = (() => {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const userIds = new Set(
      state.userActivities
        .filter(a => new Date(a.timestamp) > cutoff)
        .map(a => a.userId)
    );
    return userIds.size;
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-brand-navy-700">Dashboard Overview</h2>
        <div className="h-1 flex-1 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={state.users.length} icon={Users} gradient="from-brand-primary-600 to-brand-primary-700" />
        <StatCard title="Active Users" value={activeUsers} icon={UserCheck} gradient="from-brand-secondary-600 to-brand-secondary-700" />
        <StatCard title="Total Orders" value={state.orders.length} icon={ShoppingBag} gradient="from-brand-accent-500 to-brand-accent-600" />
        <StatCard title="Revenue" value={`₹${totalRevenue.toFixed(2)}`} icon={TrendingUp} gradient="from-brand-success-500 to-brand-success-600" />
      </div>

      <div className="bg-white rounded-xl shadow border border-brand-silver-200 p-5">
        <h3 className="text-lg font-semibold text-brand-navy-700 mb-4">Recent Activities</h3>
        <div className="divide-y divide-brand-silver-200">
          {state.userActivities.slice(0, 8).map(a => (
            <div key={a.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-brand-silver-800">{a.userName}</div>
                <div className="text-sm text-brand-silver-600">{a.description}</div>
              </div>
              <div className="text-xs text-brand-silver-500">
                {new Date(a.timestamp).toLocaleString('en-US', { hour12: true })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;