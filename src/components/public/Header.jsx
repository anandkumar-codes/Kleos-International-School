import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, Phone, Mail, Users, GraduationCap, ChevronRight, Building2, Palette, UserRound, Images, ShieldCheck, ArrowRight } from 'lucide-react';
import { Logo, Button } from '../ui';
import { SCHOOL } from '../../data/school';
import { useScrolled, useLockBody } from '../../hooks';

const CAMPUS = [
  { to: '/facilities', label: 'Campus & Facilities', text: 'Labs, library, sports, transport', icon: Building2 },
  { to: '/activities', label: 'Activities & Clubs', text: 'Arts, STEM, sports and houses', icon: Palette },
  { to: '/faculty', label: 'Our Faculty', text: 'Meet the teachers behind Kleos', icon: UserRound },
  { to: '/gallery', label: 'Photo Gallery', text: 'Life on campus, in pictures', icon: Images },
];

const MAIN = [
  { to: '/about', label: 'About' },
  { to: '/academics', label: 'Academics' },
  { to: '/admissions', label: 'Admissions' },
  { label: 'Campus Life', children: CAMPUS },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useLockBody(open);
  useEffect(() => setOpen(false), [loc.pathname]);
  const campusActive = CAMPUS.some((c) => loc.pathname.startsWith(c.to));

  return (
    <>
      <div className="topbar">
        <div className="container">
          <div className="topbar__info">
            <a href={SCHOOL.phoneHref}><Phone aria-hidden /> {SCHOOL.phone}</a>
            <a href={`mailto:${SCHOOL.email}`} className="hide-sm"><Mail aria-hidden /> {SCHOOL.email}</a>
            <span className="hide-sm"><ShieldCheck aria-hidden /> CBSE Affiliated · Nursery to XII</span>
          </div>
          <div className="topbar__links">
            <Link to="/login?role=parent"><Users aria-hidden /> <span>Parent Login</span></Link>
            <span className="topbar__sep" />
            <Link to="/login?role=student"><GraduationCap aria-hidden /> <span>Student Login</span></Link>
          </div>
        </div>
      </div>

      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container">
          <Link to="/" aria-label={`${SCHOOL.name} — home`}>
            <Logo />
          </Link>
          <nav className="nav" aria-label="Main">
            {MAIN.map((item) =>
              item.children ? (
                <div className="nav__item" key={item.label}>
                  <button className={`nav__link ${campusActive ? 'active' : ''}`} aria-haspopup="true">
                    {item.label} <ChevronDown aria-hidden />
                  </button>
                  <div className="mega" role="menu">
                    {item.children.map((c) => (
                      <Link key={c.to} to={c.to} className="mega__link" role="menuitem">
                        <span className="mega__ico"><c.icon /></span>
                        <span>
                          <strong>{c.label}</strong>
                          <span>{c.text}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={item.to} to={item.to} className="nav__link">
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>
          <div className="header-cta">
            <Button variant="gold" to="/admissions#apply" iconRight={ArrowRight}>Apply Now</Button>
            <button className="icon-btn menu-toggle" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobile-nav__head">
            <Logo />
            <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
          </div>
          <div className="mobile-nav__body">
            {[{ to: '/', label: 'Home' }, ...MAIN.filter((m) => !m.children), ...CAMPUS].map((l, i) => (
              <Link key={l.to} to={l.to} className="m-link" style={{ animationDelay: `${i * 35}ms` }}>
                {l.label} <ChevronRight />
              </Link>
            ))}
          </div>
          <div className="mobile-nav__foot">
            <Button variant="gold" size="lg" block to="/admissions#apply">Apply for Admission</Button>
            <div className="row">
              <Button variant="outline" to="/login?role=parent" icon={Users}>Parent</Button>
              <Button variant="outline" to="/login?role=student" icon={GraduationCap}>Student</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
