import { Lightbulb, Users, FlaskConical, MonitorSmartphone, Brain, HeartHandshake, BookOpen, Laptop, Library, Download, ArrowRight } from 'lucide-react';
import { useStore } from '../../services/store';
import { PageHero, Reveal, SectionHead } from '../../components/public/Sections';
import { SmartImage, Button, useToast } from '../../components/ui';
import { academicCalendar } from '../../data/content';
import { IMG } from '../../data/school';

const METHODS = [
  { icon: Lightbulb, title: 'Inquiry-based learning', text: 'Lessons open with a question or problem, so students reason their way to understanding.' },
  { icon: Users, title: 'Collaborative projects', text: 'Group work across subjects builds communication, leadership and teamwork.' },
  { icon: FlaskConical, title: 'Experiential & lab learning', text: 'Concepts are tested in labs, field trips and hands-on activities — not just textbooks.' },
  { icon: MonitorSmartphone, title: 'Blended digital learning', text: 'Interactive panels, digital content and a learning app extend the classroom.' },
  { icon: Brain, title: 'Competency-based teaching', text: 'Aligned to NEP 2020 and CBSE competency frameworks, with application-level questions.' },
  { icon: HeartHandshake, title: 'Remedial & enrichment', text: 'Small-group support for those who need it, and stretch programmes for those ready for more.' },
];

const RESOURCES = [
  { icon: Library, title: 'Library & e-library', text: '8,000+ titles plus digital subscriptions for senior students.' },
  { icon: Laptop, title: 'Kleos Learning App', text: 'Homework, notes, recorded lessons and progress reports in one place.' },
  { icon: BookOpen, title: 'Olympiad & JEE/NEET prep', text: 'Integrated coaching for Grades IX–XII and olympiad training from Grade III.' },
];

const SCALE = [['A1', '91–100'], ['A2', '81–90'], ['B1', '71–80'], ['B2', '61–70'], ['C1', '51–60'], ['C2', '41–50'], ['D', '33–40'], ['E', 'Below 33']];

export default function Academics() {
  const { state } = useStore();
  const toast = useToast();
  return (
    <>
      <PageHero crumbs={[{ label: 'Academics' }]} title="Rigour, curiosity and <em>joy in learning</em>" text="The CBSE curriculum, taught the way children actually learn — through questions, experiments, conversation and practice." image={IMG.classroom} />

      <section className="section">
        <div className="container about-split">
          <Reveal>
            <span className="eyebrow">Curriculum</span>
            <h2 className="h-display mt-2">CBSE, aligned with <em>NEP 2020</em></h2>
            <p className="lead mt-3">We follow the Central Board of Secondary Education curriculum from Grade I to XII, with a Montessori-inspired foundational stage for Nursery to UKG. Our teaching is aligned to the National Education Policy 2020: fewer rote facts, more understanding, application and skills.</p>
            <ul className="check-list" style={{ marginTop: 26 }}>
              {['NCERT textbooks with enrichment material', 'Three-language formula: English, Telugu, Hindi', 'Coding & AI from Grade III', 'Art, music & PE in every timetable', 'Integrated JEE / NEET / CUET support', 'Life skills & value education'].map((x) => (
                <li key={x}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>{x}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <SmartImage src={IMG.smartClass} alt="Smart classroom" ratio="4/3.4" style={{ borderRadius: 28, boxShadow: 'var(--sh-3)' }} />
          </Reveal>
        </div>
      </section>

      <section className="section section--cream2">
        <div className="container">
          <SectionHead eyebrow="Classes & subjects" title="Five stages, <em>one journey</em>" text="Each stage has its own coordinator, specialist teachers and learning goals." />
          <div className="grade-cards">
            {state.programs.map((p, i) => (
              <Reveal key={p.id} id={p.id} className="grade-card" delay={i * 60} style={{ '--c': p.color }}>
                <div className="gc-ages">{p.ages}</div>
                <h4>{p.stage}</h4>
                <div className="gc-grades">{p.grades}</div>
                <ul>{p.subjects.map((s) => <li key={s}>{s}</li>)}</ul>
              </Reveal>
            ))}
          </div>
          <div className="mt-4 feature-split" style={{ padding: 0 }}>
            <div className="feature-split__media"><SmartImage src={IMG.graduation} alt="Senior secondary students" /></div>
            <div>
              <span className="eyebrow">Senior Secondary streams</span>
              <h3 className="mt-2">Choose a path, keep your options open</h3>
              <p>Grade XI students choose from three streams, each with an optional sixth subject and integrated entrance preparation.</p>
              <div className="steps steps--3">
                {[['MPC', 'Maths · Physics · Chemistry', 'JEE Main & Advanced, EAMCET'], ['BiPC', 'Biology · Physics · Chemistry', 'NEET, EAMCET (Agri & Med)'], ['Commerce', 'Accounts · Business · Economics', 'CA Foundation, CUET']].map(([t, s, e]) => (
                  <div key={t} className="step" style={{ padding: 18 }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{t}</h4>
                    <p>{s}</p>
                    <p style={{ marginTop: 8, color: 'var(--green-700)', fontWeight: 600 }}>{e}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Teaching methodology" title="How we <em>teach</em>" />
          <Reveal className="method-grid">
            {METHODS.map((m) => (
              <div key={m.title} className="method"><m.icon /><h4>{m.title}</h4><p>{m.text}</p></div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--white">
        <div className="container assess">
          <Reveal>
            <span className="eyebrow">Assessment system</span>
            <h2 className="h-display mt-2">Continuous, <em>comprehensive</em>, fair</h2>
            <p className="lead mt-3">Learning is assessed throughout the year — not only in exams. Each term combines periodic tests, notebook and subject enrichment, projects, and a term examination, following the CBSE assessment scheme.</p>
            <table className="fee-table mt-3">
              <tbody>
                <tr><td>Periodic tests (Unit Tests I & II)</td><td>10%</td></tr>
                <tr><td>Notebook submission & subject enrichment</td><td>10%</td></tr>
                <tr><td>Half-yearly / Annual examination</td><td>80%</td></tr>
              </tbody>
            </table>
          </Reveal>
          <Reveal delay={100}>
            <div className="info-card">
              <h4>CBSE grading scale</h4>
              <div className="grade-scale">{SCALE.map(([g, r]) => <div key={g}><b>{g}</b><span>{r}</span></div>)}</div>
              <p className="muted" style={{ fontSize: 13.5, marginTop: 14 }}>Pre-primary and Grades I–II receive descriptive, skill-based progress reports instead of marks.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--cream2" id="calendar">
        <div className="container">
          <SectionHead eyebrow="Academic calendar 2026–27" title="The year <em>at a glance</em>" action={<Button variant="outline" icon={Download} onClick={() => toast('Calendar download started', { tone: 'info', text: 'Kleos-Academic-Calendar-2026-27.pdf' })}>Download PDF</Button>} />
          <div className="cal-grid">
            {academicCalendar.map((m, i) => (
              <Reveal key={m.month} className="cal-month" delay={i * 30}>
                <h5>{m.month}</h5>
                <ul>{m.items.map((x) => <li key={x}>{x}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Learning resources" title="Support beyond <em>the classroom</em>" />
          <div className="grid-3">
            {RESOURCES.map((r, i) => (
              <Reveal key={r.title} className="info-card" delay={i * 60}>
                <h4><r.icon /> {r.title}</h4>
                <p className="muted">{r.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="center mt-4"><Button variant="gold" size="lg" to="/admissions#apply" iconRight={ArrowRight}>Start your application</Button></div>
        </div>
      </section>
    </>
  );
}
