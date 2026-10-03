import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Feather from '@expo/vector-icons/Feather';
import { useStore } from '@/lib/store';
import { colors, fonts } from '@/lib/theme';
import { Card, Empty, T } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { facilityIcon } from '@/lib/icons';

export default function FacilityDetail() {
  const { id } = useLocalSearchParams();
  const { state } = useStore();
  const f = state.facilities.find((x) => x.id === id);
  if (!f) return <View style={{ flex: 1, backgroundColor: colors.cream }}><BackHeader title="Facility" /><Empty title="Not found" /></View>;
  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ height: 320, backgroundColor: colors.green900 }}>
          <Image source={f.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
          <LinearGradient colors={['rgba(5,40,30,0.5)', 'transparent', 'rgba(5,40,30,0.92)']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
          <BackHeader title="" light />
          <View style={{ marginTop: 'auto', padding: 18 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.gold500, alignItems: 'center', justifyContent: 'center' }}><Feather name={facilityIcon(f.icon)} size={22} color={colors.green950} /></View>
            <Text style={{ fontFamily: fonts.display, fontSize: 30, color: '#fff', marginTop: 12 }}>{f.name}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.gold400, marginTop: 4 }}>{f.short}</Text>
          </View>
        </View>
        <View style={{ padding: 16, gap: 14 }}>
          <T style={{ fontSize: 16, lineHeight: 25 }}>{f.description}</T>
          <Card style={{ gap: 12 }}>
            <T v="h3">Key features</T>
            {(f.features || []).map((x) => (
              <View key={x} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.green100, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}><Feather name="check" size={13} color={colors.green700} /></View>
                <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14.5, color: colors.ink800, lineHeight: 21 }}>{x}</Text>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
