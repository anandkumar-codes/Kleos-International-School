import { TrendingUp, TrendingDown } from 'lucide-react';
import { Breadcrumbs } from '../ui';

export function PageHead({ title, sub, crumbs, actions }) {
  return (
    <div className="page-head">
      <div>
        <Breadcrumbs items={[{ label: 'Admin', to: '/admin' }, ...(crumbs || [{ label: title }])]} />
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {actions && <div className="page-head__actions">{actions}</div>}
    </div>
  );
}

const TONES = {
  green: ['#10624a', '#dff0e8'],
  gold: ['#9a5d00', '#fdf0d8'],
  blue: ['#1d5ea5', '#e2eefb'],
  purple: ['#5d3a9e', '#eee7fa'],
  red: ['#a8262f', '#fbe3e4'],
  teal: ['#0e7490', '#dff3f7'],
};

export function Kpi({ label, value, icon: Icon, delta, deltaLabel, tone = 'green', feature, children }) {
  const [c, bg] = TONES[tone];
  const up = delta >= 0;
  return (
    <div className={`kpi ${feature ? 'kpi--feature' : ''}`} style={{ '--tone': c, '--tone-bg': bg }}>
      <div className="kpi__top">
        <span className="kpi__label">{label}</span>
        {Icon && <span className="kpi__ico"><Icon aria-hidden /></span>}
      </div>
      <div className="kpi__value">{value}</div>
      {(delta != null || deltaLabel) && (
        <div className="kpi__foot">
          {delta != null && (
            <span className={`delta delta--${up ? 'up' : 'down'}`}>
              {up ? <TrendingUp aria-hidden /> : <TrendingDown aria-hidden />}
              {Math.abs(delta)}%
            </span>
          )}
          <span>{deltaLabel}</span>
        </div>
      )}
      {children}
    </div>
  );
}

export function Panel({ title, sub, action, children, className = '', flush }) {
  return (
    <section className={`card ${className}`}>
      {(title || action) && (
        <div className="card__head">
          <div>
            {title && <h3 className="card__title">{title}</h3>}
            {sub && <p className="card__sub">{sub}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={flush ? '' : 'card__body'} style={flush ? { paddingTop: 12 } : undefined}>{children}</div>
    </section>
  );
}
