import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '@/lib/store';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Avatar, Badge, Button, Card, Chips, Empty, Field, LargeHeader, Sheet, useToast } from '@/components/ui';
import { ADMISSION_STAGES, CLASSES, classLabel } from '@shared/data/records';
import { timeAgo } from '@shared/utils/format';
import { validate, required, phoneIN } from '@shared/utils/validate';
import { nextStage, useMoveAdmission } from '@/lib/admissions';

export default function StaffAdmissions() {
  const store = useStore();
  const toast = useToast();
  const move = useMoveAdmission();
  const t = roleTheme.staff;
  const [stage, setStage] = useState('Enquiry');
  const [adding, setAdding] = useState(false);
  const [v, setV] = useState({ studentName: '', parentName: '', phone: '', class: 'Nursery' });
  const [errors, setErrors] = useState({});
  const all = store.state.admissions;
  const list = all.filter((a) => a.stage === stage);
  const stages = [...ADMISSION_STAGES, 'Rejected'];

  const add = () => {
    const e = validate(v, { studentName: [required('Student name')], parentName: [required('Parent name')], phone: [required('Phone'), phoneIN] });
    setErrors(e);
    if (Object.keys(e).length) return;
    const rec = store.add('admissions', { ...v, id: `ADM-27-${101 + all.length}`, email: '', academicYear: '2027–28', appliedOn: new Date().toISOString(), stage: 'Enquiry', source: 'Walk-in', previousSchool: '—', notes: '' });
    store.log('admission', `New enquiry added: ${rec.studentName} (${rec.class})`);
    toast('Enquiry added', { text: rec.id });
    setAdding(false);
    setStage('Enquiry');
    setV({ studentName: '', parentName: '', phone: '', class: 'Nursery' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.canvas }}>
      <LargeHeader canvas={t.canvas} title="Admissions" subtitle={`2027–28 · ${all.filter((a) => !['Confirmed', 'Rejected'].includes(a.stage)).length} in progress`} right={<Button title="Add" icon="plus" size="sm" onPress={() => setAdding(true)} />} />
      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <Chips accent={t.accent} value={stage} onChange={setStage} options={stages.map((s) => ({ value: s, label: s === 'Document Verification' ? 'Documents' : s, count: all.filter((a) => a.stage === s).length }))} />
      </View>
      <FlatList
        data={list}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}
        ListEmptyComponent={<Card><Empty icon="clipboard" title={`No applications in ${stage}`} text="Applications will appear here as they move through the pipeline." /></Card>}
        renderItem={({ item: a }) => {
          const next = nextStage(a.stage);
          return (
            <Card onPress={() => router.push(`/application/${a.id}`)} style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Avatar name={a.studentName} size={42} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.ink900 }}>{a.studentName}</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.ink500 }}>{classLabel(a.class)} · {a.parentName}</Text>
                </View>
                <Badge label={a.stage === 'Document Verification' ? 'Documents' : a.stage} tone={a.stage === 'Document Verification' ? 'purple' : undefined} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.ink400 }}>{a.id} · {timeAgo(a.appliedOn)} · {a.source}</Text>
                {next && a.stage !== 'Rejected' ? <Button title={next === 'Document Verification' ? 'Documents' : next} iconRight="arrow-right" size="sm" variant="soft" onPress={() => move(a, next)} /> : null}
              </View>
            </Card>
          );
        }}
      />
      <Sheet visible={adding} onClose={() => setAdding(false)} title="New enquiry" footer={<Button title="Add enquiry" icon="plus" size="lg" onPress={add} />}>
        <Field label="Student name" required value={v.studentName} onChangeText={(x) => setV({ ...v, studentName: x })} error={errors.studentName} />
        <Field label="Parent name" required value={v.parentName} onChangeText={(x) => setV({ ...v, parentName: x })} error={errors.parentName} />
        <Field label="Mobile" required keyboardType="phone-pad" value={v.phone} onChangeText={(x) => setV({ ...v, phone: x })} error={errors.phone} />
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13.5, color: colors.ink800 }}>Class</Text>
        <Chips accent={t.accent} value={v.class} onChange={(c) => setV({ ...v, class: c })} options={CLASSES.map((c) => ({ value: c, label: classLabel(c) }))} />
      </Sheet>
    </View>
  );
}
