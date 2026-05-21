import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCheck, RefreshCcw } from 'lucide-react';
import { api } from '../Utils/api';

type NotificationItem = {
  id: number;
  alert_type: string;
  lead: number | null;
  lead_name?: string;
  lead_company?: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low' | string;
  is_read: boolean;
  created_at: string;
};

const priorityCls: Record<string, string> = {
  high: 'bg-rose-100 text-rose-700 border-rose-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export const NotificationsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const data = await api.aiGetAlerts();
      setAlerts(data || []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = useMemo(() => alerts.filter(a => !a.is_read).length, [alerts]);

  const markRead = async (id: number) => {
    await api.aiMarkAlertRead(id);
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, is_read: true } : a)));
  };

  const markAllRead = async () => {
    await api.aiMarkAllRead();
    setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
  };

  return (
    <div className="min-h-full bg-slate-50 p-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Bell size={18} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Notifications</h1>
              <p className="text-sm text-slate-500">{unreadCount} unread alerts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(true)}
              className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center gap-2"
            >
              <RefreshCcw size={14} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={markAllRead}
              className="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">Loading notifications...</div>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">No notifications right now.</div>
        ) : (
          <div className="space-y-3">
            {alerts.map((item) => (
              <div key={item.id} className={`rounded-xl border p-4 bg-white ${item.is_read ? 'border-slate-200' : 'border-indigo-200 shadow-sm'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-bold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {item.lead_name ? `${item.lead_name}${item.lead_company ? ` • ${item.lead_company}` : ''} • ` : ''}
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${priorityCls[item.priority] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {item.priority}
                    </span>
                    {!item.is_read && (
                      <button
                        onClick={() => markRead(item.id)}
                        className="text-xs font-semibold px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
