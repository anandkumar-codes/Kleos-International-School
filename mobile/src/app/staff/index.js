import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Card, DateTile, HeroCard, IconButton, Row, Screen, SectionHeader, Stat, T } from '@/components/ui';
import { BarChart, Funnel, Legend, Ring, STATUS } from '@/components/charts';
import { attendanceToday, weeklyAttendance, admissionsFunnel, sumLast } from '@shared/services/analytics';
import { formatLakh, formatNumber, timeAgo, pct } from '@shared/utils/format';
import { upcomingEvents } from '@shared/utils/content';

const ACT_ICON = { admission: ['clipboard', colors.blue500, colors.blue100], fee: ['dollar-sign', colors.green700, colors.green100], student: ['user-plus', colors.teal500, colors.teal100], teacher: ['user', colors.green700, colors.green100], announcement: ['volume-2', colors.amber500, colors.amber100], exam: ['file-text', colors.blue500, colors.blue100], event: ['calendar', colors.amber500, colors.amber100], attendance: ['alert-triangle', colors.red500, colors.red100] };

export default function StaffDashboard() {
  const { state } = useStore();
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const t = roleTheme.staff;
  const { students, teachers, admissions, payments, activity, events, notifications } = state;
  const att = useMemo(() => attendanceToday(students), [students]);
  const weekly = useMemo(() => weeklyAttendance(students, 6).map((d) => ({ label: d.label, values: [d.Present, d.Late, d.Absent] })), [students]);
  const funnel = useMemo(() => admissionsFunnel(admissions), [admissions]);
  const pending = admissions.filter((a) => !['Confirmed', 'Rejected'].includes(a.stage)).length;
  const unread = notifications.filter((n) => !n.read).length;
  const hour = new Date().getHours();

  return (
    <Screen
      canvas={t.canvas}
      refresh={async () => {}}
      header={
        <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: t.canvas }}>
          <View style={{ flex: 1 }}>
            <T v="small">{hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'}, {session?.name?.split(' ')[0]}</T>
            <T v="h1" style={{ fontSize: 24 }}>School overview</T>
          </View>
          <IconButton name="inbox" badge={state.messages.filter((m) => !m.read).length} label="Messages" onPress={() => router.push('/inbox')} />
          <IconButton name="bell" badge={unread} label="Notifications" onPress={() => router.push('/notifications')} />
        </View>
      }
    >
      <HeroCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Ring value={att.pct} label={pct(att.pct, 1)} sub="present" light color={colors.gold400} track="rgba(255,255,255,0.15)" size={96} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Attendance today</Text>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: '#fff' }}>{formatNumber(att.present)} <Text style={{ fontSize: 15, fontFamily: fonts.medium, color: 'rgba(255,255,255,0.7)' }}>of {formatNumber(att.total)}</Text></Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: 'rgba(255,255,255,0.75)' }}>{att.absent} absent · {att.late} late · SMS sent to parents</Text>
          </View>
        </View>
      </HeroCard>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat label="Students" value={formatNumber(students.length)} icon="users" foot="+3.2% vs last year" />
        <Stat label="Teachers" value={teachers.length} icon="user" tone="blue" foot={`${teachers.filter((x) => x.status === 'On Leave').length} on leave`} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat label="Admissions" value={pending} icon="clipboard" tone="gold" foot={`pending · ${admissions.filter((a) => a.stage === 'Enquiry').length} new`} />
        <Stat label="Fee collection" value={formatLakh(sumLast(payments, 30))} icon="trending-up" tone="purple" foot="Last 30 days" />
      </View>

      <Card>
        <T v="h3">Attendance overview</T>
        <T v="small" style={{ marginBottom: 10 }}>Last 6 school days · tap a bar for totals</T>
        <Legend items={[{ label: 'Present', color: STATUS.good }, { label: 'Late', color: STATUS.warning }, { label: 'Absent', color: STATUS.critical }]} />
        <View style={{ height: 8 }} />
        <BarChart data={weekly} series={[{ color: STATUS.good }, { color: STATUS.warning }, { color: STATUS.critical }]} format={(v) => formatNumber(v)} height={190} />
      </Card>

      <Card onPress={() => router.push('/staff/admissions')}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View><T v="h3">Admissions funnel</T><T v="small">2027–28 cycle</T></View>
          <Feather name="chevron-right" size={20} color={colors.ink300} />
        </View>
        <Funnel rows={funnel} />
      </Card>

      <SectionHeader title="Upcoming events" action="All" onAction={() => router.push('/events')} />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {upcomingEvents(events).slice(0, 3).map((e, i) => (
          <Row key={e.id} left={<DateTile date={e.date} />} title={e.title} subtitle={`${e.time} · ${e.location}`} onPress={() => router.push(`/event/${e.id}`)} last={i === 2} />
        ))}
      </Card>

      <SectionHeader title="Recent activity" action="All" onAction={() => router.push('/notifications')} />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {activity.slice(0, 5).map((a, i) => {
          const [icon, fg, bg] = ACT_ICON[a.type] || ACT_ICON.event;
          return <Row key={a.id} icon={icon} iconColor={fg} iconBg={bg} title={a.text} subtitle={timeAgo(a.date)} last={i === 4} />;
        })}
      </Card>
    </Screen>
  );
}
