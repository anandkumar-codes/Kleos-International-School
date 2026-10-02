import { Link } from 'react-router-dom';
import { Eye, Target, Award, ShieldCheck, BadgeCheck, Leaf, ArrowRight } from 'lucide-react';
import { useStore } from '../../services/store';
import { PageHero, Reveal, SectionHead } from '../../components/public/Sections';
import { SmartImage, Button, Icon } from '../../components/ui';
import { timeline, coreValues, leadership, achievements } from '../../data/content';
import { SCHOOL, IMG } from '../../data/school';
import { initials } from '../../utils/format';

const ACCRED = [
  { icon: ShieldCheck, title: 'CBSE Affiliation', text: `Affiliation No. ${SCHOOL.affiliationNo}` },
  { icon: BadgeCheck, title: 'Telangana Govt. Recognised', text: 'School Education Department' },
  { icon: Leaf, title: 'Green School', text: 'Rainwater harvesting & solar' },
  { icon: Award, title: 'Fire & Safety Certified', text: 'Annual audit compliant' },
];

export default function About() {
  const { state } = useStore();
  const { site, facilities } = state;
  return (
    <>
      <PageHero crumbs={[{ label: 'About' }]} title="Built on a promise of <em>lasting excellence</em>" text={site.about.story} image={IMG.campus} />

      <nav className="container" aria-label="On this page" style={{ position: 'relative', zIndex: 2 }}>
        <div className="sticky-subnav">
          {[['overview', 'Overview'], ['history', 'History'], ['vision', 'Vision & Values'], ['leadership', 'Leadership'], ['achievements', 'Achievements'], ['infrastructure', 'Infrastructure']].map(([id, l]) => (
            <a key={id} href={`#${id}`}>{l}</a>
          ))}
        </div>
      </nav>

      <section className="section" id="overview">
        <div className="container about-split">
          <Reveal>
            <span className="eyebrow">School overview</span>
            <h2 className="h-display mt-2">Kleos — <em>κλέος</em> — means glory earned</h2>
            <p className="lead mt-3">{site.about.intro}</p>
            <p className="lead mt-2" style={{ color: 'var(--ink-500)' }}>{SCHOOL.meaning} It is the standard we hold ourselves to: excellence that comes from effort, integrity and service — not shortcuts.</p>
            <div className="vm-grid">
              <div className="vm"><h4><Award /> Board</h4><p>Central Board of Secondary Education (CBSE), New Delhi</p></div>
              <div className="vm"><h4><BadgeCheck /> Classes</h4><p>Nursery to Grade XII · Science (MPC/BiPC) & Commerce</p></div>
            </div>
          </Reveal>
          <Reveal delay={120} className="about-collage">
            <SmartImage className="c1" src={IMG.classroom} alt="Classroom at Kleos" />
            <SmartImage className="c2" src={IMG.library} alt="School library" />
            <div className="about-collage__badge"><strong>1,248</strong><span>Learners</span></div>
          </Reveal>
        </div>
      </section>

      <section className="section section--cream2" id="history">
        <div className="container">
          <SectionHead center eyebrow="Our journey" title="Twelve years of <em>steady growth</em>" />
          <div className="timeline">
            {timeline.map((t, i) => (
              <Reveal key={t.year} className="tl-item" delay={i * 40}>
                <div className="tl-card">
                  <div className="yr">{t.year}</div>
                  <h4>{t.title}</h4>
                  <p>{t.text}</p>
                </div>
                <span className="tl-item__dot" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="vision">
        <div className="container">
          <div className="grid-2">
            <Reveal className="form-card" style={{ background: 'var(--green-900)', color: 'rgba(255,255,255,.8)', borderColor: 'transparent' }}>
              <Eye size={34} color="var(--gold-400)" />
              <h3 style={{ color: '#fff', marginTop: 18 }}>Our Vision</h3>
              <p style={{ fontSize: 18, lineHeight: 1.7, marginTop: 12 }}>{site.about.vision}</p>
            </Reveal>
            <Reveal delay={100} className="form-card">
              <Target size={34} color="var(--green-600)" />
              <h3 style={{ marginTop: 18 }}>Our Mission</h3>
              <p style={{ fontSize: 18, lineHeight: 1.7, marginTop: 12, color: 'var(--ink-700)' }}>{site.about.mission}</p>
            </Reveal>
          </div>
          <div className="mt-5">
            <SectionHead eyebrow="Core values" title="Five values that <em>shape every day</em>" />
            <Reveal className="values">
              {coreValues.map((v, i) => (
                <div key={v.title} className="value">
                  <b>0{i + 1}</b>
                  <h4>{v.title}</h4>
                  <p>{v.text}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--white" id="principal">
        <div className="container principal">
          <Reveal className="portrait"><span className="portrait__mono">{initials(site.principal.name)}</span></Reveal>
          <Reveal delay={120}>
            <span className="eyebrow">Principal&apos;s message</span>
            <blockquote className="mt-3">{site.principal.message}</blockquote>
            <div className="principal__sign">
              <span className="sig">{site.principal.name.replace(/^(Mrs?|Ms|Dr)\.?\s*/, '').split(' ')[0]}</span>
              <div><strong>{site.principal.name}</strong><span>{site.principal.designation} · {site.principal.qualification}</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="leadership">
        <div className="container">
          <SectionHead eyebrow="Leadership team" title="The people <em>guiding Kleos</em>" />
          <div className="people-grid">
            {leadership.map((p, i) => (
              <div key={p.name} className="person" style={{ animationDelay: `${i * 60}ms`, '--pc': ['#10624a', '#c8323c', '#2d7dd2', '#d98a10'][i % 4] }}>
                <div className="person__photo"><span>{initials(p.name)}</span></div>
                <div className="person__body">
                  <h4>{p.name}</h4>
                  <div className="person__role">{p.role}</div>
                  <div className="person__meta"><span>{p.text}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--green" id="achievements">
        <div className="container">
          <SectionHead eyebrow="Achievements" title="Results that <em>speak quietly</em>" text="We measure success by every child's growth — but we're proud of these numbers too." />
          <div className="ach-grid">
            {achievements.map((a, i) => (
              <Reveal key={a.label} className="ach" delay={i * 70}><strong>{a.value}</strong><span>{a.label}</span></Reveal>
            ))}
          </div>
          <div className="mt-4">
            <span className="eyebrow">Accreditations</span>
            <div className="accred mt-2">
              {ACCRED.map((a) => (
                <div key={a.title}><a.icon /><div><strong>{a.title}</strong><span>{a.text}</span></div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="infrastructure">
        <div className="container">
          <SectionHead eyebrow="Infrastructure" title="A campus built <em>for learning</em>" action={<Button variant="outline" to="/facilities" iconRight={ArrowRight}>See all facilities</Button>} />
          <div className="mosaic">
            {facilities.slice(0, 8).map((f, i) => (
              <Reveal key={f.id} as={Link} to={`/facilities#${f.id}`} className={`tile ${i === 0 ? 'tile--tall tile--wide' : ''} ${i === 3 ? 'tile--tall' : ''}`} delay={i * 40}>
                <SmartImage src={f.image} alt={f.name} />
                <div className="tile__body"><h4><Icon name={f.icon} /> {f.name}</h4><p>{f.short}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
