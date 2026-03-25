// import React, { useState } from 'react';
// import { X, Sparkles } from 'lucide-react';
// import type { LeadStatus } from '../Utils/types';

// interface AddLeadModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: any) => void;
// }

// export const AddLeadModal = ({ isOpen, onClose, onSubmit }: AddLeadModalProps) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     company: '',
//     email: '',
//     phone: '', // NEW
//     value: '',
//     status: 'new' as LeadStatus,
//     source: 'other'
//   });

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//     setFormData({ name: '', company: '', email: '', phone: '', value: '', status: 'new', source: 'other' });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex justify-between items-center">
//           <div>
//             <h3 className="text-xl font-bold text-white flex items-center gap-2">
//               <Sparkles size={20} /> Add New Deal
//             </h3>
//             <p className="text-blue-100 text-sm mt-0.5">Fill in the details to create a lead.</p>
//           </div>
//           <button onClick={onClose} className="text-blue-200 hover:text-white transition p-1">
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-5">
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Name</label>
//             <input
//               required type="text"
//               className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition"
//               placeholder="e.g. John Smith"
//               value={formData.name}
//               onChange={e => setFormData({ ...formData, name: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company</label>
//             <input
//               required type="text"
//               className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition"
//               placeholder="e.g. Acme Corp"
//               value={formData.company}
//               onChange={e => setFormData({ ...formData, company: e.target.value })}
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
//               <input
//                 required type="email"
//                 className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition"
//                 placeholder="john@acme.com"
//                 value={formData.email}
//                 onChange={e => setFormData({ ...formData, email: e.target.value })}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
//               <input
//                 type="tel"
//                 className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition"
//                 placeholder="+1 555 123 4567"
//                 value={formData.phone}
//                 onChange={e => setFormData({ ...formData, phone: e.target.value })}
//               />
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deal Value ($)</label>
//               <input
//                 required type="number" step="0.01"
//                 className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition"
//                 placeholder="50000"
//                 value={formData.value}
//                 onChange={e => setFormData({ ...formData, value: e.target.value })}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lead Source</label>
//               <select
//                 className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none bg-white transition"
//                 value={formData.source}
//                 onChange={e => setFormData({ ...formData, source: e.target.value })}
//               >
//                 <option value="cold_outreach">Cold Outreach</option>
//                 <option value="linkedin">LinkedIn</option>
//                 <option value="referral">Referral</option>
//                 <option value="website">Website</option>
//                 <option value="event">Event</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all mt-2"
//           >
//             Create Deal
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { X, Sparkles, MapPin, Factory, Package, Loader2 } from 'lucide-react';
import { api } from '../Utils/api';
import type { LeadStatus } from '../Utils/types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const AddLeadModal = ({ isOpen, onClose, onSubmit }: AddLeadModalProps) => {
  // 1. Dynamic Options State
  const [verticals, setVerticals] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // 2. Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    value: '',
    status: 'new' as LeadStatus,
    source: 'cold_outreach',
    // IDs for Backend Relations
    vertical: '', 
    region_rel: '', 
    product_interest: '' 
  });

  // 3. Fetch Data on Mount
  useEffect(() => {
    if (isOpen) {
      setLoadingConfig(true);
      Promise.all([
        api.getVerticals().catch(() => []),
        api.getRegions().catch(() => []),
        api.getProductLines().catch(() => [])
      ]).then(([vData, rData, pData]) => {
        setVerticals(vData);
        setRegions(rData);
        setProducts(pData);
        
        // Set defaults if available
        setFormData(prev => ({
          ...prev,
          vertical: vData[0]?.id || '',
          region_rel: rData[0]?.id || '',
          product_interest: pData[0]?.id || ''
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

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles size={20} /> New BDM Opportunity
            </h3>
            <p className="text-blue-100 text-sm mt-0.5">Enter details. Dropdowns loaded from DB.</p>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition p-1">
            <X size={24} />
          </button>
        </div>

        {loadingConfig ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Loading Configuration...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Contact Name</label>
                <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 outline-none" placeholder="John Smith" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Company</label>
                <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 outline-none" placeholder="Acme Corp" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email</label>
                <input required type="email" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 outline-none" placeholder="john@acme.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phone (WhatsApp)</label>
                <input type="tel" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 outline-none" placeholder="+91..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>

            {/* BDM SEGMENTATION (DYNAMIC) */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500"/> BDM Classification
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {/* Vertical */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1"><Factory size={10}/> Vertical</label>
                  <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" value={formData.vertical} onChange={e => setFormData({...formData, vertical: e.target.value})}>
                    <option value="">Select...</option>
                    {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                
                {/* Region */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1"><MapPin size={10}/> Region</label>
                  <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" value={formData.region_rel} onChange={e => setFormData({...formData, region_rel: e.target.value})}>
                    <option value="">Select...</option>
                    {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>

                {/* Product */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1"><Package size={10}/> Interest</label>
                  <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" value={formData.product_interest} onChange={e => setFormData({...formData, product_interest: e.target.value})}>
                    <option value="">Select...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Est. Deal Value ($)</label>
                <input required type="number" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 outline-none" placeholder="50000" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Source</label>
                <select className="w-full p-3 border border-slate-200 rounded-xl bg-white outline-none" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })}>
                  <option value="cold_outreach">Cold Call</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="referral">Referral</option>
                  <option value="website">Website</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
              Create Deal & Segment
            </button>
          </form>
        )}
      </div>
    </div>
  );
};