// import React, { useEffect, useMemo, useState, useCallback } from 'react';
// import {
//   CheckCircle2, Plus, RefreshCcw, Users,
//   Target, Phone, MessageSquare, Mail,
//   Linkedin, Sparkles, Trash2, Settings,
//   Calendar, Layers, ChevronLeft
// } from 'lucide-react';
// import { api } from '../Utils/api';
// import type { ActivityPlanner, PlannerTask } from '../Utils/types';

// type Step = 1 | 2 | 3;
// type PlannerView = 'month' | 'week';
// type Channel = 'calls' | 'whatsapp' | 'email' | 'linkedin';

// type PlannedDay = {
//   date: string;
//   byChannel: Record<Channel, number>;
//   total: number;
// };

// type PlannedWeek = {
//   week: number;
//   startDate: string;
//   endDate: string;
//   days: PlannedDay[];
//   totals: Record<Channel, number>;
//   total: number;
// };

// type PlannerWeekendConfig = {
//   working_weekend_dates: string[];
// };

// const MONTHS = Array.from({ length: 12 }, (_, i) => ({
//   value: i + 1,
//   label: new Date(2000, i, 1).toLocaleString('en', { month: 'long' }),
// }));

// const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// const CHANNEL_CONFIG: Record<Channel, {
//   icon: React.ReactNode; color: string; bg: string; text: string;
//   border: string; label: string;
// }> = {
//   calls: { icon: <Phone size={11} />, color: 'text-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Calls' },
//   whatsapp: { icon: <MessageSquare size={11} />, color: 'text-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'WhatsApp' },
//   email: { icon: <Mail size={11} />, color: 'text-amber-600', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Email' },
//   linkedin: { icon: <Linkedin size={11} />, color: 'text-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'LinkedIn' },
// };

// const StepPill = ({ current, step, label, icon }: { current: number; step: number; label: string; icon: React.ReactNode; }) => {
//   const done = current > step;
//   const active = current === step;
//   return (
//     <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${done ? 'bg-emerald-100 text-emerald-700' : active ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'}`}>
//       {done ? <CheckCircle2 size={12} /> : icon}{label}
//     </div>
//   );
// };

// const NumericInput = ({ value, onChange, min = 0, max, className = '' }: { value: number; onChange: (v: number) => void; min?: number; max?: number; className?: string; }) => {
//   const [local, setLocal] = useState(String(value));
//   useEffect(() => { setLocal(String(value)); }, [value]);
//   return (
//     <input type="text" inputMode="numeric" value={local} className={className}
//       onChange={e => {
//         const raw = e.target.value;
//         if (raw === '' || /^\d*$/.test(raw)) setLocal(raw);
//         const n = parseInt(raw, 10);
//         if (!isNaN(n)) onChange(max !== undefined ? Math.min(max, Math.max(min, n)) : Math.max(min, n));
//       }}
//     />
//   );
// };

// const ymd = (d: Date) => {
//   const y = d.getFullYear();
//   const m = `${d.getMonth() + 1}`.padStart(2, '0');
//   const day = `${d.getDate()}`.padStart(2, '0');
//   return `${y}-${m}-${day}`;
// };

// const getDaysInMonth = (month: number, year: number) => {
//   const date = new Date(year, month - 1, 1);
//   const days: Date[] = [];
//   while (date.getMonth() === month - 1) {
//     days.push(new Date(date));
//     date.setDate(date.getDate() + 1);
//   }
//   return days;
// };

// const getWeekendDaysInMonth = (month: number, year: number) =>
//   getDaysInMonth(month, year).filter(d => {
//     const day = d.getDay();
//     return day === 0 || day === 6;
//   });

// const spreadAcrossDays = (total: number, dayCount: number) => {
//   if (dayCount <= 0) return [];
//   const safeTotal = Math.max(0, total || 0);
//   const base = Math.floor(safeTotal / dayCount);
//   const rem = safeTotal % dayCount;
//   return Array.from({ length: dayCount }, (_, i) => base + (i < rem ? 1 : 0));
// };

// const spreadAcrossWeeksThenDays = (
//   total: number,
//   monthDays: Date[],
//   workingWeekendDates: string[],
// ): number[] => {
//   const workingWeekendSet = new Set(workingWeekendDates);
//   const weekWorkingDayIndexes = new Map<number, number[]>();

//   monthDays.forEach((d, i) => {
//     const dow = d.getDay();
//     const isWeekend = dow === 0 || dow === 6;
//     const isWorking = !isWeekend || workingWeekendSet.has(ymd(d));
//     if (!isWorking) return;
//     const week = Math.ceil(d.getDate() / 7);
//     if (!weekWorkingDayIndexes.has(week)) weekWorkingDayIndexes.set(week, []);
//     weekWorkingDayIndexes.get(week)!.push(i);
//   });

//   const weekNumbers = Array.from(weekWorkingDayIndexes.keys()).sort((a, b) => a - b);
//   const byDay = Array(monthDays.length).fill(0);
//   if (weekNumbers.length === 0) return byDay;

//   const weeklySplit = spreadAcrossDays(total, weekNumbers.length);
//   weekNumbers.forEach((week, idx) => {
//     const dayIndexes = weekWorkingDayIndexes.get(week) || [];
//     const perDay = spreadAcrossDays(weeklySplit[idx] || 0, dayIndexes.length);
//     dayIndexes.forEach((monthIdx, dayIdx) => {
//       byDay[monthIdx] = perDay[dayIdx] || 0;
//     });
//   });

//   return byDay;
// };

// const parseWeekendConfigFromNotes = (notes: string | null | undefined): PlannerWeekendConfig => {
//   if (!notes) return { working_weekend_dates: [] };
//   try {
//     const parsed = JSON.parse(notes);
//     const list = Array.isArray(parsed?.working_weekend_dates) ? parsed.working_weekend_dates : [];
//     return { working_weekend_dates: list.filter((d: unknown) => typeof d === 'string') };
//   } catch {
//     return { working_weekend_dates: [] };
//   }
// };

// const buildAutoPlanFromTargets = (
//   member: any,
//   month: number,
//   year: number,
//   workingWeekendDates: string[],
// ): PlannedWeek[] => {
//   const monthDays = getDaysInMonth(month, year);
//   const dailyByChannel: Record<Channel, number[]> = {
//     calls: spreadAcrossWeeksThenDays(member.monthly_calls_target, monthDays, workingWeekendDates),
//     whatsapp: spreadAcrossWeeksThenDays(member.monthly_whatsapp_target, monthDays, workingWeekendDates),
//     email: spreadAcrossWeeksThenDays(member.monthly_email_target, monthDays, workingWeekendDates),
//     linkedin: spreadAcrossWeeksThenDays(member.monthly_linkedin_target, monthDays, workingWeekendDates),
//   };

//   const weekMap = new Map<number, PlannedWeek>();
//   monthDays.forEach((d, i) => {
//     const week = Math.ceil(d.getDate() / 7);
//     if (!weekMap.has(week)) {
//       weekMap.set(week, {
//         week,
//         startDate: ymd(d),
//         endDate: ymd(d),
//         days: [],
//         totals: { calls: 0, whatsapp: 0, email: 0, linkedin: 0 },
//         total: 0,
//       });
//     }
//     const w = weekMap.get(week)!;
//     const byChannel = {
//       calls: dailyByChannel.calls[i],
//       whatsapp: dailyByChannel.whatsapp[i],
//       email: dailyByChannel.email[i],
//       linkedin: dailyByChannel.linkedin[i],
//     };
//     const total = byChannel.calls + byChannel.whatsapp + byChannel.email + byChannel.linkedin;
//     w.days.push({ date: ymd(d), byChannel, total });
//     w.totals.calls += byChannel.calls;
//     w.totals.whatsapp += byChannel.whatsapp;
//     w.totals.email += byChannel.email;
//     w.totals.linkedin += byChannel.linkedin;
//     w.total += total;
//     w.endDate = ymd(d);
//   });

//   return Array.from(weekMap.values()).sort((a, b) => a.week - b.week);
// };

// const isWorkingDate = (date: string, workingWeekendDates: string[]) => {
//   const d = new Date(`${date}T00:00:00`);
//   const day = d.getDay();
//   if (day !== 0 && day !== 6) return true;
//   return workingWeekendDates.includes(date);
// };

// const forceLeaveDaysToZero = (weeks: PlannedWeek[], workingWeekendDates: string[]) => {
//   return weeks.map(w => {
//     const nextDays = w.days.map(d => {
//       if (isWorkingDate(d.date, workingWeekendDates)) return d;
//       return {
//         ...d,
//         byChannel: { calls: 0, whatsapp: 0, email: 0, linkedin: 0 },
//         total: 0,
//       };
//     });

//     const totals = nextDays.reduce(
//       (acc, d) => ({
//         calls: acc.calls + d.byChannel.calls,
//         whatsapp: acc.whatsapp + d.byChannel.whatsapp,
//         email: acc.email + d.byChannel.email,
//         linkedin: acc.linkedin + d.byChannel.linkedin,
//       }),
//       { calls: 0, whatsapp: 0, email: 0, linkedin: 0 },
//     );

//     return {
//       ...w,
//       days: nextDays,
//       totals,
//       total: totals.calls + totals.whatsapp + totals.email + totals.linkedin,
//     };
//   });
// };

// export function ActivityPlannerPage() {
//   const [step, setStep] = useState<Step>(1);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [planners, setPlanners] = useState<ActivityPlanner[]>([]);
//   const [plannerId, setPlannerId] = useState<number | null>(null);
//   const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

//   const [planName, setPlanName] = useState('Monthly Activity Planner');
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [workingWeekendDates, setWorkingWeekendDates] = useState<string[]>([]);
//   const [members, setMembers] = useState<any[]>([{
//     member_name: '', workspace_name: '',
//     monthly_calls_target: 100, monthly_whatsapp_target: 80,
//     monthly_email_target: 60, monthly_linkedin_target: 40,
//     calls_weightage: 25, whatsapp_weightage: 25,
//     email_weightage: 25, linkedin_weightage: 25,
//   }]);

//   const [plannerView, setPlannerView] = useState<PlannerView>('month');
//   const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

//   const selectedPlanner = useMemo(() => planners.find(p => p.id === plannerId) || null, [planners, plannerId]);
//   const weekendOptions = useMemo(
//     () => getWeekendDaysInMonth(month, year).map(d => ymd(d)),
//     [month, year],
//   );
//   useEffect(() => {
//     setWorkingWeekendDates(prev => prev.filter(d => weekendOptions.includes(d)));
//   }, [weekendOptions]);
//   const selectedPlannerWeekendConfig = useMemo(
//     () => parseWeekendConfigFromNotes(selectedPlanner?.notes),
//     [selectedPlanner?.notes],
//   );
//   const calendarWeekendOptions = useMemo(() => {
//     if (!selectedPlanner) return [];
//     return getWeekendDaysInMonth(selectedPlanner.month, selectedPlanner.year).map(d => ymd(d));
//   }, [selectedPlanner]);

//   const activeMemberPlan = useMemo(() => {
//     if (!selectedPlanner) return null;
//     return selectedPlanner.member_plans.find(m => m.id === selectedMemberId) || selectedPlanner.member_plans[0] || null;
//   }, [selectedPlanner, selectedMemberId]);

//   useEffect(() => {
//     if (selectedPlanner && selectedPlanner.member_plans.length > 0) {
//       if (!selectedMemberId || !selectedPlanner.member_plans.some(m => m.id === selectedMemberId)) {
//         setSelectedMemberId(selectedPlanner.member_plans[0].id);
//       }
//     }
//   }, [selectedPlanner, selectedMemberId]);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const list = await api.getActivityPlanners();
//       setPlanners(list);
//       if (list.length > 0 && !plannerId) setPlannerId(list[0].id);
//     } finally {
//       setLoading(false);
//     }
//   }, [plannerId]);

//   useEffect(() => { load(); }, [load]);

//   const handleTaskStatusChange = async (taskId: number, status: string) => {
//     setPlanners(prev => prev.map(p => ({
//       ...p,
//       member_plans: p.member_plans.map(m => ({
//         ...m,
//         tasks: (m.tasks || []).map(t => t.id === taskId ? { ...t, status: status as any } : t),
//       })),
//     })));
//     try {
//       await api.updatePlannerTask(taskId, { status: status as any });
//       await load();
//     } catch {
//       load();
//     }
//   };

//   const handleWeekendWorkingToggle = async (date: string) => {
//     if (!selectedPlanner) return;
//     const current = parseWeekendConfigFromNotes(selectedPlanner.notes).working_weekend_dates;
//     const next = current.includes(date) ? current.filter(d => d !== date) : [...current, date];
//     const nextNotes = JSON.stringify({ working_weekend_dates: next });

//     setPlanners(prev => prev.map(p => p.id === selectedPlanner.id ? { ...p, notes: nextNotes } : p));
//     try {
//       await api.updateActivityPlanner(selectedPlanner.id, { notes: nextNotes });
//       await load();
//     } catch {
//       await load();
//     }
//   };

//   const memberWeeks = useMemo(() => {
//     if (!selectedPlanner || !activeMemberPlan) return [];
//     const auto = buildAutoPlanFromTargets(
//       activeMemberPlan,
//       selectedPlanner.month,
//       selectedPlanner.year,
//       selectedPlannerWeekendConfig.working_weekend_dates,
//     );
//     return forceLeaveDaysToZero(auto, selectedPlannerWeekendConfig.working_weekend_dates);
//   }, [selectedPlanner, activeMemberPlan, selectedPlannerWeekendConfig.working_weekend_dates]);

//   useEffect(() => {
//     if (memberWeeks.length > 0) {
//       setSelectedWeek(prev => (prev && memberWeeks.some(w => w.week === prev)) ? prev : memberWeeks[0].week);
//     } else {
//       setSelectedWeek(null);
//     }
//   }, [memberWeeks]);

//   const activeWeek = useMemo(
//     () => memberWeeks.find(w => w.week === selectedWeek) || null,
//     [memberWeeks, selectedWeek],
//   );

//   const stats = useMemo(() => {
//     if (!activeMemberPlan) return null;
//     const tasks = activeMemberPlan.tasks || [];
//     const done = tasks.filter(t => t.status === 'done').length;
//     return {
//       total: tasks.length,
//       done,
//       pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
//     };
//   }, [activeMemberPlan]);

//   return (
//     <div className="h-full flex flex-col bg-slate-50 overflow-hidden font-sans">
//       <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
//         <div className="flex items-center gap-3">
//           <div className="bg-indigo-600 p-2 rounded-xl"><Target className="text-white" size={20} /></div>
//           <div>
//             <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">Activity Architect</h1>
//             <p className="text-[10px] text-slate-400 font-bold uppercase">{selectedPlanner?.name || 'New Plan'}</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <StepPill current={step} step={1} label="Setup" icon={<Settings size={12} />} />
//           <StepPill current={step} step={2} label="Team" icon={<Users size={12} />} />
//           <StepPill current={step} step={3} label="Calendar" icon={<Calendar size={12} />} />
//           <button onClick={load} className={`p-2 rounded-lg hover:bg-slate-100 ${loading ? 'animate-spin' : ''}`}><RefreshCcw size={16} /></button>
//         </div>
//       </header>

//       <main className="flex-1 flex min-h-0">
//         {step === 3 && selectedPlanner ? (
//           <>
//             <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
//               <div className="p-5 border-b border-slate-100">
//                 <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Team Execution</h2>
//                 <div className="space-y-2">
//                   {selectedPlanner.member_plans.map(m => (
//                     <button
//                       key={m.id}
//                       onClick={() => {
//                         setSelectedMemberId(m.id);
//                         setPlannerView('month');
//                       }}
//                       className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border ${selectedMemberId === m.id ? 'bg-indigo-50 border-indigo-200' : 'bg-transparent border-transparent hover:bg-slate-50'}`}
//                     >
//                       <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
//                         {m.member_name.charAt(0) || 'U'}
//                       </div>
//                       <div className="text-left flex-1 min-w-0">
//                         <p className={`text-xs font-bold truncate ${selectedMemberId === m.id ? 'text-indigo-900' : 'text-slate-700'}`}>{m.member_name}</p>
//                         <p className="text-[9px] text-slate-400 font-medium">{m.workspace_name || 'Workspace Active'}</p>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
//                 <div>
//                   <div className="flex justify-between items-end mb-2">
//                     <span className="text-[10px] font-black text-slate-400 uppercase">Task Completion</span>
//                     <span className="text-lg font-black text-slate-800">{stats?.pct || 0}%</span>
//                   </div>
//                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
//                     <div className="h-full bg-indigo-600 rounded-full transition-all duration-700" style={{ width: `${stats?.pct || 0}%` }} />
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
//                     <Layers size={12} className="text-indigo-500" /> Weekly Auto Distribution
//                   </h3>
//                   <div className="space-y-2">
//                     {memberWeeks.map(w => (
//                       <button
//                         key={w.week}
//                         onClick={() => {
//                           setSelectedWeek(w.week);
//                           setPlannerView('week');
//                         }}
//                         className={`w-full p-2.5 rounded-lg border text-left transition ${selectedWeek === w.week && plannerView === 'week' ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
//                       >
//                         <div className="flex items-center justify-between mb-1">
//                           <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase">Week {w.week}</span>
//                           <span className="text-[10px] font-black text-slate-700">{w.total}</span>
//                         </div>
//                         <p className="text-[10px] text-slate-500">{w.startDate} to {w.endDate}</p>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4 bg-slate-50 border-t border-slate-200">
//                 <button onClick={() => setStep(1)} className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
//                   <Plus size={14} /> Create New Plan
//                 </button>
//               </div>
//             </aside>

//             <section className="flex-1 flex flex-col bg-white overflow-hidden">
//               <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   {plannerView === 'week' && (
//                     <button
//                       onClick={() => setPlannerView('month')}
//                       className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
//                     >
//                       <ChevronLeft size={16} />
//                     </button>
//                   )}
//                   <h2 className="text-xl font-black text-slate-800">
//                     {plannerView === 'month'
//                       ? `${MONTHS.find(m => m.value === selectedPlanner.month)?.label} ${selectedPlanner.year} Weekly View`
//                       : `Week ${activeWeek?.week} Daily Calendar (${activeWeek?.startDate} to ${activeWeek?.endDate})`}
//                   </h2>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   {Object.entries(CHANNEL_CONFIG).map(([key, cfg]) => (
//                     <div key={key} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100">
//                       <div className={cfg.color}>{cfg.icon}</div>
//                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{cfg.label}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50">
//                 <div className="flex items-center justify-between gap-3 mb-2">
//                   <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Admin Weekend Controls</p>
//                   <p className="text-[11px] text-slate-500">
//                     Sat/Sun default to Leave. Select dates to make them Working.
//                   </p>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {calendarWeekendOptions.map(date => {
//                     const active = selectedPlannerWeekendConfig.working_weekend_dates.includes(date);
//                     const day = new Date(`${date}T00:00:00`);
//                     return (
//                       <button
//                         key={date}
//                         type="button"
//                         onClick={() => handleWeekendWorkingToggle(date)}
//                         className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition ${
//                           active
//                             ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
//                             : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
//                         }`}
//                       >
//                         {date} {day.getDay() === 6 ? 'Sat' : 'Sun'} {active ? 'Working' : 'Leave'}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {plannerView === 'month' ? (
//                 <div className="p-6 overflow-y-auto">
//                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//                     {memberWeeks.map(w => (
//                       <button
//                         key={w.week}
//                         onClick={() => {
//                           setSelectedWeek(w.week);
//                           setPlannerView('week');
//                         }}
//                         className="text-left p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
//                       >
//                         <div className="flex justify-between items-center mb-3">
//                           <span className="text-xs font-black uppercase text-indigo-700 bg-indigo-100 px-2 py-1 rounded-lg">Week {w.week}</span>
//                           <span className="text-sm font-black text-slate-800">{w.total} Activities</span>
//                         </div>
//                         <div className="grid grid-cols-2 gap-2">
//                           {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
//                             <div key={ch} className={`p-2 rounded-lg border ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].border}`}>
//                               <p className={`text-[10px] font-black uppercase ${CHANNEL_CONFIG[ch].text}`}>{CHANNEL_CONFIG[ch].label}</p>
//                               <p className="text-sm font-black text-slate-800">{w.totals[ch]}</p>
//                             </div>
//                           ))}
//                         </div>
//                         <p className="mt-3 text-[11px] text-slate-500">Click to view day-wise calendar</p>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex-1 overflow-y-auto custom-scrollbar">
//                   <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
//                     {DAYS_OF_WEEK.map(day => (
//                       <div key={day} className="py-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                         {day}
//                       </div>
//                     ))}
//                   </div>

