import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore, useMyStudent } from '@/lib/store';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Avatar, IconButton } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { timeAgo } from '@shared/utils/format';

export default function Messages() {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const student = useMyStudent('parent');
  const t = roleTheme.parent;
  const [text, setText] = useState('');
  const scroll = useRef(null);
  const msgs = store.state.portalMessages;
  const send = () => {
    if (!text.trim()) return;
    store.add('portalMessages', { from: 'You', role: 'Parent', body: text.trim(), date: new Date().toISOString(), mine: true }, { prepend: false });
    store.add('messages', { from: student.fatherName, role: `Parent · ${student.name} (${student.class}-${student.section})`, subject: 'Message to class teacher', body: text.trim(), date: new Date().toISOString(), read: false });
    setText('');
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: t.canvas }}>
      <BackHeader canvas={t.canvas} title="Mrs. Jyothi Prasad" subtitle={`Class teacher · ${student.class}-${student.section}`} right={<Avatar name="Jyothi Prasad" size={36} />} />
      <ScrollView ref={scroll} contentContainerStyle={{ padding: 16, gap: 10 }} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
        <Text style={{ alignSelf: 'center', textAlign: 'center', fontFamily: fonts.medium, fontSize: 12, color: colors.ink400, marginBottom: 6 }}>Messages are visible to the class teacher and the school office</Text>
        {msgs.map((m) => (
          <View key={m.id} style={{ alignSelf: m.mine ? 'flex-end' : 'flex-start', maxWidth: '82%', padding: 12, borderRadius: 18, borderBottomRightRadius: m.mine ? 4 : 18, borderBottomLeftRadius: m.mine ? 18 : 4, backgroundColor: m.mine ? t.accent : '#fff', borderWidth: m.mine ? 0 : 1, borderColor: colors.lineCool }}>
            <Text style={{ fontFamily: fonts.regular, fontSize: 14.5, lineHeight: 21, color: m.mine ? '#fff' : colors.ink900 }}>{m.body}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: m.mine ? 'rgba(255,255,255,0.7)' : colors.ink400, marginTop: 4, alignSelf: 'flex-end' }}>{timeAgo(m.date)}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end', paddingHorizontal: 12, paddingTop: 10, paddingBottom: insets.bottom + 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.lineCool }}>
        <TextInput value={text} onChangeText={setText} placeholder="Message the class teacher…" placeholderTextColor={colors.ink400} multiline accessibilityLabel="Message" style={{ flex: 1, minHeight: 44, maxHeight: 120, borderRadius: 22, backgroundColor: colors.canvas, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontFamily: fonts.regular, fontSize: 15, color: colors.ink900 }} />
        <IconButton name="send" label="Send" onPress={send} bg={text.trim() ? t.accent : colors.ink300} color="#fff" size={44} />
      </View>
    </KeyboardAvoidingView>
  );
}
