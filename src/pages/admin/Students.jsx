import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, Download, Phone, Mail, MapPin, Users as UsersIcon, Filter } from 'lucide-react';
import { useStore } from '../../services/store';
import { PageHead, Kpi } from '../../components/admin/AdminUI';
import { DataTable, Badge, Avatar, Button, IconButton, SearchInput, Modal, Drawer, ConfirmDialog, Input, Select, useForm, useToast, Progress, SkeletonRows } from '../../components/ui';
import { useTable } from '../../hooks';
import { CLASSES, sectionsFor, ANNUAL_FEE, stageOf, classLabel } from '../../data/records';
import { required, phoneIN, email } from '../../utils/validate';
import { formatINR, formatDate, pct } from '../../utils/format';
import { exportCSV } from '../../utils/export';

const EMPTY = { name: '', gender: 'Male', class: 'I', section: 'A', dob: '', fatherName: '', motherName: '', phone: '', email: '', address: '', transport: 'Own', bloodGroup: 'O+' };

function StudentForm({ open, onClose, initial }) {
  const store = useStore();
  const toast = useToast();
  const editing = !!initial?.id;
  const form = useForm(initial || EMPTY, {
    name: [required('Student name')],
    dob: [required('Date of birth')],
    fatherName: [required('Parent name')],
    phone: [required('Phone'), phoneIN],
    email: [email],
  });
  useEffect(() => form.reset(initial || EMPTY), [initial, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = form.submit((v) => {
    if (editing) {
      store.patch('students', initial.id, v);
      toast('Student updated', { text: `${v.name}'s record was saved.` });
    } else {
      const n = Math.max(...store.state.students.map((s) => Number(s.id.slice(3)))) + 1;
      const rollNo = store.state.students.filter((s) => s.class === v.class && s.section === v.section).length + 1;
      const annual = ANNUAL_FEE[stageOf(v.class)];
      const rec = store.add('students', { ...v, id: `KIS${String(n).padStart(4, '0')}`, admissionNo: `ADM/${new Date().getFullYear()}/${n}`, rollNo, house: 'Kalam', area: v.address.split(',').slice(-2, -1)[0]?.trim() || 'Miyapur', joined: new Date().toISOString().slice(0, 10), attendance: 100, annualFee: annual, feePaid: 0, feeStatus: 'Pending', status: 'Active' });
      store.log('student', `New student registered: ${rec.name}, ${rec.class}-${rec.section}`);
      store.notify('student', 'New student registered', `${rec.name} admitted to ${rec.class}-${rec.section}.`);
      toast('Student added', { text: `${rec.name} · ${rec.id}` });
    }
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose} size="lg" title={editing ? 'Edit student' : 'Add new student'} description={editing ? initial.id : 'Creates the student record and a parent portal account.'}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save}>{editing ? 'Save changes' : 'Add student'}</Button></>}>
      <form onSubmit={save} className="form-grid" noValidate>
        <Input label="Full name" required {...form.bind('name')} />
        <Select label="Gender" options={['Male', 'Female']} {...form.bind('gender')} />
        <Select label="Class" options={CLASSES.map((c) => ({ value: c, label: classLabel(c) }))} {...form.bind('class')} />
        <Select label="Section" options={sectionsFor(form.values.class)} {...form.bind('section')} />
        <Input label="Date of birth" type="date" required {...form.bind('dob')} />
        <Select label="Blood group" options={['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']} {...form.bind('bloodGroup')} />
        <div className="span-2 section-title" style={{ margin: '8px 0 0' }}>Parent / guardian</div>
        <Input label="Father / guardian name" required {...form.bind('fatherName')} />
        <Input label="Mother name" {...form.bind('motherName')} />
        <Input label="Mobile" type="tel" required {...form.bind('phone')} />
        <Input label="Email" type="email" {...form.bind('email')} />
        <Input className="span-2" label="Address" {...form.bind('address')} />
        <Select label="Transport" options={['Own', ...Array.from({ length: 14 }, (_, i) => `Route ${i + 1}`)]} {...form.bind('transport')} />
      </form>
    </Modal>
  );
}

