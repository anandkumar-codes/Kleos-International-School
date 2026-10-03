import { Screen } from '@/components/ui';
import { BackHeader } from '@/components/nav';
import { NoticesList } from '@/screens/portal';

export default function Notices() {
  return (
    <Screen header={<BackHeader title="Announcements" subtitle="Circulars from the school office" />}>
      <NoticesList />
    </Screen>
  );
}
