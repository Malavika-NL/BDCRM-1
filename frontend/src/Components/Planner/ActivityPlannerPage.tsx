import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Phone,
  Pencil,
  RotateCcw,
  Search,
  Shield,
  ShieldCheck,
  Target,
  Trash2,
  Users,
  Wand2,
} from 'lucide-react';
import { authStore } from '../Utils/auth';
import type { ActivityPlanner, PlannerCallAssignment, PlannerQueueResponse } from '../Utils/types';

type PlannerUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role?: string;
  is_active?: boolean;
  designation?: string;
  department?: string;
};

const PLANNERS_URL = '/api/activity-planners/';
const USERS_URL = '/api/auth/users/';
const QUEUE_URL = '/api/planner-call-assignments/my_queue/';

const MONTHS = Array.from({ length: 12 }, (_, index) => ({
  value: index + 1,
  label: new Date(2000, index, 1).toLocaleString('en', { month: 'long' }),
}));

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const inputCls =
  'w-full px-3.5 py-3 text-[14px] text-slate-800 bg-slate-50 border border-slate-200 rounded-xl ' +
  'placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-sky-400 ' +
  'focus:ring-4 focus:ring-sky-500/10 transition-all duration-200';

const getDisplayName = (user: PlannerUser) =>
  `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || user.email;

const getAssignmentStatusStyle = (status: 'pending' | 'contacted' | 'skipped') => {
  if (status === 'contacted') {
    return {
      background: '#f0fdf4',
      color: '#166534',
      border: '1px solid #bbf7d0',
    };
  }
  if (status === 'skipped') {
    return {
      background: '#fff7ed',
      color: '#c2410c',
      border: '1px solid #fdba74',
    };
  }
  return {
    background: '#eff6ff',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
  };
};

const isTelemarketingUser = (user: PlannerUser) => {
  const searchable = `${user.designation || ''} ${user.department || ''}`.toLowerCase();
  if (
    ['telemarketing', 'tele-calling', 'telecalling', 'tele caller', 'telecaller'].some((keyword) =>
      searchable.includes(keyword)
    )
  ) {
    return true;
  }
  return user.role === 'employee' && !searchable.trim();
};

const toYmd = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getPlannerWeekendDates = (notes?: string) => {
  if (!notes) return [];
  try {
    const parsed = JSON.parse(notes);
    return Array.isArray(parsed?.working_weekend_dates)
      ? parsed.working_weekend_dates.filter((item: unknown) => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
};

const extractErrorMessage = (data: any, fallback: string) => {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data.detail === 'string') return data.detail;
  if (typeof data.message === 'string') return data.message;
  for (const value of Object.values(data)) {
    if (Array.isArray(value) && value.length) return String(value[0]);
    if (typeof value === 'string' && value.trim()) return value;
  }
  return fallback;
};

export function ActivityPlannerPage({ assignedContactsOnly = false }: { assignedContactsOnly?: boolean }) {
  const currentUser = useMemo(() => authStore.getUser(), []);
  const isAdmin = currentUser?.role === 'admin';
  const navigate = useNavigate();

  const [forceLogin, setForceLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [planners, setPlanners] = useState<ActivityPlanner[]>([]);
  const [users, setUsers] = useState<PlannerUser[]>([]);
  const [selectedPlannerId, setSelectedPlannerId] = useState<number | null>(null);
  const [queue, setQueue] = useState<PlannerQueueResponse | null>(null);
  const [remarks, setRemarks] = useState('');
  const [userView, setUserView] = useState<'queue' | 'contacted'>('queue');
  const [nextContactPopup, setNextContactPopup] = useState<PlannerCallAssignment | null>(null);

  const [planName, setPlanName] = useState('Monthly Call Planner');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [sourceProject, setSourceProject] = useState<'all' | 'marketing_crm' | 'salespie' | 'both'>('all');
  const [targets, setTargets] = useState<Record<number, number>>({});
  const [assignmentSearch, setAssignmentSearch] = useState('');
  const [quickFillCount, setQuickFillCount] = useState('');
  const [workingWeekendDates, setWorkingWeekendDates] = useState<string[]>([]);
  const [selectedAdminMemberId, setSelectedAdminMemberId] = useState<number | null>(null);
  const [adminPlanView, setAdminPlanView] = useState<'monthly' | 'weekly' | 'daily'>('monthly');

  if (forceLogin || !authStore.getToken() || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const loadQueue = async (): Promise<PlannerQueueResponse | null> => {
    try {
      const res = await authStore.fetchWithAuth(QUEUE_URL);
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(extractErrorMessage(data, 'Failed to load your call queue.'));
      setQueue(data);
      return data;
    } catch (err: any) {
      if ((err.message || '').includes('Session expired')) {
        setForceLogin(true);
      }
      setQueue(null);
      setError(err.message || 'Failed to load your call queue.');
      return null;
    }
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const plannersRes = await authStore.fetchWithAuth(PLANNERS_URL);
      const plannersData = await plannersRes.json().catch(() => null);
      if (!plannersRes.ok) throw new Error(extractErrorMessage(plannersData, 'Failed to load activity planners.'));

      const plannerList = Array.isArray(plannersData) ? plannersData : [];
      setPlanners(plannerList);

      if (isAdmin) {
        const usersRes = await authStore.fetchWithAuth(USERS_URL);
        const usersData = await usersRes.json().catch(() => null);
        if (!usersRes.ok) throw new Error(extractErrorMessage(usersData, 'Failed to load users.'));
        const employeeUsers = (Array.isArray(usersData) ? usersData : []).filter(
          (user) => user.is_active !== false && (user.role === 'admin' || isTelemarketingUser(user))
        );
        setUsers(employeeUsers);

        const preferredPlanner =
          plannerList.find((planner) => planner.month === month && planner.year === year) || plannerList[0] || null;
        setSelectedPlannerId(preferredPlanner?.id ?? null);
      } else {
        await loadQueue();
      }
    } catch (err: any) {
      if ((err.message || '').includes('Session expired')) {
        setForceLogin(true);
      }
      setError(err.message || 'Failed to load activity planner.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!isAdmin || users.length === 0) return;
    setTargets((prev) => {
      const next = { ...prev };
      users.forEach((user) => {
        if (typeof next[user.id] !== 'number') next[user.id] = Number.NaN;
      });
      return next;
    });
  }, [isAdmin, users]);

  const selectedPlanner = useMemo(
    () => planners.find((planner) => planner.id === selectedPlannerId) || null,
    [planners, selectedPlannerId]
  );

  useEffect(() => {
    if (!selectedPlanner || !isAdmin) return;
    setPlanName(selectedPlanner.name);
    setMonth(selectedPlanner.month);
    setYear(selectedPlanner.year);
    setSourceProject(selectedPlanner.source_project || 'all');
    setWorkingWeekendDates(getPlannerWeekendDates(selectedPlanner.notes));
    setTargets((prev) => {
      const next = { ...prev };
      selectedPlanner.member_plans.forEach((memberPlan) => {
        if (memberPlan.user) next[memberPlan.user] = memberPlan.monthly_calls_target || Number.NaN;
      });
      return next;
    });
  }, [selectedPlanner, isAdmin]);

  useEffect(() => {
    if (!selectedPlanner?.member_plans?.length) {
      setSelectedAdminMemberId(null);
      setAdminPlanView('monthly');
      return;
    }
    if (selectedAdminMemberId && selectedPlanner.member_plans.some((member) => member.id === selectedAdminMemberId)) {
      return;
    }
    setSelectedAdminMemberId(selectedPlanner.member_plans[0]?.id ?? null);
    setAdminPlanView('monthly');
  }, [selectedAdminMemberId, selectedPlanner]);

  const totalMonthlyCalls = useMemo(
    () => Object.values(targets).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0),
    [targets]
  );

  const assignedUserCount = useMemo(
    () => users.filter((user) => (Number.isFinite(targets[user.id]) ? targets[user.id] : 0) > 0).length,
    [targets, users]
  );

  const filteredUsers = useMemo(() => {
    const query = assignmentSearch.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      const name = getDisplayName(user).toLowerCase();
      return name.includes(query) || user.email.toLowerCase().includes(query) || user.username.toLowerCase().includes(query);
    });
  }, [assignmentSearch, users]);

  const daysInSelectedMonth = useMemo(() => new Date(year, month, 0).getDate(), [month, year]);
  const calendarDays = useMemo(() => {
    const days = Array.from({ length: daysInSelectedMonth }, (_, index) => {
      const date = new Date(year, month - 1, index + 1);
      const ymd = toYmd(date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      return {
        date,
        ymd,
        dayNumber: index + 1,
        weekday: date.getDay(),
        isWeekend,
        isWorking: !isWeekend || workingWeekendDates.includes(ymd),
      };
    });
    const firstWeekday = days[0]?.weekday ?? 0;
    return {
      padding: Array.from({ length: firstWeekday }),
      days,
    };
  }, [daysInSelectedMonth, month, workingWeekendDates, year]);
  const workingDayCount = useMemo(
    () => calendarDays.days.filter((day) => day.isWorking).length,
    [calendarDays]
  );
  const averageDailyCalls = workingDayCount > 0 ? Math.ceil(totalMonthlyCalls / workingDayCount) : 0;

  const selectedAdminMemberPlan = useMemo(() => {
    if (!selectedPlanner || !selectedAdminMemberId) return null;
    return selectedPlanner.member_plans.find((member) => member.id === selectedAdminMemberId) || null;
  }, [selectedAdminMemberId, selectedPlanner]);

  const selectedAdminWeeklyTasks = useMemo(() => {
    if (!selectedAdminMemberPlan) return [];
    return selectedAdminMemberPlan.tasks
      .filter((task) => task.period_type === 'weekly' && task.channel === 'calls')
      .sort((a, b) => a.week_number - b.week_number);
  }, [selectedAdminMemberPlan]);

  const selectedAdminDailyTasks = useMemo(() => {
    if (!selectedAdminMemberPlan) return [];
    return selectedAdminMemberPlan.tasks
      .filter((task) => task.period_type === 'daily' && task.channel === 'calls')
      .sort((a, b) => (a.task_date || '').localeCompare(b.task_date || ''));
  }, [selectedAdminMemberPlan]);

  const selectedAdminDoneCount = useMemo(
    () =>
      selectedAdminMemberPlan?.call_assignments?.filter((assignment) => assignment.status === 'contacted').length || 0,
    [selectedAdminMemberPlan]
  );

  const selectedAdminPendingCount = useMemo(
    () =>
      selectedAdminMemberPlan?.call_assignments?.filter((assignment) => assignment.status === 'pending').length || 0,
    [selectedAdminMemberPlan]
  );

  const selectedAdminSkippedCount = useMemo(
    () =>
      selectedAdminMemberPlan?.call_assignments?.filter((assignment) => assignment.status === 'skipped').length || 0,
    [selectedAdminMemberPlan]
  );

  useEffect(() => {
    setWorkingWeekendDates((prev) =>
      prev.filter((item) => {
        const date = new Date(`${item}T00:00:00`);
        return date.getMonth() === month - 1 && date.getFullYear() === year;
      })
    );
  }, [month, year]);

  const handleTargetChange = (userId: number, value: string) => {
    if (value.trim() === '') {
      setTargets((prev) => ({ ...prev, [userId]: Number.NaN }));
      return;
    }
    const parsed = Math.max(0, Number(value.replace(/^0+(?=\d)/, '')) || 0);
    setTargets((prev) => ({ ...prev, [userId]: parsed }));
  };

  const handleQuickFill = () => {
    const parsed = Math.max(0, Number(quickFillCount) || 0);
    setTargets((prev) => {
      const next = { ...prev };
      users.forEach((user) => {
        next[user.id] = parsed;
      });
      return next;
    });
  };

  const handleClearTargets = () => {
    setTargets((prev) => {
      const next = { ...prev };
      users.forEach((user) => {
        next[user.id] = Number.NaN;
      });
      return next;
    });
    setQuickFillCount('');
  };

  const toggleWeekendDate = (ymd: string) => {
    setWorkingWeekendDates((prev) =>
      prev.includes(ymd) ? prev.filter((item) => item !== ymd) : [...prev, ymd].sort()
    );
  };

  const selectPlannerPeriod = (nextMonth: number, nextYear: number) => {
    const matchingPlanner = planners.find(
      (planner) => planner.month === nextMonth && planner.year === nextYear
    );

    // Switch the selected planner at the same time as the period. Without this,
    // the previously selected planner restores its old month through the form
    // hydration effect above.
    setSelectedPlannerId(matchingPlanner?.id ?? null);
    setMonth(nextMonth);
    setYear(nextYear);

    if (!matchingPlanner) {
      setPlanName('Monthly Call Planner');
      setSourceProject('all');
      setWorkingWeekendDates([]);
      setTargets((prev) => {
        const next = { ...prev };
        users.forEach((user) => {
          next[user.id] = Number.NaN;
        });
        return next;
      });
    }
  };

  const showPreviousMonth = () => {
    const previous = new Date(year, month - 2, 1);
    selectPlannerPeriod(previous.getMonth() + 1, previous.getFullYear());
  };


  const handleSaveAdminPlanner = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      let plannerId = selectedPlannerId;
      const plannerNotes = JSON.stringify({ working_weekend_dates: workingWeekendDates });

      if (!plannerId || selectedPlanner?.month !== month || selectedPlanner?.year !== year) {
        const createRes = await authStore.fetchWithAuth(PLANNERS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: planName.trim() || 'Monthly Call Planner',
            month,
            year,
            status: 'active',
            role_mode: 'admin',
            source_project: sourceProject,
            notes: plannerNotes,
          }),
        });
        const createData = await createRes.json().catch(() => null);
        if (!createRes.ok) throw new Error(extractErrorMessage(createData, 'Failed to create activity planner.'));
        plannerId = createData.id;
      } else {
        const updateRes = await authStore.fetchWithAuth(`${PLANNERS_URL}${plannerId}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: planName.trim() || 'Monthly Call Planner',
            month,
            year,
            status: 'active',
            source_project: sourceProject,
            notes: plannerNotes,
          }),
        });
        const updateData = await updateRes.json().catch(() => null);
        if (!updateRes.ok) throw new Error(extractErrorMessage(updateData, 'Failed to update activity planner.'));
      }

      const members = users
        .filter((user) => (targets[user.id] || 0) > 0)
        .map((user) => ({
          user: user.id,
          member_name: getDisplayName(user),
          workspace_name: `${getDisplayName(user)} Daily Call Queue`,
          monthly_calls_target: targets[user.id] || 0,
          monthly_whatsapp_target: 0,
          monthly_email_target: 0,
          monthly_linkedin_target: 0,
          calls_weightage: 100,
          whatsapp_weightage: 0,
          email_weightage: 0,
          linkedin_weightage: 0,
        }));

      const assignRes = await authStore.fetchWithAuth(`${PLANNERS_URL}${plannerId}/assign_members/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members }),
      });
      const assignData = await assignRes.json().catch(() => null);
      if (!assignRes.ok) throw new Error(extractErrorMessage(assignData, 'Failed to assign monthly targets.'));

      await load();
      setSelectedPlannerId(plannerId);
      setSuccess(`Monthly targets saved. ${assignData?.assigned_contacts ?? 0} contacts were assigned automatically.`);
      if (isAdmin && plannerId) {
        navigate(`/activity-planner/assignments/${plannerId}`);
      }
    } catch (err: any) {
      if ((err.message || '').includes('Session expired')) {
        setForceLogin(true);
      }
      setError(err.message || 'Failed to save monthly targets.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlanner = async () => {
    if (!selectedPlannerId || !selectedPlanner) return;
    if (!window.confirm(`Delete "${selectedPlanner.name}"? Its assigned contacts will be released for future planners.`)) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await authStore.fetchWithAuth(`${PLANNERS_URL}${selectedPlannerId}/`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(extractErrorMessage(data, 'Failed to delete activity planner.'));
      }
      setSelectedPlannerId(null);
      setTargets({});
      setSuccess(`Planner "${selectedPlanner.name}" was deleted and its contacts were released.`);
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to delete activity planner.');
    } finally {
      setSaving(false);
    }
  };

  const submitRemark = async (status: 'contacted' | 'skipped') => {
    if (!queue?.next_assignment) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await authStore.fetchWithAuth(
        `/api/planner-call-assignments/${queue.next_assignment.id}/submit_remark/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ remarks: remarks.trim(), status }),
        }
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(extractErrorMessage(data, 'Failed to submit remark.'));
      setRemarks('');
      const refreshedQueue = await loadQueue();
      if (refreshedQueue?.next_assignment) setNextContactPopup(refreshedQueue.next_assignment);
      setSuccess(status === 'contacted'
        ? 'Verified successfully. The admin can now see this completed contact.'
        : 'Contact skipped. The next assigned contact is ready.');
    } catch (err: any) {
      if ((err.message || '').includes('Session expired')) {
        setForceLogin(true);
      }
      setError(err.message || 'Failed to submit remark.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-y-auto px-6 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ background: 'linear-gradient(145deg,#f8fbff 0%,#eef7ff 48%,#f7fcfb 100%)' }}
    >
      <div
        className="rounded-[30px] overflow-hidden"
        style={{
          background: isAdmin
            ? 'linear-gradient(125deg,#082f49 0%,#0f766e 42%,#2563eb 100%)'
            : 'linear-gradient(125deg,#172554 0%,#1d4ed8 52%,#0891b2 100%)',
          boxShadow: '0 16px 48px -6px rgba(14,116,144,0.35), 0 2px 10px rgba(0,0,0,0.12)',
        }}
      >
        <div className="px-8 py-8 flex items-center gap-5 flex-wrap">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.24)' }}
          >
            {isAdmin ? <Target className="text-white" size={28} /> : <Phone className="text-white" size={28} />}
          </div>

          <div className="flex-1 min-w-0">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-[0.16em]"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#dbeafe', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <ShieldCheck size={12} />
              {isAdmin ? 'Admin Planning Console' : 'My Daily Call Queue'}
            </div>
            <h1 className="text-[30px] font-black text-white leading-tight tracking-tight mt-3">
              {!isAdmin && assignedContactsOnly ? 'Assigned Contacts' : 'Activity Planner'}
            </h1>
            <p className="text-[14px] text-blue-50/90 mt-2 max-w-3xl font-medium">
              {isAdmin
                ? 'Set a monthly call target for each user, then let the system split it week-wise and day-wise while assigning unique contacts automatically.'
                : 'See only the contact you need to call next, add your remark, and move smoothly to the next assigned contact without seeing other users’ queues.'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {isAdmin ? (
              <>
                <div className="px-4 py-3 rounded-2xl min-w-[120px]" style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)' }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-100/80">Team Members</p>
                  <p className="text-[24px] font-black text-white mt-1">{users.length}</p>
                </div>
                <div className="px-4 py-3 rounded-2xl min-w-[120px]" style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)' }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-100/80">Monthly Calls</p>
                  <p className="text-[24px] font-black text-white mt-1">{totalMonthlyCalls}</p>
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-3 rounded-2xl min-w-[120px]" style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)' }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-100/80">Today Done</p>
                  <p className="text-[24px] font-black text-white mt-1">{queue?.today_done ?? 0}</p>
                </div>
                <div className="px-4 py-3 rounded-2xl min-w-[120px]" style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)' }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-100/80">Today Left</p>
                  <p className="text-[24px] font-black text-white mt-1">{queue?.today_remaining ?? 0}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl px-5 py-4 text-rose-700 font-semibold bg-rose-50 border border-rose-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-2xl px-5 py-4 text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-slate-400">
            <Loader2 size={24} className="animate-spin text-sky-500" />
            <span className="text-[15px] font-semibold">Loading activity planner...</span>
          </div>
        </div>
      ) : isAdmin ? (
        <div className="mt-6 w-full">
          <section
            className="bg-white rounded-[28px] overflow-hidden"
            style={{ border: '1.5px solid #dbeafe', boxShadow: '0 18px 50px rgba(15,23,42,0.08)' }}
          >
            <div className="px-6 py-5 border-b border-slate-100 bg-[linear-gradient(135deg,#ffffff,#f8fbff,#f0fdfa)]">
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-sky-600">Monthly Target Setup</p>
              <h2 className="text-[22px] font-black text-slate-800 mt-1">Assign monthly call targets user-wise</h2>
              <p className="text-[13px] text-slate-500 font-medium mt-1">
                Once saved, the system automatically creates weekly and daily plans and assigns unique contacts.
              </p>
            </div>

            <div className="p-7 md:p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-5">
                <div>
                  <label className="block text-[12px] font-black text-slate-500 uppercase tracking-[0.16em] mb-2">Planner Name</label>
                  <input className={inputCls} value={planName} onChange={(e) => setPlanName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-black text-slate-500 uppercase tracking-[0.16em] mb-2">Existing Planner</label>
                  <select
                    className={inputCls}
                    value={selectedPlannerId ?? ''}
                    onChange={(e) => setSelectedPlannerId(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">Create new planner for selected month</option>
                    {planners.map((planner) => (
                      <option key={planner.id} value={planner.id}>
                        {planner.name} - {MONTHS[planner.month - 1]?.label} {planner.year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-black text-slate-500 uppercase tracking-[0.16em] mb-2">Month</label>
                  <select
                    className={inputCls}
                    value={month}
                    onChange={(e) => selectPlannerPeriod(Number(e.target.value), year)}
                  >
                    {MONTHS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-black text-slate-500 uppercase tracking-[0.16em] mb-2">Year</label>
                  <input
                    className={inputCls}
                    type="number"
                    value={year}
                    onChange={(e) => selectPlannerPeriod(month, Number(e.target.value))}
                  />
                  <button
                    type="button"
                    onClick={showPreviousMonth}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-black text-sky-700 bg-sky-50 border border-sky-200"
                  >
                    <CalendarDays size={12} /> View Previous Month
                  </button>
                </div>
                <div>
                  <label className="block text-[12px] font-black text-slate-500 uppercase tracking-[0.16em] mb-2">Contact Source</label>
                  <select
                    className={inputCls}
                    value={sourceProject}
                    onChange={(e) => setSourceProject(e.target.value as typeof sourceProject)}
                  >
                    <option value="all">All contacts</option>
                    <option value="marketing_crm">Marketing CRM</option>
                    <option value="salespie">SalesPie</option>
                    <option value="both">Shared by both CRMs</option>
                  </select>
                  {selectedPlanner ? (
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPlannerId(selectedPlanner.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-black text-sky-700 bg-sky-50 border border-sky-200"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={handleDeletePlanner}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-black text-rose-700 bg-rose-50 border border-rose-200 disabled:opacity-60"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[28px] overflow-hidden bg-white" style={{ border: '1px solid #dbeafe' }}>
                <div className="px-5 py-5 md:px-6 border-b border-sky-100 bg-[linear-gradient(135deg,#ffffff,#f8fbff)]">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#0f766e,#14b8a6)' }}>
                        <CalendarDays size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[16px] font-black text-slate-800">Working Calendar</p>
                        <p className="text-[13px] text-slate-500 font-medium mt-1">
                          Monday to Friday is selected automatically. Click Saturday or Sunday only when the team is working.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
                      <div className="rounded-2xl px-4 py-3 bg-slate-50 border border-slate-200 min-w-[130px]">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Working Days</p>
                        <p className="text-[22px] font-black text-slate-800 mt-1">{workingDayCount}</p>
                      </div>
                      <div className="rounded-2xl px-4 py-3 bg-slate-50 border border-slate-200 min-w-[130px]">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Weekends On</p>
                        <p className="text-[22px] font-black text-slate-800 mt-1">{workingWeekendDates.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {WEEKDAY_LABELS.map((label) => (
                      <div key={label} className="text-center text-[11px] font-black uppercase tracking-[0.12em] text-slate-400 py-2">
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.padding.map((_, index) => (
                      <div key={`pad-${index}`} className="min-h-[54px]" />
                    ))}
                    {calendarDays.days.map((day) => {
                      const weekendSelected = day.isWeekend && workingWeekendDates.includes(day.ymd);
                      return (
                        <button
                          key={day.ymd}
                          type="button"
                          onClick={() => day.isWeekend && toggleWeekendDate(day.ymd)}
                          disabled={!day.isWeekend}
                          className={`min-h-[54px] rounded-2xl border px-2 py-2 text-left transition-all duration-150 ${
                            day.isWeekend
                              ? weekendSelected
                                ? 'bg-teal-50 border-teal-300 shadow-sm'
                                : 'bg-slate-50 border-slate-200 hover:bg-sky-50 hover:border-sky-200'
                              : 'bg-white border-sky-100 cursor-default'
                          }`}
                        >
                          <span className={`block text-[14px] font-black ${day.isWorking ? 'text-slate-800' : 'text-slate-400'}`}>
                            {day.dayNumber}
                          </span>
                          <span
                            className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] ${
                              day.isWeekend
                                ? weekendSelected
                                  ? 'text-teal-700 bg-teal-100'
                                  : 'text-slate-400 bg-white border border-slate-200'
                                : 'text-sky-700 bg-sky-50'
                            }`}
                          >
                            {day.isWeekend ? (weekendSelected ? 'Working' : 'Off') : 'Work'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] overflow-hidden" style={{ background: '#f8fbff', border: '1px solid #dbeafe' }}>
                <div className="px-5 py-5 md:px-6 border-b border-sky-100 bg-white">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)' }}>
                        <ClipboardList size={18} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[16px] font-black text-slate-800">Contact Assignment Sheet</p>
                        <p className="text-[13px] text-slate-500 font-medium mt-1">
                          Enter the number of contacts for each telemarketing user. Saving will auto-assign unique contacts only once.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
                      <div className="rounded-2xl px-4 py-3 bg-slate-50 border border-slate-200 min-w-[120px]">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Users</p>
                        <p className="text-[22px] font-black text-slate-800 mt-1">{assignedUserCount}/{users.length}</p>
                      </div>
                      <div className="rounded-2xl px-4 py-3 bg-slate-50 border border-slate-200 min-w-[120px]">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Monthly target</p>
                        <p className="text-[22px] font-black text-slate-800 mt-1">{totalMonthlyCalls}</p>
                      </div>
                      <div className="rounded-2xl px-4 py-3 bg-slate-50 border border-slate-200 min-w-[120px]">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Daily Avg</p>
                        <p className="text-[22px] font-black text-slate-800 mt-1">{averageDailyCalls}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[minmax(260px,1fr)_220px_auto_auto] gap-3 mt-5">
                    <div className="relative">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        className={`${inputCls} pl-10`}
                        value={assignmentSearch}
                        onChange={(e) => setAssignmentSearch(e.target.value)}
                        placeholder="Search telemarketing users by name, email, or username"
                      />
                    </div>
                    <input
                      className={inputCls}
                      type="number"
                      min={0}
                      value={quickFillCount}
                      onChange={(e) => setQuickFillCount(e.target.value)}
                      placeholder="Same count for all"
                    />
                    <button
                      type="button"
                      onClick={handleQuickFill}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13px] font-black text-white"
                      style={{ background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', boxShadow: '0 8px 18px rgba(37,99,235,0.16)' }}
                    >
                      <Wand2 size={15} />
                      Fill Sheet
                    </button>
                    <button
                      type="button"
                      onClick={handleClearTargets}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13px] font-black text-slate-700 bg-white border border-slate-200"
                    >
                      <RotateCcw size={15} />
                      Clear
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[860px] border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-400 w-[70px]">No.</th>
                        <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Telemarketing User</th>
                        <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Email</th>
                        <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-400 w-[210px]">Contacts To Assign</th>
                        <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-400 w-[160px]">Estimated Daily</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-10 text-center">
                            <Users size={24} className="mx-auto text-slate-300" />
                            <p className="text-[14px] font-black text-slate-600 mt-3">No telemarketing users found</p>
                            <p className="text-[12px] text-slate-400 font-medium mt-1">Add active users with telemarketing in their designation or department.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user, index) => {
                          const rawMonthlyTarget = targets[user.id];
                          const monthlyTarget = Number.isFinite(rawMonthlyTarget) ? rawMonthlyTarget : 0;
                          const monthlyTargetValue = Number.isFinite(rawMonthlyTarget) && rawMonthlyTarget > 0 ? String(rawMonthlyTarget) : '';
                          return (
                            <tr key={user.id} className="hover:bg-sky-50/40 transition-colors duration-150">
                              <td className="px-5 py-4 align-middle">
                                <span className="inline-flex w-9 h-9 items-center justify-center rounded-xl text-[13px] font-black text-sky-700 bg-sky-50 border border-sky-100">
                                  {index + 1}
                                </span>
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <p className="text-[15px] font-black text-slate-800">{getDisplayName(user)}</p>
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <p className="text-[13px] font-semibold text-slate-600">{user.email}</p>
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <input
                                  className={`${inputCls} py-3 text-[15px] font-black bg-white`}
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  value={monthlyTargetValue}
                                  onChange={(e) => handleTargetChange(user.id, e.target.value)}
                                  aria-label={`Contacts to assign to ${getDisplayName(user)}`}
                                />
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <span className="inline-flex min-w-[88px] justify-center rounded-xl px-3 py-2 text-[13px] font-black text-teal-700 bg-teal-50 border border-teal-100">
                                  {monthlyTarget > 0 && workingDayCount > 0 ? Math.ceil(monthlyTarget / workingDayCount) : 0} / day
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="sticky bottom-0 px-5 py-4 bg-white/95 backdrop-blur border-t border-slate-200">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-[13px] font-black text-slate-800">
                        {totalMonthlyCalls} contacts ready to auto-assign across {assignedUserCount} users
                      </p>
                      <p className="text-[12px] text-slate-500 font-medium mt-1">
                        The backend will split these into {workingDayCount} working-day call queues for {MONTHS[month - 1]?.label} {year}.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {selectedPlannerId ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/activity-planner/assignments/${selectedPlannerId}`)}
                          className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-[14px] font-black text-slate-700 bg-slate-100 border border-slate-200"
                        >
                          View Assigned Contacts
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={handleSaveAdminPlanner}
                        disabled={saving || totalMonthlyCalls === 0}
                        className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-[14px] font-black text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg,#0ea5e9,#0f766e)', boxShadow: '0 8px 20px rgba(14,116,144,0.18)' }}
                      >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        {saving ? 'Saving Planner...' : selectedPlannerId ? 'Update And Auto Assign' : 'Save And Auto Assign'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPlanner?.member_plans?.length ? (
                <div className="rounded-[28px] overflow-hidden bg-white" style={{ border: '1px solid #dbeafe' }}>
                  <div className="px-5 py-5 md:px-6 border-b border-sky-100 bg-[linear-gradient(135deg,#ffffff,#eff6ff,#f0fdfa)]">
                    <p className="text-[12px] font-black uppercase tracking-[0.16em] text-sky-600">Admin Contact Visibility</p>
                    <h3 className="text-[20px] font-black text-slate-800 mt-1">Monthly, weekly and daily assigned contacts</h3>
                    <p className="text-[13px] text-slate-500 font-medium mt-1">
                      Click a user to see assigned contacts in the monthly view, weekly view, and daily view.
                    </p>
                  </div>

                  <div className="p-5 md:p-6 space-y-5">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {selectedPlanner.member_plans.map((member) => {
                        const totalAssigned = member.call_assignments?.length || 0;
                        const totalDone = member.call_assignments?.filter((assignment) => assignment.status === 'contacted').length || 0;
                        return (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => {
                              setSelectedAdminMemberId(member.id);
                              setAdminPlanView('monthly');
                            }}
                            className={`rounded-[22px] px-5 py-5 text-left border transition-all duration-200 ${
                              selectedAdminMemberId === member.id
                                ? 'bg-sky-50 border-sky-300 shadow-[0_10px_24px_rgba(14,116,144,0.10)]'
                                : 'bg-slate-50 border-slate-200 hover:border-sky-200 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div>
                                <p className="text-[17px] font-black text-slate-800">{member.member_name}</p>
                                <p className="text-[12px] text-slate-500 font-medium mt-1">{member.workspace_name}</p>
                              </div>
                              <span className="px-3 py-1 rounded-full text-[11px] font-black" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                                {selectedAdminMemberId === member.id ? 'Opened' : 'Click to open'}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mt-4">
                              <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Monthly</p>
                                <p className="text-[18px] font-black text-slate-800 mt-1">{totalAssigned}</p>
                              </div>
                              <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Done</p>
                                <p className="text-[18px] font-black text-emerald-700 mt-1">{totalDone}</p>
                              </div>
                              <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Pending</p>
                                <p className="text-[18px] font-black text-amber-600 mt-1">{Math.max(totalAssigned - totalDone, 0)}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {selectedAdminMemberPlan ? (
                      <div className="space-y-5">
                        <div className="rounded-[24px] p-5 bg-white border border-slate-200">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-sky-600">Plan View</p>
                              <h4 className="text-[20px] font-black text-slate-800 mt-1">{selectedAdminMemberPlan.member_name}</h4>
                              <p className="text-[13px] text-slate-500 font-medium mt-1">
                                Monthly view opens by default. Use the buttons to switch to weekly or daily assigned contacts.
                              </p>
                            </div>

                            <div className="inline-flex items-center gap-2 p-1 rounded-2xl bg-slate-50 border border-slate-200">
                              {[
                                { key: 'monthly', label: 'Monthly' },
                                { key: 'weekly', label: 'Weekly' },
                                { key: 'daily', label: 'Daily' },
                              ].map((item) => (
                                <button
                                  key={item.key}
                                  type="button"
                                  onClick={() => setAdminPlanView(item.key as 'monthly' | 'weekly' | 'daily')}
                                  className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all duration-200 ${
                                    adminPlanView === item.key ? 'text-white' : 'text-slate-600'
                                  }`}
                                  style={
                                    adminPlanView === item.key
                                      ? { background: 'linear-gradient(135deg,#0ea5e9,#0f766e)' }
                                      : {}
                                  }
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div
                            className="rounded-[22px] p-5 mt-5"
                            style={{ background: 'linear-gradient(135deg,#082f49,#0f766e,#2563eb)', boxShadow: '0 12px 28px rgba(14,116,144,0.18)' }}
                          >
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div>
                                <p className="text-[12px] font-black uppercase tracking-[0.16em] text-cyan-100">Admin Notification</p>
                                <p className="text-[20px] font-black text-white mt-2">
                                  {selectedAdminMemberPlan.member_name} has completed {selectedAdminDoneCount} calls and has {selectedAdminPendingCount} pending.
                                </p>
                                <p className="text-[13px] text-blue-50/90 font-medium mt-2">
                                  Skipped calls: {selectedAdminSkippedCount}. Total assigned this month: {selectedAdminMemberPlan.call_assignments?.length || 0}.
                                </p>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-0">
                                <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.16)' }}>
                                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-100/80">Assigned</p>
                                  <p className="text-[22px] font-black text-white mt-1">{selectedAdminMemberPlan.call_assignments?.length || 0}</p>
                                </div>
                                <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.16)' }}>
                                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-100/80">Done</p>
                                  <p className="text-[22px] font-black text-emerald-200 mt-1">{selectedAdminDoneCount}</p>
                                </div>
                                <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.16)' }}>
                                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-100/80">Pending</p>
                                  <p className="text-[22px] font-black text-amber-200 mt-1">{selectedAdminPendingCount}</p>
                                </div>
                                <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.16)' }}>
                                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-100/80">Skipped</p>
                                  <p className="text-[22px] font-black text-orange-200 mt-1">{selectedAdminSkippedCount}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {adminPlanView === 'monthly' ? (
                            <div className="rounded-[24px] p-5 mt-5 bg-[linear-gradient(145deg,#f8fbff,#f0fdfa)] border border-sky-100">
                              <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div>
                                  <p className="text-[12px] font-black uppercase tracking-[0.16em] text-sky-600">Monthly View</p>
                                  <p className="text-[13px] text-slate-500 font-medium mt-1">
                                    All contacts assigned to this user for {MONTHS[selectedPlanner.month - 1]?.label} {selectedPlanner.year}.
                                  </p>
                                </div>
                                <span className="px-3 py-1.5 rounded-full text-[11px] font-black" style={{ background: '#ecfeff', color: '#0f766e', border: '1px solid #99f6e4' }}>
                                  {selectedAdminMemberPlan.call_assignments?.length || 0} assigned this month
                                </span>
                              </div>

                              {!selectedAdminMemberPlan.call_assignments?.length ? (
                                <div className="rounded-2xl px-4 py-6 mt-4 text-center bg-white border border-slate-200 text-slate-400">
                                  No monthly assigned contacts yet.
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
                                  {selectedAdminMemberPlan.call_assignments.map((assignment) => (
                                    <div key={`monthly-${assignment.id}`} className="rounded-2xl px-4 py-4 bg-white border border-slate-200">
                                      <p className="text-[15px] font-black text-slate-800">
                                        {assignment.contact_detail?.person_name || assignment.contact_detail?.company_name || 'Contact'}
                                      </p>
                                      <p className="text-[12px] text-slate-500 font-medium mt-1">
                                        {assignment.contact_detail?.company_name || 'Company not available'}
                                      </p>
                                      <div className="flex items-center justify-between gap-3 mt-3">
                                        <span className="text-[12px] font-black text-sky-700">{assignment.scheduled_date}</span>
                                        <span
                                          className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase"
                                          style={getAssignmentStatusStyle(assignment.status)}
                                        >
                                          {assignment.status}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : null}

                          {adminPlanView === 'weekly' ? (
                            <div className="rounded-[24px] p-5 mt-5 bg-white border border-slate-200">
                              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-sky-600">Weekly View</p>
                              <p className="text-[13px] text-slate-500 font-medium mt-1">
                                Each week shows only that week&apos;s assigned calls for this person.
                              </p>
                              <div className="space-y-4 mt-4">
                                {selectedAdminWeeklyTasks.map((task) => (
                                  <div key={`weekly-${task.id}`} className="rounded-[22px] px-4 py-4 bg-slate-50 border border-slate-200">
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                      <div>
                                        <p className="text-[16px] font-black text-slate-800">Week {task.week_number}</p>
                                        <p className="text-[12px] text-slate-500 font-medium mt-1">{task.title}</p>
                                      </div>
                                      <span className="px-3 py-1 rounded-full text-[11px] font-black" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                                        {task.assigned_contacts_count || 0} contacts
                                      </span>
                                    </div>

                                    {!task.assignments?.length ? (
                                      <div className="rounded-xl px-3 py-5 mt-3 text-center bg-white border border-slate-200 text-[13px] font-semibold text-slate-400">
                                        No contacts assigned in this week.
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
                                        {task.assignments.map((assignment) => (
                                          <div key={`weekly-assignment-${assignment.id}`} className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                                            <p className="text-[14px] font-black text-slate-800">
                                              {assignment.contact_detail?.person_name || assignment.contact_detail?.company_name || 'Contact'}
                                            </p>
                                            <p className="text-[12px] text-slate-500 font-medium mt-1">{assignment.scheduled_date}</p>
                                            <span
                                              className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-black uppercase mt-2"
                                              style={getAssignmentStatusStyle(assignment.status)}
                                            >
                                              {assignment.status}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          {adminPlanView === 'daily' ? (
                            <div className="rounded-[24px] p-5 mt-5 bg-white border border-slate-200">
                              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-sky-600">Daily View</p>
                              <p className="text-[13px] text-slate-500 font-medium mt-1">
                                Daily cards show only that day&apos;s assigned contacts for this person.
                              </p>
                              <div className="space-y-4 mt-4">
                                {selectedAdminDailyTasks.map((task) => (
                                  <div key={`daily-${task.id}`} className="rounded-[22px] px-4 py-4 bg-slate-50 border border-slate-200">
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                      <div>
                                        <p className="text-[16px] font-black text-slate-800">{task.task_date || 'Scheduled Day'}</p>
                                        <p className="text-[12px] text-slate-500 font-medium mt-1">{task.title}</p>
                                      </div>
                                      <span className="px-3 py-1 rounded-full text-[11px] font-black" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                                        {task.assigned_contacts_count || 0} contacts
                                      </span>
                                    </div>

                                    {!task.assignments?.length ? (
                                      <div className="rounded-xl px-3 py-5 mt-3 text-center bg-white border border-slate-200 text-[13px] font-semibold text-slate-400">
                                        No contacts assigned for this day.
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
                                        {task.assignments.map((assignment) => (
                                          <div key={`daily-assignment-${assignment.id}`} className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                                            <p className="text-[14px] font-black text-slate-800">
                                              {assignment.contact_detail?.person_name || assignment.contact_detail?.company_name || 'Contact'}
                                            </p>
                                            <p className="text-[12px] text-slate-500 font-medium mt-1">
                                              {assignment.contact_detail?.company_name || assignment.contact_detail?.phone || 'Contact details available'}
                                            </p>
                                            <span
                                              className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-black uppercase mt-2"
                                              style={getAssignmentStatusStyle(assignment.status)}
                                            >
                                              {assignment.status}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-6 mt-6 items-start">
          <aside className="space-y-4">
            <div className="bg-white rounded-[28px] p-5 border border-sky-100" style={{ boxShadow: '0 8px 26px rgba(14,116,144,0.08)' }}>
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-slate-400">Today&apos;s Flow</p>
              <div className="space-y-3 mt-4">
                {[
                  'Only your assigned contacts are shown here.',
                  'After you add a remark, the next contact opens automatically.',
                  'Other users will not see contacts assigned to you.',
                ].map((rule, index) => (
                  <div key={rule} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[12px] font-black text-sky-700 shrink-0" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                      {index + 1}
                    </div>
                    <p className="text-[13px] text-slate-600 font-medium leading-6">{rule}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 border border-sky-100" style={{ boxShadow: '0 8px 26px rgba(14,116,144,0.08)' }}>
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-slate-400">Today Only</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-2xl px-4 py-4 bg-slate-50 border border-slate-200">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Completed</p>
                  <p className="text-[24px] font-black text-slate-800 mt-1">{queue?.today_done ?? 0}</p>
                </div>
                <div className="rounded-2xl px-4 py-4 bg-slate-50 border border-slate-200">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Remaining</p>
                  <p className="text-[24px] font-black text-slate-800 mt-1">{queue?.today_remaining ?? 0}</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="bg-white rounded-[30px] overflow-hidden" style={{ border: '1.5px solid #dbeafe', boxShadow: '0 18px 50px rgba(15,23,42,0.08)' }}>
            <div className="px-7 py-6 border-b border-slate-100 bg-[linear-gradient(135deg,#ffffff,#eff6ff,#f0fdfa)]">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.16em] text-sky-600">
                    {userView === 'queue' ? 'Next Contact' : 'Contacted List'}
                  </p>
                  <h2 className="text-[22px] font-black text-slate-800 mt-1">
                    {userView === 'queue' ? 'Call one contact at a time' : 'Contacts you have already called'}
                  </h2>
                  <p className="text-[13px] text-slate-500 font-medium mt-1">
                    {userView === 'queue'
                      ? 'You only see the current contact. Submit the remark after the call to open the next one.'
                      : 'This list shows all contacts you marked verified, even after all pending contacts are completed.'}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 p-1 rounded-2xl bg-white border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setUserView('queue')}
                    className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all duration-200 ${
                      userView === 'queue' ? 'text-white' : 'text-slate-600'
                    }`}
                    style={userView === 'queue' ? { background: 'linear-gradient(135deg,#0ea5e9,#0f766e)' } : {}}
                  >
                    Queue
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserView('contacted')}
                    className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all duration-200 ${
                      userView === 'contacted' ? 'text-white' : 'text-slate-600'
                    }`}
                    style={userView === 'contacted' ? { background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' } : {}}
                  >
                    Contacted
                  </button>
                </div>
              </div>
            </div>

            <div className="p-7">
              {userView === 'contacted' ? (
                !queue?.contacted_history?.length ? (
                  <div className="rounded-[24px] px-5 py-10 text-center bg-slate-50 border border-slate-200">
                    <Shield size={30} className="mx-auto text-slate-300" />
                    <p className="text-[18px] font-black text-slate-700 mt-4">No contacted history yet</p>
                    <p className="text-[13px] text-slate-500 font-medium mt-2">
                      After you verify calls, they will appear here in the contacted list.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {queue.contacted_history.map((assignment: PlannerCallAssignment) => (
                      <article
                        key={assignment.id}
                        className="rounded-[24px] px-5 py-5 bg-slate-50 border border-slate-200"
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <p className="text-[17px] font-black text-slate-800">
                              {assignment.contact_detail?.person_name || assignment.contact_detail?.company_name || 'Contact'}
                            </p>
                            <p className="text-[12px] text-slate-500 font-medium mt-1">
                              {assignment.contact_detail?.company_name || 'Company not available'}
                            </p>
                          </div>
                          <span className="px-3 py-1.5 rounded-full text-[11px] font-black" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                            Verified
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                          <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Phone</p>
                            <p className="text-[13px] font-black text-slate-800 mt-1">{assignment.contact_detail?.phone || 'Not available'}</p>
                          </div>
                          <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Region</p>
                            <p className="text-[13px] font-black text-slate-800 mt-1">{assignment.contact_detail?.region || 'Not available'}</p>
                          </div>
                          <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Scheduled Date</p>
                            <p className="text-[13px] font-black text-slate-800 mt-1">{assignment.scheduled_date}</p>
                          </div>
                          <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Completed At</p>
                            <p className="text-[13px] font-black text-slate-800 mt-1">
                              {assignment.contacted_at
                                ? new Date(assignment.contacted_at).toLocaleString([], {
                                    year: 'numeric',
                                    month: 'short',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'Saved'}
                            </p>
                          </div>
                        </div>

                        {assignment.remarks ? (
                          <div className="rounded-xl px-3 py-3 mt-3 bg-white border border-slate-200">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Remark</p>
                            <p className="text-[13px] text-slate-700 font-medium mt-1">{assignment.remarks}</p>
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                )
              ) : !queue?.next_assignment ? (
                <div className="rounded-[24px] px-5 py-10 text-center bg-slate-50 border border-slate-200">
                  <CalendarDays size={30} className="mx-auto text-slate-300" />
                  <p className="text-[18px] font-black text-slate-700 mt-4">No pending contact right now</p>
                  <p className="text-[13px] text-slate-500 font-medium mt-2">
                    Your next call will appear here when a daily assignment is available.
                  </p>
                  <button
                    type="button"
                    onClick={() => setUserView('contacted')}
                    className="inline-flex items-center justify-center gap-2 mt-5 px-5 py-3 rounded-xl text-[14px] font-black text-white"
                    style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', boxShadow: '0 8px 20px rgba(37,99,235,0.18)' }}
                  >
                    Contacted
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-[26px] p-5" style={{ background: 'linear-gradient(145deg,#f8fbff,#f0fdfa)', border: '1px solid #dbeafe' }}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-slate-400">Assigned For</p>
                        <p className="text-[18px] font-black text-slate-800 mt-2">
                          {queue.next_assignment.contact_detail?.person_name || queue.next_assignment.contact_detail?.company_name || 'Contact'}
                        </p>
                        <p className="text-[13px] text-slate-500 font-medium mt-1">
                          {queue.next_assignment.contact_detail?.designation || 'Contact to be called now'}
                        </p>
                      </div>
                      <span className="px-3 py-1.5 rounded-full text-[11px] font-black" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}>
                        {queue.next_assignment.scheduled_date}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                      <div className="rounded-2xl px-4 py-4 bg-white border border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Company</p>
                        <p className="text-[15px] font-black text-slate-800 mt-2">{queue.next_assignment.contact_detail?.company_name || 'Not available'}</p>
                      </div>
                      <div className="rounded-2xl px-4 py-4 bg-white border border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Phone</p>
                        <a href={`tel:${queue.next_assignment.contact_detail?.phone || ''}`} className="inline-flex items-center gap-2 text-[15px] font-black text-sky-700 mt-2">
                          <Phone size={14} />
                          {queue.next_assignment.contact_detail?.phone || 'Not available'}
                        </a>
                      </div>
                      <div className="rounded-2xl px-4 py-4 bg-white border border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Region</p>
                        <p className="text-[15px] font-black text-slate-800 mt-2">{queue.next_assignment.contact_detail?.region || 'Not available'}</p>
                      </div>
                      <div className="rounded-2xl px-4 py-4 bg-white border border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Location</p>
                        <p className="text-[15px] font-black text-slate-800 mt-2">{queue.next_assignment.contact_detail?.location || 'Not available'}</p>
                      </div>
                    </div>
                  </div>

                    <div className="rounded-[26px] p-5 bg-white border border-slate-200">
                      <label className="block text-[12px] font-black text-slate-500 uppercase tracking-[0.16em] mb-2">Call Remark</label>
                      <textarea
                        className={`${inputCls} min-h-[140px] resize-none`}
                      placeholder="Add the call remark here. Example: spoke with the customer, asked to call back next week, not interested, wrong number..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />

                    <div className="flex items-center gap-3 flex-wrap mt-5">
                      <button
                        type="button"
                        onClick={() => submitRemark('contacted')}
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[14px] font-black text-white disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg,#0ea5e9,#0f766e)', boxShadow: '0 8px 20px rgba(14,116,144,0.18)' }}
                      >
                        {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                        Mark Verified
                      </button>

                      <button
                        type="button"
                        onClick={() => submitRemark('skipped')}
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[14px] font-black text-slate-700 bg-slate-100 border border-slate-200 disabled:opacity-60"
                      >
                        Skip For Now
                      </button>
                    </div>
                    </div>

                  <div className="rounded-[26px] p-5 bg-white border border-slate-200">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-slate-400">Today&apos;s Contacted List</p>
                        <p className="text-[13px] text-slate-500 font-medium mt-1">
                          Verified contacts completed by you today: {queue.contacted_today.length}
                        </p>
                      </div>
                      <span className="px-3 py-1.5 rounded-full text-[11px] font-black" style={{ background: '#ecfeff', color: '#0f766e', border: '1px solid #99f6e4' }}>
                        {queue.today_done} calls done
                      </span>
                    </div>

                    {queue.contacted_today.length === 0 ? (
                      <div className="rounded-2xl px-4 py-8 mt-4 text-center bg-slate-50 border border-slate-200">
                        <Shield size={24} className="mx-auto text-slate-300" />
                        <p className="text-[14px] font-black text-slate-500 mt-3">No verified contacts yet today</p>
                        <p className="text-[12px] text-slate-400 font-medium mt-1">
                          Once you verify a call, it will appear in this list.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 mt-4">
                        {queue.contacted_today.map((assignment: PlannerCallAssignment) => (
                          <article
                            key={assignment.id}
                            className="rounded-2xl px-4 py-4 bg-slate-50 border border-slate-200"
                          >
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div>
                                <p className="text-[15px] font-black text-slate-800">
                                  {assignment.contact_detail?.person_name || assignment.contact_detail?.company_name || 'Contact'}
                                </p>
                                <p className="text-[12px] text-slate-500 font-medium mt-1">
                                  {assignment.contact_detail?.company_name || 'Company not available'}
                                </p>
                              </div>
                              <span className="px-3 py-1 rounded-full text-[11px] font-black" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                                Verified
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                              <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Phone</p>
                                <p className="text-[13px] font-black text-slate-800 mt-1">{assignment.contact_detail?.phone || 'Not available'}</p>
                              </div>
                              <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Region</p>
                                <p className="text-[13px] font-black text-slate-800 mt-1">{assignment.contact_detail?.region || 'Not available'}</p>
                              </div>
                              <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Completed At</p>
                                <p className="text-[13px] font-black text-slate-800 mt-1">
                                  {assignment.contacted_at ? new Date(assignment.contacted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Saved'}
                                </p>
                              </div>
                            </div>

                            {assignment.remarks ? (
                              <div className="rounded-xl px-3 py-3 mt-3 bg-white border border-slate-200">
                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Remark</p>
                                <p className="text-[13px] text-slate-700 font-medium mt-1">{assignment.remarks}</p>
                              </div>
                            ) : null}
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
      {nextContactPopup ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl border border-sky-100">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-100 text-emerald-700"><CheckCircle2 size={24} /></div>
            <p className="mt-5 text-[12px] font-black uppercase tracking-[0.16em] text-emerald-600">Verified and sent to admin</p>
            <h2 className="mt-2 text-[23px] font-black text-slate-800">Next contact is ready</h2>
            <p className="mt-2 text-[14px] font-semibold text-slate-600">{nextContactPopup.contact_detail?.person_name || nextContactPopup.contact_detail?.company_name || 'Assigned contact'}</p>
            <p className="mt-1 text-[13px] text-slate-500">{nextContactPopup.contact_detail?.company_name || 'Company not available'}</p>
            <a href={`tel:${nextContactPopup.contact_detail?.phone || ''}`} className="mt-5 flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-3 text-[15px] font-black text-sky-700 border border-sky-100"><Phone size={16} /> {nextContactPopup.contact_detail?.phone || 'Phone not available'}</a>
            <button type="button" onClick={() => setNextContactPopup(null)} className="mt-5 w-full rounded-xl px-5 py-3 text-[14px] font-black text-white" style={{ background: 'linear-gradient(135deg,#0ea5e9,#0f766e)' }}>Open next contact</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ActivityPlannerPage;