export function StudentProfile({ student, onClose, onEdit }) {
  const { state } = useStore();
  if (!student) return null;
  const pays = state.payments.filter((p) => p.studentId === student.id);
  return (
    <Drawer open={!!student} onClose={onClose} title="Student profile" description={`${student.id} · Admission ${student.admissionNo}`}
      footer={<><Button variant="ghost" onClick={onClose}>Close</Button>{onEdit && <Button icon={Pencil} onClick={() => onEdit(student)}>Edit</Button>}</>}>
      <div className="profile-head">
        <Avatar name={student.name} size={64} />
        <div>
          <h3>{student.name}</h3>
          <p className="muted">{classLabel(student.class)} · Section {student.section} · Roll {student.rollNo}</p>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}><Badge>{student.status}</Badge><Badge tone="blue" plain>{student.house} House</Badge></div>
        </div>
      </div>
      <dl className="dl">
        <div><dt>Date of birth</dt><dd>{formatDate(student.dob)}</dd></div>
        <div><dt>Gender</dt><dd>{student.gender}</dd></div>
        <div><dt>Blood group</dt><dd>{student.bloodGroup}</dd></div>
        <div><dt>Joined</dt><dd>{formatDate(student.joined)}</dd></div>
        <div><dt>Transport</dt><dd>{student.transport}</dd></div>
        <div><dt>Area</dt><dd>{student.area}</dd></div>
      </dl>
      <div className="section-title">Parent details</div>
      <dl className="dl">
        <div><dt>Father / guardian</dt><dd>{student.fatherName}</dd></div>
        <div><dt>Mother</dt><dd>{student.motherName || '—'}</dd></div>
      </dl>
      <div style={{ display: 'grid', gap: 8, marginTop: 14, fontSize: 14 }}>
        <a href={`tel:${student.phone}`} style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Phone size={16} color="var(--ink-400)" />{student.phone}</a>
        <a href={`mailto:${student.email}`} style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Mail size={16} color="var(--ink-400)" />{student.email}</a>
        <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}><MapPin size={16} color="var(--ink-400)" />{student.address}</span>
      </div>
      <div className="section-title">Attendance (this term)</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}><Progress value={student.attendance} color={student.attendance < 85 ? 'var(--red-500)' : undefined} /></div>
        <strong>{pct(student.attendance)}</strong>
      </div>
      <div className="section-title">Fees · {formatINR(student.annualFee)} / year</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span>Paid <strong>{formatINR(student.feePaid)}</strong> · Balance <strong>{formatINR(student.annualFee - student.feePaid)}</strong></span>
        <Badge>{student.feeStatus}</Badge>
      </div>
      {pays.map((p) => (
        <div key={p.id} className="mini-list__item" style={{ fontSize: 13.5 }}>
          <div className="grow"><strong>{p.term}</strong><span>{p.receiptNo} · {p.mode}</span></div>
          <div style={{ textAlign: 'right' }}><strong>{formatINR(p.amount)}</strong><span>{formatDate(p.date)}</span></div>
        </div>
      ))}
      {!pays.length && <p className="muted" style={{ fontSize: 13.5 }}>No payments recorded yet.</p>}
    </Drawer>
  );
}

