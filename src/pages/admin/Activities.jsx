import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

const Activities = () => {
  const { state } = useApp();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-brand-navy-700">User Activities</h2>
      <div className="bg-white rounded-xl shadow border border-brand-silver-200 overflow-hidden">
        <ul className="divide-y divide-brand-silver-200">
          {state.userActivities.map(a => (
            <li key={a.id} className="p-4 flex items-start justify-between">
              <div>
                <div className="font-medium text-brand-silver-800">{a.userName}</div>
                <div className="text-sm text-brand-silver-600">{a.description}</div>
              </div>
              <div className="text-xs text-brand-silver-500">
                {new Date(a.timestamp).toLocaleString('en-US', { hour12: true })}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Activities;