import { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useStore } from '@/lib/store';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Avatar, Badge, Chips, Empty, Field, LargeHeader, Row } from '@/components/ui';
import { CLASSES } from '@shared/data/records';

export default function StaffStudents() {
  const { state } = useStore();
  const t = roleTheme.staff;
  const [q, setQ] = useState('');
  const [cls, setCls] = useState('All');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return state.students.filter((x) => (cls === 'All' || x.class === cls) && (!s || `${x.name} ${x.id} ${x.fatherName} ${x.phone}`.toLowerCase().includes(s)));
  }, [state.students, q, cls]);

  return (
    <View style={{ flex: 1, backgroundColor: t.canvas }}>
      <LargeHeader canvas={t.canvas} title="Students" subtitle={`${state.students.length.toLocaleString('en-IN')} enrolled`} />
      <View style={{ paddingHorizontal: 16, gap: 10, paddingBottom: 10 }}>
        <View>
          <Field value={q} onChangeText={setQ} placeholder="Search name, ID, parent or phone" autoCorrect={false} style={{ gap: 0 }} />
          <Feather name="search" size={18} color={colors.ink400} style={{ position: 'absolute', right: 14, top: 16 }} />
        </View>
        <Chips accent={t.accent} value={cls} onChange={setCls} options={['All', ...CLASSES].map((c) => ({ value: c, label: c === 'All' ? 'All classes' : c }))} />
      </View>
      <FlatList
        data={list}
        keyExtractor={(s) => s.id}
        initialNumToRender={14}
        windowSize={7}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListHeaderComponent={<Text style={{ fontFamily: fonts.semibold, fontSize: 12.5, color: colors.ink500, marginBottom: 4 }}>{list.length.toLocaleString('en-IN')} result{list.length === 1 ? '' : 's'}</Text>}
        ListEmptyComponent={<Empty icon="search" title="No students found" text="Try another name, ID or class." />}
        renderItem={({ item: s, index }) => (
          <Row
            left={<Avatar name={s.name} size={40} />}
            title={s.name}
            subtitle={`${s.id} · ${s.class}-${s.section} · Roll ${s.rollNo}`}
            right={<Badge label={s.feeStatus} />}
            onPress={() => router.push(`/pupil/${s.id}`)}
            last={index === list.length - 1}
          />
        )}
      />
    </View>
  );
}
