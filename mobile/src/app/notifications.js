import { useState } from 'react';
import { View } from 'react-native';
import { useStore } from '@/lib/store';
import { colors, roleTheme } from '@/lib/theme';
import { Button, Card, Chips, Empty, Row, Screen, SectionHeader } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { timeAgo } from '@shared/utils/format';

const ICON = {
  admission: ['clipboard', colors.blue500, colors.blue100],
  fee: ['dollar-sign', colors.green700, colors.green100],
  message: ['message-square', colors.purple500, colors.purple100],
  attendance: ['alert-triangle', colors.red500, colors.red100],
  student: ['user-plus', colors.teal500, colors.teal100],
  event: ['calendar', colors.amber500, colors.amber100],
  teacher: ['user', colors.green700, colors.green100],
  announcement: ['volume-2', colors.amber500, colors.amber100],
  exam: ['file-text', colors.blue500, colors.blue100],
};

export default function Notifications() {
  const store = useStore();
  const t = roleTheme.staff;
  const [type, setType] = useState('all');
  const all = store.state.notifications;
  const list = all.filter((n) => type === 'all' || n.type === type);
  const types = ['all', 'admission', 'fee', 'message', 'attendance', 'student', 'event'];
  const label = { all: 'All', admission: 'Admissions', fee: 'Fees', message: 'Messages', attendance: 'Attendance', student: 'Students', event: 'Events' };
  return (
    <Screen canvas={t.canvas} header={<BackHeader canvas={t.canvas} title="Notifications" subtitle={`${all.filter((n) => !n.read).length} unread`} right={<Button title="Read all" size="sm" variant="ghost" onPress={() => store.set('notifications', (l) => l.map((n) => ({ ...n, read: true })))} />} />}>
      <Chips accent={t.accent} value={type} onChange={setType} options={types.map((x) => ({ value: x, label: label[x], count: x === 'all' ? all.length : all.filter((n) => n.type === x).length }))} />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {list.map((n, i) => {
          const [icon, fg, bg] = ICON[n.type] || ICON.event;
          return (
            <Row key={n.id} icon={icon} iconColor={fg} iconBg={bg} title={n.title} subtitle={`${n.text} · ${timeAgo(n.date)}`}
              right={!n.read ? <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: colors.green500 }} /> : null}
              onPress={() => store.patch('notifications', n.id, { read: true })} chevron={false} last={i === list.length - 1} />
          );
        })}
        {!list.length ? <Empty icon="bell" title="You're all caught up" /> : null}
      </Card>
      <SectionHeader title="Activity log" />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {store.state.activity.slice(0, 10).map((a, i, arr) => {
          const [icon, fg, bg] = ICON[a.type] || ICON.event;
          return <Row key={a.id} icon={icon} iconColor={fg} iconBg={bg} title={a.text} subtitle={timeAgo(a.date)} last={i === arr.length - 1} />;
        })}
      </Card>
    </Screen>
  );
}
