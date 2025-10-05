import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

const Users = () => {
  const { state } = useApp();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-brand-navy-700">Users</h2>
      <div className="bg-white rounded-xl shadow border border-brand-silver-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand-silver-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-silver-200">
              {state.users.map(u => (
                <tr key={u.id} className="hover:bg-brand-silver-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full" />
                      <div>
                        <div className="font-medium text-brand-silver-800">{u.name}</div>
                        <div className="text-xs text-brand-silver-600">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{u.orderCount || 0}</td>
                  <td className="px-6 py-4">₹{(u.totalSpent || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 capitalize">{u.role || 'user'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;