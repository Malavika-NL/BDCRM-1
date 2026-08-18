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


// import React, { useMemo, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { authStore, type UserRole } from '../Utils/auth';
// import {
//   UserPlus,
//   User,
//   Mail,
//   Phone,
//   Briefcase,
//   Building2,
//   MapPin,
//   Lock,
//   ShieldCheck,
//   CheckCircle2,
//   AlertTriangle,
//   Loader2,
//   ChevronDown,
//   KeyRound,
//   UserCircle2,
//   BadgeCheck,
// } from 'lucide-react';

// const API_URL = 'http://127.0.0.1:8000/api/auth/create-user/';

// /* ── shared classes ── */
// const labelCls = 'block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5';
// const inputCls =
//   'w-full px-3 py-2.5 text-[13px] text-slate-800 bg-slate-50 border border-slate-200 rounded-xl ' +
//   'placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 ' +
//   'focus:ring-4 focus:ring-indigo-500/10 transition-all';
// const selectCls =
//   'w-full px-3 py-2.5 text-[13px] text-slate-800 bg-slate-50 border border-slate-200 rounded-xl ' +
//   'appearance-none focus:outline-none focus:bg-white focus:border-indigo-400 ' +
//   'focus:ring-4 focus:ring-indigo-500/10 transition-all pr-8';

// /* ── Section heading — WorkflowMonitor accent-bar style ── */
// const SectionHeading = ({
//   label,
//   icon: Icon,
//   colorTheme,
// }: {
//   label: string;
//   icon: any;
//   colorTheme: string;
// }) => {
//   const themes: Record<string, { bar: string; iconBg: string; badge: string }> = {
//     indigo: {
//       bar: 'bg-indigo-500',
//       iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-600',
//       badge: 'bg-indigo-50 text-indigo-600 border-indigo-100',
//     },
//     violet: {
//       bar: 'bg-violet-500',
//       iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
//       badge: 'bg-violet-50 text-violet-600 border-violet-100',
//     },
//     emerald: {
//       bar: 'bg-emerald-500',
//       iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
//       badge: 'bg-emerald-50 text-emerald-600 border-emerald-100',
//     },
//   };
//   const t = themes[colorTheme] || themes.indigo;

//   return (
//     <div className="flex items-center gap-3 mb-5">
//       <div className={`w-1 h-full self-stretch rounded-full ${t.bar} shrink-0`} />
//       <div className={`p-2 rounded-xl ${t.iconBg} shadow-sm shrink-0`}>
//         <Icon size={14} className="text-white" />
//       </div>
//       <h2 className="text-[13px] font-black text-slate-700 flex-1">{label}</h2>
//     </div>
//   );
// };

// /* ── Section block — ConfigCard card body style ── */
// const SectionBlock = ({
//   children,
//   colorTheme = 'indigo',
// }: {
//   children: React.ReactNode;
//   colorTheme?: string;
// }) => {
//   const topBars: Record<string, string> = {
//     indigo: 'from-indigo-500 to-violet-500',
//     violet: 'from-violet-500 to-purple-500',
//     emerald: 'from-emerald-500 to-teal-400',
//   };
//   const bar = topBars[colorTheme] || topBars.indigo;

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
//       {/* top accent bar identical to ConfigCard */}
//       <div className={`h-1 w-full bg-gradient-to-r ${bar} shrink-0`} />
//       <div className="p-5">{children}</div>
//     </div>
//   );
// };

// /* ── Select wrapper ── */
// const SelectField = ({
//   className = '',
//   ...props
// }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
//   <div className="relative">
//     <select className={`${selectCls} ${className}`} {...props} />
//     <ChevronDown
//       size={12}
//       className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//     />
//   </div>
// );

// /* ── Input with icon ── */
// const IconInput = ({
//   icon: Icon,
//   textarea,
//   ...props
// }: { icon: any; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement> &
//   React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
//   <div className="relative">
//     <Icon
//       size={13}
//       className={`absolute left-3 ${textarea ? 'top-3.5' : 'top-1/2 -translate-y-1/2'} text-slate-400 pointer-events-none`}
//     />
//     {textarea ? (
//       <textarea className={`${inputCls} pl-9 resize-none`} {...(props as any)} />
//     ) : (
//       <input className={`${inputCls} pl-9`} {...(props as any)} />
//     )}
//   </div>
// );

// /* ════════════════════════════════════════════════════════════
//    MAIN PAGE
// ════════════════════════════════════════════════════════════ */
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

//   /* ── all original functions untouched ── */
//   if (!token) return <Navigate to="/login" replace />;
//   if (currentUser?.role !== 'admin') return <Navigate to="/dashboard" replace />;

//   const update = (key: string, value: string) =>
//     setForm((prev) => ({ ...prev, [key]: value }));

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

//   /* ════════════════════════════ RENDER ════════════════════════════ */
//   return (
//     <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

//       <style>{`
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(14px) scale(0.99); }
//           to   { opacity: 1; transform: translateY(0)   scale(1);    }
//         }
//         @keyframes floatBlob {
//           0%,100% { transform: translateY(0px)   translateX(0px); }
//           50%     { transform: translateY(-10px)  translateX(6px); }
//         }
//         .anim-blob   { animation: floatBlob 7s ease-in-out infinite; }
//         .anim-fade-1 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
//         .anim-fade-2 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
//         .anim-fade-3 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
//       `}</style>

//       {/* ══════════════════════════════════════════════════
//           BANNER — identical structure to WorkflowMonitor
//       ══════════════════════════════════════════════════ */}
//       <div
//         className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden anim-fade-1"
//         style={{
//           background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
//           boxShadow: '0 8px 32px -4px rgba(79,70,229,0.45)',
//         }}
//       >
//         <div
//           className="px-6 py-5 flex items-center gap-4 flex-wrap"
//           style={{
//             backgroundImage:
//               'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
//           }}
//         >
//           {/* icon block */}
//           <div
//             className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
//             style={{
//               backgroundColor: 'rgba(255,255,255,0.15)',
//               backdropFilter: 'blur(4px)',
//               border: '1px solid rgba(255,255,255,0.2)',
//             }}
//           >
//             <UserPlus className="text-white" size={20} />
//           </div>

//           {/* text */}
//           <div className="flex-1 min-w-0">
//             <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">
//               Create New User
//             </h1>
//             <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
//               Admin can create employee or admin accounts for platform access.
//             </p>
//           </div>

//           {/* admin-only badge */}
//           <div
//             className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl shrink-0"
//             style={{
//               backgroundColor: 'rgba(255,255,255,0.12)',
//               border: '1px solid rgba(255,255,255,0.18)',
//             }}
//           >
//             <ShieldCheck size={14} className="text-indigo-200" />
//             <span className="text-[12px] font-black text-indigo-100">Admin Only</span>
//           </div>
//         </div>
//       </div>

//       {/* ══════════════════════════════════════════════════
//           SCROLLABLE BODY
//       ══════════════════════════════════════════════════ */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

//         {/* decorative blobs — identical to WorkflowMonitor */}
//         <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
//         <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

//         {/* section label */}
//         <div className="flex items-center gap-3 anim-fade-2">
//           <div className="w-1 h-4 bg-indigo-500 rounded-full" />
//           <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
//             User Account Setup
//           </p>
//         </div>

