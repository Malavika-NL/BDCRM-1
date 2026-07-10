import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Globe2,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { authStore } from '../Utils/auth';
import type { AccountTargetCompany } from '../Utils/types';

const ACCOUNT_TARGETING_URL = '/api/account-targeting/';

const labelCls = 'block text-[12px] font-black text-slate-500 uppercase tracking-[0.16em] mb-2';
const inputCls =
  'w-full px-3.5 py-3 text-[14px] text-slate-800 bg-slate-50 border border-slate-200 rounded-xl ' +
  'placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-sky-400 ' +
  'focus:ring-4 focus:ring-sky-500/10 transition-all duration-200';

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

const getCreatorName = (company: AccountTargetCompany) =>
  company.created_by_info?.name ||
  company.created_by_info?.username ||
  company.created_by_info?.email ||
  'Unknown owner';

const getCreatorRef = (company: AccountTargetCompany) =>
  company.created_by_info?.email ||
  company.created_by_info?.username ||
  'No user reference';

const IconField = ({
  icon: Icon,
  value,
  placeholder,
  onChange,
  list,
  required,
}: {
  icon: any;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  list?: string;
  required?: boolean;
}) => (
  <div className="relative group">
    <Icon
      size={14}
      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-200 group-focus-within:text-sky-500"
    />
    <input
      list={list}
      className={`${inputCls} pl-10`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  </div>
);

export const AccountTargetingPage: React.FC = () => {
  const currentUser = useMemo(() => authStore.getUser(), []);
  const [forceLogin, setForceLogin] = useState(false);
  const [companies, setCompanies] = useState<AccountTargetCompany[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    company_name: '',
    pic_name: '',
    location: '',
    region: '',
    phone_number: '',
  });

  if (forceLogin || !authStore.getToken() || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const loadCompanies = async () => {
    setLoadingCompanies(true);
    setError('');
    try {
      const res = await authStore.fetchWithAuth(ACCOUNT_TARGETING_URL);
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(extractErrorMessage(data, 'Failed to load account targets.'));
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if ((err.message || '').includes('Session expired')) {
        setForceLogin(true);
      }
      setCompanies([]);
      setError(err.message || 'Failed to load account targets.');
    } finally {
      setLoadingCompanies(false);
    }
  };

  useEffect(() => {
    void loadCompanies();
  }, []);

  const exactCompanyMatch = useMemo(() => {
    const normalized = form.company_name.trim().toLowerCase();
    if (!normalized) return null;
    return companies.find((company) => company.name.trim().toLowerCase() === normalized) || null;
  }, [companies, form.company_name]);

  const totalPics = useMemo(
    () => companies.reduce((sum, company) => sum + company.total_pics, 0),
    [companies]
  );

  const currentUserOwnedPics = useMemo(
    () =>
      companies.reduce(
        (sum, company) =>
          sum +
          company.pics.filter((pic) => pic.created_by_info?.id === currentUser?.id).length,
        0
      ),
    [companies, currentUser?.id]
  );

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await authStore.fetchWithAuth(ACCOUNT_TARGETING_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          company_name: form.company_name.trim(),
          pic_name: form.pic_name.trim(),
          location: form.location.trim(),
          region: form.region.trim(),
          phone_number: form.phone_number.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(extractErrorMessage(data, 'Failed to register company target.'));

      setSuccess(`Registration saved for "${data?.name || form.company_name}".`);
      setForm({
        company_name: '',
        pic_name: '',
        location: '',
        region: '',
        phone_number: '',
      });
      await loadCompanies();
    } catch (err: any) {
      if ((err.message || '').includes('Session expired')) {
        setForceLogin(true);
      }
      setError(err.message || 'Failed to register company target.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-y-auto px-6 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ background: 'linear-gradient(145deg,#f8fbff 0%,#eef7ff 48%,#f7fcfb 100%)' }}
    >
      <div
        className="rounded-[30px] overflow-hidden relative"
        style={{
          background: 'linear-gradient(125deg,#082f49 0%,#0f766e 42%,#2563eb 100%)',
          boxShadow: '0 16px 48px -6px rgba(14,116,144,0.38), 0 2px 10px rgba(0,0,0,0.12)',
        }}
      >
        <div className="px-8 py-8 flex items-center gap-5 flex-wrap">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.24)' }}
          >
            <Building2 className="text-white" size={28} />
          </div>

          <div className="flex-1 min-w-0">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-[0.16em]"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#d7fbff', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <Sparkles size={12} />
              Shared Prospect Registry
            </div>
            <h1 className="text-[30px] font-black text-white leading-tight tracking-tight mt-3">Account Targetting</h1>
            <p className="text-[14px] text-cyan-50/90 mt-2 max-w-3xl font-medium">
              Register one company once, add PICs under it, and help the full team see who already owns the account before the next call happens.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {[
              { label: 'Companies', value: companies.length },
              { label: 'PIC Records', value: totalPics },
              { label: 'My PICs', value: currentUserOwnedPics },
            ].map((item) => (
              <div
                key={item.label}
                className="px-4 py-3 rounded-2xl min-w-[120px]"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)' }}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/80">{item.label}</p>
                <p className="text-[24px] font-black text-white mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,320px)_minmax(0,760px)] gap-6 mt-6 items-start">
        <aside className="space-y-4">
          <div
            className="rounded-[26px] p-5 text-white"
            style={{ background: 'linear-gradient(145deg,#0f172a,#1d4ed8)', boxShadow: '0 12px 30px rgba(15,23,42,0.16)' }}
          >
            <div className="w-11 h-11 rounded-2xl bg-white/12 border border-white/15 flex items-center justify-center mb-4">
              <ShieldCheck size={18} />
            </div>
            <p className="text-[12px] font-black uppercase tracking-[0.16em] text-blue-100/80">Conflict Control</p>
            <h2 className="text-[22px] font-black mt-2 leading-tight">One clean account form for the full team</h2>
            <p className="text-[13px] text-blue-100/85 mt-3 font-medium leading-6">
              This screen now focuses only on registration. The company explorer has been removed so users can finish entries faster and with less confusion.
            </p>
          </div>

          <div
            className="bg-white rounded-[24px] p-5 border"
            style={{ borderColor: '#dbeafe', boxShadow: '0 4px 18px rgba(14,116,144,0.07)' }}
          >
            <p className="text-[12px] font-black uppercase tracking-[0.16em] text-slate-400">Quick Rules</p>
            <div className="space-y-3 mt-4">
              {[
                'A company should be created only once.',
                'Multiple PICs can be added under the same company.',
                'If a company already exists, the owner details appear instantly.',
              ].map((rule, index) => (
                <div key={rule} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-[12px] font-black text-sky-700 shrink-0"
                    style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
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
          style={{ border: '1.5px solid #dbeafe', boxShadow: '0 18px 50px rgba(15,23,42,0.08)' }}
        >
          <div className="px-7 py-6 border-b border-slate-100 bg-[linear-gradient(135deg,#ffffff,#f8fbff,#f0fdfa)]">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#0ea5e9,#0f766e)', boxShadow: '0 8px 18px rgba(14,116,144,0.18)' }}
              >
                <BadgeCheck size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.16em] text-sky-600">Registration Form</p>
                <h2 className="text-[22px] font-black text-slate-800 mt-1">Create or extend an account record</h2>
                <p className="text-[13px] text-slate-500 font-medium mt-1">
                  A focused form layout with duplicate detection and ownership visibility.
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
              <div className="md:col-span-2 rounded-[24px] p-5" style={{ background: 'linear-gradient(145deg,#f8fbff,#f0fdfa)', border: '1px solid #dbeafe' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)' }}
                  >
                    <Building2 size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-slate-800">Company Details</p>
                    <p className="text-[11px] text-slate-400 font-medium">Start with the company so duplicate registration can be detected immediately.</p>
                  </div>
                </div>

                <label className={labelCls}>Company Name</label>
                <IconField
                  icon={Building2}
                  list="account-target-company-list"
                  value={form.company_name}
                  placeholder="Start typing a company name"
                  onChange={(value) => handleChange('company_name', value)}
                  required
                />
                <datalist id="account-target-company-list">
                  {companies.map((company) => (
                    <option key={company.id} value={company.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className={labelCls}>PIC Name</label>
                <IconField
                  icon={User}
                  value={form.pic_name}
                  placeholder="Primary contact person"
                  onChange={(value) => handleChange('pic_name', value)}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>Phone Number</label>
                <IconField
                  icon={Phone}
                  value={form.phone_number}
                  placeholder="+91..."
                  onChange={(value) => handleChange('phone_number', value)}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>Location</label>
                <IconField
                  icon={MapPin}
                  value={form.location}
                  placeholder="City / plant / office"
                  onChange={(value) => handleChange('location', value)}
                />
              </div>

              <div>
                <label className={labelCls}>Region</label>
                <IconField
                  icon={Globe2}
                  value={form.region}
                  placeholder="North / South / APAC"
                  onChange={(value) => handleChange('region', value)}
                />
              </div>
            </div>

            {loadingCompanies ? (
              <div
                className="rounded-[24px] px-5 py-5 flex items-center gap-3 text-slate-500"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              >
                <Loader2 size={18} className="animate-spin text-sky-500" />
                <span className="text-[13px] font-semibold">Checking existing companies...</span>
              </div>
            ) : exactCompanyMatch ? (
              <div
                className="rounded-[24px] px-5 py-5"
                style={{ background: 'linear-gradient(145deg,#eff6ff,#f0fdfa)', border: '1.5px solid #bfdbfe' }}
              >
                <div className="flex items-center gap-2 text-sky-700">
                  <ShieldCheck size={16} />
                  <p className="text-[12px] font-black uppercase tracking-[0.16em]">Existing Company Matched</p>
                </div>
                <p className="text-[18px] text-slate-800 font-black mt-3">{exactCompanyMatch.name}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="rounded-xl px-4 py-3" style={{ background: '#ffffffcc', border: '1px solid #dbeafe' }}>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Location</p>
                    <p className="text-[13px] font-bold text-slate-700 mt-1">{exactCompanyMatch.location || 'Not added yet'}</p>
                  </div>
                  <div className="rounded-xl px-4 py-3" style={{ background: '#ffffffcc', border: '1px solid #dbeafe' }}>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Region</p>
                    <p className="text-[13px] font-bold text-slate-700 mt-1">{exactCompanyMatch.region || 'Not added yet'}</p>
                  </div>
                  <div className="rounded-xl px-4 py-3" style={{ background: '#ffffffcc', border: '1px solid #dbeafe' }}>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Created By</p>
                    <p className="text-[13px] font-bold text-slate-700 mt-1">{getCreatorName(exactCompanyMatch)}</p>
                  </div>
                  <div className="rounded-xl px-4 py-3" style={{ background: '#ffffffcc', border: '1px solid #dbeafe' }}>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">User Ref</p>
                    <p className="text-[13px] font-bold text-slate-700 mt-1 truncate">{getCreatorRef(exactCompanyMatch)}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl px-4 py-3 bg-white/80 border border-sky-100">
                  <p className="text-[13px] text-slate-600 font-medium">
                    This company is already registered by <span className="font-black text-slate-800">{getCreatorName(exactCompanyMatch)}</span>. You can still add another PIC under the same company without creating a duplicate company record.
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="rounded-[24px] px-5 py-5"
                style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1' }}
              >
                <p className="text-[12px] font-black uppercase tracking-[0.16em] text-slate-400">Duplicate Protection</p>
                <p className="text-[13px] text-slate-500 font-medium mt-2">
                  If the company already exists, the creator and company details will appear here before submission.
                </p>
              </div>
            )}

            <div
              className="rounded-[26px] p-5"
              style={{ background: 'linear-gradient(145deg,#082f49,#0f766e)', boxShadow: '0 10px 28px rgba(14,116,144,0.2)' }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.16em] text-cyan-100/80">Ready To Save</p>
                  <p className="text-[18px] font-black text-white mt-1">Register this account cleanly for the team</p>
                </div>
                <span
                  className="px-3 py-1.5 rounded-full text-[11px] font-black"
                  style={{ background: 'rgba(255,255,255,0.12)', color: '#ecfeff', border: '1px solid rgba(255,255,255,0.16)' }}
                >
                  <Users size={12} className="inline mr-1" />
                  Shared visibility
                </span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-[14px] font-black text-sky-900 bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 4px 16px rgba(255,255,255,0.18)' }}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {submitting ? 'Saving Registration...' : 'Save Registration'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
