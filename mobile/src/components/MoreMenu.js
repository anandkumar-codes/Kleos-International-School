import { Alert, Linking, Platform, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Avatar, Card, LargeHeader, Row, Screen, T } from '@/components/ui';
import { SCHOOL } from '@shared/data/school';

/** Settings-style menu used as the "More" tab for each role. */
export default function MoreMenu({ role, sections }) {
  const { session, logout } = useAuth();
  const { resetDemo } = useStore();
  const t = roleTheme[role];
  const signOut = () => {
    const go = () => { logout(); router.replace('/'); };
    if (Platform.OS === 'web') return go();
    Alert.alert('Sign out?', 'You will need to sign in again to access your account.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign out', style: 'destructive', onPress: go }]);
  };
  return (
    <Screen canvas={t.canvas} header={<LargeHeader canvas={t.canvas} title="More" />}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Avatar name={session?.name} size={54} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 17, color: colors.ink900 }}>{session?.name}</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.ink500 }}>{session?.title}</Text>
        </View>
        <View style={{ paddingHorizontal: 10, height: 26, borderRadius: 13, backgroundColor: t.soft, justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 11.5, color: t.accent }}>{t.label}</Text>
        </View>
      </Card>
      {sections.map((s) => (
        <View key={s.title} style={{ gap: 8 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1, color: colors.ink500, marginLeft: 4 }}>{s.title.toUpperCase()}</Text>
          <Card padded={false} style={{ paddingHorizontal: 14 }}>
            {s.items.map(([icon, title, subtitle, href], i) => (
              <Row key={title} icon={icon} iconColor={t.accent} iconBg={t.soft} title={title} subtitle={subtitle} onPress={() => (typeof href === 'function' ? href() : router.push(href))} last={i === s.items.length - 1} />
            ))}
          </Card>
        </View>
      ))}
      <View style={{ gap: 8 }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1, color: colors.ink500, marginLeft: 4 }}>SCHOOL</Text>
        <Card padded={false} style={{ paddingHorizontal: 14 }}>
          <Row icon="phone" iconColor={t.accent} iconBg={t.soft} title="Call school office" subtitle={SCHOOL.phone} onPress={() => Linking.openURL(SCHOOL.phoneHref)} />
          <Row icon="globe" iconColor={t.accent} iconBg={t.soft} title="About Kleos" subtitle="Visitor view of the school" onPress={() => router.push('/guest')} />
          <Row icon="refresh-cw" iconColor={t.accent} iconBg={t.soft} title="Reset demo data" subtitle="Restore the original sample data" onPress={resetDemo} />
          <Row icon="log-out" iconColor={colors.red500} iconBg={colors.red100} title="Sign out" onPress={signOut} chevron={false} last />
        </Card>
      </View>
      <T v="small" style={{ textAlign: 'center' }}>Kleos School app · v1.0.0</T>
    </Screen>
  );
}
