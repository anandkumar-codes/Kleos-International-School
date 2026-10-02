import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  LayoutTemplate, Info, Calendar, Megaphone, Images, UserRound, Building2, Plus, Pencil, Trash2, Save, ExternalLink, Upload, Pin, RotateCcw, ArrowRight, Eye,
} from 'lucide-react';
import { useStore } from '../../services/store';
import { PageHead, Panel } from '../../components/admin/AdminUI';
import { Button, IconButton, Badge, Modal, ConfirmDialog, Input, Select, Textarea, Field, Switch, SmartImage, Avatar, EmptyState, SearchInput, useForm, useToast, Icon, ICON_NAMES } from '../../components/ui';
import { siteContent } from '../../data/content';
import { galleryCategories } from '../../data/content';
import { required } from '../../utils/validate';
import { readImage } from '../../utils/image';
import { formatDate, formatDay, formatMonth } from '../../utils/format';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: LayoutTemplate },
  { id: 'homepage', label: 'Homepage hero', icon: LayoutTemplate },
  { id: 'about', label: 'About & Principal', icon: Info },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'faculty', label: 'Faculty', icon: UserRound },
  { id: 'facilities', label: 'Facilities', icon: Building2 },
];

/* ---------- Image picker: upload or paste URL ---------- */
function ImageField({ label, value, onChange }) {
  const ref = useRef(null);
  const [err, setErr] = useState('');
  const [over, setOver] = useState(false);
  const handle = async (file) => {
    if (!file) return;
    try { setErr(''); onChange(await readImage(file)); } catch (e) { setErr(e.message); }
  };
  return (
    <Field label={label} error={err}>
      <div style={{ display: 'grid', gap: 10 }}>
        {value && <SmartImage src={value} alt="" style={{ borderRadius: 12, aspectRatio: '16/7', width: '100%' }} />}
        <div style={{ display: 'grid', gap: 8 }}>
          <div className={`dropzone ${over ? 'is-over' : ''}`} onClick={() => ref.current?.click()} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files[0]); }} role="button" tabIndex={0}>
            <Upload /><strong>Click to upload or drag an image</strong><span className="muted" style={{ fontSize: 12.5 }}>JPG, PNG or WebP · resized automatically</span>
          </div>
          <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => handle(e.target.files[0])} />
          <input className="input input--sm" placeholder="…or paste an image URL" value={value?.startsWith('data:') ? '' : value || ''} onChange={(e) => onChange(e.target.value)} aria-label="Image URL" />
        </div>
      </div>
    </Field>
  );
}

