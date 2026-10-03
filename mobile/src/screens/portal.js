// Views shared by the parent and student apps.
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useStore } from '@/lib/store';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Avatar, Badge, Card, Chips, DateTile, Empty, HeroCard, Progress, Row, Segmented, T, tap, useToast, Button, cardStyle } from '@/components/ui';
import { BarChart, SERIES } from '@/components/charts';
import { classLabel, timetableFor, PERIOD_TIMES, WEEKDAYS, EXAMS, SUBJECTS, stageOf, resultRow, studentDayStatus, isSchoolDay } from '@shared/data/records';
import { formatDate, formatINR, formatLakh, pct, gradeFor, timeAgo } from '@shared/utils/format';
import { sortedNotices, upcomingEvents } from '@shared/utils/content';

const SUBJECT_TINT = ['#DFF0E8', '#E2EEFB', '#FDF0D8', '#EEE7FA', '#FBE3E4', '#DFF3F7', '#F1F4F3'];
export const subjectTint = (s, all) => SUBJECT_TINT[Math.max(0, all.indexOf(s)) % SUBJECT_TINT.length];

/* ---------- Student banner ---------- */
export function StudentBanner({ student, role }) {
  const { state } = useStore();
  const hy = resultRow(student, 'hy', state.marks);
  const due = Math.max(0, student.annualFee / 2 - student.feePaid);
  const grad = role === 'student' ? ['#3A6FE0', '#1B3E8F'] : [colors.green700, colors.green950];
  return (
    <HeroCard colorsFrom={grad}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Avatar name={student.name} size={58} ring />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: 'rgba(255,255,255,0.75)' }}>{role === 'parent' ? 'Your child' : 'Welcome back'}</Text>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 22, color: '#fff', letterSpacing: -0.4 }}>{role === 'parent' ? student.name : `Hi, ${student.name.split(' ')[0]}!`}</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{classLabel(student.class)} – {student.section} · Roll {student.rollNo} · {student.house}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
        {[[pct(student.attendance, 0), 'Attendance'], [hy.grade, 'Half-yearly'], [due ? formatLakh(due) : 'Clear', 'Fees due']].map(([v, l]) => (
          <View key={l} style={{ flex: 1, padding: 10, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.13)' }}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: fonts.extrabold, fontSize: 18, color: '#fff' }}>{v}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 11.5, color: 'rgba(255,255,255,0.72)' }}>{l}</Text>
          </View>
        ))}
      </View>
    </HeroCard>
  );
}

/* ---------- Today's periods ---------- */
export function TodaySchedule({ student, accent }) {
  const day = new Date().getDay();
  if (day === 0) return <Empty icon="sun" title="It's Sunday — no classes" text="Enjoy the weekend!" />;
  const tt = timetableFor(student.class, student.section)[day - 1];
  const now = new Date().getHours() * 60 + new Date().getMinutes();
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return (h < 8 ? h + 12 : h) * 60 + m; };
  return (
    <View style={{ gap: 6 }}>
      {tt.map((p, i) => {
        const [a, b] = p.time.split(' – ');
        const isNow = now >= toMin(a) && now < toMin(b);
        return (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 12, backgroundColor: isNow ? roleTheme.student.soft : colors.canvas, borderLeftWidth: isNow ? 3 : 0, borderLeftColor: accent }}>
            <Text style={{ width: 92, fontFamily: fonts.medium, fontSize: 12, color: colors.ink500 }}>{p.time}</Text>
            <Text style={{ flex: 1, fontFamily: p.subject === '—' ? fonts.medium : fonts.semibold, fontSize: 14, color: p.subject === '—' ? colors.ink400 : colors.ink900 }}>{p.subject === '—' ? 'Free period' : p.subject}</Text>
            {isNow ? <Badge label="Now" tone="green" /> : null}
          </View>
        );
      })}
    </View>
  );
}

