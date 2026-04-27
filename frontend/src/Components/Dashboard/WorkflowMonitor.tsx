import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  Layers, 
  MapPin, 
  Package, 
  Tag as TagIcon, 
  Plus, 
  Trash2, 
  Loader2,
  Users,
  Network,
  Wrench,
  Building2
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

// --- REUSABLE CONFIG CARD COMPONENT ---
const ConfigCard = ({ 
  title, 
  description, 
  endpoint, 
  icon: Icon, 
  colorTheme 
}: { 
  title: string, 
  description: string, 
  endpoint: string, 
  icon: any, 
  colorTheme: string 
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [newValue, setNewValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Expanded color mappings
  const colors: Record<string, any> = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', btn: 'bg-indigo-600 hover:bg-indigo-700', border: 'hover:border-indigo-100 focus:border-indigo-500 focus:ring-indigo-500/20' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-600', btn: 'bg-rose-600 hover:bg-rose-700', border: 'hover:border-rose-100 focus:border-rose-500 focus:ring-rose-500/20' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700', border: 'hover:border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/20' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', btn: 'bg-amber-500 hover:bg-amber-600', border: 'hover:border-amber-100 focus:border-amber-500 focus:ring-amber-500/20' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700', border: 'hover:border-blue-100 focus:border-blue-500 focus:ring-blue-500/20' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', btn: 'bg-purple-600 hover:bg-purple-700', border: 'hover:border-purple-100 focus:border-purple-500 focus:ring-purple-500/20' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', btn: 'bg-cyan-600 hover:bg-cyan-700', border: 'hover:border-cyan-100 focus:border-cyan-500 focus:ring-cyan-500/20' },
  };
  const theme = colors[colorTheme] || colors.indigo;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/`);
      if (res.ok) setItems(await res.json());
    } catch (err) {
      console.error(`Error loading ${endpoint}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [endpoint]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newValue.trim() })
      });
      if (res.ok) {
        setNewValue('');
        loadData();
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete this item?`)) return;
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/${id}/`, { method: 'DELETE' });
      if (res.ok) loadData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-[420px] hover:shadow-md transition-shadow">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4 shrink-0">
        <div className={`p-3 rounded-2xl ${theme.bg} ${theme.text} shadow-sm`}>
          <Icon size={24} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-lg leading-tight">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col min-h-0 bg-white">
        <form onSubmit={handleAdd} className="flex gap-2 mb-5 shrink-0">
          <input 
            type="text" 
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`Add new ${title.toLowerCase()}...`}
            className={`flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all ${theme.border} focus:bg-white`}
          />
          <button 
            type="submit"
            disabled={!newValue.trim()}
            className={`px-5 py-3 text-white rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm ${theme.btn}`}
          >
            <Plus size={18} />
          </button>
        </form>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2.5">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-300" size={30} /></div>
          ) : items.length === 0 ? (
            <div className="text-center py-10 px-4 border-2 border-dashed border-slate-100 rounded-2xl">
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">No items yet</p>
              <p className="text-xs text-slate-400 mt-1">Populate this dimension for your CRM.</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={item.id} className={`flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl group transition-all hover:bg-white hover:shadow-sm ${theme.border}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-4">{index + 1}.</span>
                  <span className="text-sm font-bold text-slate-700">{item.name}</span>
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export const WorkflowMonitor = () => {
  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50/50">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 mb-8 shadow-xl text-white flex items-center gap-6">
        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
          <Settings size={32} className="text-blue-300" />
        </div>
        <div>
          <h2 className="text-3xl font-black">BD Cone Master Data</h2>
          <p className="text-slate-400 mt-1 text-lg">
            Configure the 6 dimensions of your Business Development Strategy.
          </p>
        </div>
      </div>

      {/* CONFIGURATION GRID - Exactly matching the handwritten note */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        
        {/* 1. Products */}
        <ConfigCard 
          title="1. Product Lines" 
          description="e.g., WMS, RFID, Labels, Ribbon"
          endpoint="product-lines"
          icon={Package}
          colorTheme="blue"
        />

        {/* 2. Customer Categories */}
        <ConfigCard 
          title="2. Customer Categories" 
          description="e.g., Key Accounts, Existing, Dealers"
          endpoint="customer-categories"
          icon={Users}
          colorTheme="purple"
        />

        {/* 3. Channels */}
        <ConfigCard 
          title="3. Sales Channels" 
          description="e.g., Direct Customers, Dealers"
          endpoint="sales-channels"
          icon={Network}
          colorTheme="emerald"
        />

        {/* 4. Tools */}
        <ConfigCard 
          title="4. Engagement Tools" 
          description="e.g., WhatsApp, Email, LinkedIn"
          endpoint="engagement-tools"
          icon={Wrench}
          colorTheme="amber"
        />

        {/* 5. Regions */}
        <ConfigCard 
          title="5. Geographic Regions" 
          description="e.g., North, South, West, International"
          endpoint="regions"
          icon={MapPin}
          colorTheme="rose"
        />

        {/* 6. Verticals */}
        <ConfigCard 
          title="6. Industry Verticals" 
          description="e.g., Automotive, Electrical, E-commerce"
          endpoint="verticals"
          icon={Building2}
          colorTheme="indigo"
        />

        {/* Optional/Extra: Tags */}
        <ConfigCard 
          title="System Tags" 
          description="Lead management tags (e.g., Urgent, VIP)"
          endpoint="tags"
          icon={TagIcon}
          colorTheme="cyan"
        />

      </div>
    </div>
  );
};

export default WorkflowMonitor;