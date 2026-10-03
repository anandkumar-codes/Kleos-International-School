import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useStore } from '@/lib/store';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Avatar, Button, Chips, LargeHeader, Segmented, tap, useToast, cardStyle } from '@/components/ui';
import { CLASSES, sectionsFor, studentDayStatus, lastSchoolDay } from '@shared/data/records';
import { formatDate } from '@shared/utils/format';

const OPTS = [
  ['P', 'Present', colors.green600],
  ['A', 'Absent', colors.red500],
  ['L', 'Late', colors.amber500],
];

export default function StaffAttendance() {
  const store = useStore();
  const toast = useToast();
  const t = roleTheme.staff;
  const [cls, setCls] = useState('VI');
  const [sec, setSec] = useState('A');
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const day = lastSchoolDay();
  const list = useMemo(() => store.state.students.filter((s) => s.class === cls && s.section === sec).sort((a, b) => a.rollNo - b.rollNo), [store.state.students, cls, sec]);
  const statusOf = (s) => marks[`${cls}-${sec}`]?.[s.id] || studentDayStatus(s.id, day)[0];
  const counts = list.reduce((a, s) => ({ ...a, [statusOf(s)]: (a[statusOf(s)] || 0) + 1 }), {});
  const setOne = (id, k) => setMarks((m) => ({ ...m, [`${cls}-${sec}`]: { ...(m[`${cls}-${sec}`] || {}), [id]: k } }));

  const submit = () => {
    setSaving(true);
    setTimeout(() => {
      store.log('attendance', `Attendance submitted for ${cls}-${sec}`);
      if (counts.A) store.notify('attendance', 'Absence SMS sent', `${counts.A} parents of ${cls}-${sec} notified.`);
      setSaving(false);
      toast('Attendance saved', { text: `${cls}-${sec}: ${counts.P || 0} present, ${counts.A || 0} absent${counts.A ? ' · parents notified' : ''}` });
    }, 600);
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.canvas }}>
      <LargeHeader canvas={t.canvas} title={`Attendance · ${cls}-${sec}`} subtitle={formatDate(day, { weekday: 'long', day: 'numeric', month: 'long' })} />
      <View style={{ paddingHorizontal: 16, gap: 10, paddingBottom: 10 }}>
        <Chips accent={t.accent} value={cls} onChange={(c) => { setCls(c); setSec('A'); }} options={CLASSES.map((c) => ({ value: c, label: c }))} />
        <Segmented accent={t.accent} value={sec} onChange={setSec} options={sectionsFor(cls).map((s) => ({ value: s, label: `Section ${s}` }))} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {OPTS.map(([k, l, c]) => (
            <View key={k} style={[cardStyle, { flex: 1, paddingVertical: 8, alignItems: 'center' }]}>
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 20, color: c }}>{counts[k] || 0}</Text>
              <Text style={{ fontFamily: fonts.medium, fontSize: 11.5, color: colors.ink500 }}>{l}</Text>
            </View>
          ))}
        </View>
      </View>
      <FlatList
        data={list}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }}
        renderItem={({ item: s, index }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: index === list.length - 1 ? 0 : 1, borderBottomColor: '#E6ECE9' }}>
            <Text style={{ width: 22, fontFamily: fonts.semibold, fontSize: 12.5, color: colors.ink400 }}>{s.rollNo}</Text>
            <Avatar name={s.name} size={34} />
            <Text numberOfLines={1} style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.ink900 }}>{s.name}</Text>
            <View style={{ flexDirection: 'row', backgroundColor: '#E9EEEC', borderRadius: 10, padding: 3, gap: 3 }}>
              {OPTS.map(([k, l, c]) => {
                const on = statusOf(s) === k;
                return (
                  <Pressable key={k} accessibilityLabel={`${l} — ${s.name}`} accessibilityState={{ selected: on }} onPress={() => { tap(); setOne(s.id, k); }} style={{ width: 34, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? c : 'transparent' }}>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: on ? '#fff' : colors.ink500 }}>{k}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      />
      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16, flexDirection: 'row', gap: 10 }}>
        <Button title="All present" variant="outline" style={{ backgroundColor: '#fff' }} onPress={() => setMarks((m) => ({ ...m, [`${cls}-${sec}`]: Object.fromEntries(list.map((s) => [s.id, 'P'])) }))} />
        <Button title={`Submit ${cls}-${sec}`} icon="check" loading={saving} onPress={submit} style={{ flex: 1 }} color={t.accent} />
      </View>
    </View>
  );
}
