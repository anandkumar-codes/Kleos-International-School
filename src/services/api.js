// Service layer: today these write to the local store; swap the bodies for fetch() calls
// to a real backend without touching any page component.

const delay = (ms = 650) => new Promise((r) => setTimeout(r, ms));

export async function submitEnquiry(store, v) {
  await delay();
  const next = 101 + store.state.admissions.length;
  const rec = store.add('admissions', {
    id: `ADM-27-${next}`,
    studentName: v.studentName.trim(),
    parentName: v.parentName.trim(),
    phone: v.phone.trim(),
    email: v.email.trim(),
    class: v.class,
    academicYear: v.academicYear,
    appliedOn: new Date().toISOString(),
    stage: 'Enquiry',
    source: 'Website',
    previousSchool: '—',
    notes: v.message || '',
  });
  store.notify('admission', 'New admission enquiry', `${rec.parentName} enquired for ${rec.class} via website.`);
  store.log('admission', `New admission enquiry from ${rec.parentName} — ${rec.class}`);
  return rec;
}

export async function submitContact(store, v) {
  await delay();
  store.add('messages', {
    from: v.name,
    role: `Website · ${v.email}${v.phone ? ' · ' + v.phone : ''}`,
    subject: v.subject,
    body: v.message,
    date: new Date().toISOString(),
    read: false,
  });
  store.notify('message', 'New website message', `${v.name}: ${v.subject}`);
}