//                   {activeWeek && (() => {
//                     const firstDate = new Date(`${activeWeek.startDate}T00:00:00`);
//                     const blanks = Array(firstDate.getDay()).fill(null);
//                     const cells = [...blanks, ...activeWeek.days];

//                     return (
//                       <div className="grid grid-cols-7 auto-rows-[minmax(140px,auto)]">
//                         {cells.map((day, i) => {
//                           if (!day) return <div key={`blank-${i}`} className="bg-slate-50/30 border-r border-b border-slate-100" />;
//                           const dateTasks = (activeMemberPlan?.tasks || []).filter(t => t.task_date === day.date);
//                           const dayDate = new Date(`${day.date}T00:00:00`);
//                           const dow = dayDate.getDay();
//                           const isWeekend = dow === 0 || dow === 6;
//                           const isWorkingWeekend = selectedPlannerWeekendConfig.working_weekend_dates.includes(day.date);
//                           const isLeaveDay = isWeekend && !isWorkingWeekend;

//                           return (
//                             <div key={day.date} className={`p-2 border-r border-b border-slate-100 ${isLeaveDay ? 'bg-rose-50/40' : ''}`}>
//                               <div className="flex items-center justify-between mb-2">
//                                 <span className="text-xs font-black text-slate-700">{dayDate.getDate()}</span>
//                                 <div className="flex items-center gap-1.5">
//                                   {isLeaveDay && <span className="text-[9px] font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">Leave</span>}
//                                   <span className="text-[10px] font-black text-indigo-600">{day.total}</span>
//                                 </div>
//                               </div>

//                               <div className="space-y-1">
//                                 {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
//                                   <div key={ch} className={`px-2 py-1 rounded border text-[10px] font-bold flex justify-between ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].border}`}>
//                                     <span className={CHANNEL_CONFIG[ch].text}>{CHANNEL_CONFIG[ch].label}</span>
//                                     <span className={CHANNEL_CONFIG[ch].text}>{day.byChannel[ch]}</span>
//                                   </div>
//                                 ))}
//                               </div>

//                               {!isLeaveDay && dateTasks.length > 0 && (
//                                 <div className="mt-2 space-y-1">
//                                   {dateTasks.slice(0, 2).map(t => (
//                                     <button
//                                       key={t.id}
//                                       onClick={() => handleTaskStatusChange(t.id, t.status === 'pending' ? 'in_progress' : t.status === 'in_progress' ? 'done' : 'pending')}
//                                       className="w-full text-left text-[10px] px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50"
//                                     >
//                                       {t.title}
//                                     </button>
//                                   ))}
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     );
//                   })()}
//                 </div>
//               )}
//             </section>
//           </>
//         ) : (
//           <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
//             {step === 1 && (
//               <div className="max-w-md w-full space-y-6">
//                 <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
//                   <Sparkles className="text-indigo-400 mb-4" />
//                   <h2 className="text-2xl font-black mb-2">Build Strategy</h2>
//                   <p className="text-slate-400 text-sm">Create an automated activity roadmap for your sales team.</p>
//                 </div>
//                 <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
//                   <div>
//                     <label className="text-xs font-black text-slate-400 uppercase">Plan Name</label>
//                     <input className="w-full mt-1 p-3 bg-slate-50 border-none rounded-2xl font-bold" value={planName} onChange={e => setPlanName(e.target.value)} />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-xs font-black text-slate-400 uppercase">Month</label>
//                       <select className="w-full mt-1 p-3 bg-slate-50 border-none rounded-2xl font-bold" value={month} onChange={e => setMonth(Number(e.target.value))}>
//                         {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="text-xs font-black text-slate-400 uppercase">Year</label>
//                       <input type="number" className="w-full mt-1 p-3 bg-slate-50 border-none rounded-2xl font-bold" value={year} onChange={e => setYear(Number(e.target.value))} />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="text-xs font-black text-slate-400 uppercase">Weekend Working Days (Admin)</label>
//                     <p className="text-[11px] text-slate-500 mt-1 mb-2">
//                       Weekdays are always working. Select Saturday/Sunday dates that should also be treated as working.
//                     </p>
//                     <div className="grid grid-cols-4 gap-2">
//                       {weekendOptions.map(date => {
//                         const active = workingWeekendDates.includes(date);
//                         const day = new Date(`${date}T00:00:00`);
//                         return (
//                           <button
//                             type="button"
//                             key={date}
//                             onClick={() => {
//                               setWorkingWeekendDates(prev =>
//                                 prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date],
//                               );
//                             }}
//                             className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition ${
//                               active
//                                 ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
//                                 : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
//                             }`}
//                           >
//                             {date.slice(8)} {day.getDay() === 6 ? 'Sat' : 'Sun'}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                   <button
//                     onClick={async () => {
//                       setSaving(true);
//                       try {
//                         const res = await api.createActivityPlanner({
//                           name: planName,
//                           month,
//                           year,
//                           status: 'active',
//                           notes: JSON.stringify({ working_weekend_dates: workingWeekendDates }),
//                         });
//                         setPlannerId(res.id);
//                         await load();
//                         setStep(2);
//                       } finally { setSaving(false); }
//                     }}
//                     className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
//                   >
//                     {saving ? 'Creating...' : 'Initialize Team Setup'}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {step === 2 && (
//               <div className="max-w-4xl w-full space-y-6">
//                 <div className="flex justify-between items-end">
//                   <div>
//                     <h2 className="text-2xl font-black text-slate-800">Assign Agents</h2>
//                     <p className="text-slate-500 text-sm">Configure targets for each team member.</p>
//                   </div>
//                   <button onClick={() => setMembers([...members, { ...members[0], member_name: '' }])} className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">+ Add Agent</button>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   {members.map((m, i) => (
//                     <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative group">
//                       <input
//                         placeholder="Agent Name"
//                         className="text-lg font-black text-slate-800 border-none focus:ring-0 p-0 mb-4 w-full"
//                         value={m.member_name}
//                         onChange={(e) => {
//                           const nm = [...members];
//                           nm[i].member_name = e.target.value;
//                           nm[i].workspace_name = `${e.target.value}'s Workspace`;
//                           setMembers(nm);
//                         }}
//                       />
//                       <div className="grid grid-cols-2 gap-3">
//                         {(['calls', 'whatsapp', 'email', 'linkedin'] as Channel[]).map(ch => (
//                           <div key={ch} className="p-3 bg-slate-50 rounded-2xl">
//                             <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5 mb-1">
//                               {CHANNEL_CONFIG[ch].icon} {ch}
//                             </label>
//                             <NumericInput
//                               className="bg-transparent font-black text-slate-700 w-full outline-none"
//                               value={m[`monthly_${ch}_target`]}
//                               onChange={v => {
//                                 const nm = [...members];
//                                 nm[i][`monthly_${ch}_target`] = v;
//                                 setMembers(nm);
//                               }}
//                             />
//                           </div>
//                         ))}
//                       </div>
//                       {members.length > 1 && (
//                         <button onClick={() => setMembers(members.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 <div className="flex gap-4">
//                   <button onClick={() => setStep(1)} className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-500">Back</button>
//                   <button
//                     onClick={async () => {
//                       if (!plannerId) return;
//                       setSaving(true);
//                       try {
//                         await api.assignPlannerMembers(plannerId, members);
//                         await load();
//                         setStep(3);
//                         setPlannerView('month');
//                       } finally { setSaving(false); }
//                     }}
//                     className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200"
//                   >
//                     {saving ? 'Generating Calendar...' : 'Deploy & View Calendar'}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default ActivityPlannerPage;



// import React, { useEffect, useMemo, useState, useCallback } from 'react';
// import {
//   CheckCircle2, Plus, RefreshCcw, Users,
//   Target, Phone, MessageSquare, Mail,
//   Linkedin, Sparkles, Trash2, Settings,
//   Calendar, Layers, ChevronLeft, Info
// } from 'lucide-react';
// import { api } from '../Utils/api';
// import type { ActivityPlanner, PlannerTask } from '../Utils/types';

// type Step = 1 | 2 | 3;
// type PlannerView = 'month' | 'week';
// type Channel = 'calls' | 'whatsapp' | 'email' | 'linkedin';

// type PlannedDay = {
//   date: string;
//   byChannel: Record<Channel, number>;
//   total: number;
// };

// type PlannedWeek = {
//   week: number;
//   startDate: string;
//   endDate: string;
//   days: PlannedDay[];
//   totals: Record<Channel, number>;
//   total: number;
// };

// type PlannerWeekendConfig = {
//   working_weekend_dates: string[];
// };

// const MONTHS = Array.from({ length: 12 }, (_, i) => ({
//   value: i + 1,
//   label: new Date(2000, i, 1).toLocaleString('en', { month: 'long' }),
// }));

// const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// const CHANNEL_CONFIG: Record<Channel, {
//   icon: React.ReactNode; color: string; bg: string; text: string;
//   border: string; label: string;
// }> = {
//   calls:    { icon: <Phone size={11} />,        color: 'text-blue-600',   bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   label: 'Calls' },
//   whatsapp: { icon: <MessageSquare size={11} />, color: 'text-emerald-600',bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',label: 'WhatsApp' },
//   email:    { icon: <Mail size={11} />,          color: 'text-amber-600',  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  label: 'Email' },
//   linkedin: { icon: <Linkedin size={11} />,      color: 'text-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'LinkedIn' },
// };

// // ─── unchanged helpers ────────────────────────────────────────────────────────

// const StepPill = ({ current, step, label, icon }: { current: number; step: number; label: string; icon: React.ReactNode }) => {
//   const done   = current > step;
//   const active = current === step;
//   return (
//     <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${
//       done   ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
//       active ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200' :
//                'text-slate-400 border-transparent'
//     }`}>
//       {done ? <CheckCircle2 size={12} /> : icon}{label}
//     </div>
//   );
// };

// const NumericInput = ({ value, onChange, min = 0, max, className = '' }: {
//   value: number; onChange: (v: number) => void; min?: number; max?: number; className?: string;
// }) => {
//   const [local, setLocal] = useState(String(value));
//   useEffect(() => { setLocal(String(value)); }, [value]);
//   return (
//     <input type="text" inputMode="numeric" value={local} className={className}
//       onChange={e => {
//         const raw = e.target.value;
//         if (raw === '' || /^\d*$/.test(raw)) setLocal(raw);
//         const n = parseInt(raw, 10);
//         if (!isNaN(n)) onChange(max !== undefined ? Math.min(max, Math.max(min, n)) : Math.max(min, n));
//       }}
//     />
//   );
// };

// const ymd = (d: Date) => {
//   const y = d.getFullYear();
//   const m = `${d.getMonth() + 1}`.padStart(2, '0');
//   const day = `${d.getDate()}`.padStart(2, '0');
//   return `${y}-${m}-${day}`;
// };

// const getDaysInMonth = (month: number, year: number) => {
//   const date = new Date(year, month - 1, 1);
//   const days: Date[] = [];
//   while (date.getMonth() === month - 1) { days.push(new Date(date)); date.setDate(date.getDate() + 1); }
//   return days;
// };

// const getWeekendDaysInMonth = (month: number, year: number) =>
//   getDaysInMonth(month, year).filter(d => { const day = d.getDay(); return day === 0 || day === 6; });

// const spreadAcrossDays = (total: number, dayCount: number) => {
//   if (dayCount <= 0) return [];
//   const safeTotal = Math.max(0, total || 0);
//   const base = Math.floor(safeTotal / dayCount);
//   const rem  = safeTotal % dayCount;
//   return Array.from({ length: dayCount }, (_, i) => base + (i < rem ? 1 : 0));
// };

// const spreadAcrossWeeksThenDays = (total: number, monthDays: Date[], workingWeekendDates: string[]): number[] => {
//   const workingWeekendSet   = new Set(workingWeekendDates);
//   const weekWorkingDayIndexes = new Map<number, number[]>();
//   monthDays.forEach((d, i) => {
//     const dow = d.getDay(); const isWeekend = dow === 0 || dow === 6;
//     const isWorking = !isWeekend || workingWeekendSet.has(ymd(d));
//     if (!isWorking) return;
//     const week = Math.ceil(d.getDate() / 7);
//     if (!weekWorkingDayIndexes.has(week)) weekWorkingDayIndexes.set(week, []);
//     weekWorkingDayIndexes.get(week)!.push(i);
//   });
//   const weekNumbers = Array.from(weekWorkingDayIndexes.keys()).sort((a, b) => a - b);
//   const byDay = Array(monthDays.length).fill(0);
//   if (weekNumbers.length === 0) return byDay;
//   const weeklySplit = spreadAcrossDays(total, weekNumbers.length);
//   weekNumbers.forEach((week, idx) => {
//     const dayIndexes = weekWorkingDayIndexes.get(week) || [];
//     const perDay     = spreadAcrossDays(weeklySplit[idx] || 0, dayIndexes.length);
//     dayIndexes.forEach((monthIdx, dayIdx) => { byDay[monthIdx] = perDay[dayIdx] || 0; });
//   });
//   return byDay;
// };

// const parseWeekendConfigFromNotes = (notes: string | null | undefined): PlannerWeekendConfig => {
//   if (!notes) return { working_weekend_dates: [] };
//   try {
//     const parsed = JSON.parse(notes);
//     const list   = Array.isArray(parsed?.working_weekend_dates) ? parsed.working_weekend_dates : [];
//     return { working_weekend_dates: list.filter((d: unknown) => typeof d === 'string') };
//   } catch { return { working_weekend_dates: [] }; }
// };

// const buildAutoPlanFromTargets = (member: any, month: number, year: number, workingWeekendDates: string[]): PlannedWeek[] => {
//   const monthDays = getDaysInMonth(month, year);
//   const dailyByChannel: Record<Channel, number[]> = {
//     calls:    spreadAcrossWeeksThenDays(member.monthly_calls_target,    monthDays, workingWeekendDates),
//     whatsapp: spreadAcrossWeeksThenDays(member.monthly_whatsapp_target, monthDays, workingWeekendDates),
//     email:    spreadAcrossWeeksThenDays(member.monthly_email_target,    monthDays, workingWeekendDates),
//     linkedin: spreadAcrossWeeksThenDays(member.monthly_linkedin_target, monthDays, workingWeekendDates),
//   };
//   const weekMap = new Map<number, PlannedWeek>();
//   monthDays.forEach((d, i) => {
//     const week = Math.ceil(d.getDate() / 7);
//     if (!weekMap.has(week)) weekMap.set(week, { week, startDate: ymd(d), endDate: ymd(d), days: [], totals: { calls: 0, whatsapp: 0, email: 0, linkedin: 0 }, total: 0 });
//     const w = weekMap.get(week)!;
//     const byChannel = { calls: dailyByChannel.calls[i], whatsapp: dailyByChannel.whatsapp[i], email: dailyByChannel.email[i], linkedin: dailyByChannel.linkedin[i] };
//     const total = byChannel.calls + byChannel.whatsapp + byChannel.email + byChannel.linkedin;
//     w.days.push({ date: ymd(d), byChannel, total });
//     w.totals.calls += byChannel.calls; w.totals.whatsapp += byChannel.whatsapp;
//     w.totals.email += byChannel.email; w.totals.linkedin += byChannel.linkedin;
//     w.total += total; w.endDate = ymd(d);
//   });
//   return Array.from(weekMap.values()).sort((a, b) => a.week - b.week);
// };

// const isWorkingDate = (date: string, workingWeekendDates: string[]) => {
//   const d = new Date(`${date}T00:00:00`); const day = d.getDay();
//   if (day !== 0 && day !== 6) return true;
//   return workingWeekendDates.includes(date);
// };

// const forceLeaveDaysToZero = (weeks: PlannedWeek[], workingWeekendDates: string[]) =>
//   weeks.map(w => {
//     const nextDays = w.days.map(d => {
//       if (isWorkingDate(d.date, workingWeekendDates)) return d;
//       return { ...d, byChannel: { calls: 0, whatsapp: 0, email: 0, linkedin: 0 }, total: 0 };
//     });
//     const totals = nextDays.reduce(
//       (acc, d) => ({ calls: acc.calls + d.byChannel.calls, whatsapp: acc.whatsapp + d.byChannel.whatsapp, email: acc.email + d.byChannel.email, linkedin: acc.linkedin + d.byChannel.linkedin }),
//       { calls: 0, whatsapp: 0, email: 0, linkedin: 0 },
//     );
//     return { ...w, days: nextDays, totals, total: totals.calls + totals.whatsapp + totals.email + totals.linkedin };
//   });

// // ─── component ────────────────────────────────────────────────────────────────

// export function ActivityPlannerPage() {
//   const [step, setStep]                         = useState<Step>(1);
//   const [loading, setLoading]                   = useState(false);
//   const [saving, setSaving]                     = useState(false);
//   const [planners, setPlanners]                 = useState<ActivityPlanner[]>([]);
//   const [plannerId, setPlannerId]               = useState<number | null>(null);
//   const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

//   const [planName, setPlanName]                         = useState('Monthly Activity Planner');
//   const [month, setMonth]                               = useState(new Date().getMonth() + 1);
//   const [year, setYear]                                 = useState(new Date().getFullYear());
//   const [workingWeekendDates, setWorkingWeekendDates]   = useState<string[]>([]);
//   const [members, setMembers]                           = useState<any[]>([{
//     member_name: '', workspace_name: '',
//     monthly_calls_target: 100, monthly_whatsapp_target: 80,
//     monthly_email_target: 60,  monthly_linkedin_target: 40,
//     calls_weightage: 25, whatsapp_weightage: 25,
//     email_weightage: 25, linkedin_weightage: 25,
//   }]);

//   const [plannerView, setPlannerView]   = useState<PlannerView>('month');
//   const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

//   const selectedPlanner = useMemo(() => planners.find(p => p.id === plannerId) || null, [planners, plannerId]);

//   const weekendOptions = useMemo(
//     () => getWeekendDaysInMonth(month, year).map(d => ymd(d)),
//     [month, year],
//   );
//   useEffect(() => {
//     setWorkingWeekendDates(prev => prev.filter(d => weekendOptions.includes(d)));
//   }, [weekendOptions]);

//   const selectedPlannerWeekendConfig = useMemo(
//     () => parseWeekendConfigFromNotes(selectedPlanner?.notes),
//     [selectedPlanner?.notes],
//   );
//   const calendarWeekendOptions = useMemo(() => {
//     if (!selectedPlanner) return [];
//     return getWeekendDaysInMonth(selectedPlanner.month, selectedPlanner.year).map(d => ymd(d));
//   }, [selectedPlanner]);

//   const activeMemberPlan = useMemo(() => {
//     if (!selectedPlanner) return null;
//     return selectedPlanner.member_plans.find(m => m.id === selectedMemberId) || selectedPlanner.member_plans[0] || null;
//   }, [selectedPlanner, selectedMemberId]);

//   useEffect(() => {
//     if (selectedPlanner && selectedPlanner.member_plans.length > 0) {
//       if (!selectedMemberId || !selectedPlanner.member_plans.some(m => m.id === selectedMemberId))
//         setSelectedMemberId(selectedPlanner.member_plans[0].id);
//     }
//   }, [selectedPlanner, selectedMemberId]);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const list = await api.getActivityPlanners();
//       setPlanners(list);
//       if (list.length > 0 && !plannerId) setPlannerId(list[0].id);
//     } finally { setLoading(false); }
//   }, [plannerId]);

