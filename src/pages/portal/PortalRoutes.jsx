import { useState } from 'react';
import { Routes, Route, NavLink, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, UserRound, CalendarCheck, NotebookPen, FileText, Wallet, Receipt, Clock, Megaphone, Calendar, PlaneTakeoff,
  MessageSquare, BookOpen, LogOut, Bell, MoreHorizontal, Send, Plus, Download, ChevronLeft, ChevronRight, CircleCheck, Pin, CreditCard,
} from 'lucide-react';
import { useStore } from '../../services/store';
import { useAuth } from '../../services/auth';
import { Logo, Avatar, Badge, Button, IconButton, Dropdown, Tabs, Progress, Modal, Input, Textarea, EmptyState, DataTable, useForm, useToast } from '../../components/ui';
import { Kpi, Panel } from '../../components/admin/AdminUI';
import { ChartCard, Bars, Lines, SERIES } from '../../components/charts';
import { ReceiptModal } from '../admin/Office';
import { classLabel, timetableFor, PERIOD_TIMES, WEEKDAYS, EXAMS, SUBJECTS, stageOf, resultRow, studentDayStatus, isSchoolDay } from '../../data/records';
import { formatDate, formatINR, timeAgo, pct, isoDate, formatDay, formatMonth, gradeFor } from '../../utils/format';
import { upcomingEvents, sortedNotices } from '../../utils/content';
import { required } from '../../utils/validate';

const SUBJECT_COLORS = ['#dff0e8', '#e2eefb', '#fdf0d8', '#eee7fa', '#fbe3e4', '#dff3f7', '#f1f4f3'];
const subjColor = (s, all) => SUBJECT_COLORS[Math.max(0, all.indexOf(s)) % SUBJECT_COLORS.length];

const NAV = {
  parent: [
    ['', 'Dashboard', LayoutDashboard], ['profile', 'Student Profile', UserRound], ['attendance', 'Attendance', CalendarCheck], ['homework', 'Homework', NotebookPen],
    ['results', 'Exam Results', FileText], ['fees', 'Fees & Receipts', Wallet], ['timetable', 'Timetable', Clock], ['announcements', 'Announcements', Megaphone],
    ['events', 'Events', Calendar], ['leave', 'Leave Requests', PlaneTakeoff], ['messages', 'Messages', MessageSquare],
  ],
  student: [
    ['', 'Dashboard', LayoutDashboard], ['timetable', 'Timetable', Clock], ['attendance', 'Attendance', CalendarCheck], ['assignments', 'Assignments', NotebookPen],
    ['results', 'Results', FileText], ['subjects', 'Subjects', BookOpen], ['events', 'Events', Calendar], ['announcements', 'Announcements', Megaphone], ['profile', 'Profile', UserRound],
  ],
};

function useStudent(role) {
  const { state } = useStore();
  const id = role === 'parent' ? state.demo.parentChildId : state.demo.studentId;
  return state.students.find((s) => s.id === id) || state.students[0];
}

