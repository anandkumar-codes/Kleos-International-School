import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import { useInView, useLockBody } from '../../hooks';
import { Breadcrumbs, SmartImage, Modal, Badge, Button } from '../ui';
import { formatDate, formatDay, formatMonth } from '../../utils/format';

export function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

export function SectionHead({ eyebrow, title, text, center, action }) {
  return (
    <Reveal className={`section-head ${center ? 'section-head--center' : ''}`}>
      <div className="section-head__text">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 dangerouslySetInnerHTML={{ __html: title }} />
        {text && <p>{text}</p>}
      </div>
      {action}
    </Reveal>
  );
}

export function PageHero({ title, text, image, crumbs }) {
  return (
    <section className="page-hero">
      {image && <SmartImage src={image} alt="" eager />}
      <div className="container" style={{ animation: 'fadeUp .8s var(--ease) both' }}>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, ...crumbs]} />
        <h1 dangerouslySetInnerHTML={{ __html: title }} />
        {text && <p>{text}</p>}
      </div>
    </section>
  );
}

export function Lightbox({ items, index, onClose, onIndex }) {
  useLockBody(index != null);
  useEffect(() => {
    if (index == null) return;
    const on = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [index, items.length, onClose, onIndex]);
  if (index == null || !items[index]) return null;
  const it = items[index];
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={it.title} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="lb-btn lb-close" onClick={onClose} aria-label="Close"><X /></button>
      <button className="lb-btn lb-prev" onClick={() => onIndex((index - 1 + items.length) % items.length)} aria-label="Previous"><ChevronLeft /></button>
      <button className="lb-btn lb-next" onClick={() => onIndex((index + 1) % items.length)} aria-label="Next"><ChevronRight /></button>
      <div className="lightbox__img" key={it.id}>
        <SmartImage src={it.image.replace('w=1200', 'w=1800')} alt={it.title} eager />
      </div>
      <div className="lightbox__cap">
        {it.title}
        <span>{it.category} · {index + 1} of {items.length}</span>
      </div>
    </div>,
    document.body,
  );
}

export function DateBlock({ date }) {
  return (
    <div className="date-block">
      <b>{formatDay(date)}</b>
      <span>{formatMonth(date)}</span>
    </div>
  );
}

export function EventModal({ event, onClose }) {
  if (!event) return null;
  const past = new Date(event.date) < new Date(new Date().toDateString());
  return (
    <Modal open={!!event} onClose={onClose} title={event.title} size="lg">
      <SmartImage src={event.image} alt={event.title} ratio="16/7" style={{ borderRadius: 16, marginBottom: 20 }} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <Badge tone="green" plain>{event.category}</Badge>
        <Badge tone={past ? 'gray' : 'blue'}>{past ? 'Completed' : 'Upcoming'}</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 18 }}>
        {[
          [Calendar, 'Date', formatDate(event.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
          [Clock, 'Time', event.time],
          [MapPin, 'Venue', event.location],
        ].map(([I, l, v]) => (
          <div key={l} className="c-card" style={{ padding: 14 }}>
            <I />
            <div><small>{l}</small><strong style={{ fontSize: 14 }}>{v}</strong></div>
          </div>
        ))}
      </div>
      <p style={{ color: 'var(--ink-700)', lineHeight: 1.75 }}>{event.description}</p>
      {!past && (
        <div style={{ marginTop: 20 }}>
          <Button variant="soft" size="sm" icon={Calendar} onClick={() => addToCalendar(event)}>Add to calendar</Button>
        </div>
      )}
    </Modal>
  );
}

function addToCalendar(e) {
  const d = e.date.replace(/-/g, '');
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${e.title}\nDTSTART;VALUE=DATE:${d}\nDTEND;VALUE=DATE:${d}\nLOCATION:Kleos International School - ${e.location}\nDESCRIPTION:${e.description}\nEND:VEVENT\nEND:VCALENDAR`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = `${e.title.replace(/\W+/g, '-')}.ics`;
  a.click();
}

export function useLightbox() {
  const [index, setIndex] = useState(null);
  return { index, open: setIndex, close: () => setIndex(null), setIndex };
}