export default function Students() {
  const store = useStore();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [cls, setCls] = useState('');
  const [sec, setSec] = useState('');
  const [fee, setFee] = useState('');
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 450); return () => clearTimeout(t); }, []);

  const students = store.state.students;
  const viewing = students.find((s) => s.id === params.get('open'));
  const rows = useMemo(() => students.filter((s) => (!cls || s.class === cls) && (!sec || s.section === sec) && (!fee || s.feeStatus === fee)), [students, cls, sec, fee]);
  const table = useTable(rows, { pageSize: 12, searchKeys: ['name', 'id', 'fatherName', 'phone', 'admissionNo'] });

  const openForm = (s = null) => { setEditing(s); setFormOpen(true); setParams({}); };
  const cols = [
    { key: 'name', label: 'Student', sortable: true, render: (s) => <div className="cell-main"><Avatar name={s.name} size={36} /><div><strong>{s.name}</strong><span>{s.id}</span></div></div> },
    { key: 'class', label: 'Class', sortKey: (s) => s.class === 'Nursery' ? -3 : CLASSES.indexOf(s.class), render: (s) => <span className="nowrap">{s.class} – {s.section}</span> },
    { key: 'rollNo', label: 'Roll', sortable: true },
    { key: 'fatherName', label: 'Parent', sortable: true, render: (s) => <div><div className="nowrap">{s.fatherName}</div><span className="muted" style={{ fontSize: 12.5 }}>{s.phone}</span></div> },
    { key: 'attendance', label: 'Attendance', sortable: true, render: (s) => <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 110 }}><div style={{ flex: 1 }}><Progress value={s.attendance} height={6} color={s.attendance < 85 ? 'var(--red-500)' : undefined} /></div><span className="tabular" style={{ fontSize: 13 }}>{Math.round(s.attendance)}%</span></div> },
    { key: 'feeStatus', label: 'Fee status', sortable: true, render: (s) => <Badge>{s.feeStatus}</Badge> },
    { key: 'actions', label: '', align: 'right', render: (s) => (
      <div className="row-actions" onClick={(e) => e.stopPropagation()}>
        <IconButton icon={Eye} label="View profile" onClick={() => setParams({ open: s.id })} />
        <IconButton icon={Pencil} label="Edit" onClick={() => openForm(s)} />
        <IconButton icon={Trash2} label="Delete" onClick={() => setDeleting(s)} />
      </div>
    ) },
  ];

  return (
    <>
      <PageHead title="Students" sub={`${students.length.toLocaleString('en-IN')} enrolled across ${CLASSES.length} classes`} actions={<>
        <Button variant="outline" icon={Download} onClick={() => { exportCSV('kleos-students', [{ key: 'id', label: 'Student ID' }, { key: 'name', label: 'Name' }, { key: 'class', label: 'Class' }, { key: 'section', label: 'Section' }, { key: 'rollNo', label: 'Roll' }, { key: 'fatherName', label: 'Parent' }, { key: 'phone', label: 'Phone' }, { key: 'email', label: 'Email' }, { key: 'attendance', label: 'Attendance %' }, { key: 'feeStatus', label: 'Fee status' }], table.filtered); toast('Export ready', { text: `${table.filtered.length} students exported to CSV` }); }}>Export</Button>
        <Button icon={Plus} onClick={() => openForm()}>Add student</Button>
      </>} />

      <div className="kpis kpis--4">
        <Kpi label="Boys / Girls" value={`${students.filter((s) => s.gender === 'Male').length} / ${students.filter((s) => s.gender === 'Female').length}`} icon={UsersIcon} />
        <Kpi label="Avg. attendance" value={pct(students.reduce((a, s) => a + s.attendance, 0) / students.length)} tone="blue" icon={UsersIcon} />
        <Kpi label="Below 85% attendance" value={students.filter((s) => s.attendance < 85).length} tone="red" icon={UsersIcon} deltaLabel="need follow-up" />
        <Kpi label="Use school transport" value={students.filter((s) => s.transport !== 'Own').length} tone="gold" icon={UsersIcon} />
      </div>

      <section className="card">
        <div className="toolbar">
          <SearchInput value={table.query} onChange={table.setQuery} placeholder="Search name, ID, parent, phone" />
          <Filter size={16} color="var(--ink-400)" aria-hidden />
          <select className="select" value={cls} onChange={(e) => { setCls(e.target.value); setSec(''); }} aria-label="Filter by class">
            <option value="">All classes</option>
            {CLASSES.map((c) => <option key={c} value={c}>{classLabel(c)}</option>)}
          </select>
          <select className="select" value={sec} onChange={(e) => setSec(e.target.value)} aria-label="Filter by section">
            <option value="">All sections</option>
            {(cls ? sectionsFor(cls) : ['A', 'B', 'C']).map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="select" value={fee} onChange={(e) => setFee(e.target.value)} aria-label="Filter by fee status">
            <option value="">Any fee status</option>
            {['Paid', 'Pending', 'Partial', 'Overdue'].map((s) => <option key={s}>{s}</option>)}
          </select>
          {(cls || sec || fee || table.query) && <Button variant="ghost" size="sm" onClick={() => { setCls(''); setSec(''); setFee(''); table.setQuery(''); }}>Clear</Button>}
        </div>
        {loading ? <SkeletonRows rows={8} cols={6} /> : <DataTable columns={cols} table={table} onRowClick={(s) => setParams({ open: s.id })} />}
      </section>

      <StudentForm open={formOpen} onClose={() => setFormOpen(false)} initial={editing} />
      <StudentProfile student={viewing} onClose={() => setParams({})} onEdit={(s) => openForm(s)} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} title="Delete student record?" text={`This permanently removes ${deleting?.name} (${deleting?.id}) and their parent portal access. This cannot be undone.`}
        onConfirm={() => { store.remove('students', deleting.id); toast('Student deleted', { tone: 'info', text: deleting.name }); }} />
    </>
  );
}
