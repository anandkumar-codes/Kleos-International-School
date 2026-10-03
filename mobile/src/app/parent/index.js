import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QuickActions from '@/components/QuickActions';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useStore, useMyStudent } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Card, DateTile, IconButton, Row, Screen, SectionHeader, T } from '@/components/ui';
import { StudentBanner, TodaySchedule } from '@/screens/portal';
import { sortedNotices } from '@shared/utils/content';
import { formatINR, timeAgo } from '@shared/utils/format';

export default function ParentHome() {
  const { state } = useStore();
  const { session } = useAuth();
  const student = useMyStudent('parent');
  const theme = roleTheme.parent;
  const due = Math.max(0, student.annualFee / 2 - student.feePaid);
  const hw = state.assignments.filter((a) => a.class === student.class && new Date(a.dueDate) > Date.now()).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const unread = state.portalMessages.filter((m) => !m.mine).length;
  const hour = new Date().getHours();
  const insets = useSafeAreaInsets();

  return (
    <Screen
      canvas={theme.canvas}
      refresh={async () => {}}
      header={
        <View style={{ backgroundColor: theme.canvas }}>
          <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <T v="small">{hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'},</T>
              <T v="h1" style={{ fontSize: 24 }}>{session?.name}</T>
            </View>
            <IconButton name="message-square" badge={unread} label="Messages" onPress={() => router.push('/messages')} />
            <IconButton name="bell" badge={2} label="Announcements" onPress={() => router.push('/notices')} />
          </View>
        </View>
      }
    >
      <StudentBanner student={student} role="parent" />

      {due > 0 ? (
        <Card onPress={() => router.push('/parent/fees')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFAF0', borderColor: '#F3DCAC' }}>
          <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: colors.amber100, alignItems: 'center', justifyContent: 'center' }}><Feather name="credit-card" size={19} color={colors.amber500} /></View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.ink900 }}>{formatINR(due)} fee due</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.ink500 }}>Installment 2 · pay online in seconds</Text>
          </View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 13.5, color: colors.green700 }}>Pay</Text>
        </Card>
      ) : null}

      <QuickActions items={[['clock', 'Timetable', '/timetable'], ['send', 'Leave', '/leave'], ['message-circle', 'Teacher', '/messages'], ['calendar', 'Events', '/events']]} />

      <SectionHeader title={`Today · ${new Date().toLocaleDateString('en-IN', { weekday: 'long' })}`} action="Week" onAction={() => router.push('/timetable')} />
      <Card><TodaySchedule student={student} accent={theme.accent} /></Card>

      <SectionHeader title="Homework due" action="All" onAction={() => router.push('/parent/academics')} />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {hw.slice(0, 4).map((a, i, arr) => (
          <Row key={a.id} left={<DateTile date={a.dueDate} />} title={a.title} subtitle={`${a.subject} · ${a.teacher}`} last={i === arr.length - 1} />
        ))}
        {!hw.length ? <Row icon="check-circle" title="All caught up" subtitle="No pending homework" last /> : null}
      </Card>

      <SectionHeader title="Notices" action="All" onAction={() => router.push('/notices')} />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {sortedNotices(state.announcements).slice(0, 3).map((n, i) => (
          <Row key={n.id} icon={n.pinned ? 'bookmark' : 'volume-2'} title={n.title} subtitle={`${n.category} · ${timeAgo(n.date)}`} onPress={() => router.push('/notices')} last={i === 2} />
        ))}
      </Card>
    </Screen>
  );
}
