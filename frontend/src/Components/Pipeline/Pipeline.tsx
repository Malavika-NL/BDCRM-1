import React, { useEffect, useState } from 'react';
import { Plus, Trash2, ArrowRight, Sparkles, X, Copy, Check } from 'lucide-react';
import{ STATUS_LABELS, type Lead, STATUS_ORDER } from '../Utils/types';
import { api } from '../Utils/api';
import { AddLeadModal } from '../AddLeadModel/AddLeadModel';

// --- AI MODAL COMPONENT ---
const AIPromptModal = ({ lead, isOpen, onClose }: { lead: Lead | null, isOpen: boolean, onClose: () => void }) => {
  const [generatedText, setGeneratedText] = useState("");
  const [customInstruction, setCustomInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setGeneratedText("");
      setCustomInstruction("");
      setLoading(false);
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen || !lead) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedText("");
    try {
      const response = await api.generateAIPrompt(lead.id, customInstruction);
      setGeneratedText(response.generated_text);
    } catch (error) {
      setGeneratedText("Error generating prompt. Check your terminal for OpenAI errors.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl border border-blue-100">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-900">
            <Sparkles className="text-indigo-500" /> AI Sales Copilot
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-sm text-slate-500 mb-4">
          Drafting for <strong>{lead.name}</strong> ({lead.company}) at stage: <span className="uppercase font-semibold">{lead.status}</span>.
        </p>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
            Custom Instructions (Optional)
          </label>
          <textarea 
            placeholder="e.g., 'Make it funny', 'Mention our new pricing'"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
            rows={2}
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            disabled={loading}
          />
        </div>

        {generatedText ? (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative mb-6">
            <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">{generatedText}</p>
            <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-indigo-600 shadow-sm transition">
              {copied ? <Check size={16} className="text-emerald-500"/> : <Copy size={16}/>}
            </button>
          </div>
        ) : (
          <div className="h-32 bg-slate-50 border border-dashed border-slate-300 rounded-lg mb-6 flex items-center justify-center text-slate-400 text-sm">
            {loading ? (
              <span className="flex items-center gap-2"><Sparkles size={16} className="animate-spin text-indigo-500"/> Writing draft...</span>
            ) : "Enter instructions above and click Generate"}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
          <button onClick={handleGenerate} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50 transition">
            {loading ? <Sparkles size={16} className="animate-spin"/> : <Sparkles size={16}/>}
            {generatedText ? "Regenerate" : "Generate Draft"}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- MAIN PIPELINE COMPONENT ---
export const Pipeline = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiModalLead, setAiModalLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    try { const data = await api.getLeads(); setLeads(data); } 
    catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleCreate = async (data: any) => { await api.createLead(data); fetchLeads(); };
  const handleDelete = async (id: number) => { if(window.confirm("Delete this lead?")) { await api.deleteLead(id); setLeads(leads.filter(l => l.id !== id)); } };
  const advanceStage = async (lead: Lead) => {
    const currentIndex = STATUS_ORDER.indexOf(lead.status);
    if (currentIndex < STATUS_ORDER.length - 1) { await api.updateLeadStatus(lead.id, STATUS_ORDER[currentIndex + 1]); fetchLeads(); }
  };

  if (loading) return <div className="p-8">Loading CRM Data...</div>;

  return (
    <div className="p-8 h-screen flex flex-col bg-slate-50 overflow-hidden">
      <header className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Deal Pipeline</h2>
          <p className="text-slate-500">Track and manage your leads through stages.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={18} /> Add Deal
        </button>
      </header>
      
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-[1200px]">
          {STATUS_ORDER.map((status) => (
            <div key={status} className="flex-1 flex flex-col min-w-[280px] bg-slate-100 rounded-xl border border-slate-200">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-200/50 rounded-t-xl">
                <h3 className="font-semibold text-slate-700">{STATUS_LABELS[status]}</h3>
                <span className="bg-white text-slate-600 text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
                  {leads.filter(l => l.status === status).length}
                </span>
              </div>

              <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {leads.filter(lead => lead.status === status).map(lead => (
                  <div key={lead.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all group relative">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{lead.company}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setAiModalLead(lead)} className="text-indigo-400 hover:text-indigo-600 bg-indigo-50 p-1 rounded transition" title="Generate AI Draft"><Sparkles size={14} /></button>
                        <button onClick={() => handleDelete(lead.id)} className="text-slate-400 hover:text-red-500 bg-red-50 p-1 rounded transition" title="Delete Lead"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-1 pr-8">{lead.name}</h4>
                    <p className="text-slate-500 text-sm mb-4 font-medium">${parseFloat(lead.value).toLocaleString()}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                       <span className="text-xs text-slate-400 font-medium">{new Date(lead.created_at).toLocaleDateString()}</span>
                       {status !== 'lost' && status !== 'won' && (
                         <button onClick={() => advanceStage(lead)} className="text-xs flex items-center gap-1 text-blue-600 hover:underline font-bold">Next <ArrowRight size={12}/></button>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreate} />
      <AIPromptModal lead={aiModalLead} isOpen={aiModalLead !== null} onClose={() => setAiModalLead(null)} />
    </div>
  );
};