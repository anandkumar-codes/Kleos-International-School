import { rng, pick, between } from '../utils/random';
import { isoDate, gradeFor } from '../utils/format';

export const CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
export const SECTIONS = ['A', 'B', 'C'];
export const sectionsFor = (cls) => (cls === 'XI' || cls === 'XII' ? ['A', 'B'] : SECTIONS);
export const classLabel = (cls) => (['Nursery', 'LKG', 'UKG'].includes(cls) ? cls : `Grade ${cls}`);

export function stageOf(cls) {
  const i = CLASSES.indexOf(cls);
  if (i <= 2) return 'pre-primary';
  if (i <= 7) return 'primary';
  if (i <= 10) return 'middle';
  if (i <= 12) return 'secondary';
  return 'senior-secondary';
}

export const ANNUAL_FEE = { 'pre-primary': 64000, primary: 78000, middle: 88000, secondary: 98000, 'senior-secondary': 116000 };

export const SUBJECTS = {
  'pre-primary': ['English', 'Numbers', 'EVS', 'Rhymes', 'Art'],
  primary: ['English', 'Telugu', 'Hindi', 'Mathematics', 'EVS', 'Computers'],
  middle: ['English', 'Telugu', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computers'],
  secondary: ['English', 'Telugu', 'Mathematics', 'Science', 'Social Science', 'AI'],
  'senior-secondary': ['English', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science'],
};

export const DEPARTMENTS = ['Pre-Primary', 'English', 'Mathematics', 'Science', 'Social Science', 'Languages', 'Computer Science', 'Commerce', 'Physical Education', 'Arts & Music'];

export const ADMISSION_STAGES = ['Enquiry', 'Application', 'Document Verification', 'Assessment', 'Interaction', 'Confirmed'];

const BOYS = ['Aarav', 'Arjun', 'Sai Charan', 'Pranav', 'Rithvik', 'Vihaan', 'Karthik', 'Abhiram', 'Rohan', 'Varun', 'Siddharth', 'Harsha', 'Nikhil', 'Aditya', 'Krishna', 'Yashwanth', 'Teja', 'Akhil', 'Dhruv', 'Ishaan', 'Manish', 'Sathvik', 'Tanish', 'Vamsi', 'Advaith', 'Shreyas', 'Lohith', 'Charan', 'Hemanth', 'Ayaan'];
const GIRLS = ['Ananya', 'Harshitha', 'Sri Vidya', 'Navya', 'Diya', 'Aadhya', 'Keerthana', 'Sahithi', 'Meghana', 'Pooja', 'Riya', 'Sneha', 'Tanvi', 'Varshini', 'Lasya', 'Ishita', 'Nithya', 'Bhavya', 'Charvi', 'Hasini', 'Akshara', 'Manasvi', 'Shreya', 'Kavya', 'Mahathi', 'Samhitha', 'Pranavi', 'Deekshitha', 'Saanvi', 'Jahnavi'];
const SURNAMES = ['Reddy', 'Rao', 'Sharma', 'Varma', 'Naidu', 'Goud', 'Chowdary', 'Gupta', 'Kumar', 'Patel', 'Iyer', 'Nair', 'Agarwal', 'Yadav', 'Raju', 'Murthy', 'Prasad', 'Shetty', 'Kulkarni', 'Bhat', 'Mehta', 'Sinha'];
const FATHERS = ['Srinivas', 'Ravi', 'Venkatesh', 'Ramesh', 'Suresh', 'Prakash', 'Kiran', 'Mahesh', 'Rajesh', 'Naveen', 'Anil', 'Sandeep', 'Vijay', 'Sridhar', 'Praveen', 'Harish', 'Murali', 'Satish', 'Raghu', 'Vinod'];
const MOTHERS = ['Lakshmi', 'Padma', 'Swathi', 'Kavitha', 'Madhavi', 'Sravani', 'Anitha', 'Deepa', 'Sunitha', 'Radhika', 'Sowmya', 'Priya', 'Divya', 'Rajitha', 'Jyothi'];
const AREAS = ['Miyapur', 'Chandanagar', 'Bachupally', 'Nizampet', 'Madinaguda', 'Hafeezpet', 'Kondapur', 'Pragathi Nagar', 'Allwyn Colony', 'Lingampally', 'BHEL Township', 'Hydernagar', 'JP Nagar'];
const BLOOD = ['O+', 'B+', 'A+', 'AB+', 'O-', 'B-'];
const HOUSES = ['Aryabhata', 'Raman', 'Kalam', 'Tagore'];
const MODES = ['UPI', 'UPI', 'UPI', 'Net Banking', 'Debit Card', 'Credit Card', 'Cheque', 'Cash'];

const mobile = (r) => `${pick(r, ['9', '8', '7', '6'])}${between(r, 100000000, 999999999)}`.replace(/^(\d{5})(\d{5})$/, '+91 $1 $2');
const daysAgo = (now, d) => new Date(now.getTime() - d * 86400000);
const daysAhead = (now, d) => new Date(now.getTime() + d * 86400000);

/* ---------- Students & fees ---------- */
function generateStudents(now) {
  const r = rng('kleos-students');
  const students = [];
  const payments = [];
  let seq = 1;
  let receipt = 4120;
  const allSections = CLASSES.flatMap((c) => sectionsFor(c).map((s) => [c, s]));
  allSections.forEach(([cls, sec], si) => {
    const count = si === 0 ? 30 : 29; // 43 sections → 1,248 students
    for (let roll = 1; roll <= count; roll++) {
      const gender = r() < 0.52 ? 'Male' : 'Female';
      const first = gender === 'Male' ? pick(r, BOYS) : pick(r, GIRLS);
      const surname = pick(r, SURNAMES);
      const father = `${pick(r, FATHERS)} ${surname}`;
      const mother = `${pick(r, MOTHERS)} ${surname}`;
      const ci = CLASSES.indexOf(cls);
      const age = ci + 3;
      const dob = new Date(now.getFullYear() - age - 1, between(r, 0, 11), between(r, 1, 28));
      const joinYear = Math.max(2014, now.getFullYear() - between(r, 0, Math.min(ci, 9)));
      const stage = stageOf(cls);
      const annual = ANNUAL_FEE[stage];
      const inst = Math.round(annual / 4);
      const roll100 = r();
      let paidInst;
      let status;
      if (roll100 < 0.66) { paidInst = 2; status = 'Paid'; }
      else if (roll100 < 0.85) { paidInst = 1; status = 'Pending'; }
      else if (roll100 < 0.93) { paidInst = 1; status = 'Partial'; }
      else { paidInst = 0; status = 'Overdue'; }
      const id = `KIS${String(seq).padStart(4, '0')}`;
      const area = pick(r, AREAS);
      const dip = r() < 0.045;
      const attendance = dip ? 76 + r() * 8.5 : Math.min(99.5, Math.max(85.5, 93 + (r() - 0.45) * 12));
      let paid = 0;
      for (let k = 0; k < paidInst; k++) {
        const base = k === 0 ? between(r, 95, 185) : r() < 0.118 ? between(r, 1, 29) : between(r, 31, 75);
        const amount = status === 'Partial' && k === 0 ? Math.round(inst * 0.6) : inst;
        paid += amount;
        payments.push({
          id: `PAY-${receipt}`,
          receiptNo: `KIS/26-27/${receipt++}`,
          studentId: id,
          studentName: `${first} ${surname}`,
          class: `${cls}-${sec}`,
          amount,
          mode: pick(r, MODES),
          term: `Installment ${k + 1}`,
          date: daysAgo(now, base).toISOString(),
          status: 'Success',
        });
      }
      students.push({
        id,
        admissionNo: `ADM/${joinYear}/${String(between(r, 100, 999))}`,
        name: `${first} ${surname}`,
        gender,
        class: cls,
        section: sec,
        rollNo: roll,
        dob: isoDate(dob),
        bloodGroup: pick(r, BLOOD),
        house: pick(r, HOUSES),
        fatherName: father,
        motherName: mother,
        phone: mobile(r),
        email: `${father.split(' ')[0].toLowerCase()}.${surname.toLowerCase()}${between(r, 1, 99)}@gmail.com`,
        address: `${between(r, 1, 9)}-${between(r, 10, 120)}/${between(r, 1, 40)}, ${area}, Hyderabad`,
        area,
        transport: r() < 0.58 ? `Route ${between(r, 1, 14)}` : 'Own',
        joined: `${joinYear}-06-${String(between(r, 10, 20))}`,
        attendance: Math.round(attendance * 10) / 10,
        annualFee: annual,
        feePaid: paid,
        feeStatus: status,
        status: 'Active',
      });
      seq++;
    }
  });
  return { students, payments };
}

// Fix the two demo accounts used by the parent & student portals.
function pinDemoStudents(students) {
  const a = students.find((s) => s.class === 'VI' && s.section === 'A' && s.rollNo === 1);
  Object.assign(a, { name: 'Aarav Reddy', gender: 'Male', fatherName: 'Srinivas Reddy', motherName: 'Swathi Reddy', email: 'srinivas.reddy@gmail.com', phone: '+91 98480 22146', house: 'Kalam', area: 'Miyapur', address: '4-72/11, Mayuri Nagar, Miyapur, Hyderabad', transport: 'Route 3', attendance: 95.8, feeStatus: 'Pending', bloodGroup: 'B+' });
  const s = students.find((x) => x.class === 'IX' && x.section === 'A' && x.rollNo === 1);
  Object.assign(s, { name: 'Sahithi Naidu', gender: 'Female', fatherName: 'Venkatesh Naidu', motherName: 'Radhika Naidu', email: 'venkatesh.naidu@gmail.com', phone: '+91 99890 41723', house: 'Tagore', area: 'Chandanagar', address: '2-15/7, Gangaram, Chandanagar, Hyderabad', transport: 'Route 7', attendance: 97.2, feeStatus: 'Paid', bloodGroup: 'O+' });
  return { parentChildId: a.id, studentId: s.id };
}

/* ---------- Teachers ---------- */
const TEACHER_ROSTER = [
  ['Mrs. Deepa Nair', 'Pre-Primary', 'Head — Pre-Primary', 'M.A., Montessori Diploma', 18],
  ['Mr. Suresh Babu', 'Mathematics', 'Vice Principal & PGT Mathematics', 'M.Sc., M.Ed.', 21],
  ['Dr. Kavitha Rao', 'Science', 'HOD Science · PGT Chemistry', 'Ph.D. Chemistry, B.Ed.', 16],
  ['Mr. Ravi Shankar Varma', 'Science', 'PGT Physics', 'M.Sc. Physics, B.Ed.', 14],
  ['Mrs. Swathi Kulkarni', 'English', 'HOD English · PGT', 'M.A. English, B.Ed.', 15],
  ['Mrs. Padmaja Reddy', 'Languages', 'TGT Telugu', 'M.A. Telugu, B.Ed.', 19],
  ['Mr. Arvind Sharma', 'Languages', 'TGT Hindi', 'M.A. Hindi, B.Ed.', 12],
  ['Ms. Sneha Iyer', 'Computer Science', 'PGT Computer Science', 'M.Tech., B.Ed.', 9],
  ['Mr. Naveen Goud', 'Physical Education', 'Sports Coordinator', 'M.P.Ed., NIS Certified', 13],
  ['Mrs. Anitha Murthy', 'Social Science', 'TGT Social Science', 'M.A. History, B.Ed.', 11],
  ['Dr. Prakash Chowdary', 'Science', 'PGT Biology', 'Ph.D. Zoology, B.Ed.', 17],
  ['Mrs. Radhika Shetty', 'Arts & Music', 'Music Teacher', 'M.A. Music (Carnatic)', 10],
  ['Mr. Harish Kumar', 'Commerce', 'PGT Accountancy', 'M.Com., CA (Inter), B.Ed.', 8],
  ['Mrs. Jyothi Prasad', 'Mathematics', 'TGT Mathematics', 'M.Sc. Mathematics, B.Ed.', 12],
  ['Ms. Priya Menon', 'Pre-Primary', 'Pre-Primary Teacher', 'B.A., NTT', 7],
  ['Mrs. Sowmya Bhat', 'English', 'PRT English', 'M.A. English, B.Ed.', 9],
  ['Mr. Vinod Yadav', 'Arts & Music', 'Art Teacher', 'B.F.A., M.F.A.', 11],
  ['Mrs. Madhuri Sinha', 'Arts & Music', 'Dance Teacher (Kuchipudi)', 'M.A. Dance', 13],
];

function generateTeachers(now) {
  const r = rng('kleos-teachers');
  const T_FIRST_M = ['Ramesh', 'Sandeep', 'Kiran', 'Vamshi', 'Sridhar', 'Murali', 'Satish', 'Anil', 'Raghu', 'Chandra'];
  const T_FIRST_F = ['Sravani', 'Kavya', 'Divya', 'Sunitha', 'Rajitha', 'Lavanya', 'Bhargavi', 'Hima Bindu', 'Mounika', 'Suma', 'Aparna', 'Usha'];
  const QUAL = {
    'Pre-Primary': ['B.A., NTT', 'B.Sc., Montessori Diploma', 'M.A., NTT'],
    English: ['M.A. English, B.Ed.', 'B.A., B.Ed.'],
    Mathematics: ['M.Sc. Mathematics, B.Ed.', 'B.Sc., B.Ed.'],
    Science: ['M.Sc. Physics, B.Ed.', 'M.Sc. Chemistry, B.Ed.', 'M.Sc. Botany, B.Ed.'],
    'Social Science': ['M.A. Geography, B.Ed.', 'M.A. Economics, B.Ed.'],
    Languages: ['M.A. Telugu, B.Ed.', 'M.A. Hindi, B.Ed.', 'Hindi Pandit Training'],
    'Computer Science': ['MCA, B.Ed.', 'B.Tech., B.Ed.'],
    Commerce: ['M.Com., B.Ed.', 'MBA, B.Ed.'],
    'Physical Education': ['B.P.Ed.', 'M.P.Ed.'],
    'Arts & Music': ['B.F.A.', 'Diploma in Music'],
  };
  const DESIG = { 'Pre-Primary': 'Pre-Primary Teacher', 'Physical Education': 'PET', 'Arts & Music': 'Activity Teacher' };
  const list = TEACHER_ROSTER.map(([name, dept, designation, qualification, experience], i) => ({ name, dept, designation, qualification, experience, featured: true, i }));
  const weights = ['Pre-Primary', 'Pre-Primary', 'English', 'English', 'Mathematics', 'Mathematics', 'Science', 'Science', 'Social Science', 'Languages', 'Languages', 'Computer Science', 'Commerce', 'Physical Education', 'Arts & Music'];
  while (list.length < 86) {
    const female = r() < 0.7;
    const name = `${female ? pick(r, ['Mrs.', 'Ms.']) : 'Mr.'} ${female ? pick(r, T_FIRST_F) : pick(r, T_FIRST_M)} ${pick(r, SURNAMES)}`;
    if (list.some((t) => t.name === name)) continue;
    const dept = pick(r, weights);
    list.push({ name, dept, designation: DESIG[dept] || pick(r, ['TGT', 'PRT', 'PGT']) + ' ' + dept, qualification: pick(r, QUAL[dept]), experience: between(r, 2, 19), featured: false, i: list.length });
  }
  return list.map((t) => {
    const cls = [];
    const n = between(r, 2, 4);
    for (let k = 0; k < n; k++) cls.push(`${pick(r, t.dept === 'Pre-Primary' ? CLASSES.slice(0, 3) : CLASSES.slice(3))}-${pick(r, ['A', 'B'])}`);
    const first = t.name.replace(/^(Dr|Mr|Mrs|Ms)\.?\s+/, '').split(' ')[0].toLowerCase();
    return {
      id: `TCH${String(t.i + 1).padStart(3, '0')}`,
      name: t.name,
      department: t.dept,
      designation: t.designation,
      qualification: t.qualification,
      experience: t.experience,
      classes: [...new Set(cls)],
      phone: mobile(r),
      email: `${first}.${t.i + 1}@kleosschool.in`,
      joined: isoDate(daysAgo(now, between(r, 200, 3600))),
      status: r() < 0.94 ? 'Active' : 'On Leave',
      showOnWebsite: t.featured,
    };
  });
}

/* ---------- Admissions ---------- */
function generateAdmissions(now) {
  const r = rng('kleos-admissions');
  const plan = { Enquiry: 14, Application: 10, 'Document Verification': 7, Assessment: 6, Interaction: 5, Confirmed: 22, Rejected: 6 };
  const out = [];
  let n = 101;
  Object.entries(plan).forEach(([stage, count]) => {
    for (let i = 0; i < count; i++) {
      const male = r() < 0.5;
      const surname = pick(r, SURNAMES);
      const cls = pick(r, ['Nursery', 'Nursery', 'LKG', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'XI', 'XI']);
      const ageDays = stage === 'Enquiry' ? between(r, 0, 12) : stage === 'Confirmed' || stage === 'Rejected' ? between(r, 20, 70) : between(r, 4, 40);
      out.push({
        id: `ADM-27-${n++}`,
        studentName: `${male ? pick(r, BOYS) : pick(r, GIRLS)} ${surname}`,
        parentName: `${pick(r, FATHERS)} ${surname}`,
        phone: mobile(r),
        email: `${surname.toLowerCase()}.family${between(r, 1, 99)}@gmail.com`,
        class: cls,
        academicYear: '2027–28',
        appliedOn: daysAgo(now, ageDays).toISOString(),
        stage,
        source: pick(r, ['Website', 'Website', 'Walk-in', 'Referral', 'Google', 'Instagram']),
        previousSchool: cls === 'Nursery' ? '—' : pick(r, ['Delhi Public School', 'Sri Chaitanya School', 'Narayana e-Techno', 'Meridian School', 'Johnson Grammar School', 'Local play school']),
        notes: '',
      });
    }
  });
  return out.sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));
}

