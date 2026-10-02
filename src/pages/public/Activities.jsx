import { useState } from 'react';
import { PageHero, Reveal, SectionHead } from '../../components/public/Sections';
import { SmartImage } from '../../components/ui';
import { activities, houses } from '../../data/content';
import { IMG } from '../../data/school';

export default function Activities() {
  const cats = ['All', ...new Set(activities.map((a) => a.category))];
  const [cat, setCat] = useState('All');
  const list = activities.filter((a) => cat === 'All' || a.category === cat);
  return (
    <>
      <PageHero crumbs={[{ label: 'Campus Life' }, { label: 'Activities' }]} title="Beyond the classroom, <em>every day</em>" text="Clubs, sports, arts and leadership opportunities woven into the school week — so every child finds their thing." image={IMG.dance} />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Clubs & programmes" title="20+ ways to <em>explore</em>" action={
            <div className="chip-row">{cats.map((c) => <button key={c} className={`chip ${c === cat ? 'is-active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}</div>
          } />
          <div className="act-grid">
            {list.map((a, i) => (
              <Reveal key={a.title} className="act-card" delay={i * 50}>
                <SmartImage src={a.image} alt={a.title} />
                <div className="act-card__body"><small>{a.category}</small><h4>{a.title}</h4><p>{a.text}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--cream2">
        <div className="container">
          <SectionHead eyebrow="House system" title="Four houses, <em>one Kleos</em>" text="Every student belongs to a house named after an Indian luminary. Houses compete in sports, debates, quizzes and cultural events through the year." />
          <div className="houses">
            {houses.map((h, i) => (
              <Reveal key={h.name} className="house" style={{ '--c': h.color }} delay={i * 60}>
                <small>House value</small>
                <h4>{h.name}</h4>
                <span>{h.value}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
