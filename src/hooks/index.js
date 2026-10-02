import { useEffect, useMemo, useRef, useState } from 'react';

// Fires once when the element scrolls into view.
export function useInView(options = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (!('IntersectionObserver' in window)) return setInView(true);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps
  return [ref, inView];
}

export function useCountUp(target, start, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setValue(target);
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return value;
}

export function useDebounce(value, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > offset);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [offset]);
  return scrolled;
}

// Search + sort + paginate a list in one place, for every data table.
export function useTable(rows, { pageSize = 10, searchKeys = [], initialSort = null } = {}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);
  const q = useDebounce(query, 150);

  const filtered = useMemo(() => {
    let out = rows;
    if (q) {
      const s = q.toLowerCase();
      out = out.filter((r) => searchKeys.some((k) => String(typeof k === 'function' ? k(r) : r[k] ?? '').toLowerCase().includes(s)));
    }
    if (sort) {
      const { key, dir } = sort;
      out = [...out].sort((a, b) => {
        const va = typeof key === 'function' ? key(a) : a[key];
        const vb = typeof key === 'function' ? key(b) : b[key];
        if (va === vb) return 0;
        return (va > vb ? 1 : -1) * (dir === 'asc' ? 1 : -1);
      });
    }
    return out;
  }, [rows, q, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages);
  useEffect(() => setPage(1), [q, rows.length]);

  return {
    query,
    setQuery,
    sort,
    toggleSort: (key) => setSort((s) => (s && s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })),
    page: current,
    setPage,
    pages,
    total: filtered.length,
    filtered,
    rows: filtered.slice((current - 1) * pageSize, current * pageSize),
    pageSize,
  };
}

export function useHotkey(combo, handler) {
  useEffect(() => {
    const on = (e) => {
      const want = combo.toLowerCase().split('+');
      const keyMatch = e.key.toLowerCase() === want[want.length - 1];
      const mod = want.includes('mod') ? e.ctrlKey || e.metaKey : true;
      if (keyMatch && mod) {
        e.preventDefault();
        handler(e);
      }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [combo, handler]);
}

export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}
