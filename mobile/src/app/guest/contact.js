import { Linking, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { colors, fonts, shadow } from '@/lib/theme';
import { Card, LargeHeader, Row, Screen, T, tap, Button } from '@/components/ui';
import { SCHOOL, fullAddress } from '@shared/data/school';

const whatsapp = `https://wa.me/${SCHOOL.phoneHref.replace(/\D/g, '')}?text=${encodeURIComponent('Hello Kleos International School, I would like to know about admissions.')}`;

export default function Contact() {
  const actions = [
    ['phone', 'Call', () => Linking.openURL(SCHOOL.phoneHref), colors.green700, colors.green50],
    ['message-circle', 'WhatsApp', () => Linking.openURL(whatsapp), '#128C4A', '#E3F6EA'],
    ['mail', 'Email', () => Linking.openURL(`mailto:${SCHOOL.email}`), colors.blue600, colors.blue100],
    ['navigation', 'Directions', () => Linking.openURL(SCHOOL.mapLink), colors.gold600, colors.gold100],
  ];
  return (
    <Screen header={<LargeHeader title="Contact" subtitle="We'd love to hear from you" />}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {actions.map(([icon, label, fn, fg, bg]) => (
          <Pressable key={label} onPress={() => { tap(); fn(); }} style={({ pressed }) => ({ flex: 1, alignItems: 'center', gap: 8, paddingVertical: 14, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineCool, opacity: pressed ? 0.7 : 1, ...shadow(1) })}>
            <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name={icon} size={19} color={fg} />
            </View>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: colors.ink800 }}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        <Row icon="map-pin" title="Address" subtitle={fullAddress} onPress={() => Linking.openURL(SCHOOL.mapLink)} />
        <Row icon="phone" title={SCHOOL.phone} subtitle="School office" onPress={() => Linking.openURL(SCHOOL.phoneHref)} />
        <Row icon="mail" title={SCHOOL.email} subtitle={`Admissions: ${SCHOOL.admissionsEmail}`} onPress={() => Linking.openURL(`mailto:${SCHOOL.email}`)} />
        <Row icon="alert-triangle" iconColor={colors.red500} iconBg={colors.red100} title={SCHOOL.emergencyPhone} subtitle="Emergency contact (24×7)" onPress={() => Linking.openURL(`tel:${SCHOOL.emergencyPhone.replace(/\s/g, '')}`)} last />
      </Card>

      <Card style={{ gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Feather name="clock" size={17} color={colors.green600} />
          <T v="h3">Office timings</T>
        </View>
        {SCHOOL.hours.map((h, i) => (
          <View key={h.day} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: i ? 1 : 0, borderTopColor: '#EEF2F0' }}>
            <T>{h.day}</T>
            <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: h.time === 'Closed' ? colors.red600 : colors.ink900 }}>{h.time}</Text>
          </View>
        ))}
      </Card>

      <Card style={{ gap: 10, backgroundColor: colors.green50, borderColor: colors.green200 }}>
        <T v="h3">Visit the campus</T>
        <T>Campus tours run every Saturday at 9:30 AM, 11:00 AM and 12:30 PM, about 2 km from Miyapur Metro Station.</T>
        <Button title="Book a visit" icon="calendar" onPress={() => router.push('/guest/admissions')} />
      </Card>
    </Screen>
  );
}
