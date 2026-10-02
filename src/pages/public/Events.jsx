import { useMemo, useState } from 'react';
import { Calendar, Clock, MapPin, CalendarX, Pin } from 'lucide-react';
import { useStore } from '../../services/store';
import { PageHero, SectionHead, DateBlock, EventModal } from '../../components/public/Sections';
import { SmartImage, Tabs, Badge, EmptyState } from '../../components/ui';
import { upcomingEvents, pastEvents, sortedNotices } from '../../utils/content';
import { formatDate, timeAgo } from '../../utils/format';
import { IMG } from '../../data/school';

const monthKey = (d) => d.slice(0, 7);
const monthLabel = (k) => new Date(`${k}-01`).toLocaleDateString('en-IN', { month: 'short' });
const yearLabel = (k) => k.slice(0, 4);

export default function Events() {
  const { state } = useStore();
  const [tab, setTab] = useState('upcoming');
  const [month, setMonth] = useState('all');
  const [open, setOpen] = useState(null);
  const up = upcomingEvents(state.events);
  const past = pastEvents(state.events);
  const source = tab === 'upcoming' ? up : past;
  const months = useMemo(() => [...new Set(source.map((e) => monthKey(e.date)))].sort(tab === 'upcoming' ? undefined : (a, b) => b.localeCompare(a)), [source, tab]);
  const list = month === 'all' ? source : source.filter((e) => monthKey(e.date) === month);

  return (
    <>
      <PageHero crumbs={[{ label: 'Events' }]} title="Celebrations, competitions <em>&amp; milestones</em>" text="From Bathukamma to Sports Day, the school calendar is full of moments our students remember for years." image={IMG.celebration} />
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
            <Tabs value={tab} onChange={(t) => { setTab(t); setMonth('all'); }} tabs={[{ value: 'upcoming', label: 'Upcoming', count: up.length }, { value: 'past', label: 'Past events', count: past.length }]} />
            <div className="month-strip" role="group" aria-label="Filter by month">
              <button className={month === 'all' ? 'is-active' : ''} onClick={() => setMonth('all')}><b>All</b><span>months</span></button>
              {months.map((m) => (
                <button key={m} className={month === m ? 'is-active' : ''} onClick={() => setMonth(m)}><b>{monthLabel(m)}</b><span>{yearLabel(m)}</span></button>
              ))}
            </div>
          </div>
          {list.length ? (
            <div className="ev-grid">
              {list.map((e, i) => (
                <button key={e.id} className="ev-card" onClick={() => setOpen(e)} style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="ev-card__media">
                    <SmartImage src={e.image} alt="" />
                    <Badge tone="green" plain>{e.category}</Badge>
                    <DateBlock date={e.date} />
                  </div>
                  <div className="ev-card__body">
                    <h4>{e.title}</h4>
                    <p>{e.description}</p>
                    <div className="ev-card__meta">
                      <span><Calendar />{formatDate(e.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span><Clock />{e.time}</span>
                      <span><MapPin />{e.location}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState icon={CalendarX} title={tab === 'upcoming' ? 'No upcoming events' : 'No past events'} text="Check back soon — new events are announced every month." />
          )}
        </div>
      </section>

      <section className="section section--cream2" id="notices">
        <div className="container" style={{ maxWidth: 900 }}>
          <SectionHead eyebrow="News & announcements" title="Notice <em>board</em>" />
          <div className="card" style={{ borderRadius: 24 }}>
            {sortedNotices(state.announcements).map((n, i) => (
              <article key={n.id} style={{ padding: '22px 26px', borderTop: i ? '1px solid var(--line-cool)' : 0, display: 'grid', gap: 6 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', fontSize: 13 }}>
                  {n.pinned && <Badge tone="red"><Pin size={11} /> Pinned</Badge>}
                  <Badge tone="green" plain>{n.category}</Badge>
                  <span className="muted">{formatDate(n.date)} · {timeAgo(n.date)}</span>
                </div>
                <h3 style={{ fontSize: 18 }}>{n.title}</h3>
                <p className="muted">{n.body}</p>
              </article>
            ))}
            {!state.announcements.length && <EmptyState title="No announcements" />}
          </div>
        </div>
      </section>
      <EventModal event={open} onClose={() => setOpen(null)} />
    </>
  );
}
