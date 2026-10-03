import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, RefreshControl, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Feather from '@expo/vector-icons/Feather';
import { colors, fonts, radius, shadow, type, tones, statusTone } from '@/lib/theme';
import { initials } from '@shared/utils/format';
import { hashString } from '@shared/utils/random';

export const tap = (style = 'light') => {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(style === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};
export const success = () => Platform.OS !== 'web' && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

/* ---------- Text ---------- */
export function T({ v = 'body', style, children, ...rest }) {
  return <Text style={[type[v], style]} {...rest}>{children}</Text>;
}

/* ---------- Screen scaffolding ---------- */
export function Screen({ children, canvas = colors.cream, header, refresh, contentStyle, scroll = true, padded = true }) {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = refresh
    ? async () => {
        setRefreshing(true);
        await Promise.all([refresh(), new Promise((r) => setTimeout(r, 700))]);
        setRefreshing(false);
      }
    : undefined;
  const body = (
    <View style={[padded && { paddingHorizontal: 16 }, { paddingBottom: 28, gap: 16 }, contentStyle]}>{children}</View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: canvas }}>
      {header}
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ paddingTop: header ? 4 : insets.top + 8 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green700} colors={[colors.green700]} /> : undefined}
        >
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </View>
  );
}

/** Large-title header used at the top of tab screens. */
export function LargeHeader({ title, subtitle, right, canvas = colors.cream }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, paddingBottom: 10, backgroundColor: canvas, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
      <View style={{ flex: 1 }}>
        {subtitle ? <T v="small" style={{ marginBottom: 2 }}>{subtitle}</T> : null}
        <T v="h1" numberOfLines={1}>{title}</T>
      </View>
      {right}
    </View>
  );
}

/* ---------- Cards ---------- */
export function Card({ children, style, onPress, padded = true }) {
  const inner = <View style={[styles.card, padded && { padding: 16 }, style]}>{children}</View>;
  if (!onPress) return inner;
  return (
    <Pressable onPress={() => { tap(); onPress(); }} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.985 : 1 }], opacity: pressed ? 0.94 : 1 }]}>
      {inner}
    </Pressable>
  );
}

export function SectionHeader({ title, action, onAction, style }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }, style]}>
      <T v="h2" style={{ fontSize: 20 }}>{title}</T>
      {action ? (
        <Pressable hitSlop={10} onPress={() => { tap(); onAction?.(); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <T style={{ fontFamily: fonts.bold, fontSize: 13.5, color: colors.green700 }}>{action}</T>
          <Feather name="chevron-right" size={16} color={colors.green700} />
        </Pressable>
      ) : null}
    </View>
  );
}

/* ---------- Buttons ---------- */
const BTN = {
  primary: { bg: colors.green800, fg: '#fff' },
  gold: { bg: colors.gold500, fg: colors.green950 },
  soft: { bg: colors.green50, fg: colors.green800 },
  outline: { bg: 'transparent', fg: colors.green800, border: colors.green200 },
  glass: { bg: 'rgba(255,255,255,0.14)', fg: '#fff', border: 'rgba(255,255,255,0.35)' },
  danger: { bg: colors.red500, fg: '#fff' },
  ghost: { bg: 'transparent', fg: colors.ink700 },
};

export function Button({ title, onPress, variant = 'primary', icon, iconRight, loading, disabled, size = 'md', style, color }) {
  const v = BTN[variant];
  const h = size === 'sm' ? 38 : size === 'lg' ? 54 : 48;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={() => { tap(); onPress?.(); }}
      style={({ pressed }) => [
        { height: h, paddingHorizontal: size === 'sm' ? 14 : 20, borderRadius: radius.full, backgroundColor: color || v.bg, borderWidth: v.border ? 1.5 : 0, borderColor: v.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: disabled ? 0.5 : pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={v.fg} size="small" /> : icon ? <Feather name={icon} size={size === 'sm' ? 16 : 18} color={v.fg} /> : null}
      <Text style={{ color: v.fg, fontFamily: fonts.bold, fontSize: size === 'sm' ? 13.5 : 15 }}>{title}</Text>
      {iconRight && !loading ? <Feather name={iconRight} size={18} color={v.fg} /> : null}
    </Pressable>
  );
}

export function IconButton({ name, onPress, badge, color = colors.ink700, bg = colors.paper, size = 42, label }) {
  return (
    <Pressable accessibilityLabel={label} hitSlop={6} onPress={() => { tap(); onPress?.(); }} style={({ pressed }) => [{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 }, bg === colors.paper && shadow(1)]}>
      <Feather name={name} size={19} color={color} />
      {badge ? (
        <View style={{ position: 'absolute', top: 4, right: 4, minWidth: 17, height: 17, borderRadius: 9, backgroundColor: colors.red500, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: '#fff' }}>
          <Text style={{ color: '#fff', fontSize: 9.5, fontFamily: fonts.bold }}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

/* ---------- Badges, chips ---------- */
export function Badge({ label, tone, dot = true, style }) {
  const [fg, bg] = tones[tone || statusTone[label] || 'gray'];
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: bg, paddingHorizontal: 9, height: 24, borderRadius: 12, alignSelf: 'flex-start' }, style]}>
      {dot ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: fg }} /> : null}
      <Text style={{ color: fg, fontFamily: fonts.semibold, fontSize: 11.5 }}>{label}</Text>
    </View>
  );
}

