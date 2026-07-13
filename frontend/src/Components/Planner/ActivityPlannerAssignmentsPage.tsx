import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Building2, CheckCircle2, Loader2, RefreshCcw, ShieldCheck, Users } from 'lucide-react';
import { authStore } from '../Utils/auth';

type AdminOverviewMember = {
  member_plan_id: number;
  user_id: number | null;
  member_name: string;
  workspace_name: string;
  monthly_calls_target: number;
  assigned_contacts: number;
  contacted_contacts: number;
  today_assigned: number;
  today_done: number;
  today_pending: number;
  next_scheduled_date: string | null;
  contacted_history: Array<{
    assignment_id: number;
    contact_id: number;
    person_name: string;
    company_name: string;
    phone: string;
    region: string;
    scheduled_date: string;
    contacted_at: string | null;
    remarks: string;
  }>;
  assignments: Array<{
    assignment_id: number;
    contact_id: number;
    person_name: string;
    company_name: string;
    phone: string;
    region: string;
    scheduled_date: string;
    status: 'pending' | 'contacted' | 'skipped';
    contacted_at: string | null;
    remarks: string;
    is_verified: boolean;
  }>;
};

type AdminOverview = {
  planner_id: number;
  planner_name: string;
  month: number;
  year: number;
  available_contacts: number;
  members: AdminOverviewMember[];
};

type PlannerOption = {
  id: number;
  name: string;
  month: number;
  year: number;
};

const PLANNERS_URL = '/api/activity-planners/';

const MONTHS = Array.from({ length: 12 }, (_, index) => ({
  value: index + 1,
  label: new Date(2000, index, 1).toLocaleString('en', { month: 'long' }),
}));

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

