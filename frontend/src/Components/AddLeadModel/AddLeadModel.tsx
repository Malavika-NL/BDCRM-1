// import React, { useState, useEffect } from 'react';
// import { X, Sparkles, MapPin, Factory, Package, Loader2 } from 'lucide-react';
// import { api } from '../Utils/api';
// import type { LeadStatus } from '../Utils/types';

// interface AddLeadModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: any) => void;
// }

// export const AddLeadModal = ({ isOpen, onClose, onSubmit }: AddLeadModalProps) => {
//   // 1. Dynamic Options State
//   const [verticals, setVerticals] = useState<any[]>([]);
//   const [regions, setRegions] = useState<any[]>([]);
//   const [products, setProducts] = useState<any[]>([]);
//   const [loadingConfig, setLoadingConfig] = useState(true);

//   // 2. Form State
//   const [formData, setFormData] = useState({
//     name: '',
//     company: '',
//     email: '',
//     phone: '',
//     value: '',
//     status: 'new' as LeadStatus,
//     source: 'cold_outreach',
//     // IDs for Backend Relations
//     vertical: '', 
//     region_rel: '', 
//     product_interest: '' 
//   });

//   // 3. Fetch Data on Mount
//   useEffect(() => {
//     if (isOpen) {
//       setLoadingConfig(true);
//       Promise.all([
//         api.getVerticals().catch(() => []),
//         api.getRegions().catch(() => []),
//         api.getProductLines().catch(() => [])
//       ]).then(([vData, rData, pData]) => {
//         setVerticals(vData);
//         setRegions(rData);
//         setProducts(pData);
        
//         // Set defaults if available
//         setFormData(prev => ({
//           ...prev,
//           vertical: vData[0]?.id || '',
//           region_rel: rData[0]?.id || '',
//           product_interest: pData[0]?.id || ''
//         }));
//         setLoadingConfig(false);
//       });
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex justify-between items-center">
//           <div>
//             <h3 className="text-xl font-bold text-white flex items-center gap-2">
//               <Sparkles size={20} /> New BDM Opportunity
//             </h3>
//             <p className="text-blue-100 text-sm mt-0.5">Enter details. Dropdowns loaded from DB.</p>
//           </div>
//           <button onClick={onClose} className="text-blue-200 hover:text-white transition p-1">
//             <X size={24} />
//           </button>
//         </div>

//         {loadingConfig ? (
//           <div className="p-12 flex flex-col items-center justify-center text-slate-400">
//             <Loader2 className="animate-spin mb-2" size={32} />
//             <p>Loading Configuration...</p>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             {/* Basic Info */}
//             <div className="grid grid-cols-2 gap-5">
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Contact Name</label>
//                 <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 outline-none" placeholder="John Smith" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Company</label>
//                 <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 outline-none" placeholder="Acme Corp" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-5">
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email</label>
//                 <input required type="email" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 outline-none" placeholder="john@acme.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phone (WhatsApp)</label>
//                 <input type="tel" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 outline-none" placeholder="+91..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
//               </div>
//             </div>

//             {/* BDM SEGMENTATION (DYNAMIC) */}
//             <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
//               <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
//                 <Sparkles size={16} className="text-indigo-500"/> BDM Classification
//               </h4>
//               <div className="grid grid-cols-3 gap-4">
//                 {/* Vertical */}
//                 <div>
//                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1"><Factory size={10}/> Vertical</label>
//                   <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" value={formData.vertical} onChange={e => setFormData({...formData, vertical: e.target.value})}>
//                     <option value="">Select...</option>
//                     {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
//                   </select>
//                 </div>
                
//                 {/* Region */}
//                 <div>
//                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1"><MapPin size={10}/> Region</label>
//                   <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" value={formData.region_rel} onChange={e => setFormData({...formData, region_rel: e.target.value})}>
//                     <option value="">Select...</option>
//                     {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
//                   </select>
//                 </div>

//                 {/* Product */}
//                 <div>
//                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1"><Package size={10}/> Interest</label>
//                   <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" value={formData.product_interest} onChange={e => setFormData({...formData, product_interest: e.target.value})}>
//                     <option value="">Select...</option>
//                     {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-5">
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Est. Deal Value ($)</label>
//                 <input required type="number" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 outline-none" placeholder="50000" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Source</label>
//                 <select className="w-full p-3 border border-slate-200 rounded-xl bg-white outline-none" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })}>
//                   <option value="cold_outreach">Cold Call</option>
//                   <option value="linkedin">LinkedIn</option>
//                   <option value="referral">Referral</option>
//                   <option value="website">Website</option>
//                 </select>
//               </div>
//             </div>

//             <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
//               Create Deal & Segment
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import {
  X, Sparkles, MapPin, Factory, Package, Loader2,
  Plus, User, Building2, Mail, Phone, DollarSign,
  Tag, ChevronDown
} from 'lucide-react';
import { api } from '../Utils/api';
import type { LeadStatus } from '../Utils/types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

