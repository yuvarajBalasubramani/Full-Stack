import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

const Orders = () => {
  const { state } = useApp();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-brand-navy-700">Orders</h2>
      <div className="bg-white rounded-xl shadow border border-brand-silver-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand-silver-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-silver-200">
              {state.orders.map(o => (
                <tr key={o.id} className="hover:bg-brand-silver-50">
                  <td className="px-6 py-3 font-mono">{o.id}</td>
                  <td className="px-6 py-3">{o.userName}</td>
                  <td className="px-6 py-3">{new Date(o.date).toLocaleString()}</td>
                  <td className="px-6 py-3">₹{o.total.toFixed(2)}</td>
                  <td className="px-6 py-3 capitalize">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;