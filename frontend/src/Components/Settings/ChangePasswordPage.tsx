import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { authStore } from '../Utils/auth';

export const ChangePasswordPage: React.FC = () => {
  const currentUser = useMemo(() => authStore.getUser(), []);
  const [forceLogin, setForceLogin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [show, setShow] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });

  if (forceLogin || !authStore.getToken() || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const extractErrorMessage = (data: any, fallback: string) => {
    if (!data) return fallback;
    if (typeof data === 'string') return data;
    if (typeof data.detail === 'string') return data.detail;
    if (typeof data.message === 'string') return data.message;
    if (Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
      return String(data.non_field_errors[0]);
    }
    for (const value of Object.values(data)) {
      if (Array.isArray(value) && value.length) return String(value[0]);
      if (typeof value === 'string' && value.trim()) return value;
    }
    return fallback;
  };

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleShow = (key: keyof typeof show) => {
    setShow((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-3 text-[14px] text-slate-700 placeholder:text-slate-400 ' +
    'focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.new_password !== form.confirm_password) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const requestWithToken = async (accessToken: string) =>
        fetch('/api/auth/change-password/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(form),
        });

      let accessToken = authStore.getToken();
      if (!accessToken) throw new Error('Session expired. Please login again.');

      let res = await requestWithToken(accessToken);

      if (res.status === 401) {
        const refreshToken = authStore.getRefreshToken();
        if (!refreshToken) {
          authStore.clearSession();
          setForceLogin(true);
          throw new Error('Session expired. Please login again.');
        }

        const refreshRes = await fetch('/api/auth/refresh/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json().catch(() => null);
          const newAccess = refreshData?.access;
          const newRefresh = refreshData?.refresh;
          if (typeof newAccess === 'string' && newAccess) {
            authStore.setAccessToken(newAccess);
            if (typeof newRefresh === 'string' && newRefresh) {
              authStore.setRefreshToken(newRefresh);
            }
            res = await requestWithToken(newAccess);
          } else {
            authStore.clearSession();
            setForceLogin(true);
            throw new Error('Session expired. Please login again.');
          }
        } else {
          authStore.clearSession();
          setForceLogin(true);
          throw new Error('Session expired. Please login again.');
        }
      }

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(extractErrorMessage(data, 'Failed to change password.'));
      }

      setSuccess('Password updated successfully.');
      setForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-full p-6 md:p-8"
      style={{ background: 'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}
    >
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(125deg,#1e1b4b 0%,#312e81 30%,#4f46e5 70%,#7c3aed 100%)',
            boxShadow: '0 12px 36px rgba(79,70,229,0.35)',
          }}
        >
          <div className="px-6 py-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
              <KeyRound size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-[24px] font-black text-white tracking-tight">Settings</h1>
              <p className="text-indigo-100 text-[13px] font-medium">Change your account password</p>
            </div>
          </div>
        </div>

        <div
          className="mt-5 bg-white rounded-2xl border border-slate-200 p-6 md:p-7"
          style={{ boxShadow: '0 10px 32px rgba(15,23,42,0.08)' }}
        >
          <div className="flex items-center gap-2.5 mb-5 text-indigo-700">
            <ShieldCheck size={18} />
            <span className="text-[14px] font-bold">Security</span>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700">
              <AlertTriangle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-semibold text-emerald-700">
              <CheckCircle2 size={15} className="shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={show.current_password ? 'text' : 'password'}
                  value={form.current_password}
                  onChange={(e) => updateField('current_password', e.target.value)}
                  className={inputCls}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShow('current_password')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {show.current_password ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={show.new_password ? 'text' : 'password'}
                  value={form.new_password}
                  onChange={(e) => updateField('new_password', e.target.value)}
                  className={inputCls}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShow('new_password')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {show.new_password ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={show.confirm_password ? 'text' : 'password'}
                  value={form.confirm_password}
                  onChange={(e) => updateField('confirm_password', e.target.value)}
                  className={inputCls}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShow('confirm_password')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {show.confirm_password ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-black text-white bg-gradient-to-r from-indigo-600 to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_10px_24px_rgba(79,70,229,0.3)] transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