export function Chips({ options, value, onChange, accent = colors.green800, style }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[{ gap: 8, paddingHorizontal: 16 }, style]} style={{ marginHorizontal: -16, flexGrow: 0 }}>
      {options.map((o) => {
        const id = typeof o === 'string' ? o : o.value;
        const label = typeof o === 'string' ? o : o.label;
        const active = id === value;
        return (
          <Pressable key={id} onPress={() => { tap(); onChange(id); }} style={{ height: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1.5, borderColor: active ? accent : colors.line, backgroundColor: active ? accent : colors.paper, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 13.5, color: active ? '#fff' : colors.ink700 }}>{label}</Text>
            {o.count != null ? <Text style={{ fontFamily: fonts.semibold, fontSize: 11.5, color: active ? 'rgba(255,255,255,.75)' : colors.ink400 }}>{o.count}</Text> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function Segmented({ options, value, onChange, accent = colors.green800 }) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: '#E9EEEC', borderRadius: 14, padding: 4 }}>
      {options.map((o) => {
        const id = typeof o === 'string' ? o : o.value;
        const active = id === value;
        return (
          <Pressable key={id} onPress={() => { tap(); onChange(id); }} style={[{ flex: 1, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, active && { backgroundColor: '#fff', ...shadow(1) }]}>
            <Text style={{ fontFamily: active ? fonts.bold : fonts.semibold, fontSize: 13.5, color: active ? accent : colors.ink500 }}>{typeof o === 'string' ? o : o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- Avatar ---------- */
const AV = ['#0B4D3A', '#177A5B', '#C8323C', '#2D7DD2', '#7F56C8', '#D98A10', '#0E7490', '#9D4E8A', '#4D7C0F'];
export function Avatar({ name = '', size = 40, ring }) {
  const bg = AV[hashString(name) % AV.length];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', borderWidth: ring ? 3 : 0, borderColor: 'rgba(255,255,255,0.4)' }}>
      <Text style={{ color: '#fff', fontFamily: fonts.bold, fontSize: size * 0.36 }}>{initials(name)}</Text>
    </View>
  );
}

/* ---------- List row ---------- */
export function Row({ icon, iconColor = colors.green700, iconBg = colors.green50, left, title, subtitle, right, onPress, last, chevron = !!onPress }) {
  const content = (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }, !last && { borderBottomWidth: 1, borderBottomColor: '#EEF2F0' }]}>
      {left || (icon ? <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center' }}><Feather name={icon} size={18} color={iconColor} /></View> : null)}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontFamily: fonts.semibold, fontSize: 14.5, color: colors.ink900 }}>{title}</Text>
        {subtitle ? <Text numberOfLines={2} style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.ink500, marginTop: 2 }}>{subtitle}</Text> : null}
      </View>
      {right}
      {chevron ? <Feather name="chevron-right" size={18} color={colors.ink300} /> : null}
    </View>
  );
  return onPress ? <Pressable onPress={() => { tap(); onPress(); }} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>{content}</Pressable> : content;
}

export function DateTile({ date, accent = colors.green800, bg = colors.green50 }) {
  const d = new Date(date);
  return (
    <View style={{ width: 48, paddingVertical: 6, borderRadius: 12, backgroundColor: bg, alignItems: 'center' }}>
      <Text style={{ fontFamily: fonts.extrabold, fontSize: 18, color: accent, lineHeight: 20 }}>{String(d.getDate()).padStart(2, '0')}</Text>
      <Text style={{ fontFamily: fonts.bold, fontSize: 10.5, color: accent, opacity: 0.75, letterSpacing: 0.8 }}>{d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}</Text>
    </View>
  );
}

/* ---------- Stats & progress ---------- */
export function Stat({ label, value, icon, tone = 'green', foot, style }) {
  const [fg, bg] = tones[tone];
  return (
    <View style={[styles.card, { padding: 14, flex: 1, minWidth: 0 }, style]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text numberOfLines={1} style={{ fontFamily: fonts.semibold, fontSize: 12.5, color: colors.ink500, flex: 1 }}>{label}</Text>
        {icon ? <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}><Feather name={icon} size={15} color={fg} /></View> : null}
      </View>
      <Text numberOfLines={1} adjustsFontSizeToFit style={{ ...type.number, marginTop: 6 }}>{value}</Text>
      {foot ? <Text numberOfLines={1} style={{ fontFamily: fonts.medium, fontSize: 11.5, color: colors.ink500, marginTop: 2 }}>{foot}</Text> : null}
    </View>
  );
}

export function Progress({ value, color = colors.green600, height = 8, track = '#E7EDEA' }) {
  const w = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(w, { toValue: Math.max(0, Math.min(100, value)), duration: 700, useNativeDriver: false }).start();
  }, [value, w]);
  return (
    <View style={{ height, borderRadius: height, backgroundColor: track, overflow: 'hidden' }}>
      <Animated.View style={{ height, borderRadius: height, backgroundColor: color, width: w.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }} />
    </View>
  );
}

/* ---------- Empty ---------- */
export function Empty({ icon = 'inbox', title, text, action }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 32, paddingHorizontal: 20, gap: 6 }}>
      <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: colors.green50, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
        <Feather name={icon} size={24} color={colors.green600} />
      </View>
      <T v="h3" style={{ textAlign: 'center' }}>{title}</T>
      {text ? <T v="small" style={{ textAlign: 'center' }}>{text}</T> : null}
      {action ? <View style={{ marginTop: 10 }}>{action}</View> : null}
    </View>
  );
}

