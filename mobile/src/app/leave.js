import { useState } from 'react';
import { Text, View } from 'react-native';
import { useStore, useMyStudent } from '@/lib/store';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Badge, Button, Card, Empty, Field, Row, Screen, Sheet, T, useToast } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { formatDate, timeAgo, isoDate } from '@shared/utils/format';

const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(new Date(v).getTime());

export default function Leave() {
  const store = useStore();
  const toast = useToast();
  const student = useMyStudent('parent');
  const t = roleTheme.parent;
  const [open, setOpen] = useState(false);
  const tomorrow = isoDate(new Date(Date.now() + 864e5));
  const [v, setV] = useState({ from: tomorrow, to: tomorrow, reason: '' });
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!isDate(v.from)) e.from = 'Use YYYY-MM-DD';
    if (!isDate(v.to)) e.to = 'Use YYYY-MM-DD';
    else if (isDate(v.from) && v.to < v.from) e.to = 'Must be on or after start';
    if (!v.reason.trim()) e.reason = 'Please give a reason';
    setErrors(e);
    if (Object.keys(e).length) return;
    store.add('leaves', { ...v, status: 'Pending', applied: new Date().toISOString() });
    store.add('messages', { from: student.fatherName, role: `Parent · ${student.name} (${student.class}-${student.section})`, subject: 'Leave request', body: `${v.reason} (${v.from} to ${v.to})`, date: new Date().toISOString(), read: false });
    toast('Leave request sent', { text: 'The class teacher will review it shortly.' });
    setOpen(false);
    setV({ from: tomorrow, to: tomorrow, reason: '' });
  };

  return (
    <Screen canvas={t.canvas} header={<BackHeader canvas={t.canvas} title="Leave requests" subtitle={student.name} right={<Button title="Apply" icon="plus" size="sm" onPress={() => setOpen(true)} />} />}>
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {store.state.leaves.map((l, i) => (
          <Row key={l.id} icon="calendar" title={l.from === l.to ? formatDate(l.from) : `${formatDate(l.from, { day: 'numeric', month: 'short' })} – ${formatDate(l.to)}`} subtitle={`${l.reason} · applied ${timeAgo(l.applied)}`} right={<Badge label={l.status} />} last={i === store.state.leaves.length - 1} />
        ))}
        {!store.state.leaves.length ? <Empty icon="send" title="No leave requests" text="Apply for leave and track approval here." /> : null}
      </Card>
      <T v="small" style={{ textAlign: 'center' }}>Requests go to the class teacher and the school office.</T>

      <Sheet visible={open} onClose={() => setOpen(false)} title="Apply for leave" footer={<Button title="Submit request" icon="send" size="lg" onPress={submit} />}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Field label="From" required value={v.from} onChangeText={(x) => setV({ ...v, from: x })} error={errors.from} placeholder="YYYY-MM-DD" style={{ flex: 1 }} />
          <Field label="To" required value={v.to} onChangeText={(x) => setV({ ...v, to: x })} error={errors.to} placeholder="YYYY-MM-DD" style={{ flex: 1 }} />
        </View>
        <Field label="Reason" required value={v.reason} onChangeText={(x) => setV({ ...v, reason: x })} error={errors.reason} placeholder="e.g. Family function in Vijayawada" multiline />
        <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.ink500 }}>For medical leave of 3 or more days, please share a doctor&apos;s note with the class teacher.</Text>
      </Sheet>
    </Screen>
  );
}
