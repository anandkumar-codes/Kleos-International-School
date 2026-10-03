import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { colors, fonts } from '@/lib/theme';
import { tap, cardStyle } from '@/components/ui';

export default function QuickActions({ items, accent = colors.green700, soft = colors.green50 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {items.map(([icon, label, href]) => (
        <Pressable key={label} onPress={() => { tap(); router.push(href); }} style={({ pressed }) => [cardStyle, { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 6, opacity: pressed ? 0.7 : 1 }]}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: soft, alignItems: 'center', justifyContent: 'center' }}><Feather name={icon} size={18} color={accent} /></View>
          <Text numberOfLines={1} style={{ fontFamily: fonts.semibold, fontSize: 11.5, color: colors.ink800 }}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
