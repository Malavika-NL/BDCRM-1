import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Target, Calendar, DollarSign, Users, 
  MapPin, Briefcase, Package, Layers, CheckCircle2, Loader2,
  TrendingUp, Network, Wrench
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export const BDMTargetCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // All Dropdown States
  const [regions, setRegions] = useState<any[]>([]);
  const [verticals, setVerticals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);

  const targetTypeOptions = [
    { value: 'region', label: 'Region' },
    { value: 'vertical', label: 'Vertical' },
    { value: 'product', label: 'Product Line' },
    { value: 'customer_category', label: 'Customer Category' },
    { value: 'sales_channel', label: 'Sales Channel' },
    { value: 'engagement_tool', label: 'Engagement Tool' },
  ];

  const [form, setForm] = useState({ 
    name: '', 
    target_type: 'region', 
    target_leads: '', 
    target_revenue: '', 
    start_date: '', 
    end_date: '',
    region: '',
    vertical: '',
    product_line: '',
    customer_category: '',
    sales_channel: '',
    engagement_tool: ''
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [regRes, vertRes, prodRes, catRes, chanRes, toolRes] = await Promise.all([
          fetch(`${API_BASE}/regions/`),
          fetch(`${API_BASE}/verticals/`),
          fetch(`${API_BASE}/product-lines/`),
          fetch(`${API_BASE}/customer-categories/`),
          fetch(`${API_BASE}/sales-channels/`),
          fetch(`${API_BASE}/engagement-tools/`)
        ]);
        setRegions(await regRes.json());
        setVerticals(await vertRes.json());
        setProducts(await prodRes.json());
        setCategories(await catRes.json());
        setChannels(await chanRes.json());
        setTools(await toolRes.json());
      } catch(e) { 
        console.error("Error loading dropdowns", e); 
      }
    };
    fetchDropdowns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload: any = {
      name: form.name,
      target_type: form.target_type,
      target_leads: parseInt(form.target_leads) || 0,
      target_revenue: parseFloat(form.target_revenue) || 0,
      start_date: form.start_date,
      end_date: form.end_date,
      status: 'active'
    };

    // Attach correct foreign key based on type
    if (form.target_type === 'region' && form.region) payload.region = parseInt(form.region);
    if (form.target_type === 'vertical' && form.vertical) payload.vertical = parseInt(form.vertical);
    if (form.target_type === 'product' && form.product_line) payload.product_line = parseInt(form.product_line);
    if (form.target_type === 'customer_category' && form.customer_category) payload.customer_category = parseInt(form.customer_category);
    if (form.target_type === 'sales_channel' && form.sales_channel) payload.sales_channel = parseInt(form.sales_channel);
    if (form.target_type === 'engagement_tool' && form.engagement_tool) payload.engagement_tool = parseInt(form.engagement_tool);

    try {
      const res = await fetch(`${API_BASE}/bdm-targets/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        navigate('/bdm-targets');
      } else {
        const err = await res.json();
        alert(`Error: ${JSON.stringify(err)}`);
      }
    } catch(e) {
      console.error(e);
      alert("Failed to connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 relative">
      <div className="bg-slate-900 pt-10 pb-20 px-8 relative shrink-0">
        <div className="max-w-4xl mx-auto relative z-10">
          <button 
            onClick={() => navigate('/bdm-targets')}
            className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium text-sm bg-white/5 hover:bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-sm"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
              <Target className="text-blue-400" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Set Strategic Target</h2>
              <p className="text-slate-400 mt-1">Define your goals, link them to the correct dimension, and track your PDCA cycle.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 -mt-12 relative z-20 pb-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Layers className="text-slate-400" size={20} />
              <h3 className="text-lg font-bold text-slate-800">1. Target Classification</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">Target Plan Name <span className="text-red-500">*</span></label>
                <input 
                  required
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" 
                  placeholder="e.g. Q3 Healthcare Expansion EMEA" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Category Type</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none font-medium" 
                  value={form.target_type} 
                  onChange={e => setForm({
                    ...form, 
                    target_type: e.target.value, 
                    region: '', vertical: '', product_line: '', 
                    customer_category: '', sales_channel: '', engagement_tool: ''
                  })}
                >
                  {targetTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* DYNAMIC SECONDARY DROPDOWN */}
              {form.target_type === 'region' && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="text-sm font-bold text-slate-700">Select Region</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                    <select className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={form.region} onChange={e => setForm({...form, region: e.target.value})}>
                      <option value="">-- Choose Region --</option>
                      {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {form.target_type === 'vertical' && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="text-sm font-bold text-slate-700">Select Vertical</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-4 text-slate-400" size={18} />
                    <select className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={form.vertical} onChange={e => setForm({...form, vertical: e.target.value})}>
                      <option value="">-- Choose Vertical --</option>
                      {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {form.target_type === 'product' && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="text-sm font-bold text-slate-700">Select Product Line</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-4 text-slate-400" size={18} />
                    <select className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={form.product_line} onChange={e => setForm({...form, product_line: e.target.value})}>
                      <option value="">-- Choose Product --</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {form.target_type === 'customer_category' && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="text-sm font-bold text-slate-700">Select Category</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-4 text-slate-400" size={18} />
                    <select className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={form.customer_category} onChange={e => setForm({...form, customer_category: e.target.value})}>
                      <option value="">-- Choose Category --</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {form.target_type === 'sales_channel' && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="text-sm font-bold text-slate-700">Select Channel</label>
                  <div className="relative">
                    <Network className="absolute left-4 top-4 text-slate-400" size={18} />
                    <select className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={form.sales_channel} onChange={e => setForm({...form, sales_channel: e.target.value})}>
                      <option value="">-- Choose Channel --</option>
                      {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {form.target_type === 'engagement_tool' && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="text-sm font-bold text-slate-700">Select Tool</label>
                  <div className="relative">
                    <Wrench className="absolute left-4 top-4 text-slate-400" size={18} />
                    <select className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={form.engagement_tool} onChange={e => setForm({...form, engagement_tool: e.target.value})}>
                      <option value="">-- Choose Tool --</option>
                      {tools.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <TrendingUp className="text-emerald-500" size={20} />
              <h3 className="text-lg font-bold text-slate-800">2. Goals & Timeline</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Leads Goal (Quantity) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Users className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input required type="number" className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" placeholder="e.g. 500" value={form.target_leads} onChange={e => setForm({...form, target_leads: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Revenue Goal (USD) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input required type="number" className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" placeholder="e.g. 150000" value={form.target_revenue} onChange={e => setForm({...form, target_revenue: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Start Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input required type="date" className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">End Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input required type="date" className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate('/bdm-targets')} className="px-6 py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-70">
              {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : <><CheckCircle2 size={18} /> Launch Target Plan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BDMTargetCreate;