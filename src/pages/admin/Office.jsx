import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus, ChevronLeft, ChevronRight, LayoutGrid, List, Phone, Mail, XCircle, ClipboardList, FileCheck, UserCheck, CircleCheck, CircleX,
  IndianRupee, Wallet, Clock, TriangleAlert, Receipt, Printer, BellRing, Download,
} from 'lucide-react';
import { useStore } from '../../services/store';
import { PageHead, Kpi, Panel } from '../../components/admin/AdminUI';
import { ChartCard, Bars, Donut, SERIES, STATUS } from '../../components/charts';
import { DataTable, Badge, Avatar, Button, IconButton, SearchInput, Modal, Drawer, Input, Select, Textarea, Tabs, useForm, useToast } from '../../components/ui';
import { useTable } from '../../hooks';
import { ADMISSION_STAGES, CLASSES, classLabel, stageOf } from '../../data/records';
import { monthlyCollections, feeSummary, sumLast } from '../../services/analytics';
import { required, phoneIN, positive } from '../../utils/validate';
import { formatDate, formatINR, formatLakh, timeAgo } from '../../utils/format';
import { exportCSV } from '../../utils/export';

const STAGE_COLOR = { Enquiry: '#8b9893', Application: '#2d7dd2', 'Document Verification': '#7f56c8', Assessment: '#d98a10', Interaction: '#0e7490', Confirmed: '#177a5b', Rejected: '#c8323c' };
const COLUMNS = [...ADMISSION_STAGES, 'Rejected'];

