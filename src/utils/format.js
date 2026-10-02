const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('en-IN');

export const formatINR = (v) => inr.format(Math.round(v || 0));
export const formatNumber = (v) => num.format(v || 0);

// ₹18.4L / ₹1.2Cr style compact Indian notation
export function formatLakh(v) {
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2).replace(/\.?0+$/, '')}Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(1).replace(/\.0$/, '')}L`;
  if (v >= 1e3) return `₹${(v / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
  return `₹${Math.round(v)}`;
}

export const toDate = (d) => (d instanceof Date ? d : new Date(d));

export const formatDate = (d, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  toDate(d).toLocaleDateString('en-IN', opts);

export const formatDay = (d) => toDate(d).toLocaleDateString('en-IN', { day: '2-digit' });
export const formatMonth = (d) => toDate(d).toLocaleDateString('en-IN', { month: 'short' });
export const formatWeekday = (d) => toDate(d).toLocaleDateString('en-IN', { weekday: 'long' });

export function timeAgo(d) {
  const diff = (Date.now() - toDate(d).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(d);
}

export const isoDate = (d) => {
  const x = toDate(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};

export const initials = (name = '') =>
  name
    .replace(/^(Dr|Mr|Mrs|Ms)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

export const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const pct = (v, digits = 1) => `${Number(v).toFixed(digits)}%`;

export function gradeFor(score) {
  if (score >= 91) return 'A1';
  if (score >= 81) return 'A2';
  if (score >= 71) return 'B1';
  if (score >= 61) return 'B2';
  if (score >= 51) return 'C1';
  if (score >= 41) return 'C2';
  if (score >= 33) return 'D';
  return 'E';
}
