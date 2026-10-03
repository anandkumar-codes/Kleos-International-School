import MoreMenu from '@/components/MoreMenu';

export default function StaffMore() {
  return (
    <MoreMenu
      role="staff"
      sections={[
        {
          title: 'Office',
          items: [
            ['trending-up', 'Fee collection', 'Receipts and monthly revenue', '/collections'],
            ['inbox', 'Messages', 'Parent and staff messages', '/inbox'],
            ['bell', 'Notifications', 'Alerts and activity log', '/notifications'],
          ],
        },
        {
          title: 'Website & communication',
          items: [
            ['edit', 'Post announcement', 'Publish to website and apps', '/compose'],
            ['volume-2', 'Announcements', 'Notice board', '/notices'],
            ['calendar', 'Events', 'School calendar', '/events'],
          ],
        },
      ]}
    />
  );
}