//   useEffect(() => { load(); }, [load]);

//   const handleTaskStatusChange = async (taskId: number, status: string) => {
//     setPlanners(prev => prev.map(p => ({
//       ...p,
//       member_plans: p.member_plans.map(m => ({
//         ...m,
//         tasks: (m.tasks || []).map(t => t.id === taskId ? { ...t, status: status as any } : t),
//       })),
//     })));
//     try { await api.updatePlannerTask(taskId, { status: status as any }); await load(); }
//     catch { load(); }
//   };

//   const handleWeekendWorkingToggle = async (date: string) => {
//     if (!selectedPlanner) return;
//     const current = parseWeekendConfigFromNotes(selectedPlanner.notes).working_weekend_dates;
//     const next     = current.includes(date) ? current.filter(d => d !== date) : [...current, date];
//     const nextNotes = JSON.stringify({ working_weekend_dates: next });
//     setPlanners(prev => prev.map(p => p.id === selectedPlanner.id ? { ...p, notes: nextNotes } : p));
//     try { await api.updateActivityPlanner(selectedPlanner.id, { notes: nextNotes }); await load(); }
//     catch { await load(); }
//   };

//   const memberWeeks = useMemo(() => {
//     if (!selectedPlanner || !activeMemberPlan) return [];
//     const auto = buildAutoPlanFromTargets(activeMemberPlan, selectedPlanner.month, selectedPlanner.year, selectedPlannerWeekendConfig.working_weekend_dates);
//     return forceLeaveDaysToZero(auto, selectedPlannerWeekendConfig.working_weekend_dates);
//   }, [selectedPlanner, activeMemberPlan, selectedPlannerWeekendConfig.working_weekend_dates]);

//   useEffect(() => {
//     if (memberWeeks.length > 0)
//       setSelectedWeek(prev => (prev && memberWeeks.some(w => w.week === prev)) ? prev : memberWeeks[0].week);
//     else setSelectedWeek(null);
//   }, [memberWeeks]);

//   const activeWeek = useMemo(
//     () => memberWeeks.find(w => w.week === selectedWeek) || null,
//     [memberWeeks, selectedWeek],
//   );

//   const stats = useMemo(() => {
//     if (!activeMemberPlan) return null;
//     const tasks = activeMemberPlan.tasks || [];
//     const done  = tasks.filter(t => t.status === 'done').length;
//     return { total: tasks.length, done, pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
//   }, [activeMemberPlan]);

//   // ── derived helpers for Step 1 stats panel ──
//   const workdayCount = useMemo(() => {
//     const allDays = getDaysInMonth(month, year);
//     const workingWeekendSet = new Set(workingWeekendDates);
//     return allDays.filter(d => {
//       const dow = d.getDay();
//       const isWeekend = dow === 0 || dow === 6;
//       return !isWeekend || workingWeekendSet.has(ymd(d));
//     }).length;
//   }, [month, year, workingWeekendDates]);

//   const totalWeeks = useMemo(() => {
//     const allDays = getDaysInMonth(month, year);
//     return Math.ceil(allDays[allDays.length - 1].getDate() / 7);
//   }, [month, year]);

//   // ── derived helpers for Step 2 ──
//   const memberTotals = (m: any) =>
//     (m.monthly_calls_target || 0) + (m.monthly_whatsapp_target || 0) +
//     (m.monthly_email_target || 0) + (m.monthly_linkedin_target || 0);

//   const dailyAvg = (m: any) =>
//     workdayCount > 0 ? (memberTotals(m) / workdayCount).toFixed(1) : '0';

//   // ─────────────────────────────────────────────────────────────────────────────

//   return (
//     <div className="h-full flex flex-col bg-slate-50 overflow-hidden font-sans">

//       {/* ── Header ── */}
//       <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
//         <div className="flex items-center gap-3">
//           <div className="bg-indigo-600 p-2 rounded-xl">
//             <Target className="text-white" size={18} />
//           </div>
//           <div>
//             <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">Activity Architect</h1>
//             <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
//               {selectedPlanner?.name || 'New Plan'}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <StepPill current={step} step={1} label="Setup"    icon={<Settings size={12} />} />
//           <div className="w-4 h-px bg-slate-200" />
//           <StepPill current={step} step={2} label="Team"     icon={<Users size={12} />} />
//           <div className="w-4 h-px bg-slate-200" />
//           <StepPill current={step} step={3} label="Calendar" icon={<Calendar size={12} />} />
//           <button
//             onClick={load}
//             className={`ml-2 p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors ${loading ? 'animate-spin' : ''}`}
//           >
//             <RefreshCcw size={15} />
//           </button>
//         </div>
//       </header>

//       <main className="flex-1 flex min-h-0">

//         {/* ════════════════════════════════════════════════════
//             STEP 3 — CALENDAR
//         ════════════════════════════════════════════════════ */}
//         {step === 3 && selectedPlanner ? (
//           <>
//             {/* Sidebar */}
//             <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
//               {/* Member list */}
//               <div className="p-4 border-b border-slate-100">
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Team</p>
//                 <div className="space-y-1">
//                   {selectedPlanner.member_plans.map(m => {
//                     const isActive = selectedMemberId === m.id;
//                     const memberStats = (() => {
//                       const tasks = m.tasks || [];
//                       const done  = tasks.filter((t: any) => t.status === 'done').length;
//                       return tasks.length ? Math.round((done / tasks.length) * 100) : 0;
//                     })();
//                     return (
//                       <button
//                         key={m.id}
//                         onClick={() => { setSelectedMemberId(m.id); setPlannerView('month'); }}
//                         className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl transition-all border ${
//                           isActive ? 'bg-indigo-50 border-indigo-200' : 'border-transparent hover:bg-slate-50'
//                         }`}
//                       >
//                         <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
//                           isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
//                         }`}>
//                           {m.member_name.charAt(0) || 'U'}
//                         </div>
//                         <div className="text-left flex-1 min-w-0">
//                           <p className={`text-xs font-semibold truncate ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
//                             {m.member_name}
//                           </p>
//                           <div className="mt-1 h-1 bg-slate-100 rounded-full overflow-hidden">
//                             <div
//                               className="h-full bg-indigo-400 rounded-full transition-all duration-500"
//                               style={{ width: `${memberStats}%` }}
//                             />
//                           </div>
//                         </div>
//                         <span className={`text-[10px] font-semibold shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
//                           {memberStats}%
//                         </span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Task completion + weekly list */}
//               <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
//                 {/* Completion ring-style card */}
//                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Completion</span>
//                     <span className="text-lg font-black text-slate-800">{stats?.pct ?? 0}%</span>
//                   </div>
//                   <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-indigo-500 rounded-full transition-all duration-700"
//                       style={{ width: `${stats?.pct ?? 0}%` }}
//                     />
//                   </div>
//                   <div className="flex justify-between mt-1.5">
//                     <span className="text-[10px] text-slate-400">{stats?.done ?? 0} done</span>
//                     <span className="text-[10px] text-slate-400">{stats?.total ?? 0} total</span>
//                   </div>
//                 </div>

//                 {/* Weekly distribution */}
//                 <div>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
//                     <Layers size={11} className="text-indigo-400" /> Distribution
//                   </p>
//                   <div className="space-y-1.5">
//                     {memberWeeks.map(w => (
//                       <button
//                         key={w.week}
//                         onClick={() => { setSelectedWeek(w.week); setPlannerView('week'); }}
//                         className={`w-full p-2.5 rounded-lg border text-left transition-all ${
//                           selectedWeek === w.week && plannerView === 'week'
//                             ? 'bg-indigo-50 border-indigo-200'
//                             : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/40'
//                         }`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase">
//                             Wk {w.week}
//                           </span>
//                           <span className="text-xs font-bold text-slate-700">{w.total}</span>
//                         </div>
//                         <p className="text-[10px] text-slate-400 mt-0.5">{w.startDate} – {w.endDate}</p>
//                         {/* mini channel breakdown */}
//                         <div className="flex gap-1 mt-1.5">
//                           {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
//                             <div key={ch} className={`flex-1 py-0.5 rounded text-center text-[9px] font-bold ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].text}`}>
//                               {w.totals[ch]}
//                             </div>
//                           ))}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="p-3 border-t border-slate-100">
//                 <button
//                   onClick={() => setStep(1)}
//                   className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 >
//                   <Plus size={13} /> New Plan
//                 </button>
//               </div>
//             </aside>

//             {/* Main calendar area */}
//             <section className="flex-1 flex flex-col bg-white overflow-hidden">
//               {/* Calendar toolbar */}
//               <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
//                 <div className="flex items-center gap-2.5">
//                   {plannerView === 'week' && (
//                     <button
//                       onClick={() => setPlannerView('month')}
//                       className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors"
//                     >
//                       <ChevronLeft size={15} />
//                     </button>
//                   )}
//                   <div>
//                     <h2 className="text-sm font-black text-slate-800">
//                       {plannerView === 'month'
//                         ? `${MONTHS.find(m => m.value === selectedPlanner.month)?.label} ${selectedPlanner.year}`
//                         : `Week ${activeWeek?.week} — ${activeWeek?.startDate} to ${activeWeek?.endDate}`}
//                     </h2>
//                     <p className="text-[10px] text-slate-400">
//                       {plannerView === 'month' ? 'Click a week to drill into daily view' : 'Day-by-day activity breakdown'}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-1.5">
//                   {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
//                     <div key={ch} className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-semibold ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].border} ${CHANNEL_CONFIG[ch].text}`}>
//                       {CHANNEL_CONFIG[ch].icon}
//                       <span>{CHANNEL_CONFIG[ch].label}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Weekend controls — compact strip */}
//               <div className="px-5 py-2 border-b border-slate-100 bg-slate-50 flex items-center gap-3 flex-wrap shrink-0">
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide whitespace-nowrap">
//                   Weekend policy
//                 </span>
//                 <span className="text-[10px] text-slate-400">·</span>
//                 <span className="text-[10px] text-slate-400">Sat/Sun default to Leave — toggle to mark as working</span>
//                 <div className="flex flex-wrap gap-1.5 ml-auto">
//                   {calendarWeekendOptions.map(date => {
//                     const active = selectedPlannerWeekendConfig.working_weekend_dates.includes(date);
//                     const day    = new Date(`${date}T00:00:00`);
//                     return (
//                       <button
//                         key={date}
//                         type="button"
//                         onClick={() => handleWeekendWorkingToggle(date)}
//                         className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition-all ${
//                           active
//                             ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
//                             : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
//                         }`}
//                       >
//                         {date.slice(8)} {day.getDay() === 6 ? 'Sat' : 'Sun'} · {active ? 'Working' : 'Leave'}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* ── Month view — week cards grid ── */}
//               {plannerView === 'month' ? (
//                 <div className="flex-1 overflow-y-auto p-5">
//                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
//                     {memberWeeks.map(w => (
//                       <button
//                         key={w.week}
//                         onClick={() => { setSelectedWeek(w.week); setPlannerView('week'); }}
//                         className="text-left p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm hover:shadow-indigo-100 transition-all group bg-white"
//                       >
//                         <div className="flex justify-between items-center mb-3">
//                           <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2 py-1 rounded-lg">
//                             Week {w.week}
//                           </span>
//                           <span className="text-sm font-black text-slate-800">{w.total} <span className="text-xs font-normal text-slate-400">activities</span></span>
//                         </div>
//                         <div className="grid grid-cols-2 gap-1.5">
//                           {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
//                             <div key={ch} className={`p-2 rounded-lg border ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].border} flex items-center justify-between`}>
//                               <div className={`flex items-center gap-1 ${CHANNEL_CONFIG[ch].text}`}>
//                                 {CHANNEL_CONFIG[ch].icon}
//                                 <span className="text-[10px] font-semibold">{CHANNEL_CONFIG[ch].label}</span>
//                               </div>
//                               <span className={`text-sm font-black ${CHANNEL_CONFIG[ch].text}`}>{w.totals[ch]}</span>
//                             </div>
//                           ))}
//                         </div>
//                         <p className="mt-2.5 text-[10px] text-slate-400 group-hover:text-indigo-500 transition-colors">
//                           {w.startDate} – {w.endDate} · tap to expand →
//                         </p>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//               ) : (
//                 /* ── Week view — day calendar ── */
//                 <div className="flex-1 overflow-y-auto custom-scrollbar">
//                   {/* Day-of-week header */}
//                   <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
//                     {DAYS_OF_WEEK.map(day => (
//                       <div key={day} className="py-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                         {day}
//                       </div>
//                     ))}
//                   </div>

//                   {activeWeek && (() => {
//                     const firstDate = new Date(`${activeWeek.startDate}T00:00:00`);
//                     const blanks    = Array(firstDate.getDay()).fill(null);
//                     const cells     = [...blanks, ...activeWeek.days];

//                     return (
//                       <div className="grid grid-cols-7 auto-rows-[minmax(130px,auto)]">
//                         {cells.map((day, i) => {
//                           if (!day) return <div key={`blank-${i}`} className="bg-slate-50/60 border-r border-b border-slate-100" />;

//                           const dateTasks        = (activeMemberPlan?.tasks || []).filter((t: any) => t.task_date === day.date);
//                           const dayDate          = new Date(`${day.date}T00:00:00`);
//                           const dow              = dayDate.getDay();
//                           const isWeekend        = dow === 0 || dow === 6;
//                           const isWorkingWeekend = selectedPlannerWeekendConfig.working_weekend_dates.includes(day.date);
//                           const isLeaveDay       = isWeekend && !isWorkingWeekend;
//                           const isToday          = ymd(new Date()) === day.date;

//                           return (
//                             <div
//                               key={day.date}
//                               className={`p-2 border-r border-b border-slate-100 transition-colors ${
//                                 isLeaveDay ? 'bg-rose-50/30' : isToday ? 'bg-indigo-50/30' : ''
//                               }`}
//                             >
//                               {/* Date number row */}
//                               <div className="flex items-center justify-between mb-1.5">
//                                 <span className={`text-xs font-black rounded-full w-6 h-6 flex items-center justify-center ${
//                                   isToday ? 'bg-indigo-600 text-white' : 'text-slate-600'
//                                 }`}>
//                                   {dayDate.getDate()}
//                                 </span>
//                                 {isLeaveDay ? (
//                                   <span className="text-[9px] font-black text-rose-500 bg-rose-100 px-1.5 py-0.5 rounded">Leave</span>
//                                 ) : (
//                                   <span className="text-[10px] font-black text-indigo-600">{day.total}</span>
//                                 )}
//                               </div>

//                               {/* Channel rows */}
//                               {!isLeaveDay && (
//                                 <div className="space-y-0.5">
//                                   {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
//                                     <div
//                                       key={ch}
//                                       className={`px-1.5 py-0.5 rounded text-[9px] font-semibold flex justify-between items-center ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].text}`}
//                                     >
//                                       <span>{CHANNEL_CONFIG[ch].label}</span>
//                                       <span className="font-black">{day.byChannel[ch]}</span>
//                                     </div>
//                                   ))}
//                                 </div>
//                               )}

//                               {/* Tasks */}
//                               {!isLeaveDay && dateTasks.length > 0 && (
//                                 <div className="mt-1.5 space-y-0.5">
//                                   {dateTasks.slice(0, 2).map((t: any) => (
//                                     <button
//                                       key={t.id}
//                                       onClick={() => handleTaskStatusChange(
//                                         t.id,
//                                         t.status === 'pending' ? 'in_progress' : t.status === 'in_progress' ? 'done' : 'pending',
//                                       )}
//                                       className={`w-full text-left text-[9px] px-1.5 py-1 rounded border transition-colors ${
//                                         t.status === 'done'
//                                           ? 'bg-emerald-50 border-emerald-200 text-emerald-700 line-through'
//                                           : t.status === 'in_progress'
//                                           ? 'bg-amber-50 border-amber-200 text-amber-700'
//                                           : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
//                                       }`}
//                                     >
//                                       {t.title}
//                                     </button>
//                                   ))}
//                                   {dateTasks.length > 2 && (
//                                     <p className="text-[9px] text-slate-400 pl-1">+{dateTasks.length - 2} more</p>
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     );
//                   })()}
//                 </div>
//               )}
//             </section>
//           </>

//         ) : (
//           /* ════════════════════════════════════════════════════
//               STEPS 1 & 2
//           ════════════════════════════════════════════════════ */
//           <div className="flex-1 overflow-y-auto">

//             {/* ── STEP 1 ── */}
//             {step === 1 && (
//               <div className="min-h-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

//                 {/* Left — form */}
//                 <div className="space-y-4">
//                   {/* Plan details card */}
//                   <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Plan details</h3>
//                     <div className="space-y-3">
//                       <div>
//                         <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Plan name</label>
//                         <input
//                           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors"
//                           value={planName}
//                           onChange={e => setPlanName(e.target.value)}
//                         />
//                       </div>
//                       <div className="grid grid-cols-2 gap-3">
//                         <div>
//                           <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Month</label>
//                           <select
//                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors"
//                             value={month}
//                             onChange={e => setMonth(Number(e.target.value))}
//                           >
//                             {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Year</label>
//                           <input
//                             type="number"
//                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors"
//                             value={year}
//                             onChange={e => setYear(Number(e.target.value))}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Weekend working days */}
//                   <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//                     <div className="flex items-start justify-between mb-1">
//                       <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Weekend working days</h3>
//                       <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-full font-semibold">
//                         {workingWeekendDates.length} selected
//                       </span>
//                     </div>
//                     <p className="text-[11px] text-slate-400 mb-3">
//                       Weekdays are always working. Select any Saturday or Sunday to treat as a working day.
//                     </p>
//                     <div className="grid grid-cols-4 gap-2">
//                       {weekendOptions.map(date => {
//                         const active = workingWeekendDates.includes(date);
//                         const day    = new Date(`${date}T00:00:00`);
//                         return (
//                           <button
//                             type="button"
//                             key={date}
//                             onClick={() => setWorkingWeekendDates(prev =>
//                               prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date],
//                             )}
//                             className={`py-2 px-1 rounded-xl text-[11px] font-semibold border transition-all text-center ${
//                               active
//                                 ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
//                                 : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
//                             }`}
//                           >
//                             <span className="block font-black">{date.slice(8)}</span>
//                             <span className="block text-[9px] mt-0.5">{day.getDay() === 6 ? 'Sat' : 'Sun'}</span>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   <button
//                     onClick={async () => {
//                       setSaving(true);
//                       try {
//                         const res = await api.createActivityPlanner({
//                           name: planName, month, year, status: 'active',
//                           notes: JSON.stringify({ working_weekend_dates: workingWeekendDates }),
//                         });
//                         setPlannerId(res.id);
//                         await load();
//                         setStep(2);
//                       } finally { setSaving(false); }
//                     }}
//                     className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-lg shadow-indigo-200"
//                   >
//                     {saving ? 'Creating plan…' : 'Initialize team setup →'}
//                   </button>
//                 </div>

//                 {/* Right — context panel */}
//                 <div className="space-y-4">
//                   {/* Live stats */}
//                   <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
//                       {MONTHS.find(m => m.value === month)?.label} {year} snapshot
//                     </h3>
//                     <div className="grid grid-cols-2 gap-3">
//                       {[
//                         { label: 'Total days',        value: getDaysInMonth(month, year).length },
//                         { label: 'Working days',      value: workdayCount },
//                         { label: 'Working weekends',  value: workingWeekendDates.length },
//                         { label: 'Weeks',             value: totalWeeks },
//                       ].map(s => (
//                         <div key={s.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                           <p className="text-2xl font-black text-slate-800">{s.value}</p>
//                           <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* How it works */}
                

