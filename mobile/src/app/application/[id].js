import { useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useStore } from '@/lib/store';
import { nextStage, useMoveAdmission } from '@/lib/admissions';
import { colors, fonts } from '@/lib/theme';
import { Avatar, Badge, Button, Card, Empty, Field, Row, Screen, T, useToast } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { ADMISSION_STAGES, classLabel } from '@shared/data/records';
import { formatDate } from '@shared/utils/format';

export default function ApplicationDetail() {
  const { id } = useLocalSearchParams();
  const store = useStore();
  const toast = useToast();
  const move = useMoveAdmission();
  const a = store.state.admissions.find((x) => x.id === id);
  const [notes, setNotes] = useState(a?.notes || '');
  if (!a) return <Screen header={<BackHeader title="Application" />}><Empty icon="clipboard" title="Application not found" /></Screen>;
  const cur = ADMISSION_STAGES.indexOf(a.stage);
  const next = nextStage(a.stage);
  const open = a.stage !== 'Confirmed' && a.stage !== 'Rejected';

  return (
    <Screen header={<BackHeader title={a.studentName} subtitle={`${a.id} · ${classLabel(a.class)}`} />}>
      <Card style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <Avatar name={a.studentName} size={56} />
        <View style={{ flex: 1, gap: 4 }}>
          <T v="h2">{a.studentName}</T>
          <T v="small">Applying for {classLabel(a.class)} · {a.academicYear}</T>
          <Badge label={a.stage} />
        </View>
      </Card>

      <Card style={{ gap: 0 }}>
        <T v="h3" style={{ marginBottom: 12 }}>Pipeline</T>
        {ADMISSION_STAGES.map((s, i) => {
          const done = a.stage !== 'Rejected' && i <= cur;
          return (
            <View key={s} style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? colors.green700 : '#E9EEEC' }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: done ? '#fff' : colors.ink400 }}>{i + 1}</Text>
                </View>
                {i < ADMISSION_STAGES.length - 1 ? <View style={{ width: 2, height: 16, backgroundColor: done && i < cur ? colors.green600 : '#E2E8E5' }} /> : null}
              </View>
              <Text style={{ fontFamily: i === cur ? fonts.bold : fonts.medium, fontSize: 14, color: done ? colors.ink900 : colors.ink400, marginTop: 3 }}>{s}{i === cur && a.stage !== 'Rejected' ? '  · current' : ''}</Text>
            </View>
          );
        })}
        {a.stage === 'Rejected' ? <Badge label="Rejected / withdrawn" tone="red" style={{ marginTop: 10 }} /> : null}
      </Card>

      {open ? (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title="Reject" variant="outline" icon="x" onPress={() => move(a, 'Rejected')} />
          <Button title={`Move to ${next === 'Document Verification' ? 'Documents' : next}`} iconRight="arrow-right" style={{ flex: 1 }} onPress={() => move(a, next)} />
        </View>
      ) : null}

      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        <Row icon="user" title={a.parentName} subtitle="Parent / guardian" />
        <Row icon="phone" title={a.phone} subtitle="Tap to call" onPress={() => Linking.openURL(`tel:${a.phone.replace(/\s/g, '')}`)} />
        {a.email ? <Row icon="mail" title={a.email} subtitle="Email" onPress={() => Linking.openURL(`mailto:${a.email}`)} /> : null}
        <Row icon="briefcase" title={a.previousSchool} subtitle="Previous school" />
        <Row icon="compass" title={a.source} subtitle={`Applied ${formatDate(a.appliedOn)}`} last />
      </Card>

      <Card style={{ gap: 10 }}>
        <Field label="Counsellor notes" value={notes} onChangeText={setNotes} placeholder="Notes from calls and interactions…" multiline />
        <Button title="Save notes" variant="soft" icon="save" size="sm" disabled={notes === (a.notes || '')} onPress={() => { store.patch('admissions', a.id, { notes }); toast('Notes saved'); }} />
      </Card>
    </Screen>
  );
}
