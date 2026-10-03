import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useStore } from '@/lib/store';
import { colors, fonts } from '@/lib/theme';
import { Badge, Card, Empty, T } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { formatDate } from '@shared/utils/format';

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const { state } = useStore();
  const insets = useSafeAreaInsets();
  const e = state.events.find((x) => x.id === id);
  if (!e) return <View style={{ flex: 1, backgroundColor: colors.cream }}><BackHeader title="Event" /><Empty icon="calendar" title="Event not found" text="It may have been removed by the school." /></View>;
  const past = new Date(e.date) < new Date(new Date().toDateString());
  const days = Math.ceil((new Date(e.date) - new Date(new Date().toDateString())) / 864e5);
  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}>
        <View style={{ height: 300, backgroundColor: colors.green900 }}>
          <Image source={e.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
          <LinearGradient colors={['rgba(5,40,30,0.55)', 'transparent', 'rgba(5,40,30,0.9)']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
          <BackHeader title="" light />
          <View style={{ marginTop: 'auto', padding: 18, gap: 8 }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Badge label={e.category} tone="gold" dot={false} />
              <Badge label={past ? 'Completed' : days === 0 ? 'Today' : `In ${days} day${days > 1 ? 's' : ''}`} tone={past ? 'gray' : 'green'} />
            </View>
            <Text style={{ fontFamily: fonts.display, fontSize: 27, lineHeight: 32, color: '#fff' }}>{e.title}</Text>
          </View>
        </View>
        <View style={{ padding: 16, gap: 14 }}>
          <Card style={{ gap: 14 }}>
            {[['calendar', 'Date', formatDate(e.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })], ['clock', 'Time', e.time], ['map-pin', 'Venue', e.location]].map(([icon, l, v]) => (
              <View key={l} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: colors.green50, alignItems: 'center', justifyContent: 'center' }}><Feather name={icon} size={18} color={colors.green700} /></View>
                <View><T v="tiny">{l.toUpperCase()}</T><Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.ink900 }}>{v}</Text></View>
              </View>
            ))}
          </Card>
          <T style={{ fontSize: 16, lineHeight: 25 }}>{e.description}</T>
        </View>
      </ScrollView>
    </View>
  );
}