//                   {/* Existing plans */}
//                   {planners.length > 0 && (
//                     <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//                       <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Existing plans</h3>
//                       <div className="space-y-1.5">
//                         {planners.map(p => (
//                           <button
//                             key={p.id}
//                             onClick={() => { setPlannerId(p.id); setStep(3); }}
//                             className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all hover:border-indigo-200 hover:bg-indigo-50/40 ${
//                               plannerId === p.id ? 'border-indigo-200 bg-indigo-50' : 'border-slate-100 bg-slate-50'
//                             }`}
//                           >
//                             <div>
//                               <p className="text-xs font-semibold text-slate-700">{p.name}</p>
//                               <p className="text-[10px] text-slate-400">
//                                 {MONTHS.find(m => m.value === p.month)?.label} {p.year} · {p.member_plans?.length ?? 0} members
//                               </p>
//                             </div>
//                             <span className="text-[10px] text-indigo-500 font-semibold">Open →</span>
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* ── STEP 2 ── */}
//             {step === 2 && (
//               <div className="min-h-full p-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

//                 {/* Left — member list + summary */}
//                 <div className="space-y-4">
//                   <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//                     <div className="flex items-center justify-between mb-3">
//                       <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Agents ({members.length})</h3>
//                       <button
//                         onClick={() => setMembers([...members, { ...members[0], member_name: '' }])}
//                         className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
//                       >
//                         <Plus size={12} /> Add
//                       </button>
//                     </div>
//                     <div className="space-y-1">
//                       {members.map((m, i) => (
//                         <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
//                           <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black uppercase shrink-0">
//                             {m.member_name?.charAt(0) || '?'}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-xs font-semibold text-slate-700 truncate">{m.member_name || 'Unnamed agent'}</p>
//                             <p className="text-[10px] text-slate-400">{memberTotals(m)} activities · {dailyAvg(m)}/day</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Plan summary */}
//                   <div className="bg-slate-900 text-white rounded-2xl p-5">
//                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Plan summary</p>
//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-slate-400">Period</span>
//                         <span className="font-semibold">{MONTHS.find(m => m.value === month)?.label} {year}</span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-slate-400">Working days</span>
//                         <span className="font-semibold">{workdayCount}</span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-slate-400">Agents</span>
//                         <span className="font-semibold">{members.length}</span>
//                       </div>
//                       <div className="flex justify-between text-sm border-t border-slate-700 pt-2 mt-1">
//                         <span className="text-slate-400">Total activities</span>
//                         <span className="font-black text-indigo-400">
//                           {members.reduce((sum, m) => sum + memberTotals(m), 0)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right — agent cards */}
//                 <div>
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <h2 className="text-lg font-black text-slate-800">Configure agents</h2>
//                       <p className="text-sm text-slate-400">Set monthly channel targets for each team member.</p>
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4">
//                     {members.map((m, i) => (
//                       <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative group">
//                         {/* Agent name */}
//                         <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
//                           <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm uppercase shrink-0">
//                             {m.member_name?.charAt(0) || '?'}
//                           </div>
//                           <input
//                             placeholder="Agent name…"
//                             className="flex-1 text-sm font-bold text-slate-800 border-none focus:ring-0 p-0 bg-transparent placeholder:text-slate-300 outline-none"
//                             value={m.member_name}
//                             onChange={e => {
//                               const nm = [...members];
//                               nm[i].member_name    = e.target.value;
//                               nm[i].workspace_name = `${e.target.value}'s Workspace`;
//                               setMembers(nm);
//                             }}
//                           />
//                           {members.length > 1 && (
//                             <button
//                               onClick={() => setMembers(members.filter((_, idx) => idx !== i))}
//                               className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
//                             >
//                               <Trash2 size={14} />
//                             </button>
//                           )}
//                         </div>

//                         {/* Channel targets */}
//                         <div className="grid grid-cols-2 gap-2">
//                           {(['calls', 'whatsapp', 'email', 'linkedin'] as Channel[]).map(ch => (
//                             <div key={ch} className={`p-3 rounded-xl border ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].border}`}>
//                               <label className={`text-[10px] font-black uppercase flex items-center gap-1 mb-1 ${CHANNEL_CONFIG[ch].text}`}>
//                                 {CHANNEL_CONFIG[ch].icon} {ch}
//                               </label>
//                               <NumericInput
//                                 className={`bg-transparent font-black text-slate-700 w-full outline-none text-lg leading-none`}
//                                 value={m[`monthly_${ch}_target`]}
//                                 onChange={v => {
//                                   const nm = [...members];
//                                   nm[i][`monthly_${ch}_target`] = v;
//                                   setMembers(nm);
//                                 }}
//                               />
//                               <p className="text-[10px] text-slate-400 mt-0.5">
//                                 ~{workdayCount > 0 ? (m[`monthly_${ch}_target`] / workdayCount).toFixed(1) : 0}/day
//                               </p>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Card footer — total */}
//                         <div className="mt-3 flex justify-between items-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
//                           <span className="text-[11px] text-slate-400 font-semibold">Total activities</span>
//                           <span className="text-sm font-black text-slate-800">{memberTotals(m)}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="flex gap-3 mt-5">
//                     <button
//                       onClick={() => setStep(1)}
//                       className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors"
//                     >
//                       ← Back
//                     </button>
//                     <button
//                       onClick={async () => {
//                         if (!plannerId) return;
//                         setSaving(true);
//                         try {
//                           await api.assignPlannerMembers(plannerId, members);
//                           await load();
//                           setStep(3);
//                           setPlannerView('month');
//                         } finally { setSaving(false); }
//                       }}
//                       className="flex-1 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-lg shadow-indigo-200"
//                     >
//                       {saving ? 'Generating calendar…' : 'Deploy & view calendar →'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default ActivityPlannerPage;


// import React, { useEffect, useMemo, useState, useCallback } from 'react';
// import {
//   CheckCircle2, Plus, RefreshCcw, Users,
//   Target, Phone, MessageSquare, Mail,
//   Linkedin, Sparkles, Trash2, Settings,
//   Calendar, Layers, ChevronLeft, Info,
//   TrendingUp, Activity, Zap, ArrowRight,
//   BarChart2, Clock
// } from 'lucide-react';
// import { api } from '../Utils/api';
// import type { ActivityPlanner, PlannerTask } from '../Utils/types';

// type Step = 1 | 2 | 3;
// type PlannerView = 'month' | 'week';
// type Channel = 'calls' | 'whatsapp' | 'email' | 'linkedin';

// type PlannedDay = {
//   date: string;
//   byChannel: Record<Channel, number>;
//   total: number;
// };

// type PlannedWeek = {
//   week: number;
//   startDate: string;
//   endDate: string;
//   days: PlannedDay[];
//   totals: Record<Channel, number>;
//   total: number;
// };

// type PlannerWeekendConfig = {
//   working_weekend_dates: string[];
// };

// const MONTHS = Array.from({ length: 12 }, (_, i) => ({
//   value: i + 1,
//   label: new Date(2000, i, 1).toLocaleString('en', { month: 'long' }),
// }));

// const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// const CHANNEL_CONFIG: Record<Channel, {
//   icon: React.ReactNode; color: string; bg: string; text: string;
//   border: string; label: string; gradient: string;
// }> = {
//   calls:    { icon: <Phone size={11} />,        color: 'text-blue-600',   bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   label: 'Calls',     gradient: 'from-blue-500 to-blue-600' },
//   whatsapp: { icon: <MessageSquare size={11} />, color: 'text-emerald-600',bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',label: 'WhatsApp',  gradient: 'from-emerald-500 to-emerald-600' },
//   email:    { icon: <Mail size={11} />,          color: 'text-amber-600',  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  label: 'Email',     gradient: 'from-amber-500 to-amber-600' },
//   linkedin: { icon: <Linkedin size={11} />,      color: 'text-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'LinkedIn',  gradient: 'from-indigo-500 to-indigo-600' },
// };

// // ─── unchanged helpers ────────────────────────────────────────────────────────

// const StepPill = ({ current, step, label, icon }: { current: number; step: number; label: string; icon: React.ReactNode }) => {
//   const done   = current > step;
//   const active = current === step;
//   return (
//     <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${
//       done   ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
//       active ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200' :
//                'text-slate-400 border-transparent'
//     }`}>
//       {done ? <CheckCircle2 size={12} /> : icon}{label}
//     </div>
//   );
// };

// const NumericInput = ({ value, onChange, min = 0, max, className = '' }: {
//   value: number; onChange: (v: number) => void; min?: number; max?: number; className?: string;
// }) => {
//   const [local, setLocal] = useState(String(value));
//   useEffect(() => { setLocal(String(value)); }, [value]);
//   return (
//     <input type="text" inputMode="numeric" value={local} className={className}
//       onChange={e => {
//         const raw = e.target.value;
//         if (raw === '' || /^\d*$/.test(raw)) setLocal(raw);
//         const n = parseInt(raw, 10);
//         if (!isNaN(n)) onChange(max !== undefined ? Math.min(max, Math.max(min, n)) : Math.max(min, n));
//       }}
//     />
//   );
// };

// const ymd = (d: Date) => {
//   const y = d.getFullYear();
//   const m = `${d.getMonth() + 1}`.padStart(2, '0');
//   const day = `${d.getDate()}`.padStart(2, '0');
//   return `${y}-${m}-${day}`;
// };

// const getDaysInMonth = (month: number, year: number) => {
//   const date = new Date(year, month - 1, 1);
//   const days: Date[] = [];
//   while (date.getMonth() === month - 1) { days.push(new Date(date)); date.setDate(date.getDate() + 1); }
//   return days;
// };

// const getWeekendDaysInMonth = (month: number, year: number) =>
//   getDaysInMonth(month, year).filter(d => { const day = d.getDay(); return day === 0 || day === 6; });

// const spreadAcrossDays = (total: number, dayCount: number) => {
//   if (dayCount <= 0) return [];
//   const safeTotal = Math.max(0, total || 0);
//   const base = Math.floor(safeTotal / dayCount);
//   const rem  = safeTotal % dayCount;
//   return Array.from({ length: dayCount }, (_, i) => base + (i < rem ? 1 : 0));
// };

// const spreadAcrossWeeksThenDays = (total: number, monthDays: Date[], workingWeekendDates: string[]): number[] => {
//   const workingWeekendSet   = new Set(workingWeekendDates);
//   const weekWorkingDayIndexes = new Map<number, number[]>();
//   monthDays.forEach((d, i) => {
//     const dow = d.getDay(); const isWeekend = dow === 0 || dow === 6;
//     const isWorking = !isWeekend || workingWeekendSet.has(ymd(d));
//     if (!isWorking) return;
//     const week = Math.ceil(d.getDate() / 7);
//     if (!weekWorkingDayIndexes.has(week)) weekWorkingDayIndexes.set(week, []);
//     weekWorkingDayIndexes.get(week)!.push(i);
//   });
//   const weekNumbers = Array.from(weekWorkingDayIndexes.keys()).sort((a, b) => a - b);
//   const byDay = Array(monthDays.length).fill(0);
//   if (weekNumbers.length === 0) return byDay;
//   const weeklySplit = spreadAcrossDays(total, weekNumbers.length);
//   weekNumbers.forEach((week, idx) => {
//     const dayIndexes = weekWorkingDayIndexes.get(week) || [];
//     const perDay     = spreadAcrossDays(weeklySplit[idx] || 0, dayIndexes.length);
//     dayIndexes.forEach((monthIdx, dayIdx) => { byDay[monthIdx] = perDay[dayIdx] || 0; });
//   });
//   return byDay;
// };

// const parseWeekendConfigFromNotes = (notes: string | null | undefined): PlannerWeekendConfig => {
//   if (!notes) return { working_weekend_dates: [] };
//   try {
//     const parsed = JSON.parse(notes);
//     const list   = Array.isArray(parsed?.working_weekend_dates) ? parsed.working_weekend_dates : [];
//     return { working_weekend_dates: list.filter((d: unknown) => typeof d === 'string') };
//   } catch { return { working_weekend_dates: [] }; }
// };

// const buildAutoPlanFromTargets = (member: any, month: number, year: number, workingWeekendDates: string[]): PlannedWeek[] => {
//   const monthDays = getDaysInMonth(month, year);
//   const dailyByChannel: Record<Channel, number[]> = {
//     calls:    spreadAcrossWeeksThenDays(member.monthly_calls_target,    monthDays, workingWeekendDates),
//     whatsapp: spreadAcrossWeeksThenDays(member.monthly_whatsapp_target, monthDays, workingWeekendDates),
//     email:    spreadAcrossWeeksThenDays(member.monthly_email_target,    monthDays, workingWeekendDates),
//     linkedin: spreadAcrossWeeksThenDays(member.monthly_linkedin_target, monthDays, workingWeekendDates),
//   };
//   const weekMap = new Map<number, PlannedWeek>();
//   monthDays.forEach((d, i) => {
//     const week = Math.ceil(d.getDate() / 7);
//     if (!weekMap.has(week)) weekMap.set(week, { week, startDate: ymd(d), endDate: ymd(d), days: [], totals: { calls: 0, whatsapp: 0, email: 0, linkedin: 0 }, total: 0 });
//     const w = weekMap.get(week)!;
//     const byChannel = { calls: dailyByChannel.calls[i], whatsapp: dailyByChannel.whatsapp[i], email: dailyByChannel.email[i], linkedin: dailyByChannel.linkedin[i] };
//     const total = byChannel.calls + byChannel.whatsapp + byChannel.email + byChannel.linkedin;
//     w.days.push({ date: ymd(d), byChannel, total });
//     w.totals.calls += byChannel.calls; w.totals.whatsapp += byChannel.whatsapp;
//     w.totals.email += byChannel.email; w.totals.linkedin += byChannel.linkedin;
//     w.total += total; w.endDate = ymd(d);
//   });
//   return Array.from(weekMap.values()).sort((a, b) => a.week - b.week);
// };

// const isWorkingDate = (date: string, workingWeekendDates: string[]) => {
//   const d = new Date(`${date}T00:00:00`); const day = d.getDay();
//   if (day !== 0 && day !== 6) return true;
//   return workingWeekendDates.includes(date);
// };

// const forceLeaveDaysToZero = (weeks: PlannedWeek[], workingWeekendDates: string[]) =>
//   weeks.map(w => {
//     const nextDays = w.days.map(d => {
//       if (isWorkingDate(d.date, workingWeekendDates)) return d;
//       return { ...d, byChannel: { calls: 0, whatsapp: 0, email: 0, linkedin: 0 }, total: 0 };
//     });
//     const totals = nextDays.reduce(
//       (acc, d) => ({ calls: acc.calls + d.byChannel.calls, whatsapp: acc.whatsapp + d.byChannel.whatsapp, email: acc.email + d.byChannel.email, linkedin: acc.linkedin + d.byChannel.linkedin }),
//       { calls: 0, whatsapp: 0, email: 0, linkedin: 0 },
//     );
//     return { ...w, days: nextDays, totals, total: totals.calls + totals.whatsapp + totals.email + totals.linkedin };
//   });

// // ─── component ────────────────────────────────────────────────────────────────

// export function ActivityPlannerPage() {
//   const [step, setStep]                         = useState<Step>(1);
//   const [loading, setLoading]                   = useState(false);
//   const [saving, setSaving]                     = useState(false);
//   const [planners, setPlanners]                 = useState<ActivityPlanner[]>([]);
//   const [plannerId, setPlannerId]               = useState<number | null>(null);
//   const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

//   const [planName, setPlanName]                         = useState('Monthly Activity Planner');
//   const [month, setMonth]                               = useState(new Date().getMonth() + 1);
//   const [year, setYear]                                 = useState(new Date().getFullYear());
//   const [workingWeekendDates, setWorkingWeekendDates]   = useState<string[]>([]);
//   const [members, setMembers]                           = useState<any[]>([{
//     member_name: '', workspace_name: '',
//     monthly_calls_target: 100, monthly_whatsapp_target: 80,
//     monthly_email_target: 60,  monthly_linkedin_target: 40,
//     calls_weightage: 25, whatsapp_weightage: 25,
//     email_weightage: 25, linkedin_weightage: 25,
//   }]);

//   const [plannerView, setPlannerView]   = useState<PlannerView>('month');
//   const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
//   const [overflowModal, setOverflowModal] = useState<{ date: string; tasks: any[] } | null>(null);

//   const selectedPlanner = useMemo(() => planners.find(p => p.id === plannerId) || null, [planners, plannerId]);

//   const weekendOptions = useMemo(
//     () => getWeekendDaysInMonth(month, year).map(d => ymd(d)),
//     [month, year],
//   );
//   useEffect(() => {
//     setWorkingWeekendDates(prev => prev.filter(d => weekendOptions.includes(d)));
//   }, [weekendOptions]);

//   const selectedPlannerWeekendConfig = useMemo(
//     () => parseWeekendConfigFromNotes(selectedPlanner?.notes),
//     [selectedPlanner?.notes],
//   );
//   const calendarWeekendOptions = useMemo(() => {
//     if (!selectedPlanner) return [];
//     return getWeekendDaysInMonth(selectedPlanner.month, selectedPlanner.year).map(d => ymd(d));
//   }, [selectedPlanner]);

//   const activeMemberPlan = useMemo(() => {
//     if (!selectedPlanner) return null;
//     return selectedPlanner.member_plans.find(m => m.id === selectedMemberId) || selectedPlanner.member_plans[0] || null;
//   }, [selectedPlanner, selectedMemberId]);

//   useEffect(() => {
//     if (selectedPlanner && selectedPlanner.member_plans.length > 0) {
//       if (!selectedMemberId || !selectedPlanner.member_plans.some(m => m.id === selectedMemberId))
//         setSelectedMemberId(selectedPlanner.member_plans[0].id);
//     }
//   }, [selectedPlanner, selectedMemberId]);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const list = await api.getActivityPlanners();
//       setPlanners(list);
//       if (list.length > 0 && !plannerId) setPlannerId(list[0].id);
//     } finally { setLoading(false); }
//   }, [plannerId]);

//   useEffect(() => { load(); }, [load]);

//   const handleTaskStatusChange = async (taskId: number, status: string) => {
//     setPlanners(prev => prev.map(p => ({
//       ...p,
//       member_plans: p.member_plans.map(m => ({
//         ...m,
//         tasks: (m.tasks || []).map(t => t.id === taskId ? { ...t, status: status as any } : t),
//       })),
//     })));
//     try { await api.updatePlannerTask(taskId, { status: status as any }); await load(); }
//     catch { load(); }
//   };

//   const handleWeekendWorkingToggle = async (date: string) => {
//     if (!selectedPlanner) return;
//     const current = parseWeekendConfigFromNotes(selectedPlanner.notes).working_weekend_dates;
//     const next     = current.includes(date) ? current.filter(d => d !== date) : [...current, date];
//     const nextNotes = JSON.stringify({ working_weekend_dates: next });
//     setPlanners(prev => prev.map(p => p.id === selectedPlanner.id ? { ...p, notes: nextNotes } : p));
//     try { await api.updateActivityPlanner(selectedPlanner.id, { notes: nextNotes }); await load(); }
//     catch { await load(); }
//   };

//   const memberWeeks = useMemo(() => {
//     if (!selectedPlanner || !activeMemberPlan) return [];
//     const auto = buildAutoPlanFromTargets(activeMemberPlan, selectedPlanner.month, selectedPlanner.year, selectedPlannerWeekendConfig.working_weekend_dates);
//     return forceLeaveDaysToZero(auto, selectedPlannerWeekendConfig.working_weekend_dates);
//   }, [selectedPlanner, activeMemberPlan, selectedPlannerWeekendConfig.working_weekend_dates]);

//   useEffect(() => {
//     if (memberWeeks.length > 0)
//       setSelectedWeek(prev => (prev && memberWeeks.some(w => w.week === prev)) ? prev : memberWeeks[0].week);
//     else setSelectedWeek(null);
//   }, [memberWeeks]);

//   const activeWeek = useMemo(
//     () => memberWeeks.find(w => w.week === selectedWeek) || null,
//     [memberWeeks, selectedWeek],
//   );

//   const stats = useMemo(() => {
//     if (!activeMemberPlan) return null;
//     const tasks = activeMemberPlan.tasks || [];
//     const done  = tasks.filter(t => t.status === 'done').length;
//     return { total: tasks.length, done, pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
//   }, [activeMemberPlan]);

