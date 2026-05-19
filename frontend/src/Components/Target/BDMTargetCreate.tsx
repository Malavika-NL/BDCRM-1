// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft,
//   Target,
//   Calendar,
//   DollarSign,
//   Users,
//   MapPin,
//   Briefcase,
//   Package,
//   Layers,
//   CheckCircle2,
//   Loader2,
//   TrendingUp,
//   Network,
//   Wrench,
//   Sparkles,
//   Flag,
//   ClipboardList,
//   Lightbulb,
//   Building2,
// } from 'lucide-react';

// const API_BASE = 'http://127.0.0.1:8000/api';

// type OptionItem = { id: number; name: string };

// type ChoiceOption = {
//   value: string;
//   label: string;
// };

// export const BDMTargetCreate = () => {
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [regions, setRegions] = useState<OptionItem[]>([]);
//   const [verticals, setVerticals] = useState<OptionItem[]>([]);
//   const [products, setProducts] = useState<OptionItem[]>([]);
//   const [categories, setCategories] = useState<OptionItem[]>([]);
//   const [channels, setChannels] = useState<OptionItem[]>([]);
//   const [tools, setTools] = useState<OptionItem[]>([]);
//   const [targetTypeOptions, setTargetTypeOptions] = useState<ChoiceOption[]>([]);
//   const [statusOptions, setStatusOptions] = useState<ChoiceOption[]>([]);

//   const [form, setForm] = useState({
//     name: '',
//     target_type: '',
//     target_leads: '',
//     target_revenue: '',
//     start_date: '',
//     end_date: '',
//     region: '',
//     vertical: '',
//     product_line: '',
//     customer_category: '',
//     sales_channel: '',
//     engagement_tool: '',
//     status: '',
//     notes: '',
//     target_owner: '',
//     review_cycle: '',
//     success_metric: '',
//     risk_notes: '',
//   });

//   useEffect(() => {
//     const fetchDropdowns = async () => {
//       try {
//         const [regRes, vertRes, prodRes, catRes, chanRes, toolRes] = await Promise.all([
//           fetch(`${API_BASE}/regions/`),
//           fetch(`${API_BASE}/verticals/`),
//           fetch(`${API_BASE}/product-lines/`),
//           fetch(`${API_BASE}/customer-categories/`),
//           fetch(`${API_BASE}/sales-channels/`),
//           fetch(`${API_BASE}/engagement-tools/`),
//         ]);

//         setRegions(await regRes.json());
//         setVerticals(await vertRes.json());
//         setProducts(await prodRes.json());
//         setCategories(await catRes.json());
//         setChannels(await chanRes.json());
//         setTools(await toolRes.json());

//         const optionsRes = await fetch(`${API_BASE}/bdm-targets/`, { method: 'OPTIONS' });
//         if (optionsRes.ok) {
//           const optionsData = await optionsRes.json();
//           const targetChoices = extractChoices(optionsData, 'target_type');
//           const statusChoices = extractChoices(optionsData, 'status');
//           setTargetTypeOptions(targetChoices);
//           setStatusOptions(statusChoices);
//           setForm((prev) => ({
//             ...prev,
//             target_type: prev.target_type || targetChoices[0]?.value || '',
//             status: prev.status || statusChoices[0]?.value || '',
//           }));
//         }
//       } catch (e) {
//         console.error('Error loading dropdowns', e);
//       }
//     };

//     fetchDropdowns();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const payload: any = {
//       name: form.name,
//       target_type: form.target_type,
//       target_leads: parseInt(form.target_leads, 10) || 0,
//       target_revenue: parseFloat(form.target_revenue) || 0,
//       start_date: form.start_date,
//       end_date: form.end_date,
//       status: form.status,
//       notes: [form.notes, `Owner: ${form.target_owner}`, `Review Cycle: ${form.review_cycle}`, `Success Metric: ${form.success_metric}`, `Risks: ${form.risk_notes}`]
//         .filter(Boolean)
//         .join(' | '),
//     };

