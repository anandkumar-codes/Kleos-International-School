import { View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore, useMyStudent } from '@/lib/store';
import { roleTheme } from '@/lib/theme';
import { Card, DateTile, IconButton, Row, Screen, SectionHeader, T } from '@/components/ui';
import { BarChart } from '@/components/charts';
import QuickActions from '@/components/QuickActions';
import { StudentBanner, TodaySchedule } from '@/screens/portal';
import { EXAMS, resultRow } from '@shared/data/records';
import { sortedNotices } from '@shared/utils/content';
import { timeAgo } from '@shared/utils/format';

export default function StudentHome() {
  const { state } = useStore();
  const insets = useSafeAreaInsets();
  const student = useMyStudent('student');
  const t = roleTheme.student;
  const due = state.assignments.filter((a) => a.class === student.class && new Date(a.dueDate) > Date.now()).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const perf = EXAMS.filter((e) => e.status === 'Published').map((e) => ({ label: e.name.replace(' Examination', ''), values: [Math.round(resultRow(student, e.id, state.marks).percent)] }));

  return (
    <Screen
      canvas={t.canvas}
      refresh={async () => {}}
      header={
        <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: t.canvas }}>
          <View style={{ flex: 1 }}>
            <T v="small">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</T>
            <T v="h1" style={{ fontSize: 24 }}>Kleos Student</T>
          </View>
          <IconButton name="bell" badge={2} label="Announcements" onPress={() => router.push('/notices')} />
        </View>
      }
    >
      <StudentBanner student={student} role="student" />
      <QuickActions accent={t.accent} soft={t.soft} items={[['book', 'Subjects', '/subjects'], ['calendar', 'Attendance', '/my-attendance'], ['award', 'Events', '/events'], ['user', 'Profile', '/profile?role=student']]} />

      <SectionHeader title="Today's classes" action="Week" onAction={() => router.push('/student/timetable')} />
      <Card><TodaySchedule student={student} accent={t.accent} /></Card>

      <SectionHeader title="Due soon" action="All" onAction={() => router.push('/student/assignments')} />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {due.slice(0, 3).map((a, i, arr) => (
          <Row key={a.id} left={<DateTile date={a.dueDate} accent={t.accent} bg={t.soft} />} title={a.title} subtitle={`${a.subject} · ${a.teacher}`} onPress={() => router.push('/student/assignments')} last={i === arr.length - 1} />
        ))}
        {!due.length ? <Row icon="check-circle" title="Nothing due" subtitle="You're all caught up" last /> : null}
      </Card>

      <SectionHeader title="My performance" action="Results" onAction={() => router.push('/student/results')} />
      <Card>
        <T v="small" style={{ marginBottom: 6 }}>Overall % in published exams · tap a bar</T>
        <BarChart data={perf} series={[{ name: 'Score', color: t.accent }]} format={(v) => `${v}%`} max={100} height={170} />
      </Card>

      <SectionHeader title="Notices" action="All" onAction={() => router.push('/notices')} />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {sortedNotices(state.announcements).slice(0, 3).map((n, i) => (
          <Row key={n.id} icon={n.pinned ? 'bookmark' : 'volume-2'} iconColor={t.accent} iconBg={t.soft} title={n.title} subtitle={`${n.category} · ${timeAgo(n.date)}`} onPress={() => router.push('/notices')} last={i === 2} />
        ))}
      </Card>
    </Screen>
  );
}
