import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  Filter,
  Heart,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
} from 'lucide-react';
import { authStore, type AuthUser } from '../Utils/auth';
import type { WishlistEntry } from '../Utils/types';

const WISHLIST_URL = '/api/wishlist/';

const labelCls = 'block text-[12px] font-black text-slate-500 uppercase tracking-[0.16em] mb-2';
const inputCls =
  'w-full px-3.5 py-3 text-[14px] text-slate-800 bg-slate-50 border border-slate-200 rounded-xl ' +
  'placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-rose-400 ' +
  'focus:ring-4 focus:ring-rose-500/10 transition-all duration-200';

const extractErrorMessage = (data: any, fallback: string) => {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data.detail === 'string') return data.detail;
  if (typeof data.message === 'string') return data.message;
  for (const value of Object.values(data)) {
    if (Array.isArray(value) && value.length) return String(value[0]);
    if (typeof value === 'string' && value.trim()) return value;
  }
  return fallback;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const getDisplayUserName = (entry: WishlistEntry) =>
  entry.created_by_info?.name || entry.created_by_info?.username || entry.created_by_info?.email || 'Another user';

export const WishlistPage: React.FC = () => {
  const currentUser = useMemo(() => authStore.getUser(), []);
  const isAdmin = currentUser?.role === 'admin';
  const [forceLogin, setForceLogin] = useState(false);
  const [entries, setEntries] = useState<WishlistEntry[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    company_name: '',
    location: '',
  });
  const [filters, setFilters] = useState({
    created_by: '',
    company_name: '',
    region: '',
    date_from: '',
    date_to: '',
  });

  if (forceLogin || !authStore.getToken() || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const loadEntries = async () => {
    setLoading(true);
    setError('');
    try {
      const url = new URL(WISHLIST_URL, window.location.origin);
      if (isAdmin && filters.created_by) url.searchParams.set('created_by', filters.created_by);
      if (filters.company_name) url.searchParams.set('company_name', filters.company_name);
      if (filters.region) url.searchParams.set('region', filters.region);
      if (filters.date_from) url.searchParams.set('date_from', filters.date_from);
      if (filters.date_to) url.searchParams.set('date_to', filters.date_to);

      const res = await authStore.fetchWithAuth(url.toString());
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(extractErrorMessage(data, 'Failed to load wishlist.'));
      setEntries(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if ((err.message || '').includes('Session expired')) {
        setForceLogin(true);
      }
      setEntries([]);
      setError(err.message || 'Failed to load wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEntries();
  }, [isAdmin, filters.created_by, filters.company_name, filters.region, filters.date_from, filters.date_to]);

  useEffect(() => {
    const loadUsers = async () => {
      if (!isAdmin) {
        setUsers([]);
        return;
      }

      try {
        const res = await authStore.fetchWithAuth('/api/auth/users/');
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(extractErrorMessage(data, 'Failed to load users.'));
        setUsers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if ((err.message || '').includes('Session expired')) {
          setForceLogin(true);
        }
      }
    };

    void loadUsers();
  }, [isAdmin]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const latestEntry = entries[0] || null;
  const uniqueLocations = new Set(entries.map((entry) => entry.location.trim().toLowerCase()).filter(Boolean)).size;
  const activeFilterCount = [filters.created_by, filters.company_name, filters.region, filters.date_from, filters.date_to].filter(Boolean).length;

  const submitWishlist = async (forceCreate = false) => {
    const payload = {
      company_name: form.company_name.trim(),
      location: form.location.trim(),
      force_create: forceCreate,
    };

    const res = await authStore.fetchWithAuth(WISHLIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);

    if (res.status === 409 && data?.requires_confirmation) {
      const latestDuplicate = Array.isArray(data.duplicates) ? data.duplicates[0] : null;
      const duplicateMessage = latestDuplicate
        ? `"${payload.company_name}" in "${payload.location}" was already added by ${getDisplayUserName(latestDuplicate)} on ${formatDate(latestDuplicate.created_at)}. Do you want to create it again?`
        : `"${payload.company_name}" in "${payload.location}" already exists in the wishlist. Do you want to create it again?`;

      const shouldCreateAgain = window.confirm(duplicateMessage);
      if (!shouldCreateAgain) {
        return { cancelled: true };
      }

      return submitWishlist(true);
    }

    if (!res.ok) {
      throw new Error(extractErrorMessage(data, 'Failed to save wishlist entry.'));
    }

    return { data, payload };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const result = await submitWishlist(false);
      if (result?.cancelled) {
        setSuccess('Creation cancelled. No duplicate wishlist entry was added.');
        return;
      }

      setSuccess(`Wishlist saved for "${result?.data?.company_name || result?.payload?.company_name || form.company_name.trim()}".`);
      setForm({ company_name: '', location: '' });
      await loadEntries();
    } catch (err: any) {
      if ((err.message || '').includes('Session expired')) {
        setForceLogin(true);
      }
      setError(err.message || 'Failed to save wishlist entry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-y-auto px-6 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ background: 'linear-gradient(145deg,#fff8fb 0%,#fff4f0 42%,#fefcf6 100%)' }}
    >
      <div className="mb-6 px-1">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-[0.16em]"
              style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }}
            >
              <Sparkles size={12} />
              Priority Prospect Tracker
            </div>
            <h1 className="text-[34px] font-black text-slate-900 leading-tight tracking-tight mt-3">
              Potential Targetted Customer
            </h1>
            <p className="text-[14px] text-slate-500 mt-2 max-w-3xl font-medium">
              Capture companies you want to pursue next. Add the company name and location, and keep the team aligned on high-interest opportunities.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {[
              { label: isAdmin ? 'All Wishes' : 'My Wishes', value: entries.length },
              { label: 'Locations', value: uniqueLocations },
              { label: 'Latest Add', value: latestEntry ? formatDate(latestEntry.created_at) : 'Today' },
            ].map((item) => (
              <div
                key={item.label}
                className="px-4 py-3 rounded-2xl min-w-[120px] bg-white"
                style={{ border: '1px solid #fecdd3', boxShadow: '0 8px 22px rgba(190,24,93,0.06)' }}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-400">{item.label}</p>
                <p className="text-[22px] font-black text-slate-800 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="rounded-[26px] p-5 mt-6"
        style={{ background: 'linear-gradient(145deg,#fff7f9,#fff1f2)', border: '1px solid #fecdd3', boxShadow: '0 10px 26px rgba(190,24,93,0.08)' }}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-rose-100 flex items-center justify-center">
              <Filter size={16} className="text-rose-500" />
            </div>
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-rose-500">Filters</p>
              <p className="text-[14px] font-bold text-slate-700 mt-1">
                {isAdmin ? 'Filter all users by PIC, company, region, and date' : 'Filter your wishlist by company, region, and date'}
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-full text-[11px] font-black text-rose-700 bg-white border border-rose-100">
            {activeFilterCount} active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {isAdmin ? (
            <div>
              <label className={labelCls}>PIC / User</label>
              <div className="relative">
                <select
                  value={filters.created_by}
                  onChange={(e) => handleFilterChange('created_by', e.target.value)}
                  className={`${inputCls} appearance-none pr-10`}
                >
                  <option value="">All Users</option>
                  {users
                    .filter((user) => user.id !== currentUser?.id)
                    .map((user) => (
                    <option key={user.id} value={String(user.id)}>
                      {user.first_name || user.last_name
                        ? `${user.first_name} ${user.last_name}`.trim()
                        : user.username}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          ) : (
            <div className="rounded-xl px-4 py-3 bg-white border border-rose-100 flex items-center">
              <p className="text-[13px] font-semibold text-slate-600">
                Your login only shows your own wishlist records.
              </p>
            </div>
          )}

          <div>
            <label className={labelCls}>Company Filter</label>
            <input
              className={inputCls}
              placeholder="Search by company name"
              value={filters.company_name}
              onChange={(e) => handleFilterChange('company_name', e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Region Filter</label>
            <input
              className={inputCls}
              placeholder="Search by region or area"
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Date From</label>
            <input
              type="date"
              className={inputCls}
              value={filters.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Date To</label>
            <input
              type="date"
              className={inputCls}
              value={filters.date_to}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setFilters({ created_by: '', company_name: '', region: '', date_from: '', date_to: '' })}
            className="px-4 py-2 rounded-xl text-[12px] font-black text-rose-700 bg-white border border-rose-100 hover:bg-rose-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)] gap-6 mt-6 items-start">
        <aside className="space-y-4">
          <div
            className="rounded-[26px] p-5 text-white"
            style={{ background: 'linear-gradient(145deg,#881337,#be123c)', boxShadow: '0 12px 30px rgba(136,19,55,0.24)' }}
          >
            <div className="w-11 h-11 rounded-2xl bg-white/12 border border-white/15 flex items-center justify-center mb-4">
              <Plus size={18} />
            </div>
            <p className="text-[12px] font-black uppercase tracking-[0.16em] text-rose-100/80">Capture Fast</p>
            <h2 className="text-[22px] font-black mt-2 leading-tight">A focused form for future target companies</h2>
            <p className="text-[13px] text-rose-100/85 mt-3 font-medium leading-6">
              The layout is intentionally simple so your team can log new opportunities in seconds without navigating a larger CRM workflow.
            </p>
          </div>

          <div
            className="bg-white rounded-[24px] p-5 border"
            style={{ borderColor: '#fecdd3', boxShadow: '0 4px 18px rgba(190,24,93,0.08)' }}
          >
            <p className="text-[12px] font-black uppercase tracking-[0.16em] text-slate-400">Wishlist Inspiration</p>
            <div className="space-y-3 mt-4">
              {[
                'Add companies your team would be excited to win next and turn ambition into a visible target list.',
                'Use location to spotlight dream accounts by city, industrial zone, plant, or regional market.',
                'Build a beautiful pipeline of future possibilities your team can revisit, prioritize, and pursue together.',
              ].map((rule, index) => (
                <div key={rule} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-[12px] font-black text-rose-700 shrink-0"
                    style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}
                  >
                    {index + 1}
                  </div>
                  <p className="text-[13px] text-slate-600 font-medium leading-6">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section
          className="bg-white rounded-[30px] overflow-hidden"
          style={{ border: '1.5px solid #fecdd3', boxShadow: '0 18px 50px rgba(15,23,42,0.08)' }}
        >
          <div className="px-7 py-6 border-b border-slate-100 bg-[linear-gradient(135deg,#ffffff,#fff7ed,#fff1f2)]">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#e11d48,#fb7185)', boxShadow: '0 8px 18px rgba(225,29,72,0.18)' }}
              >
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.16em] text-rose-600">Wishlist Form</p>
                <h2 className="text-[22px] font-black text-slate-800 mt-1">Add a company to the wishlist</h2>
                <p className="text-[13px] text-slate-500 font-medium mt-1">
                  {isAdmin
                    ? 'Admins can review all wishlist records, while each user still saves entries under their own login.'
                    : 'Your wishlist is private to your login. Fill in the company name and location, then save it directly to the database.'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-7 space-y-6">
            {error && (
              <div
                className="flex items-center gap-3 text-[13px] font-semibold px-4 py-3.5 rounded-xl"
                style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', color: '#be123c' }}
              >
                <AlertTriangle size={16} className="shrink-0 text-red-500" /> {error}
              </div>
            )}

            {success && (
              <div
                className="flex items-center gap-3 text-[13px] font-semibold px-4 py-3.5 rounded-xl"
                style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#166534' }}
              >
                <CheckCircle2 size={16} className="shrink-0 text-emerald-500" /> {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Company Name</label>
                <div className="relative group">
                  <Building2
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-200 group-focus-within:text-rose-500"
                  />
                  <input
                    className={`${inputCls} pl-10`}
                    placeholder="Enter company name"
                    value={form.company_name}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Location</label>
                <div className="relative group">
                  <MapPin
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-200 group-focus-within:text-rose-500"
                  />
                  <input
                    className={`${inputCls} pl-10`}
                    placeholder="City, office, plant, or region"
                    value={form.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div
              className="rounded-[26px] p-5"
              style={{ background: 'linear-gradient(145deg,#4c0519,#be185d)', boxShadow: '0 10px 28px rgba(190,24,93,0.2)' }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.16em] text-rose-100/80">Ready To Save</p>
                  <p className="text-[18px] font-black text-white mt-1">Send this company into the wishlist database</p>
                </div>
                <span
                  className="px-3 py-1.5 rounded-full text-[11px] font-black"
                  style={{ background: 'rgba(255,255,255,0.12)', color: '#fff1f2', border: '1px solid rgba(255,255,255,0.16)' }}
                >
                  <Heart size={12} className="inline mr-1" />
                  Team visible
                </span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-[14px] font-black text-rose-900 bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 4px 16px rgba(255,255,255,0.18)' }}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {submitting ? 'Saving Wishlist...' : 'Save Wishlist Entry'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.16em] text-slate-400">Saved Entries</p>
                  <h3 className="text-[20px] font-black text-slate-800 mt-1">
                    {isAdmin ? 'All wishlist companies' : 'My wishlist companies'}
                  </h3>
                </div>
                {!loading && (
                  <div className="px-3 py-2 rounded-full text-[11px] font-black text-rose-700 bg-rose-50 border border-rose-100">
                    {entries.length} total
                  </div>
                )}
              </div>

              {loading ? (
                <div
                  className="rounded-[24px] px-5 py-5 flex items-center gap-3 text-slate-500"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                >
                  <Loader2 size={18} className="animate-spin text-rose-500" />
                  <span className="text-[13px] font-semibold">Loading saved wishlist entries...</span>
                </div>
              ) : entries.length === 0 ? (
                <div
                  className="rounded-[24px] px-5 py-6"
                  style={{ background: '#fffafc', border: '1.5px dashed #fbcfe8' }}
                >
                  <p className="text-[15px] font-black text-slate-700">No wishlist entries yet.</p>
                  <p className="text-[13px] text-slate-500 font-medium mt-2">
                    {isAdmin
                      ? 'No wishlist records match the current filters.'
                      : 'Use the form above to create your first company wishlist record.'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-[24px] p-5"
                      style={{ background: 'linear-gradient(145deg,#ffffff,#fff7f9)', border: '1px solid #fbcfe8', boxShadow: '0 6px 18px rgba(225,29,72,0.05)' }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[18px] font-black text-slate-800 leading-tight">{entry.company_name}</p>
                          <div className="flex items-center gap-2 text-slate-500 mt-3">
                            <MapPin size={14} className="text-rose-500" />
                            <span className="text-[13px] font-semibold">{entry.location}</span>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                          <Heart size={16} className="text-rose-500" />
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-rose-100 flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Saved By</p>
                          <p className="text-[13px] font-bold text-slate-700 mt-1">
                            {entry.created_by_info?.name || entry.created_by_info?.username || 'Unknown user'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Saved On</p>
                          <p className="text-[13px] font-bold text-slate-700 mt-1">{formatDate(entry.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
