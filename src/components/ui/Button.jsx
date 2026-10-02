import { Link } from 'react-router-dom';

export function Button({ variant = 'primary', size, block, icon: Icon, iconRight: IconRight, loading, to, href, className = '', children, ...rest }) {
  const cls = ['btn', `btn--${variant}`, size && `btn--${size}`, block && 'btn--block', !children && 'btn--icon', className].filter(Boolean).join(' ');
  const inner = (
    <>
      {loading ? <span className="spinner" aria-hidden /> : Icon && <Icon aria-hidden />}
      {children}
      {IconRight && !loading && <IconRight className="btn-arrow" aria-hidden />}
    </>
  );
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{inner}</a>;
  return (
    <button type="button" className={cls} disabled={loading || rest.disabled} aria-busy={loading || undefined} {...rest}>
      {inner}
    </button>
  );
}

export function IconButton({ icon: Icon, label, badge, className = '', ...rest }) {
  return (
    <button type="button" className={`icon-btn ${className}`} aria-label={label} title={label} {...rest}>
      <Icon aria-hidden />
      {badge ? <span className="dot">{badge > 9 ? '9+' : badge}</span> : null}
    </button>
  );
}
