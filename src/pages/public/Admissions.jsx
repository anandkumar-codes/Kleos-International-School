import { Plus, FileText, CalendarCheck, Info, Phone, Check } from 'lucide-react';
import { PageHero, Reveal, SectionHead } from '../../components/public/Sections';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { SCHOOL, IMG } from '../../data/school';
import { ANNUAL_FEE } from '../../data/records';
import { formatINR } from '../../utils/format';

const STEPS = [
  ['Enquiry', 'Fill the online form or visit the school office. Our counsellor will call you within a day.'],
  ['Application', 'Collect or download the application form and submit it with the registration fee.'],
  ['Document Submission', 'Submit the required documents for verification at the admissions office.'],
  ['Assessment & Interaction', 'An age-appropriate assessment for the child and a friendly interaction with parents.'],
  ['Admission Confirmation', 'Receive the offer letter within 3 working days of the interaction.'],
  ['Fee Payment', 'Pay the admission fee and first installment to confirm your child’s seat.'],
];

const DOCS = ['Birth certificate (copy)', 'Aadhaar card of student and parents', 'Previous school report card', 'Transfer Certificate (Grade II onwards)', '4 passport-size photographs of the student', 'Address proof (utility bill / rental agreement)'];

const AGE = [['Nursery', '3+ years as on 31 March'], ['LKG', '4+ years'], ['UKG', '5+ years'], ['Grade I', '6+ years']];

const FAQS = [
  ['When do admissions open for 2027–28?', 'Admissions are open now. Seats in Nursery, LKG and Grade XI fill fastest — we recommend applying before December.'],
  ['Is there an entrance test?', 'There is no test for Nursery to UKG — only an informal interaction. From Grade I onwards there is a short assessment in English and Mathematics to understand the child’s level, not to filter.'],
  ['Do you provide transport?', 'Yes. GPS-tracked buses run on 14 routes covering Miyapur, Chandanagar, Bachupally, Nizampet, Kondapur, Lingampally and nearby areas. Transport fee depends on distance.'],
  ['Can fees be paid in installments?', 'Yes. Tuition fees are payable in four quarterly installments through UPI, net banking, card or cheque. Sibling concession is available.'],
  ['Is coaching for JEE / NEET included?', 'Grades XI–XII students receive integrated entrance preparation within the school timetable. Details and fees are shared during counselling.'],
];

export default function Admissions() {
  return (
    <>
      <PageHero crumbs={[{ label: 'Admissions' }]} title={`Admissions open for <em>${SCHOOL.admissionYear}</em>`} text="A simple, transparent admission process — with a counsellor to guide you at every step." image={IMG.kids} />

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="Admission process" title="Six simple <em>steps</em>" text="Most families complete the process within two weeks of their first enquiry." />
          <div className="steps">
            {STEPS.map(([t, d], i) => (
              <Reveal key={t} className="step" delay={i * 60}>
                <div className="step__n">{i === STEPS.length - 1 ? <Check size={18} /> : i + 1}</div>
                <h4>{t}</h4>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cream2" id="apply">
        <div className="container adm-layout">
          <div className="adm-aside">
            <div className="info-card">
              <h4><FileText /> Documents required</h4>
              <ul>{DOCS.map((d) => <li key={d}><Check />{d}</li>)}</ul>
            </div>
            <div className="info-card">
              <h4><CalendarCheck /> Age eligibility</h4>
              <table className="fee-table"><tbody>{AGE.map(([c, a]) => <tr key={c}><td>{c}</td><td style={{ fontWeight: 600 }}>{a}</td></tr>)}</tbody></table>
            </div>
            <div className="info-card">
              <h4><Info /> Indicative annual tuition</h4>
              <table className="fee-table">
                <tbody>
                  <tr><td>Pre-Primary</td><td>{formatINR(ANNUAL_FEE['pre-primary'])}</td></tr>
                  <tr><td>Grades I – V</td><td>{formatINR(ANNUAL_FEE.primary)}</td></tr>
                  <tr><td>Grades VI – VIII</td><td>{formatINR(ANNUAL_FEE.middle)}</td></tr>
                  <tr><td>Grades IX – X</td><td>{formatINR(ANNUAL_FEE.secondary)}</td></tr>
                  <tr><td>Grades XI – XII</td><td>{formatINR(ANNUAL_FEE['senior-secondary'])}</td></tr>
                </tbody>
              </table>
              <p className="muted" style={{ fontSize: 12.5, marginTop: 10 }}>Payable in 4 installments. Transport, books and uniform are charged separately. Final fee structure is shared at counselling.</p>
            </div>
            <a className="c-card" href={SCHOOL.phoneHref}><Phone /><div><small>Talk to admissions</small><strong>{SCHOOL.admissionsPhone}</strong></div></a>
          </div>
          <div>
            <EnquiryForm title="Admission Enquiry Form" text="Tell us about your child. Fields marked * are required." />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <SectionHead center eyebrow="FAQs" title="Questions parents <em>often ask</em>" />
          {FAQS.map(([q, a]) => (
            <details key={q} className="faq">
              <summary>{q}<Plus /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
