import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

const LoggedUsers = () => {
  const { state } = useApp();
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const loggedUsers = state.users.filter(u =>
    state.userActivities.some(a => a.userId === u.id && new Date(a.timestamp) > cutoff)
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-brand-navy-700">Logged-in Users (last 24h)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loggedUsers.map(u => (
          <div key={u.id} className="bg-white rounded-xl shadow border border-brand-silver-200 p-4 flex items-center gap-3">
            <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-medium text-brand-silver-800">{u.name}</div>
              <div className="text-xs text-brand-silver-600">{u.email}</div>
            </div>
          </div>
        ))}
        {loggedUsers.length === 0 && (
          <div className="text-brand-silver-600">No recent logins.</div>
        )}
      </div>
    </div>
  );
};

export default LoggedUsers;