//   const workdayCount = useMemo(() => {
//     const allDays = getDaysInMonth(month, year);
//     const workingWeekendSet = new Set(workingWeekendDates);
//     return allDays.filter(d => {
//       const dow = d.getDay();
//       const isWeekend = dow === 0 || dow === 6;
//       return !isWeekend || workingWeekendSet.has(ymd(d));
//     }).length;
//   }, [month, year, workingWeekendDates]);

//   const totalWeeks = useMemo(() => {
//     const allDays = getDaysInMonth(month, year);
//     return Math.ceil(allDays[allDays.length - 1].getDate() / 7);
//   }, [month, year]);

//   const memberTotals = (m: any) =>
//     (m.monthly_calls_target || 0) + (m.monthly_whatsapp_target || 0) +
//     (m.monthly_email_target || 0) + (m.monthly_linkedin_target || 0);

//   const dailyAvg = (m: any) =>
//     workdayCount > 0 ? (memberTotals(m) / workdayCount).toFixed(1) : '0';

//   // ─────────────────────────────────────────────────────────────────────────────

//   return (
//     <div className="h-full flex flex-col bg-slate-50 overflow-hidden font-sans">

//       {/* ── Header ── */}
//       <header className="bg-indigo-600 px-6 py-0 flex items-center justify-between shrink-0 h-14 shadow-md shadow-indigo-900/20">
//         <div className="flex items-center gap-3">
//           <div className="bg-white/15 p-2 rounded-xl">
//             <Target className="text-white" size={16} />
//           </div>
//           <div>
//            <h1 className="text-[18px] font-bold text-white leading-tight">Activity Architect</h1>
//             <p className="text-[10px] text-indigo-200 font-bold mt-0.5 leading-none">
//               {selectedPlanner?.name || 'Monthly Activity Planner'}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-1.5">
//           {/* Step progress strip */}
//           <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-full px-2 py-1.5 mr-2">
//             {[
//               { s: 1, label: 'Setup',    icon: <Settings size={12} /> },
//               { s: 2, label: 'Team',     icon: <Users size={12} /> },
//               { s: 3, label: 'Calendar', icon: <Calendar size={12} /> },
//             ].map(({ s, label, icon }, idx) => {
//               const done   = step > s;
//               const active = step === s;
//               return (
//                 <React.Fragment key={s}>
//                   {idx > 0 && <div className="w-4 h-px bg-white/20 mx-0.5" />}
//                   <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${
//                     done   ? 'bg-white/20 text-white border-white/30' :
//                     active ? 'bg-white text-indigo-700 border-white shadow-sm' :
//                              'text-white/50 border-transparent'
//                   }`}>
//                     {done ? <CheckCircle2 size={12} /> : icon}{label}
//                   </div>
//                 </React.Fragment>
//               );
//             })}
//           </div>
//           <button
//             onClick={load}
//             className={`p-2 rounded-lg hover:bg-white/15 text-white/70 hover:text-white transition-colors ${loading ? 'animate-spin' : ''}`}
//           >
//             <RefreshCcw size={14} />
//           </button>
//         </div>
//       </header>

//       <main className="flex-1 flex min-h-0">

//         {/* ════════════════════════════════════════════════════
//             STEP 3 — CALENDAR
//         ════════════════════════════════════════════════════ */}
//         {step === 3 && selectedPlanner ? (
//           <>
//             {/* ── Sidebar ── */}
//             <aside className="w-[220px] bg-white border-r border-slate-200/80 flex flex-col shrink-0">

//               {/* Member list */}
//               <div className="px-3 pt-4 pb-3 border-b border-slate-100">
//                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.12em] mb-2.5 px-1">Team members</p>
//                 <div className="space-y-0.5">
//                   {selectedPlanner.member_plans.map(m => {
//                     const isActive = selectedMemberId === m.id;
//                     const memberStats = (() => {
//                       const tasks = m.tasks || [];
//                       const done  = tasks.filter((t: any) => t.status === 'done').length;
//                       return tasks.length ? Math.round((done / tasks.length) * 100) : 0;
//                     })();
//                     return (
//                       <button
//                         key={m.id}
//                         onClick={() => { setSelectedMemberId(m.id); setPlannerView('month'); }}
//                         className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all ${
//                           isActive
//                             ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
//                             : 'hover:bg-slate-50 text-slate-700'
//                         }`}
//                       >
//                         <div className={`h-7 w-7 rounded-lg flex items-center justify-center font-black text-[11px] uppercase shrink-0 ${
//                           isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
//                         }`}>
//                           {m.member_name.charAt(0) || 'U'}
//                         </div>
//                         <div className="text-left flex-1 min-w-0">
//                           <p className={`text-[11px] font-semibold truncate leading-tight ${isActive ? 'text-white' : 'text-slate-700'}`}>
//                             {m.member_name}
//                           </p>
//                           <div className={`mt-1 h-0.5 rounded-full overflow-hidden ${isActive ? 'bg-white/30' : 'bg-slate-100'}`}>
//                             <div
//                               className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-white' : 'bg-indigo-400'}`}
//                               style={{ width: `${memberStats}%` }}
//                             />
//                           </div>
//                         </div>
//                         <span className={`text-[9px] font-bold shrink-0 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
//                           {memberStats}%
//                         </span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Completion card */}
//               <div className="px-3 py-3 border-b border-slate-100">
//                 <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-3.5 text-white">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Completion</span>
//                     <span className="text-xl font-black">{stats?.pct ?? 0}<span className="text-sm font-normal text-slate-400">%</span></span>
//                   </div>
//                   <div className="h-1 bg-slate-700 rounded-full overflow-hidden mb-2">
//                     <div
//                       className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full transition-all duration-700"
//                       style={{ width: `${stats?.pct ?? 0}%` }}
//                     />
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-[10px] text-slate-400">{stats?.done ?? 0} done</span>
//                     <span className="text-[10px] text-slate-500">{stats?.total ?? 0} total</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Weekly distribution */}
//               <div className="flex-1 overflow-y-auto px-3 py-3 custom-scrollbar">
//                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.12em] mb-2 px-1 flex items-center gap-1.5">
//                   <Layers size={9} className="text-indigo-400" /> Weekly distribution
//                 </p>
//                 <div className="space-y-1">
//                   {memberWeeks.map(w => (
//                     <button
//                       key={w.week}
//                       onClick={() => { setSelectedWeek(w.week); setPlannerView('week'); }}
//                       className={`w-full p-2.5 rounded-xl border text-left transition-all ${
//                         selectedWeek === w.week && plannerView === 'week'
//                           ? 'bg-indigo-50 border-indigo-200'
//                           : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/40'
//                       }`}
//                     >
//                       <div className="flex items-center justify-between mb-1.5">
//                         <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 uppercase tracking-wide">
//                           Wk {w.week}
//                         </span>
//                         <span className="text-[11px] font-black text-slate-700">{w.total}</span>
//                       </div>
//                       {/* micro channel bars */}
//                       <div className="flex gap-0.5">
//                         {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => {
//                           const maxVal = Math.max(...memberWeeks.map(wk => wk.totals[ch]), 1);
//                           const pct = Math.round((w.totals[ch] / maxVal) * 100);
//                           return (
//                             <div key={ch} className="flex-1 flex flex-col gap-0.5">
//                               <div className={`h-1 rounded-full ${CHANNEL_CONFIG[ch].bg} overflow-hidden`}>
//                                 <div
//                                   className={`h-full rounded-full bg-gradient-to-r ${CHANNEL_CONFIG[ch].gradient}`}
//                                   style={{ width: `${pct}%` }}
//                                 />
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                       <p className="text-[9px] text-slate-400 mt-1.5">{w.startDate.slice(5)} – {w.endDate.slice(5)}</p>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="p-3 border-t border-slate-100">
//                 <button
//                   onClick={() => setStep(1)}
//                   className="w-full py-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
//                 >
//                   <Plus size={12} /> New Plan
//                 </button>
//               </div>
//             </aside>

//             {/* ── Main calendar area ── */}
//             <section className="flex-1 flex flex-col bg-slate-50 overflow-hidden">

//               {/* Calendar toolbar */}
//               <div className="px-5 py-2.5 border-b border-slate-200/80 bg-white flex items-center justify-between gap-3 shrink-0">
//                 <div className="flex items-center gap-2.5">
//                   {plannerView === 'week' && (
//                     <button
//                       onClick={() => setPlannerView('month')}
//                       className="h-8 w-8 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors"
//                     >
//                       <ChevronLeft size={14} />
//                     </button>
//                   )}
//                   <div>
//                     <h2 className="text-sm font-black text-slate-800 leading-tight">
//                       {plannerView === 'month'
//                         ? `${MONTHS.find(m => m.value === selectedPlanner.month)?.label} ${selectedPlanner.year}`
//                         : `Week ${activeWeek?.week} · ${activeWeek?.startDate} → ${activeWeek?.endDate}`}
//                     </h2>
//                     <p className="text-[10px] text-slate-400">
//                       {plannerView === 'month' ? 'Click any week card to drill into daily view' : 'Day-by-day activity breakdown'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Channel legend pills */}
//                 <div className="flex items-center gap-1.5">
//                   {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
//                     <div key={ch} className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-semibold ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].border} ${CHANNEL_CONFIG[ch].text}`}>
//                       {CHANNEL_CONFIG[ch].icon}
//                       <span>{CHANNEL_CONFIG[ch].label}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Weekend policy strip */}
//               <div className="px-5 py-2 border-b border-slate-200/60 bg-white/60 flex items-center gap-3 flex-wrap shrink-0">
//                 <div className="flex items-center gap-1.5">
//                   <Clock size={11} className="text-slate-400" />
//                   <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Weekend policy</span>
//                 </div>
//                 <span className="text-[10px] text-slate-300">|</span>
//                 <span className="text-[10px] text-slate-400">Sat/Sun default to Leave — toggle to mark as working</span>
//                 <div className="flex flex-wrap gap-1 ml-auto">
//                   {calendarWeekendOptions.map(date => {
//                     const active = selectedPlannerWeekendConfig.working_weekend_dates.includes(date);
//                     const day    = new Date(`${date}T00:00:00`);
//                     return (
//                       <button
//                         key={date}
//                         type="button"
//                         onClick={() => handleWeekendWorkingToggle(date)}
//                         className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
//                           active
//                             ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
//                             : 'bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100'
//                         }`}
//                       >
//                         {date.slice(8)} {day.getDay() === 6 ? 'Sat' : 'Sun'} · {active ? '✓ Working' : 'Leave'}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* ── Month view ── */}
//               {plannerView === 'month' ? (
//                 <div className="flex-1 overflow-y-auto p-5">
//                   {/* Month totals bar */}
//                   <div className="grid grid-cols-4 gap-3 mb-5">
//                     {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => {
//                       const monthTotal = memberWeeks.reduce((s, w) => s + w.totals[ch], 0);
//                       return (
//                         <div key={ch} className={`bg-white border ${CHANNEL_CONFIG[ch].border} rounded-2xl p-3.5 flex items-center gap-3`}>
//                           <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${CHANNEL_CONFIG[ch].gradient} shadow-sm`}>
//                             <span className="text-white">{CHANNEL_CONFIG[ch].icon}</span>
//                           </div>
//                           <div>
//                             <p className={`text-lg font-black leading-none ${CHANNEL_CONFIG[ch].text}`}>{monthTotal}</p>
//                             <p className="text-[10px] text-slate-400 mt-0.5">{CHANNEL_CONFIG[ch].label}</p>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* Week cards grid */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
//                     {memberWeeks.map(w => (
//                       <button
//                         key={w.week}
//                         onClick={() => { setSelectedWeek(w.week); setPlannerView('week'); }}
//                         className="text-left p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100/60 transition-all group bg-white"
//                       >
//                         <div className="flex justify-between items-start mb-3">
//                           <div>
//                             <span className="text-[9px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-lg inline-block mb-1">
//                               Week {w.week}
//                             </span>
//                             <p className="text-[10px] text-slate-400">{w.startDate.slice(5)} – {w.endDate.slice(5)}</p>
//                           </div>
//                           <div className="text-right">
//                             <p className="text-xl font-black text-slate-800 leading-none">{w.total}</p>
//                             <p className="text-[10px] text-slate-400">activities</p>
//                           </div>
//                         </div>

//                         {/* Stacked bar */}
//                         <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden mb-3">
//                           {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
//                             <div
//                               key={ch}
//                               className={`bg-gradient-to-r ${CHANNEL_CONFIG[ch].gradient} transition-all`}
//                               style={{ flex: w.totals[ch] || 0.5 }}
//                             />
//                           ))}
//                         </div>

//                         <div className="grid grid-cols-2 gap-1.5">
//                           {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
//                             <div key={ch} className={`px-2 py-1.5 rounded-xl border ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].border} flex items-center justify-between`}>
//                               <div className={`flex items-center gap-1 ${CHANNEL_CONFIG[ch].text}`}>
//                                 {CHANNEL_CONFIG[ch].icon}
//                                 <span className="text-[9px] font-semibold">{CHANNEL_CONFIG[ch].label}</span>
//                               </div>
//                               <span className={`text-sm font-black ${CHANNEL_CONFIG[ch].text}`}>{w.totals[ch]}</span>
//                             </div>
//                           ))}
//                         </div>

//                         <div className="mt-2.5 flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-indigo-500 transition-colors">
//                           <span>View daily breakdown</span>
//                           <ArrowRight size={10} />
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//               ) : (
//                 /* ── Week view ── */
//                 <div className="flex-1 overflow-y-auto p-5">
//                   {/* Week summary strip */}
//                   {activeWeek && (
//                     <div className="grid grid-cols-4 gap-3 mb-4">
//                       {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
//                         <div key={ch} className={`bg-white border ${CHANNEL_CONFIG[ch].border} rounded-2xl px-3 py-2.5 flex items-center gap-2.5`}>
//                           <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${CHANNEL_CONFIG[ch].gradient}`}>
//                             <span className="text-white">{CHANNEL_CONFIG[ch].icon}</span>
//                           </div>
//                           <div>
//                             <p className={`text-base font-black leading-none ${CHANNEL_CONFIG[ch].text}`}>{activeWeek.totals[ch]}</p>
//                             <p className="text-[10px] text-slate-400">{CHANNEL_CONFIG[ch].label}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* Calendar grid — proper outlined calendar */}
//                   <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md bg-white">
//                     {/* Day-of-week headers */}
//                     <div className="grid grid-cols-7 bg-indigo-600">
//                       {DAYS_OF_WEEK.map((day, di) => (
//                         <div
//                           key={day}
//                           className={`py-3 text-center text-[11px] font-black text-white uppercase tracking-widest ${di < 6 ? 'border-r border-indigo-500' : ''}`}
//                         >
//                           {day}
//                         </div>
//                       ))}
//                     </div>

//                     {activeWeek && (() => {
//                       const firstDate = new Date(`${activeWeek.startDate}T00:00:00`);
//                       const blanks    = Array(firstDate.getDay()).fill(null);
//                       const cells     = [...blanks, ...activeWeek.days];

//                       return (
//                         <div className="grid grid-cols-7" style={{ gridAutoRows: '160px' }}>
//                           {cells.map((day, i) => {
//                             if (!day) return (
//                               <div
//                                 key={`blank-${i}`}
//                                 className={`bg-slate-50 ${i % 7 < 6 ? 'border-r' : ''} border-b border-slate-200`}
//                               />
//                             );

//                             const dateTasks        = (activeMemberPlan?.tasks || []).filter((t: any) => t.task_date === day.date);
//                             const dayDate          = new Date(`${day.date}T00:00:00`);
//                             const dow              = dayDate.getDay();
//                             const isWeekend        = dow === 0 || dow === 6;
//                             const isWorkingWeekend = selectedPlannerWeekendConfig.working_weekend_dates.includes(day.date);
//                             const isLeaveDay       = isWeekend && !isWorkingWeekend;
//                             const isToday          = ymd(new Date()) === day.date;
//                             const colIdx           = i % 7;
//                             const isLastCol        = colIdx === 6;
//                             const visibleTasks     = dateTasks.slice(0, 1);
//                             const overflowCount    = dateTasks.length - visibleTasks.length;

//                             return (
//                               <div
//                                 key={day.date}
//                                 className={`flex flex-col ${!isLastCol ? 'border-r' : ''} border-b border-slate-200 transition-colors ${
//                                   isLeaveDay
//                                     ? 'bg-slate-50'
//                                     : isToday
//                                     ? 'bg-indigo-50/50'
//                                     : 'bg-white hover:bg-slate-50/40'
//                                 }`}
//                               >
//                                 {/* Date header row */}
//                                 <div className={`flex items-center justify-between px-2.5 pt-2 pb-1.5 border-b ${
//                                   isToday ? 'border-indigo-200 bg-indigo-50' : 'border-slate-100'
//                                 } ${isLeaveDay ? 'border-slate-100' : ''}`}>
//                                   <span className={`text-sm font-black w-7 h-7 flex items-center justify-center rounded-full ${
//                                     isToday
//                                       ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300'
//                                       : isLeaveDay
//                                       ? 'text-slate-300'
//                                       : 'text-slate-700'
//                                   }`}>
//                                     {dayDate.getDate()}
//                                   </span>
//                                   {isLeaveDay ? (
//                                     <span className="text-[9px] font-black text-rose-400 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md">Leave</span>
//                                   ) : (
//                                     <span className={`text-[11px] font-black ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{day.total}</span>
//                                   )}
//                                 </div>

//                                 {/* Body */}
//                                 <div className="flex-1 px-2 pt-1.5 pb-2 flex flex-col gap-1 overflow-hidden">
//                                   {/* Channel chips — show all 4 channels compactly */}
//                                   {!isLeaveDay && (
//                                     <div className="grid grid-cols-2 gap-1">
//                                       {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
//                                         <div
//                                           key={ch}
//                                           className={`px-1.5 py-1 rounded-md text-[9px] font-semibold flex items-center justify-between ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].text} border ${CHANNEL_CONFIG[ch].border}`}
//                                         >
//                                           <div className="flex items-center gap-0.5 truncate">
//                                             {CHANNEL_CONFIG[ch].icon}
//                                             <span className="truncate">{CHANNEL_CONFIG[ch].label}</span>
//                                           </div>
//                                           <span className="font-black ml-1 shrink-0">{day.byChannel[ch]}</span>
//                                         </div>
//                                       ))}
//                                     </div>
//                                   )}

//                                   {/* Tasks */}
//                                   {!isLeaveDay && dateTasks.length > 0 && (
//                                     <div className="flex flex-col gap-0.5 mt-0.5">
//                                       {visibleTasks.map((t: any) => (
//                                         <button
//                                           key={t.id}
//                                           onClick={() => handleTaskStatusChange(
//                                             t.id,
//                                             t.status === 'pending' ? 'in_progress' : t.status === 'in_progress' ? 'done' : 'pending',
//                                           )}
//                                           className={`w-full text-left text-[9px] px-1.5 py-1 rounded-md border transition-colors ${
//                                             t.status === 'done'
//                                               ? 'bg-emerald-50 border-emerald-200 text-emerald-700 line-through'
//                                               : t.status === 'in_progress'
//                                               ? 'bg-amber-50 border-amber-200 text-amber-700'
//                                               : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
//                                           }`}
//                                         >
//                                           <span className="truncate block">{t.title}</span>
//                                         </button>
//                                       ))}
//                                       {overflowCount > 0 && (
//                                         <button
//                                           onClick={() => setOverflowModal({ date: day.date, tasks: dateTasks })}
//                                           className="w-full text-left text-[9px] px-1.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-100 transition-colors"
//                                         >
//                                           +{overflowCount} more task{overflowCount > 1 ? 's' : ''} →
//                                         </button>
//                                       )}
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       );
//                     })()}
//                   </div>

