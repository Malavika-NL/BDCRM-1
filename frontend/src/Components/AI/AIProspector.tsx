import React, { useState } from 'react';
import {
  Search, Loader2, Sparkles, UserPlus, ExternalLink,
  Linkedin, Globe, MapPin, Building2, Briefcase,
  MessageCircle, Zap, CheckCircle2, Download, Filter, Star
} from 'lucide-react';

// Adjust port if needed
const API_URL = 'http://127.0.0.1:8000/api/ai-prospector';

interface Profile {
  name: string;
  title: string;
  company: string;
  location: string;
  source: string;
  profile_url: string;
  linkedin_url?: string;
  naukri_url?: string;
  relevance_reason?: string;
  relevance_score?: number;
  email?: string;
  phone?: string;
  headline?: string;
  rank?: number;
}

export const AIProspector: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Profile[]>([]);
  const [searchMeta, setSearchMeta] = useState<any>(null);
  const [sources, setSources] = useState<string[]>(['linkedin', 'naukri']);
  const [imported, setImported] = useState<Set<string>>(new Set());
  
  // Outreach Modal State
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [outreachMsg, setOutreachMsg] = useState<any>(null);
  const [genLoading, setGenLoading] = useState(false);

  // --- API CALLS ---

  const searchAPI = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResults([]);
    setSearchMeta(null);

    try {
      const res = await fetch(`${API_URL}/search/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, sources })
      });
      const data = await res.json();
      
      if (data.success) {
        setResults(data.results || []);
        setSearchMeta({
          stats: data.source_stats,
          total: data.total_consolidated,
          parsed: data.parsed_criteria
        });
      } else {
        alert("AI Error: " + (data.error || data.message));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to backend.");
    }
    setLoading(false);
  };

  const importAPI = async (profile: Profile) => {
    try {
      const res = await fetch(`${API_URL}/import_lead/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (!res.ok) throw new Error('Import failed');
      setImported(prev => new Set(prev).add(profile.profile_url));
    } catch (e) { console.error(e); }
  };

  // ✅ ADDED MISSING FUNCTION
  const bulkImportAPI = async () => {
    const toImport = results.filter(p => !imported.has(p.profile_url));
    if (!toImport.length) return;

    if (!confirm(`Import ${toImport.length} leads to CRM?`)) return;

    try {
      const res = await fetch(`${API_URL}/import_bulk/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profiles: toImport })
      });
      
      if (!res.ok) throw new Error('Bulk import failed');
      
      const newSet = new Set(imported);
      toImport.forEach(p => newSet.add(p.profile_url));
      setImported(newSet);
      alert(`Successfully imported ${toImport.length} leads!`);
    } catch (e) { console.error(e); alert("Bulk import failed"); }
  };

  // ✅ ADDED MISSING FUNCTION
  const generateOutreachAPI = async (channel: string) => {
    if (!activeProfile) return;
    setGenLoading(true);
    setOutreachMsg(null);
    try {
      const res = await fetch(`${API_URL}/generate_outreach/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: activeProfile, channel })
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Generation failed');
      setOutreachMsg(data);
    } catch (e) { console.error(e); alert("Failed to generate message"); }
    setGenLoading(false);
  };

  const toggleSource = (s: string) => {
    setSources(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-slate-50 font-sans">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
          <Sparkles size={32} className="text-indigo-600" /> AI Multi-Source Prospector
        </h2>
        <p className="text-slate-500 mt-1">Search real profiles on LinkedIn & Naukri via AI.</p>
      </header>

      {/* Search Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="e.g. Find Marketing Managers in Kerala" 
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-medium text-slate-700"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchAPI()}
            />
          </div>
          <button 
            onClick={searchAPI} 
            disabled={loading || !prompt}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50 min-w-[140px] justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search />} Search
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><Filter size={12}/> Sources:</span>
          {[
            { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
            { id: 'naukri', label: 'Naukri', icon: Globe },
            { id: 'apollo', label: 'Apollo (Optional)', icon: Zap },
          ].map(src => (
            <button 
              key={src.id} 
              onClick={() => toggleSource(src.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${sources.includes(src.id) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
            >
              <src.icon size={12} /> {src.label} {sources.includes(src.id) && <CheckCircle2 size={10} />}
            </button>
          ))}
        </div>
      </div>

      {/* Meta Stats */}
      {searchMeta && (
        <div className="flex gap-4 mb-6">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700">
            Found: {searchMeta.total}
          </div>
          {Object.entries(searchMeta.stats || {}).map(([k, v]) => (
            <div key={k} className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-500 capitalize">
              {k}: <strong>{v as any}</strong>
            </div>
          ))}
        </div>
      )}

      {/* Results Header */}
      {results.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-700">Search Results</h3>
          <button onClick={bulkImportAPI} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-900 shadow-sm transition">
            <Download size={14} /> Import All Leads
          </button>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-4">
        {results.map((p, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-xl border transition hover:shadow-md ${imported.has(p.profile_url) ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-lg shrink-0 uppercase">
                {p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg truncate flex items-center gap-2">
                      {p.name}
                      {p.relevance_score && p.relevance_score > 80 && (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                          <Star size={10} fill="currentColor"/> {p.relevance_score}% Match
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-slate-600 flex items-center gap-2 mt-0.5 truncate">
                      <Briefcase size={14} className="text-slate-400"/> {p.title} 
                      {p.company && <span className="text-slate-400">•</span>} 
                      {p.company && <span className="flex items-center gap-1 truncate"><Building2 size={14} className="text-slate-400"/> {p.company}</span>}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 truncate"><MapPin size={12}/> {p.location || "Location Unknown"}</p>
                  </div>
                  
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border shrink-0 ${
                    p.source.toLowerCase().includes('linkedin') ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                    p.source.toLowerCase().includes('naukri') ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                    'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    {p.source}
                  </span>
                </div>

                {p.relevance_reason && (
                  <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-lg p-2 text-xs text-indigo-800">
                    <strong>AI Insight:</strong> {p.relevance_reason}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <a href={p.profile_url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 transition">
                    <ExternalLink size={12}/> View Profile
                  </a>
                  
                  <button onClick={() => { setActiveProfile(p); setOutreachMsg(null); }} className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold flex items-center gap-1 transition">
                    <MessageCircle size={12}/> AI Outreach
                  </button>

                  <button 
                    onClick={() => importAPI(p)} 
                    disabled={imported.has(p.profile_url)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                      imported.has(p.profile_url) ? 'bg-emerald-100 text-emerald-700 cursor-default border border-emerald-200' : 'bg-slate-800 hover:bg-slate-900 text-white'
                    }`}
                  >
                    {imported.has(p.profile_url) ? <CheckCircle2 size={12}/> : <UserPlus size={12}/>} 
                    {imported.has(p.profile_url) ? 'Imported' : 'Add to CRM'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!loading && results.length === 0 && prompt && (
        <div className="text-center py-20 text-slate-400">
          <Search size={48} className="mx-auto mb-4 opacity-20"/>
          <p>No profiles found. Try simpler keywords.</p>
        </div>
      )}

      {/* Outreach Modal */}
      {activeProfile && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Outreach Generator</h3>
                <p className="text-xs text-slate-500">For {activeProfile.name} • {activeProfile.company}</p>
              </div>
              <button onClick={() => setActiveProfile(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="p-6">
              {!outreachMsg ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 font-medium">Choose a channel to generate a personalized message:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => generateOutreachAPI('LinkedIn')} disabled={genLoading} className="p-4 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition text-sm font-bold text-slate-600 flex flex-col items-center gap-2 group">
                      <Linkedin size={24} className="text-blue-600 group-hover:scale-110 transition"/> LinkedIn
                    </button>
                    <button onClick={() => generateOutreachAPI('Email')} disabled={genLoading} className="p-4 border border-slate-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition text-sm font-bold text-slate-600 flex flex-col items-center gap-2 group">
                      <MessageCircle size={24} className="text-orange-500 group-hover:scale-110 transition"/> Cold Email
                    </button>
                  </div>
                  {genLoading && (
                    <div className="flex items-center justify-center gap-2 text-indigo-600 py-4">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-sm font-bold">AI is writing...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {outreachMsg.subject && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject Line</label>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800 mt-1 select-all">
                        {outreachMsg.subject}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message Body</label>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 mt-1 whitespace-pre-wrap leading-relaxed select-all h-40 overflow-y-auto custom-scrollbar">
                      {outreachMsg.message}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setActiveProfile(null)} className="flex-1 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-bold transition">Close</button>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(outreachMsg.message); alert("Copied!"); }} 
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-sm"
                    >
                      Copy Text
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};