/* ======================= ADMISSIONS ======================= */
export function AdmissionsAdmin() {
  const store = useStore();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState('board');
  const [q, setQ] = useState('');
  const [cls, setCls] = useState('');
  const [dragId, setDragId] = useState(null);
  const [over, setOver] = useState(null);
  const [adding, setAdding] = useState(false);
  const all = store.state.admissions;
  const list = all.filter((a) => (!cls || a.class === cls) && (!q || `${a.studentName} ${a.parentName} ${a.id} ${a.phone}`.toLowerCase().includes(q.toLowerCase())));
  const open = all.find((a) => a.id === params.get('open'));
  const table = useTable(list, { pageSize: 12, searchKeys: [] });

  const move = (a, stage) => {
    if (!a || a.stage === stage) return;
    store.patch('admissions', a.id, { stage });
    store.log('admission', `${a.studentName} moved to ${stage}`);
    if (stage === 'Confirmed') store.notify('admission', 'Admission confirmed', `${a.studentName} — ${classLabel(a.class)} for 2027–28.`);
    toast(`Moved to ${stage}`, { text: a.studentName, tone: stage === 'Rejected' ? 'info' : 'success' });
  };
  const step = (a, dir) => {
    const i = ADMISSION_STAGES.indexOf(a.stage);
    const next = ADMISSION_STAGES[i + dir];
    if (next) move(a, next);
  };
  const reached = (s) => all.filter((a) => (a.stage === 'Rejected' ? 3 : ADMISSION_STAGES.indexOf(a.stage)) >= ADMISSION_STAGES.indexOf(s)).length;

  const form = useForm({ studentName: '', parentName: '', phone: '', class: 'Nursery', source: 'Walk-in', notes: '' }, { studentName: [required('Student name')], parentName: [required('Parent name')], phone: [required('Phone'), phoneIN] });
  const addEnquiry = form.submit((v) => {
    const rec = store.add('admissions', { ...v, id: `ADM-27-${101 + all.length}`, email: '', academicYear: '2027–28', appliedOn: new Date().toISOString(), stage: 'Enquiry', previousSchool: '—' });
    store.log('admission', `New enquiry added: ${rec.studentName} (${rec.class})`);
    toast('Enquiry added', { text: rec.id });
    form.reset();
    setAdding(false);
  });

  return (
    <>
      <PageHead title="Admissions" sub="2027–28 admission cycle · drag cards between stages or use the arrows" actions={<>
        <Button variant="outline" icon={Download} onClick={() => exportCSV('kleos-admissions', [{ key: 'id', label: 'ID' }, { key: 'studentName', label: 'Student' }, { key: 'parentName', label: 'Parent' }, { key: 'phone', label: 'Phone' }, { key: 'class', label: 'Class' }, { key: 'stage', label: 'Stage' }, { key: 'source', label: 'Source' }, { value: (r) => formatDate(r.appliedOn), label: 'Applied' }], list)}>Export</Button>
        <Button icon={Plus} onClick={() => setAdding(true)}>Add enquiry</Button>
      </>} />
      <div className="kpis">
        <Kpi label="Total enquiries" value={all.length} icon={ClipboardList} deltaLabel={`${all.filter((a) => Date.now() - new Date(a.appliedOn) < 7 * 864e5).length} this week`} />
        <Kpi label="Applications" value={reached('Application')} icon={FileCheck} tone="blue" />
        <Kpi label="Assessments" value={reached('Assessment')} icon={UserCheck} tone="gold" />
        <Kpi label="Confirmed" value={all.filter((a) => a.stage === 'Confirmed').length} icon={CircleCheck} tone="green" />
        <Kpi label="Rejected / withdrawn" value={all.filter((a) => a.stage === 'Rejected').length} icon={CircleX} tone="red" />
      </div>
      <div className="toolbar card" style={{ marginBottom: 16, borderRadius: 16 }}>
        <SearchInput value={q} onChange={setQ} placeholder="Search student, parent, ID, phone" />
        <select className="select" value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Class"><option value="">All classes</option>{CLASSES.map((c) => <option key={c} value={c}>{classLabel(c)}</option>)}</select>
        <div className="toolbar__spacer" />
        <Tabs value={view} onChange={setView} tabs={[{ value: 'board', label: 'Pipeline', icon: LayoutGrid }, { value: 'table', label: 'Table', icon: List }]} />
      </div>

      {view === 'board' ? (
        <div className="kanban">
          {COLUMNS.map((stage) => {
            const cards = list.filter((a) => a.stage === stage);
            return (
              <div key={stage} className={`kanban__col ${over === stage ? 'is-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setOver(stage); }}
                onDragLeave={() => setOver((o) => (o === stage ? null : o))}
                onDrop={() => { move(all.find((a) => a.id === dragId), stage); setOver(null); setDragId(null); }}>
                <div className="kanban__head"><span><i style={{ background: STAGE_COLOR[stage] }} />{stage}</span><span className="count">{cards.length}</span></div>
                <div className="kanban__cards">
                  {cards.map((a) => {
                    const i = ADMISSION_STAGES.indexOf(a.stage);
                    return (
                      <div key={a.id} className={`k-card ${dragId === a.id ? 'is-dragging' : ''}`} draggable onDragStart={() => setDragId(a.id)} onDragEnd={() => { setDragId(null); setOver(null); }} onClick={() => setParams({ open: a.id })} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setParams({ open: a.id })}>
                        <strong>{a.studentName}</strong>
                        <span className="muted">{classLabel(a.class)} · {a.parentName}</span>
                        <div className="k-meta">
                          <span>{timeAgo(a.appliedOn)} · {a.source}</span>
                          {a.stage !== 'Rejected' && (
                            <span className="k-move" onClick={(e) => e.stopPropagation()}>
                              <button disabled={i <= 0} onClick={() => step(a, -1)} aria-label="Move to previous stage"><ChevronLeft /></button>
                              <button disabled={i >= ADMISSION_STAGES.length - 1} onClick={() => step(a, 1)} aria-label="Move to next stage"><ChevronRight /></button>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {!cards.length && <p className="muted" style={{ fontSize: 12.5, textAlign: 'center', padding: '20px 0' }}>Drop applications here</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <section className="card">
          <DataTable table={table} onRowClick={(a) => setParams({ open: a.id })} columns={[
            { key: 'studentName', label: 'Student', sortable: true, render: (a) => <div className="cell-main"><Avatar name={a.studentName} size={34} /><div><strong>{a.studentName}</strong><span>{a.id}</span></div></div> },
            { key: 'parentName', label: 'Parent', render: (a) => <div><div>{a.parentName}</div><span className="muted" style={{ fontSize: 12.5 }}>{a.phone}</span></div> },
            { key: 'class', label: 'Class', render: (a) => classLabel(a.class) },
            { key: 'appliedOn', label: 'Applied', sortable: true, render: (a) => formatDate(a.appliedOn) },
            { key: 'source', label: 'Source' },
            { key: 'stage', label: 'Stage', sortable: true, render: (a) => <Badge>{a.stage}</Badge> },
          ]} />
        </section>
      )}

      <Drawer open={!!open} onClose={() => setParams({})} title={open?.studentName} description={`${open?.id} · Applied ${open ? formatDate(open.appliedOn) : ''}`}
        footer={open && open.stage !== 'Rejected' && open.stage !== 'Confirmed' && <>
          <Button variant="ghost" icon={XCircle} onClick={() => move(open, 'Rejected')}>Reject</Button>
          <Button iconRight={ChevronRight} onClick={() => step(open, 1)}>Move to {ADMISSION_STAGES[ADMISSION_STAGES.indexOf(open.stage) + 1]}</Button>
        </>}>
        {open && <>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
            {ADMISSION_STAGES.map((s, i) => {
              const cur = ADMISSION_STAGES.indexOf(open.stage);
              return <span key={s} className="badge badge--plain" style={{ background: i <= cur ? STAGE_COLOR[s] : 'var(--canvas)', color: i <= cur ? '#fff' : 'var(--ink-500)' }}>{i + 1}. {s}</span>;
            })}
          </div>
          <Select label="Stage" value={open.stage} onChange={(e) => move(open, e.target.value)} options={COLUMNS} />
          <dl className="dl mt-3">
            <div><dt>Class applied</dt><dd>{classLabel(open.class)}</dd></div>
            <div><dt>Academic year</dt><dd>{open.academicYear}</dd></div>
            <div><dt>Parent</dt><dd>{open.parentName}</dd></div>
            <div><dt>Source</dt><dd>{open.source}</dd></div>
            <div><dt>Previous school</dt><dd>{open.previousSchool}</dd></div>
            <div><dt>Applied</dt><dd>{formatDate(open.appliedOn)}</dd></div>
          </dl>
          <div style={{ display: 'flex', gap: 8, margin: '18px 0' }}>
            <Button variant="soft" size="sm" icon={Phone} href={`tel:${open.phone}`}>{open.phone}</Button>
            {open.email && <Button variant="soft" size="sm" icon={Mail} href={`mailto:${open.email}`}>Email</Button>}
          </div>
          <Textarea label="Counsellor notes" defaultValue={open.notes} placeholder="Add notes from calls and interactions…" onBlur={(e) => store.patch('admissions', open.id, { notes: e.target.value })} />
        </>}
      </Drawer>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add enquiry" description="Walk-in or phone enquiry" footer={<><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button onClick={addEnquiry}>Add</Button></>}>
        <form className="form-grid" onSubmit={addEnquiry} noValidate>
          <Input label="Student name" required {...form.bind('studentName')} />
          <Input label="Parent name" required {...form.bind('parentName')} />
          <Input label="Phone" type="tel" required {...form.bind('phone')} />
          <Select label="Class" options={CLASSES.map((c) => ({ value: c, label: classLabel(c) }))} {...form.bind('class')} />
          <Select label="Source" options={['Walk-in', 'Phone', 'Website', 'Referral', 'Google', 'Instagram']} {...form.bind('source')} />
          <Textarea className="span-2" label="Notes" {...form.bind('notes')} />
        </form>
      </Modal>
    </>
  );
}

/* ======================= FEES ======================= */
export function ReceiptModal({ payment, onClose }) {
  if (!payment) return null;
  return (
    <Modal open onClose={onClose} title="Fee receipt" description={payment.receiptNo} footer={<Button icon={Printer} onClick={() => window.print()}>Print / Save PDF</Button>}>
      <div className="receipt">
        <div className="receipt__head">
          <div><strong style={{ fontSize: 18, color: 'var(--green-800)' }}>Kleos International School</strong><div className="muted" style={{ fontSize: 13 }}>117/1, JP Nagar, Miyapur, Hyderabad 500049</div></div>
          <Badge tone="green">Paid</Badge>
        </div>
        <dl className="dl">
          <div><dt>Receipt no.</dt><dd>{payment.receiptNo}</dd></div>
          <div><dt>Date</dt><dd>{formatDate(payment.date)}</dd></div>
          <div><dt>Student</dt><dd>{payment.studentName}</dd></div>
          <div><dt>Class</dt><dd>{payment.class}</dd></div>
          <div><dt>Student ID</dt><dd>{payment.studentId}</dd></div>
          <div><dt>Payment mode</dt><dd>{payment.mode}</dd></div>
          <div><dt>Towards</dt><dd>Tuition fee · {payment.term}</dd></div>
          <div><dt>Academic year</dt><dd>2026–27</dd></div>
        </dl>
        <div className="receipt__total"><span>Amount received</span><span>{formatINR(payment.amount)}</span></div>
        <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>This is a computer-generated receipt and does not require a signature.</p>
      </div>
    </Modal>
  );
}

export function Fees() {
  const store = useStore();
  const toast = useToast();
  const [tab, setTab] = useState('payments');
  const [mode, setMode] = useState('');
  const [status, setStatus] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [collect, setCollect] = useState(false);
  const { students, payments } = store.state;
  const fs = useMemo(() => feeSummary(students), [students]);
  const monthly = useMemo(() => monthlyCollections(payments), [payments]);
  const pendingByStage = useMemo(() => ['pre-primary', 'primary', 'middle', 'secondary', 'senior-secondary'].map((st) => {
    const ss = students.filter((s) => stageOf(s.class) === st);
    return { label: { 'pre-primary': 'Pre-Pri', primary: 'Primary', middle: 'Middle', secondary: 'Secondary', 'senior-secondary': 'Sr. Sec' }[st], Pending: ss.filter((s) => s.feeStatus !== 'Overdue').reduce((a, s) => a + Math.max(0, s.annualFee / 2 - s.feePaid), 0), Overdue: ss.filter((s) => s.feeStatus === 'Overdue').reduce((a, s) => a + Math.max(0, s.annualFee / 2 - s.feePaid), 0) };
  }), [students]);

  const payRows = payments.filter((p) => !mode || p.mode === mode);
  const payTable = useTable(payRows, { pageSize: 10, searchKeys: ['studentName', 'receiptNo', 'studentId', 'class'] });
  const dueRows = useMemo(() => students.filter((s) => s.feeStatus !== 'Paid' && (!status || s.feeStatus === status)).map((s) => ({ ...s, due: Math.max(0, s.annualFee / 2 - s.feePaid) })), [students, status]);
  const dueTable = useTable(dueRows, { pageSize: 10, searchKeys: ['name', 'id', 'fatherName'], initialSort: { key: 'due', dir: 'desc' } });

  const form = useForm({ studentId: '', amount: '', mode: 'UPI', term: 'Installment 2' }, { studentId: [required('Student'), (v) => (students.some((s) => s.id === v.trim().toUpperCase()) ? '' : 'No student with this ID')], amount: [required('Amount'), positive('Amount')] });
  const record = form.submit((v) => {
    const s = students.find((x) => x.id === v.studentId.trim().toUpperCase());
    const amount = Number(v.amount);
    const n = 4120 + payments.length;
    const pay = store.add('payments', { id: `PAY-${n}`, receiptNo: `KIS/26-27/${n}`, studentId: s.id, studentName: s.name, class: `${s.class}-${s.section}`, amount, mode: v.mode, term: v.term, date: new Date().toISOString(), status: 'Success' });
    const paid = s.feePaid + amount;
    store.patch('students', s.id, { feePaid: paid, feeStatus: paid >= s.annualFee / 2 ? 'Paid' : 'Partial' });
    store.notify('fee', 'Fee payment received', `${formatINR(amount)} from ${s.name} (${s.class}-${s.section}) via ${v.mode}.`);
    store.log('fee', `Fee payment of ${formatINR(amount)} received from ${s.name} (${s.class}-${s.section})`);
    toast('Payment recorded', { text: `${pay.receiptNo} · ${formatINR(amount)}` });
    form.reset();
    setCollect(false);
    setReceipt(pay);
  });
  const sel = students.find((x) => x.id === form.values.studentId.trim().toUpperCase());

  return (
    <>
      <PageHead title="Fees" sub="Academic year 2026–27 · quarterly installments" actions={<>
        <Button variant="outline" icon={BellRing} onClick={() => toast('Reminders sent', { text: `${dueRows.length} parents notified by SMS & app` })}>Send reminders</Button>
        <Button icon={Plus} onClick={() => setCollect(true)}>Record payment</Button>
      </>} />
      <div className="kpis kpis--4">
        <Kpi feature label="Total fees (annual)" value={formatLakh(fs.total)} icon={Wallet} deltaLabel={`${students.length} students`} />
        <Kpi label="Paid fees" value={formatLakh(fs.paid)} icon={IndianRupee} delta={12.4} deltaLabel={`${formatLakh(sumLast(payments, 30))} in last 30 days`} />
        <Kpi label="Pending (due to date)" value={formatLakh(fs.pending)} icon={Clock} tone="gold" deltaLabel="within grace period" />
        <Kpi label="Overdue" value={formatLakh(fs.overdue)} icon={TriangleAlert} tone="red" deltaLabel={`${fs.byStatus[3].count} students`} />
      </div>
      <div className="dash-grid" style={{ marginBottom: 16 }}>
        <ChartCard className="span-7" title="Revenue" sub="Fee receipts by month">
          <Bars data={monthly} series={[{ key: 'Collected', name: 'Collected' }]} format={formatLakh} height={250} />
        </ChartCard>
        <ChartCard className="span-5" title="Pending fees by stage" sub="Outstanding dues to date" legend={[{ label: 'Pending', color: SERIES[1] }, { label: 'Overdue', color: STATUS.critical }]}>
          <Bars stacked data={pendingByStage} series={[{ key: 'Pending', name: 'Pending', color: SERIES[1] }, { key: 'Overdue', name: 'Overdue', color: STATUS.critical }]} format={formatLakh} height={226} />
        </ChartCard>
      </div>
      <section className="card">
        <div className="toolbar">
          <Tabs value={tab} onChange={setTab} tabs={[{ value: 'payments', label: 'Payment history', count: payments.length }, { value: 'dues', label: 'Student-wise dues', count: students.filter((s) => s.feeStatus !== 'Paid').length }]} />
          <div className="toolbar__spacer" />
          {tab === 'payments' ? <>
            <SearchInput value={payTable.query} onChange={payTable.setQuery} placeholder="Student, receipt no." />
            <select className="select" value={mode} onChange={(e) => setMode(e.target.value)} aria-label="Payment mode"><option value="">All modes</option>{['UPI', 'Net Banking', 'Debit Card', 'Credit Card', 'Cheque', 'Cash'].map((m) => <option key={m}>{m}</option>)}</select>
          </> : <>
            <SearchInput value={dueTable.query} onChange={dueTable.setQuery} placeholder="Student, ID, parent" />
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status"><option value="">All dues</option>{['Pending', 'Partial', 'Overdue'].map((m) => <option key={m}>{m}</option>)}</select>
          </>}
        </div>
        {tab === 'payments' ? (
          <DataTable table={payTable} onRowClick={setReceipt} columns={[
            { key: 'receiptNo', label: 'Receipt', render: (p) => <span className="nowrap" style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{p.receiptNo}</span> },
            { key: 'studentName', label: 'Student', render: (p) => <div className="cell-main"><Avatar name={p.studentName} size={32} /><div><strong>{p.studentName}</strong><span>{p.studentId} · {p.class}</span></div></div> },
            { key: 'term', label: 'Towards' },
            { key: 'mode', label: 'Mode' },
            { key: 'date', label: 'Date', sortable: true, render: (p) => <span className="nowrap">{formatDate(p.date)}</span> },
            { key: 'amount', label: 'Amount', align: 'right', sortable: true, render: (p) => <strong>{formatINR(p.amount)}</strong> },
            { key: 'r', label: '', align: 'right', render: (p) => <IconButton icon={Receipt} label="View receipt" onClick={(e) => { e.stopPropagation(); setReceipt(p); }} /> },
          ]} />
        ) : (
          <DataTable table={dueTable} columns={[
            { key: 'name', label: 'Student', sortable: true, render: (s) => <div className="cell-main"><Avatar name={s.name} size={32} /><div><strong>{s.name}</strong><span>{s.id} · {s.class}-{s.section}</span></div></div> },
            { key: 'fatherName', label: 'Parent', render: (s) => <div><div>{s.fatherName}</div><span className="muted" style={{ fontSize: 12.5 }}>{s.phone}</span></div> },
            { key: 'annualFee', label: 'Annual fee', align: 'right', render: (s) => formatINR(s.annualFee) },
            { key: 'feePaid', label: 'Paid', align: 'right', render: (s) => formatINR(s.feePaid) },
            { key: 'due', label: 'Due now', align: 'right', sortable: true, render: (s) => <strong style={{ color: s.feeStatus === 'Overdue' ? 'var(--red-600)' : 'var(--ink-900)' }}>{formatINR(s.due)}</strong> },
            { key: 'feeStatus', label: 'Status', render: (s) => <Badge>{s.feeStatus}</Badge> },
            { key: 'a', label: '', align: 'right', render: (s) => <Button variant="soft" size="xs" icon={BellRing} onClick={() => toast('Reminder sent', { text: `${s.fatherName} · ${formatINR(s.due)} due` })}>Remind</Button> },
          ]} />
        )}
      </section>

      <ReceiptModal payment={receipt} onClose={() => setReceipt(null)} />
      <Modal open={collect} onClose={() => setCollect(false)} title="Record fee payment" description="Generates a receipt and notifies the parent." footer={<><Button variant="ghost" onClick={() => setCollect(false)}>Cancel</Button><Button icon={Receipt} onClick={record}>Record & generate receipt</Button></>}>
        <form className="form-grid" onSubmit={record} noValidate>
          <Input className="span-2" label="Student ID" required placeholder="e.g. KIS0421" list="student-ids" hint={sel ? `${sel.name} · ${sel.class}-${sel.section} · balance due ${formatINR(Math.max(0, sel.annualFee / 2 - sel.feePaid))}` : 'Start typing an ID'} {...form.bind('studentId')} />
          <datalist id="student-ids">{students.slice(0, 400).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</datalist>
          <Input label="Amount (₹)" type="number" required {...form.bind('amount')} />
          <Select label="Mode" options={['UPI', 'Net Banking', 'Debit Card', 'Credit Card', 'Cheque', 'Cash']} {...form.bind('mode')} />
          <Select className="span-2" label="Towards" options={['Installment 1', 'Installment 2', 'Installment 3', 'Installment 4', 'Transport fee', 'Admission fee']} {...form.bind('term')} />
        </form>
      </Modal>
    </>
  );
}
