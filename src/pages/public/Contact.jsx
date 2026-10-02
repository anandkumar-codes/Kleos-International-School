import { MapPin, Phone, Mail, Clock, Siren, Navigation, Bus } from 'lucide-react';
import { PageHero, SectionHead, Reveal } from '../../components/public/Sections';
import { ContactForm, EnquiryForm } from '../../components/public/EnquiryForm';
import { Button } from '../../components/ui';
import { SCHOOL, IMG, fullAddress } from '../../data/school';

export default function Contact() {
  return (
    <>
      <PageHero crumbs={[{ label: 'Contact' }]} title="We'd love to <em>hear from you</em>" text="Visit, call or write to us. The school office is open six days a week." image={IMG.campus} />
      <section className="section">
        <div className="container">
          <div className="contact-cards" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))' }}>
            <a className="c-card" href={SCHOOL.mapLink} target="_blank" rel="noreferrer"><MapPin /><div><small>Address</small><strong>{fullAddress}</strong></div></a>
            <a className="c-card" href={SCHOOL.phoneHref}><Phone /><div><small>School office</small><strong>{SCHOOL.phone}</strong></div></a>
            <a className="c-card" href={`mailto:${SCHOOL.email}`}><Mail /><div><small>General email</small><strong>{SCHOOL.email.replace('@', '@​')}</strong><strong style={{ fontWeight: 500, color: 'var(--ink-500)', fontSize: 13.5 }}>{SCHOOL.admissionsEmail}</strong></div></a>
            <div className="c-card" style={{ borderColor: '#f3c7ca', background: '#fff8f8' }}><Siren style={{ background: 'var(--red-100)', color: 'var(--red-500)' }} /><div><small>Emergency (24×7)</small><strong>{SCHOOL.emergencyPhone}</strong></div></div>
          </div>

          <div className="contact-grid mt-4">
            <div className="contact-info">
              <div className="map-frame" style={{ minHeight: 380 }}>
                <iframe title="Map to Kleos International School" src={SCHOOL.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  <a className="map-frame__link" href={SCHOOL.mapLink} target="_blank" rel="noreferrer"><MapPin /> Open in Google Maps</a>
              </div>
              <div className="info-card">
                <h4><Clock /> Office timings</h4>
                <table className="fee-table"><tbody>{SCHOOL.hours.map((h) => <tr key={h.day}><td>{h.day}</td><td>{h.time}</td></tr>)}</tbody></table>
              </div>
              <div className="info-card">
                <h4><Navigation /> Getting here</h4>
                <ul>
                  <li><MapPin />Near Mayuri Nagar, JP Nagar, Miyapur — about 2 km from Miyapur Metro Station.</li>
                  <li><Bus />School buses cover 14 routes across West Hyderabad.</li>
                </ul>
                <Button variant="soft" size="sm" href={SCHOOL.mapLink} target="_blank" rel="noreferrer" icon={Navigation} style={{ marginTop: 14 }}>Get directions</Button>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
      <section className="section section--cream2" id="visit">
        <div className="container adm-layout">
          <Reveal>
            <SectionHead eyebrow="Admission enquiry & campus visit" title="Come and <em>see us</em>" text="Campus tours run every Saturday at 9:30 AM, 11:00 AM and 12:30 PM. Submit the form and our counsellor will confirm your slot by phone." />
          </Reveal>
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