/* ---------- Generic collection editor ---------- */
function CollectionEditor({ name, title, fields, empty, schema, renderRow, sort, searchKeys = ['title'] }) {
  const store = useStore();
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [del, setDel] = useState(null);
  const [q, setQ] = useState('');
  const list = (sort ? [...store.state[name]].sort(sort) : store.state[name]).filter((x) => !q || searchKeys.some((k) => String(x[k] || '').toLowerCase().includes(q.toLowerCase())));
  const form = useForm(empty, schema);
  useEffect(() => { if (editing) form.reset(editing === 'new' ? empty : { ...editing, features: Array.isArray(editing.features) ? editing.features.join('\n') : editing.features }); }, [editing]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = form.submit((v) => {
    const data = { ...v };
    if (fields.some((f) => f.type === 'lines')) fields.filter((f) => f.type === 'lines').forEach((f) => { data[f.name] = String(v[f.name] || '').split('\n').map((x) => x.trim()).filter(Boolean); });
    if (editing === 'new') {
      store.add(name, data);
      store.log(name === 'events' ? 'event' : 'announcement', `${title} published: ${data.title || data.name}`);
      toast(`${title} published`, { text: 'Now live on the website.' });
    } else {
      store.patch(name, editing.id, data);
      toast(`${title} updated`, { text: 'Changes are live on the website.' });
    }
    setEditing(null);
  });

  return (
    <Panel title={`${list.length} ${name}`} flush action={<div style={{ display: 'flex', gap: 8 }}><SearchInput value={q} onChange={setQ} placeholder="Search" /><Button icon={Plus} onClick={() => setEditing('new')}>Add {title.toLowerCase()}</Button></div>}>
      {list.map((item) => (
        <div key={item.id} className="list-row">
          {renderRow(item)}
          <div className="row-actions">
            <IconButton icon={Pencil} label="Edit" onClick={() => setEditing(item)} />
            <IconButton icon={Trash2} label="Delete" onClick={() => setDel(item)} />
          </div>
        </div>
      ))}
      {!list.length && <EmptyState title={`No ${name} yet`} text={`Add your first ${title.toLowerCase()} — it will appear on the website immediately.`} action={<Button icon={Plus} onClick={() => setEditing('new')}>Add {title.toLowerCase()}</Button>} />}
      <Modal open={!!editing} onClose={() => setEditing(null)} size="lg" title={editing === 'new' ? `New ${title.toLowerCase()}` : `Edit ${title.toLowerCase()}`} footer={<><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button icon={Save} onClick={save}>{editing === 'new' ? 'Publish' : 'Save changes'}</Button></>}>
        <form className="form-grid" onSubmit={save} noValidate>
          {fields.map((f) => {
            const b = form.bind(f.name);
            const cls = f.full ? 'span-2' : '';
            if (f.type === 'textarea' || f.type === 'lines') return <Textarea key={f.name} className="span-2" label={f.label} hint={f.hint} required={f.required} {...b} />;
            if (f.type === 'select') return <Select key={f.name} className={cls} label={f.label} options={f.options} {...b} />;
            if (f.type === 'image') return <div key={f.name} className="span-2"><ImageField label={f.label} value={form.values[f.name]} onChange={(v) => form.setValues((s) => ({ ...s, [f.name]: v }))} /></div>;
            if (f.type === 'switch') return <label key={f.name} className="span-2" style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 14 }}><Switch checked={!!form.values[f.name]} onChange={(v) => form.setValues((s) => ({ ...s, [f.name]: v }))} label={f.label} />{f.label}</label>;
            if (f.type === 'icon') return <Select key={f.name} className={cls} label={f.label} options={ICON_NAMES} {...b} />;
            return <Input key={f.name} className={cls} type={f.type || 'text'} label={f.label} required={f.required} {...b} />;
          })}
        </form>
      </Modal>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} title={`Delete this ${title.toLowerCase()}?`} text={`“${del?.title || del?.name}” will be removed from the website.`} onConfirm={() => { store.remove(name, del.id); toast(`${title} deleted`, { tone: 'info' }); }} />
    </Panel>
  );
}

/* ---------- Hero ---------- */
function HeroEditor() {
  const store = useStore();
  const toast = useToast();
  const [v, setV] = useState(store.state.site.hero);
  const dirty = JSON.stringify(v) !== JSON.stringify(store.state.site.hero);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target ? e.target.value : e }));
  return (
    <div className="dash-grid">
      <Panel className="span-6" title="Hero content" sub="The first thing every visitor sees">
        <div style={{ display: 'grid', gap: 16 }}>
          <Input label="Eyebrow / trust line" value={v.eyebrow} onChange={set('eyebrow')} />
          <Input label="Headline" value={v.title} onChange={set('title')} hint="The last two words are shown in gold italic." />
          <Textarea label="Description" value={v.subtitle} onChange={set('subtitle')} />
          <div className="form-grid">
            <Input label="Primary button" value={v.primaryCta} onChange={set('primaryCta')} />
            <Input label="Secondary button" value={v.secondaryCta} onChange={set('secondaryCta')} />
          </div>
          <ImageField label="Background image" value={v.image} onChange={set('image')} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="ghost" icon={RotateCcw} onClick={() => setV(siteContent.hero)}>Restore default</Button>
            <Button icon={Save} disabled={!dirty} onClick={() => { store.set('site', (s) => ({ ...s, hero: v })); store.log('announcement', 'Homepage hero updated'); toast('Homepage updated', { text: 'Your changes are live.' }); }}>Publish changes</Button>
          </div>
        </div>
      </Panel>
      <Panel className="span-6" title="Live preview" action={<Button variant="ghost" size="sm" icon={ExternalLink} href="/" target="_blank" rel="noreferrer">Open site</Button>}>
        <div className="cms-preview">
          <SmartImage src={v.image} alt="" />
          <div className="cms-preview__body">
            <span className="badge badge--plain" style={{ background: 'rgba(255,255,255,.15)', color: '#fff' }}>{v.eyebrow}</span>
            <h2 style={{ marginTop: 10 }}>{v.title}</h2>
            <p>{v.subtitle}</p>
            <span className="btn btn--gold">{v.primaryCta}</span>
            <span className="btn btn--glass">{v.secondaryCta}</span>
          </div>
        </div>
        {dirty && <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>● Unpublished changes</p>}
      </Panel>
    </div>
  );
}