//     if (form.target_type === 'region' && form.region) payload.region = parseInt(form.region, 10);
//     if (form.target_type === 'vertical' && form.vertical) payload.vertical = parseInt(form.vertical, 10);
//     if (form.target_type === 'product' && form.product_line) payload.product_line = parseInt(form.product_line, 10);
//     if (form.target_type === 'customer_category' && form.customer_category) payload.customer_category = parseInt(form.customer_category, 10);
//     if (form.target_type === 'sales_channel' && form.sales_channel) payload.sales_channel = parseInt(form.sales_channel, 10);
//     if (form.target_type === 'engagement_tool' && form.engagement_tool) payload.engagement_tool = parseInt(form.engagement_tool, 10);

//     try {
//       const res = await fetch(`${API_BASE}/bdm-targets/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         navigate('/bdm-targets');
//       } else {
//         const err = await res.json();
//         alert(`Error: ${JSON.stringify(err)}`);
//       }
//     } catch (e) {
//       console.error(e);
//       alert('Failed to connect to server.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const updateTargetType = (value: string) => {
//     setForm({
//       ...form,
//       target_type: value,
//       region: '',
//       vertical: '',
//       product_line: '',
//       customer_category: '',
//       sales_channel: '',
//       engagement_tool: '',
//     });
//   };

//   const renderDynamicSelect = () => {
//     if (form.target_type === 'region') {
//       return (
//         <IconSelect
//           label="Select Region"
//           icon={MapPin}
//           value={form.region}
//           onChange={(v) => setForm({ ...form, region: v })}
//           options={regions}
//           placeholder="Choose Region"
//         />
//       );
//     }

//     if (form.target_type === 'vertical') {
//       return (
//         <IconSelect
//           label="Select Vertical"
//           icon={Briefcase}
//           value={form.vertical}
//           onChange={(v) => setForm({ ...form, vertical: v })}
//           options={verticals}
//           placeholder="Choose Vertical"
//         />
//       );
//     }

//     if (form.target_type === 'product') {
//       return (
//         <IconSelect
//           label="Select Product Line"
//           icon={Package}
//           value={form.product_line}
//           onChange={(v) => setForm({ ...form, product_line: v })}
//           options={products}
//           placeholder="Choose Product"
//         />
//       );
//     }

//     if (form.target_type === 'customer_category') {
//       return (
//         <IconSelect
//           label="Select Category"
//           icon={Users}
//           value={form.customer_category}
//           onChange={(v) => setForm({ ...form, customer_category: v })}
//           options={categories}
//           placeholder="Choose Category"
//         />
//       );
//     }

//     if (form.target_type === 'sales_channel') {
//       return (
//         <IconSelect
//           label="Select Channel"
//           icon={Network}
//           value={form.sales_channel}
//           onChange={(v) => setForm({ ...form, sales_channel: v })}
//           options={channels}
//           placeholder="Choose Channel"
//         />
//       );
//     }

//     return (
//       <IconSelect
//         label="Select Tool"
//         icon={Wrench}
//         value={form.engagement_tool}
//         onChange={(v) => setForm({ ...form, engagement_tool: v })}
//         options={tools}
//         placeholder="Choose Tool"
//       />
//     );
//   };

//   return (
//     <div className="h-full overflow-y-auto bg-[radial-gradient(circle_at_20%_20%,#dbeafe_0%,#eff6ff_35%,#f0f9ff_100%)] relative">
//       <style>
//         {`
//           @keyframes floaty {
//             0% { transform: translateY(0px); }
//             50% { transform: translateY(-10px); }
//             100% { transform: translateY(0px); }
//           }
//           @keyframes fadeUp {
//             0% { opacity: 0; transform: translateY(14px) scale(0.99); }
//             100% { opacity: 1; transform: translateY(0) scale(1); }
//           }
//           .anim-float {
//             animation: floaty 6s ease-in-out infinite;
//           }
//           .anim-fade-up-1 {
//             opacity: 0;
//             animation: fadeUp 0.55s ease-out forwards;
//             animation-delay: 0.05s;
//           }
//           .anim-fade-up-2 {
//             opacity: 0;
//             animation: fadeUp 0.55s ease-out forwards;
//             animation-delay: 0.15s;
//           }
//           .anim-fade-up-3 {
//             opacity: 0;
//             animation: fadeUp 0.55s ease-out forwards;
//             animation-delay: 0.25s;
//           }
//         `}
//       </style>

//       <div className="pointer-events-none absolute -top-16 -left-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl anim-float" />
//       <div className="pointer-events-none absolute top-56 -right-16 w-96 h-96 rounded-full bg-cyan-300/20 blur-3xl anim-float" />

