import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useStore } from '@/lib/store';
import { colors, fonts, shadow } from '@/lib/theme';
import { Button, Card, Row, SectionHeader, T, DateTile, Avatar, tap, cardStyle } from '@/components/ui';
import { facilityIcon } from '@/lib/icons';
import { upcomingEvents, sortedNotices } from '@shared/utils/content';
import { SCHOOL } from '@shared/data/school';
import { timeAgo } from '@shared/utils/format';

const FACTS = [
  ['shield', 'CBSE', 'Affiliated'],
  ['users', '1:24', 'Teacher ratio'],
  ['award', '100%', 'Board results'],
  ['truck', '14', 'Bus routes'],
];

export default function GuestHome() {
  const { state } = useStore();
  const insets = useSafeAreaInsets();
  const [tIdx, setTIdx] = useState(0);
  const { site, programs, facilities, events, announcements, testimonials } = state;
  const t = testimonials[tIdx % testimonials.length];

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Hero */}
        <View style={{ height: 470 + insets.top, backgroundColor: colors.green950 }}>
          <Image source={site.hero.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={500} />
          <LinearGradient colors={['rgba(5,40,30,0.5)', 'rgba(5,40,30,0.35)', 'rgba(5,40,30,0.96)']} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
          <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Image source={require('../../../assets/images/logo.png')} style={{ width: 36, height: 36 }} />
              <Text style={{ fontFamily: fonts.display, fontSize: 18, letterSpacing: 2.5, color: '#fff' }}>KLEOS</Text>
            </View>
            <Pressable onPress={() => { tap(); router.push('/login'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}>
              <Feather name="log-in" size={15} color="#fff" />
              <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: '#fff' }}>Sign in</Text>
            </Pressable>
          </View>
          <View style={{ marginTop: 'auto', paddingHorizontal: 18, paddingBottom: 26 }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12.5, color: colors.gold400, letterSpacing: 0.4 }}>CBSE · Nursery to Grade XII · Miyapur</Text>
            <Text style={{ fontFamily: fonts.display, fontSize: 36, lineHeight: 40, color: '#fff', letterSpacing: -0.6, marginTop: 8 }}>{site.hero.title}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: 'rgba(255,255,255,0.8)', marginTop: 10 }} numberOfLines={3}>{site.hero.subtitle}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <Button title="Apply now" variant="gold" iconRight="arrow-right" onPress={() => router.push('/guest/admissions')} style={{ flex: 1 }} />
              <Button title="Call" variant="glass" icon="phone" onPress={() => Linking.openURL(SCHOOL.phoneHref)} />
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 18, marginTop: -2 }}>
          {/* Fact strip */}
          <View style={[cardStyle, { flexDirection: 'row', marginTop: 16, paddingVertical: 14 }]}>
            {FACTS.map(([icon, v, l], i) => (
              <View key={l} style={{ flex: 1, alignItems: 'center', borderLeftWidth: i ? 1 : 0, borderLeftColor: colors.lineCool }}>
                <Feather name={icon} size={16} color={colors.gold600} />
                <Text style={{ fontFamily: fonts.extrabold, fontSize: 18, color: colors.green800, marginTop: 4 }}>{v}</Text>
                <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.ink500 }}>{l}</Text>
              </View>
            ))}
          </View>

          {/* About */}
          <View style={{ gap: 8 }}>
            <T v="eyebrow">About Kleos</T>
            <Text style={{ fontFamily: fonts.display, fontSize: 25, lineHeight: 30, color: colors.ink900 }}>
              A school that knows every child <Text style={{ fontFamily: fonts.displayItalic, color: colors.green600 }}>by name</Text>
            </Text>
            <T>{site.about.intro}</T>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[['eye', 'Vision', site.about.vision], ['target', 'Mission', site.about.mission]].map(([icon, title, text]) => (
              <Card key={title} style={{ flex: 1, padding: 14 }}>
                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: colors.gold100, alignItems: 'center', justifyContent: 'center' }}><Feather name={icon} size={16} color={colors.gold600} /></View>
                <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.ink900, marginTop: 10 }}>{title}</Text>
                <Text numberOfLines={5} style={{ fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: colors.ink500, marginTop: 4 }}>{text}</Text>
              </Card>
            ))}
          </View>

          {/* Programmes */}
          <SectionHeader title="Academic programmes" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={262} decelerationRate="fast" contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }} style={{ marginHorizontal: -16 }}>
            {programs.map((p) => (
              <View key={p.id} style={[cardStyle, { width: 250, overflow: 'hidden' }]}>
                <Image source={p.image} style={{ height: 130 }} contentFit="cover" transition={300} />
                <View style={{ padding: 14, gap: 4 }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 11, letterSpacing: 0.8, color: p.color }}>{p.ages.toUpperCase()}</Text>
                  <Text style={{ fontFamily: fonts.display, fontSize: 20, color: colors.ink900 }}>{p.stage}</Text>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: colors.ink500 }}>{p.grades}</Text>
                  <Text numberOfLines={3} style={{ fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.ink700, marginTop: 4 }}>{p.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Facilities */}
          <SectionHeader title="Campus & facilities" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {facilities.slice(0, 6).map((f) => (
              <Pressable key={f.id} onPress={() => { tap(); router.push(`/facility/${f.id}`); }} style={({ pressed }) => ({ width: '48.5%', height: 150, borderRadius: 18, overflow: 'hidden', opacity: pressed ? 0.85 : 1, backgroundColor: colors.green100 })}>
                <Image source={f.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
                <LinearGradient colors={['transparent', 'rgba(5,40,30,0.88)']} locations={[0.35, 1]} style={StyleSheet.absoluteFill} />
                <View style={{ marginTop: 'auto', padding: 12 }}>
                  <Feather name={facilityIcon(f.icon)} size={16} color={colors.gold400} />
                  <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: '#fff', marginTop: 4 }}>{f.name}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Events */}
          <SectionHeader title="Upcoming events" action="All" onAction={() => router.push('/events')} />
          <Card padded={false} style={{ paddingHorizontal: 14 }}>
            {upcomingEvents(events).slice(0, 4).map((e, i, arr) => (
              <Row key={e.id} left={<DateTile date={e.date} />} title={e.title} subtitle={`${e.time} · ${e.location}`} onPress={() => router.push(`/event/${e.id}`)} last={i === arr.length - 1} />
            ))}
          </Card>

          {/* Notice board */}
          <LinearGradient colors={[colors.green800, colors.green950]} style={{ borderRadius: 24, padding: 18 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.display, fontSize: 22, color: '#fff' }}>Notice board</Text>
              <Pressable hitSlop={10} onPress={() => router.push('/notices')}><Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.gold400 }}>View all</Text></Pressable>
            </View>
            {sortedNotices(announcements).slice(0, 3).map((n, i) => (
              <View key={n.id} style={{ paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderTopColor: 'rgba(255,255,255,0.1)', marginTop: i ? 0 : 6 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 10.5, letterSpacing: 1, color: colors.gold400 }}>{n.pinned ? 'PINNED · ' : ''}{n.category.toUpperCase()} · {timeAgo(n.date)}</Text>
                <Text style={{ fontFamily: fonts.semibold, fontSize: 14.5, color: '#fff', marginTop: 4 }}>{n.title}</Text>
                <Text numberOfLines={2} style={{ fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: 'rgba(255,255,255,0.62)', marginTop: 2 }}>{n.body}</Text>
              </View>
            ))}
          </LinearGradient>

          {/* Testimonial */}
          <SectionHeader title="What families say" />
          <Card onPress={() => setTIdx((i) => i + 1)} style={{ gap: 12 }}>
            <Feather name="message-circle" size={26} color={colors.gold500} />
            <Text style={{ fontFamily: fonts.displayMedium, fontSize: 17, lineHeight: 25, color: colors.ink900 }}>{t.quote}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Avatar name={t.name} size={38} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.ink900 }}>{t.name}</Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.ink500 }}>{t.role}</Text>
              </View>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: colors.ink400 }}>{(tIdx % testimonials.length) + 1}/{testimonials.length} · tap</Text>
            </View>
          </Card>

          {/* CTA */}
          <LinearGradient colors={[colors.green700, colors.green950]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 24, padding: 20, gap: 10, ...shadow(2) }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 11.5, letterSpacing: 1.6, color: colors.gold400 }}>ADMISSIONS {SCHOOL.admissionYear}</Text>
            <Text style={{ fontFamily: fonts.display, fontSize: 26, lineHeight: 31, color: '#fff' }}>Give your child the Kleos advantage</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: 'rgba(255,255,255,0.75)' }}>{site.admissionsBanner.text}</Text>
            <Button title="Start an enquiry" variant="gold" iconRight="arrow-right" onPress={() => router.push('/guest/admissions')} style={{ marginTop: 6 }} />
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}