/* ---------- About ---------- */
function AboutEditor() {
  const store = useStore();
  const toast = useToast();
  const [a, setA] = useState(store.state.site.about);
  const [p, setP] = useState(store.state.site.principal);
  const save = () => { store.set('site', (s) => ({ ...s, about: a, principal: p })); toast('About content updated', { text: 'Live on Home and About pages.' }); };
  return (
    <div className="dash-grid">
      <Panel className="span-6" title="School description">
        <div style={{ display: 'grid', gap: 16 }}>
          <Textarea label="Introduction" value={a.intro} onChange={(e) => setA({ ...a, intro: e.target.value })} />
          <Textarea label="Our story" value={a.story} onChange={(e) => setA({ ...a, story: e.target.value })} />
          <Textarea label="Vision" value={a.vision} onChange={(e) => setA({ ...a, vision: e.target.value })} />
          <Textarea label="Mission" value={a.mission} onChange={(e) => setA({ ...a, mission: e.target.value })} />
        </div>
      </Panel>
      <Panel className="span-6" title="Principal's message">
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="form-grid">
            <Input label="Name" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} />
            <Input label="Designation" value={p.designation} onChange={(e) => setP({ ...p, designation: e.target.value })} />
          </div>
          <Input label="Qualification line" value={p.qualification} onChange={(e) => setP({ ...p, qualification: e.target.value })} />
          <Textarea label="Message" value={p.message} onChange={(e) => setP({ ...p, message: e.target.value })} style={{ minHeight: 180 }} />
          <ImageField label="Principal photograph" value={p.image} onChange={(v) => setP({ ...p, image: v })} />
          <div style={{ textAlign: 'right' }}><Button icon={Save} onClick={save}>Publish changes</Button></div>
        </div>
      </Panel>
    </div>
  );
}

/* ---------- Gallery ---------- */
function GalleryEditor() {
  const store = useStore();
  const toast = useToast();
  const ref = useRef(null);
  const [cat, setCat] = useState('Campus');
  const [filter, setFilter] = useState('All');
  const [busy, setBusy] = useState(false);
  const [del, setDel] = useState(null);
  const [over, setOver] = useState(false);
  const list = store.state.gallery.filter((g) => filter === 'All' || g.category === filter);
  const upload = async (files) => {
    setBusy(true);
    let ok = 0;
    for (const f of [...files]) {
      try { const image = await readImage(f, 1200, 0.75); store.add('gallery', { title: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '), category: cat, image }); ok++; }
      catch (e) { toast('Upload failed', { tone: 'error', text: `${f.name}: ${e.message}` }); }
    }
    setBusy(false);
    if (ok) toast(`${ok} photo${ok > 1 ? 's' : ''} uploaded`, { text: `Added to ${cat}` });
  };
  return (
    <Panel title={`${store.state.gallery.length} photos`} action={<div style={{ display: 'flex', gap: 8 }}><select className="select select--sm" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter"><option>All</option>{galleryCategories.map((c) => <option key={c}>{c}</option>)}</select></div>}>
      <div className={`dropzone ${over ? 'is-over' : ''}`} style={{ marginBottom: 18 }} onClick={() => !busy && ref.current?.click()} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files); }} role="button" tabIndex={0}>
        {busy ? <span className="spinner" style={{ width: 24, height: 24, border: '3px solid currentColor', borderRightColor: 'transparent', borderRadius: '50%', animation: 'spin .7s linear infinite' }} /> : <Upload />}
        <strong>{busy ? 'Uploading…' : 'Drop photos here or click to upload'}</strong>
        <span onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>Category
          <select className="select select--sm" style={{ width: 160 }} value={cat} onChange={(e) => setCat(e.target.value)}>{galleryCategories.map((c) => <option key={c}>{c}</option>)}</select>
        </span>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
      <div className="img-grid">
        {list.map((g) => (
          <div key={g.id} className="img-tile">
            <SmartImage src={g.image} alt={g.title} />
            <div className="img-tile__actions"><button aria-label="Delete photo" onClick={() => setDel(g)}><Trash2 /></button></div>
            <div className="img-tile__body">
              <input className="input input--sm" style={{ height: 30, fontSize: 13, padding: '0 8px' }} defaultValue={g.title} onBlur={(e) => e.target.value !== g.title && store.patch('gallery', g.id, { title: e.target.value })} aria-label="Caption" />
              <select className="select select--sm" style={{ height: 30, fontSize: 12.5, marginTop: 6 }} value={g.category} onChange={(e) => store.patch('gallery', g.id, { category: e.target.value })} aria-label="Category">{galleryCategories.map((c) => <option key={c}>{c}</option>)}</select>
            </div>
          </div>
        ))}
      </div>
      {!list.length && <EmptyState icon={Images} title="No photos in this category" />}
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} title="Delete photo?" text={`“${del?.title}” will be removed from the gallery.`} onConfirm={() => { store.remove('gallery', del.id); toast('Photo deleted', { tone: 'info' }); }} />
    </Panel>
  );
}

