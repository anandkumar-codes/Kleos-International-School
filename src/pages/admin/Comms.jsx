import { useState } from 'react';
import { Send, Inbox, Bell, CheckCheck, Users, CalendarCheck, Wallet, ClipboardList, FileText, UserRound, FileSpreadsheet, FileDown, Sheet, Trash2, RotateCcw, Megaphone } from 'lucide-react';
import { useStore } from '../../services/store';
import { useAuth } from '../../services/auth';
import { PageHead, Panel } from '../../components/admin/AdminUI';
import { Avatar, Button, Badge, EmptyState, Tabs, Switch, Input, Select, useToast, ConfirmDialog } from '../../components/ui';
import { NotifIcon } from '../../layouts/AdminLayout';
import { timeAgo, formatDate, formatINR, pct } from '../../utils/format';
import { exportCSV, exportExcel, exportPDF } from '../../utils/export';
import { attendanceToday } from '../../services/analytics';
import { classLabel, resultRow } from '../../data/records';
import { SCHOOL } from '../../data/school';

/* ======================= MESSAGES ======================= */
export function Messages() {
  const store = useStore();
  const toast = useToast();
  const msgs = store.state.messages;
  const [activeId, setActiveId] = useState(msgs[0]?.id);
  const [filter, setFilter] = useState('all');
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState({});
  const list = msgs.filter((m) => filter === 'all' || !m.read);
  const active = msgs.find((m) => m.id === activeId);
  const open = (m) => { setActiveId(m.id); if (!m.read) store.patch('messages', m.id, { read: true }); };
  const send = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setReplies((r) => ({ ...r, [activeId]: [...(r[activeId] || []), { body: reply, date: new Date().toISOString() }] }));
    setReply('');
    toast('Reply sent', { text: `Delivered to ${active.from} via app & email` });
  };
  return (
    <>
      <PageHead title="Messages" sub="Parent, staff and website messages" />
      <section className="card inbox" style={{ overflow: 'hidden' }}>
        <div className="inbox__list">
          <div style={{ padding: 12, borderBottom: '1px solid var(--line-cool)' }}>
            <Tabs value={filter} onChange={setFilter} tabs={[{ value: 'all', label: 'All', count: msgs.length }, { value: 'unread', label: 'Unread', count: msgs.filter((m) => !m.read).length }]} />
          </div>
          {list.map((m) => (
            <button key={m.id} className={`inbox__item ${m.id === activeId ? 'is-active' : ''} ${m.read ? '' : 'is-unread'}`} onClick={() => open(m)}>
              <Avatar name={m.from} size={38} />
              <div className="grow">
                <strong>{m.from}<small>{timeAgo(m.date)}</small></strong>
                <p className="subj">{m.subject}</p>
                <p>{m.body}</p>
              </div>
            </button>
          ))}
          {!list.length && <EmptyState icon={Inbox} title="Inbox zero" text="No unread messages." />}
        </div>
        <div className="inbox__view">
          {active ? <>
            <div className="profile-head">
              <Avatar name={active.from} size={46} />
              <div style={{ flex: 1 }}><h3 style={{ fontSize: 17 }}>{active.subject}</h3><p className="muted" style={{ fontSize: 13.5 }}>{active.from} · {active.role}</p></div>
              <span className="muted" style={{ fontSize: 12.5 }}>{formatDate(active.date, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="bubble-list">
              <div className="bubble">{active.body}<small>{timeAgo(active.date)}</small></div>
              {(replies[active.id] || []).map((r, i) => <div key={i} className="bubble mine">{r.body}<small>{timeAgo(r.date)}</small></div>)}
            </div>
            <form className="composer" onSubmit={send}>
              <input className="input" value={reply} onChange={(e) => setReply(e.target.value)} placeholder={`Reply to ${active.from}…`} aria-label="Reply" />
              <Button type="submit" icon={Send} disabled={!reply.trim()}>Send</Button>
            </form>
          </> : <EmptyState icon={Inbox} title="Select a message" />}
        </div>
      </section>
    </>
  );
}

/* ======================= NOTIFICATIONS ======================= */
export function Notifications() {
  const store = useStore();
  const [tab, setTab] = useState('all');
  const types = { all: 'All', admission: 'Admissions', fee: 'Fees', message: 'Messages', attendance: 'Attendance', student: 'Students', event: 'Events' };
  const list = store.state.notifications.filter((n) => tab === 'all' || n.type === tab);
  return (
    <>
      <PageHead title="Notifications" sub={`${store.state.notifications.filter((n) => !n.read).length} unread`} actions={<Button variant="outline" icon={CheckCheck} onClick={() => store.set('notifications', (l) => l.map((n) => ({ ...n, read: true })))}>Mark all as read</Button>} />
      <Tabs className="mb" value={tab} onChange={setTab} tabs={Object.entries(types).map(([value, label]) => ({ value, label, count: value === 'all' ? store.state.notifications.length : store.state.notifications.filter((n) => n.type === value).length }))} />
      <div className="dash-grid">
        <Panel className="span-8" flush>
          {list.map((n) => (
            <button key={n.id} className={`notif__item ${n.read ? '' : 'is-unread'}`} onClick={() => store.patch('notifications', n.id, { read: true })}>
              <NotifIcon type={n.type} />
              <div><strong>{n.title}</strong><p>{n.text}</p><small>{timeAgo(n.date)}</small></div>
            </button>
          ))}
          {!list.length && <EmptyState icon={Bell} title="No notifications" text="You're all caught up." />}
        </Panel>
        <Panel className="span-4" title="Activity log">
          <div className="feed">
            {store.state.activity.slice(0, 10).map((a) => (
              <div key={a.id} className="feed__item"><NotifIcon type={a.type} /><div><p>{a.text}</p><small>{timeAgo(a.date)}</small></div></div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ======================= REPORTS ======================= */
export function Reports() {
  const { state } = useStore();
  const toast = useToast();
  const att = attendanceToday(state.students);
  const REPORTS = [
    { id: 'students', title: 'Student report', text: 'Complete student register with class, parent and contact details.', icon: Users, tone: ['#10624a', '#dff0e8'],
      cols: [{ key: 'id', label: 'Student ID' }, { key: 'name', label: 'Name' }, { value: (s) => `${s.class}-${s.section}`, label: 'Class' }, { key: 'rollNo', label: 'Roll' }, { key: 'gender', label: 'Gender' }, { key: 'fatherName', label: 'Parent' }, { key: 'phone', label: 'Phone' }, { key: 'area', label: 'Area' }], rows: () => state.students },
    { id: 'attendance', title: 'Attendance report', text: `Section-wise attendance for ${formatDate(new Date())}. Overall ${pct(att.pct)}.`, icon: CalendarCheck, tone: ['#5d3a9e', '#eee7fa'],
      cols: [{ value: (r) => classLabel(r.class), label: 'Class' }, { key: 'section', label: 'Section' }, { key: 'strength', label: 'Strength' }, { key: 'present', label: 'Present' }, { key: 'absent', label: 'Absent' }, { key: 'late', label: 'Late' }, { value: (r) => pct(r.pct), label: 'Attendance %' }], rows: () => att.rows },
    { id: 'fees', title: 'Fee report', text: 'Student-wise fee status, amount paid and outstanding balance.', icon: Wallet, tone: ['#0e7490', '#dff3f7'],
      cols: [{ key: 'id', label: 'Student ID' }, { key: 'name', label: 'Name' }, { value: (s) => `${s.class}-${s.section}`, label: 'Class' }, { value: (s) => formatINR(s.annualFee), label: 'Annual fee' }, { value: (s) => formatINR(s.feePaid), label: 'Paid' }, { value: (s) => formatINR(s.annualFee - s.feePaid), label: 'Balance' }, { key: 'feeStatus', label: 'Status' }], rows: () => state.students },
    { id: 'admissions', title: 'Admission report', text: '2027–28 enquiries and applications with current pipeline stage.', icon: ClipboardList, tone: ['#1d5ea5', '#e2eefb'],
      cols: [{ key: 'id', label: 'ID' }, { key: 'studentName', label: 'Student' }, { key: 'parentName', label: 'Parent' }, { key: 'phone', label: 'Phone' }, { value: (a) => classLabel(a.class), label: 'Class' }, { key: 'source', label: 'Source' }, { key: 'stage', label: 'Stage' }, { value: (a) => formatDate(a.appliedOn), label: 'Applied' }], rows: () => state.admissions },
    { id: 'exams', title: 'Examination report', text: 'Half-Yearly results — total, percentage and grade per student.', icon: FileText, tone: ['#9a5d00', '#fdf0d8'],
      cols: [{ key: 'id', label: 'Student ID' }, { key: 'name', label: 'Name' }, { value: (s) => `${s.class}-${s.section}`, label: 'Class' }, { value: (s) => s.r.total, label: 'Total' }, { value: (s) => s.r.max, label: 'Max' }, { value: (s) => pct(s.r.percent), label: '%' }, { value: (s) => s.r.grade, label: 'Grade' }],
      rows: () => state.students.filter((s) => !['Nursery', 'LKG', 'UKG'].includes(s.class)).map((s) => ({ ...s, r: resultRow(s, 'hy', state.marks) })) },
    { id: 'teachers', title: 'Teacher report', text: 'Staff directory with department, qualification, experience and status.', icon: UserRound, tone: ['#a8262f', '#fbe3e4'],
      cols: [{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'department', label: 'Department' }, { key: 'designation', label: 'Designation' }, { key: 'qualification', label: 'Qualification' }, { key: 'experience', label: 'Experience (yrs)' }, { key: 'status', label: 'Status' }], rows: () => state.teachers },
  ];
  const run = (r, kind) => {
    const rows = r.rows();
    const name = `kleos-${r.id}-report`;
    if (kind === 'csv') exportCSV(name, r.cols, rows);
    if (kind === 'excel') exportExcel(name, r.cols, rows);
    if (kind === 'pdf' && !exportPDF(r.title, r.cols, rows, `${SCHOOL.academicYear}`)) return toast('Pop-up blocked', { tone: 'error', text: 'Allow pop-ups to generate the PDF.' });
    toast(`${r.title} generated`, { text: `${rows.length} rows · ${kind.toUpperCase()}` });
  };
  return (
    <>
      <PageHead title="Reports" sub="Generate and export school reports" />
      <div className="report-grid">
        {REPORTS.map((r) => (
          <section key={r.id} className="card report-card">
            <span className="report-card__ico" style={{ color: r.tone[0], background: r.tone[1] }}><r.icon /></span>
            <h3>{r.title}</h3>
            <p>{r.text}</p>
            <div className="exports">
              <Button variant="soft" size="xs" icon={FileDown} onClick={() => run(r, 'pdf')}>PDF</Button>
              <Button variant="soft" size="xs" icon={FileSpreadsheet} onClick={() => run(r, 'excel')}>Excel</Button>
              <Button variant="soft" size="xs" icon={Sheet} onClick={() => run(r, 'csv')}>CSV</Button>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

/* ======================= SETTINGS ======================= */
export function SettingsPage() {
  const store = useStore();
  const { session } = useAuth();
  const toast = useToast();
  const [reset, setReset] = useState(false);
  const s = store.state.settings;
  const toggle = (k) => (v) => { store.set('settings', (x) => ({ ...x, [k]: v })); toast('Setting saved'); };
  return (
    <>
      <PageHead title="Settings" sub="School profile, notifications and data" />
      <div className="dash-grid">
        <Panel className="span-6" title="School profile">
          <div className="form-grid">
            <Input className="span-2" label="School name" defaultValue={SCHOOL.name} />
            <Input label="Board" defaultValue={SCHOOL.board} />
            <Input label="Affiliation no." defaultValue={SCHOOL.affiliationNo} />
            <Input label="Phone" defaultValue={SCHOOL.phone} />
            <Input label="Email" defaultValue={SCHOOL.email} />
            <Select label="Current academic year" options={['2026–27', '2027–28']} defaultValue={SCHOOL.academicYear} />
            <Input label="Late fee per day (₹)" type="number" value={s.lateFeePerDay} onChange={(e) => store.set('settings', (x) => ({ ...x, lateFeePerDay: e.target.value }))} />
          </div>
          <div style={{ textAlign: 'right', marginTop: 16 }}><Button onClick={() => toast('Profile saved')}>Save profile</Button></div>
        </Panel>
        <Panel className="span-6" title="Preferences">
          {[['admissionsOpen', 'Admissions open', 'Show the admissions banner and accept online enquiries'], ['emailAlerts', 'Email alerts', 'Daily summary to the principal at 6 PM'], ['smsAlerts', 'Absence SMS to parents', 'Auto-send when a student is marked absent'], ['schoolOpen', 'School in session', 'Turn off during vacations to pause attendance alerts']].map(([k, t, d]) => (
            <div key={k} className="setting-row"><div><strong>{t}</strong><span>{d}</span></div><Switch checked={!!s[k]} onChange={toggle(k)} label={t} /></div>
          ))}
          <div className="section-title">Signed in as</div>
          <div className="mini-list__item"><Avatar name={session?.name} size={40} /><div className="grow"><strong>{session?.name}</strong><span>{session?.title}</span></div><Badge>Active</Badge></div>
          <div className="section-title">Demo data</div>
          <div className="setting-row"><div><strong>Reset all demo data</strong><span>Restores the original sample students, fees, content and settings.</span></div><Button variant="danger" size="sm" icon={RotateCcw} onClick={() => setReset(true)}>Reset</Button></div>
        </Panel>
      </div>
      <ConfirmDialog open={reset} onClose={() => setReset(false)} title="Reset demo data?" text="All changes made in this browser (students, fees, CMS content) will be discarded." confirmLabel="Reset data" onConfirm={store.resetDemo} />
    </>
  );
}

