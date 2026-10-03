import { RoleTabs } from '@/components/nav';

export default function ParentLayout() {
  return (
    <RoleTabs
      role="parent"
      tabs={[
        { name: 'index', title: 'Home', icon: 'home' },
        { name: 'attendance', title: 'Attendance', icon: 'calendar' },
        { name: 'academics', title: 'Academics', icon: 'book-open' },
        { name: 'fees', title: 'Fees', icon: 'credit-card' },
        { name: 'more', title: 'More', icon: 'grid' },
      ]}
    />
  );
}