/* ---------- Faculty (website visibility) ---------- */
function FacultyEditor() {
  const store = useStore();
  const [q, setQ] = useState('');
  const list = store.state.teachers.filter((t) => !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.department.toLowerCase().includes(q.toLowerCase()));
  const shown = store.state.teachers.filter((t) => t.showOnWebsite).length;
  return (
    <Panel title="Faculty on website" sub={`${shown} profiles shown in the public directory`} flush action={<div style={{ display: 'flex', gap: 8 }}><SearchInput value={q} onChange={setQ} placeholder="Search staff" /><Button variant="outline" icon={Plus} to="/admin/teachers">Add / edit staff</Button></div>}>
      {list.slice(0, 40).map((t) => (
        <div key={t.id} className="list-row">
          <Avatar name={t.name} size={38} />
          <div className="grow"><strong>{t.name}</strong><p>{t.designation} · {t.qualification} · {t.experience} yrs</p></div>
          <Badge tone="gray" plain>{t.department}</Badge>
          <Switch checked={t.showOnWebsite} onChange={(v) => store.patch('teachers', t.id, { showOnWebsite: v })} label={`Show ${t.name} on website`} />
        </div>
      ))}
    </Panel>
  );
}

/* ---------- Overview ---------- */
function Overview() {
  const { state } = useStore();
  const nav = useNavigate();
  const cards = [
    ['homepage', 'Homepage hero', state.site.hero.title, LayoutTemplate],
    ['about', 'About & Principal', state.site.principal.name, Info],
    ['events', 'Events', `${state.events.length} events`, Calendar],
    ['announcements', 'Announcements', `${state.announcements.length} notices`, Megaphone],
    ['gallery', 'Gallery', `${state.gallery.length} photos`, Images],
    ['faculty', 'Faculty', `${state.teachers.filter((t) => t.showOnWebsite).length} public profiles`, UserRound],
    ['facilities', 'Facilities', `${state.facilities.length} facilities`, Building2],
  ];
  return (
    <div className="report-grid">
      {cards.map(([id, label, meta, I]) => (
        <button key={id} className="card report-card" style={{ textAlign: 'left' }} onClick={() => nav(`/admin/content/${id}`)}>
          <span className="report-card__ico" style={{ background: 'var(--green-50)', color: 'var(--green-700)' }}><I /></span>
          <h3>{label}</h3>
          <p>{meta}</p>
          <span className="text-link" style={{ fontSize: 13.5 }}>Manage <ArrowRight /></span>
        </button>
      ))}
    </div>
  );
}

