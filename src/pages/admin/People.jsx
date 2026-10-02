import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Mail, Phone, Send, UserRound, Briefcase, GraduationCap, Globe, Users, CalendarCheck } from 'lucide-react';
import { useStore } from '../../services/store';
import { PageHead, Kpi, Panel } from '../../components/admin/AdminUI';
import { DataTable, Badge, Avatar, Button, IconButton, SearchInput, Modal, Drawer, ConfirmDialog, Input, Select, useForm, useToast, Tabs, Progress, Switch } from '../../components/ui';
import { useTable } from '../../hooks';
import { CLASSES, sectionsFor, DEPARTMENTS, classLabel, classAttendance, lastSchoolDay } from '../../data/records';
import { sectionStrengths } from '../../services/analytics';
import { required, phoneIN, email } from '../../utils/validate';
import { formatINR, formatDate, pct } from '../../utils/format';

/* ======================= PARENTS ======================= */
export function Parents() {
  const { state } = useStore();
  const toast = useToast();
  const [msgTo, setMsgTo] = useState(null);
  const parents = useMemo(() => {
    const map = new Map();
    state.students.forEach((s) => {
      const k = `${s.fatherName}|${s.phone}`;
      if (!map.has(k)) map.set(k, { id: k, name: s.fatherName, mother: s.motherName, phone: s.phone, email: s.email, area: s.area, children: [], due: 0 });
      const p = map.get(k);
      p.children.push(s);
      p.due += Math.max(0, s.annualFee / 2 - s.feePaid);
    });
    return [...map.values()];
  }, [state.students]);
  const table = useTable(parents, { pageSize: 12, searchKeys: ['name', 'mother', 'phone', 'email', (p) => p.children.map((c) => c.name).join(' ')] });

  return (
    <>
      <PageHead title="Parents" sub={`${parents.length.toLocaleString('en-IN')} families with active portal accounts`} />
      <div className="kpis kpis--4">
        <Kpi label="Parent accounts" value={parents.length.toLocaleString('en-IN')} icon={Users} />
        <Kpi label="App active (30 days)" value="91.4%" icon={Globe} tone="blue" delta={2.1} deltaLabel="vs last month" />
        <Kpi label="Families with siblings" value={parents.filter((p) => p.children.length > 1).length} icon={Users} tone="gold" />
        <Kpi label="Families with dues" value={parents.filter((p) => p.due > 0).length} icon={Users} tone="red" />
      </div>
      <section className="card">
        <div className="toolbar"><SearchInput value={table.query} onChange={table.setQuery} placeholder="Search parent, child, phone, email" /></div>
        <DataTable rowKey="id" table={table} columns={[
          { key: 'name', label: 'Parent', sortable: true, render: (p) => <div className="cell-main"><Avatar name={p.name} size={36} /><div><strong>{p.name}</strong><span>{p.mother}</span></div></div> },
          { key: 'children', label: 'Children', render: (p) => <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{p.children.map((c) => <Badge key={c.id} tone="blue" plain>{c.name.split(' ')[0]} · {c.class}-{c.section}</Badge>)}</div> },
          { key: 'phone', label: 'Contact', render: (p) => <div><div className="nowrap">{p.phone}</div><span className="muted" style={{ fontSize: 12.5 }}>{p.email}</span></div> },
          { key: 'area', label: 'Area', sortable: true },
          { key: 'due', label: 'Dues', align: 'right', sortable: true, render: (p) => p.due > 0 ? <strong style={{ color: 'var(--red-600)' }}>{formatINR(p.due)}</strong> : <Badge tone="green">Clear</Badge> },
          { key: 'a', label: '', align: 'right', render: (p) => <div className="row-actions"><IconButton icon={Send} label="Message parent" onClick={() => setMsgTo(p)} /><IconButton icon={Phone} label="Call" onClick={() => (window.location.href = `tel:${p.phone}`)} /></div> },
        ]} />
      </section>
      <Modal open={!!msgTo} onClose={() => setMsgTo(null)} title={`Message ${msgTo?.name}`} description="Sent via the parent app and SMS."
        footer={<><Button variant="ghost" onClick={() => setMsgTo(null)}>Cancel</Button><Button icon={Send} onClick={() => { toast('Message sent', { text: `Delivered to ${msgTo.name}` }); setMsgTo(null); }}>Send</Button></>}>
        <div style={{ display: 'grid', gap: 14 }}>
          <Select label="Template" options={['Custom message', 'Fee reminder', 'Attendance concern', 'PTM invitation']} />
          <textarea className="textarea" defaultValue={`Dear ${msgTo?.name},\n\n`} aria-label="Message" />
        </div>
      </Modal>
    </>
  );
}

