import { Linking, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useStore } from '@/lib/store';
import { colors, fonts } from '@/lib/theme';
import { Avatar, Badge, Button, Card, Empty, Progress, Row, Screen, SectionHeader, T } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { classLabel, resultRow } from '@shared/data/records';
import { formatDate, formatINR, pct } from '@shared/utils/format';

export default function PupilProfile() {
  const { id } = useLocalSearchParams();
  const { state } = useStore();
  const s = state.students.find((x) => x.id === id);
  if (!s) return <Screen header={<BackHeader title="Student" />}><Empty icon="user" title="Student not found" /></Screen>;
  const pays = state.payments.filter((p) => p.studentId === s.id);
  const hy = ['Nursery', 'LKG', 'UKG'].includes(s.class) ? null : resultRow(s, 'hy', state.marks);
  const due = Math.max(0, s.annualFee / 2 - s.feePaid);
  return (
    <Screen header={<BackHeader title={s.name} subtitle={`${s.id} · ${s.admissionNo}`} />}>
      <Card style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <Avatar name={s.name} size={62} />
        <View style={{ flex: 1, gap: 4 }}>
          <T v="h2">{s.name}</T>
          <T v="small">{classLabel(s.class)} – {s.section} · Roll {s.rollNo} · {s.house}</T>
          <View style={{ flexDirection: 'row', gap: 6 }}><Badge label={s.status} /><Badge label={s.feeStatus} /></View>
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="Call parent" icon="phone" style={{ flex: 1 }} onPress={() => Linking.openURL(`tel:${s.phone.replace(/\s/g, '')}`)} />
        <Button title="SMS" icon="message-square" variant="outline" onPress={() => Linking.openURL(`sms:${s.phone.replace(/\s/g, '')}`)} />
      </View>

      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <T v="h3">Attendance this term</T>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 16, color: s.attendance < 85 ? colors.red600 : colors.ink900 }}>{pct(s.attendance)}</Text>
        </View>
        <Progress value={s.attendance} color={s.attendance < 85 ? colors.red500 : colors.green600} />
        {s.attendance < 85 ? <T v="small" style={{ color: colors.red600 }}>Below the 85% CBSE requirement — follow up with parents.</T> : null}
        {hy ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#EEF2F0' }}>
            <T v="h3">Half-yearly result</T>
            <Text style={{ fontFamily: fonts.extrabold, fontSize: 16, color: colors.ink900 }}>{pct(hy.percent)} · {hy.grade}</Text>
          </View>
        ) : null}
      </Card>

      <SectionHeader title="Parent & contact" />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        <Row icon="user" title={s.fatherName} subtitle="Father / guardian" />
        <Row icon="user" title={s.motherName} subtitle="Mother" />
        <Row icon="phone" title={s.phone} subtitle="Mobile" onPress={() => Linking.openURL(`tel:${s.phone.replace(/\s/g, '')}`)} />
        <Row icon="mail" title={s.email} subtitle="Email" onPress={() => Linking.openURL(`mailto:${s.email}`)} />
        <Row icon="map-pin" title={s.area} subtitle={s.address} last />
      </Card>

      <SectionHeader title="Fees" />
      <Card style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T>Annual fee</T><Text style={{ fontFamily: fonts.bold, color: colors.ink900 }}>{formatINR(s.annualFee)}</Text></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T>Paid</T><Text style={{ fontFamily: fonts.bold, color: colors.green700 }}>{formatINR(s.feePaid)}</Text></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><T>Due now</T><Text style={{ fontFamily: fonts.bold, color: due ? colors.red600 : colors.ink900 }}>{formatINR(due)}</Text></View>
      </Card>
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {pays.map((p, i) => <Row key={p.id} icon="file-text" title={`${formatINR(p.amount)} · ${p.term}`} subtitle={`${p.receiptNo} · ${formatDate(p.date)} · ${p.mode}`} onPress={() => router.push(`/receipt/${p.id}`)} last={i === pays.length - 1} />)}
        {!pays.length ? <Empty icon="file-text" title="No payments yet" /> : null}
      </Card>

      <SectionHeader title="Details" />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        <Row icon="gift" title={formatDate(s.dob)} subtitle="Date of birth" />
        <Row icon="droplet" title={s.bloodGroup} subtitle="Blood group" />
        <Row icon="truck" title={s.transport} subtitle="Transport" />
        <Row icon="log-in" title={formatDate(s.joined)} subtitle="Joined" last />
      </Card>
    </Screen>
  );
}
