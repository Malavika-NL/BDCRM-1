// import React, { useMemo, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { authStore, type UserRole } from '../Utils/auth';

// const API_URL = 'http://127.0.0.1:8000/api/auth/create-user/';

// export const UserCreationPage: React.FC = () => {
//   const currentUser = useMemo(() => authStore.getUser(), []);
//   const token = authStore.getToken();
//   const [form, setForm] = useState({
//     username: '',
//     email: '',
//     first_name: '',
//     last_name: '',
//     password: '',
//     phone_number: '',
//     designation: '',
//     department: '',
//     address: '',
//     role: 'employee' as UserRole,
//     is_active: true,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   if (!token) return <Navigate to="/login" replace />;
//   if (currentUser?.role !== 'admin') return <Navigate to="/dashboard" replace />;

//   const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     try {
//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.detail || data.username?.[0] || 'Failed to create user.');
//       }

//       setSuccess(`User "${data.username}" created successfully.`);
//       setForm({
//         username: '',
//         email: '',
//         first_name: '',
//         last_name: '',
//         password: '',
//         phone_number: '',
//         designation: '',
//         department: '',
//         address: '',
//         role: 'employee',
//         is_active: true,
//       });
//     } catch (err: any) {
//       setError(err.message || 'Failed to create user.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8">
//         <h1 className="text-2xl font-bold text-slate-900">Create New User</h1>
//         <p className="text-slate-500 mt-1">Admin can create employee or admin accounts.</p>

//         {error && <div className="mt-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>}
//         {success && <div className="mt-4 p-3 rounded bg-green-50 text-green-700 border border-green-200">{success}</div>}

//         <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input className="border rounded-lg p-3" placeholder="Username" value={form.username} onChange={(e) => update('username', e.target.value)} required />
//           <input className="border rounded-lg p-3" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
//           <input className="border rounded-lg p-3" placeholder="First name" value={form.first_name} onChange={(e) => update('first_name', e.target.value)} />
//           <input className="border rounded-lg p-3" placeholder="Last name" value={form.last_name} onChange={(e) => update('last_name', e.target.value)} />
//           <input className="border rounded-lg p-3" placeholder="Phone number" value={form.phone_number} onChange={(e) => update('phone_number', e.target.value)} />
//           <input className="border rounded-lg p-3" placeholder="Designation" value={form.designation} onChange={(e) => update('designation', e.target.value)} />
//           <input className="border rounded-lg p-3" placeholder="Department" value={form.department} onChange={(e) => update('department', e.target.value)} />
//           <select className="border rounded-lg p-3" value={String(form.is_active)} onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.value === 'true' }))}>
//             <option value="true">Active</option>
//             <option value="false">Inactive</option>
//           </select>
//           <textarea className="border rounded-lg p-3 md:col-span-2 min-h-24" placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)} />
//           <input className="border rounded-lg p-3 md:col-span-2" type="password" placeholder="Password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
//           <select className="border rounded-lg p-3 md:col-span-2" value={form.role} onChange={(e) => update('role', e.target.value)}>
//             <option value="employee">Employee</option>
//             <option value="admin">Admin</option>
//           </select>
//           <button disabled={loading} className="md:col-span-2 bg-blue-600 text-white font-semibold rounded-lg p-3 hover:bg-blue-700 disabled:opacity-60">
//             {loading ? 'Creating user...' : 'Create User'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };


import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authStore, type UserRole } from '../Utils/auth';
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  MapPin,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronDown,
  KeyRound,
  UserCircle2,
  BadgeCheck,
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/api/auth/create-user/';

/* ── shared classes ── */
const labelCls = 'block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5';
const inputCls =
  'w-full px-3 py-2.5 text-[13px] text-slate-800 bg-slate-50 border border-slate-200 rounded-xl ' +
  'placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 ' +
  'focus:ring-4 focus:ring-indigo-500/10 transition-all';
const selectCls =
  'w-full px-3 py-2.5 text-[13px] text-slate-800 bg-slate-50 border border-slate-200 rounded-xl ' +
  'appearance-none focus:outline-none focus:bg-white focus:border-indigo-400 ' +
  'focus:ring-4 focus:ring-indigo-500/10 transition-all pr-8';

