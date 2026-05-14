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


import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  CheckCircle2, Plus, RefreshCcw, Users,
  Target, Phone, MessageSquare, Mail,
  Linkedin, Sparkles, Trash2, Settings,
  Calendar, Layers, ChevronLeft, CalendarDays, BarChart3
} from 'lucide-react';
import { api } from '../Utils/api';
import type { ActivityPlanner } from '../Utils/types';

/* ─── Types ─── */
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

/* ─── Constants ─── */
const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i, 1).toLocaleString('en', { month: 'long' }),
}));

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CHANNEL_META: Record<Channel, {
  icon: React.ReactNode;
  label: string;
  gradient: string;
  bg: string;
  text: string;
  border: string;
  lightBg: string;
  darkText: string;
  shadow: string;
}> = {
  calls: { icon: <Phone size={11} />, color: 'text-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Calls' },
  whatsapp: { icon: <MessageSquare size={11} />, color: 'text-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'WhatsApp' },
  email: { icon: <Mail size={11} />, color: 'text-amber-600', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Email' },
  linkedin: { icon: <Linkedin size={11} />, color: 'text-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'LinkedIn' },
};

const StepPill = ({
  current,
  step,
  label,
  icon,
  onClick,
  disabled = false,
}: {
  current: number;
  step: number;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const done = current > step;
  const active = current === step;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
        done
          ? 'bg-emerald-100 text-emerald-700'
          : active
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-transparent text-slate-500 hover:bg-slate-100'
      } ${disabled ? 'opacity-45 cursor-not-allowed hover:bg-transparent' : ''}`}
    >
      {done ? <CheckCircle2 size={12} /> : icon}
      {label}
    </button>
  );
};

const NumericInput = ({ value, onChange, min = 0, max, className = '' }: { value: number; onChange: (v: number) => void; min?: number; max?: number; className?: string; }) => {
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

/* ─── Helpers ─── */
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
  getDaysInMonth(month, year).filter(d => d.getDay() === 0 || d.getDay() === 6);

const spreadAcrossDays = (total: number, dayCount: number) => {
  if (dayCount <= 0) return [];
  const safeTotal = Math.max(0, total || 0);
  const base = Math.floor(safeTotal / dayCount);
  const rem = safeTotal % dayCount;
  return Array.from({ length: dayCount }, (_, i) => base + (i < rem ? 1 : 0));
};

const spreadAcrossWeeksThenDays = (total: number, monthDays: Date[], workingWeekendDates: string[]): number[] => {
  const workingWeekendSet = new Set(workingWeekendDates);
  const weekWorkingDayIndexes = new Map<number, number[]>();
  monthDays.forEach((d, i) => {
    const dow = d.getDay();
    const isWeekend = dow === 0 || dow === 6;
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
    const perDay = spreadAcrossDays(weeklySplit[idx] || 0, dayIndexes.length);
    dayIndexes.forEach((monthIdx, dayIdx) => { byDay[monthIdx] = perDay[dayIdx] || 0; });
  });
  return byDay;
};

const parseWeekendConfigFromNotes = (notes: string | null | undefined): PlannerWeekendConfig => {
  if (!notes) return { working_weekend_dates: [] };
  try {
    const parsed = JSON.parse(notes);
    const list = Array.isArray(parsed?.working_weekend_dates) ? parsed.working_weekend_dates : [];
    return { working_weekend_dates: list.filter((d: unknown) => typeof d === 'string') };
  } catch { return { working_weekend_dates: [] }; }
};

const buildAutoPlanFromTargets = (member: any, month: number, year: number, workingWeekendDates: string[]): PlannedWeek[] => {
  const monthDays = getDaysInMonth(month, year);
  const dailyByChannel: Record<Channel, number[]> = {
    calls: spreadAcrossWeeksThenDays(member.monthly_calls_target, monthDays, workingWeekendDates),
    whatsapp: spreadAcrossWeeksThenDays(member.monthly_whatsapp_target, monthDays, workingWeekendDates),
    email: spreadAcrossWeeksThenDays(member.monthly_email_target, monthDays, workingWeekendDates),
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
  const d = new Date(`${date}T00:00:00`);
  const day = d.getDay();
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

const memberTotals = (m: any) =>
  (m.monthly_calls_target || 0) + (m.monthly_whatsapp_target || 0) +
  (m.monthly_email_target || 0) + (m.monthly_linkedin_target || 0);

/* ─── Sub-components ─── */

const StepIndicator = ({ current }: { current: Step }) => {
  const steps = [
    { step: 1, label: 'Setup', icon: <Settings size={14} />, desc: 'Configure plan' },
    { step: 2, label: 'Team', icon: <Users size={14} />, desc: 'Add members' },
    { step: 3, label: 'Calendar', icon: <Calendar size={14} />, desc: 'View & manage' },
  ];
  return (
    <div className="ap-header-steps" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {steps.map((s, i) => {
        const done = current > s.step;
        const active = current === s.step;
        return (
          <React.Fragment key={s.step}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 12,
              background: done ? '#ecfdf5' : active ? '#4f46e5' : 'transparent',
              border: `1.5px solid ${done ? '#a7f3d0' : active ? '#4f46e5' : '#e2e8f0'}`,
              transition: 'all 0.2s ease',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#d1fae5' : active ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                color: done ? '#059669' : active ? '#fff' : '#94a3b8',
              }}>
                {done ? <CheckCircle2 size={13} /> : s.icon}
              </div>
              <div>
                <p style={{
                  fontSize: 12, fontWeight: 700, margin: 0,
                  color: done ? '#059669' : active ? '#fff' : '#64748b',
                  fontFamily: "'Inter', sans-serif",
                }}>{s.label}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 24, height: 2, borderRadius: 1,
                background: current > s.step + 1 || (current > s.step) ? '#a7f3d0' : '#e2e8f0',
              }} />
            )}
          </React.Fragment>
        );
      })}
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
      style={{
        background: 'transparent', border: 'none', outline: 'none',
        fontSize: 22, fontWeight: 800, color: '#1e293b', width: '100%',
        fontFamily: "'Inter', sans-serif", padding: 0,
      }}
      onChange={e => {
        const raw = e.target.value;
        if (raw === '' || /^\d*$/.test(raw)) setLocal(raw);
        const n = parseInt(raw, 10);
        if (!isNaN(n)) onChange(max !== undefined ? Math.min(max, Math.max(min, n)) : Math.max(min, n));
      }}
    />
  );
};

const ChannelLegend = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
    {CHANNELS.map(ch => (
      <div key={ch} style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 12px', borderRadius: 10,
        background: CHANNEL_META[ch].bg,
        border: `1px solid ${CHANNEL_META[ch].border}`,
        fontSize: 11, fontWeight: 600, color: CHANNEL_META[ch].text,
        fontFamily: "'Inter', sans-serif",
      }}>
        {CHANNEL_META[ch].icon}
        <span>{CHANNEL_META[ch].label}</span>
      </div>
    ))}
  </div>
);

/* ─── Main Component ─── */
export function ActivityPlannerPage() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [planners, setPlanners] = useState<ActivityPlanner[]>([]);
  const [plannerId, setPlannerId] = useState<number | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const [planName, setPlanName] = useState('Monthly Activity Planner');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [workingWeekendDates, setWorkingWeekendDates] = useState<string[]>([]);
  const [members, setMembers] = useState<any[]>([{
    member_name: '', workspace_name: '',
    monthly_calls_target: 100, monthly_whatsapp_target: 80,
    monthly_email_target: 60, monthly_linkedin_target: 40,
    calls_weightage: 25, whatsapp_weightage: 25,
    email_weightage: 25, linkedin_weightage: 25,
  }]);

  const [plannerView, setPlannerView] = useState<PlannerView>('month');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  useEffect(() => { injectStyles(); }, []);

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
    const next = current.includes(date) ? current.filter(d => d !== date) : [...current, date];
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
    const done = tasks.filter(t => t.status === 'done').length;
    return { total: tasks.length, done, pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
  }, [activeMemberPlan]);
  const monthLabel = useMemo(
    () => MONTHS.find(m => m.value === month)?.label || '',
    [month],
  );
  const canGoTeam = useMemo(
    () => Boolean(plannerId || selectedPlanner),
    [plannerId, selectedPlanner],
  );
  const canGoCalendar = useMemo(
    () => Boolean(selectedPlanner && selectedPlanner.member_plans.length > 0),
    [selectedPlanner],
  );

  const handleStepNav = (target: Step) => {
    if (target === 1) {
      setStep(1);
      return;
    }

    if (target === 2) {
      if (!canGoTeam) return;
      setStep(2);
      return;
    }

    if (!canGoCalendar || !selectedPlanner) return;
    setStep(3);
    setPlannerView('month');
    if (!selectedMemberId || !selectedPlanner.member_plans.some(m => m.id === selectedMemberId)) {
      setSelectedMemberId(selectedPlanner.member_plans[0]?.id ?? null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[radial-gradient(circle_at_15%_20%,#dbeafe_0%,#eef2ff_50%,#f8fafc_100%)] overflow-hidden font-sans">
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl"><Target className="text-white" size={20} /></div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.3px', ...ff }}>
              Activity Architect
            </h1>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0', fontWeight: 500, ...ff }}>
              {selectedPlanner?.name || 'Plan, distribute & track team activities'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StepPill current={step} step={1} label="Setup" icon={<Settings size={12} />} onClick={() => handleStepNav(1)} />
          <StepPill current={step} step={2} label="Team" icon={<Users size={12} />} onClick={() => handleStepNav(2)} disabled={!canGoTeam} />
          <StepPill current={step} step={3} label="Calendar" icon={<Calendar size={12} />} onClick={() => handleStepNav(3)} disabled={!canGoCalendar} />
          <button onClick={load} className={`p-2 rounded-lg hover:bg-slate-100 ${loading ? 'animate-spin' : ''}`}><RefreshCcw size={16} /></button>
        </div>
      </header>

      {/* ══════ MAIN ══════ */}
      <main style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* ═══════════ STEP 3 — CALENDAR ═══════════ */}
        {step === 3 && selectedPlanner ? (
          <div style={{ display: 'flex', flex: 1, minHeight: 0 }} className="ap-calendar-layout">

            {/* Sidebar */}
            <aside className="ap-sidebar ap-scroll" style={{
              width: 280, background: '#fff', borderRight: '1px solid #e2e8f0',
              display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
            }}>
              {/* Member selector */}
              <div style={{ padding: 16, borderBottom: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px', ...ff }}>
                  Team Members
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {selectedPlanner.member_plans.map(m => {
                    const isActive = selectedMemberId === m.id;
                    const mTasks = m.tasks || [];
                    const mDone = mTasks.filter((t: any) => t.status === 'done').length;
                    const mPct = mTasks.length ? Math.round((mDone / mTasks.length) * 100) : 0;
                    return (
                      <button
                        key={m.id}
                        onClick={() => { setSelectedMemberId(m.id); setPlannerView('month'); }}
                        className={`ap-sidebar-btn ${isActive ? 'active' : ''}`}
                      >
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: 13, flexShrink: 0,
                          background: isActive ? '#4f46e5' : '#f1f5f9',
                          color: isActive ? '#fff' : '#64748b',
                          ...ff,
                        }}>
                          {m.member_name.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: 13, fontWeight: 600, margin: 0,
                            color: isActive ? '#312e81' : '#334155',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            ...ff,
                          }}>
                            {m.member_name}
                          </p>
                          <div className="ap-progress-bar" style={{ marginTop: 6 }}>
                            <div className="ap-progress-fill" style={{
                              width: `${mPct}%`,
                              background: isActive ? '#4f46e5' : '#94a3b8',
                            }} />
                          </div>
                        </div>
                        <span style={{
                          fontSize: 11, fontWeight: 700, flexShrink: 0,
                          color: isActive ? '#4f46e5' : '#94a3b8', ...ff,
                        }}>
                          {mPct}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Completion card */}
              <div style={{ padding: 16, borderBottom: '1px solid #f1f5f9' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  borderRadius: 14, padding: 16, color: '#fff',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.8, ...ff }}>
                      Completion
                    </span>
                    <span style={{ fontSize: 24, fontWeight: 900, ...ff }}>{stats?.pct ?? 0}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 999, background: '#fff',
                      width: `${stats?.pct ?? 0}%`, transition: 'width 0.7s ease',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                    <span style={{ fontSize: 11, opacity: 0.7, ...ff }}>{stats?.done ?? 0} done</span>
                    <span style={{ fontSize: 11, opacity: 0.7, ...ff }}>{stats?.total ?? 0} total</span>
                  </div>
                </div>
              </div>

              {/* Week distribution */}
              <div style={{ flex: 1, overflow: 'auto', padding: 16 }} className="ap-scroll">
                <p style={{
                  fontSize: 10, fontWeight: 800, color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6, ...ff,
                }}>
                  <Layers size={12} style={{ color: '#818cf8' }} /> Weekly Distribution
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {memberWeeks.map(w => (
                    <button
                      key={w.week}
                      onClick={() => { setSelectedWeek(w.week); setPlannerView('week'); }}
                      className={`ap-week-card ${selectedWeek === w.week && plannerView === 'week' ? 'active' : ''}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6,
                          background: '#eef2ff', color: '#4338ca', textTransform: 'uppercase', ...ff,
                        }}>
                          Wk {w.week}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', ...ff }}>{w.total}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                        {CHANNELS.map(ch => (
                          <div key={ch} style={{
                            padding: '4px 0', borderRadius: 6, textAlign: 'center',
                            fontSize: 10, fontWeight: 700,
                            background: CHANNEL_META[ch].bg, color: CHANNEL_META[ch].text, ...ff,
                          }}>
                            {w.totals[ch]}
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: 10, color: '#94a3b8', margin: '6px 0 0', ...ff }}>
                        {w.startDate.slice(5)} – {w.endDate.slice(5)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* New plan button */}
              <div style={{ padding: 12, borderTop: '1px solid #f1f5f9' }}>
                <button onClick={() => setStep(1)} style={{
                  width: '100%', padding: '10px 0', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6, fontSize: 12, fontWeight: 600,
                  color: '#64748b', background: 'transparent', border: '1.5px solid #e2e8f0',
                  borderRadius: 10, cursor: 'pointer', ...ff,
                }}>
                  <Plus size={14} /> New Plan
                </button>
              </div>
            </aside>

            {/* Calendar main area */}
            <section style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff' }}>
              {/* Toolbar */}
              <div style={{
                padding: '14px 24px', borderBottom: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 16, flexShrink: 0, flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {plannerView === 'week' && (
                    <button onClick={() => setPlannerView('month')} style={{
                      width: 36, height: 36, borderRadius: 10,
                      border: '1.5px solid #e2e8f0', background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#64748b',
                    }}>
                      <ChevronLeft size={16} />
                    </button>
                  )}
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0, ...ff }}>
                      {plannerView === 'month'
                        ? `${MONTHS.find(m => m.value === selectedPlanner.month)?.label} ${selectedPlanner.year}`
                        : `Week ${activeWeek?.week}`}
                    </h2>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0', ...ff }}>
                      {plannerView === 'month'
                        ? 'Click any week card to see daily breakdown'
                        : `${activeWeek?.startDate} → ${activeWeek?.endDate}`}
                    </p>
                  </div>
                </div>
                <ChannelLegend />
              </div>

              {/* Weekend controls */}
              <div style={{
                padding: '10px 24px', borderBottom: '1px solid #f1f5f9',
                background: '#fafafe', display: 'flex', alignItems: 'center',
                gap: 12, flexWrap: 'wrap', flexShrink: 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
                  <Calendar size={13} style={{ color: '#94a3b8' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap', ...ff }}>
                    Weekend Policy
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {calendarWeekendOptions.map(date => {
                    const active = selectedPlannerWeekendConfig.working_weekend_dates.includes(date);
                    const day = new Date(`${date}T00:00:00`);
                    return (
                      <button
                        key={date}
                        onClick={() => handleWeekendWorkingToggle(date)}
                        className="ap-weekend-toggle"
                        style={{
                          background: active ? '#ecfdf5' : '#fef2f2',
                          color: active ? '#059669' : '#dc2626',
                          borderColor: active ? '#a7f3d0' : '#fecaca',
                        }}
                      >
                        <span style={{ fontWeight: 800, fontSize: 13 }}>{date.slice(8)}</span>
                        <span style={{ fontSize: 9, opacity: 0.7 }}>
                          {day.getDay() === 6 ? 'Sat' : 'Sun'} · {active ? 'Working' : 'Leave'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Month view ── */}
              {plannerView === 'month' ? (
                <div style={{ flex: 1, overflow: 'auto', padding: 24 }} className="ap-scroll">
                  <div className="ap-week-grid" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
                  }}>
                    {memberWeeks.map((w, idx) => (
                      <div
                        key={w.week}
                        onClick={() => { setSelectedWeek(w.week); setPlannerView('week'); }}
                        className="ap-card ap-card-interactive ap-fade-up"
                        style={{
                          padding: 20, cursor: 'pointer',
                          animationDelay: `${idx * 0.05}s`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 800, padding: '4px 10px',
                            borderRadius: 8, background: '#eef2ff', color: '#4338ca',
                            textTransform: 'uppercase', letterSpacing: '0.04em', ...ff,
                          }}>
                            Week {w.week}
                          </span>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1, ...ff }}>
                              {w.total}
                            </p>
                            <p style={{ fontSize: 10, color: '#94a3b8', margin: '2px 0 0', ...ff }}>activities</p>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {CHANNELS.map(ch => (
                            <div key={ch} style={{
                              padding: '10px 12px', borderRadius: 12,
                              background: CHANNEL_META[ch].bg,
                              border: `1px solid ${CHANNEL_META[ch].border}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: CHANNEL_META[ch].text }}>
                                {CHANNEL_META[ch].icon}
                                <span style={{ fontSize: 11, fontWeight: 600, ...ff }}>{CHANNEL_META[ch].label}</span>
                              </div>
                              <span style={{ fontSize: 16, fontWeight: 800, color: CHANNEL_META[ch].darkText, ...ff }}>
                                {w.totals[ch]}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div style={{
                          marginTop: 14, paddingTop: 12, borderTop: '1px solid #f1f5f9',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                          <span style={{ fontSize: 11, color: '#94a3b8', ...ff }}>
                            {w.startDate.slice(5)} — {w.endDate.slice(5)}
                          </span>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            fontSize: 11, fontWeight: 600, color: '#6366f1', ...ff,
                          }}>
                            <span>Expand</span>
                            <ArrowRight size={12} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              ) : (
                /* ── Week view — day calendar ── */
                <div style={{ flex: 1, overflow: 'auto' }} className="ap-scroll">
                  {/* Day-of-week header */}
                  <div className="ap-day-grid-7" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                    borderBottom: '1px solid #e2e8f0', background: '#fafafe',
                    position: 'sticky', top: 0, zIndex: 10,
                  }}>
                    {DAYS_OF_WEEK.map(day => (
                      <div key={day} style={{
                        padding: '10px 0', textAlign: 'center',
                        fontSize: 11, fontWeight: 700, color: '#94a3b8',
                        textTransform: 'uppercase', letterSpacing: '0.06em', ...ff,
                      }}>
                        {day}
                      </div>
                    ))}
                  </div>

                  {activeWeek && (() => {
                    const firstDate = new Date(`${activeWeek.startDate}T00:00:00`);
                    const blanks = Array(firstDate.getDay()).fill(null);
                    const cells = [...blanks, ...activeWeek.days];

                    return (
                      <div className="ap-day-grid-7" style={{
                        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                      }}>
                        {cells.map((day, i) => {
                          if (!day) {
                            return (
                              <div key={`blank-${i}`} style={{
                                background: '#fafafe', borderRight: '1px solid #f1f5f9',
                                borderBottom: '1px solid #f1f5f9', minHeight: 160,
                              }} />
                            );
                          }

                          const dateTasks = (activeMemberPlan?.tasks || []).filter((t: any) => t.task_date === day.date);
                          const dayDate = new Date(`${day.date}T00:00:00`);
                          const dow = dayDate.getDay();
                          const isWeekend = dow === 0 || dow === 6;
                          const isWorkingWeekend = selectedPlannerWeekendConfig.working_weekend_dates.includes(day.date);
                          const isLeaveDay = isWeekend && !isWorkingWeekend;
                          const isToday = ymd(new Date()) === day.date;

                          return (
                            <div
                              key={day.date}
                              className={`ap-day-cell ${isLeaveDay ? 'leave' : ''} ${isToday ? 'today' : ''}`}
                            >
                              {/* Date header */}
                              <div style={{
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between', marginBottom: 10,
                              }}>
                                <div style={{
                                  width: 30, height: 30, borderRadius: 10,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 13, fontWeight: 800,
                                  background: isToday ? '#4f46e5' : 'transparent',
                                  color: isToday ? '#fff' : '#334155',
                                  ...(isToday ? { animation: 'pulse-ring 2s infinite' } : {}),
                                  ...ff,
                                }}>
                                  {dayDate.getDate()}
                                </div>
                                {isLeaveDay ? (
                                  <span style={{
                                    fontSize: 9, fontWeight: 700, color: '#dc2626',
                                    background: '#fef2f2', padding: '2px 8px', borderRadius: 6,
                                    border: '1px solid #fecaca', ...ff,
                                  }}>Leave</span>
                                ) : (
                                  <span style={{
                                    fontSize: 12, fontWeight: 800, color: '#4f46e5',
                                    background: '#eef2ff', padding: '2px 8px', borderRadius: 6, ...ff,
                                  }}>{day.total}</span>
                                )}
                              </div>

                              {/* Channel pills */}
                              {!isLeaveDay && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                  {CHANNELS.map(ch => (
                                    <div
                                      key={ch}
                                      className="ap-channel-pill"
                                      style={{
                                        background: CHANNEL_META[ch].bg,
                                        color: CHANNEL_META[ch].text,
                                      }}
                                    >
                                      <span style={{ fontSize: 10, fontWeight: 600, ...ff }}>
                                        {CHANNEL_META[ch].label}
                                      </span>
                                      <span style={{ fontSize: 12, fontWeight: 800, ...ff }}>
                                        {day.byChannel[ch]}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Tasks */}
                              {!isLeaveDay && dateTasks.length > 0 && (
                                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                  {dateTasks.slice(0, 2).map((t: any) => (
                                    <button
                                      key={t.id}
                                      onClick={() => handleTaskStatusChange(
                                        t.id,
                                        t.status === 'pending' ? 'in_progress' : t.status === 'in_progress' ? 'done' : 'pending',
                                      )}
                                      className="ap-task-btn"
                                      style={{
                                        background: t.status === 'done' ? '#ecfdf5' : t.status === 'in_progress' ? '#fffbeb' : '#fff',
                                        borderColor: t.status === 'done' ? '#a7f3d0' : t.status === 'in_progress' ? '#fde68a' : '#e2e8f0',
                                        color: t.status === 'done' ? '#059669' : t.status === 'in_progress' ? '#d97706' : '#64748b',
                                        textDecoration: t.status === 'done' ? 'line-through' : 'none',
                                      }}
                                    >
                                      {t.title}
                                    </button>
                                  ))}
                                  {dateTasks.length > 2 && (
                                    <p style={{ fontSize: 10, color: '#94a3b8', margin: '2px 0 0 4px', ...ff }}>
                                      +{dateTasks.length - 2} more
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </section>
          </div>

        ) : (
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {step === 1 && (
              <div className="max-w-5xl w-full space-y-6 animate-[fadeIn_.35s_ease]">
                <div className="flex justify-between items-end bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-3xl p-5 shadow-sm">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800">Build Strategy</h2>
                    <p className="text-slate-500 text-sm">Create the base planner configuration for your team.</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl">
                    <CalendarDays size={14} />
                    <span>{monthLabel} {year}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black uppercase text-slate-400">Month</p>
                    <p className="text-lg font-black text-slate-800 mt-1">{monthLabel}</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black uppercase text-slate-400">Year</p>
                    <p className="text-lg font-black text-slate-800 mt-1">{year}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-slate-700">Plan Configuration</p>
                    <Sparkles size={14} className="text-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase">Plan Name</label>
                    <input className="w-full mt-1 p-3 bg-slate-50 border-none rounded-2xl font-bold" value={planName} onChange={e => setPlanName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase">Month</label>
                      <select className="w-full mt-1 p-3 bg-slate-50 border-none rounded-2xl font-bold" value={month} onChange={e => setMonth(Number(e.target.value))}>
                        {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase">Year</label>
                      <input type="number" className="w-full mt-1 p-3 bg-slate-50 border-none rounded-2xl font-bold" value={year} onChange={e => setYear(Number(e.target.value))} />
                    </div>
                  </div>
                  <button
                    className="ap-btn-primary"
                    style={{ width: '100%', padding: '16px 24px', fontSize: 14 }}
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
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div style={{
                          width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                          borderTop: '2px solid #fff', borderRadius: '50%',
                          animation: 'spin 0.6s linear infinite',
                        }} />
                        Creating plan…
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} />
                        Initialize Team Setup
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>

                {/* Right — context */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Snapshot stats */}
                  <div className="ap-card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: '#ecfdf5', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <BarChart3 size={15} style={{ color: '#059669' }} />
                      </div>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0, ...ff }}>
                        {MONTHS.find(m => m.value === month)?.label} {year} Snapshot
                      </h3>
                    </div>
                    <div className="ap-stats-grid" style={{
                      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12,
                    }}>
                      {[
                        { label: 'Total Days', value: getDaysInMonth(month, year).length, icon: <Calendar size={14} />, color: '#6366f1', bg: '#eef2ff' },
                        { label: 'Working Days', value: workdayCount, icon: <Clock size={14} />, color: '#059669', bg: '#ecfdf5' },
                        { label: 'Working Weekends', value: workingWeekendDates.length, icon: <Zap size={14} />, color: '#d97706', bg: '#fffbeb' },
                        { label: 'Weeks', value: totalWeeks, icon: <Grid3X3 size={14} />, color: '#7c3aed', bg: '#f5f3ff' },
                      ].map(s => (
                        <div key={s.label} style={{
                          padding: 16, borderRadius: 14,
                          background: s.bg, border: '1px solid transparent',
                        }}>
                          <div style={{ color: s.color, marginBottom: 8 }}>{s.icon}</div>
                          <p style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1, ...ff }}>
                            {s.value}
                          </p>
                          <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 0', fontWeight: 500, ...ff }}>
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Existing plans */}
                  {planners.length > 0 && (
                    <div className="ap-card" style={{ padding: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 10,
                          background: '#f5f3ff', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Layers size={15} style={{ color: '#7c3aed' }} />
                        </div>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0, ...ff }}>
                          Existing Plans
                        </h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {planners.map(p => (
                          <button
                            key={p.id}
                            onClick={() => { setPlannerId(p.id); setStep(3); }}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center',
                              justifyContent: 'space-between', padding: '14px 16px',
                              borderRadius: 12, textAlign: 'left',
                              background: plannerId === p.id ? '#eef2ff' : '#f8fafc',
                              border: `1.5px solid ${plannerId === p.id ? '#c7d2fe' : '#e2e8f0'}`,
                              cursor: 'pointer', ...ff,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: 0, ...ff }}>
                                {p.name}
                              </p>
                              <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0', ...ff }}>
                                {MONTHS.find(m => m.value === p.month)?.label} {p.year} · {p.member_plans?.length ?? 0} members
                              </p>
                            </div>
                            <div style={{
                              fontSize: 11, fontWeight: 600, color: '#6366f1',
                              display: 'flex', alignItems: 'center', gap: 4, ...ff,
                            }}>
                              Open <ArrowRight size={12} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="max-w-5xl w-full space-y-6 animate-[fadeIn_.35s_ease]">
                <div className="flex justify-between items-end bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-3xl p-5 shadow-sm">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Assign Agents</h2>
                    <p className="text-slate-500 text-sm">Configure targets for each team member.</p>
                  </div>
                  <button onClick={() => setMembers([...members, { ...members[0], member_name: '' }])} className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">+ Add Agent</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm md:col-span-2">
                    <p className="text-[10px] font-black uppercase text-slate-400">Plan Name</p>
                    <p className="text-lg font-black text-slate-800 mt-1 truncate">{planName || 'Monthly Activity Planner'}</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-[10px] font-black uppercase text-slate-400">Timeline</p>
                    <p className="text-lg font-black text-slate-800 mt-1">{monthLabel} {year}</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-[10px] font-black uppercase text-slate-400">Working Weekends</p>
                    <p className="text-lg font-black text-indigo-700 mt-1">{workingWeekendDates.length}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {members.map((m, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative group hover:-translate-y-0.5 hover:shadow-md transition-all">
                      <input
                        placeholder="Agent Name"
                        className="text-lg font-black text-slate-800 border-none focus:ring-0 p-0 mb-4 w-full"
                        value={m.member_name}
                        onChange={(e) => {
                          const nm = [...members];
                          nm[i].member_name = e.target.value;
                          nm[i].workspace_name = `${e.target.value}'s Workspace`;
                          setMembers(nm);
                        }}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        {(['calls', 'whatsapp', 'email', 'linkedin'] as Channel[]).map(ch => (
                          <div key={ch} className="p-3 bg-slate-50 rounded-2xl">
                            <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5 mb-1">
                              {CHANNEL_CONFIG[ch].icon} {ch}
                            </label>
                            <NumericInput
                              className="bg-transparent font-black text-slate-700 w-full outline-none"
                              value={m[`monthly_${ch}_target`]}
                              onChange={v => {
                                const nm = [...members];
                                nm[i][`monthly_${ch}_target`] = v;
                                setMembers(nm);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {members.length > 1 && (
                        <button onClick={() => setMembers(members.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-500">Back</button>
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
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200"
                  >
                    <span className="inline-flex items-center gap-2">{saving ? 'Generating Calendar...' : <><BarChart3 size={16} /> Deploy & View Calendar</>}</span>
                  </button>
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