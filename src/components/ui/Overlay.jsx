import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useLockBody } from '../../hooks';

function useEscape(open, onClose) {
  useEffect(() => {
    if (!open) return;
    const on = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [open, onClose]);
}

export function Modal({ open, onClose, title, description, size, footer, children }) {
  useEscape(open, onClose);
  useLockBody(open);
  const ref = useRef(null);
  useEffect(() => {
    if (open) ref.current?.querySelector('input, select, textarea, button:not(.modal-x)')?.focus();
  }, [open]);
  if (!open) return null;
  return createPortal(
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div ref={ref} className={`modal ${size ? `modal--${size}` : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        {title && (
          <div className="modal__head">
            <div>
              <h3 className="modal__title">{title}</h3>
              {description && <p className="modal__desc">{description}</p>}
            </div>
            <button className="icon-btn modal-x" onClick={onClose} aria-label="Close">
              <X />
            </button>
          </div>
        )}
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__foot">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export function Drawer({ open, onClose, title, description, footer, children }) {
  useEscape(open, onClose);
  useLockBody(open);
  if (!open) return null;
  return createPortal(
    <div className="overlay drawer-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal__head" style={{ paddingBottom: 16, borderBottom: '1px solid var(--line-cool)' }}>
          <div>
            <h3 className="modal__title">{title}</h3>
            {description && <p className="modal__desc">{description}</p>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <div className="modal__body" style={{ flex: 1 }}>{children}</div>
        {footer && <div className="modal__foot">{footer}</div>}
      </aside>
    </div>,
    document.body,
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', text, confirmLabel = 'Delete' }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--danger" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
        </>
      }
    >
      <p className="muted" style={{ fontSize: 14.5 }}>{text}</p>
    </Modal>
  );
}

export function Dropdown({ trigger, children, align = 'right', width }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const on = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', on);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', on);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);
  return (
    <div className="dropdown" ref={ref}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div className="dropdown__menu" style={{ [align]: 0, width }} onClick={(e) => e.target.closest('[data-close]') && setOpen(false)}>
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
        </div>
      )}
    </div>
  );
}
