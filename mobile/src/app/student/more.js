import MoreMenu from '@/components/MoreMenu';

export default function StudentMore() {
  return (
    <MoreMenu
      role="student"
      sections={[
        {
          title: 'My school',
          items: [
            ['book', 'Subjects', 'Teachers and half-yearly scores', '/subjects'],
            ['calendar', 'Attendance', 'Monthly calendar', '/my-attendance'],
            ['user', 'Profile', 'My details', '/profile?role=student'],
          ],
        },
        {
          title: 'Stay informed',
          items: [
            ['volume-2', 'Announcements', 'Circulars and notices', '/notices'],
            ['award', 'Events', 'Upcoming school events', '/events'],
          ],
        },
      ]}
    />
  );
}
