import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { siteContent, events, announcements, gallery, facilities, programs, whyUs, testimonials } from '@shared/data/content';
import { generateRecords } from '@shared/data/records';
import { uid } from '@shared/utils/format';

// Same shape and API as the website store (src/services/store.jsx), persisted with AsyncStorage.
// Each collection lives under its own key so writes stay small; swap these for API calls later.
const VERSION = 'kleos-app:v2';
const k = (name) => `${VERSION}:${name}`;

const CONTENT = { site: siteContent, events, announcements, gallery, facilities, programs, whyUs, testimonials };

async function loadAll() {
  const names = [...Object.keys(CONTENT), 'records'];
  const pairs = await AsyncStorage.multiGet(names.map(k));
  const saved = Object.fromEntries(pairs.map(([key, v]) => [key.split(':').pop(), v ? JSON.parse(v) : undefined]));
  let records = saved.records;
  if (!records) {
    records = generateRecords();
    // Records are split per collection so no single AsyncStorage value gets large.
    await AsyncStorage.multiSet(Object.entries(records).map(([n, v]) => [k(`r.${n}`), JSON.stringify(v)]).concat([[k('records'), JSON.stringify({ split: true })]]));
  } else {
    const keys = Object.keys(generateRecordsShape);
    const rp = await AsyncStorage.multiGet(keys.map((n) => k(`r.${n}`)));
    records = Object.fromEntries(rp.map(([key, v]) => [key.split(':').pop().slice(2), v ? JSON.parse(v) : undefined]));
  }
  const content = Object.fromEntries(Object.keys(CONTENT).map((n) => [n, saved[n] ?? CONTENT[n]]));
  return { ...content, ...records };
}

const generateRecordsShape = { seededAt: 1, demo: 1, students: 1, payments: 1, teachers: 1, admissions: 1, assignments: 1, messages: 1, notifications: 1, activity: 1, leaves: 1, portalMessages: 1, marks: 1 };
const isRecord = (n) => n in generateRecordsShape;

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(null);
  const dirty = useRef(new Set());

  useEffect(() => {
    loadAll().then(setState).catch(() => setState({ ...CONTENT, ...generateRecords() }));
  }, []);

  useEffect(() => {
    if (!state || !dirty.current.size) return;
    const touched = [...dirty.current];
    dirty.current.clear();
    AsyncStorage.multiSet(touched.map((n) => [k(isRecord(n) ? `r.${n}` : n), JSON.stringify(state[n])])).catch(() => {});
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
      resetDemo: async () => {
        const keys = (await AsyncStorage.getAllKeys()).filter((x) => x.startsWith(VERSION));
        await AsyncStorage.multiRemove(keys);
        setState(await loadAll());
      },
    }),
    [set],
  );

  const value = useMemo(() => ({ state, ready: !!state, ...api }), [state, api]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

// The student shown in the parent/student apps (same demo accounts as the website).
export function useMyStudent(role) {
  const { state } = useStore();
  const id = role === 'parent' ? state.demo.parentChildId : state.demo.studentId;
  return state.students.find((s) => s.id === id) || state.students[0];
}
