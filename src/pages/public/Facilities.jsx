import { Check, ArrowRight } from 'lucide-react';
import { useStore } from '../../services/store';
import { PageHero, Reveal } from '../../components/public/Sections';
import { SmartImage, Icon, Button, EmptyState } from '../../components/ui';
import { IMG } from '../../data/school';

export default function Facilities() {
  const { state } = useStore();
  const list = state.facilities;
  return (
    <>
      <PageHero crumbs={[{ label: 'Campus Life' }, { label: 'Facilities' }]} title="A campus designed for <em>curious minds</em>" text="Bright classrooms, real laboratories, open play spaces and the safety systems that let parents relax." image={IMG.campus} />

      <nav className="container" aria-label="Facilities" style={{ position: 'relative', zIndex: 2 }}>
        <div className="sticky-subnav">
          {list.map((f) => <a key={f.id} href={`#${f.id}`}>{f.name}</a>)}
        </div>
      </nav>

      <section className="section">
        <div className="container">
          {!list.length && <EmptyState title="Facilities coming soon" text="Our team is updating this section." />}
          {list.map((f, i) => (
            <Reveal key={f.id} id={f.id} className="feature-split" style={{ scrollMarginTop: 140 }}>
              <div className="feature-split__media">
                <SmartImage src={f.image} alt={f.name} />
                <span className="feature-split__num"><Icon name={f.icon} /></span>
              </div>
              <div>
                <span className="eyebrow">{String(i + 1).padStart(2, '0')} · {f.short}</span>
                <h3 className="mt-2">{f.name}</h3>
                <p>{f.description}</p>
                <ul className="check-list">
                  {f.features.map((x) => <li key={x}><Check />{x}</li>)}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="cta-band">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="eyebrow">See it for yourself</span>
              <h2>Book a <em>campus tour</em></h2>
              <p style={{ fontSize: 17 }}>Tours run every Saturday from 9:30 AM. Walk through classrooms, labs and play areas with our admissions team.</p>
            </div>
            <div className="cta-band__actions">
              <Button variant="gold" size="lg" to="/contact#visit" iconRight={ArrowRight}>Schedule a visit</Button>
              <Button variant="glass" size="lg" to="/gallery" iconRight={ArrowRight}>Browse the gallery</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
