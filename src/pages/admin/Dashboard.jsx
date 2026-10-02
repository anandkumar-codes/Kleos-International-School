import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, UserRound, ClipboardList, IndianRupee, CalendarCheck, ArrowRight, Plus, Megaphone, CalendarDays, Sun } from 'lucide-react';
import { useStore } from '../../services/store';
import { useAuth } from '../../services/auth';
import { PageHead, Kpi, Panel } from '../../components/admin/AdminUI';
import { ChartCard, AreaTrend, Bars, Donut, SERIES, STATUS, GREEN_RAMP } from '../../components/charts';
import { DataTable, Badge, Avatar, Button } from '../../components/ui';
import { NotifIcon } from '../../layouts/AdminLayout';
import { attendanceToday, weeklyAttendance, monthlyCollections, sumLast, admissionsFunnel, enrollmentTrend, feeSummary } from '../../services/analytics';
import { formatLakh, formatNumber, formatDate, timeAgo, formatDay, formatMonth, pct } from '../../utils/format';
import { upcomingEvents } from '../../utils/content';
import { classLabel } from '../../data/records';

export default function Dashboard() {
  const { state } = useStore();
  const { session } = useAuth();
  const nav = useNavigate();
  const { students, teachers, admissions, payments, activity, events } = state;

  const att = useMemo(() => attendanceToday(students), [students]);
  const weekly = useMemo(() => weeklyAttendance(students), [students]);
  const fees = useMemo(() => monthlyCollections(payments), [payments]);
  const fs = useMemo(() => feeSummary(students), [students]);
  const funnel = useMemo(() => admissionsFunnel(admissions), [admissions]);
  const enroll = useMemo(() => enrollmentTrend(students.length), [students.length]);
  const pending = admissions.filter((a) => !['Confirmed', 'Rejected'].includes(a.stage)).length;
  const collected30 = sumLast(payments, 30);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <div className="welcome">
        <div>
          <h1>{greet}, {session?.name?.split(' ')[0]}</h1>
          <p>Here&apos;s what&apos;s happening at Kleos today — {formatDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long' })}.</p>
        </div>
        <div className="welcome__chips">
          <span><Sun /> {att.present.toLocaleString('en-IN')} students in school</span>
          <span><ClipboardList /> {admissions.filter((a) => a.stage === 'Enquiry').length} new enquiries</span>
          <span><CalendarDays /> Next: {upcomingEvents(events)[0]?.title || '—'}</span>
        </div>
      </div>

      <div className="kpis">
        <Kpi feature label="Total Students" value={formatNumber(students.length)} icon={Users} delta={3.2} deltaLabel="vs last year" />
        <Kpi label="Teachers" value={teachers.length} icon={UserRound} tone="blue" deltaLabel={`${teachers.filter((t) => t.status === 'On Leave').length} on leave today`} />
        <Kpi label="Pending Admissions" value={pending} icon={ClipboardList} tone="gold" deltaLabel={`${admissions.filter((a) => a.stage === 'Confirmed').length} confirmed this cycle`} />
        <Kpi label="Fee Collection" value={formatLakh(collected30)} icon={IndianRupee} tone="teal" deltaLabel={`last 30 days · ${formatLakh(fs.paid)} this year`} />
        <Kpi label="Attendance Today" value={pct(att.pct)} icon={CalendarCheck} tone="purple" deltaLabel={`${att.absent} absent · ${att.late} late`} />
      </div>

      <div className="dash-grid">
        <ChartCard className="span-8" title="Student Enrollment" sub="Total strength by month, this year vs last" legend={[{ label: '2026–27', color: SERIES[0] }, { label: '2025–26', color: SERIES[2] }]} action={<Button variant="ghost" size="sm" to="/admin/students" iconRight={ArrowRight}>Students</Button>}>
          <AreaTrend data={enroll} series={[{ key: '2026–27', name: '2026–27' }, { key: '2025–26', name: '2025–26', color: SERIES[2] }]} format={(v) => formatNumber(v)} />
        </ChartCard>

        <Panel className="span-4" title="Admissions Funnel" sub="2027–28 cycle" action={<Link to="/admin/admissions" className="text-link" style={{ fontSize: 13 }}>Pipeline <ArrowRight /></Link>}>
          <div className="funnel">
            {funnel.map((f, i) => (
              <div className="funnel__row" key={f.stage}>
                <span>{f.stage}</span>
                <div className="funnel__bar"><div style={{ width: `${(f.count / funnel[0].count) * 100}%`, background: GREEN_RAMP[i + 2] }}>{f.count}</div></div>
                <b>{i ? `${Math.round((f.count / funnel[0].count) * 100)}%` : '100%'}</b>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 12.5, marginTop: 14 }}>Applications that reached each stage. Conversion enquiry → confirmed: <strong style={{ color: 'var(--ink-900)' }}>{Math.round((funnel[3].count / funnel[0].count) * 100)}%</strong></p>
        </Panel>

        <ChartCard className="span-6" title="Attendance Overview" sub="Last 6 school days, all classes" legend={[{ label: 'Present', color: STATUS.good }, { label: 'Late', color: STATUS.warning }, { label: 'Absent', color: STATUS.critical }]}>
          <Bars stacked data={weekly} series={[{ key: 'Present', name: 'Present', color: STATUS.good }, { key: 'Late', name: 'Late', color: STATUS.warning }, { key: 'Absent', name: 'Absent', color: STATUS.critical }]} format={(v) => formatNumber(v)} height={260} />
        </ChartCard>

        <ChartCard className="span-6" title="Fee Collection" sub="Monthly receipts, last 7 months" action={<Button variant="ghost" size="sm" to="/admin/fees" iconRight={ArrowRight}>Fees</Button>}>
          <Bars data={fees} series={[{ key: 'Collected', name: 'Collected' }]} format={(v) => formatLakh(v)} height={260} />
        </ChartCard>

        <Panel className="span-8" title="Recent Admissions" sub="Latest applications for 2027–28" flush action={<Button variant="ghost" size="sm" to="/admin/admissions" iconRight={ArrowRight}>View all</Button>}>
          <DataTable
            rows={admissions.slice(0, 6)}
            onRowClick={(r) => nav(`/admin/admissions?open=${r.id}`)}
            columns={[
              { key: 'studentName', label: 'Student', render: (r) => <div className="cell-main"><Avatar name={r.studentName} size={34} /><div><strong>{r.studentName}</strong><span>{r.id}</span></div></div> },
              { key: 'parentName', label: 'Parent' },
              { key: 'class', label: 'Class', render: (r) => classLabel(r.class) },
              { key: 'appliedOn', label: 'Applied', render: (r) => <span className="nowrap">{formatDate(r.appliedOn)}</span> },
              { key: 'stage', label: 'Status', render: (r) => <Badge>{r.stage}</Badge> },
            ]}
          />
        </Panel>

        <Panel className="span-4" title="Fee Status" sub={`${formatLakh(fs.paid)} of ${formatLakh(fs.total)} collected this year`}>
          <Donut
            height={170}
            center={pct((fs.paid / fs.dueToDate) * 100, 0)}
            sub="of dues to date"
            data={[
              { name: 'Paid (on track)', value: fs.byStatus[0].count, color: STATUS.good },
              { name: 'Pending', value: fs.byStatus[1].count, color: SERIES[2] },
              { name: 'Partial', value: fs.byStatus[2].count, color: STATUS.warning },
              { name: 'Overdue', value: fs.byStatus[3].count, color: STATUS.critical },
            ]}
            format={(v) => `${v} students`}
          />
        </Panel>

        <Panel className="span-6" title="Recent Activity" action={<Link to="/admin/notifications" className="text-link" style={{ fontSize: 13 }}>All <ArrowRight /></Link>}>
          <div className="feed">
            {activity.slice(0, 6).map((a) => (
              <div key={a.id} className="feed__item">
                <NotifIcon type={a.type} />
                <div><p>{a.text}</p><small>{timeAgo(a.date)}</small></div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="span-6" title="Upcoming Events" action={<Button variant="soft" size="sm" icon={Plus} to="/admin/content/events">Add event</Button>}>
          <div className="mini-list">
            {upcomingEvents(events).slice(0, 5).map((e) => (
              <div key={e.id} className="mini-list__item">
                <div className="mini-date"><b>{formatDay(e.date)}</b><span>{formatMonth(e.date)}</span></div>
                <div className="grow"><strong>{e.title}</strong><span>{e.time} · {e.location}</span></div>
                <Badge tone="green" plain>{e.category}</Badge>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" icon={Megaphone} to="/admin/content/announcements" style={{ marginTop: 10 }}>Post an announcement</Button>
        </Panel>
      </div>
    </>
  );
}

