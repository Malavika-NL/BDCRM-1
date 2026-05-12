import React, { useEffect, useState } from 'react';
import {
  Wand2,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Mail,
  Linkedin,
  Building2,
  LayoutTemplate,
  Target,
  Briefcase,
  MapPin,
  Bot,
  Loader2,
  FileText,
  PenSquare,
  Orbit,
  PencilLine,
  Save,
  Rocket,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:8000/api';

interface DropdownItem {
  id: number;
  name: string;
}

export const CampaignWorkspaceCreate = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');

  const [verticals, setVerticals] = useState<DropdownItem[]>([]);
  const [regions, setRegions] = useState<DropdownItem[]>([]);

  const [form, setForm] = useState({
    name: '',
    brand_name: '',
    content_theme: '',
    target_description: '',
    selected_channel: 'whatsapp',
    selected_vertical: '',
    selected_region: '',
    prompt: '',
    manual_subject: '',
    manual_content: '',
    manual_cta: '',
    manual_audience_hint: '',
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [vertRes, regRes] = await Promise.all([
          fetch(`${API_BASE}/verticals/`),
          fetch(`${API_BASE}/regions/`),
        ]);

        setVerticals(await vertRes.json());
        setRegions(await regRes.json());
      } catch (err) {
        console.error('Failed to load dropdown data', err);
      }
    };
    fetchDropdowns();
  }, []);

  const handleGenerate = async () => {
    if (!form.name) return alert('Workspace Name is required!');
    if (!form.prompt) return alert('AI Prompt is required!');

    setIsGenerating(true);
    try {
      const payload: Record<string, any> = {
        name: form.name,
        brand_name: form.brand_name,
        content_theme: form.content_theme,
        target_description: form.target_description,
        selected_channel: form.selected_channel,
        prompt: form.prompt,
      };

      if (form.selected_vertical) payload.selected_vertical = parseInt(form.selected_vertical, 10);
      if (form.selected_region) payload.selected_region = parseInt(form.selected_region, 10);

      const response = await fetch(`${API_BASE}/campaign-workspace/generate_content/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Django Validation Error:', errorData);
        alert(`Validation Error: ${JSON.stringify(errorData)}`);
        setIsGenerating(false);
        return;
      }

      navigate('/campaign-workspace');
    } catch (err) {
      console.error('Network Error:', err);
      alert('Failed to connect to the server');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualCreate = async (status: 'draft' | 'ready') => {
    if (!form.name) return alert('Workspace Name is required!');
    if (!form.manual_content) return alert('Manual Content is required!');

    setIsGenerating(true);
    try {
      const payload: Record<string, any> = {
        name: form.name,
        brand_name: form.brand_name,
        content_theme: form.content_theme,
        target_description: form.target_description || form.manual_audience_hint,
        selected_channel: form.selected_channel,
        generated_subject: form.manual_subject,
        generated_content: [form.manual_content, form.manual_cta ? `CTA: ${form.manual_cta}` : '']
          .filter(Boolean)
          .join('\n\n'),
        status,
      };

      if (form.selected_vertical) payload.selected_vertical = parseInt(form.selected_vertical, 10);
      if (form.selected_region) payload.selected_region = parseInt(form.selected_region, 10);

      const response = await fetch(`${API_BASE}/campaign-workspace/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Django Validation Error:', errorData);
        alert(`Validation Error: ${JSON.stringify(errorData)}`);
        setIsGenerating(false);
        return;
      }
      navigate('/campaign-workspace');
    } catch (err) {
      console.error('Network Error:', err);
      alert('Failed to connect to the server');
    } finally {
      setIsGenerating(false);
    }
  };

  const channels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle size={22} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      active: 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50',
    },
    {
      id: 'email',
      name: 'Email',
      icon: <Mail size={22} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      active: 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin size={22} />,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      active: 'border-sky-500 ring-2 ring-sky-500/30 bg-sky-50',
    },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_10%_10%,#dbeafe_0%,#eff6ff_35%,#f0f9ff_100%)] relative">
      <style>
        {`
          @keyframes drift {
            0% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-10px) translateX(8px); }
            100% { transform: translateY(0) translateX(0); }
          }
          @keyframes rise {
            0% { opacity: 0; transform: translateY(14px) scale(0.99); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .anim-drift { animation: drift 8s ease-in-out infinite; }
          .anim-rise-1 { opacity: 0; animation: rise .55s ease-out forwards; animation-delay: .04s; }
          .anim-rise-2 { opacity: 0; animation: rise .55s ease-out forwards; animation-delay: .12s; }
          .anim-rise-3 { opacity: 0; animation: rise .55s ease-out forwards; animation-delay: .2s; }
          .anim-rise-4 { opacity: 0; animation: rise .55s ease-out forwards; animation-delay: .28s; }
        `}
      </style>

      <div className="pointer-events-none absolute -top-16 -left-12 w-80 h-80 bg-blue-300/25 rounded-full blur-3xl anim-drift" />
      <div className="pointer-events-none absolute top-40 -right-20 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl anim-drift" />

      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 pt-12 pb-24 px-8 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-sky-300 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 anim-rise-1">
          <button
            onClick={() => navigate('/campaign-workspace')}
            className="mb-6 flex items-center gap-2 text-blue-100 hover:text-white transition-colors font-medium text-sm bg-white/15 hover:bg-white/25 w-fit px-3.5 py-2 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft size={16} /> Back to Workspaces
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <Sparkles className="text-cyan-200" size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight"> Campaign Creation</h2>
              <p className="text-blue-100 mt-1 text-lg">Define parameters and let AI craft high-converting outreach.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-16 relative z-20 pb-20 space-y-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-[0_10px_40px_rgba(37,99,235,0.15)] border border-blue-100 anim-rise-2 hover:shadow-[0_14px_50px_rgba(37,99,235,0.2)] transition-shadow">
          <SectionTitle icon={FileText} title="1. Campaign Identity" accent="text-blue-600" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Field
              label="Workspace Name"
              required
              icon={LayoutTemplate}
              placeholder="e.g., Q3 Enterprise Software Push"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              focus="focus:border-blue-500 focus:ring-blue-500/10"
              className="md:col-span-2"
            />

            <Field
              label="Brand / Company Name"
              icon={Building2}
              placeholder="Your Company Name"
              value={form.brand_name}
              onChange={(v) => setForm({ ...form, brand_name: v })}
              focus="focus:border-blue-500 focus:ring-blue-500/10"
            />

            <Field
              label="Content Theme"
              icon={Orbit}
              placeholder="e.g., Summer Offer, Feature Launch"
              value={form.content_theme}
              onChange={(v) => setForm({ ...form, content_theme: v })}
              focus="focus:border-blue-500 focus:ring-blue-500/10"
            />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-[0_10px_36px_rgba(59,130,246,0.12)] border border-blue-100 anim-rise-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-bold text-slate-700">Creation Mode</p>
              <p className="text-xs text-slate-500">Choose AI-assisted generation or fully manual workspace creation.</p>
            </div>
            <div className="inline-flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setMode('ai')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  mode === 'ai' ? 'bg-blue-600 text-white shadow' : 'text-slate-600'
                }`}
              >
                <span className="inline-flex items-center gap-2"><Wand2 size={15} /> AI Generate</span>
              </button>
              <button
                onClick={() => setMode('manual')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  mode === 'manual' ? 'bg-blue-600 text-white shadow' : 'text-slate-600'
                }`}
              >
                <span className="inline-flex items-center gap-2"><PencilLine size={15} /> Manual Compose</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-[0_10px_40px_rgba(14,165,233,0.13)] border border-cyan-100 anim-rise-3 hover:shadow-[0_14px_50px_rgba(14,165,233,0.18)] transition-shadow">
          <SectionTitle icon={Target} title="2. Audience & Delivery" accent="text-cyan-600" />

          <div className="mb-8 mt-6">
            <label className="text-sm font-bold text-slate-700 block mb-3">Delivery Channel</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setForm({ ...form, selected_channel: ch.id })}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 ${
                    form.selected_channel === ch.id
                      ? ch.active
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-3 rounded-full mb-2 ${ch.bg} ${ch.color}`}>{ch.icon}</div>
                  <span className={`font-bold ${form.selected_channel === ch.id ? 'text-slate-900' : 'text-slate-600'}`}>{ch.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <SelectField
              label="Target Vertical"
              icon={Briefcase}
              value={form.selected_vertical}
              onChange={(v) => setForm({ ...form, selected_vertical: v })}
              options={verticals}
              placeholder="Select Industry Vertical"
              focus="focus:border-cyan-500 focus:ring-cyan-500/10"
            />

            <SelectField
              label="Target Region"
              icon={MapPin}
              value={form.selected_region}
              onChange={(v) => setForm({ ...form, selected_region: v })}
              options={regions}
              placeholder="Select Region"
              focus="focus:border-cyan-500 focus:ring-cyan-500/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Detailed Audience Description</label>
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none min-h-[120px] resize-y"
              placeholder="e.g., IT Directors and CTOs in mid-sized logistics companies facing high operational costs."
              value={form.target_description}
              onChange={(e) => setForm({ ...form, target_description: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-[0_10px_40px_rgba(59,130,246,0.12)] border border-blue-100 relative overflow-hidden anim-rise-4 hover:shadow-[0_14px_50px_rgba(59,130,246,0.18)] transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/45 to-cyan-50/45 pointer-events-none" />

          <div className="relative z-10">
            <SectionTitle
              icon={mode === 'ai' ? Bot : PencilLine}
              title={mode === 'ai' ? '3. AI Instructions' : '3. Manual Content Composer'}
              accent="text-indigo-600"
              required
            />

            {mode === 'ai' ? (
              <div className="space-y-1.5 mt-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">What should the AI write about?</label>
                  <span className="text-xs text-slate-500">{form.prompt.trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <div className="relative">
                  <PenSquare className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea
                    className="w-full pl-11 p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none min-h-[160px] resize-y"
                    placeholder="Give clear instructions. Example: Write an urgent 60-word message emphasizing ROI and requesting a 15-minute demo call."
                    value={form.prompt}
                    onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <Field
                    label="Subject Line"
                    icon={Mail}
                    placeholder="e.g., Cut Operating Cost by 30% This Quarter"
                    value={form.manual_subject}
                    onChange={(v) => setForm({ ...form, manual_subject: v })}
                    focus="focus:border-indigo-500 focus:ring-indigo-500/10"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-700">Message Content <span className="text-rose-500">*</span></label>
                      <span className="text-xs text-slate-500">{form.manual_content.trim().split(/\\s+/).filter(Boolean).length} words</span>
                    </div>
                    <textarea
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none min-h-[180px] resize-y"
                      placeholder="Write your campaign message manually..."
                      value={form.manual_content}
                      onChange={(e) => setForm({ ...form, manual_content: e.target.value })}
                    />
                  </div>
                  <Field
                    label="Call To Action"
                    icon={Target}
                    placeholder="e.g., Reply YES for a 15-min strategy call"
                    value={form.manual_cta}
                    onChange={(v) => setForm({ ...form, manual_cta: v })}
                    focus="focus:border-indigo-500 focus:ring-indigo-500/10"
                  />
                  <Field
                    label="Audience Hint"
                    icon={Briefcase}
                    placeholder="e.g., CTOs in logistics with legacy ERP"
                    value={form.manual_audience_hint}
                    onChange={(v) => setForm({ ...form, manual_audience_hint: v })}
                    focus="focus:border-indigo-500 focus:ring-indigo-500/10"
                  />
                </div>
                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-5">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-2">Live Preview</p>
                  <h4 className="text-sm font-bold text-slate-800">{form.manual_subject || 'Your subject will appear here'}</h4>
                  <p className="text-sm text-slate-600 mt-3 whitespace-pre-wrap">{form.manual_content || 'Your manual content preview will appear here.'}</p>
                  {form.manual_cta && <p className="text-sm font-semibold text-blue-700 mt-4">CTA: {form.manual_cta}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 anim-rise-4">
          <button
            onClick={() => navigate('/campaign-workspace')}
            className="px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          {mode === 'ai' ? (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                isGenerating
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Compiling Data...</span>
              ) : (
                <span className="flex items-center gap-2"><Wand2 size={18} /> Generate Campaign Draft</span>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleManualCreate('draft')}
                disabled={isGenerating}
                className="px-5 py-3.5 rounded-xl font-bold flex items-center gap-2 text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all"
              >
                <Save size={18} /> Save Draft
              </button>
              <button
                onClick={() => handleManualCreate('ready')}
                disabled={isGenerating}
                className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                  isGenerating
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                <Rocket size={18} /> Publish Manual Workspace
              </button>
            </div>
          )}
        </div>
      </div>

      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-10 flex flex-col items-center shadow-2xl max-w-sm w-full mx-4 animate-[rise_.28s_ease-out]">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-cyan-600">
                <Wand2 size={32} className="animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">AI is working...</h3>
            <p className="text-center text-slate-500 text-sm font-medium">
              Analyzing audience, blending parameters, and drafting your campaign message.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

type FieldProps = {
  label: string;
  required?: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  focus: string;
  className?: string;
};

const Field = ({ label, required, icon: Icon, placeholder, value, onChange, focus, className }: FieldProps) => (
  <div className={`space-y-1.5 ${className || ''}`}>
    <label className="text-sm font-bold text-slate-700">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
      <input
        className={`w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-4 transition-all outline-none ${focus}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

type SelectFieldProps = {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string;
  onChange: (value: string) => void;
  options: DropdownItem[];
  placeholder: string;
  focus: string;
};

const SelectField = ({ label, icon: Icon, value, onChange, options, placeholder, focus }: SelectFieldProps) => (
  <div className="space-y-1.5">
    <label className="text-sm font-bold text-slate-700">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-3.5 text-slate-400 z-10" size={18} />
      <select
        className={`w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-4 transition-all outline-none appearance-none ${focus}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- {placeholder} --</option>
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const SectionTitle = ({
  icon: Icon,
  title,
  accent,
  required,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  accent: string;
  required?: boolean;
}) => (
  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
    <Icon className={accent} size={20} />
    <h3 className="text-lg font-bold text-slate-800">
      {title} {required && <span className="text-rose-500">*</span>}
    </h3>
  </div>
);

export default CampaignWorkspaceCreate;