/* ======================= TEACHERS ======================= */
const T_EMPTY = { name: '', department: 'Mathematics', designation: '', qualification: '', experience: 1, phone: '', email: '', status: 'Active', classes: [], showOnWebsite: false };

function TeacherForm({ open, onClose, initial }) {
  const store = useStore();
  const toast = useToast();
  const form = useForm(initial || T_EMPTY, {
    name: [required('Name')], designation: [required('Designation')], qualification: [required('Qualification')], phone: [required('Phone'), phoneIN], email: [required('Email'), email],
  });
  useEffect(() => form.reset(initial ? { ...initial, classesText: initial.classes.join(', ') } : { ...T_EMPTY, classesText: '' }), [initial, open]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = form.submit((v) => {
    const data = { ...v, experience: Number(v.experience) || 0, classes: (v.classesText || '').split(',').map((x) => x.trim()).filter(Boolean) };
    delete data.classesText;
    if (initial?.id) { store.patch('teachers', initial.id, data); toast('Teacher updated'); }
    else {
      const id = `TCH${String(store.state.teachers.length + 1).padStart(3, '0')}`;
      store.add('teachers', { ...data, id, joined: new Date().toISOString().slice(0, 10) });
      store.log('teacher', `Teacher added: ${data.name} (${data.department})`);
      toast('Teacher added', { text: data.name });
    }
    onClose();
  });
  return (
    <Modal open={open} onClose={onClose} size="lg" title={initial ? 'Edit teacher' : 'Add teacher'} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save}>{initial ? 'Save changes' : 'Add teacher'}</Button></>}>
      <form className="form-grid" onSubmit={save} noValidate>
        <Input label="Full name" required placeholder="e.g. Mrs. Kavya Rao" {...form.bind('name')} />
        <Select label="Department" options={DEPARTMENTS} {...form.bind('department')} />
        <Input label="Designation" required placeholder="e.g. TGT Mathematics" {...form.bind('designation')} />
        <Input label="Qualification" required placeholder="e.g. M.Sc., B.Ed." {...form.bind('qualification')} />
        <Input label="Experience (years)" type="number" min="0" {...form.bind('experience')} />
        <Select label="Status" options={['Active', 'On Leave', 'Inactive']} {...form.bind('status')} />
        <Input label="Mobile" type="tel" required {...form.bind('phone')} />
        <Input label="Email" type="email" required {...form.bind('email')} />
        <Input className="span-2" label="Assigned classes" hint="Comma separated, e.g. VI-A, VII-B" {...form.bind('classesText')} />
        <label className="span-2" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
          <Switch checked={!!form.values.showOnWebsite} onChange={(v) => form.setValues((s) => ({ ...s, showOnWebsite: v }))} label="Show on website" />
          Show this profile in the public faculty directory
        </label>
      </form>
    </Modal>
  );
}

