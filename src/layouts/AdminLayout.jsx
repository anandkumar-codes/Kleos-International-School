import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, UsersRound, UserRound, Layers, CalendarCheck, ClipboardList, Wallet, FileText, NotebookPen, Calendar,
  Megaphone, Images, Building2, PanelsTopLeft, MessageSquare, ChartColumn, Settings, Search, Bell, Menu, PanelLeftClose, PanelLeft,
  LogOut, ExternalLink, UserPlus, IndianRupee, TriangleAlert, CornerDownLeft, ArrowUpDown, User, RotateCcw, GraduationCap,
} from 'lucide-react';
import { LogoMark, IconButton, Avatar, Dropdown, EmptyState } from '../components/ui';
import { useStore } from '../services/store';
import { useAuth } from '../services/auth';
import { useHotkey, useLockBody } from '../hooks';
import { timeAgo } from '../utils/format';

export const ADMIN_NAV = [
  { label: 'Overview', items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }] },
  { label: 'People', items: [
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/parents', label: 'Parents', icon: UsersRound },
    { to: '/admin/teachers', label: 'Teachers', icon: UserRound },
    { to: '/admin/classes', label: 'Classes', icon: Layers },
  ] },
  { label: 'Academics', items: [
    { to: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/admin/examinations', label: 'Examinations', icon: FileText },
    { to: '/admin/assignments', label: 'Assignments', icon: NotebookPen },
  ] },
  { label: 'Office', items: [
    { to: '/admin/admissions', label: 'Admissions', icon: ClipboardList, badge: 'admissions' },
    { to: '/admin/fees', label: 'Fees', icon: Wallet },
  ] },
  { label: 'Website', items: [
    { to: '/admin/content', label: 'Website Content', icon: PanelsTopLeft, end: true },
    { to: '/admin/content/events', label: 'Events', icon: Calendar },
    { to: '/admin/content/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/admin/content/gallery', label: 'Gallery', icon: Images },
    { to: '/admin/content/facilities', label: 'Facilities', icon: Building2 },
  ] },
  { label: 'Communication', items: [
    { to: '/admin/messages', label: 'Messages', icon: MessageSquare, badge: 'messages' },
    { to: '/admin/notifications', label: 'Notifications', icon: Bell, badge: 'notifications' },
    { to: '/admin/reports', label: 'Reports', icon: ChartColumn },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ] },
];

export const NOTIF_ICON = {
  admission: [ClipboardList, '#2d7dd2', '#e2eefb'],
  fee: [IndianRupee, '#177a5b', '#dff0e8'],
  message: [MessageSquare, '#7f56c8', '#eee7fa'],
  attendance: [TriangleAlert, '#c8323c', '#fbe3e4'],
  student: [UserPlus, '#0e7490', '#dff3f7'],
  event: [Calendar, '#d98a10', '#fdf0d8'],
  teacher: [UserRound, '#10624a', '#dff0e8'],
  announcement: [Megaphone, '#d98a10', '#fdf0d8'],
  exam: [FileText, '#2d7dd2', '#e2eefb'],
};

export function NotifIcon({ type }) {
  const [I, c, bg] = NOTIF_ICON[type] || NOTIF_ICON.event;
  return <span className="feed__ico" style={{ color: c, background: bg }}><I /></span>;
}