/* ---------- Attendance (generated per class per day) ---------- */
export function isSchoolDay(d) {
  const day = d.getDay();
  if (day === 0) return false;
  const holidays = ['2026-10-02', '2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-11-08', '2026-12-25', '2027-01-14', '2027-01-15', '2027-01-26'];
  return !holidays.includes(isoDate(d));
}

export function lastSchoolDay(from = new Date()) {
  const d = new Date(from);
  d.setHours(12, 0, 0, 0);
  while (!isSchoolDay(d)) d.setDate(d.getDate() - 1);
  return d;
}

export function recentSchoolDays(n, from = new Date()) {
  const days = [];
  const d = lastSchoolDay(from);
  while (days.length < n) {
    if (isSchoolDay(d)) days.unshift(new Date(d));
    d.setDate(d.getDate() - 1);
  }
  return days;
}

export function classAttendance(cls, section, date, strength = 29) {
  const r = rng(`att-${cls}-${section}-${isoDate(date)}`);
  const base = 0.925 + r() * 0.05 - (date.getDay() === 6 ? 0.02 : 0);
  const present = Math.round(strength * base);
  const late = Math.min(present, between(r, 0, 2));
  const absent = strength - present;
  return { class: cls, section, date: isoDate(date), strength, present, absent, late, pct: (present / strength) * 100 };
}

