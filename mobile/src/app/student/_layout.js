import { RoleTabs } from '@/components/nav';

export default function StudentLayout() {
  return (
    <RoleTabs
      role="student"
      tabs={[
        { name: 'index', title: 'Home', icon: 'home' },
        { name: 'timetable', title: 'Timetable', icon: 'clock' },
        { name: 'assignments', title: 'Tasks', icon: 'edit-3' },
        { name: 'results', title: 'Results', icon: 'bar-chart-2' },
        { name: 'more', title: 'More', icon: 'grid' },
      ]}
    />
  );
}
