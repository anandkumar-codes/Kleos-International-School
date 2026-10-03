import { Share, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useStore } from '@/lib/store';
import { colors, fonts } from '@/lib/theme';
import { Badge, Button, Card, Empty, Screen } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { formatDate, formatINR } from '@shared/utils/format';
import { SCHOOL, fullAddress } from '@shared/data/school';

export default function Receipt() {
  const { id } = useLocalSearchParams();
  const { state } = useStore();
  const p = state.payments.find((x) => x.id === id);
  if (!p) return <Screen header={<BackHeader title="Receipt" />}><Empty icon="file-text" title="Receipt not found" /></Screen>;
  const rows = [['Receipt no.', p.receiptNo], ['Date', formatDate(p.date, { day: 'numeric', month: 'long', year: 'numeric' })], ['Student', p.studentName], ['Student ID', p.studentId], ['Class', p.class], ['Towards', `Tuition fee · ${p.term}`], ['Payment mode', p.mode], ['Academic year', '2026–27']];
  const share = () => Share.share({ message: `${SCHOOL.name}\nFee receipt ${p.receiptNo}\n${p.studentName} (${p.class})\nAmount: ${formatINR(p.amount)} via ${p.mode}\nDate: ${formatDate(p.date)}` }).catch(() => {});
  return (
    <Screen header={<BackHeader title="Fee receipt" subtitle={p.receiptNo} />}>
      <Card style={{ gap: 0, paddingTop: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 14, borderBottomWidth: 2, borderBottomColor: colors.green800 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.display, fontSize: 19, color: colors.green800 }}>{SCHOOL.name}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.ink500, marginTop: 2 }}>{fullAddress}</Text>
          </View>
          <Badge label="Paid" />
        </View>
        {rows.map(([k, v]) => (
          <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEF2F0', gap: 16 }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 13.5, color: colors.ink500 }}>{k}</Text>
            <Text style={{ flex: 1, textAlign: 'right', fontFamily: fonts.semibold, fontSize: 14, color: colors.ink900 }}>{v}</Text>
          </View>
        ))}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderRadius: 14, backgroundColor: colors.green50, marginTop: 14 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.green800 }}>Amount received</Text>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 17, color: colors.green800 }}>{formatINR(p.amount)}</Text>
        </View>
        <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.ink400, marginTop: 12 }}>Computer-generated receipt; no signature required.</Text>
      </Card>
      <Button title="Share receipt" icon="share-2" variant="outline" onPress={share} />
    </Screen>
  );
}