// Per-student daily status for the portals
export function studentDayStatus(studentId, date) {
  const r = rng(`sday-${studentId}-${isoDate(date)}`)();
  if (r < 0.04) return 'Absent';
  if (r < 0.07) return 'Late';
  return 'Present';
}

/* ---------- Exams & marks ---------- */
export const EXAMS = [
  { id: 'ut1', name: 'Unit Test I', month: 'July 2026', max: 25, status: 'Published' },
  { id: 'hy', name: 'Half-Yearly Examination', month: 'September 2026', max: 80, status: 'Published' },
  { id: 'ut2', name: 'Unit Test II', month: 'November 2026', max: 25, status: 'Scheduled' },
  { id: 'annual', name: 'Annual Examination', month: 'March 2027', max: 80, status: 'Scheduled' },
];

export function marksFor(studentId, examId, subject, overrides = {}) {
  const key = `${studentId}|${examId}|${subject}`;
  if (overrides[key] != null) return overrides[key];
  const exam = EXAMS.find((e) => e.id === examId);
  if (!exam || exam.status !== 'Published') return null;
  const ability = 0.55 + rng(`ability-${studentId}`)() * 0.42;
  const subj = (rng(`${studentId}-${subject}`)() - 0.5) * 0.18;
  const noise = (rng(key)() - 0.5) * 0.12;
  const p = Math.min(0.99, Math.max(0.3, ability + subj + noise));
  return Math.round(p * exam.max);
}