/* ---------------- Layout ---------------- */
function PortalShell({ role, student, children }) {
  const { session, logout } = useAuth();
  const { state } = useStore();
  const nav = useNavigate();
  const loc = useLocation();
  const [more, setMore] = useState(false);
  const base = `/portal/${role}`;
  const items = NAV[role];
  const unread = state.portalMessages.filter((m) => !m.mine).length;
  const tabbar = items.slice(0, 4);
  return (
    <div className={`portal portal--${role}`}>
      <header className="portal-top">
        <div className="container">
          <Link to={base}><Logo sub={role === 'parent' ? 'Parent Portal' : 'Student Portal'} /></Link>
          <span className="portal-tag">{SCHOOL_YEAR}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
            <IconButton icon={Bell} label="Notifications" badge={3} onClick={() => nav(`${base}/announcements`)} />
            <Dropdown trigger={({ toggle }) => (
              <button className="user-chip" onClick={toggle} aria-label="Account">
                <Avatar name={session?.name} size={36} />
                <div><strong>{session?.name}</strong><span>{role === 'parent' ? `Parent of ${student.name.split(' ')[0]}` : `${student.class}-${student.section}`}</span></div>
              </button>
            )}>
              <Link className="dropdown__item" to={`${base}/profile`} data-close><UserRound /> Profile</Link>
              <a className="dropdown__item" href="/" data-close><Calendar /> School website</a>
              <div className="dropdown__sep" />
              <button className="dropdown__item dropdown__item--danger" onClick={() => { logout(); nav(`/login?role=${role}`); }}><LogOut /> Sign out</button>
            </Dropdown>
          </div>
        </div>
      </header>
      <div className="portal-body">
        <nav className="portal-nav" aria-label="Portal">
          {items.map(([p, label, I]) => (
            <NavLink key={p} to={p ? `${base}/${p}` : base} end={!p}><I aria-hidden />{label}{p === 'messages' && unread > 0 && <span className="pn-count">{unread}</span>}</NavLink>
          ))}
        </nav>
        <main key={loc.pathname} style={{ minWidth: 0, animation: 'fadeUp .4s var(--ease)' }}>{children}</main>
      </div>
      <nav className="portal-tabbar" aria-label="Portal quick">
        {tabbar.map(([p, label, I]) => <NavLink key={p} to={p ? `${base}/${p}` : base} end={!p} onClick={() => setMore(false)}><I />{label.split(' ')[0]}</NavLink>)}
        <button onClick={() => setMore((m) => !m)} aria-expanded={more}><MoreHorizontal />More</button>
      </nav>
      {more && (
        <div className="portal-more" onClick={() => setMore(false)}>
          {items.slice(4).map(([p, label, I]) => <NavLink key={p} to={`${base}/${p}`}><I />{label}</NavLink>)}
        </div>
      )}
    </div>
  );
}
const SCHOOL_YEAR = 'AY 2026–27';

function StudentBanner({ student, role }) {
  const hy = resultRow(student, 'hy', useStore().state.marks);
  return (
    <div className="portal-hero">
      <Avatar name={student.name} size={68} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p>{role === 'parent' ? 'Your child' : 'Welcome back'}</p>
        <h1>{role === 'parent' ? student.name : `Hi, ${student.name.split(' ')[0]}!`}</h1>
        <div className="portal-hero__meta"><span>{classLabel(student.class)} – {student.section}</span><span>Roll {student.rollNo}</span><span>{student.id}</span><span>{student.house} House</span></div>
      </div>
      <div className="portal-hero__stats">
        <div><b>{pct(student.attendance, 0)}</b><span>Attendance</span></div>
        <div><b>{hy.grade}</b><span>Half-yearly</span></div>
        <div><b>{student.feeStatus === 'Paid' ? 'Clear' : formatINR(Math.max(0, student.annualFee / 2 - student.feePaid))}</b><span>Fees due</span></div>
      </div>
    </div>
  );
}

/* ---------------- Pages ---------------- */
function TodaySchedule({ student }) {
  const tt = timetableFor(student.class, student.section);
  const day = new Date().getDay();
  const idx = day === 0 ? 0 : day - 1;
  const now = new Date().getHours() * 60 + new Date().getMinutes();
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return (h < 8 ? h + 12 : h) * 60 + m; };
  return (
    <div className="today-list">
      {tt[idx].map((p, i) => {
        const [a, b] = p.time.split(' – ');
        const isNow = day !== 0 && now >= toMin(a) && now < toMin(b);
        return <div key={i} className={`today-item ${isNow ? 'is-now' : ''}`}><time>{p.time}</time><strong>{p.subject}</strong>{isNow && <Badge tone="green" className="ml-auto" style={{ marginLeft: 'auto' }}>Now</Badge>}</div>;
      })}
    </div>
  );
}