//       <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 pt-10 pb-24 px-8">
//         <div className="max-w-[1280px] mx-auto">
//           <button
//             onClick={() => navigate('/bdm-targets')}
//             className="mb-6 flex items-center gap-2 text-blue-100 hover:text-white transition-colors font-medium text-sm bg-white/20 hover:bg-white/30 w-fit px-4 py-2 rounded-xl"
//           >
//             <ArrowLeft size={16} /> Back to Targets
//           </button>

//           <div className="flex flex-wrap items-center gap-5 anim-fade-up-1">
//             <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-cyan-400/30 rounded-2xl flex items-center justify-center border border-blue-300/30">
//               <Target className="text-blue-300" size={32} />
//             </div>
//             <div>
//               <h2 className="text-3xl font-black text-white">Create BDM Target Plan</h2>
//               <p className="text-blue-100 mt-1">Build clear objectives with measurable KPIs and execution timeline.</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-[1280px] mx-auto px-4 md:px-8 -mt-14 relative z-20 pb-20">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-7 md:p-8 shadow-[0_10px_40px_rgba(37,99,235,0.14)] border border-blue-100 hover:shadow-[0_14px_50px_rgba(37,99,235,0.18)] transition-shadow anim-fade-up-1">
//             <SectionHead icon={Layers} title="1. Target Classification" subtitle="Define where this target belongs." />

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//               <div className="space-y-2 md:col-span-2">
//                 <label className="text-sm font-bold text-slate-700">Target Plan Name <span className="text-rose-500">*</span></label>
//                 <input
//                   required
//                   className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
//                   placeholder="e.g. Q3 Healthcare Expansion EMEA"
//                   value={form.name}
//                   onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2 md:col-span-2 lg:col-span-3">
//                 <label className="text-sm font-bold text-slate-700">Category Type</label>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {targetTypeOptions.map((option) => {
//                     const Icon = getTypeIcon(option.value);
//                     const active = form.target_type === option.value;
//                     return (
//                       <button
//                         key={option.value}
//                         type="button"
//                         onClick={() => updateTargetType(option.value)}
//                         className={`rounded-xl border p-3 text-left transition-all ${
//                           active
//                             ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
//                             : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
//                         }`}
//                       >
//                         <div className="flex items-center gap-2 text-sm font-semibold">
//                           <Icon size={16} />
//                           {option.label}
//                         </div>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="md:col-span-2 lg:col-span-3 animate-in fade-in">
//                 {renderDynamicSelect()}
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-7 md:p-8 shadow-[0_10px_40px_rgba(16,185,129,0.12)] border border-emerald-100 hover:shadow-[0_14px_50px_rgba(59,130,246,0.16)] transition-shadow anim-fade-up-2">
//             <SectionHead icon={TrendingUp} title="2. Goals & Timeline" subtitle="Define KPI and time window for the plan." />

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//               <FieldWithIcon
//                 label="Leads Goal (Quantity)"
//                 icon={Users}
//                 required
//                 type="number"
//                 placeholder="e.g. 500"
//                 value={form.target_leads}
//                 onChange={(v) => setForm({ ...form, target_leads: v })}
//                 focusRing="focus:ring-emerald-500/10 focus:border-emerald-500"
//               />

//               <FieldWithIcon
//                 label="Revenue Goal (USD)"
//                 icon={DollarSign}
//                 required
//                 type="number"
//                 placeholder="e.g. 150000"
//                 value={form.target_revenue}
//                 onChange={(v) => setForm({ ...form, target_revenue: v })}
//                 focusRing="focus:ring-emerald-500/10 focus:border-emerald-500"
//               />

//               <FieldWithIcon
//                 label="Start Date"
//                 icon={Calendar}
//                 required
//                 type="date"
//                 value={form.start_date}
//                 onChange={(v) => setForm({ ...form, start_date: v })}
//                 focusRing="focus:ring-emerald-500/10 focus:border-emerald-500"
//               />

//               <FieldWithIcon
//                 label="End Date"
//                 icon={Flag}
//                 required
//                 type="date"
//                 value={form.end_date}
//                 onChange={(v) => setForm({ ...form, end_date: v })}
//                 focusRing="focus:ring-emerald-500/10 focus:border-emerald-500"
//               />
//             </div>
//           </div>