export function resultRow(student, examId, overrides) {
  const exam = EXAMS.find((e) => e.id === examId);
  const subjects = SUBJECTS[stageOf(student.class)];
  const marks = Object.fromEntries(subjects.map((s) => [s, marksFor(student.id, examId, s, overrides)]));
  const vals = Object.values(marks).filter((v) => v != null);
  const total = vals.reduce((a, b) => a + b, 0);
  const percent = vals.length ? (total / (vals.length * exam.max)) * 100 : 0;
  return { marks, total, percent, grade: gradeFor(percent), max: subjects.length * exam.max };
}

/* ---------- Timetable ---------- */
export const PERIOD_TIMES = ['8:45 – 9:25', '9:25 – 10:05', '10:05 – 10:45', '11:00 – 11:40', '11:40 – 12:20', '1:00 – 1:40', '1:40 – 2:20', '2:20 – 3:00'];
export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function timetableFor(cls, section) {
  const r = rng(`tt-${cls}-${section}`);
  const subjects = SUBJECTS[stageOf(cls)];
  const extras = ['Library', 'Games', 'Art', 'Music', 'Yoga', 'Lab'];
  return WEEKDAYS.map((day, di) =>
    PERIOD_TIMES.map((time, pi) => {
      if (di === 5 && pi >= 5) return { time, subject: pi === 5 ? 'Club Activity' : '—' };
      if (pi === 7 && r() < 0.5) return { time, subject: pick(r, extras) };
      return { time, subject: subjects[(pi + di * 2 + between(r, 0, 1)) % subjects.length] };
    }),
  );
}

