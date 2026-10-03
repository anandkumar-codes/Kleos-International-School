import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '@/lib/auth';
import { colors, fonts } from '@/lib/theme';
import { tap } from '@/components/ui';
import { IMG, SCHOOL } from '@shared/data/school';

const ROLES = [
  { role: 'parent', icon: 'users', title: "I'm a parent", text: 'Attendance, homework, fees & messages' },
  { role: 'student', icon: 'book-open', title: "I'm a student", text: 'Timetable, assignments & results' },
  { role: 'staff', icon: 'shield', title: 'School staff', text: 'Dashboard, admissions & attendance' },
];

export default function Welcome() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, [fade]);

  if (session) return <Redirect href={`/${session.role}`} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.green950 }}>
      <StatusBar style="light" />
      <Image source={IMG.hero} style={StyleSheet.absoluteFill} contentFit="cover" transition={600} />
      <LinearGradient colors={['rgba(5,40,30,0.55)', 'rgba(5,40,30,0.82)', colors.green950]} locations={[0, 0.45, 0.8]} style={StyleSheet.absoluteFill} />

      <Animated.View style={{ flex: 1, paddingTop: insets.top + 24, paddingHorizontal: 22, paddingBottom: insets.bottom + 18, opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Image source={require('../../assets/images/logo.png')} style={{ width: 46, height: 46 }} />
          <View>
            <Text style={{ fontFamily: fonts.display, fontSize: 22, letterSpacing: 3, color: '#fff' }}>KLEOS</Text>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 10.5, letterSpacing: 1.4, color: 'rgba(255,255,255,0.65)' }}>INTERNATIONAL SCHOOL · CBSE</Text>
          </View>
        </View>

        <View style={{ marginTop: 'auto' }}>
          <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 5, paddingRight: 12, paddingVertical: 5, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
            <View style={{ backgroundColor: colors.gold500, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.green950 }}>{SCHOOL.admissionYear}</Text>
            </View>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12.5, color: '#fff' }}>Admissions open</Text>
          </View>
          <Text style={{ fontFamily: fonts.display, fontSize: 40, lineHeight: 44, color: '#fff', letterSpacing: -0.8, marginTop: 16 }}>
            Where Curiosity{'\n'}
            <Text style={{ fontFamily: fonts.displayItalic, color: colors.gold400 }}>Meets Excellence</Text>
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 15.5, lineHeight: 23, color: 'rgba(255,255,255,0.78)', marginTop: 12 }}>
            The official app of Kleos International School, Miyapur — for families, students and staff.
          </Text>

          <View style={{ gap: 10, marginTop: 26 }}>
            {ROLES.map((r) => (
              <Pressable
                key={r.role}
                onPress={() => { tap(); router.push(`/login?role=${r.role}`); }}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 20, backgroundColor: pressed ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)' })}
              >
                <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(232,165,59,0.18)', alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name={r.icon} size={20} color={colors.gold400} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 15.5, color: '#fff' }}>{r.title}</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: 'rgba(255,255,255,0.65)', marginTop: 1 }}>{r.text}</Text>
                </View>
                <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
              </Pressable>
            ))}
          </View>

          <Pressable onPress={() => { tap(); router.push('/guest'); }} style={({ pressed }) => ({ marginTop: 14, height: 52, borderRadius: 26, backgroundColor: pressed ? colors.gold400 : colors.gold500, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 })}>
            <Feather name="compass" size={18} color={colors.green950} />
            <Text style={{ fontFamily: fonts.bold, fontSize: 15.5, color: colors.green950 }}>Explore the school</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