//           <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-7 md:p-8 shadow-[0_10px_40px_rgba(59,130,246,0.12)] border border-blue-100 hover:shadow-[0_14px_50px_rgba(59,130,246,0.18)] transition-shadow anim-fade-up-3">
//             <SectionHead icon={ClipboardList} title="3. Ownership & Execution Plan" subtitle="Add accountability and practical execution details." />
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//               <FieldWithIcon
//                 label="Target Owner"
//                 icon={Building2}
//                 type="text"
//                 placeholder="e.g. Regional BDM Team A"
//                 value={form.target_owner}
//                 onChange={(v) => setForm({ ...form, target_owner: v })}
//                 focusRing="focus:ring-blue-500/10 focus:border-blue-500"
//               />
//               <div className="space-y-2">
//                 <label className="text-sm font-bold text-slate-700">Review Cycle</label>
//                 <input
//                   type="text"
//                   className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
//                   value={form.review_cycle}
//                   onChange={(e) => setForm({ ...form, review_cycle: e.target.value })}
//                   placeholder="weekly / bi-weekly / monthly"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-bold text-slate-700">Plan Status</label>
//                 {statusOptions.length > 0 ? (
//                   <select
//                     className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
//                     value={form.status}
//                     onChange={(e) => setForm({ ...form, status: e.target.value })}
//                   >
//                     {statusOptions.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 ) : (
//                   <input
//                     type="text"
//                     className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
//                     value={form.status}
//                     onChange={(e) => setForm({ ...form, status: e.target.value })}
//                     placeholder="Enter status"
//                   />
//                 )}
//               </div>
//               <div className="space-y-2 md:col-span-2 lg:col-span-3">
//                 <label className="text-sm font-bold text-slate-700">Success Metric</label>
//                 <div className="relative">
//                   <Lightbulb className="absolute left-4 top-4 text-slate-400" size={18} />
//                   <input
//                     className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
//                     placeholder="e.g. 25% increase in qualified leads and $200K influenced pipeline."
//                     value={form.success_metric}
//                     onChange={(e) => setForm({ ...form, success_metric: e.target.value })}
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2 md:col-span-2 lg:col-span-3">
//                 <label className="text-sm font-bold text-slate-700">Plan Notes</label>
//                 <textarea
//                   className="w-full p-4 min-h-28 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
//                   placeholder="Describe strategy, markets, campaign context, and tactical priorities."
//                   value={form.notes}
//                   onChange={(e) => setForm({ ...form, notes: e.target.value })}
//                 />
//               </div>
//               <div className="space-y-2 md:col-span-2 lg:col-span-3">
//                 <label className="text-sm font-bold text-slate-700">Risk Notes</label>
//                 <textarea
//                   className="w-full p-4 min-h-24 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
//                   placeholder="Add blockers, dependencies, budget constraints, or operational risks."
//                   value={form.risk_notes}
//                   onChange={(e) => setForm({ ...form, risk_notes: e.target.value })}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center justify-end gap-4 pt-2">
//             <button
//               type="button"
//               onClick={() => navigate('/bdm-targets')}
//               className="px-6 py-3.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-70"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="animate-spin" size={18} /> Saving...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle2 size={18} /> Launch Target Plan
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// type IconSelectProps = {
//   label: string;
//   placeholder: string;
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   value: string;
//   onChange: (value: string) => void;
//   options: OptionItem[];
// };

// const IconSelect = ({ label, placeholder, icon: Icon, value, onChange, options }: IconSelectProps) => (
//   <div className="space-y-2">
//     <label className="text-sm font-bold text-slate-700">{label}</label>
//     <div className="relative">
//       <Icon className="absolute left-4 top-4 text-slate-400" size={18} />
//       <select
//         className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         <option value="">-- {placeholder} --</option>
//         {options.map((item) => (
//           <option key={item.id} value={item.id}>
//             {item.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   </div>
// );

// type FieldWithIconProps = {
//   label: string;
//   required?: boolean;
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   type: string;
//   placeholder?: string;
//   value: string;
//   onChange: (value: string) => void;
//   focusRing: string;
// };