//         {/* ── alerts ── */}
//         {error && (
//           <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-3 rounded-xl anim-fade-2">
//             <AlertTriangle size={14} className="shrink-0" /> {error}
//           </div>
//         )}
//         {success && (
//           <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] px-4 py-3 rounded-xl anim-fade-2">
//             <CheckCircle2 size={14} className="shrink-0" /> {success}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4 anim-fade-3">

//           {/* ── 1 · Account Credentials ── */}
//           <SectionBlock colorTheme="indigo">
//             <SectionHeading label="1. Account Credentials" icon={KeyRound} colorTheme="indigo" />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
//               <div>
//                 <label className={labelCls}>
//                   Username <span className="text-red-400 normal-case font-normal">*</span>
//                 </label>
//                 <IconInput
//                   icon={User}
//                   placeholder="e.g. john_doe"
//                   value={form.username}
//                   onChange={(e: any) => update('username', e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className={labelCls}>Email</label>
//                 <IconInput
//                   icon={Mail}
//                   type="email"
//                   placeholder="john@company.com"
//                   value={form.email}
//                   onChange={(e: any) => update('email', e.target.value)}
//                 />
//               </div>
//               <div className="sm:col-span-2">
//                 <label className={labelCls}>
//                   Password <span className="text-red-400 normal-case font-normal">*</span>
//                 </label>
//                 <IconInput
//                   icon={Lock}
//                   type="password"
//                   placeholder="Set a strong password"
//                   value={form.password}
//                   onChange={(e: any) => update('password', e.target.value)}
//                   required
//                 />
//               </div>
//             </div>
//           </SectionBlock>

//           {/* ── 2 · Personal Details ── */}
//           <SectionBlock colorTheme="violet">
//             <SectionHeading label="2. Personal Details" icon={UserCircle2} colorTheme="violet" />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
//               <div>
//                 <label className={labelCls}>First Name</label>
//                 <input
//                   className={inputCls}
//                   placeholder="John"
//                   value={form.first_name}
//                   onChange={(e) => update('first_name', e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className={labelCls}>Last Name</label>
//                 <input
//                   className={inputCls}
//                   placeholder="Smith"
//                   value={form.last_name}
//                   onChange={(e) => update('last_name', e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className={labelCls}>Phone Number</label>
//                 <IconInput
//                   icon={Phone}
//                   placeholder="+91 ..."
//                   value={form.phone_number}
//                   onChange={(e: any) => update('phone_number', e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className={labelCls}>Designation</label>
//                 <IconInput
//                   icon={Briefcase}
//                   placeholder="Sales Manager"
//                   value={form.designation}
//                   onChange={(e: any) => update('designation', e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className={labelCls}>Department</label>
//                 <IconInput
//                   icon={Building2}
//                   placeholder="Sales"
//                   value={form.department}
//                   onChange={(e: any) => update('department', e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className={labelCls}>Status</label>
//                 <SelectField
//                   value={String(form.is_active)}
//                   onChange={(e) =>
//                     setForm((prev) => ({ ...prev, is_active: e.target.value === 'true' }))
//                   }
//                 >
//                   <option value="true">Active</option>
//                   <option value="false">Inactive</option>
//                 </SelectField>
//               </div>
//               <div className="sm:col-span-2">
//                 <label className={labelCls}>Address</label>
//                 <IconInput
//                   icon={MapPin}
//                   textarea
//                   rows={3}
//                   placeholder="Enter full address"
//                   value={form.address}
//                   onChange={(e: any) => update('address', e.target.value)}
//                 />
//               </div>
//             </div>
//           </SectionBlock>

//           {/* ── 3 · Role & Access ── */}
//           <SectionBlock colorTheme="emerald">
//             <SectionHeading label="3. Role & Access" icon={BadgeCheck} colorTheme="emerald" />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {(['employee', 'admin'] as UserRole[]).map((r) => (
//                 <label
//                   key={r}
//                   className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer
//                     transition-all select-none group ${
//                       form.role === r
//                         ? r === 'admin'
//                           ? 'bg-violet-50 border-violet-300 text-violet-700 shadow-sm'
//                           : 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
//                         : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 hover:shadow-sm'
//                     }`}
//                 >
//                   <input
//                     type="radio"
//                     name="role"
//                     value={r}
//                     checked={form.role === r}
//                     onChange={(e) => update('role', e.target.value)}
//                     className="accent-indigo-600"
//                   />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-[12px] font-black capitalize">{r}</p>
//                     <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
//                       {r === 'admin'
//                         ? 'Full access, can manage users'
//                         : 'Standard pipeline access'}
//                     </p>
//                   </div>
//                   {/* active indicator dot */}
//                   {form.role === r && (
//                     <span
//                       className={`w-2 h-2 rounded-full shrink-0 ${
//                         r === 'admin' ? 'bg-violet-500' : 'bg-indigo-500'
//                       }`}
//                     />
//                   )}
//                 </label>
//               ))}
//             </div>
//           </SectionBlock>

//           {/* ── Submit ── */}
//           <div className="flex items-center gap-3 pb-6">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`flex items-center gap-2 px-6 py-2.5 text-[12px] font-black rounded-xl
//                 transition-all active:scale-95 shadow-sm ${
//                   loading
//                     ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-indigo-500/30'
//                 }`}
//             >
//               {loading ? (
//                 <Loader2 size={13} className="animate-spin" />
//               ) : (
//                 <UserPlus size={13} />
//               )}
//               {loading ? 'Creating User…' : 'Create User'}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };


// import React, { useMemo, useState, useEffect } from 'react';
// import { Navigate } from 'react-router-dom';
// import { authStore, type UserRole } from '../Utils/auth';
// import {
//   UserPlus, User, Mail, Phone, Briefcase, Building2,
//   MapPin, Lock, ShieldCheck, CheckCircle2, AlertTriangle,
//   Loader2, ChevronDown, X, Search, Users, Shield,
//   UserCheck, Eye, EyeOff, Sparkles,
// } from 'lucide-react';

// const API_URL   = 'http://127.0.0.1:8000/api/auth/create-user/';
// const USERS_URL = 'http://127.0.0.1:8000/api/auth/users/';

// const labelCls = 'block text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1.5';
// const inputCls =
//   'w-full px-3 py-2.5 text-[14px] text-slate-800 bg-slate-50 border border-slate-200 rounded-xl ' +
//   'placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 ' +
//   'focus:ring-4 focus:ring-indigo-500/10 transition-all';

// /* ── Avatar ── */
// const AVATAR_COLORS = [
//   'from-blue-500 to-indigo-600',
//   'from-violet-500 to-purple-600',
//   'from-emerald-500 to-teal-600',
//   'from-pink-500 to-rose-600',
//   'from-amber-500 to-orange-500',
//   'from-cyan-500 to-blue-500',
//   'from-fuchsia-500 to-pink-600',
//   'from-green-500 to-emerald-600',
// ];
// const Avatar = ({ name, index }: { name: string; index: number }) => {
//   const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
//   return (
//     <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center text-white text-[13px] font-black shrink-0 shadow-sm`}>
//       {initials}
//     </div>
//   );
// };

// /* ── Role badge ── */
// const RoleBadge = ({ role }: { role: string }) =>
//   role === 'admin' ? (
//     <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-black bg-violet-100 text-violet-700 border border-violet-200">
//       <Shield size={11} /> Admin
//     </span>
//   ) : (
//     <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-black bg-blue-100 text-blue-700 border border-blue-200">
//       <User size={11} /> Employee
//     </span>
//   );