/* ---------- Form field ---------- */
export function Field({ label, error, hint, required, style, multiline, ...rest }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={[{ gap: 6 }, style]}>
      {label ? <Text style={{ fontFamily: fonts.semibold, fontSize: 13.5, color: colors.ink800 }}>{label}{required ? <Text style={{ color: colors.red500 }}> *</Text> : null}</Text> : null}
      <TextInput
        placeholderTextColor={colors.ink400}
        onFocus={() => setFocus(true)}
        onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
        multiline={multiline}
        style={{
          minHeight: multiline ? 96 : 50, paddingHorizontal: 14, paddingTop: multiline ? 12 : 0, borderRadius: 14, borderWidth: 1.5,
          borderColor: error ? colors.red500 : focus ? colors.green500 : '#DFE5E2', backgroundColor: error ? '#FFFAFA' : '#fff',
          fontFamily: fonts.regular, fontSize: 15.5, color: colors.ink900, textAlignVertical: multiline ? 'top' : 'center',
        }}
        {...rest}
      />
      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Feather name="alert-circle" size={13} color={colors.red600} />
          <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: colors.red600 }}>{error}</Text>
        </View>
      ) : hint ? <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.ink500 }}>{hint}</Text> : null}
    </View>
  );
}

/* ---------- Bottom sheet ---------- */
export function Sheet({ visible, onClose, title, children, footer }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <View style={{ flex: 1, backgroundColor: 'rgba(8,25,20,0.45)' }} />
        </Pressable>
        <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: insets.bottom + 16, maxHeight: '88%' }}>
          <View style={{ alignItems: 'center', paddingTop: 10 }}><View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: colors.ink300 }} /></View>
          {title ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 6 }}>
              <T v="h2">{title}</T>
              <IconButton name="x" onPress={onClose} bg={colors.canvas} size={36} label="Close" />
            </View>
          ) : null}
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, gap: 14 }} keyboardShouldPersistTaps="handled">{children}</ScrollView>
          {footer ? <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>{footer}</View> : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ---------- Gradient hero card ---------- */
export function HeroCard({ colorsFrom = [colors.green700, colors.green950], children, style }) {
  return (
    <LinearGradient colors={colorsFrom} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[{ borderRadius: radius.xl, padding: 20, overflow: 'hidden' }, style]}>
      <View style={{ position: 'absolute', right: -50, top: -60, width: 200, height: 200, borderRadius: 100, borderWidth: 34, borderColor: 'rgba(255,255,255,0.06)' }} />
      {children}
    </LinearGradient>
  );
}

/* ---------- Toasts ---------- */
const ToastCtx = createContext(() => {});
export function ToastProvider({ children }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState(null);
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef();
  const show = useCallback((title, { text, tone = 'success' } = {}) => {
    clearTimeout(timer.current);
    setToast({ title, text, tone });
    if (tone === 'success') success();
    Animated.spring(anim, { toValue: 1, useNativeDriver: true }).start();
    timer.current = setTimeout(() => Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setToast(null)), 3000);
  }, [anim]);
  const icon = { success: ['check-circle', '#6FE0B1'], error: ['alert-circle', '#FF8D94'], info: ['info', colors.gold400] };
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {toast ? (
        <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 16, right: 16, top: insets.top + 8, opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }}>
          <View style={{ flexDirection: 'row', gap: 12, padding: 14, borderRadius: 18, backgroundColor: colors.ink900, ...shadow(2) }}>
            <Feather name={icon[toast.tone][0]} size={20} color={icon[toast.tone][1]} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontFamily: fonts.bold, fontSize: 14 }}>{toast.title}</Text>
              {toast.text ? <Text style={{ color: 'rgba(255,255,255,0.72)', fontFamily: fonts.regular, fontSize: 13, marginTop: 2 }}>{toast.text}</Text> : null}
            </View>
          </View>
        </Animated.View>
      ) : null}
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.paper, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.lineCool, ...shadow(1) },
});
export const cardStyle = styles.card;