// const FieldWithIcon = ({
//   label,
//   required,
//   icon: Icon,
//   type,
//   placeholder,
//   value,
//   onChange,
//   focusRing,
// }: FieldWithIconProps) => (
//   <div className="space-y-2">
//     <label className="text-sm font-bold text-slate-700">
//       {label} {required && <span className="text-rose-500">*</span>}
//     </label>
//     <div className="relative">
//       <Icon className="absolute left-4 top-4 text-slate-400" size={18} />
//       <input
//         required={required}
//         type={type}
//         className={`w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none transition-all ${focusRing}`}
//         placeholder={placeholder}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       />
//     </div>
//   </div>
// );

// const SectionHead = ({
//   icon: Icon,
//   title,
//   subtitle,
// }: {
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   title: string;
//   subtitle: string;
// }) => (
//   <div>
//     <div className="flex items-center gap-2">
//       <Icon className="text-slate-500" size={18} />
//       <h3 className="text-lg font-bold text-slate-800">{title}</h3>
//     </div>
//     <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
//   </div>
// );

// export default BDMTargetCreate;

// function getTypeIcon(value: string) {
//   const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
//     region: MapPin,
//     vertical: Briefcase,
//     product: Package,
//     customer_category: Users,
//     sales_channel: Network,
//     engagement_tool: Wrench,
//   };
//   return iconMap[value] || Layers;
// }

// function extractChoices(optionsData: any, fieldName: string): ChoiceOption[] {
//   const choices = optionsData?.actions?.POST?.[fieldName]?.choices;
//   if (!Array.isArray(choices)) return [];
//   return choices
//     .filter((choice) => choice?.value !== undefined)
//     .map((choice) => ({
//       value: String(choice.value),
//       label: String(choice.display_name ?? choice.label ?? choice.value),
//     }));
// }

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Target,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Briefcase,
  Package,
  Layers,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Network,
  Wrench,
  Flag,
  ClipboardList,
  Lightbulb,
  Building2,
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

type OptionItem    = { id: number; name: string };
type ChoiceOption  = { value: string; label: string };

// ─── unchanged helper functions ───────────────────────────────────────────────
function getTypeIcon(value: string) {
  const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    region:            MapPin,
    vertical:          Briefcase,
    product:           Package,
    customer_category: Users,
    sales_channel:     Network,
    engagement_tool:   Wrench,
  };
  return iconMap[value] || Layers;
}

function extractChoices(optionsData: any, fieldName: string): ChoiceOption[] {
  const choices = optionsData?.actions?.POST?.[fieldName]?.choices;
  if (!Array.isArray(choices)) return [];
  return choices
    .filter((choice) => choice?.value !== undefined)
    .map((choice) => ({
      value: String(choice.value),
      label: String(choice.display_name ?? choice.label ?? choice.value),
    }));
}

// ─── sub-components ───────────────────────────────────────────────────────────

type IconSelectProps = {
  label: string;
  placeholder: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string;
  onChange: (value: string) => void;
  options: OptionItem[];
};