// /* ── Status badge ── */
// const StatusBadge = ({ active }: { active: boolean }) =>
//   active ? (
//     <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
//       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active
//     </span>
//   ) : (
//     <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-black bg-slate-100 text-slate-500 border border-slate-200">
//       <span className="w-2 h-2 rounded-full bg-slate-400" /> Inactive
//     </span>
//   );

// /* ── Icon input ── */
// const IconInput = ({
//   icon: Icon, showToggle, ...props
// }: { icon: any; showToggle?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) => {
//   const [show, setShow] = useState(false);
//   return (
//     <div className="relative">
//       <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//       <input
//         className={`${inputCls} pl-9 ${showToggle ? 'pr-9' : ''}`}
//         type={showToggle ? (show ? 'text' : 'password') : props.type}
//         {...props}
//       />
//       {showToggle && (
//         <button type="button" onClick={() => setShow(p => !p)}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
//           {show ? <EyeOff size={14} /> : <Eye size={14} />}
//         </button>
//       )}
//     </div>
//   );
// };

// /* ════════════════════════════════════════════════════════════
//    MAIN PAGE
// ════════════════════════════════════════════════════════════ */
// export const UserCreationPage: React.FC = () => {
//   const currentUser = useMemo(() => authStore.getUser(), []);
//   const token = authStore.getToken();

//   const [users, setUsers]               = useState<any[]>([]);
//   const [loadingUsers, setLoadingUsers] = useState(true);
//   const [search, setSearch]             = useState('');
//   const [modalOpen, setModalOpen]       = useState(false);
//   const [loading, setLoading]           = useState(false);
//   const [error, setError]               = useState('');
//   const [success, setSuccess]           = useState('');

//   const emptyForm = {
//     username: '', email: '', first_name: '', last_name: '',
//     password: '', phone_number: '', designation: '',
//     department: '', address: '', role: 'employee' as UserRole, is_active: true,
//   };
//   const [form, setForm] = useState(emptyForm);

//   if (!token) return <Navigate to="/login" replace />;
//   if (currentUser?.role !== 'admin') return <Navigate to="/dashboard" replace />;

//   const update = (key: string, value: any) => setForm(p => ({ ...p, [key]: value }));

//   const fetchUsers = async () => {
//     setLoadingUsers(true);
//     try {
//       const res = await fetch(USERS_URL, { headers: { Authorization: `Bearer ${token}` } });
//       if (res.ok) {
//         const data = await res.json();
//         setUsers(Array.isArray(data) ? data : data.results || []);
//       }
//     } catch {}
//     setLoadingUsers(false);
//   };

//   useEffect(() => { fetchUsers(); }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); setLoading(true);
//     try {
//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail || data.username?.[0] || 'Failed to create user.');
//       setSuccess(`User "${data.username}" created successfully.`);
//       setForm(emptyForm);
//       setModalOpen(false);
//       fetchUsers();
//     } catch (err: any) {
//       setError(err.message || 'Failed to create user.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const closeModal = () => { setModalOpen(false); setError(''); setForm(emptyForm); };

//   const filtered = users.filter(u =>
//     `${u.username} ${u.email} ${u.first_name} ${u.last_name} ${u.department} ${u.designation}`
//       .toLowerCase().includes(search.toLowerCase())
//   );

//   const totalAdmins   = users.filter(u => u.role === 'admin').length;
//   const totalActive   = users.filter(u => u.is_active !== false).length;
//   const totalInactive = users.filter(u => u.is_active === false).length;

//   const ROW_ACCENTS = [
//     'border-l-blue-400',
//     'border-l-violet-400',
//     'border-l-emerald-400',
//     'border-l-pink-400',
//     'border-l-amber-400',
//     'border-l-cyan-400',
//     'border-l-fuchsia-400',
//     'border-l-green-400',
//   ];

//   const TABLE_HEADERS = [
//     { label: '#',           color: 'text-indigo-200' },
//     { label: 'User',        color: 'text-blue-200'   },
//     { label: 'Email',       color: 'text-violet-200' },
//     { label: 'Department',  color: 'text-cyan-200'   },
//     { label: 'Designation', color: 'text-emerald-200'},
//     { label: 'Role',        color: 'text-pink-200'   },
//     { label: 'Status',      color: 'text-amber-200'  },
//   ];

//   return (
//     <div className="flex flex-col h-full bg-slate-50 overflow-hidden">

//       <style>{`
//         @keyframes fadeUp {
//           from { opacity:0; transform:translateY(12px); }
//           to   { opacity:1; transform:translateY(0); }
//         }
//         @keyframes modalIn {
//           from { opacity:0; transform:scale(0.95) translateY(12px); }
//           to   { opacity:1; transform:scale(1) translateY(0); }
//         }
//         @keyframes overlayIn { from{opacity:0} to{opacity:1} }
//         .f1{opacity:0;animation:fadeUp .4s ease forwards .05s}
//         .f2{opacity:0;animation:fadeUp .4s ease forwards .13s}
//         .f3{opacity:0;animation:fadeUp .4s ease forwards .22s}
//         .modal-anim{animation:modalIn .25s cubic-bezier(0.34,1.2,0.64,1) forwards}
//         .overlay-anim{animation:overlayIn .2s ease forwards}
//         .row-hover:hover{background:#f8faff}
//       `}</style>

//       {/* ── Banner ── */}
//       <div className="shrink-0 px-6 pt-5 f1">
//         <div className="rounded-2xl overflow-hidden"
//           style={{background:'linear-gradient(125deg,#312e81 0%,#4f46e5 45%,#7c3aed 100%)',boxShadow:'0 8px 32px -4px rgba(79,70,229,0.4)'}}>
//           <div className="px-6 py-5 flex items-center gap-4 flex-wrap"
//             style={{backgroundImage:'radial-gradient(ellipse at 80% 50%,rgba(255,255,255,0.08) 0%,transparent 60%)'}}>
//             <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
//               style={{backgroundColor:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.2)'}}>
//               <Users className="text-white" size={20} />
//             </div>
//             <div className="flex-1 min-w-0">
//               {/* ── Banner heading ── */}
//               <h1 className="text-[22px] font-black text-white leading-tight">User Management</h1>
//               <p className="text-[13px] text-indigo-200 mt-0.5 font-medium">Create and manage platform user accounts</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
//                 style={{backgroundColor:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.18)'}}>
//                 <ShieldCheck size={13} className="text-indigo-200" />
//                 {/* ── Admin Only badge ── */}
//                 <span className="text-[13px] font-black text-indigo-100">Admin Only</span>
//               </div>
//               {/* ── Create User button ── */}
//               <button onClick={() => setModalOpen(true)}
//                 className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-black text-indigo-700 bg-white hover:bg-indigo-50 transition-all shadow-sm active:scale-95">
//                 <UserPlus size={15} /> Create User
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Stat cards ── */}
//       <div className="shrink-0 px-6 pt-4 f2">
//         <div className="grid grid-cols-4 gap-3">
//           {[
//             { label:'Total Users', value:users.length,  icon:Users,     from:'from-blue-500',    to:'to-indigo-600',  border:'border-blue-200',    text:'text-blue-700'    },
//             { label:'Active',      value:totalActive,   icon:UserCheck, from:'from-emerald-500', to:'to-teal-600',    border:'border-emerald-200', text:'text-emerald-700' },
//             { label:'Admins',      value:totalAdmins,   icon:Shield,    from:'from-violet-500',  to:'to-purple-600',  border:'border-violet-200',  text:'text-violet-700'  },
//             { label:'Inactive',    value:totalInactive, icon:User,      from:'from-rose-500',    to:'to-pink-600',    border:'border-rose-200',    text:'text-rose-700'    },
//           ].map(s => (
//             <div key={s.label} className={`flex items-center gap-3 bg-white rounded-2xl px-4 py-4 border ${s.border} shadow-sm hover:shadow-md transition-all`}>
//               <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center shrink-0 shadow-sm`}>
//                 <s.icon size={20} className="text-white" />
//               </div>
//               <div>
//                 <p className="text-[28px] font-black text-slate-800 leading-none">{s.value}</p>
//                 {/* ── Stat card label ── */}
//                 <p className={`text-[13px] font-bold uppercase tracking-wider mt-1 ${s.text}`}>{s.label}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── Table ── */}
//       <div className="flex-1 overflow-hidden px-6 pt-4 pb-6 f3 flex flex-col min-h-0">
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">

