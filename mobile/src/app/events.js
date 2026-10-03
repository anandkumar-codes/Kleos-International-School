import { useState } from 'react';
import { View } from 'react-native';
import { colors } from '@/lib/theme';
import { Screen, Segmented } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { EventsList } from '@/screens/portal';

export default function Events() {
  const [tab, setTab] = useState('upcoming');
  return (
    <Screen header={<BackHeader title="Events" subtitle="School calendar 2026–27" />}>
      <Segmented value={tab} onChange={setTab} options={[{ value: 'upcoming', label: 'Upcoming' }, { value: 'past', label: 'Past' }]} />
      <View style={{ backgroundColor: colors.cream }}>
        <EventsList past={tab === 'past'} />
      </View>
    </Screen>
  );
}