/* ---------- Full timetable ---------- */
export function TimetableView({ student, accent }) {
  const today = Math.max(0, new Date().getDay() - 1);
  const [day, setDay] = useState(Math.min(today, 5));
  const tt = timetableFor(student.class, student.section);
  const subjects = SUBJECTS[stageOf(student.class)];
  return (
    <View style={{ gap: 14 }}>
      <Chips accent={accent} value={day} onChange={setDay} options={WEEKDAYS.map((d, i) => ({ value: i, label: i === today ? `${d.slice(0, 3)} · Today` : d.slice(0, 3) }))} />
      <Card padded={false}>
        {tt[day].map((p, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderTopWidth: i ? 1 : 0, borderTopColor: '#EEF2F0' }}>
            <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 12.5, color: colors.ink500 }}>P{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.ink500 }}>{PERIOD_TIMES[i]}</Text>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: p.subject === '—' ? colors.ink300 : colors.ink900 }}>{p.subject === '—' ? 'Free' : p.subject}</Text>
            </View>
            {p.subject !== '—' ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: subjectTint(p.subject, subjects), borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' }} /> : null}
          </View>
        ))}
      </Card>
      <T v="small" style={{ textAlign: 'center' }}>Short break 10:45 – 11:00 · Lunch 12:20 – 1:00</T>
    </View>
  );
}

/* ---------- Attendance calendar ---------- */
export function AttendanceView({ student, accent }) {
  const [offset, setOffset] = useState(0);
  const base = new Date();
  const month = new Date(base.getFullYear(), base.getMonth() - offset, 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const lead = (month.getDay() + 6) % 7;
  const cells = Array.from({ length: days }, (_, i) => {
    const d = new Date(month.getFullYear(), month.getMonth(), i + 1, 12);
    if (d > new Date()) return { d, k: 'X' };
    if (!isSchoolDay(d)) return { d, k: 'H' };
    return { d, k: studentDayStatus(student.id, d)[0] };
  });
  const count = (k) => cells.filter((c) => c.k === k).length;
  const COLOR = { P: [colors.green100, colors.green800], A: [colors.red100, colors.red600], L: [colors.amber100, '#9A5D00'], H: ['#F1F4F3', colors.ink300], X: ['transparent', colors.ink300] };
  const trend = Array.from({ length: 5 }, (_, i) => {
    const m = new Date(base.getFullYear(), base.getMonth() - 4 + i, 1);
    const n = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    let t = 0, p = 0;
    for (let k = 1; k <= n; k++) { const d = new Date(m.getFullYear(), m.getMonth(), k, 12); if (d > new Date() || !isSchoolDay(d) || m.getMonth() === 4) continue; t++; if (studentDayStatus(student.id, d) !== 'Absent') p++; }
    return t ? { label: m.toLocaleDateString('en-IN', { month: 'short' }), values: [Math.round((p / t) * 100)] } : null;
  }).filter(Boolean);
  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[['Present', count('P'), colors.green700], ['Absent', count('A'), colors.red600], ['Late', count('L'), '#9A5D00']].map(([l, v, c]) => (
          <View key={l} style={[cardStyle, { flex: 1, padding: 12 }]}>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 22, color: c }}>{v}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.ink500 }}>{l} this month</Text>
          </View>
        ))}
      </View>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Pressable accessibilityLabel="Previous month" hitSlop={10} onPress={() => { tap(); setOffset((o) => o + 1); }}><Feather name="chevron-left" size={22} color={colors.ink700} /></Pressable>
          <T v="h3">{month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</T>
          <Pressable accessibilityLabel="Next month" hitSlop={10} disabled={offset === 0} onPress={() => { tap(); setOffset((o) => Math.max(0, o - 1)); }}><Feather name="chevron-right" size={22} color={offset === 0 ? colors.ink300 : colors.ink700} /></Pressable>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <Text key={i} style={{ width: `${100 / 7}%`, textAlign: 'center', fontFamily: fonts.bold, fontSize: 11, color: colors.ink400, marginBottom: 6 }}>{d}</Text>)}
          {Array.from({ length: lead }).map((_, i) => <View key={`l${i}`} style={{ width: `${100 / 7}%` }} />)}
          {cells.map((c) => (
            <View key={c.d.getDate()} style={{ width: `${100 / 7}%`, padding: 2.5 }}>
              <View style={{ aspectRatio: 1, borderRadius: 9, backgroundColor: COLOR[c.k][0], alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.semibold, fontSize: 12.5, color: COLOR[c.k][1] }}>{c.d.getDate()}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
          {[['Present', colors.green100], ['Absent', colors.red100], ['Late', colors.amber100], ['Holiday', '#F1F4F3']].map(([l, c]) => (
            <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: c }} /><Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.ink500 }}>{l}</Text></View>
          ))}
        </View>
      </Card>
      <Card>
        <T v="h3">Monthly attendance</T>
        <T v="small" style={{ marginBottom: 8 }}>% of school days present · tap a bar</T>
        <BarChart data={trend} series={[{ name: 'Attendance', color: accent || SERIES[0] }]} format={(v) => `${v}%`} max={100} height={170} />
      </Card>
    </View>
  );
}