//           {/* toolbar */}
//           <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
//             <div className="flex items-center gap-2">
//               {/* ── Table title ── */}
//               <h2 className="text-[16px] font-black text-slate-700">All Users</h2>
//               <span className="text-[12px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{filtered.length}</span>
//             </div>
//             <div className="relative">
//               <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input value={search} onChange={e => setSearch(e.target.value)}
//                 placeholder="Search users..."
//                 className="pl-9 pr-4 py-2.5 text-[13px] bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 w-64 transition-all" />
//             </div>
//           </div>

//           {/* success */}
//           {success && (
//             <div className="mx-5 mt-3 flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[14px] px-4 py-3 rounded-xl shrink-0">
//               <CheckCircle2 size={16} className="shrink-0" /> {success}
//               <button onClick={() => setSuccess('')} className="ml-auto"><X size={15} /></button>
//             </div>
//           )}

//           {/* table */}
//           <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//             {loadingUsers ? (
//               <div className="flex items-center justify-center h-40 gap-3 text-slate-400">
//                 <Loader2 size={22} className="animate-spin" />
//                 <span className="text-[15px] font-medium">Loading users…</span>
//               </div>
//             ) : filtered.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-40 gap-2">
//                 <Users size={32} className="text-slate-200" />
//                 <p className="text-[15px] font-medium text-slate-400">
//                   {search ? 'No users match your search' : 'No users yet — create the first one'}
//                 </p>
//               </div>
//             ) : (
//               <table className="w-full">
//                 <thead>
//                   <tr style={{ background: 'linear-gradient(90deg,#312e81 0%,#4f46e5 50%,#7c3aed 100%)' }}>
//                     {TABLE_HEADERS.map(h => (
//                       <th key={h.label}
//                         className={`text-left px-5 py-4 text-[13px] font-black ${h.color} uppercase tracking-widest whitespace-nowrap`}>
//                         {h.label}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map((u, i) => (
//                     <tr key={u.id || u.username}
//                       className={`border-b border-slate-50 border-l-[3px] ${ROW_ACCENTS[i % ROW_ACCENTS.length]} row-hover transition-colors`}>
//                       <td className="px-5 py-4 text-[14px] font-black text-slate-300">{i + 1}</td>
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-3">
//                           <Avatar name={`${u.first_name || ''} ${u.last_name || u.username}`} index={i} />
//                           <div>
//                             <p className="text-[14px] font-black text-slate-800">
//                               {u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.username}
//                             </p>
//                             <p className="text-[12px] text-slate-400 font-medium">@{u.username}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-5 py-4 text-[14px] text-slate-600">{u.email || '—'}</td>
//                       <td className="px-5 py-4 text-[14px] text-slate-600">{u.department || '—'}</td>
//                       <td className="px-5 py-4 text-[14px] text-slate-600">{u.designation || '—'}</td>
//                       <td className="px-5 py-4"><RoleBadge role={u.role || 'employee'} /></td>
//                       <td className="px-5 py-4"><StatusBadge active={u.is_active !== false} /></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ════════════════════════════════════════
//           MODAL
//       ════════════════════════════════════════ */}
//       {modalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-anim"
//           style={{backgroundColor:'rgba(15,23,42,0.55)',backdropFilter:'blur(6px)'}}>
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col modal-anim overflow-hidden">

//             {/* modal header */}
//             <div className="shrink-0 px-6 py-5 flex items-center justify-between"
//               style={{background:'linear-gradient(125deg,#312e81 0%,#4f46e5 50%,#7c3aed 100%)'}}>
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl flex items-center justify-center"
//                   style={{backgroundColor:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.2)'}}>
//                   <UserPlus size={18} className="text-white" />
//                 </div>
//                 <div>
//                   {/* ── Modal heading ── */}
//                   <h2 className="text-[18px] font-black text-white">Create New User</h2>
//                   <p className="text-[12px] text-indigo-200 font-medium mt-0.5">Fill in all details and submit</p>
//                 </div>
//               </div>
//               <button onClick={closeModal}
//                 className="w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
//                 <X size={18} />
//               </button>
//             </div>

//             {/* modal body */}
//             <form onSubmit={handleSubmit}
//               className="flex-1 overflow-y-auto px-6 py-5 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

//               {error && (
//                 <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 rounded-xl">
//                   <AlertTriangle size={15} className="shrink-0" /> {error}
//                   <button type="button" onClick={() => setError('')} className="ml-auto"><X size={14} /></button>
//                 </div>
//               )}

//               {/* ── Credentials ── */}
//               <div className="rounded-2xl border border-indigo-100 overflow-hidden">
//                 <div className="flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100">
//                   <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
//                     <Lock size={13} className="text-white" />
//                   </div>
//                   {/* ── Section heading ── */}
//                   <span className="text-[14px] font-black text-indigo-700 uppercase tracking-wider">Account Credentials</span>
//                 </div>
//                 <div className="p-4 grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelCls}>Username <span className="text-red-400 normal-case font-normal">*</span></label>
//                     <IconInput icon={User} placeholder="e.g. john_doe" value={form.username}
//                       onChange={(e: any) => update('username', e.target.value)} required />
//                   </div>
//                   <div>
//                     <label className={labelCls}>Email</label>
//                     <IconInput icon={Mail} type="email" placeholder="john@company.com" value={form.email}
//                       onChange={(e: any) => update('email', e.target.value)} />
//                   </div>
//                   <div className="col-span-2">
//                     <label className={labelCls}>Password <span className="text-red-400 normal-case font-normal">*</span></label>
//                     <IconInput icon={Lock} showToggle placeholder="Set a strong password" value={form.password}
//                       onChange={(e: any) => update('password', e.target.value)} required />
//                   </div>
//                 </div>
//               </div>