/* ---------- Misc operational data ---------- */
function generateAssignments(now) {
  const list = [
    ['Fractions worksheet — Exercise 7.3', 'Mathematics', 'VI', 'Mrs. Jyothi Prasad', 2],
    ['Write a diary entry: "A Day at the Bathukamma Festival"', 'English', 'VI', 'Mrs. Sowmya Bhat', 4],
    ['Model of the water cycle (group project)', 'Science', 'VI', 'Dr. Kavitha Rao', 9],
    ['Map work: Rivers of India', 'Social Science', 'VI', 'Mrs. Anitha Murthy', 6],
    ['Scratch animation: Life cycle of a butterfly', 'Computers', 'VI', 'Ms. Sneha Iyer', 11],
    ['Telugu padyalu recitation practice', 'Telugu', 'VI', 'Mrs. Padmaja Reddy', 3],
    ['Quadratic equations — Board practice set 2', 'Mathematics', 'IX', 'Mr. Suresh Babu', 3],
    ['Lab record: Laws of motion experiments', 'Science', 'IX', 'Mr. Ravi Shankar Varma', 5],
    ['Essay: The role of AI in healthcare', 'AI', 'IX', 'Ms. Sneha Iyer', 8],
    ['French Revolution — timeline chart', 'Social Science', 'IX', 'Mrs. Anitha Murthy', -2],
    ['Letter to the editor: Water conservation in Hyderabad', 'English', 'IX', 'Mrs. Swathi Kulkarni', -5],
    ['Organic chemistry — IUPAC naming worksheet', 'Chemistry', 'XII', 'Dr. Kavitha Rao', 4],
    ['Financial statements — practice problems', 'Accountancy', 'XI', 'Mr. Harish Kumar', 6],
  ];
  return list.map(([title, subject, cls, teacher, due], i) => ({
    id: `ASG-${300 + i}`,
    title,
    subject,
    class: cls,
    sections: sectionsFor(cls),
    teacher,
    assignedOn: daysAgo(now, Math.abs(due) + 5).toISOString(),
    dueDate: (due >= 0 ? daysAhead(now, due) : daysAgo(now, -due)).toISOString(),
    submissions: due < 0 ? between(rng(title), 78, 87) : between(rng(title), 10, 60),
    total: sectionsFor(cls).length * 29,
  }));
}