/* ---------- Homework / assignments ---------- */
export function HomeworkView({ student, role, accent }) {
  const { state } = useStore();
  const toast = useToast();
  const [tab, setTab] = useState('pending');
  const [done, setDone] = useState({});
  const subjects = SUBJECTS[stageOf(student.class)];
  const list = state.assignments.filter((a) => a.class === student.class).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const pending = list.filter((a) => new Date(a.dueDate) > Date.now() && !done[a.id]);
  const closed = list.filter((a) => new Date(a.dueDate) <= Date.now() || done[a.id]);
  const show = tab === 'pending' ? pending : closed;
  return (
    <View style={{ gap: 14 }}>
      <Segmented accent={accent} value={tab} onChange={setTab} options={[{ value: 'pending', label: `Pending · ${pending.length}` }, { value: 'done', label: `Done · ${closed.length}` }]} />
      {show.map((a) => {
        const days = Math.ceil((new Date(a.dueDate) - Date.now()) / 864e5);
        return (
          <Card key={a.id} style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: subjectTint(a.subject, subjects), alignItems: 'center', justifyContent: 'center' }}><Feather name="edit-3" size={18} color={colors.ink800} /></View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.ink900 }}>{a.title}</Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.ink500, marginTop: 2 }}>{a.subject} · {a.teacher}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: colors.ink500 }}>Due {formatDate(a.dueDate, { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
              {tab === 'pending' ? <Badge label={days <= 0 ? 'Due today' : `${days} day${days > 1 ? 's' : ''} left`} tone={days <= 2 ? 'red' : 'blue'} /> : <Badge label={done[a.id] ? 'Submitted' : 'Closed'} />}
            </View>
            {tab === 'pending' && role === 'student' ? <Button title="Mark as submitted" variant="soft" size="sm" icon="upload" onPress={() => { setDone((d) => ({ ...d, [a.id]: true })); toast('Assignment submitted', { text: a.title }); }} /> : null}
          </Card>
        );
      })}
      {!show.length ? <Card><Empty icon="check-circle" title={tab === 'pending' ? 'All caught up' : 'Nothing here yet'} text={tab === 'pending' ? 'No pending work right now.' : ''} /></Card> : null}
    </View>
  );
}

/* ---------- Results ---------- */
export function ResultsView({ student, accent }) {
  const { state } = useStore();
  const published = EXAMS.filter((e) => e.status === 'Published');
  const [exam, setExam] = useState(published[published.length - 1].id);
  const ex = EXAMS.find((e) => e.id === exam);
  const subjects = SUBJECTS[stageOf(student.class)];
  const r = resultRow(student, exam, state.marks);
  return (
    <View style={{ gap: 14 }}>
      <Chips accent={accent} value={exam} onChange={setExam} options={EXAMS.map((e) => ({ value: e.id, label: e.name.replace(' Examination', '') }))} />
      {ex.status !== 'Published' ? (
        <Card><Empty icon="calendar" title={`${ex.name} · ${ex.month}`} text="Results will appear here once the school publishes them." /></Card>
      ) : (
        <>
          <HeroCard colorsFrom={accent === roleTheme.student.accent ? ['#3A6FE0', '#1B3E8F'] : [colors.green700, colors.green950]}>
            <Text style={{ fontFamily: fonts.medium, color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{ex.name} · {ex.month}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 14, marginTop: 6 }}>
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 44, color: '#fff', letterSpacing: -1 }}>{pct(r.percent)}</Text>
              <View style={{ paddingBottom: 9 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.gold400 }}>Grade {r.grade}</Text>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: 'rgba(255,255,255,0.75)' }}>{r.total} / {r.max} marks</Text>
              </View>
            </View>
          </HeroCard>
          <Card padded={false} style={{ paddingHorizontal: 14, paddingVertical: 4 }}>
            {subjects.map((s, i) => {
              const m = r.marks[s];
              const p = (m / ex.max) * 100;
              return (
                <View key={s} style={{ paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderTopColor: '#EEF2F0', gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 14.5, color: colors.ink900 }}>{s}</Text>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.ink900 }}>{m}<Text style={{ color: colors.ink400, fontFamily: fonts.medium }}> / {ex.max}</Text></Text>
                    <Badge label={gradeFor(p)} tone={p >= 80 ? 'green' : p >= 50 ? 'blue' : 'red'} dot={false} style={{ marginLeft: 10 }} />
                  </View>
                  <Progress value={p} height={6} color={p < 50 ? colors.red500 : accent} />
                </View>
              );
            })}
          </Card>
        </>
      )}
    </View>
  );
}

