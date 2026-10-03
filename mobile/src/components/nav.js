import { Pressable, Text, View } from 'react-native';
import { Redirect, Tabs, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { tap } from './ui';

/** Header for pushed (non-tab) screens: back button + title. */
export function BackHeader({ title, subtitle, right, canvas = colors.cream, light }) {
  const insets = useSafeAreaInsets();
  const fg = light ? '#fff' : colors.ink900;
  return (
    <View style={{ paddingTop: insets.top + 6, paddingBottom: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: light ? 'transparent' : canvas }}>
      <Pressable
        accessibilityLabel="Back"
        hitSlop={10}
        onPress={() => { tap(); router.canGoBack() ? router.back() : router.replace('/'); }}
        style={({ pressed }) => ({ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: light ? 'rgba(0,0,0,0.25)' : pressed ? colors.lineCool : 'transparent' })}
      >
        <Feather name="arrow-left" size={22} color={fg} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 17, color: fg }}>{title}</Text>
        {subtitle ? <Text numberOfLines={1} style={{ fontFamily: fonts.medium, fontSize: 12.5, color: light ? 'rgba(255,255,255,.75)' : colors.ink500 }}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

/**
 * Bottom tabs for a role. `tabs`: [{ name, title, icon }]. Guards the role when `requireRole` is set.
 */
export function RoleTabs({ role, tabs, requireRole = true }) {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  if (requireRole && (!session || session.role !== role)) return <Redirect href={`/login?role=${role}`} />;
  const theme = roleTheme[role];
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: colors.ink400,
        tabBarStyle: {
          height: 74 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 10),
          backgroundColor: '#fff',
          borderTopColor: colors.lineCool,
        },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, marginTop: 3 },
        tabBarIconStyle: { height: 28, minHeight: 28, flexGrow: 0 },
        tabBarItemStyle: { paddingVertical: 0 },
        sceneStyle: { backgroundColor: theme.canvas },
      }}
      screenListeners={{ tabPress: () => tap() }}
    >
      {tabs.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarBadge: t.badge || undefined,
            tabBarBadgeStyle: { backgroundColor: colors.red500, fontFamily: fonts.bold, fontSize: 10 },
            tabBarIcon: ({ color, focused }) => (
              <View style={{ width: 44, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? theme.soft : 'transparent' }}>
                <Feather name={t.icon} size={20} color={color} />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