function Dash({ role, student }) {
  const { state } = useStore();
  const base = `/portal/${role}`;
  const hw = state.assignments.filter((a) => a.class === student.class && new Date(a.dueDate) > Date.now()).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const results = EXAMS.filter((e) => e.status === 'Published').map((e) => ({ label: e.name.replace(' Examination', ''), Score: Math.round(resultRow(student, e.id, state.marks).percent) }));
  return (
    <>
      <StudentBanner student={student} role={role} />
      <div className="dash-grid">
        <Panel className="span-6" title={`Today · ${new Date().toLocaleDateString('en-IN', { weekday: 'long' })}`} action={<Link className="text-link" style={{ fontSize: 13 }} to={`${base}/timetable`}>Full timetable</Link>}>
          {new Date().getDay() === 0 ? <EmptyState icon={Clock} title="It's Sunday — no classes" text="Enjoy the weekend!" /> : <TodaySchedule student={student} />}
        </Panel>
        <Panel className="span-6" title={role === 'parent' ? 'Homework due' : 'Assignments due'} action={<Link className="text-link" style={{ fontSize: 13 }} to={`${base}/${role === 'parent' ? 'homework' : 'assignments'}`}>View all</Link>}>
          <div className="mini-list">
            {hw.slice(0, 5).map((a) => (
              <div key={a.id} className="mini-list__item">
                <div className="mini-date"><b>{formatDay(a.dueDate)}</b><span>{formatMonth(a.dueDate)}</span></div>
                <div className="grow"><strong>{a.title}</strong><span>{a.subject} · {a.teacher}</span></div>
              </div>
            ))}
            {!hw.length && <EmptyState icon={CircleCheck} title="All caught up" text="No pending homework." />}
          </div>
        </Panel>
        <ChartCard className="span-6" title="Performance" sub="Overall % in published exams">
          <Bars data={results} series={[{ key: 'Score', name: 'Score %', color: role === 'student' ? SERIES[2] : SERIES[0] }]} format={(v) => `${v}%`} domain={[0, 100]} height={220} />
        </ChartCard>
        <Panel className="span-6" title="Notices" action={<Link className="text-link" style={{ fontSize: 13 }} to={`${base}/announcements`}>All</Link>}>
          <div className="mini-list">
            {sortedNotices(state.announcements).slice(0, 4).map((n) => (
              <div key={n.id} className="mini-list__item"><span className="kpi__ico" style={{ width: 36, height: 36 }}>{n.pinned ? <Pin size={16} /> : <Megaphone size={16} />}</span><div className="grow"><strong>{n.title}</strong><span>{n.category} · {timeAgo(n.date)}</span></div></div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function Profile({ student, role }) {
  return (
    <>
      <StudentBanner student={student} role={role} />
      <div className="dash-grid">
        <Panel className="span-6" title="Student details">
          <dl className="dl">
            <div><dt>Full name</dt><dd>{student.name}</dd></div>
            <div><dt>Admission no.</dt><dd>{student.admissionNo}</dd></div>
            <div><dt>Date of birth</dt><dd>{formatDate(student.dob)}</dd></div>
            <div><dt>Gender</dt><dd>{student.gender}</dd></div>
            <div><dt>Blood group</dt><dd>{student.bloodGroup}</dd></div>
            <div><dt>House</dt><dd>{student.house}</dd></div>
            <div><dt>Joined</dt><dd>{formatDate(student.joined)}</dd></div>
            <div><dt>Transport</dt><dd>{student.transport}</dd></div>
          </dl>
        </Panel>
        <Panel className="span-6" title="Parent & contact">
          <dl className="dl">
            <div><dt>Father</dt><dd>{student.fatherName}</dd></div>
            <div><dt>Mother</dt><dd>{student.motherName}</dd></div>
            <div><dt>Mobile</dt><dd>{student.phone}</dd></div>
            <div><dt>Email</dt><dd>{student.email}</dd></div>
            <div style={{ gridColumn: '1/-1' }}><dt>Address</dt><dd>{student.address}</dd></div>
          </dl>
          <p className="muted" style={{ fontSize: 13, marginTop: 16 }}>To update details, please contact the school office or send a message to the class teacher.</p>
        </Panel>
      </div>
    </>
  );
}

function AttendancePage({ student }) {
  const [offset, setOffset] = useState(0);
  const base = new Date();
  const month = new Date(base.getFullYear(), base.getMonth() - offset, 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const lead = (month.getDay() + 6) % 7;
  const today = new Date(new Date().toDateString());
  const cells = Array.from({ length: days }, (_, i) => {
    const d = new Date(month.getFullYear(), month.getMonth(), i + 1, 12);
    if (d > new Date()) return { d, k: 'X' };
    if (!isSchoolDay(d)) return { d, k: 'H' };
    return { d, k: studentDayStatus(student.id, d)[0] };
  });
  const count = (k) => cells.filter((c) => c.k === k).length;
  const school = count('P') + count('A') + count('L');
  const trend = Array.from({ length: 5 }, (_, i) => {
    const m = new Date(base.getFullYear(), base.getMonth() - 4 + i, 1);
    const n = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    let t = 0, p = 0;
    for (let k = 1; k <= n; k++) { const d = new Date(m.getFullYear(), m.getMonth(), k, 12); if (d > new Date() || !isSchoolDay(d) || m.getMonth() === 4) continue; t++; if (studentDayStatus(student.id, d) !== 'Absent') p++; }
    return { label: m.toLocaleDateString('en-IN', { month: 'short' }), pct: t ? Math.round((p / t) * 1000) / 10 : null };
  }).filter((x) => x.pct != null);
  return (
    <>
      <div className="kpis kpis--4">
        <Kpi label="This term" value={pct(student.attendance)} icon={CalendarCheck} />
        <Kpi label="Present (month)" value={count('P')} icon={CircleCheck} />
        <Kpi label="Absent (month)" value={count('A')} icon={CalendarCheck} tone="red" />
        <Kpi label="Late (month)" value={count('L')} icon={Clock} tone="gold" />
      </div>
      <div className="dash-grid">
        <Panel className="span-6" title={month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} sub={`${school} school days`} action={<div style={{ display: 'flex' }}><IconButton icon={ChevronLeft} label="Previous month" onClick={() => setOffset((o) => o + 1)} /><IconButton icon={ChevronRight} label="Next month" disabled={offset === 0} onClick={() => setOffset((o) => Math.max(0, o - 1))} /></div>}>
          <div className="heat">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i} className="h-head">{d}</span>)}
            {Array.from({ length: lead }).map((_, i) => <span key={`l${i}`} className="X" />)}
            {cells.map((c) => <span key={c.d.getDate()} className={c.k} title={`${formatDate(c.d)} · ${{ P: 'Present', A: 'Absent', L: 'Late', H: 'Holiday', X: '' }[c.k]}`} style={isoDate(c.d) === isoDate(today) ? { outline: '2px solid var(--accent)' } : undefined}>{c.d.getDate()}</span>)}
          </div>
          <div className="chart-legend" style={{ marginTop: 14 }}>
            <span><i style={{ background: 'var(--green-100)' }} />Present</span><span><i style={{ background: 'var(--red-100)' }} />Absent</span><span><i style={{ background: 'var(--amber-100)' }} />Late</span><span><i style={{ background: '#f1f4f3' }} />Holiday</span>
          </div>
        </Panel>
        <ChartCard className="span-6" title="Monthly attendance" sub="% of school days present">
          <Lines data={trend} series={[{ key: 'pct', name: 'Attendance' }]} format={(v) => `${v}%`} domain={[80, 100]} height={260} />
        </ChartCard>
      </div>
    </>
  );
}

function Homework({ student, role }) {
  const { state } = useStore();
  const toast = useToast();
  const [tab, setTab] = useState('pending');
  const [done, setDone] = useState({});
  const list = state.assignments.filter((a) => a.class === student.class).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const pending = list.filter((a) => new Date(a.dueDate) > Date.now() && !done[a.id]);
  const closed = list.filter((a) => new Date(a.dueDate) <= Date.now() || done[a.id]);
  const show = tab === 'pending' ? pending : closed;
  return (
    <Panel title={role === 'parent' ? 'Homework' : 'Assignments'} action={<Tabs value={tab} onChange={setTab} tabs={[{ value: 'pending', label: 'Pending', count: pending.length }, { value: 'done', label: 'Submitted / closed', count: closed.length }]} />} flush>
      {show.map((a) => {
        const days = Math.ceil((new Date(a.dueDate) - Date.now()) / 864e5);
        return (
          <div key={a.id} className="list-row">
            <span className="kpi__ico" style={{ background: subjColor(a.subject, SUBJECTS[stageOf(student.class)]), color: 'var(--ink-800)' }}><NotebookPen size={18} /></span>
            <div className="grow"><strong>{a.title}</strong><p>{a.subject} · {a.teacher} · Due {formatDate(a.dueDate)}</p></div>
            {tab === 'pending' ? <>
              <Badge tone={days <= 2 ? 'red' : 'blue'}>{days <= 0 ? 'Due today' : `${days} day${days > 1 ? 's' : ''} left`}</Badge>
              {role === 'student' && <Button size="xs" variant="soft" onClick={() => { setDone((d) => ({ ...d, [a.id]: true })); toast('Submitted', { text: a.title }); }}>Mark submitted</Button>}
            </> : <Badge tone={done[a.id] ? 'green' : 'gray'}>{done[a.id] ? 'Submitted' : 'Closed'}</Badge>}
          </div>
        );
      })}
      {!show.length && <EmptyState icon={CircleCheck} title={tab === 'pending' ? 'Nothing pending' : 'Nothing here yet'} text={tab === 'pending' ? 'All homework is up to date.' : ''} />}
    </Panel>
  );
}

function Results({ student }) {
  const { state } = useStore();
  const published = EXAMS.filter((e) => e.status === 'Published');
  const [exam, setExam] = useState(published[published.length - 1].id);
  const ex = EXAMS.find((e) => e.id === exam);
  const r = resultRow(student, exam, state.marks);
  const subjects = SUBJECTS[stageOf(student.class)];
  const data = subjects.map((s) => ({ label: s.length > 9 ? s.slice(0, 8) + '…' : s, Score: Math.round((r.marks[s] / ex.max) * 100) }));
  return (
    <>
      <Tabs className="mb" value={exam} onChange={setExam} tabs={EXAMS.map((e) => ({ value: e.id, label: e.name }))} />
      {ex.status !== 'Published' ? <section className="card"><EmptyState icon={FileText} title={`${ex.name} — ${ex.month}`} text="Results will appear here once published by the school." /></section> : <>
        <div className="kpis kpis--4">
          <Kpi label="Total" value={`${r.total} / ${r.max}`} icon={FileText} />
          <Kpi label="Percentage" value={pct(r.percent)} icon={FileText} tone="blue" />
          <Kpi label="Overall grade" value={r.grade} icon={FileText} tone="gold" />
          <Kpi label="Best subject" value={subjects.reduce((b, s) => (r.marks[s] > r.marks[b] ? s : b), subjects[0])} icon={FileText} tone="purple" />
        </div>
        <div className="dash-grid">
          <Panel className="span-6" title="Subject-wise marks" flush>
            <DataTable rowKey="s" rows={subjects.map((s) => ({ s, m: r.marks[s] }))} columns={[
              { key: 's', label: 'Subject', render: (x) => <strong style={{ color: 'var(--ink-900)' }}>{x.s}</strong> },
              { key: 'm', label: 'Marks', align: 'right', render: (x) => `${x.m} / ${ex.max}` },
              { key: 'p', label: 'Score', render: (x) => <div style={{ minWidth: 120 }}><Progress value={(x.m / ex.max) * 100} height={6} color={x.m / ex.max < 0.5 ? 'var(--red-500)' : 'var(--accent)'} /></div> },
              { key: 'g', label: 'Grade', render: (x) => <Badge tone="green" plain>{gradeFor((x.m / ex.max) * 100)}</Badge> },
            ]} />
          </Panel>
          <ChartCard className="span-6" title="Score by subject" sub="% of maximum marks">
            <Bars data={data} series={[{ key: 'Score', name: 'Score %', color: SERIES[0] }]} format={(v) => `${v}%`} domain={[0, 100]} height={260} />
          </ChartCard>
        </div>
      </>}
    </>
  );
}

function Fees({ student }) {
  const { state } = useStore();
  const toast = useToast();
  const [receipt, setReceipt] = useState(null);
  const [paying, setPaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const pays = state.payments.filter((p) => p.studentId === student.id);
  const inst = student.annualFee / 4;
  const schedule = ['Installment 1', 'Installment 2', 'Installment 3', 'Installment 4'].map((t, i) => {
    const paid = pays.filter((p) => p.term === t).reduce((a, p) => a + p.amount, 0);
    const due = ['10 Jun 2026', '10 Sep 2026', '10 Dec 2026', '10 Feb 2027'][i];
    return { t, due, amount: inst, paid, status: paid >= inst ? 'Paid' : i < 2 ? (student.feeStatus === 'Overdue' ? 'Overdue' : 'Pending') : 'Upcoming' };
  });
  const dueNow = Math.max(0, student.annualFee / 2 - student.feePaid);
  const store = useStore();
  const pay = () => {
    setBusy(true);
    setTimeout(() => {
      const n = 4120 + state.payments.length;
      const p = store.add('payments', { id: `PAY-${n}`, receiptNo: `KIS/26-27/${n}`, studentId: student.id, studentName: student.name, class: `${student.class}-${student.section}`, amount: dueNow, mode: 'UPI', term: schedule.find((s) => s.status !== 'Paid')?.t || 'Installment 2', date: new Date().toISOString(), status: 'Success' });
      store.patch('students', student.id, { feePaid: student.feePaid + dueNow, feeStatus: 'Paid' });
      store.notify('fee', 'Fee payment received', `${formatINR(dueNow)} from ${student.name} (${student.class}-${student.section}) via UPI.`);
      store.log('fee', `Online fee payment of ${formatINR(dueNow)} from ${student.name}`);
      setBusy(false);
      setPaying(false);
      toast('Payment successful', { text: `${formatINR(dueNow)} · ${p.receiptNo}` });
      setReceipt(p);
    }, 1200);
  };
  return (
    <>
      <div className="kpis kpis--4">
        <Kpi feature label="Annual fee" value={formatINR(student.annualFee)} icon={Wallet} deltaLabel="4 quarterly installments" />
        <Kpi label="Paid so far" value={formatINR(student.feePaid)} icon={CircleCheck} />
        <Kpi label="Due now" value={formatINR(dueNow)} icon={Clock} tone={dueNow ? 'red' : 'green'} deltaLabel={dueNow ? 'Installment 2' : 'All dues clear'} />
        <Kpi label="Status" value={student.feeStatus} icon={Receipt} tone="gold" />
      </div>
      {dueNow > 0 && (
        <div className="alert alert--warning mb" style={{ alignItems: 'center' }}>
          <Clock /><div style={{ flex: 1 }}><strong>{formatINR(dueNow)} is due</strong>Pay online by UPI, card or net banking to avoid late fee of ₹50/day.</div>
          <Button icon={CreditCard} onClick={() => setPaying(true)}>Pay now</Button>
        </div>
      )}
      <div className="dash-grid">
        <Panel className="span-6" title="Fee schedule 2026–27" flush>
          <DataTable rowKey="t" rows={schedule} columns={[{ key: 't', label: 'Installment' }, { key: 'due', label: 'Due date' }, { key: 'amount', label: 'Amount', align: 'right', render: (s) => formatINR(s.amount) }, { key: 'status', label: 'Status', render: (s) => <Badge>{s.status}</Badge> }]} />
        </Panel>
        <Panel className="span-6" title="Receipts" flush>
          <DataTable rows={pays} onRowClick={setReceipt} empty={<EmptyState icon={Receipt} title="No receipts yet" />} columns={[
            { key: 'receiptNo', label: 'Receipt' }, { key: 'date', label: 'Date', render: (p) => formatDate(p.date) }, { key: 'mode', label: 'Mode' },
            { key: 'amount', label: 'Amount', align: 'right', render: (p) => <strong>{formatINR(p.amount)}</strong> },
            { key: 'd', label: '', align: 'right', render: (p) => <IconButton icon={Download} label="Download receipt" onClick={(e) => { e.stopPropagation(); setReceipt(p); }} /> },
          ]} />
        </Panel>
      </div>
      <ReceiptModal payment={receipt} onClose={() => setReceipt(null)} />
      <Modal open={paying} onClose={() => !busy && setPaying(false)} size="sm" title="Pay school fees" description={`${student.name} · ${student.id}`} footer={<><Button variant="ghost" onClick={() => setPaying(false)} disabled={busy}>Cancel</Button><Button loading={busy} onClick={pay}>{busy ? 'Processing…' : `Pay ${formatINR(dueNow)}`}</Button></>}>
        <div style={{ display: 'grid', gap: 10 }}>
          {['UPI (GPay, PhonePe, Paytm)', 'Debit / Credit card', 'Net banking'].map((m, i) => (
            <label key={m} className="c-card" style={{ padding: 14, alignItems: 'center', cursor: 'pointer' }}><input type="radio" name="pm" defaultChecked={!i} /><strong style={{ fontSize: 14 }}>{m}</strong></label>
          ))}
          <p className="muted" style={{ fontSize: 12.5 }}>Demo checkout — no real payment is processed.</p>
        </div>
      </Modal>
    </>
  );
}

function Timetable({ student }) {
  const tt = timetableFor(student.class, student.section);
  const subjects = SUBJECTS[stageOf(student.class)];
  const today = new Date().getDay() - 1;
  return (
    <Panel title={`Weekly timetable · ${student.class}-${student.section}`} sub="Lunch break 12:20 – 1:00 · Short break 10:45 – 11:00" flush>
      <div className="table-wrap">
        <div className="tt">
          <div className="tt-h">Period</div>
          {WEEKDAYS.map((d, i) => <div key={d} className={`tt-h ${i === today ? 'is-today' : ''}`}>{d.slice(0, 3)}</div>)}
          {PERIOD_TIMES.map((t, pi) => (
            <FragmentRow key={t} t={t} pi={pi} tt={tt} today={today} subjects={subjects} />
          ))}
        </div>
      </div>
    </Panel>
  );
}
function FragmentRow({ t, pi, tt, today, subjects }) {
  return <>
    <div className="tt-t">P{pi + 1}<br />{t}</div>
    {tt.map((day, di) => <div key={di} className={`tt-s ${di === today ? 'is-today' : ''}`}>{day[pi].subject !== '—' && <span style={{ '--sc': subjColor(day[pi].subject, subjects) }}>{day[pi].subject}</span>}</div>)}
  </>;
}

function Subjects({ student }) {
  const { state } = useStore();
  const subjects = SUBJECTS[stageOf(student.class)];
  const colors = ['#177a5b', '#2d7dd2', '#d98a10', '#7f56c8', '#c8323c', '#0e7490', '#4d7c0f'];
  const teacherFor = (s) => state.teachers.find((t) => t.classes.some((c) => c.startsWith(`${student.class}-`)) && (t.designation.includes(s) || t.department.includes(s)))?.name || state.teachers.find((t) => t.department === 'Science' && ['Physics', 'Chemistry', 'Biology', 'Science'].includes(s))?.name || 'Subject teacher';
  return (
    <div className="subj-grid">
      {subjects.map((s, i) => {
        const r = marksPct(student, s, state.marks);
        return (
          <div key={s} className="subj" style={{ '--sc': colors[i % colors.length] }}>
            <h4>{s}</h4>
            <p>{teacherFor(s)}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}><span className="muted">Half-yearly</span><strong>{r}%</strong></div>
            <Progress value={r} height={6} color={colors[i % colors.length]} />
          </div>
        );
      })}
    </div>
  );
}
const marksPct = (student, s, marks) => Math.round((resultRow(student, 'hy', marks).marks[s] / 80) * 100);

function Notices() {
  const { state } = useStore();
  return (
    <Panel title="Announcements" flush>
      {sortedNotices(state.announcements).map((n) => (
        <div key={n.id} className="list-row" style={{ alignItems: 'flex-start' }}>
          <span className="kpi__ico" style={{ flex: 'none' }}>{n.pinned ? <Pin size={18} /> : <Megaphone size={18} />}</span>
          <div className="grow"><strong>{n.title}</strong><p style={{ whiteSpace: 'normal' }}>{n.body}</p></div>
          <div style={{ textAlign: 'right' }}><Badge tone="green" plain>{n.category}</Badge><div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{formatDate(n.date)}</div></div>
        </div>
      ))}
    </Panel>
  );
}

function EventsPage() {
  const { state } = useStore();
  const list = upcomingEvents(state.events);
  return (
    <div className="dash-grid">
      {list.map((e) => (
        <Panel key={e.id} className="span-6">
          <div style={{ display: 'flex', gap: 14 }}>
            <div className="mini-date" style={{ width: 56 }}><b>{formatDay(e.date)}</b><span>{formatMonth(e.date)}</span></div>
            <div><strong style={{ color: 'var(--ink-900)' }}>{e.title}</strong><p className="muted" style={{ fontSize: 13 }}>{e.time} · {e.location}</p><p style={{ fontSize: 13.5, marginTop: 8 }}>{e.description}</p></div>
          </div>
        </Panel>
      ))}
      {!list.length && <div className="span-12 card"><EmptyState icon={Calendar} title="No upcoming events" /></div>}
    </div>
  );
}

function Leave({ student }) {
  const store = useStore();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const form = useForm({ from: '', to: '', reason: '' }, { from: [required('From date')], to: [required('To date'), (v, all) => (v && all.from && v < all.from ? 'End date must be after start date' : '')], reason: [required('Reason')] });
  const submit = form.submit((v) => {
    store.add('leaves', { ...v, status: 'Pending', applied: new Date().toISOString() });
    store.add('messages', { from: student.fatherName, role: `Parent · ${student.name} (${student.class}-${student.section})`, subject: 'Leave request', body: `${v.reason} (${v.from} to ${v.to})`, date: new Date().toISOString(), read: false });
    toast('Leave request sent', { text: 'The class teacher will review it shortly.' });
    form.reset();
    setOpen(false);
  });
  return (
    <>
      <Panel title="Leave requests" sub={`For ${student.name}`} flush action={<Button icon={Plus} onClick={() => setOpen(true)}>Apply for leave</Button>}>
        <DataTable rows={store.state.leaves} empty={<EmptyState icon={PlaneTakeoff} title="No leave requests" />} columns={[
          { key: 'from', label: 'From', render: (l) => formatDate(l.from) }, { key: 'to', label: 'To', render: (l) => formatDate(l.to) },
          { key: 'reason', label: 'Reason' }, { key: 'applied', label: 'Applied', render: (l) => timeAgo(l.applied) }, { key: 'status', label: 'Status', render: (l) => <Badge>{l.status}</Badge> },
        ]} />
      </Panel>
      <Modal open={open} onClose={() => setOpen(false)} title="Apply for leave" footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Submit request</Button></>}>
        <form className="form-grid" onSubmit={submit} noValidate>
          <Input label="From" type="date" required {...form.bind('from')} />
          <Input label="To" type="date" required {...form.bind('to')} />
          <Textarea className="span-2" label="Reason" required {...form.bind('reason')} />
        </form>
      </Modal>
    </>
  );
}

function Messages({ student }) {
  const store = useStore();
  const [text, setText] = useState('');
  const msgs = store.state.portalMessages;
  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    store.add('portalMessages', { from: 'You', role: 'Parent', body: text.trim(), date: new Date().toISOString(), mine: true }, { prepend: false });
    store.add('messages', { from: student.fatherName, role: `Parent · ${student.name} (${student.class}-${student.section})`, subject: 'Message to class teacher', body: text.trim(), date: new Date().toISOString(), read: false });
    setText('');
  };
  return (
    <section className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 520 }}>
      <div className="card__head" style={{ paddingBottom: 16, borderBottom: '1px solid var(--line-cool)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Avatar name="Jyothi Prasad" size={42} /><div><h3 className="card__title">Mrs. Jyothi Prasad</h3><p className="card__sub">Class Teacher · {student.class}-{student.section} · usually replies within a day</p></div></div>
      </div>
      <div className="inbox__view" style={{ flex: 1 }}>
        <div className="bubble-list">
          {msgs.map((m) => <div key={m.id} className={`bubble ${m.mine ? 'mine' : ''}`}>{m.body}<small>{timeAgo(m.date)}</small></div>)}
        </div>
        <form className="composer" onSubmit={send}>
          <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message to the class teacher…" aria-label="Message" />
          <Button type="submit" icon={Send} disabled={!text.trim()}>Send</Button>
        </form>
      </div>
    </section>
  );
}

function PageTitle({ children }) {
  return <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 18 }}>{children}</h1>;
}