function generateMessages(now) {
  return [
    { id: 'm1', from: 'Srinivas Reddy', role: 'Parent · Aarav Reddy (VI-A)', subject: 'Transport route change request', body: 'We are shifting to Mayuri Nagar next month. Could Aarav be moved to Route 5 from 1 November?', date: daysAgo(now, 0.05).toISOString(), read: false },
    { id: 'm2', from: 'Madhavi Sharma', role: 'Parent · Navya Sharma (VI-B)', subject: 'Leave for family function', body: 'Navya will be on leave on 15 and 16 October for a family function in Vijayawada.', date: daysAgo(now, 0.2).toISOString(), read: false },
    { id: 'm3', from: 'Kiran Goud', role: 'Prospective parent', subject: 'Admission for Grade XI BiPC', body: 'Is integrated NEET coaching included in the Grade XI fee, or is it charged separately?', date: daysAgo(now, 0.6).toISOString(), read: false },
    { id: 'm4', from: 'Dr. Kavitha Rao', role: 'HOD Science', subject: 'Science exhibition budget', body: 'Sharing the estimate for exhibition materials — ₹42,000. Please approve by Friday.', date: daysAgo(now, 1.1).toISOString(), read: true },
    { id: 'm5', from: 'Rajitha Chowdary', role: 'Parent · Ishita Chowdary (III-C)', subject: 'Fee receipt not received', body: 'I paid the second installment via UPI on Monday but haven’t received the receipt yet.', date: daysAgo(now, 1.6).toISOString(), read: true },
    { id: 'm6', from: 'Mr. Naveen Goud', role: 'Sports Coordinator', subject: 'Sports Day — chief guest confirmation', body: 'The district sports officer has confirmed for 12 December. Invitation letter attached.', date: daysAgo(now, 2.4).toISOString(), read: true },
  ];
}