/* ---------------- Ctrl+K command palette ---------------- */
function CommandPalette({ open, onClose }) {
  const { state } = useStore();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  useLockBody(open);
  useEffect(() => { if (open) { setQ(''); setActive(0); } }, [open]);

  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    const pages = ADMIN_NAV.flatMap((g) => g.items).map((i) => ({ id: i.to, title: i.label, sub: 'Go to page', icon: i.icon, to: i.to }));
    if (!s) return [{ label: 'Quick navigation', items: pages.slice(0, 8) }];
    const match = (...f) => f.some((x) => String(x ?? '').toLowerCase().includes(s));
    const g = [
      { label: 'Pages', items: pages.filter((p) => match(p.title)) },
      { label: 'Students', items: state.students.filter((x) => match(x.name, x.id, x.fatherName, x.phone)).slice(0, 6).map((x) => ({ id: x.id, title: x.name, sub: `${x.id} · ${x.class}-${x.section} · ${x.fatherName}`, icon: Users, to: `/admin/students?open=${x.id}` })) },
      { label: 'Teachers', items: state.teachers.filter((x) => match(x.name, x.department, x.designation)).slice(0, 5).map((x) => ({ id: x.id, title: x.name, sub: `${x.designation} · ${x.department}`, icon: UserRound, to: `/admin/teachers?open=${x.id}` })) },
      { label: 'Admissions', items: state.admissions.filter((x) => match(x.studentName, x.parentName, x.id)).slice(0, 5).map((x) => ({ id: x.id, title: x.studentName, sub: `${x.id} · ${x.class} · ${x.stage}`, icon: ClipboardList, to: `/admin/admissions?open=${x.id}` })) },
      { label: 'Events', items: state.events.filter((x) => match(x.title, x.location)).slice(0, 4).map((x) => ({ id: x.id, title: x.title, sub: `${x.date} · ${x.location}`, icon: Calendar, to: '/admin/content/events' })) },
      { label: 'Announcements', items: state.announcements.filter((x) => match(x.title, x.body)).slice(0, 4).map((x) => ({ id: x.id, title: x.title, sub: x.category, icon: Megaphone, to: '/admin/content/announcements' })) },
    ];
    return g.filter((x) => x.items.length);
  }, [q, state]);

  const flat = groups.flatMap((g) => g.items);
  const go = (it) => { onClose(); nav(it.to); };

  useEffect(() => {
    listRef.current?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;
  let idx = -1;
  return createPortal(
    <div className="overlay cmdk-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cmdk" role="dialog" aria-modal="true" aria-label="Global search">
        <div className="cmdk__input">
          <Search aria-hidden />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            placeholder="Search students, teachers, admissions, events…"
            aria-label="Search"
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(flat.length - 1, a + 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
              if (e.key === 'Enter' && flat[active]) go(flat[active]);
              if (e.key === 'Escape') onClose();
            }}
          />
          <kbd>ESC</kbd>
        </div>
        <div className="cmdk__list" ref={listRef}>
          {!flat.length && <EmptyState icon={Search} title="No results" text={`Nothing matches “${q}”. Try a name, ID or phone number.`} />}
          {groups.map((g) => (
            <div key={g.label}>
              <div className="cmdk__group">{g.label}</div>
              {g.items.map((it) => {
                idx += 1;
                const i = idx;
                return (
                  <button key={g.label + it.id} className={`cmdk__item ${i === active ? 'is-active' : ''}`} onMouseEnter={() => setActive(i)} onClick={() => go(it)}>
                    <span className="ico"><it.icon /></span>
                    <span style={{ minWidth: 0 }}><strong>{it.title}</strong><span>{it.sub}</span></span>
                    {i === active && <kbd><CornerDownLeft size={11} /></kbd>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cmdk__foot">
          <span><kbd><ArrowUpDown size={11} /></kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Ctrl K</kbd> toggle</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ---------------- Notifications dropdown ---------------- */
function NotificationMenu() {
  const { state, set } = useStore();
  const unread = state.notifications.filter((n) => !n.read).length;
  const markAll = () => set('notifications', (l) => l.map((n) => ({ ...n, read: true })));
  return (
    <Dropdown trigger={({ toggle }) => <IconButton icon={Bell} label={`Notifications (${unread} unread)`} badge={unread} onClick={toggle} />}>
      {({ close }) => (
        <div className="notif">
          <div className="notif__head">
            <strong>Notifications</strong>
            {unread > 0 && <button className="text-link" style={{ fontSize: 13 }} onClick={markAll}>Mark all read</button>}
          </div>
          <div className="notif__list">
            {state.notifications.slice(0, 8).map((n) => (
              <button key={n.id} className={`notif__item ${n.read ? '' : 'is-unread'}`} onClick={() => set('notifications', (l) => l.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}>
                <NotifIcon type={n.type} />
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.text}</p>
                  <small>{timeAgo(n.date)}</small>
                </div>
              </button>
            ))}
            {!state.notifications.length && <EmptyState icon={Bell} title="You're all caught up" />}
          </div>
          <div className="notif__foot"><Link to="/admin/notifications" className="text-link" style={{ fontSize: 13.5 }} onClick={close}>View all notifications</Link></div>
        </div>
      )}
    </Dropdown>
  );
}

export default function AdminLayout() {
  const { state, resetDemo } = useStore();
  const { session, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('kleos:sb') === '1');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdk, setCmdk] = useState(false);
  useHotkey('mod+k', useCallback(() => setCmdk((o) => !o), []));
  useEffect(() => { setMobileOpen(false); window.scrollTo(0, 0); }, [loc.pathname]);
  useEffect(() => { try { localStorage.setItem('kleos:sb', collapsed ? '1' : '0'); } catch { /* ignore */ } }, [collapsed]);

  const badges = {
    admissions: state.admissions.filter((a) => a.stage === 'Enquiry').length,
    messages: state.messages.filter((m) => !m.read).length,
    notifications: state.notifications.filter((n) => !n.read).length,
  };

  return (
    <div className={`app ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
      <aside className="sidebar" aria-label="Admin navigation">
        <Link to="/admin" className="sidebar__brand logo">
          <LogoMark size={38} />
          <span className="logo__text"><span className="logo__name">KLEOS</span><span className="logo__sub">School Admin</span></span>
        </Link>
        <nav className="sidebar__nav">
          {ADMIN_NAV.map((g) => (
            <div className="sb-group" key={g.label}>
              <div className="sb-label">{g.label}</div>
              {g.items.map((it) => (
                <NavLink key={it.to} to={it.to} end={it.end} className="sb-link" title={collapsed ? it.label : undefined}>
                  <it.icon aria-hidden />
                  <span className="sb-text">{it.label}</span>
                  {it.badge && badges[it.badge] > 0 && <span className="sb-count">{badges[it.badge]}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar__foot">
          <div className="sb-card"><strong>Academic Year 2026–27</strong>Term I · Week 17</div>
          <a className="sb-link" href="/" target="_blank" rel="noreferrer" title="View website"><ExternalLink aria-hidden /><span className="sb-text">View website</span></a>
        </div>
      </aside>
      {mobileOpen && <div className="sb-scrim" onClick={() => setMobileOpen(false)} />}

      <div className="app-main">
        <header className="app-top">
          <IconButton className="mobile-only" icon={Menu} label="Open navigation" onClick={() => setMobileOpen(true)} />
          <IconButton className="desktop-only" icon={collapsed ? PanelLeft : PanelLeftClose} label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={() => setCollapsed((c) => !c)} />
          <button className="search-trigger" onClick={() => setCmdk(true)} aria-label="Open global search (Ctrl+K)">
            <Search aria-hidden /> <span>Search students, teachers, admissions…</span> <kbd>Ctrl K</kbd>
          </button>
          <div className="app-top__right">
            <NotificationMenu />
            <IconButton icon={MessageSquare} label="Messages" badge={badges.messages} onClick={() => nav('/admin/messages')} />
            <Dropdown trigger={({ toggle }) => (
              <button className="user-chip" onClick={toggle} aria-label="Account menu">
                <Avatar name={session?.name} size={36} />
                <div><strong>{session?.name}</strong><span>{session?.title}</span></div>
              </button>
            )}>
              <Link to="/admin/settings" className="dropdown__item" data-close><User /> Profile & settings</Link>
              <a href="/" target="_blank" rel="noreferrer" className="dropdown__item" data-close><ExternalLink /> View public website</a>
              <Link to="/portal/parent" className="dropdown__item" data-close onClick={(e) => { e.preventDefault(); nav('/login?role=parent'); }}><GraduationCap /> Open parent portal</Link>
              <button className="dropdown__item" onClick={resetDemo}><RotateCcw /> Reset demo data</button>
              <div className="dropdown__sep" />
              <button className="dropdown__item dropdown__item--danger" onClick={() => { logout(); nav('/login?role=admin'); }}><LogOut /> Sign out</button>
            </Dropdown>
          </div>
        </header>
        <main className="app-page" key={loc.pathname}>
          <Outlet />
        </main>
      </div>
      <CommandPalette open={cmdk} onClose={() => setCmdk(false)} />
    </div>
  );
}