//               {/* ── Personal ── */}
//               <div className="rounded-2xl border border-violet-100 overflow-hidden">
//                 <div className="flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
//                   <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
//                     <User size={13} className="text-white" />
//                   </div>
//                   {/* ── Section heading ── */}
//                   <span className="text-[14px] font-black text-violet-700 uppercase tracking-wider">Personal Details</span>
//                 </div>
//                 <div className="p-4 grid grid-cols-2 gap-4">
//                   <div>
//                     <label className={labelCls}>First Name</label>
//                     <input className={inputCls} placeholder="John" value={form.first_name}
//                       onChange={e => update('first_name', e.target.value)} />
//                   </div>
//                   <div>
//                     <label className={labelCls}>Last Name</label>
//                     <input className={inputCls} placeholder="Smith" value={form.last_name}
//                       onChange={e => update('last_name', e.target.value)} />
//                   </div>
//                   <div>
//                     <label className={labelCls}>Phone</label>
//                     <IconInput icon={Phone} placeholder="+91 ..." value={form.phone_number}
//                       onChange={(e: any) => update('phone_number', e.target.value)} />
//                   </div>
//                   <div>
//                     <label className={labelCls}>Designation</label>
//                     <IconInput icon={Briefcase} placeholder="Sales Manager" value={form.designation}
//                       onChange={(e: any) => update('designation', e.target.value)} />
//                   </div>
//                   <div>
//                     <label className={labelCls}>Department</label>
//                     <IconInput icon={Building2} placeholder="Sales" value={form.department}
//                       onChange={(e: any) => update('department', e.target.value)} />
//                   </div>
//                   <div>
//                     <label className={labelCls}>Status</label>
//                     <div className="relative">
//                       <select value={String(form.is_active)}
//                         onChange={e => setForm(p => ({ ...p, is_active: e.target.value === 'true' }))}
//                         className={`${inputCls} appearance-none pr-8`}>
//                         <option value="true">Active</option>
//                         <option value="false">Inactive</option>
//                       </select>
//                       <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                     </div>
//                   </div>
//                   <div className="col-span-2">
//                     <label className={labelCls}>Address</label>
//                     <div className="relative">
//                       <MapPin size={14} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
//                       <textarea className={`${inputCls} pl-9 resize-none`} rows={2}
//                         placeholder="Enter full address" value={form.address}
//                         onChange={e => update('address', e.target.value)} />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* ── Role ── */}
//               <div className="rounded-2xl border border-emerald-100 overflow-hidden">
//                 <div className="flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
//                   <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
//                     <Shield size={13} className="text-white" />
//                   </div>
//                   {/* ── Section heading ── */}
//                   <span className="text-[14px] font-black text-emerald-700 uppercase tracking-wider">Role & Access</span>
//                 </div>
//                 <div className="p-4">
//                   <div className="grid grid-cols-2 gap-3">
//                     {(['employee', 'admin'] as UserRole[]).map(r => (
//                       <label key={r} className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3.5 cursor-pointer transition-all select-none
//                         ${form.role === r
//                           ? r === 'admin'
//                             ? 'bg-violet-50 border-violet-400 shadow-sm shadow-violet-100'
//                             : 'bg-indigo-50 border-indigo-400 shadow-sm shadow-indigo-100'
//                           : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
//                         }`}>
//                         <input type="radio" name="role" value={r} checked={form.role === r}
//                           onChange={e => update('role', e.target.value)} className="hidden" />
//                         <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0
//                           ${form.role === r
//                             ? r === 'admin' ? 'bg-violet-100' : 'bg-indigo-100'
//                             : 'bg-slate-100'}`}>
//                           {r === 'admin'
//                             ? <Shield size={20} className={form.role === r ? 'text-violet-600' : 'text-slate-400'} />
//                             : <User   size={20} className={form.role === r ? 'text-indigo-600' : 'text-slate-400'} />}
//                         </div>
//                         <div className="flex-1">
//                           {/* ── Role label ── */}
//                           <p className={`text-[14px] font-black capitalize ${form.role === r ? (r === 'admin' ? 'text-violet-700' : 'text-indigo-700') : 'text-slate-600'}`}>
//                             {r}
//                           </p>
//                           <p className="text-[12px] text-slate-400 mt-0.5">
//                             {r === 'admin' ? 'Full access · Manage users' : 'Standard pipeline access'}
//                           </p>
//                         </div>
//                         {form.role === r && (
//                           <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${r === 'admin' ? 'bg-violet-500' : 'bg-indigo-500'}`} />
//                         )}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//             </form>

//             {/* modal footer */}
//             <div className="shrink-0 px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
//               {/* ── Cancel button ── */}
//               <button type="button" onClick={closeModal}
//                 className="px-6 py-3 text-[14px] font-black text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95">
//                 Cancel
//               </button>
//               {/* ── Submit button ── */}
//               <button onClick={handleSubmit} disabled={loading}
//                 className={`flex items-center gap-2 px-7 py-3 text-[14px] font-black rounded-xl transition-all active:scale-95 shadow-sm
//                   ${loading
//                     ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-indigo-500/30 hover:-translate-y-0.5'
//                   }`}>
//                 {loading ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
//                 {loading ? 'Creating…' : 'Create User'}
//               </button>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };





import React, { useMemo, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authStore, type UserRole } from '../Utils/auth';
import {
  UserPlus, User, Mail, Phone, Briefcase, Building2,
  MapPin, Lock, ShieldCheck, CheckCircle2, AlertTriangle,
  Loader2, ChevronDown, X, Search, Users, Shield, Pencil, Trash2,
  UserCheck, Eye, EyeOff, Sparkles,
} from 'lucide-react';

const API_URL   = '/api/auth/create-user/';
const USERS_URL = '/api/auth/users/';

const labelCls = 'block text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-1.5';
const inputCls =
  'w-full px-3 py-2.5 text-[14px] text-slate-800 bg-slate-50 border border-slate-200 rounded-xl ' +
  'placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-indigo-400 ' +
  'focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200';

