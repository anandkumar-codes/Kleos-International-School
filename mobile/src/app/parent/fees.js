import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useStore, useMyStudent } from '@/lib/store';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Badge, Button, Card, HeroCard, LargeHeader, Row, Screen, SectionHeader, Sheet, T, Empty, tap, useToast } from '@/components/ui';
import { formatDate, formatINR } from '@shared/utils/format';

const METHODS = [
  ['smartphone', 'UPI', 'Google Pay, PhonePe, Paytm, BHIM'],
  ['credit-card', 'Debit / credit card', 'Visa, Mastercard, RuPay'],
  ['globe', 'Net banking', 'All major Indian banks'],
];

export default function Fees() {
  const store = useStore();
  const toast = useToast();
  const student = useMyStudent('parent');
  const t = roleTheme.parent;
  const [sheet, setSheet] = useState(false);
  const [method, setMethod] = useState('UPI');
  const [stage, setStage] = useState('choose'); // choose | processing | done
  const [receipt, setReceipt] = useState(null);

  const pays = store.state.payments.filter((p) => p.studentId === student.id);
  const inst = student.annualFee / 4;
  const due = Math.max(0, student.annualFee / 2 - student.feePaid);
  const schedule = ['Installment 1', 'Installment 2', 'Installment 3', 'Installment 4'].map((term, i) => {
    const paid = pays.filter((p) => p.term === term).reduce((a, p) => a + p.amount, 0);
    return { term, due: ['10 Jun 2026', '10 Sep 2026', '10 Dec 2026', '10 Feb 2027'][i], status: paid >= inst ? 'Paid' : i < 2 ? (student.feeStatus === 'Overdue' ? 'Overdue' : 'Pending') : 'Upcoming' };
  });
  const paidPct = (student.feePaid / student.annualFee) * 100;

  const pay = () => {
    setStage('processing');
    setTimeout(() => {
      const n = 4120 + store.state.payments.length;
      const term = schedule.find((s) => s.status !== 'Paid')?.term || 'Installment 2';
      const p = store.add('payments', { id: `PAY-${n}`, receiptNo: `KIS/26-27/${n}`, studentId: student.id, studentName: student.name, class: `${student.class}-${student.section}`, amount: due, mode: method === 'UPI' ? 'UPI' : method === 'Net banking' ? 'Net Banking' : 'Debit Card', term, date: new Date().toISOString(), status: 'Success' });
      store.patch('students', student.id, { feePaid: student.feePaid + due, feeStatus: 'Paid' });
      store.notify('fee', 'Fee payment received', `${formatINR(due)} from ${student.name} (${student.class}-${student.section}) via ${p.mode}.`);
      store.log('fee', `Online fee payment of ${formatINR(due)} from ${student.name}`);
      setReceipt(p);
      setStage('done');
      toast('Payment successful', { text: `${formatINR(p.amount)} · ${p.receiptNo}` });
    }, 1400);
  };

  const close = () => { setSheet(false); setTimeout(() => setStage('choose'), 300); };

  return (
    <Screen canvas={t.canvas} header={<LargeHeader canvas={t.canvas} title="Fees" subtitle="Academic year 2026–27" />}>
      <HeroCard>
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{due ? 'Amount due now' : 'All dues cleared'}</Text>
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 38, color: '#fff', letterSpacing: -1, marginTop: 2 }}>{formatINR(due)}</Text>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)', marginTop: 14, overflow: 'hidden' }}>
          <View style={{ width: `${paidPct}%`, height: '100%', backgroundColor: colors.gold400, borderRadius: 4 }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: 'rgba(255,255,255,0.75)' }}>Paid {formatINR(student.feePaid)}</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: 'rgba(255,255,255,0.75)' }}>Annual {formatINR(student.annualFee)}</Text>
        </View>
        {due > 0 ? <Button title={`Pay ${formatINR(due)} now`} variant="gold" icon="lock" onPress={() => setSheet(true)} style={{ marginTop: 16 }} /> : null}
      </HeroCard>

      <SectionHeader title="Installments" />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {schedule.map((s, i) => (
          <Row key={s.term} icon={s.status === 'Paid' ? 'check' : 'clock'} iconColor={s.status === 'Paid' ? colors.green700 : s.status === 'Overdue' ? colors.red600 : colors.ink500} iconBg={s.status === 'Paid' ? colors.green50 : '#F1F4F3'} title={`${s.term} · ${formatINR(inst)}`} subtitle={`Due ${s.due}`} right={<Badge label={s.status} />} last={i === 3} />
        ))}
      </Card>

      <SectionHeader title="Receipts" />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {pays.map((p, i) => (
          <Row key={p.id} icon="file-text" title={formatINR(p.amount)} subtitle={`${p.receiptNo} · ${formatDate(p.date)} · ${p.mode}`} onPress={() => router.push(`/receipt/${p.id}`)} last={i === pays.length - 1} />
        ))}
        {!pays.length ? <Empty icon="file-text" title="No receipts yet" /> : null}
      </Card>

      <Sheet visible={sheet} onClose={stage === 'processing' ? () => {} : close} title={stage === 'done' ? null : 'Pay school fees'}
        footer={stage === 'choose' ? <Button title={`Pay ${formatINR(due)}`} icon="lock" size="lg" onPress={pay} /> : stage === 'done' ? <Button title="Done" size="lg" onPress={close} /> : null}>
        {stage === 'choose' ? (
          <>
            <T v="small">{student.name} · {student.id} · Installment 2</T>
            {METHODS.map(([icon, name, sub]) => (
              <Pressable key={name} onPress={() => { tap(); setMethod(name); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1.5, borderColor: method === name ? colors.green600 : colors.lineCool, backgroundColor: method === name ? colors.green50 : '#fff' }}>
                <Feather name={icon} size={20} color={colors.green700} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: colors.ink900 }}>{name}</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.ink500 }}>{sub}</Text>
                </View>
                <Feather name={method === name ? 'check-circle' : 'circle'} size={20} color={method === name ? colors.green600 : colors.ink300} />
              </Pressable>
            ))}
            <T v="small" style={{ textAlign: 'center' }}>Demo checkout — no real payment is processed.</T>
          </>
        ) : stage === 'processing' ? (
          <View style={{ alignItems: 'center', paddingVertical: 36, gap: 14 }}>
            <Feather name="loader" size={34} color={colors.green700} />
            <T v="h3">Processing payment…</T>
            <T v="small">Please don&apos;t close the app</T>
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 20, gap: 8 }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.green100, alignItems: 'center', justifyContent: 'center' }}><Feather name="check" size={34} color={colors.green700} /></View>
            <T v="h2">Payment successful</T>
            <T style={{ textAlign: 'center' }}>{formatINR(receipt?.amount)} received for {student.name}.{'\n'}Receipt {receipt?.receiptNo}</T>
            <Button title="View receipt" variant="soft" icon="file-text" size="sm" onPress={() => { close(); router.push(`/receipt/${receipt.id}`); }} />
          </View>
        )}
      </Sheet>
    </Screen>
  );
}
