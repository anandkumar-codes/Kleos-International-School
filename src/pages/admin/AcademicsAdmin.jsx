import { useMemo, useState } from 'react';
import { CalendarCheck, UserCheck, UserX, Clock, ClipboardCheck, Save, Printer, FileText, Plus, NotebookPen, Trophy, Award } from 'lucide-react';
import { useStore } from '../../services/store';
import { PageHead, Kpi, Panel } from '../../components/admin/AdminUI';
import { ChartCard, Lines, Bars, STATUS, SERIES } from '../../components/charts';
import { DataTable, Badge, Avatar, Button, Modal, Input, Select, Tabs, Progress, useForm, useToast, EmptyState, SearchInput } from '../../components/ui';
import { useTable } from '../../hooks';
import { CLASSES, sectionsFor, classLabel, lastSchoolDay, isSchoolDay, EXAMS, SUBJECTS, stageOf, resultRow, studentDayStatus } from '../../data/records';
import { attendanceForDay, weeklyAttendance } from '../../services/analytics';
import { formatDate, isoDate, pct, gradeFor } from '../../utils/format';
import { required } from '../../utils/validate';

/* ======================= ATTENDANCE ======================= */
function MarkAttendance({ open, onClose, cls, section, date }) {
  const store = useStore();
  const toast = useToast();
  const list = store.state.students.filter((s) => s.class === cls && s.section === section).sort((a, b) => a.rollNo - b.rollNo);
  const [marks, setMarks] = useState({});
  const statusOf = (s) => marks[s.id] || studentDayStatus(s.id, date)[0];
  const counts = list.reduce((a, s) => ({ ...a, [statusOf(s)]: (a[statusOf(s)] || 0) + 1 }), {});
  return (
    <Modal open={open} onClose={onClose} size="lg" title={`Mark attendance · ${cls}-${section}`} description={`${formatDate(date, { weekday: 'long', day: 'numeric', month: 'long' })} · ${list.length} students`}
      footer={<>
        <span className="muted" style={{ marginRight: 'auto', fontSize: 13.5 }}>Present {counts.P || 0} · Absent {counts.A || 0} · Late {counts.L || 0}</span>
        <Button variant="ghost" onClick={() => setMarks(Object.fromEntries(list.map((s) => [s.id, 'P'])))}>Mark all present</Button>
        <Button icon={Save} onClick={() => { store.log('attendance', `Attendance submitted for ${cls}-${section}`); if (counts.A) store.notify('attendance', 'Absence SMS sent', `${counts.A} parents of ${cls}-${section} notified of absence.`); toast('Attendance saved', { text: `${cls}-${section}: ${counts.P || 0} present, ${counts.A || 0} absent. Parents notified by SMS.` }); onClose(); }}>Submit</Button>
      </>}>
      <div style={{ display: 'grid' }}>
        {list.map((s) => (
          <div key={s.id} className="mini-list__item">
            <span className="tabular muted" style={{ width: 24 }}>{s.rollNo}</span>
            <Avatar name={s.name} size={32} />
            <div className="grow"><strong>{s.name}</strong><span>{s.id}</span></div>
            <div className="att-pill" role="radiogroup" aria-label={`Attendance for ${s.name}`}>
              {['P', 'A', 'L'].map((k) => (
                <button key={k} role="radio" aria-checked={statusOf(s) === k} className={statusOf(s) === k ? `on-${k}` : ''} onClick={() => setMarks((m) => ({ ...m, [s.id]: k }))}>{k}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export function Attendance() {
  const { state } = useStore();
  const [date, setDate] = useState(isoDate(lastSchoolDay()));
  const [cls, setCls] = useState('');
  const [marking, setMarking] = useState(null);
  const d = new Date(`${date}T12:00:00`);
  const holiday = !isSchoolDay(d);
  const day = useMemo(() => attendanceForDay(state.students, d), [state.students, date]); // eslint-disable-line react-hooks/exhaustive-deps
  const week = useMemo(() => weeklyAttendance(state.students, 12), [state.students]);
  const rows = day.rows.filter((r) => !cls || r.class === cls).map((r) => ({ ...r, id: `${r.class}-${r.section}` }));
  const byClass = CLASSES.map((c) => {
    const rs = day.rows.filter((r) => r.class === c);
    const t = rs.reduce((a, r) => a + r.strength, 0);
    return { label: c, Attendance: t ? Math.round((rs.reduce((a, r) => a + r.present, 0) / t) * 1000) / 10 : 0 };
  });
  const table = useTable(rows, { pageSize: 15, searchKeys: ['id'] });

  return (
    <>
      <PageHead title="Attendance" sub="Daily attendance across all classes and sections" actions={<>
        <input type="date" className="input" style={{ height: 40, width: 170 }} value={date} max={isoDate(new Date())} onChange={(e) => setDate(e.target.value)} aria-label="Date" />
        <select className="select" style={{ height: 40, width: 150 }} value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Class"><option value="">All classes</option>{CLASSES.map((c) => <option key={c} value={c}>{classLabel(c)}</option>)}</select>
      </>} />
      {holiday ? (
        <section className="card"><EmptyState icon={CalendarCheck} title="No school on this day" text={`${formatDate(d, { weekday: 'long', day: 'numeric', month: 'long' })} is a Sunday or school holiday. Pick another date.`} /></section>
      ) : <>
        <div className="kpis kpis--4">
          <Kpi feature label="Attendance" value={pct(day.pct)} icon={CalendarCheck} deltaLabel={formatDate(d, { weekday: 'short', day: 'numeric', month: 'short' })} />
          <Kpi label="Present" value={day.present.toLocaleString('en-IN')} icon={UserCheck} />
          <Kpi label="Absent" value={day.absent} icon={UserX} tone="red" deltaLabel="SMS sent to parents" />
          <Kpi label="Late arrivals" value={day.late} icon={Clock} tone="gold" />
        </div>
        <div className="dash-grid" style={{ marginBottom: 16 }}>
          <ChartCard className="span-6" title="Attendance trend" sub="Last 12 school days, % present">
            <Lines data={week} series={[{ key: 'pct', name: 'Attendance %' }]} format={(v) => `${v}%`} domain={[88, 100]} height={240} />
          </ChartCard>
          <ChartCard className="span-6" title="By class" sub="% present on selected day">
            <Bars data={byClass} series={[{ key: 'Attendance', name: 'Attendance %' }]} format={(v) => `${v}%`} domain={[0, 100]} height={240} colorBy={(r) => (r.Attendance < 92 ? STATUS.warning : SERIES[0])} />
          </ChartCard>
        </div>
        <section className="card">
          <DataTable table={table} columns={[
            { key: 'class', label: 'Class', render: (r) => <strong>{classLabel(r.class)}</strong> },
            { key: 'section', label: 'Section' },
            { key: 'date', label: 'Date', render: () => formatDate(d) },
            { key: 'strength', label: 'Strength', align: 'right' },
            { key: 'present', label: 'Present', align: 'right', sortable: true },
            { key: 'absent', label: 'Absent', align: 'right', sortable: true, render: (r) => <span style={{ color: r.absent > 2 ? 'var(--red-600)' : undefined, fontWeight: r.absent > 2 ? 700 : 400 }}>{r.absent}</span> },
            { key: 'late', label: 'Late', align: 'right' },
            { key: 'pct', label: 'Attendance', sortable: true, render: (r) => <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 130 }}><div style={{ flex: 1 }}><Progress value={r.pct} height={6} color={r.pct < 92 ? 'var(--amber-500)' : undefined} /></div><span className="tabular">{pct(r.pct)}</span></div> },
            { key: 'a', label: '', align: 'right', render: (r) => <Button variant="soft" size="xs" icon={ClipboardCheck} onClick={() => setMarking(r)}>Mark</Button> },
          ]} />
        </section>
      </>}
      {marking && <MarkAttendance open onClose={() => setMarking(null)} cls={marking.class} section={marking.section} date={d} />}
    </>
  );
}

/* ======================= EXAMINATIONS ======================= */
function ReportCard({ student, onClose }) {
  const { state } = useStore();
  if (!student) return null;
  const subjects = SUBJECTS[stageOf(student.class)];
  const published = EXAMS.filter((e) => e.status === 'Published');
  const results = published.map((e) => ({ exam: e, ...resultRow(student, e.id, state.marks) }));
  return (
    <Modal open onClose={onClose} size="lg" title="Report card" description={`${student.name} · ${student.class}-${student.section} · Roll ${student.rollNo}`}
      footer={<Button icon={Printer} onClick={() => window.print()}>Print</Button>}>
      <div className="receipt">
        <div className="receipt__head">
          <div><strong style={{ fontSize: 18, color: 'var(--green-800)' }}>Kleos International School</strong><div className="muted" style={{ fontSize: 13 }}>CBSE · Miyapur, Hyderabad · Academic Year 2026–27</div></div>
          <Badge tone="green">Term I</Badge>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Subject</th>{published.map((e) => <th key={e.id} className="num">{e.name} ({e.max})</th>)}<th className="num">Grade</th></tr></thead>
            <tbody>
              {subjects.map((s) => {
                const total = results.reduce((a, r) => a + (r.marks[s] || 0), 0);
                const max = results.reduce((a, r) => a + r.exam.max, 0);
                return <tr key={s}><td><strong>{s}</strong></td>{results.map((r) => <td key={r.exam.id} className="num">{r.marks[s]}</td>)}<td className="num"><Badge tone="green" plain>{gradeFor((total / max) * 100)}</Badge></td></tr>;
              })}
            </tbody>
          </table>
        </div>
        {results.map((r) => (
          <div key={r.exam.id} className="receipt__total" style={{ marginTop: 8 }}><span>{r.exam.name}</span><span>{r.total} / {r.max} · {pct(r.percent)} · {r.grade}</span></div>
        ))}
        <p className="muted" style={{ marginTop: 14, fontSize: 13.5 }}>Class teacher&apos;s remark: {results[1]?.percent > 85 ? 'Excellent work this term — keep up the consistency and curiosity.' : results[1]?.percent > 65 ? 'Good progress. Regular revision will help move to the next grade band.' : 'Needs focused practice. Please meet the class teacher at the PTM.'}</p>
      </div>
    </Modal>
  );
}

export function Examinations() {
  const store = useStore();
  const toast = useToast();
  const [exam, setExam] = useState('hy');
  const [cls, setCls] = useState('VI');
  const [sec, setSec] = useState('A');
  const [card, setCard] = useState(null);
  const [draft, setDraft] = useState({});
  const ex = EXAMS.find((e) => e.id === exam);
  const subjects = SUBJECTS[stageOf(cls)];
  const students = store.state.students.filter((s) => s.class === cls && s.section === sec).sort((a, b) => a.rollNo - b.rollNo);
  const marks = { ...store.state.marks, ...draft };
  const rows = students.map((s) => ({ ...s, r: resultRow(s, exam, marks) }));
  const avg = rows.length ? rows.reduce((a, r) => a + r.r.percent, 0) / rows.length : 0;
  const top = [...rows].sort((a, b) => b.r.percent - a.r.percent)[0];
  const dirty = Object.keys(draft).length;
  const setMark = (sid, subj, v) => {
    const n = v === '' ? null : Math.max(0, Math.min(ex.max, Number(v)));
    setDraft((d) => ({ ...d, [`${sid}|${exam}|${subj}`]: n }));
  };

  return (
    <>
      <PageHead title="Examinations" sub="Exams, marks entry, results and report cards" actions={<>
        {dirty > 0 && <Button variant="ghost" onClick={() => setDraft({})}>Discard</Button>}
        <Button icon={Save} disabled={!dirty} onClick={() => { store.set('marks', (m) => ({ ...m, ...draft })); setDraft({}); store.log('exam', `Marks updated for ${cls}-${sec} · ${ex.name}`); toast('Marks saved', { text: `${dirty} entries updated for ${cls}-${sec}` }); }}>Save marks{dirty ? ` (${dirty})` : ''}</Button>
      </>} />
      <div className="kpis kpis--4">
        {EXAMS.map((e) => (
          <button key={e.id} className="kpi" style={{ textAlign: 'left', outline: e.id === exam ? '2px solid var(--green-600)' : undefined }} onClick={() => { setExam(e.id); setDraft({}); }}>
            <div className="kpi__top"><span className="kpi__label">{e.month}</span><Badge>{e.status}</Badge></div>
            <div className="kpi__value" style={{ fontSize: 18 }}>{e.name}</div>
            <div className="kpi__foot">Max {e.max} marks per subject</div>
          </button>
        ))}
      </div>
      <section className="card">
        <div className="toolbar">
          <select className="select" value={cls} onChange={(e) => { setCls(e.target.value); setSec('A'); setDraft({}); }} aria-label="Class">{CLASSES.slice(3).map((c) => <option key={c} value={c}>{classLabel(c)}</option>)}</select>
          <select className="select" value={sec} onChange={(e) => { setSec(e.target.value); setDraft({}); }} aria-label="Section">{sectionsFor(cls).map((s) => <option key={s}>{s}</option>)}</select>
          <div className="toolbar__spacer" />
          {ex.status === 'Published' && rows.length > 0 && <>
            <Badge tone="blue" plain><Award size={13} /> Class average {pct(avg)}</Badge>
            <Badge tone="gold" plain><Trophy size={13} /> Topper: {top?.name} ({pct(top?.r.percent)})</Badge>
          </>}
        </div>
        {ex.status !== 'Published' ? (
          <EmptyState icon={FileText} title={`${ex.name} is scheduled for ${ex.month}`} text="Marks entry opens once the examination is completed. The timetable has been shared with parents." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Student</th>{subjects.map((s) => <th key={s} className="num">{s}</th>)}<th className="num">Total</th><th className="num">%</th><th>Grade</th><th /></tr></thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td><div className="cell-main"><span className="muted tabular" style={{ width: 20 }}>{s.rollNo}</span><div><strong>{s.name}</strong><span>{s.id}</span></div></div></td>
                    {subjects.map((sub) => {
                      const v = s.r.marks[sub];
                      return <td key={sub} className="num"><input className={`marks-input ${v != null && v < ex.max * 0.33 ? 'is-low' : ''}`} type="number" min="0" max={ex.max} value={v ?? ''} onChange={(e) => setMark(s.id, sub, e.target.value)} aria-label={`${sub} marks for ${s.name}`} /></td>;
                    })}
                    <td className="num"><strong>{s.r.total}</strong><span className="muted">/{s.r.max}</span></td>
                    <td className="num tabular">{pct(s.r.percent)}</td>
                    <td><Badge tone={s.r.percent >= 80 ? 'green' : s.r.percent >= 50 ? 'blue' : 'red'} plain>{s.r.grade}</Badge></td>
                    <td><Button variant="ghost" size="xs" icon={FileText} onClick={() => setCard(s)}>Report</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <ReportCard student={card} onClose={() => setCard(null)} />
    </>
  );
}

/* ======================= ASSIGNMENTS ======================= */
export function Assignments() {
  const store = useStore();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [cls, setCls] = useState('');
  const rows = store.state.assignments.filter((a) => !cls || a.class === cls);
  const table = useTable(rows, { pageSize: 10, searchKeys: ['title', 'subject', 'teacher'] });
  const form = useForm({ title: '', subject: 'Mathematics', class: 'VI', teacher: '', dueDate: '' }, { title: [required('Title')], teacher: [required('Teacher')], dueDate: [required('Due date')] });
  const now = Date.now();
  const save = form.submit((v) => {
    const s = sectionsFor(v.class);
    store.add('assignments', { ...v, sections: s, assignedOn: new Date().toISOString(), dueDate: new Date(v.dueDate).toISOString(), submissions: 0, total: s.length * 29 });
    store.log('exam', `Assignment posted: ${v.title} (${v.class})`);
    toast('Assignment published', { text: 'Students and parents have been notified.' });
    form.reset();
    setOpen(false);
  });
  return (
    <>
      <PageHead title="Assignments" sub="Homework and projects shared with students and parents" actions={<Button icon={Plus} onClick={() => setOpen(true)}>New assignment</Button>} />
      <div className="kpis kpis--4">
        <Kpi label="Active" value={store.state.assignments.filter((a) => new Date(a.dueDate) > now).length} icon={NotebookPen} />
        <Kpi label="Due this week" value={store.state.assignments.filter((a) => { const d = new Date(a.dueDate) - now; return d > 0 && d < 7 * 864e5; }).length} icon={Clock} tone="gold" />
        <Kpi label="Closed" value={store.state.assignments.filter((a) => new Date(a.dueDate) <= now).length} icon={ClipboardCheck} tone="blue" />
        <Kpi label="Avg. submission" value={pct((store.state.assignments.reduce((a, x) => a + x.submissions / x.total, 0) / Math.max(1, store.state.assignments.length)) * 100, 0)} icon={UserCheck} tone="purple" />
      </div>
      <section className="card">
        <div className="toolbar">
          <SearchInput value={table.query} onChange={table.setQuery} placeholder="Search title, subject, teacher" />
          <select className="select" value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Class"><option value="">All classes</option>{CLASSES.slice(3).map((c) => <option key={c} value={c}>{classLabel(c)}</option>)}</select>
        </div>
        <DataTable table={table} columns={[
          { key: 'title', label: 'Assignment', render: (a) => <div><strong style={{ color: 'var(--ink-900)' }}>{a.title}</strong><div className="muted" style={{ fontSize: 12.5 }}>{a.subject} · {a.teacher}</div></div> },
          { key: 'class', label: 'Class', render: (a) => `${a.class} (${a.sections.join(', ')})` },
          { key: 'dueDate', label: 'Due', sortable: true, render: (a) => <span className="nowrap">{formatDate(a.dueDate)}</span> },
          { key: 'submissions', label: 'Submissions', render: (a) => <div style={{ minWidth: 140, display: 'flex', gap: 8, alignItems: 'center' }}><div style={{ flex: 1 }}><Progress value={(a.submissions / a.total) * 100} height={6} /></div><span className="tabular" style={{ fontSize: 12.5 }}>{a.submissions}/{a.total}</span></div> },
          { key: 's', label: 'Status', render: (a) => <Badge tone={new Date(a.dueDate) > now ? 'blue' : 'gray'}>{new Date(a.dueDate) > now ? 'Open' : 'Closed'}</Badge> },
        ]} />
      </section>
      <Modal open={open} onClose={() => setOpen(false)} title="New assignment" footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Publish</Button></>}>
        <form className="form-grid" onSubmit={save} noValidate>
          <Input className="span-2" label="Title" required {...form.bind('title')} />
          <Select label="Class" options={CLASSES.slice(3)} {...form.bind('class')} />
          <Select label="Subject" options={[...new Set(Object.values(SUBJECTS).flat())]} {...form.bind('subject')} />
          <Input label="Teacher" required {...form.bind('teacher')} />
          <Input label="Due date" type="date" required {...form.bind('dueDate')} />
        </form>
      </Modal>
    </>
  );
}