/* ── Avatar ── */
const AVATAR_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-fuchsia-500 to-pink-600',
  'from-green-500 to-emerald-600',
];
const Avatar = ({ name, index }: { name: string; index: number }) => {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
  return (
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center text-white text-[13px] font-black shrink-0 shadow-md transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg`}>
      {initials}
    </div>
  );
};

const getUserDisplayName = (user: any) =>
  [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || user.username;

/* ── Role badge ── */
const RoleBadge = ({ role }: { role: string }) =>
  role === 'admin' ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-black bg-violet-100 text-violet-700 border border-violet-200 shadow-sm">
      <Shield size={11} /> Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-black bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
      <User size={11} /> Employee
    </span>
  );

/* ── Status badge ── */
const StatusBadge = ({ active }: { active: boolean }) =>
  active ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-black bg-slate-100 text-slate-500 border border-slate-200 shadow-sm">
      <span className="w-2 h-2 rounded-full bg-slate-400" /> Inactive
    </span>
  );

/* ── Icon input ── */
const IconInput = ({
  icon: Icon, showToggle, ...props
}: { icon: any; showToggle?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative group">
      <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-200 group-focus-within:text-indigo-500" />
      <input
        className={`${inputCls} pl-9 ${showToggle ? 'pr-9' : ''}`}
        type={showToggle ? (show ? 'text' : 'password') : props.type}
        {...props}
      />
      {showToggle && (
        <button type="button" onClick={() => setShow(p => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors duration-200">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════ */
export const UserCreationPage: React.FC = () => {
  const currentUser = useMemo(() => authStore.getUser(), []);
  const token = authStore.getToken();
  const [forceLogin, setForceLogin]     = useState(false);

  const [users, setUsers]               = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadError, setLoadError]       = useState('');
  const [search, setSearch]             = useState('');
  const [modalOpen, setModalOpen]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const emptyForm = {
    email: '', first_name: '', last_name: '',
    password: '', phone_number: '', designation: '',
    department: '', address: '', role: 'employee' as UserRole, is_active: true,
  };
  const [form, setForm] = useState(emptyForm);

  if (forceLogin || !token) return <Navigate to="/login" replace />;
  if (currentUser?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const update = (key: string, value: any) => setForm(p => ({ ...p, [key]: value }));
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

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setLoadError('');
    try {
      const res = await authStore.fetchWithAuth(USERS_URL);
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(extractErrorMessage(data, 'Failed to load users.'));
      }
      setUsers(Array.isArray(data) ? data : data?.results || []);
    } catch (err: any) {
      if ((err.message || '').includes('Session expired')) {
        setForceLogin(true);
      }
      setUsers([]);
      setLoadError(err.message || 'Failed to load users.');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = {
        ...form,
        email: form.email.trim().toLowerCase(),
      };
      const res = await authStore.fetchWithAuth(editingUserId ? `${USERS_URL}${editingUserId}/` : API_URL, {
        method: editingUserId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUserId && !form.password ? { ...payload, password: undefined } : payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(extractErrorMessage(data, editingUserId ? 'Failed to update user.' : 'Failed to create user.'));
      }
      setSuccess(
        editingUserId
          ? `User "${data?.email || form.email}" updated successfully.`
          : `User "${data?.email || form.email}" created successfully.`
      );
      setForm(emptyForm);
      setEditingUserId(null);
      setModalOpen(false);
      await fetchUsers();
    } catch (err: any) {
      if ((err.message || '').includes('Session expired')) {
        setForceLogin(true);
      }
      setError(err.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUserId(null);
    setError('');
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUserId(user.id);
    setError('');
    setForm({
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      password: '',
      phone_number: user.phone_number || '',
      designation: user.designation || '',
      department: user.department || '',
      address: user.address || '',
      role: (user.role || 'employee') as UserRole,
      is_active: user.is_active !== false,
    });
    setModalOpen(true);
  };

  const handleDelete = async (user: any) => {
    if (!window.confirm(`Delete user "${user.email || user.username}"?`)) return;
    setLoadError('');
    try {
      const res = await authStore.fetchWithAuth(`${USERS_URL}${user.id}/`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(extractErrorMessage(data, 'Failed to delete user.'));
      }
      setSuccess(`User "${user.email || user.username}" deleted successfully.`);
      await fetchUsers();
    } catch (err: any) {
      if ((err.message || '').includes('Session expired')) {
        setForceLogin(true);
      }
      setLoadError(err.message || 'Failed to delete user.');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUserId(null);
    setError('');
    setForm(emptyForm);
  };

  const filtered = users.filter(u =>
    `${u.username} ${u.email} ${u.first_name} ${u.last_name} ${u.department} ${u.designation}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const totalAdmins   = users.filter(u => u.role === 'admin').length;
  const totalActive   = users.filter(u => u.is_active !== false).length;
  const totalInactive = users.filter(u => u.is_active === false).length;

  const ROW_ACCENTS = [
    'border-l-blue-400',
    'border-l-violet-400',
    'border-l-emerald-400',
    'border-l-pink-400',
    'border-l-amber-400',
    'border-l-cyan-400',
    'border-l-fuchsia-400',
    'border-l-green-400',
  ];

  const TABLE_HEADERS = [
    { label: '#',           color: 'text-indigo-200' },
    { label: 'User',        color: 'text-blue-200'   },
    { label: 'Email',       color: 'text-violet-200' },
    { label: 'Department',  color: 'text-cyan-200'   },
    { label: 'Designation', color: 'text-emerald-200'},
    { label: 'Role',        color: 'text-pink-200'   },
    { label: 'Status',      color: 'text-amber-200'  },
    { label: 'Actions',     color: 'text-slate-200'  },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden"
      style={{ background: 'linear-gradient(145deg,#f8faff 0%,#f0f4ff 50%,#f5f3ff 100%)' }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.96) translateY(14px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        .f1 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .05s }
        .f2 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .15s }
        .f3 { opacity:0; animation:fadeUp .45s cubic-bezier(0.34,1.1,0.64,1) forwards .25s }
        .modal-anim  { animation:modalIn .28s cubic-bezier(0.34,1.2,0.64,1) forwards }
        .overlay-anim { animation:overlayIn .2s ease forwards }

        /* table row hover */
        .trow { transition: background 0.15s ease, transform 0.15s ease; }
        .trow:hover { background: linear-gradient(90deg,#eef2ff,#f5f3ff); transform: translateX(3px); }

        /* stat card */
        .scard { transition: all 0.25s cubic-bezier(0.34,1.2,0.64,1); }
        .scard:hover { transform: translateY(-5px) scale(1.02); }

        /* buttons */
        .btn-cta {
          transition: all 0.2s cubic-bezier(0.34,1.2,0.64,1);
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          box-shadow: 0 4px 16px rgba(79,70,229,0.35);
        }
        .btn-cta:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 28px rgba(79,70,229,0.5);
          background: linear-gradient(135deg,#4338ca,#6d28d9);
        }
        .btn-cta:active { transform: scale(0.97); }

        .btn-banner {
          transition: all 0.2s cubic-bezier(0.34,1.2,0.64,1);
          box-shadow: 0 4px 14px rgba(255,255,255,0.2);
        }
        .btn-banner:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 24px rgba(255,255,255,0.35);
        }
        .btn-banner:active { transform: scale(0.97); }

        .btn-cancel { transition: all 0.2s ease; }
        .btn-cancel:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.08); }
        .btn-cancel:active { transform: scale(0.97); }

        /* search focus lift */
        .search-wrap { transition: all 0.25s ease; }
        .search-wrap:focus-within {
          transform: translateY(-1px);
          box-shadow: 0 0 0 4px rgba(99,102,241,0.14), 0 4px 16px rgba(99,102,241,0.12);
          border-radius: 14px;
        }

        /* modal section hover */
        .msec { transition: box-shadow 0.2s ease; }
        .msec:hover { box-shadow: 0 4px 24px rgba(99,102,241,0.1); }

        /* role card */
        .rcard { transition: all 0.2s cubic-bezier(0.34,1.2,0.64,1); }
        .rcard:hover { transform: translateY(-2px); }

        /* shimmer on banner */
        .shimmer-overlay {
          position:absolute; inset:0; pointer-events:none;
          background: linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
          background-size: 200% 100%;
          animation: shimmer 4s ease-in-out infinite;
        }
      `}</style>

      {/* ══════════════════ BANNER ══════════════════ */}
      <div className="shrink-0 px-6 pt-5 f1">
        <div className="rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)',
            boxShadow: '0 12px 40px -4px rgba(79,70,229,0.5), 0 2px 8px rgba(0,0,0,0.12)',
          }}>
          <div className="shimmer-overlay" />
          <div className="px-7 py-6 flex items-center gap-5 flex-wrap relative z-10"
            style={{ backgroundImage:'radial-gradient(ellipse at 80% 50%,rgba(255,255,255,0.09) 0%,transparent 60%)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.25)', backdropFilter:'blur(4px)' }}>
              <Users className="text-white" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[26px] font-black text-white leading-tight tracking-tight">User Management</h1>
              <p className="text-[13px] text-indigo-200 mt-1 font-medium">Create and manage platform user accounts</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ backgroundColor:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', backdropFilter:'blur(4px)' }}>
                <ShieldCheck size={14} className="text-indigo-200" />
                <span className="text-[13px] font-black text-indigo-100">Admin Only</span>
              </div>
              <button onClick={openCreateModal}
                className="btn-banner flex items-center gap-2.5 px-6 py-3 rounded-xl text-[14px] font-black text-indigo-700 bg-white">
                <UserPlus size={16} /> Create User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════ STAT CARDS ══════════════════ */}
      <div className="shrink-0 px-6 pt-4 f2">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label:'Total Users', value:users.length,  icon:Users,     from:'from-blue-500',    to:'to-indigo-600',  border:'border-blue-200',    text:'text-blue-700',    glow:'rgba(59,130,246,0.25)'  },
            { label:'Active',      value:totalActive,   icon:UserCheck, from:'from-emerald-500', to:'to-teal-600',    border:'border-emerald-200', text:'text-emerald-700', glow:'rgba(16,185,129,0.22)' },
            { label:'Admins',      value:totalAdmins,   icon:Shield,    from:'from-violet-500',  to:'to-purple-600',  border:'border-violet-200',  text:'text-violet-700',  glow:'rgba(124,58,237,0.22)' },
            { label:'Inactive',    value:totalInactive, icon:User,      from:'from-rose-500',    to:'to-pink-600',    border:'border-rose-200',    text:'text-rose-700',    glow:'rgba(239,68,68,0.2)'   },
          ].map(s => (
            <div key={s.label}
              className={`scard flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border-2 ${s.border}`}
              style={{ boxShadow:`0 4px 20px ${s.glow}, 0 1px 4px rgba(0,0,0,0.04)` }}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center shrink-0`}
                style={{ boxShadow:`0 4px 16px ${s.glow}` }}>
                <s.icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-[30px] font-black text-slate-800 leading-none">{s.value}</p>
                <p className={`text-[13px] font-bold uppercase tracking-widest mt-1 ${s.text}`}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════ TABLE ══════════════════ */}
      <div className="flex-1 overflow-hidden px-6 pt-4 pb-6 f3 flex flex-col min-h-0">
        <div className="bg-white flex flex-col min-h-0 overflow-hidden"
          style={{
            borderRadius: '18px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 4px 24px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.04)',
          }}>

          {/* toolbar */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom:'1.5px solid #eef2ff', background:'linear-gradient(90deg,#ffffff,#fafbff)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 12px rgba(79,70,229,0.3)' }}>
                <Sparkles size={15} className="text-white" />
              </div>
              <h2 className="text-[17px] font-black text-slate-800">All Users</h2>
              <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                {filtered.length}
              </span>
            </div>
            <div className="search-wrap">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2.5 text-[13px] bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:bg-white w-64 transition-all duration-200" />
              </div>
            </div>
          </div>

          {/* success toast */}
          {success && (
            <div className="mx-6 mt-4 flex items-center gap-3 text-[14px] font-semibold px-5 py-3.5 rounded-xl shrink-0"
              style={{ background:'#f0fdf4', border:'1.5px solid #bbf7d0', color:'#166534', boxShadow:'0 4px 12px rgba(16,185,129,0.12)' }}>
              <CheckCircle2 size={18} className="shrink-0 text-emerald-500" /> {success}
              <button onClick={() => setSuccess('')} className="ml-auto text-emerald-400 hover:text-emerald-600 transition-colors"><X size={16} /></button>
            </div>
          )}

          {loadError && (
            <div className="mx-6 mt-4 flex items-center gap-3 text-[14px] font-semibold px-5 py-3.5 rounded-xl shrink-0"
              style={{ background:'#fff7ed', border:'1.5px solid #fdba74', color:'#9a3412', boxShadow:'0 4px 12px rgba(249,115,22,0.12)' }}>
              <AlertTriangle size={18} className="shrink-0 text-orange-500" />
              <span>{loadError}</span>
              <button
                type="button"
                onClick={() => { void fetchUsers(); }}
                className="ml-auto rounded-lg px-3 py-1.5 text-[12px] font-black transition-colors"
                style={{ background:'#ffffff', border:'1px solid #fdba74', color:'#c2410c' }}
              >
                Retry
              </button>
            </div>
          )}

          {/* table body */}
          <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {loadingUsers ? (
              <div className="flex flex-col items-center justify-center h-48 gap-4 text-slate-400">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background:'linear-gradient(135deg,#eef2ff,#f5f3ff)', border:'1.5px solid #e0e7ff' }}>
                  <Loader2 size={24} className="animate-spin text-indigo-500" />
                </div>
                <span className="text-[15px] font-semibold">Loading users…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0' }}>
                  <Users size={28} className="text-slate-300" />
                </div>
                <p className="text-[15px] font-semibold text-slate-400">
                  {search ? 'No users match your search' : 'No users yet — create the first one'}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ background:'linear-gradient(90deg,#1e1b4b 0%,#312e81 30%,#4f46e5 65%,#7c3aed 100%)' }}>
                    {TABLE_HEADERS.map(h => (
                      <th key={h.label}
                        className={`text-left px-6 py-4 text-[13px] font-black ${h.color} uppercase tracking-widest whitespace-nowrap`}>
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.id || u.username}
                      className={`group trow border-l-[4px] ${ROW_ACCENTS[i % ROW_ACCENTS.length]}`}
                      style={{ borderBottom:'1px solid #f1f5f9' }}>
                      <td className="px-6 py-4 text-[14px] font-black text-slate-300">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={getUserDisplayName(u)} index={i} />
                          <div>
                            <p className="text-[14px] font-black text-slate-800">
                              {getUserDisplayName(u)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-slate-600">{u.email || '—'}</td>
                      <td className="px-6 py-4 text-[14px] text-slate-600">{u.department || '—'}</td>
                      <td className="px-6 py-4 text-[14px] text-slate-600">{u.designation || '—'}</td>
                      <td className="px-6 py-4"><RoleBadge role={u.role || 'employee'} /></td>
                      <td className="px-6 py-4"><StatusBadge active={u.is_active !== false} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-black"
                            style={{ background:'#eef2ff', border:'1px solid #c7d2fe', color:'#4338ca' }}
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(u)}
                            disabled={u.id === currentUser?.id}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-black disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background:'#fff1f2', border:'1px solid #fecdd3', color:'#be123c' }}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════ MODAL ══════════════════ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-anim"
          style={{ backgroundColor:'rgba(10,8,30,0.65)', backdropFilter:'blur(8px)' }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col modal-anim overflow-hidden"
            style={{ boxShadow:'0 24px 64px rgba(79,70,229,0.28), 0 8px 24px rgba(0,0,0,0.14)', border:'1.5px solid rgba(99,102,241,0.2)' }}>

            {/* modal header */}
            <div className="shrink-0 px-7 py-6 flex items-center justify-between relative overflow-hidden"
              style={{ background:'linear-gradient(125deg,#1e1b4b 0%,#312e81 25%,#4f46e5 60%,#7c3aed 100%)' }}>
              <div className="shimmer-overlay" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.25)', backdropFilter:'blur(4px)' }}>
                  <UserPlus size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-[20px] font-black text-white tracking-tight">{editingUserId ? 'Edit User' : 'Create New User'}</h2>
                  <p className="text-[12px] text-indigo-200 font-medium mt-0.5">
                    {editingUserId ? 'Update user access and profile details' : 'Fill in all details and submit'}
                  </p>
                </div>
              </div>
              <button onClick={closeModal}
                className="relative z-10 w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/15 transition-all duration-200 active:scale-90">
                <X size={18} />
              </button>
            </div>

            {/* modal body */}
            <form id="create-user-form" onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-7 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ background:'linear-gradient(180deg,#fafbff,#f8fafc)' }}>

              {error && (
                <div className="flex items-center gap-3 text-[13px] font-semibold px-4 py-3.5 rounded-xl"
                  style={{ background:'#fff1f2', border:'1.5px solid #fecdd3', color:'#be123c', boxShadow:'0 4px 12px rgba(239,68,68,0.1)' }}>
                  <AlertTriangle size={16} className="shrink-0 text-red-500" /> {error}
                  <button type="button" onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600 transition-colors"><X size={14} /></button>
                </div>
              )}

              {/* ── Credentials ── */}
              <div className="msec rounded-2xl overflow-hidden bg-white"
                style={{ border:'1.5px solid #e0e7ff', boxShadow:'0 2px 12px rgba(99,102,241,0.07)' }}>
                <div className="flex items-center gap-3 px-5 py-4"
                  style={{ background:'linear-gradient(90deg,#eef2ff,#f5f3ff)', borderBottom:'1.5px solid #e0e7ff' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow:'0 4px 12px rgba(99,102,241,0.35)' }}>
                    <Lock size={14} className="text-white" />
                  </div>
                  <span className="text-[14px] font-black text-indigo-700 uppercase tracking-wider">Account Credentials</span>
                </div>
                <div className="p-5 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelCls}>Email <span className="text-red-400 normal-case font-normal">*</span></label>
                    <IconInput icon={Mail} type="email" placeholder="john@company.com" value={form.email}
                      onChange={(e: any) => update('email', e.target.value)} required />
                    <p className="mt-2 text-[12px] font-medium text-slate-400">
                      Username will be generated automatically from this email.
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>
                      Password
                      {!editingUserId && <span className="text-red-400 normal-case font-normal"> *</span>}
                    </label>
                    <IconInput icon={Lock} showToggle placeholder="Set a strong password" value={form.password}
                      onChange={(e: any) => update('password', e.target.value)} required={!editingUserId} />
                    {editingUserId && (
                      <p className="mt-2 text-[12px] font-medium text-slate-400">
                        Leave password blank if you do not want to change it.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Personal ── */}
              <div className="msec rounded-2xl overflow-hidden bg-white"
                style={{ border:'1.5px solid #ede9fe', boxShadow:'0 2px 12px rgba(124,58,237,0.07)' }}>
                <div className="flex items-center gap-3 px-5 py-4"
                  style={{ background:'linear-gradient(90deg,#f5f3ff,#fdf4ff)', borderBottom:'1.5px solid #ede9fe' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background:'linear-gradient(135deg,#7c3aed,#9333ea)', boxShadow:'0 4px 12px rgba(124,58,237,0.35)' }}>
                    <User size={14} className="text-white" />
                  </div>
                  <span className="text-[14px] font-black text-violet-700 uppercase tracking-wider">Personal Details</span>
                </div>
                <div className="p-5 grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>First Name</label>
                    <input className={inputCls} placeholder="John" value={form.first_name}
                      onChange={e => update('first_name', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Last Name</label>
                    <input className={inputCls} placeholder="Smith" value={form.last_name}
                      onChange={e => update('last_name', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <IconInput icon={Phone} placeholder="+91 ..." value={form.phone_number}
                      onChange={(e: any) => update('phone_number', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Designation</label>
                    <IconInput icon={Briefcase} placeholder="Sales Manager" value={form.designation}
                      onChange={(e: any) => update('designation', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Department</label>
                    <IconInput icon={Building2} placeholder="Sales" value={form.department}
                      onChange={(e: any) => update('department', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <div className="relative">
                      <select value={String(form.is_active)}
                        onChange={e => setForm(p => ({ ...p, is_active: e.target.value === 'true' }))}
                        className={`${inputCls} appearance-none pr-8`}>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Address</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
                      <textarea className={`${inputCls} pl-9 resize-none`} rows={2}
                        placeholder="Enter full address" value={form.address}
                        onChange={e => update('address', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Role ── */}
              <div className="msec rounded-2xl overflow-hidden bg-white"
                style={{ border:'1.5px solid #d1fae5', boxShadow:'0 2px 12px rgba(16,185,129,0.07)' }}>
                <div className="flex items-center gap-3 px-5 py-4"
                  style={{ background:'linear-gradient(90deg,#ecfdf5,#f0fdfa)', borderBottom:'1.5px solid #d1fae5' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background:'linear-gradient(135deg,#059669,#0d9488)', boxShadow:'0 4px 12px rgba(16,185,129,0.35)' }}>
                    <Shield size={14} className="text-white" />
                  </div>
                  <span className="text-[14px] font-black text-emerald-700 uppercase tracking-wider">Role & Access</span>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3">
                    {(['employee', 'admin'] as UserRole[]).map(r => (
                      <label key={r}
                        className={`rcard flex items-center gap-3 rounded-xl px-4 py-4 cursor-pointer select-none`}
                        style={form.role === r
                          ? r === 'admin'
                            ? { background:'#f5f3ff', border:'2px solid #8b5cf6', boxShadow:'0 4px 16px rgba(124,58,237,0.2)' }
                            : { background:'#eef2ff', border:'2px solid #6366f1', boxShadow:'0 4px 16px rgba(79,70,229,0.2)' }
                          : { background:'#f8fafc', border:'2px solid #e2e8f0' }
                        }>
                        <input type="radio" name="role" value={r} checked={form.role === r}
                          onChange={e => update('role', e.target.value)} className="hidden" />
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={form.role === r
                            ? r === 'admin'
                              ? { background:'#ede9fe' }
                              : { background:'#e0e7ff' }
                            : { background:'#f1f5f9' }
                          }>
                          {r === 'admin'
                            ? <Shield size={22} className={form.role === r ? 'text-violet-600' : 'text-slate-400'} />
                            : <User   size={22} className={form.role === r ? 'text-indigo-600' : 'text-slate-400'} />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-[14px] font-black capitalize ${form.role === r ? (r === 'admin' ? 'text-violet-700' : 'text-indigo-700') : 'text-slate-600'}`}>
                            {r}
                          </p>
                          <p className="text-[12px] text-slate-400 mt-0.5 font-medium">
                            {r === 'admin' ? 'Full access · Manage users' : 'Standard pipeline access'}
                          </p>
                        </div>
                        {form.role === r && (
                          <span className="w-3 h-3 rounded-full shrink-0"
                            style={{
                              background: r === 'admin' ? '#8b5cf6' : '#6366f1',
                              boxShadow: r === 'admin' ? '0 0 8px rgba(139,92,246,0.7)' : '0 0 8px rgba(99,102,241,0.7)',
                            }} />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

            </form>

            {/* modal footer */}
            <div className="shrink-0 px-7 py-5 flex items-center justify-between bg-white"
              style={{ borderTop:'1.5px solid #eef2ff', boxShadow:'0 -4px 16px rgba(0,0,0,0.04)' }}>
              <button type="button" onClick={closeModal}
                className="btn-cancel px-7 py-3 text-[14px] font-black text-slate-600 bg-white rounded-xl"
                style={{ border:'1.5px solid #e2e8f0' }}>
                Cancel
              </button>
              <button type="submit" form="create-user-form" disabled={loading}
                className={`btn-cta flex items-center gap-2.5 px-8 py-3 text-[15px] font-black rounded-xl text-white ${loading ? '!bg-slate-200 !text-slate-400 !shadow-none cursor-not-allowed' : ''}`}
                style={loading ? { background:'#e2e8f0', boxShadow:'none' } : {}}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                {loading ? 'Creating…' : 'Create User'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
