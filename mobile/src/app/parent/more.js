import MoreMenu from '@/components/MoreMenu';

export default function ParentMore() {
  return (
    <MoreMenu
      role="parent"
      sections={[
        {
          title: 'My child',
          items: [
            ['user', 'Student profile', 'Personal, parent & contact details', '/profile?role=parent'],
            ['clock', 'Timetable', 'Weekly class schedule', '/timetable'],
            ['send', 'Leave requests', 'Apply and track leave', '/leave'],
          ],
        },
        {
          title: 'Stay informed',
          items: [
            ['message-square', 'Messages', 'Chat with the class teacher', '/messages'],
            ['volume-2', 'Announcements', 'Circulars and notices', '/notices'],
            ['calendar', 'Events', 'Upcoming school events', '/events'],
          ],
        },
      ]}
    />
  );
}