export default function Content() {
  const { section = 'overview' } = useParams();
  const nav = useNavigate();
  const active = SECTIONS.find((s) => s.id === section) || SECTIONS[0];
  const views = {
    overview: <Overview />,
    homepage: <HeroEditor />,
    about: <AboutEditor />,
    gallery: <GalleryEditor />,
    faculty: <FacultyEditor />,
    events: (
      <CollectionEditor name="events" title="Event" sort={(a, b) => new Date(b.date) - new Date(a.date)}
        empty={{ title: '', date: '', time: '', location: '', category: 'Academic', image: '', description: '' }}
        schema={{ title: [required('Title')], date: [required('Date')], location: [required('Location')], description: [required('Description')] }}
        fields={[{ name: 'title', label: 'Event title', required: true, full: true }, { name: 'date', label: 'Date', type: 'date', required: true }, { name: 'time', label: 'Time', }, { name: 'location', label: 'Venue', required: true }, { name: 'category', label: 'Category', type: 'select', options: ['Academic', 'Cultural', 'Sports', 'Celebration', 'National'] }, { name: 'description', label: 'Description', type: 'textarea', required: true }, { name: 'image', label: 'Cover image', type: 'image' }]}
        renderRow={(e) => <>
          <div className="mini-date"><b>{formatDay(e.date)}</b><span>{formatMonth(e.date)}</span></div>
          <SmartImage src={e.image} alt="" style={{ width: 64, height: 48, borderRadius: 8, flex: 'none' }} />
          <div className="grow"><strong>{e.title}</strong><p>{e.time} · {e.location}</p></div>
          <Badge tone={new Date(e.date) >= new Date(new Date().toDateString()) ? 'blue' : 'gray'}>{new Date(e.date) >= new Date(new Date().toDateString()) ? 'Upcoming' : 'Past'}</Badge>
        </>} />
    ),
    announcements: (
      <CollectionEditor name="announcements" title="Announcement" sort={(a, b) => Number(!!b.pinned) - Number(!!a.pinned) || new Date(b.date) - new Date(a.date)}
        empty={{ title: '', body: '', category: 'General', date: new Date().toISOString().slice(0, 10), pinned: false }}
        schema={{ title: [required('Title')], body: [required('Message')], date: [required('Date')] }}
        fields={[{ name: 'title', label: 'Headline', required: true, full: true }, { name: 'category', label: 'Category', type: 'select', options: ['General', 'Admissions', 'Holiday', 'Examination', 'Parents', 'Achievement'] }, { name: 'date', label: 'Publish date', type: 'date', required: true }, { name: 'body', label: 'Message', type: 'textarea', required: true }, { name: 'pinned', label: 'Pin to top of notice board', type: 'switch' }]}
        renderRow={(a) => <>
          <span className="kpi__ico" style={{ width: 40, height: 40, borderRadius: 12 }}>{a.pinned ? <Pin /> : <Megaphone />}</span>
          <div className="grow"><strong>{a.title}</strong><p>{a.body}</p></div>
          <Badge tone="green" plain>{a.category}</Badge>
          <span className="muted nowrap" style={{ fontSize: 12.5 }}>{formatDate(a.date)}</span>
        </>} />
    ),
    facilities: (
      <CollectionEditor name="facilities" title="Facility" searchKeys={['name']}
        empty={{ name: '', icon: 'School', short: '', description: '', features: '', image: '' }}
        schema={{ name: [required('Name')], short: [required('Short description')], description: [required('Description')] }}
        fields={[{ name: 'name', label: 'Facility name', required: true }, { name: 'icon', label: 'Icon', type: 'icon' }, { name: 'short', label: 'One-line summary', required: true, full: true }, { name: 'description', label: 'Description', type: 'textarea', required: true }, { name: 'features', label: 'Key features (one per line)', type: 'lines', hint: 'Shown as a checklist on the Facilities page' }, { name: 'image', label: 'Photo', type: 'image' }]}
        renderRow={(f) => <>
          <SmartImage src={f.image} alt="" style={{ width: 64, height: 48, borderRadius: 8, flex: 'none' }} />
          <div className="grow"><strong style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name={f.icon} size={16} color="var(--green-600)" />{f.name}</strong><p>{f.short}</p></div>
          <Badge tone="gray" plain>{f.features?.length || 0} features</Badge>
        </>} />
    ),
  };
  return (
    <>
      <PageHead title="Website Content" sub="Manage everything on kleosschool.in — changes go live instantly" crumbs={[{ label: 'Website Content', to: '/admin/content' }, ...(active.id !== 'overview' ? [{ label: active.label }] : [])]}
        actions={<Button variant="outline" icon={Eye} href="/" target="_blank" rel="noreferrer">Preview website</Button>} />
      <div className="cms">
        <nav className="card cms-nav" aria-label="Content sections">
          {SECTIONS.map((s) => (
            <button key={s.id} className={s.id === active.id ? 'is-active' : ''} onClick={() => nav(s.id === 'overview' ? '/admin/content' : `/admin/content/${s.id}`)}><s.icon />{s.label}</button>
          ))}
        </nav>
        <div style={{ minWidth: 0 }}>{views[active.id]}</div>
      </div>
    </>
  );
}