function generateNotifications(now) {
  return [
    { id: 'n1', type: 'admission', title: 'New admission enquiry', text: 'Kiran Goud enquired for Grade XI (BiPC) via website.', date: daysAgo(now, 0.01).toISOString(), read: false },
    { id: 'n2', type: 'fee', title: 'Fee payment received', text: '₹22,000 from Ananya Rao (IV-B) via UPI.', date: daysAgo(now, 0.04).toISOString(), read: false },
    { id: 'n3', type: 'message', title: 'New parent message', text: 'Srinivas Reddy: Transport route change request.', date: daysAgo(now, 0.05).toISOString(), read: false },
    { id: 'n4', type: 'attendance', title: 'Attendance alert', text: 'Grade VIII-C attendance below 88% today.', date: daysAgo(now, 0.15).toISOString(), read: false },
    { id: 'n5', type: 'student', title: 'New student registered', text: 'Advaith Patel admitted to LKG-B.', date: daysAgo(now, 0.4).toISOString(), read: true },
    { id: 'n6', type: 'event', title: 'Upcoming event', text: 'Bathukamma celebrations on 16 October — volunteers needed.', date: daysAgo(now, 0.9).toISOString(), read: true },
  ];
}

function generateActivity(now) {
  return [
    { id: 'ac1', type: 'admission', text: 'New admission application from Kiran Goud — Grade XI', date: daysAgo(now, 0.01).toISOString() },
    { id: 'ac2', type: 'fee', text: 'Fee payment of ₹22,000 received from Ananya Rao (IV-B)', date: daysAgo(now, 0.04).toISOString() },
    { id: 'ac3', type: 'announcement', text: 'Announcement published: Admissions open for 2027–28', date: daysAgo(now, 0.2).toISOString() },
    { id: 'ac4', type: 'student', text: 'New student registered: Advaith Patel, LKG-B', date: daysAgo(now, 0.4).toISOString() },
    { id: 'ac5', type: 'teacher', text: 'Teacher added: Ms. Lavanya Raju (Mathematics)', date: daysAgo(now, 1.2).toISOString() },
    { id: 'ac6', type: 'exam', text: 'Half-Yearly results published for Grades I – XII', date: daysAgo(now, 3).toISOString() },
    { id: 'ac7', type: 'event', text: 'Event created: Annual Sports Day, 12 December', date: daysAgo(now, 4).toISOString() },
  ];
}