export default function PortalRoutes({ role }) {
  const student = useStudent(role);
  const P = (title, el) => <><PageTitle>{title}</PageTitle>{el}</>;
  return (
    <PortalShell role={role} student={student}>
      <Routes>
        <Route index element={<Dash role={role} student={student} />} />
        <Route path="profile" element={<Profile role={role} student={student} />} />
        <Route path="attendance" element={P('Attendance', <AttendancePage student={student} />)} />
        <Route path="homework" element={P('Homework', <Homework role={role} student={student} />)} />
        <Route path="assignments" element={P('Assignments', <Homework role={role} student={student} />)} />
        <Route path="results" element={P('Exam results', <Results student={student} />)} />
        <Route path="fees" element={P('Fees & receipts', <Fees student={student} />)} />
        <Route path="timetable" element={P('Timetable', <Timetable student={student} />)} />
        <Route path="subjects" element={P('My subjects', <Subjects student={student} />)} />
        <Route path="announcements" element={P('Announcements', <Notices />)} />
        <Route path="events" element={P('Upcoming events', <EventsPage />)} />
        <Route path="leave" element={P('Leave requests', <Leave student={student} />)} />
        <Route path="messages" element={P('Messages', <Messages student={student} />)} />
        <Route path="*" element={<Navigate to={`/portal/${role}`} replace />} />
      </Routes>
    </PortalShell>
  );
}

