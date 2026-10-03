import { useMemo } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '@/lib/store';
import { roleTheme } from '@/lib/theme';
import { Card, Row, Screen, SectionHeader, Stat, T } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { BarChart } from '@/components/charts';
import { monthlyCollections, feeSummary, sumLast } from '@shared/services/analytics';
import { formatDate, formatINR, formatLakh } from '@shared/utils/format';

export default function Collections() {
  const { state } = useStore();
  const t = roleTheme.staff;
  const fs = useMemo(() => feeSummary(state.students), [state.students]);
  const monthly = useMemo(() => monthlyCollections(state.payments).map((m) => ({ label: m.label, values: [m.Collected] })), [state.payments]);
  return (
    <Screen canvas={t.canvas} header={<BackHeader canvas={t.canvas} title="Fee collection" subtitle="Academic year 2026–27" />}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat label="Collected" value={formatLakh(fs.paid)} icon="check-circle" foot={`of ${formatLakh(fs.total)} annual`} />
        <Stat label="Last 30 days" value={formatLakh(sumLast(state.payments, 30))} icon="trending-up" tone="blue" />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat label="Pending" value={formatLakh(fs.pending)} icon="clock" tone="gold" foot="within grace period" />
        <Stat label="Overdue" value={formatLakh(fs.overdue)} icon="alert-triangle" tone="red" foot={`${fs.byStatus[3].count} students`} />
      </View>
      <Card>
        <T v="h3">Monthly receipts</T>
        <T v="small" style={{ marginBottom: 8 }}>Tap a bar to see the amount</T>
        <BarChart data={monthly} series={[{ name: 'Collected', color: '#177A5B' }]} format={formatLakh} height={200} />
      </Card>
      <SectionHeader title="Recent payments" />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {state.payments.slice(0, 12).map((p, i) => (
          <Row key={p.id} icon="file-text" title={`${formatINR(p.amount)} · ${p.studentName}`} subtitle={`${p.class} · ${p.mode} · ${formatDate(p.date)}`} onPress={() => router.push(`/receipt/${p.id}`)} last={i === 11} />
        ))}
      </Card>
    </Screen>
  );
}
