import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Compass, ShieldCheck, Users, Bus, BookOpen, Eye, Target, Clock, MapPin, ChevronRight,
  Quote, Star, Download, PhoneCall, Phone, Mail, Pin, CalendarCheck,
} from 'lucide-react';
import { useStore } from '../../services/store';
import { Button, SmartImage, Icon, Avatar, useToast } from '../../components/ui';
import { Reveal, SectionHead, Lightbox, useLightbox, DateBlock, EventModal } from '../../components/public/Sections';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { useCountUp, useInView } from '../../hooks';
import { SCHOOL, IMG, fullAddress } from '../../data/school';
import { timeAgo } from '../../utils/format';
import { upcomingEvents, sortedNotices } from '../../utils/content';

function StatCounter({ value, suffix, label }) {
  const [ref, inView] = useInView();
  const n = useCountUp(value, inView);
  return (
    <div className="stat" ref={ref}>
      <strong>{n.toLocaleString('en-IN')}<sup>{suffix}</sup></strong>
      <span>{label}</span>
    </div>
  );
}

function emphasise(title) {
  // Italicise the last two words of a headline for the editorial look.
  const words = title.trim().split(' ');
  if (words.length < 3) return title;
  return `${words.slice(0, -2).join(' ')} <em>${words.slice(-2).join(' ')}</em>`;
}