export function ActivityPlannerAssignmentsPage() {
  const currentUser = useMemo(() => authStore.getUser(), []);
  const navigate = useNavigate();
  const { plannerId } = useParams();

  const [forceLogin, setForceLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [planners, setPlanners] = useState<PlannerOption[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all');
  const [showContactedList, setShowContactedList] = useState(false);
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);

  if (forceLogin || !authStore.getToken() || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/activity-planner" replace />;
  }

  const load = async (targetPlannerId?: string, options?: { silent?: boolean }) => {
    const silent = options?.silent === true;
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
      setError('');
    }
    try {
      const plannersRes = await authStore.fetchWithAuth(PLANNERS_URL);
      const plannersData = await plannersRes.json().catch(() => null);
      if (!plannersRes.ok) throw new Error(extractErrorMessage(plannersData, 'Failed to load planners.'));
      const plannerList = Array.isArray(plannersData) ? plannersData : [];
      setPlanners(plannerList);

      const requestedPlanner = plannerList.find((planner) => String(planner.id) === String(targetPlannerId || ''));
      const resolvedPlannerId = requestedPlanner
        ? String(requestedPlanner.id)
        : (plannerList[0] ? String(plannerList[0].id) : '');
      if (!resolvedPlannerId) {
        setOverview(null);
        return;
      }

      if (String(targetPlannerId || '') !== resolvedPlannerId && plannerList[0]) {
        navigate(`/activity-planner/assignments/${resolvedPlannerId}`, { replace: true });
      }

      const overviewRes = await authStore.fetchWithAuth(`${PLANNERS_URL}${resolvedPlannerId}/assignment_overview/`);
      const overviewData = await overviewRes.json().catch(() => null);
      if (!overviewRes.ok) throw new Error(extractErrorMessage(overviewData, 'Failed to load assignment overview.'));
      setOverview(overviewData);
    } catch (err: any) {
      if ((err.message || '').includes('Session expired')) {
        setForceLogin(true);
      }
      if (!silent) {
        setOverview(null);
      }
      setError(err.message || 'Failed to load assigned contacts page.');
    } finally {
      if (silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void load(plannerId);
  }, [plannerId]);

  useEffect(() => {
    if (!plannerId) return;
    const intervalId = window.setInterval(() => {
      void load(plannerId, { silent: true });
    }, 10000);
    return () => window.clearInterval(intervalId);
  }, [plannerId]);

  const totalCallsDone = overview?.members.reduce((sum, member) => sum + member.contacted_contacts, 0) ?? 0;
  const totalTasksAssigned = overview?.members.reduce((sum, member) => sum + member.assignments.length, 0) ?? 0;
  const filteredMembers = useMemo(() => {
    if (!overview) return [];
    if (selectedMemberId === 'all') return overview.members;
    return overview.members.filter((member) => String(member.member_plan_id) === selectedMemberId);
  }, [overview, selectedMemberId]);
  const totalContactedHistory = filteredMembers.reduce((sum, member) => sum + member.contacted_history.length, 0);
  const contactedListTitle =
    selectedMemberId === 'all'
      ? 'Contacted list user-wise'
      : `${filteredMembers[0]?.member_name || 'Selected user'} contacted list`;

  useEffect(() => {
    if (!overview?.members.length) {
      setSelectedMemberId('all');
      setExpandedMemberId(null);
      return;
    }

    if (
      selectedMemberId !== 'all' &&
      !overview.members.some((member) => String(member.member_plan_id) === selectedMemberId)
    ) {
      setSelectedMemberId('all');
    }

    if (
      expandedMemberId &&
      !overview.members.some((member) => String(member.member_plan_id) === expandedMemberId)
    ) {
      setExpandedMemberId(null);
    }
  }, [expandedMemberId, overview, selectedMemberId]);

  useEffect(() => {
    if (selectedMemberId === 'all') {
      setExpandedMemberId(null);
      return;
    }
    setExpandedMemberId(selectedMemberId);
  }, [selectedMemberId]);

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: 'linear-gradient(145deg,#f8fbff 0%,#eef7ff 48%,#f7fcfb 100%)' }}
    >
      <div className="shrink-0 px-6 pt-5">
        <div
          className="rounded-[30px] overflow-hidden"
          style={{
            background: 'linear-gradient(125deg,#082f49 0%,#0f766e 42%,#2563eb 100%)',
            boxShadow: '0 16px 48px -6px rgba(14,116,144,0.35), 0 2px 10px rgba(0,0,0,0.12)',
          }}
        >
          <div className="px-8 py-8 flex items-center gap-5 flex-wrap">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.24)' }}
            >
              <Users className="text-white" size={28} />
            </div>

            <div className="flex-1 min-w-0">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-[0.16em]"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#dbeafe', border: '1px solid rgba(255,255,255,0.16)' }}
              >
                <ShieldCheck size={12} />
                Admin Assigned Contacts
              </div>
              <h1 className="text-[30px] font-black text-white leading-tight tracking-tight mt-3">Assigned Contact Details</h1>
              <p className="text-[14px] text-blue-50/90 mt-2 max-w-3xl font-medium">
                Full admin access to every assigned user, their call targets, assigned contacts, live status, and completed call updates.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void load(plannerId)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-[13px] font-black text-white"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <RefreshCcw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/activity-planner')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-[13px] font-black text-white"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              Back To Setup
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {error ? (
          <div className="rounded-2xl px-5 py-4 text-rose-700 font-semibold bg-rose-50 border border-rose-200">
            {error}
          </div>
        ) : null}

        <div className="mt-6 bg-white rounded-[28px] overflow-hidden" style={{ border: '1.5px solid #dbeafe', boxShadow: '0 18px 50px rgba(15,23,42,0.08)' }}>
          <div className="px-6 py-5 border-b border-slate-100 bg-[linear-gradient(135deg,#ffffff,#eff6ff)] flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-sky-600">Planner Overview</p>
              <h2 className="text-[22px] font-black text-slate-800 mt-1">
                {overview ? `${overview.planner_name} - ${MONTHS[overview.month - 1]?.label} ${overview.year}` : 'Assigned Contacts'}
              </h2>
            </div>

            <div className="w-full max-w-sm">
              <select
                className="w-full px-3.5 py-3 text-[14px] text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-400"
                value={plannerId || ''}
                onChange={(e) => navigate(`/activity-planner/assignments/${e.target.value}`)}
              >
                {planners.map((planner) => (
                  <option key={planner.id} value={planner.id}>
                    {planner.name} - {MONTHS[planner.month - 1]?.label} {planner.year}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full max-w-sm">
              <select
                className="w-full px-3.5 py-3 text-[14px] text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-400"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
              >
                <option value="all">All users</option>
                {overview?.members.map((member) => (
                  <option key={member.member_plan_id} value={member.member_plan_id}>
                    {member.member_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-slate-400">
                <Loader2 size={24} className="animate-spin text-sky-500" />
                <span className="text-[15px] font-semibold">Loading assigned contacts...</span>
              </div>
            ) : !overview ? (
              <div className="rounded-2xl px-4 py-8 text-center text-slate-400 bg-slate-50 border border-slate-200">
                No planner data found.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl px-4 py-4 bg-slate-50 border border-slate-200">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Available Contacts</p>
                    <p className="text-[26px] font-black text-slate-800 mt-2">{overview.available_contacts}</p>
                  </div>
                  <div className="rounded-2xl px-4 py-4 bg-slate-50 border border-slate-200">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Assigned Members</p>
                    <p className="text-[26px] font-black text-slate-800 mt-2">{overview.members.length}</p>
                  </div>
                  <div className="rounded-2xl px-4 py-4 bg-slate-50 border border-slate-200">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Assigned Calls</p>
                    <p className="text-[26px] font-black text-slate-800 mt-2">
                      {overview.members.reduce((sum, item) => sum + item.assigned_contacts, 0)}
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] px-5 py-5 bg-[linear-gradient(135deg,#ffffff,#f8fbff,#f0fdfa)] border border-sky-100">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-[12px] font-black uppercase tracking-[0.16em] text-sky-600">Users Task Summary</p>
                      <h3 className="text-[22px] font-black text-slate-800 mt-1">Assigned tasks and calls done user-wise</h3>
                      <p className="text-[13px] text-slate-500 font-medium mt-1">
                        Click a user card to open only that user&apos;s assigned contacts. Contacts are kept unique per planner.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="rounded-2xl px-4 py-3 bg-white border border-slate-200 min-w-[140px]">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Total Tasks</p>
                        <p className="text-[22px] font-black text-slate-800 mt-1">{totalTasksAssigned}</p>
                      </div>
                      <div className="rounded-2xl px-4 py-3 bg-white border border-slate-200 min-w-[140px]">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Total Calls Done</p>
                        <p className="text-[22px] font-black text-emerald-700 mt-1">{totalCallsDone}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowContactedList((prev) => !prev)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-[13px] font-black text-white min-h-[70px]"
                        style={{ background: 'linear-gradient(135deg,#0ea5e9,#0f766e)', boxShadow: '0 8px 20px rgba(14,116,144,0.18)' }}
                      >
                        <CheckCircle2 size={15} />
                        {showContactedList ? 'Hide Contacted List' : `View Contacted List (${totalContactedHistory})`}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-5">
                    {filteredMembers.map((member) => {
                      const assignedTasks = member.assignments.length;
                      const completedTasks = member.contacted_contacts;
                      const remainingTasks = Math.max(assignedTasks - completedTasks, 0);
                      const completionPercent = assignedTasks > 0 ? Math.round((completedTasks / assignedTasks) * 100) : 0;

                      return (
                        <article
                          key={`summary-${member.member_plan_id}`}
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            setExpandedMemberId((prev) =>
                              prev === String(member.member_plan_id) ? null : String(member.member_plan_id)
                            )
                          }
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setExpandedMemberId((prev) =>
                                prev === String(member.member_plan_id) ? null : String(member.member_plan_id)
                              );
                            }
                          }}
                          className="rounded-[22px] px-5 py-5 bg-white border border-slate-200 cursor-pointer transition-all duration-200 hover:border-sky-300 hover:shadow-[0_10px_30px_rgba(14,116,144,0.08)] focus:outline-none focus:border-sky-400"
                        >
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <p className="text-[17px] font-black text-slate-800">{member.member_name}</p>
                              <p className="text-[12px] text-slate-500 font-medium mt-1">{member.workspace_name}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap justify-end">
                              <span
                                className="px-3 py-1.5 rounded-full text-[11px] font-black"
                                style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1' }}
                              >
                                {expandedMemberId === String(member.member_plan_id) ? 'Opened' : 'Click to view'}
                              </span>
                              <span
                                className="px-3 py-1.5 rounded-full text-[11px] font-black"
                                style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
                              >
                                {completionPercent}% done
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                            <div className="rounded-xl px-3 py-3 bg-slate-50 border border-slate-200">
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Assigned Tasks</p>
                              <p className="text-[18px] font-black text-slate-800 mt-1">{assignedTasks}</p>
                            </div>
                            <div className="rounded-xl px-3 py-3 bg-slate-50 border border-slate-200">
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Calls Done</p>
                              <p className="text-[18px] font-black text-emerald-700 mt-1">{completedTasks}</p>
                            </div>
                            <div className="rounded-xl px-3 py-3 bg-slate-50 border border-slate-200">
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Remaining</p>
                              <p className="text-[18px] font-black text-amber-600 mt-1">{remainingTasks}</p>
                            </div>
                            <div className="rounded-xl px-3 py-3 bg-slate-50 border border-slate-200">
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Today Done</p>
                              <p className="text-[18px] font-black text-slate-800 mt-1">{member.today_done}</p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Task Progress</p>
                              <p className="text-[12px] font-black text-slate-600">
                                {completedTasks} / {assignedTasks}
                              </p>
                            </div>
                            <div className="h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${completionPercent}%`,
                                  background: 'linear-gradient(135deg,#10b981,#0ea5e9)',
                                }}
                              />
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>

                {filteredMembers.length === 0 ? (
                  <div className="rounded-2xl px-4 py-8 text-center text-slate-400 bg-slate-50 border border-slate-200">
                    No user matches the selected filter.
                  </div>
                ) : null}

                {!showContactedList ? filteredMembers
                  .filter((member) => String(member.member_plan_id) === expandedMemberId)
                  .map((member) => (
                  <article key={member.member_plan_id} className="rounded-[24px] px-5 py-5 bg-slate-50 border border-slate-200">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-[17px] font-black text-slate-800">{member.member_name}</p>
                        <p className="text-[12px] text-slate-500 font-medium mt-1">{member.workspace_name}</p>
                      </div>
                      <span className="px-3 py-1.5 rounded-full text-[11px] font-black" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}>
                        Next: {member.next_scheduled_date || 'Completed'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">
                      <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Monthly Target</p>
                        <p className="text-[18px] font-black text-slate-800 mt-1">{member.monthly_calls_target}</p>
                      </div>
                      <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Assigned Contacts</p>
                        <p className="text-[18px] font-black text-slate-800 mt-1">{member.assigned_contacts}</p>
                      </div>
                      <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Completed</p>
                        <p className="text-[18px] font-black text-slate-800 mt-1">{member.contacted_contacts}</p>
                      </div>
                      <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Today Done</p>
                        <p className="text-[18px] font-black text-slate-800 mt-1">{member.today_done} / {member.today_assigned}</p>
                      </div>
                      <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Today Pending</p>
                        <p className="text-[18px] font-black text-slate-800 mt-1">{member.today_pending}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-[22px] px-4 py-4 bg-white border border-slate-200">
                      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                        <div>
                          <p className="text-[12px] font-black uppercase tracking-[0.16em] text-slate-500">Assigned Contact List</p>
                          <p className="text-[12px] text-slate-400 font-medium mt-1">
                            Live admin view of all assigned contacts and their current call status.
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[11px] font-black" style={{ background: '#ecfeff', color: '#0f766e', border: '1px solid #99f6e4' }}>
                          {member.contacted_contacts} completed
                        </span>
                      </div>

                      {member.assignments.length === 0 ? (
                        <div className="rounded-2xl px-4 py-6 text-center bg-slate-50 border border-slate-200">
                          No assigned contacts yet.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {member.assignments.map((assignment) => (
                            <article key={assignment.assignment_id} className="rounded-2xl px-4 py-4 bg-slate-50 border border-slate-200">
                              <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1px solid #bfdbfe' }}>
                                    <Building2 size={16} className="text-sky-700" />
                                  </div>
                                  <div>
                                    <p className="text-[15px] font-black text-slate-800">{assignment.person_name || 'Contact'}</p>
                                    <p className="text-[12px] text-slate-500 font-medium mt-1">{assignment.company_name || 'Company not available'}</p>
                                  </div>
                                </div>
                                <span
                                  className="px-3 py-1 rounded-full text-[11px] font-black"
                                  style={
                                    assignment.status === 'contacted'
                                      ? { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }
                                      : assignment.status === 'skipped'
                                        ? { background: '#fff7ed', color: '#c2410c', border: '1px solid #fdba74' }
                                        : { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }
                                  }
                                >
                                  {assignment.status === 'contacted' ? 'Completed' : assignment.status === 'skipped' ? 'Skipped' : 'Pending'}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">
                                <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Phone</p>
                                  <p className="text-[13px] font-black text-slate-800 mt-1">{assignment.phone || 'Not available'}</p>
                                </div>
                                <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Region</p>
                                  <p className="text-[13px] font-black text-slate-800 mt-1">{assignment.region || 'Not available'}</p>
                                </div>
                                <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Scheduled Date</p>
                                  <p className="text-[13px] font-black text-slate-800 mt-1">{assignment.scheduled_date}</p>
                                </div>
                                <div className="rounded-xl px-3 py-3 bg-white border border-slate-200">
                                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Verified</p>
                                  <p className="text-[13px] font-black text-slate-800 mt-1">{assignment.is_verified ? 'Yes' : 'No'}</p>
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
                                      : 'Not completed'}
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
                  </article>
                )) : null}

                {!showContactedList && filteredMembers.length > 0 && !expandedMemberId ? (
                  <div className="rounded-2xl px-4 py-8 text-center text-slate-400 bg-slate-50 border border-slate-200">
                    Click any user card above to view that user&apos;s assigned contacts.
                  </div>
                ) : null}

                {showContactedList ? (
                  <section className="rounded-[24px] px-5 py-5 bg-white border border-slate-200">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-sky-600">Calls Made</p>
                        <h3 className="text-[22px] font-black text-slate-800 mt-1">
                          {contactedListTitle}
                        </h3>
                        <p className="text-[13px] text-slate-500 font-medium mt-1">
                          These are only the contacts marked verified by the selected user after completing the call.
                        </p>
                      </div>
                      <span
                        className="px-3 py-1.5 rounded-full text-[11px] font-black"
                        style={{ background: '#ecfeff', color: '#0f766e', border: '1px solid #99f6e4' }}
                      >
                        {totalContactedHistory} calls made
                      </span>
                    </div>

                    {totalContactedHistory === 0 ? (
                      <div className="rounded-2xl px-4 py-8 mt-4 text-center bg-slate-50 border border-slate-200">
                        No completed calls are available yet.
                      </div>
                    ) : (
                      <div className="space-y-3 mt-4">
                        {filteredMembers.map((member) => (
                          <div key={`history-group-${member.member_plan_id}`} className="rounded-2xl px-4 py-4 bg-slate-50 border border-slate-200">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div>
                                <p className="text-[16px] font-black text-slate-800">{member.member_name}</p>
                                <p className="text-[12px] text-slate-500 font-medium mt-1">{member.workspace_name}</p>
                              </div>
                              <span
                                className="px-3 py-1 rounded-full text-[11px] font-black"
                                style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}
                              >
                                {member.contacted_history.length} called
                              </span>
                            </div>

                            {member.contacted_history.length === 0 ? (
                              <div className="rounded-xl px-3 py-5 mt-3 text-center bg-white border border-slate-200 text-[13px] font-semibold text-slate-400">
                                No calls completed by this user yet.
                              </div>
                            ) : (
                              <div className="space-y-3 mt-4">
                                {member.contacted_history.map((assignment) => (
                                  <article key={`history-${assignment.assignment_id}`} className="rounded-2xl px-4 py-4 bg-white border border-slate-200">
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                      <div>
                                        <p className="text-[15px] font-black text-slate-800">
                                          {assignment.person_name || 'Contact'}
                                        </p>
                                        <p className="text-[12px] text-slate-500 font-medium mt-1">
                                          {assignment.company_name || 'Company not available'}
                                        </p>
                                      </div>
                                      <span
                                        className="px-3 py-1 rounded-full text-[11px] font-black"
                                        style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}
                                      >
                                        Called
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                                      <div className="rounded-xl px-3 py-3 bg-slate-50 border border-slate-200">
                                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Phone</p>
                                        <p className="text-[13px] font-black text-slate-800 mt-1">{assignment.phone || 'Not available'}</p>
                                      </div>
                                      <div className="rounded-xl px-3 py-3 bg-slate-50 border border-slate-200">
                                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Region</p>
                                        <p className="text-[13px] font-black text-slate-800 mt-1">{assignment.region || 'Not available'}</p>
                                      </div>
                                      <div className="rounded-xl px-3 py-3 bg-slate-50 border border-slate-200">
                                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Scheduled Date</p>
                                        <p className="text-[13px] font-black text-slate-800 mt-1">{assignment.scheduled_date}</p>
                                      </div>
                                      <div className="rounded-xl px-3 py-3 bg-slate-50 border border-slate-200">
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
                                      <div className="rounded-xl px-3 py-3 mt-3 bg-slate-50 border border-slate-200">
                                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Remark</p>
                                        <p className="text-[13px] text-slate-700 font-medium mt-1">{assignment.remarks}</p>
                                      </div>
                                    ) : null}
                                  </article>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityPlannerAssignmentsPage;
