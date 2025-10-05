import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

const PurchasedItems = () => {
  const { state } = useApp();
  const items = [];
  state.orders.forEach(order => {
    order.items.forEach(item => {
      const product = state.products.find(p => p.id === item.productId);
      items.push({
        id: `${order.id}-${item.productId}`,
        productName: item.productName,
        productImage: product?.image || '',
        category: product?.category || 'Unknown',
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        customerName: order.userName,
        orderDate: order.date,
        status: order.status,
      });
    });
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-brand-navy-700">Purchased Items</h2>
      <div className="bg-white rounded-xl shadow border border-brand-silver-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand-silver-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-silver-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-silver-200">
              {items.map(it => (
                <tr key={it.id} className="hover:bg-brand-silver-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {it.productImage && <img src={it.productImage} alt={it.productName} className="w-10 h-10 rounded-lg object-cover" />}
                      <div className="font-medium text-brand-silver-800">{it.productName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{it.category}</td>
                  <td className="px-6 py-4">{it.quantity}</td>
                  <td className="px-6 py-4">₹{it.unitPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">₹{it.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">{it.customerName}</td>
                  <td className="px-6 py-4">{new Date(it.orderDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchasedItems;