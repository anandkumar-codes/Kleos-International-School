import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { siteContent, whyUs, programs, facilities, events, announcements, gallery, testimonials } from '../data/content';
import { generateRecords } from '../data/records';
import { uid } from '../utils/format';

// One store for the whole product. The CMS writes to the same collections the public
// website reads, so content edits appear on the site instantly. Each collection is
// persisted to its own localStorage key — swap `persist`/`load` for API calls later.

const VERSION = 'kleos:v4';
const key = (name) => `${VERSION}:${name}`;

function load(name) {
  try {
    const raw = localStorage.getItem(key(name));
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function persist(name, value) {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
  } catch {
    /* storage full or blocked — app keeps working in memory */
  }
}

function buildInitial() {
  const defaults = {
    site: siteContent,
    whyUs,
    programs,
    facilities,
    events,
    announcements,
    gallery,
    testimonials,
    settings: { schoolOpen: true, emailAlerts: true, smsAlerts: true, admissionsOpen: true, lateFeePerDay: 50, theme: 'Kleos Green' },
  };
  const names = [...Object.keys(defaults), 'records'];
  const state = {};
  let records = load('records');
  if (!records) {
    records = generateRecords();
    persist('records', records);
  }
  names.forEach((n) => {
    if (n === 'records') return;
    state[n] = load(n) ?? defaults[n];
  });
  return { ...state, ...records };
}

const RECORD_KEYS = ['seededAt', 'demo', 'students', 'payments', 'teachers', 'admissions', 'assignments', 'messages', 'notifications', 'activity', 'leaves', 'portalMessages', 'marks'];

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(buildInitial);
  const dirty = useRef(new Set());

  useEffect(() => {
    if (!dirty.current.size) return;
    const touched = [...dirty.current];
    dirty.current.clear();
    const recordsTouched = touched.some((k) => RECORD_KEYS.includes(k));
    touched.filter((k) => !RECORD_KEYS.includes(k)).forEach((k) => persist(k, state[k]));
    if (recordsTouched) persist('records', Object.fromEntries(RECORD_KEYS.map((k) => [k, state[k]])));
  }, [state]);

  const set = useCallback((name, updater) => {
    dirty.current.add(name);
    setState((s) => ({ ...s, [name]: typeof updater === 'function' ? updater(s[name]) : updater }));
  }, []);

  const api = useMemo(
    () => ({
      set,
      add: (name, item, { prepend = true } = {}) => {
        const withId = { id: item.id || uid(name.slice(0, 3)), ...item };
        set(name, (list) => (prepend ? [withId, ...list] : [...list, withId]));
        return withId;
      },
      patch: (name, id, changes) => set(name, (list) => list.map((x) => (x.id === id ? { ...x, ...changes } : x))),
      remove: (name, id) => set(name, (list) => list.filter((x) => x.id !== id)),
      log: (type, text) => set('activity', (list) => [{ id: uid('ac'), type, text, date: new Date().toISOString() }, ...list].slice(0, 40)),
      notify: (type, title, text) => set('notifications', (list) => [{ id: uid('n'), type, title, text, date: new Date().toISOString(), read: false }, ...list]),
      resetDemo: () => {
        Object.keys(localStorage).filter((k) => k.startsWith(VERSION)).forEach((k) => localStorage.removeItem(k));
        window.location.reload();
      },
    }),
    [set],
  );

  const value = useMemo(() => ({ state, ...api }), [state, api]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