//                   {/* Task overflow modal */}
//                   {overflowModal && (
//                     <div
//                       className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-6"
//                       onClick={() => setOverflowModal(null)}
//                     >
//                       <div
//                         className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden"
//                         onClick={e => e.stopPropagation()}
//                       >
//                         {/* Modal header */}
//                         <div className="bg-indigo-600 px-5 py-4 flex items-center justify-between">
//                           <div>
//                             <p className="text-xs font-black text-white uppercase tracking-wide">Tasks</p>
//                             <p className="text-[10px] text-indigo-200 mt-0.5">{overflowModal.date}</p>
//                           </div>
//                           <button
//                             onClick={() => setOverflowModal(null)}
//                             className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors text-sm font-black"
//                           >
//                             ✕
//                           </button>
//                         </div>
//                         {/* Task list */}
//                         <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
//                           {overflowModal.tasks.map((t: any) => (
//                             <button
//                               key={t.id}
//                               onClick={() => {
//                                 handleTaskStatusChange(
//                                   t.id,
//                                   t.status === 'pending' ? 'in_progress' : t.status === 'in_progress' ? 'done' : 'pending',
//                                 );
//                                 setOverflowModal(prev => prev ? {
//                                   ...prev,
//                                   tasks: prev.tasks.map(task =>
//                                     task.id === t.id ? {
//                                       ...task,
//                                       status: task.status === 'pending' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'pending'
//                                     } : task
//                                   )
//                                 } : null);
//                               }}
//                               className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
//                                 t.status === 'done'
//                                   ? 'bg-emerald-50 border-emerald-200 text-emerald-700 line-through'
//                                   : t.status === 'in_progress'
//                                   ? 'bg-amber-50 border-amber-200 text-amber-700'
//                                   : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
//                               }`}
//                             >
//                               <div className="flex items-center justify-between gap-2">
//                                 <span>{t.title}</span>
//                                 <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${
//                                   t.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
//                                   t.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
//                                   'bg-slate-100 text-slate-500'
//                                 }`}>
//                                   {t.status === 'in_progress' ? 'In Progress' : t.status === 'done' ? 'Done' : 'Pending'}
//                                 </span>
//                               </div>
//                             </button>
//                           ))}
//                         </div>
//                         <div className="px-4 pb-4">
//                           <p className="text-[10px] text-slate-400 text-center">Click any task to cycle its status</p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </section>
//           </>

//         ) : (
//           /* ════════════════════════════════════════════════════
//               STEPS 1 & 2
//           ════════════════════════════════════════════════════ */
//           <div className="flex-1 overflow-y-auto">

//             {/* ── STEP 1 ── */}
//             {step === 1 && (
//               <div className="min-h-full p-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start max-w-6xl mx-auto w-full">

//                 {/* Left — form */}
//                 <div className="space-y-4">
//                   {/* Plan details */}
//                   <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//                     <div className="flex items-center gap-2 mb-4">
//                       <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
//                         <Zap size={13} className="text-indigo-600" />
//                       </div>
//                       <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Plan details</h3>
//                     </div>
//                     <div className="space-y-3">
//                       <div>
//                         <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Plan name</label>
//                         <input
//                           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors"
//                           value={planName}
//                           onChange={e => setPlanName(e.target.value)}
//                         />
//                       </div>
//                       <div className="grid grid-cols-2 gap-3">
//                         <div>
//                           <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Month</label>
//                           <select
//                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors"
//                             value={month}
//                             onChange={e => setMonth(Number(e.target.value))}
//                           >
//                             {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Year</label>
//                           <input
//                             type="number"
//                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors"
//                             value={year}
//                             onChange={e => setYear(Number(e.target.value))}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Weekend working days */}
//                   <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center gap-2">
//                         <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
//                           <Calendar size={13} className="text-emerald-600" />
//                         </div>
//                         <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Weekend working days</h3>
//                       </div>
//                       <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
//                         workingWeekendDates.length > 0
//                           ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
//                           : 'bg-slate-50 text-slate-400 border-slate-200'
//                       }`}>
//                         {workingWeekendDates.length} selected
//                       </span>
//                     </div>
//                     <p className="text-[11px] text-slate-400 mb-3">
//                       Weekdays are always included. Toggle any weekend day to mark it as working.
//                     </p>
//                     <div className="grid grid-cols-5 gap-2">
//                       {weekendOptions.map(date => {
//                         const active = workingWeekendDates.includes(date);
//                         const day    = new Date(`${date}T00:00:00`);
//                         return (
//                           <button
//                             type="button"
//                             key={date}
//                             onClick={() => setWorkingWeekendDates(prev =>
//                               prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date],
//                             )}
//                             className={`py-2.5 px-1 rounded-xl text-[11px] font-semibold border transition-all text-center ${
//                               active
//                                 ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
//                                 : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-white'
//                             }`}
//                           >
//                             <span className="block font-black text-sm">{date.slice(8)}</span>
//                             <span className="block text-[9px] mt-0.5 opacity-70">{day.getDay() === 6 ? 'Sat' : 'Sun'}</span>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   <button
//                     onClick={async () => {
//                       setSaving(true);
//                       try {
//                         const res = await api.createActivityPlanner({
//                           name: planName, month, year, status: 'active',
//                           notes: JSON.stringify({ working_weekend_dates: workingWeekendDates }),
//                         });
//                         setPlannerId(res.id);
//                         await load();
//                         setStep(2);
//                       } finally { setSaving(false); }
//                     }}
//                     className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl font-black text-sm hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.99] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
//                   >
//                     {saving ? 'Creating plan…' : (
//                       <>
//                         Initialize team setup
//                         <ArrowRight size={15} />
//                       </>
//                     )}
//                   </button>
//                 </div>

//                 {/* Right — context panel */}
//                 <div className="space-y-4">
//                   {/* Live stats */}
//                   <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
//                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.12em] mb-4">
//                       {MONTHS.find(m => m.value === month)?.label} {year} snapshot
//                     </p>
//                     <div className="grid grid-cols-2 gap-2.5">
//                       {[
//                         { label: 'Total days',       value: getDaysInMonth(month, year).length, icon: <Calendar size={12} /> },
//                         { label: 'Working days',     value: workdayCount,                       icon: <Zap size={12} /> },
//                         { label: 'Working weekends', value: workingWeekendDates.length,          icon: <CheckCircle2 size={12} /> },
//                         { label: 'Weeks',            value: totalWeeks,                          icon: <Layers size={12} /> },
//                       ].map(s => (
//                         <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
//                           <div className="flex items-center gap-1.5 mb-1.5 text-slate-400">{s.icon}<span className="text-[10px]">{s.label}</span></div>
//                           <p className="text-2xl font-black text-white">{s.value}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Existing plans — recent 5 */}
//                   {planners.length > 0 && (
//                     <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
//                       <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center">
//                             <Layers size={11} className="text-indigo-600" />
//                           </div>
//                           <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Recent plans</h3>
//                         </div>
//                         <span className="text-[10px] text-slate-400 font-medium">
//                           {Math.min(planners.length, 5)} of {planners.length}
//                         </span>
//                       </div>
//                       <div className="divide-y divide-slate-50">
//                         {[...planners].slice(0, 5).map((p, idx) => {
//                           const isActive = plannerId === p.id;
//                           const totalActs = (p.member_plans || []).reduce((s: number, m: any) =>
//                             s + (m.monthly_calls_target || 0) + (m.monthly_whatsapp_target || 0) +
//                             (m.monthly_email_target || 0) + (m.monthly_linkedin_target || 0), 0);
//                           return (
//                             <button
//                               key={p.id}
//                               onClick={() => { setPlannerId(p.id); setStep(3); }}
//                               className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-indigo-50/60 group ${
//                                 isActive ? 'bg-indigo-50' : ''
//                               }`}
//                             >
//                               {/* Index bubble */}
//                               <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${
//                                 isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
//                               }`}>
//                                 {idx + 1}
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <p className={`text-xs font-bold truncate ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>{p.name}</p>
//                                 <div className="flex items-center gap-2 mt-0.5">
//                                   <span className="text-[10px] text-slate-400">
//                                     {MONTHS.find(m => m.value === p.month)?.label} {p.year}
//                                   </span>
//                                   <span className="text-slate-200">·</span>
//                                   <span className="text-[10px] text-slate-400">{p.member_plans?.length ?? 0} members</span>
//                                   {totalActs > 0 && (
//                                     <>
//                                       <span className="text-slate-200">·</span>
//                                       <span className="text-[10px] text-indigo-500 font-semibold">{totalActs} acts</span>
//                                     </>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className={`flex items-center gap-1 text-[10px] font-semibold transition-colors shrink-0 ${
//                                 isActive ? 'text-indigo-600' : 'text-slate-300 group-hover:text-indigo-400'
//                               }`}>
//                                 <span>{isActive ? 'Active' : 'Open'}</span>
//                                 <ArrowRight size={10} />
//                               </div>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* ── STEP 2 ── */}
//             {step === 2 && (
//               <div className="min-h-full p-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 items-start max-w-6xl mx-auto w-full">

//                 {/* Left — member sidebar */}
//                 <div className="space-y-4">
//                   {/* Agent list */}
//                   <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center gap-2">
//                         <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
//                           <Users size={12} className="text-indigo-600" />
//                         </div>
//                         <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Agents ({members.length})</h3>
//                       </div>
//                       <button
//                         onClick={() => setMembers([...members, { ...members[0], member_name: '' }])}
//                         className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
//                       >
//                         <Plus size={11} /> Add
//                       </button>
//                     </div>
//                     <div className="space-y-1">
//                       {members.map((m, i) => (
//                         <div key={i} className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-100">
//                           <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center text-[11px] font-black uppercase shrink-0">
//                             {m.member_name?.charAt(0) || '?'}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-[11px] font-semibold text-slate-700 truncate">{m.member_name || 'Unnamed agent'}</p>
//                             <p className="text-[9px] text-slate-400">{memberTotals(m)} act · {dailyAvg(m)}/day</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Plan summary */}
//                   <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-4">
//                     <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 mb-3">Plan summary</p>
//                     <div className="space-y-2.5">
//                       {[
//                         { label: 'Period',       value: `${MONTHS.find(m => m.value === month)?.label} ${year}` },
//                         { label: 'Working days', value: workdayCount },
//                         { label: 'Agents',       value: members.length },
//                       ].map(row => (
//                         <div key={row.label} className="flex justify-between items-center">
//                           <span className="text-[11px] text-slate-400">{row.label}</span>
//                           <span className="text-[11px] font-bold text-white">{row.value}</span>
//                         </div>
//                       ))}
//                       <div className="flex justify-between items-center border-t border-slate-700 pt-2.5">
//                         <span className="text-[11px] text-slate-400">Total activities</span>
//                         <span className="text-lg font-black text-indigo-400">
//                           {members.reduce((sum, m) => sum + memberTotals(m), 0)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Channel breakdown */}
//                   <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
//                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.12em] mb-3">Team channel totals</p>
//                     <div className="space-y-2">
//                       {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => {
//                         const total = members.reduce((s, m) => s + (m[`monthly_${ch}_target`] || 0), 0);
//                         const max   = members.reduce((s, m) => s + memberTotals(m), 0) || 1;
//                         return (
//                           <div key={ch}>
//                             <div className="flex items-center justify-between mb-0.5">
//                               <div className={`flex items-center gap-1 text-[10px] font-semibold ${CHANNEL_CONFIG[ch].text}`}>
//                                 {CHANNEL_CONFIG[ch].icon} {CHANNEL_CONFIG[ch].label}
//                               </div>
//                               <span className="text-[10px] font-black text-slate-600">{total}</span>
//                             </div>
//                             <div className={`h-1 rounded-full ${CHANNEL_CONFIG[ch].bg} overflow-hidden`}>
//                               <div
//                                 className={`h-full rounded-full bg-gradient-to-r ${CHANNEL_CONFIG[ch].gradient} transition-all duration-500`}
//                                 style={{ width: `${Math.round((total / max) * 100)}%` }}
//                               />
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right — agent cards */}
//                 <div>
//                   <div className="mb-5">
//                     <h2 className="text-lg font-black text-slate-800 leading-tight">Configure agents</h2>
//                     <p className="text-sm text-slate-400 mt-0.5">Set monthly channel targets for each team member.</p>
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4">
//                     {members.map((m, i) => (
//                       <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative group hover:border-indigo-200 hover:shadow-md transition-all">
//                         {/* Agent name */}
//                         <div className="flex items-center gap-3 mb-4 pb-3.5 border-b border-slate-100">
//                           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center font-black text-sm uppercase shrink-0 shadow-sm shadow-indigo-200">
//                             {m.member_name?.charAt(0) || '?'}
//                           </div>
//                           <input
//                             placeholder="Agent name…"
//                             className="flex-1 text-sm font-bold text-slate-800 border-none focus:ring-0 p-0 bg-transparent placeholder:text-slate-300 outline-none"
//                             value={m.member_name}
//                             onChange={e => {
//                               const nm = [...members];
//                               nm[i].member_name    = e.target.value;
//                               nm[i].workspace_name = `${e.target.value}'s Workspace`;
//                               setMembers(nm);
//                             }}
//                           />
//                           {members.length > 1 && (
//                             <button
//                               onClick={() => setMembers(members.filter((_, idx) => idx !== i))}
//                               className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all p-1 rounded-lg hover:bg-red-50"
//                             >
//                               <Trash2 size={13} />
//                             </button>
//                           )}
//                         </div>

//                         {/* Channel targets */}
//                         <div className="grid grid-cols-2 gap-2">
//                           {(['calls', 'whatsapp', 'email', 'linkedin'] as Channel[]).map(ch => (
//                             <div key={ch} className={`p-3 rounded-xl border ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].border}`}>
//                               <label className={`text-[9px] font-black uppercase tracking-wide flex items-center gap-1 mb-1.5 ${CHANNEL_CONFIG[ch].text}`}>
//                                 {CHANNEL_CONFIG[ch].icon} {ch}
//                               </label>
//                               <NumericInput
//                                 className={`bg-transparent font-black text-slate-800 w-full outline-none text-xl leading-none`}
//                                 value={m[`monthly_${ch}_target`]}
//                                 onChange={v => {
//                                   const nm = [...members];
//                                   nm[i][`monthly_${ch}_target`] = v;
//                                   setMembers(nm);
//                                 }}
//                               />
//                               <p className={`text-[9px] mt-0.5 ${CHANNEL_CONFIG[ch].text} opacity-70`}>
//                                 ~{workdayCount > 0 ? (m[`monthly_${ch}_target`] / workdayCount).toFixed(1) : 0}/day
//                               </p>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Card footer */}
//                         <div className="mt-3 flex justify-between items-center px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
//                           <div className="flex items-center gap-1.5">
//                             <Activity size={11} className="text-slate-400" />
//                             <span className="text-[11px] text-slate-400 font-semibold">Total activities</span>
//                           </div>
//                           <span className="text-sm font-black text-indigo-600">{memberTotals(m)}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="flex gap-3 mt-5">
//                     <button
//                       onClick={() => setStep(1)}
//                       className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
//                     >
//                       <ChevronLeft size={15} /> Back
//                     </button>
//                     <button
//                       onClick={async () => {
//                         if (!plannerId) return;
//                         setSaving(true);
//                         try {
//                           await api.assignPlannerMembers(plannerId, members);
//                           await load();
//                           setStep(3);
//                           setPlannerView('month');
//                         } finally { setSaving(false); }
//                       }}
//                       className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl font-black text-sm hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.99] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
//                     >
//                       {saving ? 'Generating calendar…' : (
//                         <>
//                           Deploy & view calendar
//                           <ArrowRight size={15} />
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default ActivityPlannerPage;


import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  CheckCircle2, Plus, RefreshCcw, Users,
  Target, Phone, MessageSquare, Mail,
  Linkedin, Sparkles, Trash2, Settings,
  Calendar, Layers, ChevronLeft, Info,
  TrendingUp, Activity, Zap, ArrowRight,
  BarChart2, Clock
} from 'lucide-react';
import { api } from '../Utils/api';
import type { ActivityPlanner, PlannerTask } from '../Utils/types';

type Step = 1 | 2 | 3;
type PlannerView = 'month' | 'week';
type Channel = 'calls' | 'whatsapp' | 'email' | 'linkedin';

type PlannedDay = {
  date: string;
  byChannel: Record<Channel, number>;
  total: number;
};

type PlannedWeek = {
  week: number;
  startDate: string;
  endDate: string;
  days: PlannedDay[];
  totals: Record<Channel, number>;
  total: number;
};