export default function Home() {
  const { state } = useStore();
  const { site, whyUs, programs, facilities, events, announcements, gallery, testimonials } = state;
  const [prog, setProg] = useState(programs[0]?.id);
  const [tIdx, setTIdx] = useState(0);
  const [openEvent, setOpenEvent] = useState(null);
  const lb = useLightbox();
  const toast = useToast();
  const activeProg = programs.find((p) => p.id === prog) || programs[0];
  const upcoming = upcomingEvents(events).slice(0, 4);
  const notices = sortedNotices(announcements).slice(0, 4);
  const galleryPreview = gallery.slice(0, 6);
  const t = testimonials[tIdx] || testimonials[0];
  const tiles = facilities.slice(0, 8);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero__media">
          <SmartImage src={site.hero.image} alt="Students at Kleos International School" eager />
        </div>
        <div className="container">
          <div className="hero__content">
            <span className="hero__badge"><b>{SCHOOL.admissionYear}</b> Admissions now open · Nursery to Grade XI</span>
            <h1 dangerouslySetInnerHTML={{ __html: emphasise(site.hero.title) }} />
            <p className="hero__sub">{site.hero.subtitle}</p>
            <div className="hero__ctas">
              <Button variant="gold" size="lg" to="/admissions#apply" iconRight={ArrowRight}>{site.hero.primaryCta}</Button>
              <Button variant="glass" size="lg" to="/facilities" icon={Compass}>{site.hero.secondaryCta}</Button>
            </div>
          </div>
          <div className="hero__strip">
            <div><ShieldCheck /><span><strong>CBSE Affiliated</strong>National curriculum</span></div>
            <div><BookOpen /><span><strong>Nursery – XII</strong>MPC · BiPC · Commerce</span></div>
            <div><Users /><span><strong>1 : 24 Ratio</strong>Personal attention</span></div>
            <div><Bus /><span><strong>14 Bus Routes</strong>GPS-tracked fleet</span></div>
          </div>
        </div>
        <aside className="hero__float">
          <span className="badge badge--green">Campus tours</span>
          <h4>See Kleos in action</h4>
          <p>Walk through classrooms, labs and play areas with our admissions team.</p>
          <div className="tour-slots">
            <span><b>Sat</b>9:30 AM</span>
            <span><b>Sat</b>11:00 AM</span>
            <span><b>Sat</b>12:30 PM</span>
          </div>
          <Button variant="primary" block to="/contact#visit" iconRight={ArrowRight}>Book a visit</Button>
        </aside>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="container">
          <div className="about-split">
            <Reveal>
              <span className="eyebrow">About Kleos</span>
              <h2 className="h-display mt-2">A school that knows every child <em>by name</em></h2>
              <p className="lead mt-3">{site.about.intro}</p>
              <div className="vm-grid">
                <div className="vm">
                  <h4><Eye /> Our Vision</h4>
                  <p>{site.about.vision}</p>
                </div>
                <div className="vm">
                  <h4><Target /> Our Mission</h4>
                  <p>{site.about.mission}</p>
                </div>
              </div>
              <Link to="/about" className="text-link">Discover our story <ArrowRight /></Link>
            </Reveal>
            <Reveal delay={120} className="about-collage">
              <SmartImage className="c1" src={IMG.students} alt="Students learning together" />
              <SmartImage className="c2" src={IMG.kidsClass} alt="Pre-primary classroom" />
              <div className="about-collage__badge">
                <strong>{SCHOOL.founded}</strong>
                <span>Established</span>
              </div>
            </Reveal>
          </div>
          <div className="stats">
            {site.stats.map((s) => <StatCounter key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* WHY KLEOS */}
      <section className="section section--green">
        <div className="container">
          <SectionHead eyebrow="Why Kleos" title="Six reasons families <em>choose us</em>" text="Strong academics are the foundation. What parents tell us they value most is everything we build on top of it." />
          <div className="bento">
            <Reveal className="bento__item bento__item--feature">
              <SmartImage src={IMG.teacher} alt="" />
              <div className="bento__body">
                <div className="bento__ico"><Icon name={whyUs[0]?.icon} /></div>
                <h3>{whyUs[0]?.title}</h3>
                <p>{whyUs[0]?.text}</p>
              </div>
            </Reveal>
            {whyUs.slice(1).map((w, i) => (
              <Reveal key={w.title} delay={i * 70} className={`bento__item ${i === 4 ? 'bento__item--banner' : ''}`}>
                <div className="bento__ico"><Icon name={w.icon} /></div>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="section section--cream2">
        <div className="container">
          <SectionHead
            eyebrow="Academic Programmes"
            title="A clear path from <em>first words</em> to board exams"
            text="Five stages, one continuous philosophy: build understanding before speed, and confidence before competition."
            action={<Button variant="outline" to="/academics" iconRight={ArrowRight}>Explore academics</Button>}
          />
          <div className="programs">
            <div className="program-list" role="tablist" aria-label="Programme stages">
              {programs.map((p, i) => (
                <button key={p.id} role="tab" aria-selected={p.id === activeProg.id} className={`program-tab ${p.id === activeProg.id ? 'is-active' : ''}`} style={{ '--c': p.color }} onClick={() => setProg(p.id)}>
                  <span className="program-tab__num">0{i + 1}</span>
                  <span><strong>{p.stage}</strong><span>{p.grades}</span></span>
                  <ChevronRight />
                </button>
              ))}
            </div>
            <div className="program-panel" key={activeProg.id} role="tabpanel">
              <SmartImage src={activeProg.image} alt={activeProg.stage} />
              <div className="program-panel__body">
                <div className="program-panel__meta">
                  <span className="badge badge--plain" style={{ background: `${activeProg.color}1a`, color: activeProg.color }}>{activeProg.ages}</span>
                  <span className="badge badge--plain badge--gray">{activeProg.grades}</span>
                </div>
                <h3>{activeProg.stage}</h3>
                <p>{activeProg.text}</p>
                <div className="subject-pills">{activeProg.subjects.map((s) => <span key={s}>{s}</span>)}</div>
                <Link to={`/academics#${activeProg.id}`} className="text-link" style={{ marginTop: 'auto' }}>Curriculum details <ArrowRight /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Campus & Facilities"
            title="Spaces designed for <em>how children learn</em>"
            text="From interactive classrooms to science labs and a robotics studio — every space on campus has a purpose."
            action={<Button variant="outline" to="/facilities" iconRight={ArrowRight}>All facilities</Button>}
          />
          <div className="mosaic">
            {tiles.map((f, i) => (
              <Reveal key={f.id} delay={i * 50} as={Link} to={`/facilities#${f.id}`} className={`tile ${i === 0 ? 'tile--tall tile--wide' : ''} ${i === 3 ? 'tile--tall' : ''}`}>
                <SmartImage src={f.image} alt={f.name} />
                <div className="tile__body">
                  <h4><Icon name={f.icon} /> {f.name}</h4>
                  <p>{f.short}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPAL */}
      <section className="section section--white">
        <div className="container principal">
          <Reveal className="portrait">
            {site.principal.image ? <SmartImage src={site.principal.image} alt={site.principal.name} /> : <span className="portrait__mono">{site.principal.name.replace(/^(Mrs?|Ms|Dr)\.?\s*/, '').split(' ').map((w) => w[0]).join('')}</span>}
          </Reveal>
          <Reveal delay={120}>
            <span className="eyebrow">From the Principal&apos;s desk</span>
            <blockquote className="mt-3">{site.principal.message}</blockquote>
            <div className="principal__sign">
              <span className="sig">{site.principal.name.replace(/^(Mrs?|Ms|Dr)\.?\s*/, '').split(' ')[0]}</span>
              <div>
                <strong>{site.principal.name}</strong>
                <span>{site.principal.designation} · {site.principal.qualification}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* EVENTS + NEWS */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="What's Happening" title="Events &amp; <em>notice board</em>" action={<Button variant="outline" to="/events" iconRight={ArrowRight}>Full calendar</Button>} />
          <div className="news-grid">
            <div>
              {upcoming.map((e, i) => (
                <Reveal key={e.id} delay={i * 60}>
                  <button className="event-row" onClick={() => setOpenEvent(e)}>
                    <DateBlock date={e.date} />
                    <div>
                      <h4>{e.title}</h4>
                      <div className="meta">
                        <span><Clock /> {e.time}</span>
                        <span><MapPin /> {e.location}</span>
                      </div>
                    </div>
                    <ChevronRight />
                  </button>
                </Reveal>
              ))}
              {!upcoming.length && <p className="muted">New events will be announced soon.</p>}
            </div>
            <Reveal delay={100} className="notice-board">
              <h3>Notice Board <Link to="/events#notices" className="text-link" style={{ color: 'var(--gold-400)', fontSize: 14 }}>View all <ArrowRight /></Link></h3>
              {notices.map((n) => (
                <div key={n.id} className="notice">
                  <div className="notice__top">
                    {n.pinned && <span className="pin"><Pin size={10} /> PINNED</span>}
                    <span className="notice__cat">{n.category}</span>
                    <span>· {timeAgo(n.date)}</span>
                  </div>
                  <h4>{n.title}</h4>
                  <p>{n.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section section--cream2">
        <div className="container">
          <SectionHead eyebrow="Life at Kleos" title="Moments from <em>our campus</em>" action={<Button variant="outline" to="/gallery" iconRight={ArrowRight}>Open gallery</Button>} />
          <div className="masonry">
            {galleryPreview.map((g, i) => (
              <button key={g.id} className="masonry__item" onClick={() => lb.open(i)} style={{ animationDelay: `${i * 60}ms` }}>
                <SmartImage src={g.image} alt={g.title} ratio={i % 3 === 0 ? '4/5' : i % 3 === 1 ? '4/3' : '1/1'} />
                <figcaption><span>{g.category}</span>{g.title}</figcaption>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container testimonial">
          <Reveal>
            <span className="eyebrow">Voices of our community</span>
            <h2 className="h-display mt-2">Trusted by <em>families</em> across West Hyderabad</h2>
            <div className="t-picker">
              {testimonials.map((x, i) => (
                <button key={x.name} className={i === tIdx ? 'is-active' : ''} onClick={() => setTIdx(i)}>
                  <Avatar name={x.name} size={40} />
                  <span><strong>{x.name}</strong><span>{x.role}</span></span>
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120} className="t-quote">
            <Quote />
            <p key={tIdx}>{t?.quote}</p>
            <footer>
              <Avatar name={t?.name} size={48} />
              <div><strong>{t?.name}</strong><span>{t?.role}</span></div>
              <div className="t-stars" aria-label="5 out of 5">{[0, 1, 2, 3, 4].map((s) => <Star key={s} />)}</div>
            </footer>
          </Reveal>
        </div>
      </section>

      {/* ADMISSIONS CTA */}
      <section className="section--tight">
        <div className="container">
          <Reveal className="cta-band">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="eyebrow">Admissions {SCHOOL.admissionYear}</span>
              <h2>{site.admissionsBanner.title.replace(SCHOOL.admissionYear, '')}<em>{SCHOOL.admissionYear}</em></h2>
              <p style={{ fontSize: 17, maxWidth: 520 }}>{site.admissionsBanner.text}</p>
            </div>
            <div className="cta-band__actions">
              <Button variant="gold" size="lg" to="/admissions#apply" iconRight={ArrowRight}>Apply Now</Button>
              <Button variant="glass" size="lg" iconRight={Download} onClick={() => toast('Prospectus download started', { text: 'Kleos-Prospectus-2027-28.pdf', tone: 'info' })}>Download Prospectus</Button>
              <Button variant="glass" size="lg" href={SCHOOL.phoneHref} iconRight={PhoneCall}>Contact Admissions</Button>
              <span className="cta-band__note">Admissions office: Mon–Sat, 9:00 AM – 4:00 PM</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact">
        <div className="container">
          <SectionHead eyebrow="Get in touch" title="Visit us in <em>Miyapur</em>" text="We're a short drive from Miyapur Metro Station, with school buses covering most of West Hyderabad." />
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-cards">
                <a className="c-card" href={SCHOOL.mapLink} target="_blank" rel="noreferrer"><MapPin /><div><small>Address</small><strong>{fullAddress}</strong></div></a>
                <a className="c-card" href={SCHOOL.phoneHref}><Phone /><div><small>Call us</small><strong>{SCHOOL.phone}</strong></div></a>
                <a className="c-card" href={`mailto:${SCHOOL.admissionsEmail}`}><Mail /><div><small>Email</small><strong>{SCHOOL.admissionsEmail.replace('@', '@​')}</strong></div></a>
                <div className="c-card"><CalendarCheck /><div><small>Office hours</small><strong>Mon–Fri 8:30–4:30<br />Sat 8:30–1:00</strong></div></div>
              </div>
              <div className="map-frame">
                <iframe title="Map to Kleos International School" src={SCHOOL.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  <a className="map-frame__link" href={SCHOOL.mapLink} target="_blank" rel="noreferrer"><MapPin /> Open in Google Maps</a>
              </div>
            </div>
            <EnquiryForm compact />
          </div>
        </div>
      </section>

      <Lightbox items={galleryPreview} index={lb.index} onClose={lb.close} onIndex={lb.setIndex} />
      <EventModal event={openEvent} onClose={() => setOpenEvent(null)} />
    </>
  );
}