function generateLeaves(now) {
  return [
    { id: 'lv1', from: isoDate(daysAhead(now, 13)), to: isoDate(daysAhead(now, 14)), reason: 'Family function in Vijayawada', status: 'Pending', applied: daysAgo(now, 0.3).toISOString() },
    { id: 'lv2', from: isoDate(daysAgo(now, 22)), to: isoDate(daysAgo(now, 22)), reason: 'Fever — doctor’s note attached', status: 'Approved', applied: daysAgo(now, 23).toISOString() },
    { id: 'lv3', from: isoDate(daysAgo(now, 61)), to: isoDate(daysAgo(now, 60)), reason: 'Grandmother’s birthday', status: 'Approved', applied: daysAgo(now, 66).toISOString() },
  ];
}

function generatePortalMessages(now) {
  return [
    { id: 'pm1', from: 'Mrs. Jyothi Prasad', role: 'Class Teacher, VI-A', body: 'Aarav did very well in the maths olympiad practice test today — 23/25! Please encourage him to continue the daily practice sheets.', date: daysAgo(now, 0.3).toISOString(), mine: false },
    { id: 'pm2', from: 'You', role: 'Parent', body: 'Thank you, ma’am! He has been enjoying the puzzles. Will the olympiad registration be through school?', date: daysAgo(now, 0.25).toISOString(), mine: true },
    { id: 'pm3', from: 'Mrs. Jyothi Prasad', role: 'Class Teacher, VI-A', body: 'Yes, registrations close on 20 October. The circular will be shared in the app this week.', date: daysAgo(now, 0.2).toISOString(), mine: false },
  ];
}

export function generateRecords() {
  const now = new Date();
  const { students, payments } = generateStudents(now);
  const demo = pinDemoStudents(students);
  // Parent demo: Aarav has paid installment 1 only, so the portal shows a real due + Pay now flow.
  const aarav = students.find((x) => x.id === demo.parentChildId);
  const keep = payments.filter((p) => p.studentId !== aarav.id || p.term === 'Installment 1');
  payments.length = 0;
  payments.push(...keep);
  aarav.feePaid = keep.filter((p) => p.studentId === aarav.id).reduce((a, p) => a + p.amount, 0);
  // keep payment names in sync with pinned demo students
  payments.forEach((p) => {
    const s = students.find((x) => x.id === p.studentId);
    if (s && (s.id === demo.parentChildId || s.id === demo.studentId)) p.studentName = s.name;
  });
  return {
    seededAt: now.toISOString(),
    demo,
    students,
    payments: payments.sort((a, b) => new Date(b.date) - new Date(a.date)),
    teachers: generateTeachers(now),
    admissions: generateAdmissions(now),
    assignments: generateAssignments(now),
    messages: generateMessages(now),
    notifications: generateNotifications(now),
    activity: generateActivity(now),
    leaves: generateLeaves(now),
    portalMessages: generatePortalMessages(now),
    marks: {},
  };
}
