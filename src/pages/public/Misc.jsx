import { ArrowLeft } from 'lucide-react';
import { PageHero } from '../../components/public/Sections';
import { Button } from '../../components/ui';
import { SCHOOL } from '../../data/school';

export function Privacy() {
  return (
    <>
      <PageHero crumbs={[{ label: 'Privacy Policy' }]} title="Privacy <em>Policy</em>" text="How Kleos International School collects, uses and protects information." />
      <section className="section">
        <div className="container legal">
          <h2>Information we collect</h2>
          <p>When you submit an admission enquiry or contact form, we collect the details you provide — such as parent and student names, phone number, email and class of interest. Parent and student portals additionally store academic, attendance and fee records maintained by the school.</p>
          <h2>How we use it</h2>
          <p>Information is used only to respond to enquiries, process admissions, communicate with families and deliver educational services. We do not sell or share personal information with third parties for marketing.</p>
          <h2>Data security</h2>
          <p>Access to student records is restricted to authorised staff. Portal accounts are protected by passwords, and all data is transmitted over encrypted connections.</p>
          <h2>Contact</h2>
          <p>For any privacy question, write to {SCHOOL.email} or call {SCHOOL.phone}.</p>
        </div>
      </section>
    </>
  );
}

export function Terms() {
  return (
    <>
      <PageHero crumbs={[{ label: 'Terms & Conditions' }]} title="Terms &amp; <em>Conditions</em>" text="Terms governing the use of this website and the school portals." />
      <section className="section">
        <div className="container legal">
          <h2>Use of this website</h2>
          <p>Content on this website is provided for general information about {SCHOOL.name}. While we keep it up to date, fees, schedules and policies are confirmed only in official school communication.</p>
          <h2>Portal accounts</h2>
          <p>Parent and student portal credentials are personal. Please do not share them. The school may suspend access in case of misuse.</p>
          <h2>Fees</h2>
          <p>Fee structures shown are indicative. The fee schedule issued at the time of admission is final and binding.</p>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  return (
    <div className="notfound">
      <div>
        <b>404</b>
        <h1 className="serif" style={{ fontSize: 34, marginTop: 8 }}>This page took a field trip</h1>
        <p className="muted" style={{ margin: '10px 0 24px' }}>The page you’re looking for doesn’t exist or has moved.</p>
        <Button to="/" icon={ArrowLeft}>Back to home</Button>
      </div>
    </div>
  );
}
