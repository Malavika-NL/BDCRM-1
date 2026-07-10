import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronUp,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { authStore } from '../Utils/auth';
import type { AccountTargetOwnershipSummaryItem } from '../Utils/types';

const OWNERSHIP_SUMMARY_URL = '/api/account-targeting/ownership-summary/';

type CompanyOwnerRow = {
  key: string;
  companyName: string;
  location?: string;
  region?: string;
  totalPics: number;
  ownerName: string;
  ownerRef: string;
  pics: Array<{
    id: number;
    pic_name: string;
    phone_number: string;
    created_at: string;
    created_by_info?: {
      id: number;
      name: string;
      username?: string;
      email?: string;
    } | null;
  }>;
};

export const AccountTargetingOwnersPage: React.FC = () => {
  const currentUser = useMemo(() => authStore.getUser(), []);
  const [forceLogin, setForceLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [summary, setSummary] = useState<AccountTargetOwnershipSummaryItem[]>([]);
  const [error, setError] = useState('');
  const [openCompanies, setOpenCompanies] = useState<Record<string, boolean>>({});

  if (forceLogin || !authStore.getToken() || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await authStore.fetchWithAuth(OWNERSHIP_SUMMARY_URL);
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error((data && (data.detail || data.message)) || 'Failed to load ownership summary.');
        }
        setSummary(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if ((err.message || '').includes('Session expired')) {
          setForceLogin(true);
        }
        setSummary([]);
        setError(err.message || 'Failed to load ownership summary.');
      } finally {
        setLoading(false);
      }
    };

    void loadSummary();
  }, []);

  const companyRows = useMemo<CompanyOwnerRow[]>(
    () =>
      summary
        .flatMap((item) =>
          item.companies.map((company) => ({
            key: `${company.id}-${item.user.id ?? item.user.username ?? item.user.email ?? item.user.name}`,
            companyName: company.name,
            location: company.location,
            region: company.region,
            totalPics: company.total_pics,
            ownerName: item.user.name,
            ownerRef: item.user.email || item.user.username || 'No user reference',
            pics: company.pics || [],
          }))
        )
        .sort((a, b) => a.companyName.localeCompare(b.companyName)),
    [summary]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return companyRows;
    return companyRows.filter((item) =>
      `${item.companyName} ${item.ownerName} ${item.ownerRef} ${item.location || ''} ${item.region || ''}`
        .toLowerCase()
        .includes(term)
    );
  }, [companyRows, search]);

  const totalCompanies = companyRows.length;
  const totalPics = useMemo(
    () => summary.reduce((sum, item) => sum + item.total_pics, 0),
    [summary]
  );

  const toggleCompany = (key: string) => {
    setOpenCompanies((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'linear-gradient(145deg,#f8fbff 0%,#eef7ff 48%,#f7fcfb 100%)' }}>
      <div className="shrink-0 px-6 pt-5">
        <div
          className="rounded-[28px] overflow-hidden relative"
          style={{
            background: 'linear-gradient(125deg,#172554 0%,#1d4ed8 52%,#0891b2 100%)',
            boxShadow: '0 16px 48px -6px rgba(29,78,216,0.35), 0 2px 10px rgba(0,0,0,0.12)',
          }}
        >
          <div className="px-8 py-7 flex items-center gap-5 flex-wrap">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.24)' }}
            >
              <Users className="text-white" size={28} />
            </div>

            <div className="flex-1 min-w-0">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-[0.16em]"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#dbeafe', border: '1px solid rgba(255,255,255,0.16)' }}
              >
                <ShieldCheck size={12} />
                Company-wise Ownership
              </div>
              <h1 className="text-[30px] font-black text-white leading-tight tracking-tight mt-3">Company Owner Summary</h1>
              <p className="text-[14px] text-blue-50/90 mt-2 max-w-3xl font-medium">
                Company name comes first, and the creator is shown on the side so every user can quickly see who already owns the account.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: 'Companies', value: totalCompanies },
                { label: 'Owners', value: summary.length },
                { label: 'PIC Records', value: totalPics },
              ].map((item) => (
                <div
                  key={item.label}
                  className="px-4 py-3 rounded-2xl min-w-[120px]"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)' }}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-100/80">{item.label}</p>
                  <p className="text-[24px] font-black text-white mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-6 pt-4">
        <div
          className="bg-white rounded-2xl border border-sky-100 px-5 py-4 flex items-center justify-between gap-4 flex-wrap"
          style={{ boxShadow: '0 4px 18px rgba(14,116,144,0.06)' }}
        >
          <div>
            <p className="text-[16px] font-black text-slate-800">Company List</p>
            <p className="text-[12px] text-slate-400 font-medium mt-1">Search by company, owner, location, or region</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company / owner"
              className="w-full pl-10 pr-4 py-3 text-[13px] bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-56 gap-4 text-slate-400">
            <Loader2 size={24} className="animate-spin text-sky-500" />
            <span className="text-[15px] font-semibold">Loading company ownership summary...</span>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-rose-200 px-5 py-4 text-rose-700 font-semibold">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 gap-3">
            <Users size={28} className="text-slate-300" />
            <p className="text-[16px] font-semibold text-slate-400">No company matches your search</p>
          </div>
        ) : (
          <div
            className="bg-white rounded-[26px] overflow-hidden border"
            style={{ borderColor: '#dbeafe', boxShadow: '0 4px 18px rgba(15,23,42,0.05)' }}
          >
            <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(180px,0.8fr)] gap-4 px-5 py-4 border-b border-slate-100 bg-slate-50/80">
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-slate-500">Company</p>
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-slate-500">Created By</p>
            </div>

            <div className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <article
                  key={item.key}
                  className="px-5 py-5 hover:bg-sky-50/40 transition-colors duration-200"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(220px,0.8fr)] gap-4">
                    <div className="min-w-0">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                          style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1px solid #bfdbfe' }}
                        >
                          <Building2 size={18} className="text-sky-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="min-w-0">
                              <h3 className="text-[17px] font-black text-slate-800 truncate">{item.companyName}</h3>
                              <div className="flex items-center gap-2 flex-wrap mt-2">
                                <span
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black"
                                  style={{ background: '#ffffff', color: '#475569', border: '1px solid #e2e8f0' }}
                                >
                                  <MapPin size={11} />
                                  {item.location || 'Location pending'}
                                </span>
                                <span
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black"
                                  style={{ background: '#ffffff', color: '#0f766e', border: '1px solid #ccfbf1' }}
                                >
                                  <BriefcaseBusiness size={11} />
                                  {item.region || 'Region pending'}
                                </span>
                                <span
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black"
                                  style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
                                >
                                  {item.totalPics} PICs
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleCompany(item.key)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-black text-sky-700 bg-sky-50 border border-sky-100 hover:bg-sky-100 transition-colors duration-200"
                            >
                              {openCompanies[item.key] ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                              {openCompanies[item.key] ? 'Hide PICs' : 'Show PICs'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center lg:justify-end">
                      <div
                        className="w-full lg:max-w-[240px] rounded-2xl px-4 py-3"
                        style={{ background: 'linear-gradient(145deg,#f8fbff,#f0fdfa)', border: '1px solid #dbeafe' }}
                      >
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Creator</p>
                        <p className="text-[15px] font-black text-slate-800 mt-1 truncate">{item.ownerName}</p>
                        <p className="text-[12px] text-slate-500 font-medium mt-1 truncate">{item.ownerRef}</p>
                      </div>
                    </div>
                  </div>

                  {openCompanies[item.key] && (
                    <div
                      className="mt-4 ml-0 lg:ml-14 rounded-[22px] px-4 py-4"
                      style={{ background: '#f8fbff', border: '1px solid #dbeafe' }}
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-slate-500">PIC List</p>
                        <p className="text-[12px] text-slate-400 font-medium">
                          Clicked company: {item.companyName}
                        </p>
                      </div>

                      {item.pics.length === 0 ? (
                        <p className="text-[13px] text-slate-500 font-medium">No PICs added for this company yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {item.pics.map((pic) => (
                            <div
                              key={pic.id}
                              className="rounded-2xl px-4 py-4 bg-white border border-slate-200"
                            >
                              <p className="text-[14px] font-black text-slate-800">{pic.pic_name}</p>
                              <p className="text-[12px] text-slate-500 font-medium mt-1">{pic.phone_number}</p>
                              <p className="text-[11px] text-slate-400 font-medium mt-2">
                                Added by {pic.created_by_info?.name || item.ownerName}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
