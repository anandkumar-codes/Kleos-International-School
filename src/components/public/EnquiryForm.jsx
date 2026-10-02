import { useState } from 'react';
import { Send, CircleCheck } from 'lucide-react';
import { Input, Select, Textarea, Button, Alert, useForm } from '../ui';
import { required, email, phoneIN, minLen } from '../../utils/validate';
import { CLASSES, classLabel } from '../../data/records';
import { SCHOOL } from '../../data/school';
import { useStore } from '../../services/store';
import { submitEnquiry, submitContact } from '../../services/api';

const EMPTY = { parentName: '', studentName: '', phone: '', email: '', class: '', academicYear: SCHOOL.admissionYear, message: '' };

export function EnquiryForm({ compact, title = 'Admission Enquiry', text = 'Share a few details and our admissions team will call you within one working day.' }) {
  const store = useStore();
  const [status, setStatus] = useState('idle');
  const [ref, setRef] = useState('');
  const form = useForm(EMPTY, {
    parentName: [required('Parent name'), minLen(3, 'Parent name')],
    studentName: [required('Student name')],
    phone: [required('Phone number'), phoneIN],
    email: [required('Email'), email],
    class: [required('Class')],
    academicYear: [required('Academic year')],
  });

  const onSubmit = form.submit(async (values) => {
    setStatus('loading');
    try {
      const rec = await submitEnquiry(store, values);
      setRef(rec.id);
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  });

  if (status === 'success')
    return (
      <div className="form-card">
        <div className="form-success">
          <div className="form-success__ico"><CircleCheck /></div>
          <h3>Thank you — enquiry received!</h3>
          <p>Your reference number is <strong>{ref}</strong>. Our admissions counsellor will call you shortly to schedule a campus visit.</p>
          <Button variant="outline" onClick={() => setStatus('idle')}>Submit another enquiry</Button>
        </div>
      </div>
    );

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate>
      <h3>{title}</h3>
      <p>{text}</p>
      {status === 'error' && <Alert tone="error" title="Something went wrong" className="mb">We couldn&apos;t send your enquiry. Please try again or call {SCHOOL.phone}.</Alert>}
      <div className="form-grid">
        <Input label="Parent / Guardian name" required placeholder="e.g. Ravi Kumar" autoComplete="name" {...form.bind('parentName')} />
        <Input label="Student name" required placeholder="Child’s full name" {...form.bind('studentName')} />
        <Input label="Mobile number" required type="tel" placeholder="98765 43210" autoComplete="tel" inputMode="tel" {...form.bind('phone')} />
        <Input label="Email" required type="email" placeholder="you@example.com" autoComplete="email" {...form.bind('email')} />
        <Select label="Class applying for" required placeholder="Select class" options={CLASSES.map((c) => ({ value: c, label: classLabel(c) }))} {...form.bind('class')} />
        <Select label="Academic year" required options={[SCHOOL.academicYear, SCHOOL.admissionYear]} {...form.bind('academicYear')} />
        {!compact && <Textarea className="span-2" label="Message (optional)" placeholder="Anything you'd like us to know — transport needs, previous school, questions…" {...form.bind('message')} />}
      </div>
      <Button type="submit" variant="primary" size="lg" block loading={status === 'loading'} icon={Send} style={{ marginTop: 22 }}>
        {status === 'loading' ? 'Sending…' : 'Submit Enquiry'}
      </Button>
      <p className="muted" style={{ fontSize: 12.5, marginTop: 12, textAlign: 'center' }}>We respect your privacy. Your details are used only to respond to this enquiry.</p>
    </form>
  );
}

export function ContactForm() {
  const store = useStore();
  const [status, setStatus] = useState('idle');
  const form = useForm({ name: '', email: '', phone: '', subject: 'General enquiry', message: '' }, {
    name: [required('Name')],
    email: [required('Email'), email],
    phone: [phoneIN],
    message: [required('Message'), minLen(10, 'Message')],
  });
  const onSubmit = form.submit(async (v) => {
    setStatus('loading');
    await submitContact(store, v);
    setStatus('success');
    form.reset();
  });
  if (status === 'success')
    return (
      <div className="form-card">
        <div className="form-success">
          <div className="form-success__ico"><CircleCheck /></div>
          <h3>Message sent</h3>
          <p>Thank you for writing to us. The school office will respond within one working day.</p>
          <Button variant="outline" onClick={() => setStatus('idle')}>Send another message</Button>
        </div>
      </div>
    );
  return (
    <form className="form-card" onSubmit={onSubmit} noValidate>
      <h3>Send us a message</h3>
      <p>For general queries, feedback or appointments with the Principal.</p>
      <div className="form-grid">
        <Input label="Your name" required {...form.bind('name')} />
        <Input label="Email" type="email" required {...form.bind('email')} />
        <Input label="Phone" type="tel" {...form.bind('phone')} />
        <Select label="Subject" options={['General enquiry', 'Appointment with Principal', 'Transport', 'Fees & accounts', 'Feedback', 'Careers']} {...form.bind('subject')} />
        <Textarea className="span-2" label="Message" required {...form.bind('message')} />
      </div>
      <Button type="submit" size="lg" block loading={status === 'loading'} icon={Send} style={{ marginTop: 22 }}>Send Message</Button>
    </form>
  );
}
