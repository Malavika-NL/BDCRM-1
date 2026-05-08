import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  CheckCircle2, Plus, RefreshCcw, Users,
  Target, Phone, MessageSquare, Mail,
  Linkedin, Sparkles, Trash2, Settings,
  Calendar, Layers, ChevronLeft
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
  border: string; label: string;
}> = {
  calls: { icon: <Phone size={11} />, color: 'text-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Calls' },
  whatsapp: { icon: <MessageSquare size={11} />, color: 'text-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'WhatsApp' },
  email: { icon: <Mail size={11} />, color: 'text-amber-600', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Email' },
  linkedin: { icon: <Linkedin size={11} />, color: 'text-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'LinkedIn' },
};

const StepPill = ({ current, step, label, icon }: { current: number; step: number; label: string; icon: React.ReactNode; }) => {
  const done = current > step;
  const active = current === step;
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${done ? 'bg-emerald-100 text-emerald-700' : active ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'}`}>
      {done ? <CheckCircle2 size={12} /> : icon}{label}
    </div>
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

const ymd = (d: Date) => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getDaysInMonth = (month: number, year: number) => {
  const date = new Date(year, month - 1, 1);
  const days: Date[] = [];
  while (date.getMonth() === month - 1) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const getWeekendDaysInMonth = (month: number, year: number) =>
  getDaysInMonth(month, year).filter(d => {
    const day = d.getDay();
    return day === 0 || day === 6;
  });

const spreadAcrossDays = (total: number, dayCount: number) => {
  if (dayCount <= 0) return [];
  const safeTotal = Math.max(0, total || 0);
  const base = Math.floor(safeTotal / dayCount);
  const rem = safeTotal % dayCount;
  return Array.from({ length: dayCount }, (_, i) => base + (i < rem ? 1 : 0));
};

const spreadAcrossWeeksThenDays = (
  total: number,
  monthDays: Date[],
  workingWeekendDates: string[],
): number[] => {
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
    dayIndexes.forEach((monthIdx, dayIdx) => {
      byDay[monthIdx] = perDay[dayIdx] || 0;
    });
  });

  return byDay;
};

const parseWeekendConfigFromNotes = (notes: string | null | undefined): PlannerWeekendConfig => {
  if (!notes) return { working_weekend_dates: [] };
  try {
    const parsed = JSON.parse(notes);
    const list = Array.isArray(parsed?.working_weekend_dates) ? parsed.working_weekend_dates : [];
    return { working_weekend_dates: list.filter((d: unknown) => typeof d === 'string') };
  } catch {
    return { working_weekend_dates: [] };
  }
};

const buildAutoPlanFromTargets = (
  member: any,
  month: number,
  year: number,
  workingWeekendDates: string[],
): PlannedWeek[] => {
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
    if (!weekMap.has(week)) {
      weekMap.set(week, {
        week,
        startDate: ymd(d),
        endDate: ymd(d),
        days: [],
        totals: { calls: 0, whatsapp: 0, email: 0, linkedin: 0 },
        total: 0,
      });
    }
    const w = weekMap.get(week)!;
    const byChannel = {
      calls: dailyByChannel.calls[i],
      whatsapp: dailyByChannel.whatsapp[i],
      email: dailyByChannel.email[i],
      linkedin: dailyByChannel.linkedin[i],
    };
    const total = byChannel.calls + byChannel.whatsapp + byChannel.email + byChannel.linkedin;
    w.days.push({ date: ymd(d), byChannel, total });
    w.totals.calls += byChannel.calls;
    w.totals.whatsapp += byChannel.whatsapp;
    w.totals.email += byChannel.email;
    w.totals.linkedin += byChannel.linkedin;
    w.total += total;
    w.endDate = ymd(d);
  });

  return Array.from(weekMap.values()).sort((a, b) => a.week - b.week);
};

const isWorkingDate = (date: string, workingWeekendDates: string[]) => {
  const d = new Date(`${date}T00:00:00`);
  const day = d.getDay();
  if (day !== 0 && day !== 6) return true;
  return workingWeekendDates.includes(date);
};

const forceLeaveDaysToZero = (weeks: PlannedWeek[], workingWeekendDates: string[]) => {
  return weeks.map(w => {
    const nextDays = w.days.map(d => {
      if (isWorkingDate(d.date, workingWeekendDates)) return d;
      return {
        ...d,
        byChannel: { calls: 0, whatsapp: 0, email: 0, linkedin: 0 },
        total: 0,
      };
    });

    const totals = nextDays.reduce(
      (acc, d) => ({
        calls: acc.calls + d.byChannel.calls,
        whatsapp: acc.whatsapp + d.byChannel.whatsapp,
        email: acc.email + d.byChannel.email,
        linkedin: acc.linkedin + d.byChannel.linkedin,
      }),
      { calls: 0, whatsapp: 0, email: 0, linkedin: 0 },
    );

    return {
      ...w,
      days: nextDays,
      totals,
      total: totals.calls + totals.whatsapp + totals.email + totals.linkedin,
    };
  });
};

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
      if (!selectedMemberId || !selectedPlanner.member_plans.some(m => m.id === selectedMemberId)) {
        setSelectedMemberId(selectedPlanner.member_plans[0].id);
      }
    }
  }, [selectedPlanner, selectedMemberId]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.getActivityPlanners();
      setPlanners(list);
      if (list.length > 0 && !plannerId) setPlannerId(list[0].id);
    } finally {
      setLoading(false);
    }
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
    try {
      await api.updatePlannerTask(taskId, { status: status as any });
      await load();
    } catch {
      load();
    }
  };

  const handleWeekendWorkingToggle = async (date: string) => {
    if (!selectedPlanner) return;
    const current = parseWeekendConfigFromNotes(selectedPlanner.notes).working_weekend_dates;
    const next = current.includes(date) ? current.filter(d => d !== date) : [...current, date];
    const nextNotes = JSON.stringify({ working_weekend_dates: next });

    setPlanners(prev => prev.map(p => p.id === selectedPlanner.id ? { ...p, notes: nextNotes } : p));
    try {
      await api.updateActivityPlanner(selectedPlanner.id, { notes: nextNotes });
      await load();
    } catch {
      await load();
    }
  };

  const memberWeeks = useMemo(() => {
    if (!selectedPlanner || !activeMemberPlan) return [];
    const auto = buildAutoPlanFromTargets(
      activeMemberPlan,
      selectedPlanner.month,
      selectedPlanner.year,
      selectedPlannerWeekendConfig.working_weekend_dates,
    );
    return forceLeaveDaysToZero(auto, selectedPlannerWeekendConfig.working_weekend_dates);
  }, [selectedPlanner, activeMemberPlan, selectedPlannerWeekendConfig.working_weekend_dates]);

  useEffect(() => {
    if (memberWeeks.length > 0) {
      setSelectedWeek(prev => (prev && memberWeeks.some(w => w.week === prev)) ? prev : memberWeeks[0].week);
    } else {
      setSelectedWeek(null);
    }
  }, [memberWeeks]);

  const activeWeek = useMemo(
    () => memberWeeks.find(w => w.week === selectedWeek) || null,
    [memberWeeks, selectedWeek],
  );

  const stats = useMemo(() => {
    if (!activeMemberPlan) return null;
    const tasks = activeMemberPlan.tasks || [];
    const done = tasks.filter(t => t.status === 'done').length;
    return {
      total: tasks.length,
      done,
      pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
    };
  }, [activeMemberPlan]);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl"><Target className="text-white" size={20} /></div>
          <div>
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">Activity Architect</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase">{selectedPlanner?.name || 'New Plan'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StepPill current={step} step={1} label="Setup" icon={<Settings size={12} />} />
          <StepPill current={step} step={2} label="Team" icon={<Users size={12} />} />
          <StepPill current={step} step={3} label="Calendar" icon={<Calendar size={12} />} />
          <button onClick={load} className={`p-2 rounded-lg hover:bg-slate-100 ${loading ? 'animate-spin' : ''}`}><RefreshCcw size={16} /></button>
        </div>
      </header>

      <main className="flex-1 flex min-h-0">
        {step === 3 && selectedPlanner ? (
          <>
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Team Execution</h2>
                <div className="space-y-2">
                  {selectedPlanner.member_plans.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMemberId(m.id);
                        setPlannerView('month');
                      }}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border ${selectedMemberId === m.id ? 'bg-indigo-50 border-indigo-200' : 'bg-transparent border-transparent hover:bg-slate-50'}`}
                    >
                      <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                        {m.member_name.charAt(0) || 'U'}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${selectedMemberId === m.id ? 'text-indigo-900' : 'text-slate-700'}`}>{m.member_name}</p>
                        <p className="text-[9px] text-slate-400 font-medium">{m.workspace_name || 'Workspace Active'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Task Completion</span>
                    <span className="text-lg font-black text-slate-800">{stats?.pct || 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-700" style={{ width: `${stats?.pct || 0}%` }} />
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Layers size={12} className="text-indigo-500" /> Weekly Auto Distribution
                  </h3>
                  <div className="space-y-2">
                    {memberWeeks.map(w => (
                      <button
                        key={w.week}
                        onClick={() => {
                          setSelectedWeek(w.week);
                          setPlannerView('week');
                        }}
                        className={`w-full p-2.5 rounded-lg border text-left transition ${selectedWeek === w.week && plannerView === 'week' ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase">Week {w.week}</span>
                          <span className="text-[10px] font-black text-slate-700">{w.total}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">{w.startDate} to {w.endDate}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <button onClick={() => setStep(1)} className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  <Plus size={14} /> Create New Plan
                </button>
              </div>
            </aside>

            <section className="flex-1 flex flex-col bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {plannerView === 'week' && (
                    <button
                      onClick={() => setPlannerView('month')}
                      className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  )}
                  <h2 className="text-xl font-black text-slate-800">
                    {plannerView === 'month'
                      ? `${MONTHS.find(m => m.value === selectedPlanner.month)?.label} ${selectedPlanner.year} Weekly View`
                      : `Week ${activeWeek?.week} Daily Calendar (${activeWeek?.startDate} to ${activeWeek?.endDate})`}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {Object.entries(CHANNEL_CONFIG).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100">
                      <div className={cfg.color}>{cfg.icon}</div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{cfg.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Admin Weekend Controls</p>
                  <p className="text-[11px] text-slate-500">
                    Sat/Sun default to Leave. Select dates to make them Working.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {calendarWeekendOptions.map(date => {
                    const active = selectedPlannerWeekendConfig.working_weekend_dates.includes(date);
                    const day = new Date(`${date}T00:00:00`);
                    return (
                      <button
                        key={date}
                        type="button"
                        onClick={() => handleWeekendWorkingToggle(date)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition ${
                          active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {date} {day.getDay() === 6 ? 'Sat' : 'Sun'} {active ? 'Working' : 'Leave'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {plannerView === 'month' ? (
                <div className="p-6 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {memberWeeks.map(w => (
                      <button
                        key={w.week}
                        onClick={() => {
                          setSelectedWeek(w.week);
                          setPlannerView('week');
                        }}
                        className="text-left p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-black uppercase text-indigo-700 bg-indigo-100 px-2 py-1 rounded-lg">Week {w.week}</span>
                          <span className="text-sm font-black text-slate-800">{w.total} Activities</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
                            <div key={ch} className={`p-2 rounded-lg border ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].border}`}>
                              <p className={`text-[10px] font-black uppercase ${CHANNEL_CONFIG[ch].text}`}>{CHANNEL_CONFIG[ch].label}</p>
                              <p className="text-sm font-black text-slate-800">{w.totals[ch]}</p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-3 text-[11px] text-slate-500">Click to view day-wise calendar</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                    {DAYS_OF_WEEK.map(day => (
                      <div key={day} className="py-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {day}
                      </div>
                    ))}
                  </div>

                  {activeWeek && (() => {
                    const firstDate = new Date(`${activeWeek.startDate}T00:00:00`);
                    const blanks = Array(firstDate.getDay()).fill(null);
                    const cells = [...blanks, ...activeWeek.days];

                    return (
                      <div className="grid grid-cols-7 auto-rows-[minmax(140px,auto)]">
                        {cells.map((day, i) => {
                          if (!day) return <div key={`blank-${i}`} className="bg-slate-50/30 border-r border-b border-slate-100" />;
                          const dateTasks = (activeMemberPlan?.tasks || []).filter(t => t.task_date === day.date);
                          const dayDate = new Date(`${day.date}T00:00:00`);
                          const dow = dayDate.getDay();
                          const isWeekend = dow === 0 || dow === 6;
                          const isWorkingWeekend = selectedPlannerWeekendConfig.working_weekend_dates.includes(day.date);
                          const isLeaveDay = isWeekend && !isWorkingWeekend;

                          return (
                            <div key={day.date} className={`p-2 border-r border-b border-slate-100 ${isLeaveDay ? 'bg-rose-50/40' : ''}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black text-slate-700">{dayDate.getDate()}</span>
                                <div className="flex items-center gap-1.5">
                                  {isLeaveDay && <span className="text-[9px] font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">Leave</span>}
                                  <span className="text-[10px] font-black text-indigo-600">{day.total}</span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                {(Object.keys(CHANNEL_CONFIG) as Channel[]).map(ch => (
                                  <div key={ch} className={`px-2 py-1 rounded border text-[10px] font-bold flex justify-between ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].border}`}>
                                    <span className={CHANNEL_CONFIG[ch].text}>{CHANNEL_CONFIG[ch].label}</span>
                                    <span className={CHANNEL_CONFIG[ch].text}>{day.byChannel[ch]}</span>
                                  </div>
                                ))}
                              </div>

                              {!isLeaveDay && dateTasks.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {dateTasks.slice(0, 2).map(t => (
                                    <button
                                      key={t.id}
                                      onClick={() => handleTaskStatusChange(t.id, t.status === 'pending' ? 'in_progress' : t.status === 'in_progress' ? 'done' : 'pending')}
                                      className="w-full text-left text-[10px] px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50"
                                    >
                                      {t.title}
                                    </button>
                                  ))}
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
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            {step === 1 && (
              <div className="max-w-md w-full space-y-6">
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
                  <Sparkles className="text-indigo-400 mb-4" />
                  <h2 className="text-2xl font-black mb-2">Build Strategy</h2>
                  <p className="text-slate-400 text-sm">Create an automated activity roadmap for your sales team.</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
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
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase">Weekend Working Days (Admin)</label>
                    <p className="text-[11px] text-slate-500 mt-1 mb-2">
                      Weekdays are always working. Select Saturday/Sunday dates that should also be treated as working.
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {weekendOptions.map(date => {
                        const active = workingWeekendDates.includes(date);
                        const day = new Date(`${date}T00:00:00`);
                        return (
                          <button
                            type="button"
                            key={date}
                            onClick={() => {
                              setWorkingWeekendDates(prev =>
                                prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date],
                              );
                            }}
                            className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition ${
                              active
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {date.slice(8)} {day.getDay() === 6 ? 'Sat' : 'Sun'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const res = await api.createActivityPlanner({
                          name: planName,
                          month,
                          year,
                          status: 'active',
                          notes: JSON.stringify({ working_weekend_dates: workingWeekendDates }),
                        });
                        setPlannerId(res.id);
                        await load();
                        setStep(2);
                      } finally { setSaving(false); }
                    }}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                  >
                    {saving ? 'Creating...' : 'Initialize Team Setup'}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-4xl w-full space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Assign Agents</h2>
                    <p className="text-slate-500 text-sm">Configure targets for each team member.</p>
                  </div>
                  <button onClick={() => setMembers([...members, { ...members[0], member_name: '' }])} className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">+ Add Agent</button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {members.map((m, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative group">
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
                    {saving ? 'Generating Calendar...' : 'Deploy & View Calendar'}
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