/* ─── STATUS CONFIG (mirrors Pipeline) ──────────────── */
const STATUS_ORDER: LeadStatus[] = ['new', 'contacted', 'negotiation', 'won', 'lost'];
const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};
const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  new:         { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
  contacted:   { bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-500'  },
  negotiation: { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  won:         { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  lost:        { bg: 'bg-slate-100',  text: 'text-slate-600',   dot: 'bg-slate-400'   },
};

/* ─── FIELD WRAPPER ──────────────────────────────────── */
const Field = ({
  label, icon, children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
      {icon && <span className="text-slate-400">{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

/* ─── SHARED INPUT CLASSES ───────────────────────────── */
const inputCls =
  'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all';

const selectCls =
  'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] text-slate-800 outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all appearance-none cursor-pointer';

export const AddLeadModal = ({ isOpen, onClose, onSubmit }: AddLeadModalProps) => {
  const [verticals, setVerticals] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    value: '',
    status: 'new' as LeadStatus,
    source: 'cold_outreach',
    vertical: '',
    region_rel: '',
    product_interest: '',
  });

  useEffect(() => {
    if (isOpen) {
      setLoadingConfig(true);
      Promise.all([
        api.getVerticals().catch(() => []),
        api.getRegions().catch(() => []),
        api.getProductLines().catch(() => []),
      ]).then(([vData, rData, pData]) => {
        setVerticals(vData);
        setRegions(rData);
        setProducts(pData);
        setFormData(prev => ({
          ...prev,
          vertical: vData[0]?.id || '',
          region_rel: rData[0]?.id || '',
          product_interest: pData[0]?.id || '',
        }));
        setLoadingConfig(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const patch = (key: string, value: string) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  const statusCfg = STATUS_COLORS[formData.status] || STATUS_COLORS.new;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        style={{ animation: 'fadeScaleIn 0.18s ease-out both' }}
      >
        <style>{`
          @keyframes fadeScaleIn {
            from { opacity: 0; transform: scale(0.96) translateY(8px); }
            to   { opacity: 1; transform: scale(1)    translateY(0);    }
          }
        `}</style>

        {/* ── HEADER (matches Pipeline banner) ── */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
            <Plus className="text-white" size={15} />
          </div>
          <div className="flex-1">
            <h3 className="text-[16px] font-bold text-white leading-tight">Add Deal</h3>
            <p className="text-[11px] text-indigo-200 mt-0.5">Fill in the details to create a new pipeline deal</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── BODY ── */}
        {loadingConfig ? (
          <div className="flex flex-col items-center justify-center py-14 text-slate-400 gap-3">
            <Loader2 className="animate-spin text-indigo-500" size={24} />
            <p className="text-[12px] font-semibold">Loading configuration…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[78vh]">

            {/* ── CONTACT INFO ── */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Contact Info</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Contact Name" icon={<User size={10} />}>
                  <input
                    required type="text" className={inputCls}
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={e => patch('name', e.target.value)}
                  />
                </Field>
                <Field label="Company" icon={<Building2 size={10} />}>
                  <input
                    required type="text" className={inputCls}
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={e => patch('company', e.target.value)}
                  />
                </Field>
                <Field label="Email" icon={<Mail size={10} />}>
                  <input
                    required type="email" className={inputCls}
                    placeholder="john@acme.com"
                    value={formData.email}
                    onChange={e => patch('email', e.target.value)}
                  />
                </Field>
                <Field label="Phone (WhatsApp)" icon={<Phone size={10} />}>
                  <input
                    type="tel" className={inputCls}
                    placeholder="+91…"
                    value={formData.phone}
                    onChange={e => patch('phone', e.target.value)}
                  />
                </Field>
              </div>
            </div>

            {/* ── DIVIDER ── */}
            <div className="border-t border-slate-100" />

            {/* ── BDM CLASSIFICATION ── */}
            <div className="bg-indigo-50/60 rounded-xl border border-indigo-100 p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles size={12} className="text-indigo-500" />
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">BDM Classification</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {/* Vertical */}
                <Field label="Vertical" icon={<Factory size={10} />}>
                  <div className="relative">
                    <select
                      className={selectCls}
                      value={formData.vertical}
                      onChange={e => patch('vertical', e.target.value)}
                    >
                      <option value="">Select…</option>
                      {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </Field>

                {/* Region */}
                <Field label="Region" icon={<MapPin size={10} />}>
                  <div className="relative">
                    <select
                      className={selectCls}
                      value={formData.region_rel}
                      onChange={e => patch('region_rel', e.target.value)}
                    >
                      <option value="">Select…</option>
                      {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </Field>

                {/* Product Interest */}
                <Field label="Interest" icon={<Package size={10} />}>
                  <div className="relative">
                    <select
                      className={selectCls}
                      value={formData.product_interest}
                      onChange={e => patch('product_interest', e.target.value)}
                    >
                      <option value="">Select…</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </Field>
              </div>
            </div>

            {/* ── DEAL DETAILS ── */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Deal Details</p>
              <div className="grid grid-cols-2 gap-3">
                {/* Value */}
                <Field label="Est. Deal Value ($)" icon={<DollarSign size={10} />}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] font-semibold">$</span>
                    <input
                      required type="number" className={`${inputCls} pl-6`}
                      placeholder="50,000"
                      value={formData.value}
                      onChange={e => patch('value', e.target.value)}
                    />
                  </div>
                </Field>

                {/* Source */}
                <Field label="Source" icon={<Tag size={10} />}>
                  <div className="relative">
                    <select
                      className={selectCls}
                      value={formData.source}
                      onChange={e => patch('source', e.target.value)}
                    >
                      <option value="cold_outreach">Cold Call</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="referral">Referral</option>
                      <option value="website">Website</option>
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </Field>
              </div>
            </div>

            {/* ── INITIAL STAGE ── */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Initial Stage</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_ORDER.map(s => {
                  const cfg = STATUS_COLORS[s];
                  const isActive = formData.status === s;
                  return (
                    <button
                      key={s} type="button"
                      onClick={() => patch('status', s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold border transition-all ${
                        isActive
                          ? `${cfg.bg} ${cfg.text} border-current/20 shadow-sm`
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? cfg.dot : 'bg-slate-300'}`} />
                      {STATUS_LABELS[s]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── FOOTER ACTIONS ── */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button" onClick={onClose}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[12px] font-bold hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-1.5"
              >
                <Plus size={13} /> Create Deal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};