/* ---------- Notices & events ---------- */
export function NoticesList() {
  const { state } = useStore();
  return (
    <Card padded={false} style={{ paddingHorizontal: 14 }}>
      {sortedNotices(state.announcements).map((n, i) => (
        <View key={n.id} style={{ paddingVertical: 14, borderTopWidth: i ? 1 : 0, borderTopColor: '#EEF2F0', gap: 6 }}>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            {n.pinned ? <Badge label="Pinned" tone="red" /> : null}
            <Badge label={n.category} tone="green" dot={false} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.ink400 }}>{formatDate(n.date)} · {timeAgo(n.date)}</Text>
          </View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 15.5, color: colors.ink900 }}>{n.title}</Text>
          <T>{n.body}</T>
        </View>
      ))}
      {!state.announcements.length ? <Empty icon="bell" title="No announcements" /> : null}
    </Card>
  );
}

export function EventsList({ past }) {
  const { state } = useStore();
  const list = past ? state.events.filter((e) => new Date(e.date) < new Date(new Date().toDateString())).sort((a, b) => new Date(b.date) - new Date(a.date)) : upcomingEvents(state.events);
  if (!list.length) return <Card><Empty icon="calendar" title={past ? 'No past events' : 'No upcoming events'} /></Card>;
  return (
    <Card padded={false} style={{ paddingHorizontal: 14 }}>
      {list.map((e, i) => (
        <Row key={e.id} left={<DateTile date={e.date} />} title={e.title} subtitle={`${e.time} · ${e.location}`} right={<Badge label={e.category} tone="gray" dot={false} />} onPress={() => router.push(`/event/${e.id}`)} last={i === list.length - 1} />
      ))}
    </Card>
  );
}

/* ---------- Profile ---------- */
export function ProfileView({ student }) {
  const items = [
    ['Admission no.', student.admissionNo], ['Date of birth', formatDate(student.dob)], ['Gender', student.gender], ['Blood group', student.bloodGroup],
    ['House', student.house], ['Joined', formatDate(student.joined)], ['Transport', student.transport],
  ];
  const parent = [['Father', student.fatherName], ['Mother', student.motherName], ['Mobile', student.phone], ['Email', student.email], ['Address', student.address]];
  const block = (rows) => rows.map(([k, v], i) => (
    <View key={k} style={{ flexDirection: 'row', paddingVertical: 11, borderTopWidth: i ? 1 : 0, borderTopColor: '#EEF2F0', gap: 12 }}>
      <Text style={{ width: 110, fontFamily: fonts.medium, fontSize: 13, color: colors.ink500 }}>{k}</Text>
      <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.ink900 }}>{v}</Text>
    </View>
  ));
  return (
    <View style={{ gap: 14 }}>
      <Card style={{ alignItems: 'center', gap: 6, paddingVertical: 22 }}>
        <Avatar name={student.name} size={76} />
        <T v="h2" style={{ marginTop: 6 }}>{student.name}</T>
        <T v="small">{classLabel(student.class)} – {student.section} · Roll {student.rollNo} · {student.id}</T>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}><Badge label={student.status} /><Badge label={`${student.house} House`} tone="blue" dot={false} /></View>
      </Card>
      <Card style={{ paddingVertical: 6 }}>{block(items)}</Card>
      <Text style={{ fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1, color: colors.ink500, marginTop: 4 }}>PARENT & CONTACT</Text>
      <Card style={{ paddingVertical: 6 }}>{block(parent)}</Card>
      <T v="small" style={{ textAlign: 'center' }}>To update details, contact the school office or message the class teacher.</T>
    </View>
  );
}

