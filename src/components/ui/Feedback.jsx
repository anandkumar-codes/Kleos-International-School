import { createContext, useCallback, useContext, useState } from 'react';
import { CircleCheck, CircleAlert, Info, X, TriangleAlert, Inbox } from 'lucide-react';

/* ---------- Badge ---------- */
const TONES = {
  Paid: 'green', Active: 'green', Confirmed: 'green', Approved: 'green', Published: 'green', Present: 'green', Success: 'green', Submitted: 'green',
  Pending: 'gold', Partial: 'gold', Late: 'gold', Scheduled: 'blue', 'On Leave': 'gold', Draft: 'gray', Upcoming: 'blue',
  Overdue: 'red', Rejected: 'red', Absent: 'red', Inactive: 'gray', Missed: 'red',
  Enquiry: 'gray', Application: 'blue', 'Document Verification': 'purple', Assessment: 'gold', Interaction: 'purple',
};

export function Badge({ tone, plain, children, className = '' }) {
  const t = tone || TONES[children] || 'gray';
  return <span className={`badge badge--${t} ${plain ? 'badge--plain' : ''} ${className}`}>{children}</span>;
}

/* ---------- Alert ---------- */
const ALERT_ICON = { success: CircleCheck, error: CircleAlert, info: Info, warning: TriangleAlert };
export function Alert({ tone = 'info', title, children, className = '' }) {
  const Icon = ALERT_ICON[tone];
  return (
    <div className={`alert alert--${tone} ${className}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon aria-hidden />
      <div>
        {title && <strong>{title}</strong>}
        {children}
      </div>
    </div>
  );
}

/* ---------- Empty state ---------- */
export function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', text, action }) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icon aria-hidden />
      </div>
      <h4>{title}</h4>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

/* ---------- Skeleton ---------- */
export function Skeleton({ w = '100%', h = 14, r, style }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: r, ...style }} aria-hidden />;
}

export function SkeletonRows({ rows = 6, cols = 5 }) {
  return (
    <div style={{ padding: 20, display: 'grid', gap: 16 }} aria-label="Loading" role="status">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: `40px repeat(${cols - 1}, 1fr)`, gap: 16, alignItems: 'center' }}>
          <Skeleton w={36} h={36} r={18} />
          {Array.from({ length: cols - 1 }).map((__, j) => (
            <Skeleton key={j} w={`${60 + ((i * 7 + j * 13) % 35)}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- Toasts ---------- */
const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));
  const toast = useCallback((title, { tone = 'success', text, duration = 3800 } = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t.slice(-3), { id, title, tone, text }]);
    setTimeout(() => dismiss(id), duration);
  }, []);
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => {
          const Icon = ALERT_ICON[t.tone] || Info;
          return (
            <div key={t.id} className={`toast toast--${t.tone}`}>
              <Icon aria-hidden />
              <div>
                <strong>{t.title}</strong>
                {t.text && <span>{t.text}</span>}
              </div>
              <button className="icon-btn" aria-label="Dismiss" onClick={() => dismiss(t.id)}>
                <X />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/* ---------- Progress ---------- */
export function Progress({ value, color, height }) {
  return (
    <div className="progress" style={height ? { height } : undefined} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${Math.min(100, value)}%`, background: color }} />
    </div>
  );
}
