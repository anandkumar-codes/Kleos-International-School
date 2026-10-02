import { CLASSES, sectionsFor, classAttendance, recentSchoolDays, lastSchoolDay, ADMISSION_STAGES } from '../data/records';

// Section strength from the live student list.
export function sectionStrengths(students) {
  const map = {};
  students.forEach((s) => {
    const k = `${s.class}-${s.section}`;
    map[k] = (map[k] || 0) + 1;
  });
  return map;
}

export function attendanceForDay(students, date) {
  const strengths = sectionStrengths(students);
  const rows = CLASSES.flatMap((c) => sectionsFor(c).map((s) => classAttendance(c, s, date, strengths[`${c}-${s}`] || 0))).filter((r) => r.strength);
  const total = rows.reduce((a, r) => a + r.strength, 0);
  const present = rows.reduce((a, r) => a + r.present, 0);
  const late = rows.reduce((a, r) => a + r.late, 0);
  return { rows, total, present, late, absent: total - present, pct: total ? (present / total) * 100 : 0 };
}

export function attendanceToday(students) {
  return attendanceForDay(students, lastSchoolDay());
}

export function weeklyAttendance(students, days = 6) {
  return recentSchoolDays(days).map((d) => {
    const a = attendanceForDay(students, d);
    return {
      label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
      Present: a.present - a.late,
      Late: a.late,
      Absent: a.absent,
      pct: Math.round(a.pct * 10) / 10,
    };
  });
}

export function monthlyCollections(payments, months = 7) {
  const now = new Date();
  const out = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('en-IN', { month: 'short' }), Collected: 0 });
  }
  payments.forEach((p) => {
    const d = new Date(p.date);
    const row = out.find((o) => o.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (row) row.Collected += p.amount;
  });
  return out;
}

export const sumLast = (payments, days) => payments.filter((p) => Date.now() - new Date(p.date) < days * 864e5).reduce((a, p) => a + p.amount, 0);

export function feeSummary(students) {
  const total = students.reduce((a, s) => a + s.annualFee, 0);
  const paid = students.reduce((a, s) => a + s.feePaid, 0);
  // Due so far = first two quarterly installments.
  const dueToDate = students.reduce((a, s) => a + s.annualFee / 2, 0);
  const overdueStudents = students.filter((s) => s.feeStatus === 'Overdue');
  const overdue = overdueStudents.reduce((a, s) => a + (s.annualFee / 2 - s.feePaid), 0);
  const pendingDue = Math.max(0, dueToDate - paid - overdue);
  const byStatus = ['Paid', 'Pending', 'Partial', 'Overdue'].map((st) => ({ status: st, count: students.filter((s) => s.feeStatus === st).length }));
  return { total, paid, dueToDate, pending: pendingDue, overdue, outstanding: total - paid, byStatus };
}

// Count of applications that reached at least each stage.
export function admissionsFunnel(admissions, stages = ['Enquiry', 'Application', 'Assessment', 'Confirmed']) {
  const idx = (s) => ADMISSION_STAGES.indexOf(s);
  return stages.map((st) => ({
    stage: st,
    count: admissions.filter((a) => (a.stage === 'Rejected' ? idx('Assessment') : idx(a.stage)) >= idx(st)).length,
  }));
}

// Strength trend: this year vs last year, Jun → current month.
export function enrollmentTrend(current) {
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const now = new Date();
  const ay = now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1;
  const elapsed = Math.max(1, Math.min(10, (now.getFullYear() - ay) * 12 + now.getMonth() - 5 + 1));
  const lastYear = [1104, 1118, 1129, 1133, 1137, 1140, 1142, 1144, 1146, 1146];
  const start = current - (elapsed - 1) * 13;
  return months.map((m, i) => ({ label: m, '2025–26': lastYear[i], '2026–27': i < elapsed ? Math.min(current, start + i * 13) : null }));
}
