import { useState } from 'react';
import { Text, View } from 'react-native';
import { useStore } from '@/lib/store';
import { colors, fonts, roleTheme } from '@/lib/theme';
import { Avatar, Button, Card, Empty, Field, Row, Screen, Segmented, Sheet, T, useToast } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { timeAgo, formatDate } from '@shared/utils/format';

export default function Inbox() {
  const store = useStore();
  const toast = useToast();
  const t = roleTheme.staff;
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [reply, setReply] = useState('');
  const msgs = store.state.messages;
  const list = msgs.filter((m) => filter === 'all' || !m.read);
  const open = msgs.find((m) => m.id === openId);
  const view = (m) => { setOpenId(m.id); if (!m.read) store.patch('messages', m.id, { read: true }); };

  return (
    <Screen canvas={t.canvas} header={<BackHeader canvas={t.canvas} title="Messages" subtitle={`${msgs.filter((m) => !m.read).length} unread`} />}>
      <Segmented accent={t.accent} value={filter} onChange={setFilter} options={[{ value: 'all', label: `All · ${msgs.length}` }, { value: 'unread', label: `Unread · ${msgs.filter((m) => !m.read).length}` }]} />
      <Card padded={false} style={{ paddingHorizontal: 14 }}>
        {list.map((m, i) => (
          <Row
            key={m.id}
            left={<View><Avatar name={m.from} size={40} />{!m.read ? <View style={{ position: 'absolute', right: -1, top: -1, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.green500, borderWidth: 2, borderColor: '#fff' }} /> : null}</View>}
            title={`${m.from} · ${m.subject}`}
            subtitle={`${m.body}`}
            right={<Text style={{ fontFamily: fonts.medium, fontSize: 11.5, color: colors.ink400 }}>{timeAgo(m.date)}</Text>}
            onPress={() => view(m)}
            chevron={false}
            last={i === list.length - 1}
          />
        ))}
        {!list.length ? <Empty icon="inbox" title="Inbox zero" text="No unread messages." /> : null}
      </Card>

      <Sheet visible={!!open} onClose={() => { setOpenId(null); setReply(''); }} title={open?.subject}
        footer={<Button title="Send reply" icon="send" size="lg" disabled={!reply.trim()} onPress={() => { toast('Reply sent', { text: `Delivered to ${open.from}` }); setOpenId(null); setReply(''); }} />}>
        {open ? (
          <>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Avatar name={open.from} size={44} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.ink900 }}>{open.from}</Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.ink500 }}>{open.role}</Text>
              </View>
            </View>
            <View style={{ padding: 14, borderRadius: 16, backgroundColor: colors.canvas }}>
              <T style={{ color: colors.ink900 }}>{open.body}</T>
              <Text style={{ fontFamily: fonts.medium, fontSize: 11.5, color: colors.ink400, marginTop: 8 }}>{formatDate(open.date, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            <Field label="Reply" value={reply} onChangeText={setReply} placeholder={`Reply to ${open.from}…`} multiline />
          </>
        ) : null}
      </Sheet>
    </Screen>
  );
}