/* ── Section heading — WorkflowMonitor accent-bar style ── */
const SectionHeading = ({
  label,
  icon: Icon,
  colorTheme,
}: {
  label: string;
  icon: any;
  colorTheme: string;
}) => {
  const themes: Record<string, { bar: string; iconBg: string; badge: string }> = {
    indigo: {
      bar: 'bg-indigo-500',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-600',
      badge: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    violet: {
      bar: 'bg-violet-500',
      iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
      badge: 'bg-violet-50 text-violet-600 border-violet-100',
    },
    emerald: {
      bar: 'bg-emerald-500',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      badge: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
  };
  const t = themes[colorTheme] || themes.indigo;

  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-1 h-full self-stretch rounded-full ${t.bar} shrink-0`} />
      <div className={`p-2 rounded-xl ${t.iconBg} shadow-sm shrink-0`}>
        <Icon size={14} className="text-white" />
      </div>
      <h2 className="text-[13px] font-black text-slate-700 flex-1">{label}</h2>
    </div>
  );
};

/* ── Section block — ConfigCard card body style ── */
const SectionBlock = ({
  children,
  colorTheme = 'indigo',
}: {
  children: React.ReactNode;
  colorTheme?: string;
}) => {
  const topBars: Record<string, string> = {
    indigo: 'from-indigo-500 to-violet-500',
    violet: 'from-violet-500 to-purple-500',
    emerald: 'from-emerald-500 to-teal-400',
  };
  const bar = topBars[colorTheme] || topBars.indigo;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* top accent bar identical to ConfigCard */}
      <div className={`h-1 w-full bg-gradient-to-r ${bar} shrink-0`} />
      <div className="p-5">{children}</div>
    </div>
  );
};

/* ── Select wrapper ── */
const SelectField = ({
  className = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select className={`${selectCls} ${className}`} {...props} />
    <ChevronDown
      size={12}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
    />
  </div>
);

/* ── Input with icon ── */
const IconInput = ({
  icon: Icon,
  textarea,
  ...props
}: { icon: any; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className="relative">
    <Icon
      size={13}
      className={`absolute left-3 ${textarea ? 'top-3.5' : 'top-1/2 -translate-y-1/2'} text-slate-400 pointer-events-none`}
    />
    {textarea ? (
      <textarea className={`${inputCls} pl-9 resize-none`} {...(props as any)} />
    ) : (
      <input className={`${inputCls} pl-9`} {...(props as any)} />
    )}
  </div>
);

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════ */
export const UserCreationPage: React.FC = () => {
  const currentUser = useMemo(() => authStore.getUser(), []);
  const token = authStore.getToken();

  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone_number: '',
    designation: '',
    department: '',
    address: '',
    role: 'employee' as UserRole,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* ── all original functions untouched ── */
  if (!token) return <Navigate to="/login" replace />;
  if (currentUser?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.username?.[0] || 'Failed to create user.');
      }

      setSuccess(`User "${data.username}" created successfully.`);
      setForm({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        phone_number: '',
        designation: '',
        department: '',
        address: '',
        role: 'employee',
        is_active: true,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  /* ════════════════════════════ RENDER ════════════════════════════ */
  return (
    <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes floatBlob {
          0%,100% { transform: translateY(0px)   translateX(0px); }
          50%     { transform: translateY(-10px)  translateX(6px); }
        }
        .anim-blob   { animation: floatBlob 7s ease-in-out infinite; }
        .anim-fade-1 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
        .anim-fade-2 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
        .anim-fade-3 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
      `}</style>

      {/* ══════════════════════════════════════════════════
          BANNER — identical structure to WorkflowMonitor
      ══════════════════════════════════════════════════ */}
      <div
        className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden anim-fade-1"
        style={{
          background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
          boxShadow: '0 8px 32px -4px rgba(79,70,229,0.45)',
        }}
      >
        <div
          className="px-6 py-5 flex items-center gap-4 flex-wrap"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          }}
        >
          {/* icon block */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <UserPlus className="text-white" size={20} />
          </div>

          {/* text */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">
              Create New User
            </h1>
            <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
              Admin can create employee or admin accounts for platform access.
            </p>
          </div>

          {/* admin-only badge */}
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <ShieldCheck size={14} className="text-indigo-200" />
            <span className="text-[12px] font-black text-indigo-100">Admin Only</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SCROLLABLE BODY
      ══════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

        {/* decorative blobs — identical to WorkflowMonitor */}
        <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
        <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

        {/* section label */}
        <div className="flex items-center gap-3 anim-fade-2">
          <div className="w-1 h-4 bg-indigo-500 rounded-full" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            User Account Setup
          </p>
        </div>

        {/* ── alerts ── */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-3 rounded-xl anim-fade-2">
            <AlertTriangle size={14} className="shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] px-4 py-3 rounded-xl anim-fade-2">
            <CheckCircle2 size={14} className="shrink-0" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 anim-fade-3">

          {/* ── 1 · Account Credentials ── */}
          <SectionBlock colorTheme="indigo">
            <SectionHeading label="1. Account Credentials" icon={KeyRound} colorTheme="indigo" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className={labelCls}>
                  Username <span className="text-red-400 normal-case font-normal">*</span>
                </label>
                <IconInput
                  icon={User}
                  placeholder="e.g. john_doe"
                  value={form.username}
                  onChange={(e: any) => update('username', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <IconInput
                  icon={Mail}
                  type="email"
                  placeholder="john@company.com"
                  value={form.email}
                  onChange={(e: any) => update('email', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  Password <span className="text-red-400 normal-case font-normal">*</span>
                </label>
                <IconInput
                  icon={Lock}
                  type="password"
                  placeholder="Set a strong password"
                  value={form.password}
                  onChange={(e: any) => update('password', e.target.value)}
                  required
                />
              </div>
            </div>
          </SectionBlock>

          {/* ── 2 · Personal Details ── */}
          <SectionBlock colorTheme="violet">
            <SectionHeading label="2. Personal Details" icon={UserCircle2} colorTheme="violet" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className={labelCls}>First Name</label>
                <input
                  className={inputCls}
                  placeholder="John"
                  value={form.first_name}
                  onChange={(e) => update('first_name', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Last Name</label>
                <input
                  className={inputCls}
                  placeholder="Smith"
                  value={form.last_name}
                  onChange={(e) => update('last_name', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Phone Number</label>
                <IconInput
                  icon={Phone}
                  placeholder="+91 ..."
                  value={form.phone_number}
                  onChange={(e: any) => update('phone_number', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Designation</label>
                <IconInput
                  icon={Briefcase}
                  placeholder="Sales Manager"
                  value={form.designation}
                  onChange={(e: any) => update('designation', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Department</label>
                <IconInput
                  icon={Building2}
                  placeholder="Sales"
                  value={form.department}
                  onChange={(e: any) => update('department', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <SelectField
                  value={String(form.is_active)}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, is_active: e.target.value === 'true' }))
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </SelectField>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Address</label>
                <IconInput
                  icon={MapPin}
                  textarea
                  rows={3}
                  placeholder="Enter full address"
                  value={form.address}
                  onChange={(e: any) => update('address', e.target.value)}
                />
              </div>
            </div>
          </SectionBlock>

          {/* ── 3 · Role & Access ── */}
          <SectionBlock colorTheme="emerald">
            <SectionHeading label="3. Role & Access" icon={BadgeCheck} colorTheme="emerald" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['employee', 'admin'] as UserRole[]).map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer
                    transition-all select-none group ${
                      form.role === r
                        ? r === 'admin'
                          ? 'bg-violet-50 border-violet-300 text-violet-700 shadow-sm'
                          : 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={form.role === r}
                    onChange={(e) => update('role', e.target.value)}
                    className="accent-indigo-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-black capitalize">{r}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                      {r === 'admin'
                        ? 'Full access, can manage users'
                        : 'Standard pipeline access'}
                    </p>
                  </div>
                  {/* active indicator dot */}
                  {form.role === r && (
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        r === 'admin' ? 'bg-violet-500' : 'bg-indigo-500'
                      }`}
                    />
                  )}
                </label>
              ))}
            </div>
          </SectionBlock>

          {/* ── Submit ── */}
          <div className="flex items-center gap-3 pb-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2.5 text-[12px] font-black rounded-xl
                transition-all active:scale-95 shadow-sm ${
                  loading
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-indigo-500/30'
                }`}
            >
              {loading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <UserPlus size={13} />
              )}
              {loading ? 'Creating User…' : 'Create User'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};