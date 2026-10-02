import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Logo, SocialIcon } from '../ui';
import { SCHOOL, fullAddress } from '../../data/school';

const QUICK = [
  ['About Us', '/about'],
  ['Academics', '/academics'],
  ['Admissions', '/admissions'],
  ['Facilities', '/facilities'],
  ['Faculty', '/faculty'],
  ['Gallery', '/gallery'],
];
const MORE = [
  ['Events', '/events'],
  ['Activities', '/activities'],
  ['Contact', '/contact'],
  ['Parent Portal', '/login?role=parent'],
  ['Student Portal', '/login?role=student'],
  ['Staff / Admin Login', '/login?role=admin'],
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__about">
            <Logo light />
            <p>
              A CBSE school in Miyapur, Hyderabad, nurturing curiosity, character and excellence from Nursery to Grade XII since {SCHOOL.founded}.
            </p>
            <div className="socials">
              {Object.entries(SCHOOL.social).map(([k, href]) => (
                <a key={k} href={href} aria-label={k} target="_blank" rel="noreferrer">
                  <SocialIcon name={k} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h5>Explore</h5>
            <div className="footer__links">
              {QUICK.map(([l, to]) => <Link key={to} to={to}>{l}</Link>)}
            </div>
          </div>
          <div>
            <h5>Community</h5>
            <div className="footer__links">
              {MORE.map(([l, to]) => <Link key={to} to={to}>{l}</Link>)}
            </div>
          </div>
          <div>
            <h5>Visit Us</h5>
            <ul className="footer__contact">
              <li><MapPin aria-hidden /><a href={SCHOOL.mapLink} target="_blank" rel="noreferrer">{fullAddress}</a></li>
              <li><Phone aria-hidden /><a href={SCHOOL.phoneHref}>{SCHOOL.phone}</a></li>
              <li><Mail aria-hidden /><a href={`mailto:${SCHOOL.email}`}>{SCHOOL.email}</a></li>
              <li><Clock aria-hidden /><span>Mon – Fri 8:30 AM – 4:30 PM<br />Sat 8:30 AM – 1:00 PM</span></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.</span>
          <nav>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms &amp; Conditions</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
