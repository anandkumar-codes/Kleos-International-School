import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useStore } from '@/lib/store';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Button, Card, Chips, Field, Screen, T, tap, useToast } from '@/components/ui';
import { BackHeader } from '@/components/nav';

const CATS = ['General', 'Admissions', 'Holiday', 'Examination', 'Parents', 'Achievement'];

export default function Compose() {
  const store = useStore();
  const toast = useToast();
  const t = roleTheme.staff;
  const [v, setV] = useState({ title: '', body: '', category: 'General', pinned: false });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const publish = () => {
    const e = {};
    if (v.title.trim().length < 5) e.title = 'Headline must be at least 5 characters';
    if (v.body.trim().length < 10) e.body = 'Message must be at least 10 characters';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    setTimeout(() => {
      store.add('announcements', { ...v, title: v.title.trim(), body: v.body.trim(), date: new Date().toISOString().slice(0, 10) });
      store.log('announcement', `Announcement published: ${v.title.trim()}`);
      toast('Announcement published', { text: 'Live on the notice board and in parent & student apps.' });
      router.back();
    }, 500);
  };

  return (
    <Screen canvas={t.canvas} header={<BackHeader canvas={t.canvas} title="New announcement" subtitle="Notice board · website & apps" />}>
      <Card style={{ gap: 16 }}>
        <Field label="Headline" required value={v.title} onChangeText={(x) => setV({ ...v, title: x })} error={errors.title} placeholder="e.g. Sports Day rehearsal schedule" />
        <View style={{ gap: 8 }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 13.5, color: colors.ink800 }}>Category</Text>
          <Chips accent={t.accent} value={v.category} onChange={(c) => setV({ ...v, category: c })} options={CATS} />
        </View>
        <Field label="Message" required value={v.body} onChangeText={(x) => setV({ ...v, body: x })} error={errors.body} placeholder="Write the circular…" multiline />
        <Pressable onPress={() => { tap(); setV({ ...v, pinned: !v.pinned }); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }} accessibilityRole="switch" accessibilityState={{ checked: v.pinned }}>
          <View style={{ width: 46, height: 28, borderRadius: 14, padding: 3, backgroundColor: v.pinned ? colors.green600 : colors.ink300, alignItems: v.pinned ? 'flex-end' : 'flex-start' }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14.5, color: colors.ink900 }}>Pin to top</Text>
            <T v="small">Keeps it first on the notice board</T>
          </View>
          <Feather name="bookmark" size={18} color={v.pinned ? colors.green600 : colors.ink300} />
        </Pressable>
      </Card>
      <Button title="Publish announcement" icon="send" size="lg" loading={busy} onPress={publish} color={t.accent} />
      <T v="small" style={{ textAlign: 'center' }}>Published notices appear on the school website and in every family&apos;s app.</T>
    </Screen>
  );
}