type PlannerWeekendConfig = {
  working_weekend_dates: string[];
};

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i, 1).toLocaleString('en', { month: 'long' }),
}));

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CHANNEL_CONFIG: Record<Channel, {
  icon: React.ReactNode; color: string; bg: string; text: string;
  border: string; label: string; gradient: string;
}> = {
  calls:    { icon: <Phone size={11} />,        color: 'text-blue-600',   bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   label: 'Calls',     gradient: 'from-blue-500 to-blue-600' },
  whatsapp: { icon: <MessageSquare size={11} />, color: 'text-emerald-600',bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',label: 'WhatsApp',  gradient: 'from-emerald-500 to-emerald-600' },
  email:    { icon: <Mail size={11} />,          color: 'text-amber-600',  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  label: 'Email',     gradient: 'from-amber-500 to-amber-600' },
  linkedin: { icon: <Linkedin size={11} />,      color: 'text-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'LinkedIn',  gradient: 'from-indigo-500 to-indigo-600' },
};

// ─── unchanged helpers ────────────────────────────────────────────────────────

const StepPill = ({ current, step, label, icon }: { current: number; step: number; label: string; icon: React.ReactNode }) => {
  const done   = current > step;
  const active = current === step;
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${
      done   ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
      active ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200' :
               'text-slate-400 border-transparent'
    }`}>
      {done ? <CheckCircle2 size={12} /> : icon}{label}
    </div>
  );
};

const NumericInput = ({ value, onChange, min = 0, max, className = '' }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; className?: string;
}) => {
  const [local, setLocal] = useState(String(value));
  useEffect(() => { setLocal(String(value)); }, [value]);
  return (
    <input type="text" inputMode="numeric" value={local} className={className}
      onChange={e => {
        const raw = e.target.value;
        if (raw === '' || /^\d*$/.test(raw)) setLocal(raw);
        const n = parseInt(raw, 10);
        if (!isNaN(n)) onChange(max !== undefined ? Math.min(max, Math.max(min, n)) : Math.max(min, n));
      }}
    />
  );
};

const ymd = (d: Date) => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getDaysInMonth = (month: number, year: number) => {
  const date = new Date(year, month - 1, 1);
  const days: Date[] = [];
  while (date.getMonth() === month - 1) { days.push(new Date(date)); date.setDate(date.getDate() + 1); }
  return days;
};

const getWeekendDaysInMonth = (month: number, year: number) =>
  getDaysInMonth(month, year).filter(d => { const day = d.getDay(); return day === 0 || day === 6; });

const spreadAcrossDays = (total: number, dayCount: number) => {
  if (dayCount <= 0) return [];
  const safeTotal = Math.max(0, total || 0);
  const base = Math.floor(safeTotal / dayCount);
  const rem  = safeTotal % dayCount;
  return Array.from({ length: dayCount }, (_, i) => base + (i < rem ? 1 : 0));
};

const spreadAcrossWeeksThenDays = (total: number, monthDays: Date[], workingWeekendDates: string[]): number[] => {
  const workingWeekendSet   = new Set(workingWeekendDates);
  const weekWorkingDayIndexes = new Map<number, number[]>();
  monthDays.forEach((d, i) => {
    const dow = d.getDay(); const isWeekend = dow === 0 || dow === 6;
    const isWorking = !isWeekend || workingWeekendSet.has(ymd(d));
    if (!isWorking) return;
    const week = Math.ceil(d.getDate() / 7);
    if (!weekWorkingDayIndexes.has(week)) weekWorkingDayIndexes.set(week, []);
    weekWorkingDayIndexes.get(week)!.push(i);
  });
  const weekNumbers = Array.from(weekWorkingDayIndexes.keys()).sort((a, b) => a - b);
  const byDay = Array(monthDays.length).fill(0);
  if (weekNumbers.length === 0) return byDay;
  const weeklySplit = spreadAcrossDays(total, weekNumbers.length);
  weekNumbers.forEach((week, idx) => {
    const dayIndexes = weekWorkingDayIndexes.get(week) || [];
    const perDay     = spreadAcrossDays(weeklySplit[idx] || 0, dayIndexes.length);
    dayIndexes.forEach((monthIdx, dayIdx) => { byDay[monthIdx] = perDay[dayIdx] || 0; });
  });
  return byDay;
};

const parseWeekendConfigFromNotes = (notes: string | null | undefined): PlannerWeekendConfig => {
  if (!notes) return { working_weekend_dates: [] };
  try {
    const parsed = JSON.parse(notes);
    const list   = Array.isArray(parsed?.working_weekend_dates) ? parsed.working_weekend_dates : [];
    return { working_weekend_dates: list.filter((d: unknown) => typeof d === 'string') };
  } catch { return { working_weekend_dates: [] }; }
};

const buildAutoPlanFromTargets = (member: any, month: number, year: number, workingWeekendDates: string[]): PlannedWeek[] => {
  const monthDays = getDaysInMonth(month, year);
  const dailyByChannel: Record<Channel, number[]> = {
    calls:    spreadAcrossWeeksThenDays(member.monthly_calls_target,    monthDays, workingWeekendDates),
    whatsapp: spreadAcrossWeeksThenDays(member.monthly_whatsapp_target, monthDays, workingWeekendDates),
    email:    spreadAcrossWeeksThenDays(member.monthly_email_target,    monthDays, workingWeekendDates),
    linkedin: spreadAcrossWeeksThenDays(member.monthly_linkedin_target, monthDays, workingWeekendDates),
  };
  const weekMap = new Map<number, PlannedWeek>();
  monthDays.forEach((d, i) => {
    const week = Math.ceil(d.getDate() / 7);
    if (!weekMap.has(week)) weekMap.set(week, { week, startDate: ymd(d), endDate: ymd(d), days: [], totals: { calls: 0, whatsapp: 0, email: 0, linkedin: 0 }, total: 0 });
    const w = weekMap.get(week)!;
    const byChannel = { calls: dailyByChannel.calls[i], whatsapp: dailyByChannel.whatsapp[i], email: dailyByChannel.email[i], linkedin: dailyByChannel.linkedin[i] };
    const total = byChannel.calls + byChannel.whatsapp + byChannel.email + byChannel.linkedin;
    w.days.push({ date: ymd(d), byChannel, total });
    w.totals.calls += byChannel.calls; w.totals.whatsapp += byChannel.whatsapp;
    w.totals.email += byChannel.email; w.totals.linkedin += byChannel.linkedin;
    w.total += total; w.endDate = ymd(d);
  });
  return Array.from(weekMap.values()).sort((a, b) => a.week - b.week);
};

const isWorkingDate = (date: string, workingWeekendDates: string[]) => {
  const d = new Date(`${date}T00:00:00`); const day = d.getDay();
  if (day !== 0 && day !== 6) return true;
  return workingWeekendDates.includes(date);
};

const forceLeaveDaysToZero = (weeks: PlannedWeek[], workingWeekendDates: string[]) =>
  weeks.map(w => {
    const nextDays = w.days.map(d => {
      if (isWorkingDate(d.date, workingWeekendDates)) return d;
      return { ...d, byChannel: { calls: 0, whatsapp: 0, email: 0, linkedin: 0 }, total: 0 };
    });
    const totals = nextDays.reduce(
      (acc, d) => ({ calls: acc.calls + d.byChannel.calls, whatsapp: acc.whatsapp + d.byChannel.whatsapp, email: acc.email + d.byChannel.email, linkedin: acc.linkedin + d.byChannel.linkedin }),
      { calls: 0, whatsapp: 0, email: 0, linkedin: 0 },
    );
    return { ...w, days: nextDays, totals, total: totals.calls + totals.whatsapp + totals.email + totals.linkedin };
  });

// ─── component ────────────────────────────────────────────────────────────────

export function ActivityPlannerPage() {
  const [step, setStep]                         = useState<Step>(1);
  const [loading, setLoading]                   = useState(false);
  const [saving, setSaving]                     = useState(false);
  const [planners, setPlanners]                 = useState<ActivityPlanner[]>([]);
  const [plannerId, setPlannerId]               = useState<number | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const [planName, setPlanName]                         = useState('Monthly Activity Planner');
  const [month, setMonth]                               = useState(new Date().getMonth() + 1);
  const [year, setYear]                                 = useState(new Date().getFullYear());
  const [workingWeekendDates, setWorkingWeekendDates]   = useState<string[]>([]);
  const [members, setMembers]                           = useState<any[]>([{
    member_name: '', workspace_name: '',
    monthly_calls_target: 100, monthly_whatsapp_target: 80,
    monthly_email_target: 60,  monthly_linkedin_target: 40,
    calls_weightage: 25, whatsapp_weightage: 25,
    email_weightage: 25, linkedin_weightage: 25,
  }]);

  const [plannerView, setPlannerView]   = useState<PlannerView>('month');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [overflowModal, setOverflowModal] = useState<{ date: string; tasks: any[] } | null>(null);

  const selectedPlanner = useMemo(() => planners.find(p => p.id === plannerId) || null, [planners, plannerId]);

  const weekendOptions = useMemo(
    () => getWeekendDaysInMonth(month, year).map(d => ymd(d)),
    [month, year],
  );
  useEffect(() => {
    setWorkingWeekendDates(prev => prev.filter(d => weekendOptions.includes(d)));
  }, [weekendOptions]);

  const selectedPlannerWeekendConfig = useMemo(
    () => parseWeekendConfigFromNotes(selectedPlanner?.notes),
    [selectedPlanner?.notes],
  );
  const calendarWeekendOptions = useMemo(() => {
    if (!selectedPlanner) return [];
    return getWeekendDaysInMonth(selectedPlanner.month, selectedPlanner.year).map(d => ymd(d));
  }, [selectedPlanner]);

  const activeMemberPlan = useMemo(() => {
    if (!selectedPlanner) return null;
    return selectedPlanner.member_plans.find(m => m.id === selectedMemberId) || selectedPlanner.member_plans[0] || null;
  }, [selectedPlanner, selectedMemberId]);

  useEffect(() => {
    if (selectedPlanner && selectedPlanner.member_plans.length > 0) {
      if (!selectedMemberId || !selectedPlanner.member_plans.some(m => m.id === selectedMemberId))
        setSelectedMemberId(selectedPlanner.member_plans[0].id);
    }
  }, [selectedPlanner, selectedMemberId]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.getActivityPlanners();
      setPlanners(list);
      if (list.length > 0 && !plannerId) setPlannerId(list[0].id);
    } finally { setLoading(false); }
  }, [plannerId]);

  useEffect(() => { load(); }, [load]);

  const handleTaskStatusChange = async (taskId: number, status: string) => {
    setPlanners(prev => prev.map(p => ({
      ...p,
      member_plans: p.member_plans.map(m => ({
        ...m,
        tasks: (m.tasks || []).map(t => t.id === taskId ? { ...t, status: status as any } : t),
      })),
    })));
    try { await api.updatePlannerTask(taskId, { status: status as any }); await load(); }
    catch { load(); }
  };

  const handleWeekendWorkingToggle = async (date: string) => {
    if (!selectedPlanner) return;
    const current = parseWeekendConfigFromNotes(selectedPlanner.notes).working_weekend_dates;
    const next     = current.includes(date) ? current.filter(d => d !== date) : [...current, date];
    const nextNotes = JSON.stringify({ working_weekend_dates: next });
    setPlanners(prev => prev.map(p => p.id === selectedPlanner.id ? { ...p, notes: nextNotes } : p));
    try { await api.updateActivityPlanner(selectedPlanner.id, { notes: nextNotes }); await load(); }
    catch { await load(); }
  };

  const memberWeeks = useMemo(() => {
    if (!selectedPlanner || !activeMemberPlan) return [];
    const auto = buildAutoPlanFromTargets(activeMemberPlan, selectedPlanner.month, selectedPlanner.year, selectedPlannerWeekendConfig.working_weekend_dates);
    return forceLeaveDaysToZero(auto, selectedPlannerWeekendConfig.working_weekend_dates);
  }, [selectedPlanner, activeMemberPlan, selectedPlannerWeekendConfig.working_weekend_dates]);

  useEffect(() => {
    if (memberWeeks.length > 0)
      setSelectedWeek(prev => (prev && memberWeeks.some(w => w.week === prev)) ? prev : memberWeeks[0].week);
    else setSelectedWeek(null);
  }, [memberWeeks]);

  const activeWeek = useMemo(
    () => memberWeeks.find(w => w.week === selectedWeek) || null,
    [memberWeeks, selectedWeek],
  );

  const stats = useMemo(() => {
    if (!activeMemberPlan) return null;
    const tasks = activeMemberPlan.tasks || [];
    const done  = tasks.filter(t => t.status === 'done').length;
    return { total: tasks.length, done, pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
  }, [activeMemberPlan]);

  const workdayCount = useMemo(() => {
    const allDays = getDaysInMonth(month, year);
    const workingWeekendSet = new Set(workingWeekendDates);
    return allDays.filter(d => {
      const dow = d.getDay();
      const isWeekend = dow === 0 || dow === 6;
      return !isWeekend || workingWeekendSet.has(ymd(d));
    }).length;
  }, [month, year, workingWeekendDates]);

  const totalWeeks = useMemo(() => {
    const allDays = getDaysInMonth(month, year);
    return Math.ceil(allDays[allDays.length - 1].getDate() / 7);
  }, [month, year]);

  const memberTotals = (m: any) =>
    (m.monthly_calls_target || 0) + (m.monthly_whatsapp_target || 0) +
    (m.monthly_email_target || 0) + (m.monthly_linkedin_target || 0);

  const dailyAvg = (m: any) =>
    workdayCount > 0 ? (memberTotals(m) / workdayCount).toFixed(1) : '0';

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col bg-[#f0f2f8] overflow-hidden font-sans">

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatBlob {
          0%,100% { transform: translateY(0px) translateX(0px); }
          50%     { transform: translateY(-10px) translateX(6px); }
        }
        .anim-blob   { animation: floatBlob 7s ease-in-out infinite; }
        .anim-fade-1 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.05s; }
        .anim-fade-2 { opacity:0; animation: fadeUp .5s ease-out forwards; animation-delay:.15s; }
      `}</style>

      {/* ══════════════════════════════════════════════════
          BANNER — WorkflowMonitor style
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
            <Target className="text-white" size={20} />
          </div>

          {/* text */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-black text-white leading-tight tracking-tight">
              Activity Architect
            </h1>
            <p className="text-[12px] text-indigo-200 mt-0.5 font-medium">
              {selectedPlanner?.name || 'Plan, distribute & track monthly outreach across your team.'}
            </p>
          </div>

          {/* Step pills */}
          <div className="hidden sm:flex items-center gap-1 shrink-0"
            style={{
              backgroundColor: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '14px',
              padding: '6px 10px',
            }}
          >
            {[
              { s: 1, label: 'Setup',    icon: <Settings size={11} /> },
              { s: 2, label: 'Team',     icon: <Users size={11} /> },
              { s: 3, label: 'Calendar', icon: <Calendar size={11} /> },
            ].map(({ s, label, icon }, idx) => {
              const done   = step > s;
              const active = step === s;
              return (
                <React.Fragment key={s}>
                  {idx > 0 && <div className="w-3 h-px bg-white/20 mx-0.5" />}
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                    done   ? 'bg-white/20 text-white' :
                    active ? 'bg-white text-indigo-700 shadow-sm' :
                             'text-white/40'
                  }`}>
                    {done ? <CheckCircle2 size={11} /> : icon}
                    <span>{label}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Refresh */}
          <button
            onClick={load}
            className={`p-2.5 rounded-xl text-white/70 hover:text-white transition-colors shrink-0 ${loading ? 'animate-spin' : ''}`}
            style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}
          >
            <RefreshCcw size={14} />
          </button>
        </div>
      </div>

      {/* decorative blobs */}
      <div className="pointer-events-none fixed -top-10 -left-16 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl anim-blob -z-10" />
      <div className="pointer-events-none fixed top-40 -right-20 w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl anim-blob -z-10" />

      <main className="flex-1 flex min-h-0 mt-4 anim-fade-2">

        {/* ════════════════════════════════════════════════════
            STEP 3 — CALENDAR
        ════════════════════════════════════════════════════ */}
        {step === 3 && selectedPlanner ? (
          <>
            {/* ── Sidebar ── */}
            <aside className="w-[220px] bg-white border-r border-slate-200/80 flex flex-col shrink-0 rounded-tl-2xl overflow-hidden shadow-sm">

              {/* top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500 shrink-0" />

              {/* Member list */}
              <div className="px-3 pt-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-indigo-500 rounded-full shrink-0" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.12em]">Team members</p>
                </div>
                <div className="space-y-0.5">
                  {selectedPlanner.member_plans.map(m => {
                    const isActive = selectedMemberId === m.id;
                    const memberStats = (() => {
                      const tasks = m.tasks || [];
                      const done  = tasks.filter((t: any) => t.status === 'done').length;
                      return tasks.length ? Math.round((done / tasks.length) * 100) : 0;
                    })();
                    return (
                      <button
                        key={m.id}
                        onClick={() => { setSelectedMemberId(m.id); setPlannerView('month'); }}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`h-7 w-7 rounded-lg flex items-center justify-center font-black text-[11px] uppercase shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {m.member_name.charAt(0) || 'U'}
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className={`text-[11px] font-semibold truncate leading-tight ${isActive ? 'text-white' : 'text-slate-700'}`}>
                            {m.member_name}
                          </p>
                          <div className={`mt-1 h-0.5 rounded-full overflow-hidden ${isActive ? 'bg-white/30' : 'bg-slate-100'}`}>
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-white' : 'bg-indigo-400'}`}
                              style={{ width: `${memberStats}%` }}
                            />
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold shrink-0 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                          {memberStats}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Completion card */}
              <div className="px-3 py-3 border-b border-slate-100">
                <div className="rounded-2xl p-3.5 text-white overflow-hidden relative"
                  style={{ background: 'linear-gradient(125deg, #1e1b4b 0%, #312e81 100%)' }}>
                  <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black text-indigo-300 uppercase tracking-wide">Completion</span>
                    <span className="text-xl font-black">{stats?.pct ?? 0}<span className="text-sm font-normal text-indigo-300">%</span></span>
                  </div>
                  <div className="h-1.5 bg-indigo-900 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full transition-all duration-700"
                      style={{ width: `${stats?.pct ?? 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-indigo-300">{stats?.done ?? 0} done</span>
                    <span className="text-[10px] text-indigo-400">{stats?.total ?? 0} total</span>
                  </div>
                </div>
              </div>

              {/* Weekly distribution */}
              <div className="flex-1 overflow-y-auto px-3 py-3 custom-scrollbar">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="w-1 h-3 bg-violet-500 rounded-full shrink-0" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.12em]">Weekly</p>
                </div>
                <div className="space-y-1">
                  {memberWeeks.map(w => (
                    <button
                      key={w.week}
                      onClick={() => { setSelectedWeek(w.week); setPlannerView('week'); }}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                        selectedWeek === w.week && plannerView === 'week'
                          ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                          : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 uppercase tracking-wide">
                          Wk {w.week}
                        </span>
                        <span className="text-[11px] font-black text-slate-700">{w.total}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => {
                          const maxVal = Math.max(...memberWeeks.map(wk => wk.totals[ch]), 1);
                          const pct = Math.round((w.totals[ch] / maxVal) * 100);
                          return (
                            <div key={ch} className="flex-1">
                              <div className={`h-1 rounded-full ${CHANNEL_CONFIG[ch].bg} overflow-hidden`}>
                                <div
                                  className={`h-full rounded-full bg-gradient-to-r ${CHANNEL_CONFIG[ch].gradient}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1.5">{w.startDate.slice(5)} – {w.endDate.slice(5)}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 border-t border-slate-100">
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-2 flex items-center justify-center gap-1.5 text-[11px] font-black text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  <Plus size={12} /> New Plan
                </button>
              </div>
            </aside>

            {/* ── Main calendar area ── */}
            <section className="flex-1 flex flex-col bg-[#f0f2f8] overflow-hidden">

              {/* Calendar toolbar */}
              <div className="mx-4 mb-0 mt-0">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                  <div className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {plannerView === 'week' && (
                        <button
                          onClick={() => setPlannerView('month')}
                          className="h-8 w-8 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors"
                        >
                          <ChevronLeft size={14} />
                        </button>
                      )}
                      <div>
                        <h2 className="text-sm font-black text-slate-800 leading-tight">
                          {plannerView === 'month'
                            ? `${MONTHS.find(m => m.value === selectedPlanner.month)?.label} ${selectedPlanner.year}`
                            : `Week ${activeWeek?.week} · ${activeWeek?.startDate} → ${activeWeek?.endDate}`}
                        </h2>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {plannerView === 'month' ? 'Click any week card to drill into daily view' : 'Day-by-day activity breakdown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
                        <div key={ch} className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-semibold ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].border} ${CHANNEL_CONFIG[ch].text}`}>
                          {CHANNEL_CONFIG[ch].icon}
                          <span>{CHANNEL_CONFIG[ch].label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekend policy strip */}
              <div className="mx-4 mt-2">
                <div className="bg-white/70 border border-slate-200/60 rounded-xl px-4 py-2 flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Weekend policy</span>
                  </div>
                  <span className="text-[10px] text-slate-200">|</span>
                  <span className="text-[10px] text-slate-400">Sat/Sun default to Leave — toggle to mark as working</span>
                  <div className="flex flex-wrap gap-1 ml-auto">
                    {calendarWeekendOptions.map(date => {
                      const active = selectedPlannerWeekendConfig.working_weekend_dates.includes(date);
                      const day    = new Date(`${date}T00:00:00`);
                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => handleWeekendWorkingToggle(date)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black border transition-all ${
                            active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                              : 'bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {date.slice(8)} {day.getDay() === 6 ? 'Sat' : 'Sun'} · {active ? '✓ Working' : 'Leave'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── Month view ── */}
              {plannerView === 'month' ? (
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  {/* Month totals */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => {
                      const monthTotal = memberWeeks.reduce((s, w) => s + w.totals[ch], 0);
                      return (
                        <div key={ch} className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden`}>
                          <div className={`h-1 w-full bg-gradient-to-r ${CHANNEL_CONFIG[ch].gradient}`} />
                          <div className="p-3.5 flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${CHANNEL_CONFIG[ch].gradient} shadow-sm shrink-0`}>
                              <span className="text-white">{CHANNEL_CONFIG[ch].icon}</span>
                            </div>
                            <div>
                              <p className={`text-lg font-black leading-none ${CHANNEL_CONFIG[ch].text}`}>{monthTotal}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{CHANNEL_CONFIG[ch].label}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Week cards grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                    {memberWeeks.map(w => (
                      <button
                        key={w.week}
                        onClick={() => { setSelectedWeek(w.week); setPlannerView('week'); }}
                        className="text-left rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100/60 transition-all group bg-white overflow-hidden"
                      >
                        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-lg inline-block mb-1">
                                Week {w.week}
                              </span>
                              <p className="text-[10px] text-slate-400">{w.startDate.slice(5)} – {w.endDate.slice(5)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-black text-slate-800 leading-none">{w.total}</p>
                              <p className="text-[10px] text-slate-400">activities</p>
                            </div>
                          </div>

                          {/* Stacked bar */}
                          <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden mb-3">
                            {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
                              <div
                                key={ch}
                                className={`bg-gradient-to-r ${CHANNEL_CONFIG[ch].gradient} transition-all`}
                                style={{ flex: w.totals[ch] || 0.5 }}
                              />
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
                              <div key={ch} className={`px-2 py-1.5 rounded-xl border ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].border} flex items-center justify-between`}>
                                <div className={`flex items-center gap-1 ${CHANNEL_CONFIG[ch].text}`}>
                                  {CHANNEL_CONFIG[ch].icon}
                                  <span className="text-[9px] font-semibold">{CHANNEL_CONFIG[ch].label}</span>
                                </div>
                                <span className={`text-sm font-black ${CHANNEL_CONFIG[ch].text}`}>{w.totals[ch]}</span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-2.5 flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-indigo-500 transition-colors">
                            <span>View daily breakdown</span>
                            <ArrowRight size={10} />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              ) : (
                /* ── Week view ── */
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  {/* Week summary */}
                  {activeWeek && (
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
                        <div key={ch} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                          <div className={`h-1 w-full bg-gradient-to-r ${CHANNEL_CONFIG[ch].gradient}`} />
                          <div className={`px-3 py-2.5 flex items-center gap-2.5`}>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${CHANNEL_CONFIG[ch].gradient} shrink-0`}>
                              <span className="text-white">{CHANNEL_CONFIG[ch].icon}</span>
                            </div>
                            <div>
                              <p className={`text-base font-black leading-none ${CHANNEL_CONFIG[ch].text}`}>{activeWeek.totals[ch]}</p>
                              <p className="text-[10px] text-slate-400">{CHANNEL_CONFIG[ch].label}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Calendar grid */}
                  <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-white">
                    <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                    {/* Day-of-week headers */}
                    <div className="grid grid-cols-7"
                      style={{ background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 40%, #7c3aed 100%)' }}>
                      {DAYS_OF_WEEK.map((day, di) => (
                        <div
                          key={day}
                          className={`py-3 text-center text-[11px] font-black text-white uppercase tracking-widest ${di < 6 ? 'border-r border-white/10' : ''}`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {activeWeek && (() => {
                      const firstDate = new Date(`${activeWeek.startDate}T00:00:00`);
                      const blanks    = Array(firstDate.getDay()).fill(null);
                      const cells     = [...blanks, ...activeWeek.days];

                      return (
                        <div className="grid grid-cols-7" style={{ gridAutoRows: '160px' }}>
                          {cells.map((day, i) => {
                            if (!day) return (
                              <div
                                key={`blank-${i}`}
                                className={`bg-slate-50/60 ${i % 7 < 6 ? 'border-r' : ''} border-b border-slate-100`}
                              />
                            );

                            const dateTasks        = (activeMemberPlan?.tasks || []).filter((t: any) => t.task_date === day.date);
                            const dayDate          = new Date(`${day.date}T00:00:00`);
                            const dow              = dayDate.getDay();
                            const isWeekend        = dow === 0 || dow === 6;
                            const isWorkingWeekend = selectedPlannerWeekendConfig.working_weekend_dates.includes(day.date);
                            const isLeaveDay       = isWeekend && !isWorkingWeekend;
                            const isToday          = ymd(new Date()) === day.date;
                            const colIdx           = i % 7;
                            const isLastCol        = colIdx === 6;
                            const visibleTasks     = dateTasks.slice(0, 1);
                            const overflowCount    = dateTasks.length - visibleTasks.length;

                            return (
                              <div
                                key={day.date}
                                className={`flex flex-col ${!isLastCol ? 'border-r' : ''} border-b border-slate-100 transition-colors ${
                                  isLeaveDay
                                    ? 'bg-slate-50/60'
                                    : isToday
                                    ? 'bg-indigo-50/50'
                                    : 'bg-white hover:bg-slate-50/40'
                                }`}
                              >
                                {/* Date header */}
                                <div className={`flex items-center justify-between px-2.5 pt-2 pb-1.5 border-b ${
                                  isToday ? 'border-indigo-100 bg-indigo-50' : 'border-slate-100'
                                }`}>
                                  <span className={`text-sm font-black w-7 h-7 flex items-center justify-center rounded-full ${
                                    isToday
                                      ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm'
                                      : isLeaveDay
                                      ? 'text-slate-300'
                                      : 'text-slate-700'
                                  }`}>
                                    {dayDate.getDate()}
                                  </span>
                                  {isLeaveDay ? (
                                    <span className="text-[9px] font-black text-rose-400 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-lg">Leave</span>
                                  ) : (
                                    <span className={`text-[11px] font-black ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{day.total}</span>
                                  )}
                                </div>

                                {/* Body */}
                                <div className="flex-1 px-2 pt-1.5 pb-2 flex flex-col gap-1 overflow-hidden">
                                  {!isLeaveDay && (
                                    <div className="grid grid-cols-2 gap-1">
                                      {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
                                        <div
                                          key={ch}
                                          className={`px-1.5 py-1 rounded-lg text-[9px] font-semibold flex items-center justify-between ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].text} border ${CHANNEL_CONFIG[ch].border}`}
                                        >
                                          <div className="flex items-center gap-0.5 truncate">
                                            {CHANNEL_CONFIG[ch].icon}
                                            <span className="truncate">{CHANNEL_CONFIG[ch].label}</span>
                                          </div>
                                          <span className="font-black ml-1 shrink-0">{day.byChannel[ch]}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {!isLeaveDay && dateTasks.length > 0 && (
                                    <div className="flex flex-col gap-0.5 mt-0.5">
                                      {visibleTasks.map((t: any) => (
                                        <button
                                          key={t.id}
                                          onClick={() => handleTaskStatusChange(
                                            t.id,
                                            t.status === 'pending' ? 'in_progress' : t.status === 'in_progress' ? 'done' : 'pending',
                                          )}
                                          className={`w-full text-left text-[9px] px-1.5 py-1 rounded-lg border transition-colors ${
                                            t.status === 'done'
                                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 line-through'
                                              : t.status === 'in_progress'
                                              ? 'bg-amber-50 border-amber-200 text-amber-700'
                                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                          }`}
                                        >
                                          <span className="truncate block">{t.title}</span>
                                        </button>
                                      ))}
                                      {overflowCount > 0 && (
                                        <button
                                          onClick={() => setOverflowModal({ date: day.date, tasks: dateTasks })}
                                          className="w-full text-left text-[9px] px-1.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 font-black hover:bg-indigo-100 transition-colors"
                                        >
                                          +{overflowCount} more →
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Task overflow modal */}
                  {overflowModal && (
                    <div
                      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                      onClick={() => setOverflowModal(null)}
                    >
                      <div
                        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-sm overflow-hidden"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                        <div className="px-5 py-4 flex items-center justify-between"
                          style={{ background: 'linear-gradient(125deg, #3730a3 0%, #4f46e5 60%, #7c3aed 100%)' }}>
                          <div>
                            <p className="text-xs font-black text-white uppercase tracking-wide">Tasks</p>
                            <p className="text-[10px] text-indigo-200 mt-0.5">{overflowModal.date}</p>
                          </div>
                          <button
                            onClick={() => setOverflowModal(null)}
                            className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors text-sm font-black text-white"
                            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
                          {overflowModal.tasks.map((t: any) => (
                            <button
                              key={t.id}
                              onClick={() => {
                                handleTaskStatusChange(
                                  t.id,
                                  t.status === 'pending' ? 'in_progress' : t.status === 'in_progress' ? 'done' : 'pending',
                                );
                                setOverflowModal(prev => prev ? {
                                  ...prev,
                                  tasks: prev.tasks.map(task =>
                                    task.id === t.id ? {
                                      ...task,
                                      status: task.status === 'pending' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'pending'
                                    } : task
                                  )
                                } : null);
                              }}
                              className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                                t.status === 'done'
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 line-through'
                                  : t.status === 'in_progress'
                                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span>{t.title}</span>
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg shrink-0 ${
                                  t.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                                  t.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                                  'bg-slate-100 text-slate-500'
                                }`}>
                                  {t.status === 'in_progress' ? 'In Progress' : t.status === 'done' ? 'Done' : 'Pending'}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="px-4 pb-4">
                          <p className="text-[10px] text-slate-400 text-center">Click any task to cycle its status</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </>

        ) : (
          /* ════════════════════════════════════════════════════
              STEPS 1 & 2
          ════════════════════════════════════════════════════ */
          <div className="flex-1 overflow-y-auto custom-scrollbar">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="min-h-full p-4 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 items-start max-w-6xl mx-auto w-full">

                {/* Left — form */}
                <div className="space-y-4">
                  {/* Plan details */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-5 bg-indigo-500 rounded-full shrink-0" />
                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shrink-0">
                          <Zap size={14} className="text-white" />
                        </div>
                        <h3 className="text-[13px] font-black text-slate-700">Plan Details</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Plan name</label>
                          <input
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all"
                            value={planName}
                            onChange={e => setPlanName(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Month</label>
                            <select
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                              value={month}
                              onChange={e => setMonth(Number(e.target.value))}
                            >
                              {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Year</label>
                            <input
                              type="number"
                              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                              value={year}
                              onChange={e => setYear(Number(e.target.value))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weekend working days */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-5 bg-emerald-500 rounded-full shrink-0" />
                          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm shrink-0">
                            <Calendar size={14} className="text-white" />
                          </div>
                          <h3 className="text-[13px] font-black text-slate-700">Weekend Working Days</h3>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${
                          workingWeekendDates.length > 0
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}>
                          {workingWeekendDates.length} selected
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-3 font-medium">
                        Weekdays are always included. Toggle any weekend day to mark it as working.
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {weekendOptions.map(date => {
                          const active = workingWeekendDates.includes(date);
                          const day    = new Date(`${date}T00:00:00`);
                          return (
                            <button
                              type="button"
                              key={date}
                              onClick={() => setWorkingWeekendDates(prev =>
                                prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date],
                              )}
                              className={`py-2.5 px-1 rounded-xl text-[11px] font-black border transition-all text-center active:scale-95 ${
                                active
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
                                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-white'
                              }`}
                            >
                              <span className="block font-black text-sm">{date.slice(8)}</span>
                              <span className="block text-[9px] mt-0.5 opacity-70">{day.getDay() === 6 ? 'Sat' : 'Sun'}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const res = await api.createActivityPlanner({
                          name: planName, month, year, status: 'active',
                          notes: JSON.stringify({ working_weekend_dates: workingWeekendDates }),
                        });
                        setPlannerId(res.id);
                        await load();
                        setStep(2);
                      } finally { setSaving(false); }
                    }}
                    className="w-full py-4 text-white rounded-2xl font-black text-sm active:scale-[0.99] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(125deg, #4f46e5 0%, #7c3aed 100%)' }}
                  >
                    {saving ? 'Creating plan…' : (
                      <>Initialize team setup <ArrowRight size={15} /></>
                    )}
                  </button>
                </div>

                {/* Right — context panel */}
                <div className="space-y-4">
                  {/* Live stats */}
                  <div className="rounded-2xl p-5 text-white overflow-hidden relative"
                    style={{ background: 'linear-gradient(125deg, #1e1b4b 0%, #312e81 60%, #3730a3 100%)' }}>
                    <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-4 bg-indigo-400 rounded-full" />
                      <p className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.12em]">
                        {MONTHS.find(m => m.value === month)?.label} {year} snapshot
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: 'Total days',       value: getDaysInMonth(month, year).length, icon: <Calendar size={12} /> },
                        { label: 'Working days',     value: workdayCount,                       icon: <Zap size={12} /> },
                        { label: 'Working weekends', value: workingWeekendDates.length,          icon: <CheckCircle2 size={12} /> },
                        { label: 'Weeks',            value: totalWeeks,                          icon: <Layers size={12} /> },
                      ].map(s => (
                        <div key={s.label} className="bg-white/8 border border-white/10 rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                          <div className="flex items-center gap-1.5 mb-1.5 text-indigo-300">{s.icon}<span className="text-[10px]">{s.label}</span></div>
                          <p className="text-2xl font-black text-white">{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Existing plans */}
                  {planners.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                      <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500" />
                      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-4 bg-violet-500 rounded-full shrink-0" />
                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shrink-0">
                            <Layers size={11} className="text-white" />
                          </div>
                          <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Recent Plans</h3>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg border bg-violet-50 text-violet-600 border-violet-100">
                          {Math.min(planners.length, 5)} of {planners.length}
                        </span>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {[...planners].slice(0, 5).map((p, idx) => {
                          const isActive = plannerId === p.id;
                          const totalActs = (p.member_plans || []).reduce((s: number, m: any) =>
                            s + (m.monthly_calls_target || 0) + (m.monthly_whatsapp_target || 0) +
                            (m.monthly_email_target || 0) + (m.monthly_linkedin_target || 0), 0);
                          return (
                            <button
                              key={p.id}
                              onClick={() => { setPlannerId(p.id); setStep(3); }}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-indigo-50/60 group ${
                                isActive ? 'bg-indigo-50' : ''
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${
                                isActive ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {idx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-bold truncate ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>{p.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-slate-400">
                                    {MONTHS.find(m => m.value === p.month)?.label} {p.year}
                                  </span>
                                  <span className="text-slate-200">·</span>
                                  <span className="text-[10px] text-slate-400">{p.member_plans?.length ?? 0} members</span>
                                  {totalActs > 0 && (
                                    <>
                                      <span className="text-slate-200">·</span>
                                      <span className="text-[10px] text-indigo-500 font-black">{totalActs} acts</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className={`flex items-center gap-1 text-[10px] font-black transition-colors shrink-0 ${
                                isActive ? 'text-indigo-600' : 'text-slate-300 group-hover:text-indigo-400'
                              }`}>
                                <span>{isActive ? 'Active' : 'Open'}</span>
                                <ArrowRight size={10} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="min-h-full p-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 items-start max-w-6xl mx-auto w-full">

                {/* Left — member sidebar */}
                <div className="space-y-4">
                  {/* Agent list */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-4 bg-indigo-500 rounded-full shrink-0" />
                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shrink-0">
                            <Users size={11} className="text-white" />
                          </div>
                          <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Agents ({members.length})</h3>
                        </div>
                        <button
                          onClick={() => setMembers([...members, { ...members[0], member_name: '' }])}
                          className="text-[11px] font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
                        >
                          <Plus size={11} /> Add
                        </button>
                      </div>
                      <div className="space-y-1">
                        {members.map((m, i) => (
                          <div key={i} className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-all">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-600 text-white flex items-center justify-center text-[11px] font-black uppercase shrink-0 shadow-sm">
                              {m.member_name?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-semibold text-slate-700 truncate">{m.member_name || 'Unnamed agent'}</p>
                              <p className="text-[9px] text-slate-400">{memberTotals(m)} act · {dailyAvg(m)}/day</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Plan summary */}
                  <div className="rounded-2xl p-4 text-white overflow-hidden relative"
                    style={{ background: 'linear-gradient(125deg, #1e1b4b 0%, #312e81 60%, #3730a3 100%)' }}>
                    <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-3 bg-indigo-400 rounded-full" />
                      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-indigo-300">Plan summary</p>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Period',       value: `${MONTHS.find(m => m.value === month)?.label} ${year}` },
                        { label: 'Working days', value: workdayCount },
                        { label: 'Agents',       value: members.length },
                      ].map(row => (
                        <div key={row.label} className="flex justify-between items-center">
                          <span className="text-[11px] text-indigo-300">{row.label}</span>
                          <span className="text-[11px] font-black text-white">{row.value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center border-t border-indigo-800 pt-2.5">
                        <span className="text-[11px] text-indigo-300">Total activities</span>
                        <span className="text-lg font-black text-violet-300">
                          {members.reduce((sum, m) => sum + memberTotals(m), 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Channel breakdown */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-4 bg-emerald-500 rounded-full shrink-0" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.12em]">Team channel totals</p>
                      </div>
                      <div className="space-y-2">
                        {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => {
                          const total = members.reduce((s, m) => s + (m[`monthly_${ch}_target`] || 0), 0);
                          const max   = members.reduce((s, m) => s + memberTotals(m), 0) || 1;
                          return (
                            <div key={ch}>
                              <div className="flex items-center justify-between mb-0.5">
                                <div className={`flex items-center gap-1 text-[10px] font-semibold ${CHANNEL_CONFIG[ch].text}`}>
                                  {CHANNEL_CONFIG[ch].icon} {CHANNEL_CONFIG[ch].label}
                                </div>
                                <span className="text-[10px] font-black text-slate-600">{total}</span>
                              </div>
                              <div className={`h-1.5 rounded-full ${CHANNEL_CONFIG[ch].bg} overflow-hidden`}>
                                <div
                                  className={`h-full rounded-full bg-gradient-to-r ${CHANNEL_CONFIG[ch].gradient} transition-all duration-500`}
                                  style={{ width: `${Math.round((total / max) * 100)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right — agent cards */}
                <div>
                  <div className="mb-4">
                    <h2 className="text-lg font-black text-slate-800 leading-tight">Configure Agents</h2>
                    <p className="text-sm text-slate-400 mt-0.5 font-medium">Set monthly channel targets for each team member.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {members.map((m, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all relative group overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                        <div className="p-5">
                          {/* Agent name */}
                          <div className="flex items-center gap-3 mb-4 pb-3.5 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 text-white flex items-center justify-center font-black text-sm uppercase shrink-0 shadow-sm">
                              {m.member_name?.charAt(0) || '?'}
                            </div>
                            <input
                              placeholder="Agent name…"
                              className="flex-1 text-sm font-bold text-slate-800 border-none focus:ring-0 p-0 bg-transparent placeholder:text-slate-300 outline-none"
                              value={m.member_name}
                              onChange={e => {
                                const nm = [...members];
                                nm[i].member_name    = e.target.value;
                                nm[i].workspace_name = `${e.target.value}'s Workspace`;
                                setMembers(nm);
                              }}
                            />
                            {members.length > 1 && (
                              <button
                                onClick={() => setMembers(members.filter((_, idx) => idx !== i))}
                                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all p-1 rounded-lg hover:bg-red-50"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>

                          {/* Channel targets */}
                          <div className="grid grid-cols-2 gap-2">
                            {(['calls', 'whatsapp', 'email', 'linkedin'] as Channel[]).map(ch => (
                              <div key={ch} className={`p-3 rounded-xl border ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].border}`}>
                                <label className={`text-[9px] font-black uppercase tracking-wide flex items-center gap-1 mb-1.5 ${CHANNEL_CONFIG[ch].text}`}>
                                  {CHANNEL_CONFIG[ch].icon} {ch}
                                </label>
                                <NumericInput
                                  className={`bg-transparent font-black text-slate-800 w-full outline-none text-xl leading-none`}
                                  value={m[`monthly_${ch}_target`]}
                                  onChange={v => {
                                    const nm = [...members];
                                    nm[i][`monthly_${ch}_target`] = v;
                                    setMembers(nm);
                                  }}
                                />
                                <p className={`text-[9px] mt-0.5 ${CHANNEL_CONFIG[ch].text} opacity-70`}>
                                  ~{workdayCount > 0 ? (m[`monthly_${ch}_target`] / workdayCount).toFixed(1) : 0}/day
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Card footer */}
                          <div className="mt-3 flex justify-between items-center px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <Activity size={11} className="text-slate-400" />
                              <span className="text-[11px] text-slate-400 font-semibold">Total activities</span>
                            </div>
                            <span className="text-sm font-black text-indigo-600">{memberTotals(m)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3.5 bg-white border border-slate-200/80 rounded-2xl font-black text-sm text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <ChevronLeft size={15} /> Back
                    </button>
                    <button
                      onClick={async () => {
                        if (!plannerId) return;
                        setSaving(true);
                        try {
                          await api.assignPlannerMembers(plannerId, members);
                          await load();
                          setStep(3);
                          setPlannerView('month');
                        } finally { setSaving(false); }
                      }}
                      className="flex-1 py-3.5 text-white rounded-2xl font-black text-sm active:scale-[0.99] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(125deg, #4f46e5 0%, #7c3aed 100%)' }}
                    >
                      {saving ? 'Generating calendar…' : (
                        <>Deploy & view calendar <ArrowRight size={15} /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}

export default ActivityPlannerPage;