export function Teachers() {
  const store = useStore();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [dept, setDept] = useState('');
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ open: false, t: null });
  const [del, setDel] = useState(null);
  const teachers = store.state.teachers;
  const viewing = teachers.find((t) => t.id === params.get('open'));
  const rows = useMemo(() => teachers.filter((t) => (!dept || t.department === dept) && (!status || t.status === status)), [teachers, dept, status]);
  const table = useTable(rows, { pageSize: 12, searchKeys: ['name', 'department', 'designation', 'qualification', 'email'] });
  return (
    <>
      <PageHead title="Teachers" sub={`${teachers.length} staff across ${DEPARTMENTS.length} departments`} actions={<Button icon={Plus} onClick={() => setForm({ open: true, t: null })}>Add teacher</Button>} />
      <div className="kpis kpis--4">
        <Kpi label="Teaching staff" value={teachers.length} icon={UserRound} />
        <Kpi label="Avg. experience" value={`${(teachers.reduce((a, t) => a + t.experience, 0) / teachers.length).toFixed(1)} yrs`} icon={Briefcase} tone="blue" />
        <Kpi label="On leave" value={teachers.filter((t) => t.status === 'On Leave').length} icon={CalendarCheck} tone="gold" />
        <Kpi label="Student : teacher" value={`${Math.round(store.state.students.length / teachers.length)} : 1`} icon={GraduationCap} tone="purple" />
      </div>
      <section className="card">
        <div className="toolbar">
          <SearchInput value={table.query} onChange={table.setQuery} placeholder="Search name, subject, qualification" />
          <select className="select" value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department"><option value="">All departments</option>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</select>
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status"><option value="">Any status</option>{['Active', 'On Leave', 'Inactive'].map((d) => <option key={d}>{d}</option>)}</select>
        </div>
        <DataTable table={table} onRowClick={(t) => setParams({ open: t.id })} columns={[
          { key: 'name', label: 'Teacher', sortable: true, render: (t) => <div className="cell-main"><Avatar name={t.name} size={36} /><div><strong>{t.name}</strong><span>{t.id}</span></div></div> },
          { key: 'department', label: 'Department', sortable: true, render: (t) => <div><div className="nowrap">{t.department}</div><span className="muted" style={{ fontSize: 12.5 }}>{t.designation}</span></div> },
          { key: 'qualification', label: 'Qualification' },
          { key: 'experience', label: 'Exp.', sortable: true, render: (t) => `${t.experience} yrs` },
          { key: 'classes', label: 'Classes', render: (t) => <span className="nowrap">{t.classes.slice(0, 3).join(', ')}</span> },
          { key: 'status', label: 'Status', sortable: true, render: (t) => <Badge>{t.status}</Badge> },
          { key: 'a', label: '', align: 'right', render: (t) => <div className="row-actions" onClick={(e) => e.stopPropagation()}><IconButton icon={Pencil} label="Edit" onClick={() => setForm({ open: true, t })} /><IconButton icon={Trash2} label="Remove" onClick={() => setDel(t)} /></div> },
        ]} />
      </section>
      <TeacherForm open={form.open} initial={form.t} onClose={() => setForm({ open: false, t: null })} />
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} title="Remove teacher?" text={`${del?.name} will be removed from the staff directory and timetables.`} confirmLabel="Remove" onConfirm={() => { store.remove('teachers', del.id); toast('Teacher removed', { tone: 'info' }); }} />
      <Drawer open={!!viewing} onClose={() => setParams({})} title="Teacher profile" description={viewing?.id} footer={<Button icon={Pencil} onClick={() => { setForm({ open: true, t: viewing }); setParams({}); }}>Edit</Button>}>
        {viewing && <>
          <div className="profile-head"><Avatar name={viewing.name} size={64} /><div><h3>{viewing.name}</h3><p className="muted">{viewing.designation}</p><div style={{ marginTop: 8, display: 'flex', gap: 6 }}><Badge>{viewing.status}</Badge>{viewing.showOnWebsite && <Badge tone="blue">On website</Badge>}</div></div></div>
          <dl className="dl">
            <div><dt>Department</dt><dd>{viewing.department}</dd></div>
            <div><dt>Experience</dt><dd>{viewing.experience} years</dd></div>
            <div><dt>Qualification</dt><dd>{viewing.qualification}</dd></div>
            <div><dt>Joined</dt><dd>{formatDate(viewing.joined)}</dd></div>
            <div><dt>Phone</dt><dd>{viewing.phone}</dd></div>
            <div><dt>Email</dt><dd>{viewing.email}</dd></div>
          </dl>
          <div className="section-title">Assigned classes</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{viewing.classes.map((c) => <Badge key={c} tone="green" plain>{c}</Badge>)}</div>
        </>}
      </Drawer>
    </>
  );
}

/* ======================= CLASSES ======================= */
export function Classes() {
  const { state } = useStore();
  const [stage, setStage] = useState('All');
  const strengths = sectionStrengths(state.students);
  const day = lastSchoolDay();
  const stages = { All: CLASSES, 'Pre-Primary': CLASSES.slice(0, 3), Primary: CLASSES.slice(3, 8), Middle: CLASSES.slice(8, 11), Secondary: CLASSES.slice(11, 13), 'Senior Sec.': CLASSES.slice(13) };
  const classTeacher = (c, s) => state.teachers.find((t) => t.classes.includes(`${c}-${s}`))?.name || 'To be assigned';
  return (
    <>
      <PageHead title="Classes & Sections" sub={`${CLASSES.length} classes · ${CLASSES.reduce((a, c) => a + sectionsFor(c).length, 0)} sections`} />
      <Tabs className="mb" value={stage} onChange={setStage} tabs={Object.keys(stages)} />
      <div className="dash-grid">
        {stages[stage].map((c) => (
          <Panel key={c} className="span-4" title={classLabel(c)} sub={`${sectionsFor(c).reduce((a, s) => a + (strengths[`${c}-${s}`] || 0), 0)} students`}>
            {sectionsFor(c).map((s) => {
              const a = classAttendance(c, s, day, strengths[`${c}-${s}`] || 0);
              return (
                <div key={s} className="mini-list__item">
                  <span className="kpi__ico" style={{ width: 34, height: 34, fontWeight: 800 }}>{s}</span>
                  <div className="grow"><strong>Section {s} · {a.strength} students</strong><span>{classTeacher(c, s)}</span></div>
                  <div style={{ width: 90, textAlign: 'right' }}>
                    <strong className="tabular" style={{ fontSize: 13 }}>{pct(a.pct, 0)}</strong>
                    <Progress value={a.pct} height={5} color={a.pct < 90 ? 'var(--amber-500)' : undefined} />
                  </div>
                </div>
              );
            })}
          </Panel>
        ))}
      </div>
    </>
  );
}