const IconSelect = ({ label, placeholder, icon: Icon, value, onChange, options }: IconSelectProps) => (
  <div className="space-y-2">
    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-4 text-slate-400" size={16} />
      <select
        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm
          focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400
          outline-none transition-all text-slate-700 font-medium"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">— {placeholder} —</option>
        {options.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
    </div>
  </div>
);

type FieldWithIconProps = {
  label: string;
  required?: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  focusRing: string;
};

const FieldWithIcon = ({ label, required, icon: Icon, type, placeholder, value, onChange, focusRing }: FieldWithIconProps) => (
  <div className="space-y-2">
    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
      {label} {required && <span className="text-rose-400">*</span>}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-3.5 text-slate-400" size={16} />
      <input
        required={required}
        type={type}
        className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm
          focus:bg-white outline-none transition-all font-medium text-slate-700 ${focusRing}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

// SectionHead — left accent bar matching BDMTargetsList card section style
const SectionHead = ({
  icon: Icon,
  title,
  subtitle,
  accentColor = 'bg-indigo-500',
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle: string;
  accentColor?: string;
}) => (
  <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
    <div className={`w-1 self-stretch rounded-full ${accentColor} shrink-0`} />
    <div className="flex items-center gap-2.5">
      <Icon className="text-slate-400 shrink-0" size={16} />
      <div>
        <h3 className="text-[14px] font-black text-slate-800">{title}</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export const BDMTargetCreate = () => {
  const navigate      = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [regions,           setRegions]           = useState<OptionItem[]>([]);
  const [verticals,         setVerticals]         = useState<OptionItem[]>([]);
  const [products,          setProducts]          = useState<OptionItem[]>([]);
  const [categories,        setCategories]        = useState<OptionItem[]>([]);
  const [channels,          setChannels]          = useState<OptionItem[]>([]);
  const [tools,             setTools]             = useState<OptionItem[]>([]);
  const [targetTypeOptions, setTargetTypeOptions] = useState<ChoiceOption[]>([]);
  const [statusOptions,     setStatusOptions]     = useState<ChoiceOption[]>([]);

  const [form, setForm] = useState({
    name: '', target_type: '', target_leads: '', target_revenue: '',
    start_date: '', end_date: '', region: '', vertical: '',
    product_line: '', customer_category: '', sales_channel: '',
    engagement_tool: '', status: '', notes: '', target_owner: '',
    review_cycle: '', success_metric: '', risk_notes: '',
  });

  // ── all fetch / submit functions unchanged ──
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [regRes, vertRes, prodRes, catRes, chanRes, toolRes] = await Promise.all([
          fetch(`${API_BASE}/regions/`),
          fetch(`${API_BASE}/verticals/`),
          fetch(`${API_BASE}/product-lines/`),
          fetch(`${API_BASE}/customer-categories/`),
          fetch(`${API_BASE}/sales-channels/`),
          fetch(`${API_BASE}/engagement-tools/`),
        ]);
        setRegions(await regRes.json());
        setVerticals(await vertRes.json());
        setProducts(await prodRes.json());
        setCategories(await catRes.json());
        setChannels(await chanRes.json());
        setTools(await toolRes.json());

        const optionsRes = await fetch(`${API_BASE}/bdm-targets/`, { method: 'OPTIONS' });
        if (optionsRes.ok) {
          const optionsData     = await optionsRes.json();
          const targetChoices   = extractChoices(optionsData, 'target_type');
          const statusChoices   = extractChoices(optionsData, 'status');
          setTargetTypeOptions(targetChoices);
          setStatusOptions(statusChoices);
          setForm((prev) => ({
            ...prev,
            target_type: prev.target_type || targetChoices[0]?.value || '',
            status:      prev.status      || statusChoices[0]?.value  || '',
          }));
        }
      } catch (e) { console.error('Error loading dropdowns', e); }
    };
    fetchDropdowns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload: any = {
      name:           form.name,
      target_type:    form.target_type,
      target_leads:   parseInt(form.target_leads, 10) || 0,
      target_revenue: parseFloat(form.target_revenue) || 0,
      start_date:     form.start_date,
      end_date:       form.end_date,
      status:         form.status,
      notes: [form.notes, `Owner: ${form.target_owner}`, `Review Cycle: ${form.review_cycle}`,
              `Success Metric: ${form.success_metric}`, `Risks: ${form.risk_notes}`]
        .filter(Boolean).join(' | '),
    };
    if (form.target_type === 'region'            && form.region)            payload.region            = parseInt(form.region, 10);
    if (form.target_type === 'vertical'          && form.vertical)          payload.vertical          = parseInt(form.vertical, 10);
    if (form.target_type === 'product'           && form.product_line)      payload.product_line      = parseInt(form.product_line, 10);
    if (form.target_type === 'customer_category' && form.customer_category) payload.customer_category = parseInt(form.customer_category, 10);
    if (form.target_type === 'sales_channel'     && form.sales_channel)     payload.sales_channel     = parseInt(form.sales_channel, 10);
    if (form.target_type === 'engagement_tool'   && form.engagement_tool)   payload.engagement_tool   = parseInt(form.engagement_tool, 10);

    try {
      const res = await fetch(`${API_BASE}/bdm-targets/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) { navigate('/bdm-targets'); }
      else { const err = await res.json(); alert(`Error: ${JSON.stringify(err)}`); }
    } catch (e) { console.error(e); alert('Failed to connect to server.'); }
    finally { setIsSubmitting(false); }
  };

  const updateTargetType = (value: string) => {
    setForm({ ...form, target_type: value, region: '', vertical: '', product_line: '', customer_category: '', sales_channel: '', engagement_tool: '' });
  };

  const renderDynamicSelect = () => {
    if (form.target_type === 'region')            return <IconSelect label="Select Region"       icon={MapPin}    value={form.region}            onChange={(v) => setForm({ ...form, region: v })}            options={regions}    placeholder="Choose Region"   />;
    if (form.target_type === 'vertical')          return <IconSelect label="Select Vertical"     icon={Briefcase} value={form.vertical}          onChange={(v) => setForm({ ...form, vertical: v })}          options={verticals}  placeholder="Choose Vertical" />;
    if (form.target_type === 'product')           return <IconSelect label="Select Product Line" icon={Package}   value={form.product_line}      onChange={(v) => setForm({ ...form, product_line: v })}      options={products}   placeholder="Choose Product"  />;
    if (form.target_type === 'customer_category') return <IconSelect label="Select Category"     icon={Users}     value={form.customer_category} onChange={(v) => setForm({ ...form, customer_category: v })} options={categories} placeholder="Choose Category" />;
    if (form.target_type === 'sales_channel')     return <IconSelect label="Select Channel"      icon={Network}   value={form.sales_channel}     onChange={(v) => setForm({ ...form, sales_channel: v })}     options={channels}   placeholder="Choose Channel"  />;
    return                                               <IconSelect label="Select Tool"         icon={Wrench}    value={form.engagement_tool}   onChange={(v) => setForm({ ...form, engagement_tool: v })}   options={tools}      placeholder="Choose Tool"     />;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-[#f0f2f8] overflow-hidden">

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px) scale(0.99); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes floatBlob {
          0%,100% { transform: translateY(0px) translateX(0px); }
          50%     { transform: translateY(-10px) translateX(6px); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .anim-blob    { animation: floatBlob 7s ease-in-out infinite; }
        .anim-fade-1  { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
        .anim-fade-2  { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
        .anim-fade-3  { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.25s; }
      `}</style>

      {/* ══════════════════════════════════════════════════
          BANNER — identical structure to BDMTargetsList:
          shrink-0  mx-4  mt-4  rounded-2xl  overflow-hidden
          inline linear-gradient + boxShadow
          inner radial-gradient overlay
      ══════════════════════════════════════════════════ */}
      <div
        className="shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden anim-fade-1"
        style={{
          background:  'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
          boxShadow:   '0 8px 32px -4px rgba(79,70,229,0.45)',
        }}
      >
        <div
          className="px-6 py-5 flex items-center gap-4 flex-wrap"
          style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
        >
          {/* back button */}
          <button
            onClick={() => navigate('/bdm-targets')}
            className="flex items-center gap-1.5 text-indigo-200 hover:text-white text-xs font-semibold
              bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-all shrink-0"
          >
            <ArrowLeft size={14} /> Back
          </button>

          {/* icon block — identical to BDMTargetsList banner */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <Target className="text-white" size={20} />
          </div>

          {/* text */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">
              Create BDM Target Plan
            </h1>
            <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
              Build clear objectives with measurable KPIs and execution timeline.
            </p>
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE BODY — same as BDMTargetsList: flex-1 overflow-y-auto p-4 ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

        {/* decorative blobs */}
        <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
        <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── CARD 1: Target Classification ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow anim-fade-1">
            {/* indigo accent top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-2xl" />
            <div className="p-5 md:p-6">
              <SectionHead icon={Layers} title="1. Target Classification" subtitle="Define where this target belongs." accentColor="bg-indigo-500" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                {/* Plan name */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Target Plan Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    required
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium
                      text-slate-700 placeholder:text-slate-300
                      focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all"
                    placeholder="e.g. Q3 Healthcare Expansion EMEA"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* Category type toggle buttons */}
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Category Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {targetTypeOptions.map((option) => {
                      const Icon   = getTypeIcon(option.value);
                      const active = form.target_type === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateTargetType(option.value)}
                          className={`rounded-xl border py-2.5 px-3 text-left transition-all ${
                            active
                              ? 'text-white border-indigo-600 shadow-md shadow-indigo-200'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                          }`}
                          style={active ? {
                            background: 'linear-gradient(125deg, #4f46e5, #7c3aed)',
                          } : {}}
                        >
                          <div className="flex items-center gap-2 text-xs font-bold">
                            <Icon size={14} />
                            {option.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic select */}
                <div className="md:col-span-2 lg:col-span-3">
                  {renderDynamicSelect()}
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD 2: Goals & Timeline ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow anim-fade-2">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-t-2xl" />
            <div className="p-5 md:p-6">
              <SectionHead icon={TrendingUp} title="2. Goals & Timeline" subtitle="Define KPI and time window for the plan." accentColor="bg-emerald-500" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                <FieldWithIcon
                  label="Leads Goal"
                  icon={Users}
                  required
                  type="number"
                  placeholder="e.g. 500"
                  value={form.target_leads}
                  onChange={(v) => setForm({ ...form, target_leads: v })}
                  focusRing="focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400"
                />
                <FieldWithIcon
                  label="Revenue Goal (USD)"
                  icon={DollarSign}
                  required
                  type="number"
                  placeholder="e.g. 150000"
                  value={form.target_revenue}
                  onChange={(v) => setForm({ ...form, target_revenue: v })}
                  focusRing="focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400"
                />
                <FieldWithIcon
                  label="Start Date"
                  icon={Calendar}
                  required
                  type="date"
                  value={form.start_date}
                  onChange={(v) => setForm({ ...form, start_date: v })}
                  focusRing="focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400"
                />
                <FieldWithIcon
                  label="End Date"
                  icon={Flag}
                  required
                  type="date"
                  value={form.end_date}
                  onChange={(v) => setForm({ ...form, end_date: v })}
                  focusRing="focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* ── CARD 3: Ownership & Execution ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow anim-fade-3">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-2xl" />
            <div className="p-5 md:p-6">
              <SectionHead icon={ClipboardList} title="3. Ownership & Execution Plan" subtitle="Add accountability and practical execution details." accentColor="bg-blue-500" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                <FieldWithIcon
                  label="Target Owner"
                  icon={Building2}
                  type="text"
                  placeholder="e.g. Regional BDM Team A"
                  value={form.target_owner}
                  onChange={(v) => setForm({ ...form, target_owner: v })}
                  focusRing="focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400"
                />

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Review Cycle</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium
                      text-slate-700 placeholder:text-slate-300
                      focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all"
                    value={form.review_cycle}
                    onChange={(e) => setForm({ ...form, review_cycle: e.target.value })}
                    placeholder="weekly / bi-weekly / monthly"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Plan Status</label>
                  {statusOptions.length > 0 ? (
                    <select
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium
                        text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400
                        outline-none transition-all"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium
                        text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400
                        outline-none transition-all"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      placeholder="Enter status"
                    />
                  )}
                </div>

                {/* Success metric — full width */}
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Success Metric</label>
                  <div className="relative">
                    <Lightbulb className="absolute left-4 top-3.5 text-slate-400" size={16} />
                    <input
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium
                        text-slate-700 placeholder:text-slate-300
                        focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all"
                      placeholder="e.g. 25% increase in qualified leads and $200K influenced pipeline."
                      value={form.success_metric}
                      onChange={(e) => setForm({ ...form, success_metric: e.target.value })}
                    />
                  </div>
                </div>

                {/* Plan notes — full width */}
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Plan Notes</label>
                  <textarea
                    className="w-full px-4 py-3.5 min-h-[90px] bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium
                      text-slate-700 placeholder:text-slate-300 resize-none
                      focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all"
                    placeholder="Describe strategy, markets, campaign context, and tactical priorities."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>

                {/* Risk notes — full width */}
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Risk Notes</label>
                  <textarea
                    className="w-full px-4 py-3.5 min-h-[80px] bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium
                      text-slate-700 placeholder:text-slate-300 resize-none
                      focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 outline-none transition-all"
                    placeholder="Add blockers, dependencies, budget constraints, or operational risks."
                    value={form.risk_notes}
                    onChange={(e) => setForm({ ...form, risk_notes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── FOOTER ACTIONS ── */}
          <div className="flex items-center justify-end gap-3 pt-1 pb-4">
            <button
              type="button"
              onClick={() => navigate('/bdm-targets')}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-500
                bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-3 text-white rounded-xl text-sm font-black
                flex items-center gap-2 transition-all
                hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
              style={{
                background:  'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)',
                boxShadow:   '0 4px 18px rgba(79,70,229,0.40)',
              }}
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin" size={16} /> Saving…</>
              ) : (
                <><CheckCircle2 size={16} /> Launch Target Plan</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BDMTargetCreate;